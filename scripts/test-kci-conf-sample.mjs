// content/publications.json의 국내 conference 샘플 5건이 KCI 논문정보서비스
// (openApiM310List)에 실제로 등록돼 있는지 판별용으로 조회한다.
// 읽기 전용 스크립트 — content/publications.json은 절대 수정하지 않는다.
// CSV 저장 없음, 결과는 콘솔 표로만 출력한다.
//
// serviceKey는 process.env.KCI_KEY에서만 읽는다 (하드코딩·로그 출력 금지).
// 실행: KCI_KEY='<발급키>' node scripts/test-kci-conf-sample.mjs

import fs from "node:fs";
import path from "node:path";

const KCI_KEY = process.env.KCI_KEY;
if (!KCI_KEY) {
  console.error("KCI_KEY 환경변수가 설정되지 않았습니다.");
  process.exit(1);
}

const ENDPOINT = "https://apis.data.go.kr/B552540/KCIOpenApi/artiInfo/openApiM310List";
const REQUEST_TIMEOUT_MS = 90000;
const ITEM_DELAY_MS = 1000;
const RETRY_DELAY_MS = 2500;
const MAX_RETRIES = 2;

const TARGET_IDS = [
  "pub-conf-003",
  "pub-conf-001",
  "pub-conf-068",
  "pub-conf-026",
  "pub-conf-053",
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanText(raw) {
  if (!raw) return "";
  let s = raw.trim();
  const cdata = s.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  if (cdata) s = cdata[1];
  s = s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
  return s.trim();
}

function extractTag(xml, tag) {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = xml.match(re);
  return m ? cleanText(m[1]) : "";
}

function extractFirstItem(xml) {
  const m = xml.match(/<item>([\s\S]*?)<\/item>/i);
  return m ? m[1] : null;
}

async function fetchOnce(title) {
  const url = `${ENDPOINT}?serviceKey=${KCI_KEY}&artiNm=${encodeURIComponent(title)}&pageNo=1&recordCnt=1`;
  const res = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  const text = await res.text();
  return { status: res.status, text };
}

async function fetchWithRetry(title) {
  let lastError = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { text } = await fetchOnce(title);
      if (/<OpenAPI_ServiceResponse>/.test(text)) {
        const errMsg = extractTag(text, "errMsg") || "GATEWAY_ERROR";
        lastError = new Error(errMsg);
        if (attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAY_MS);
          continue;
        }
        return { ok: false, reason: "timeout", errMsg };
      }
      return { ok: true, text };
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }
    }
  }
  return { ok: false, reason: "timeout", errMsg: lastError?.message ?? "unknown" };
}

async function main() {
  const pubsPath = path.join(process.cwd(), "content/publications.json");
  const pubs = JSON.parse(fs.readFileSync(pubsPath, "utf8"));

  const targets = TARGET_IDS.map((id) => pubs.find((p) => p.id === id)).filter(Boolean);

  const results = [];

  for (let i = 0; i < targets.length; i++) {
    const pub = targets[i];
    console.log(`[${i + 1}/${targets.length}] ${pub.id} 조회 중...`);
    const result = await fetchWithRetry(pub.title);

    let row;
    if (!result.ok) {
      row = {
        id: pub.id,
        title: pub.title,
        totalCount: "실패",
        hasDoi: "-",
        hasUci: "-",
        hasUrl: "-",
        matchedTitle: `(조회 실패: ${result.errMsg ?? ""})`,
      };
    } else {
      const resultCode = extractTag(result.text, "resultCode");
      const resultMsg = extractTag(result.text, "resultMsg");
      const totalCount = extractTag(result.text, "totalCount");

      if (resultCode && resultCode !== "00") {
        row = {
          id: pub.id,
          title: pub.title,
          totalCount: "API오류",
          hasDoi: "-",
          hasUci: "-",
          hasUrl: "-",
          matchedTitle: `(${resultCode} ${resultMsg})`,
        };
      } else {
        const itemXml = extractFirstItem(result.text);
        if (!itemXml) {
          row = {
            id: pub.id,
            title: pub.title,
            totalCount: totalCount || "0",
            hasDoi: "N",
            hasUci: "N",
            hasUrl: "N",
            matchedTitle: "(결과 없음)",
          };
        } else {
          const korTitle = extractTag(itemXml, "ARTI_KOR_TITL");
          const engTitle = extractTag(itemXml, "ARTI_ENG_TITL") || extractTag(itemXml, "ARTI_FOLA_TITL");
          const doi = extractTag(itemXml, "DOI");
          const uci = extractTag(itemXml, "UCI");
          const url = extractTag(itemXml, "URL");

          row = {
            id: pub.id,
            title: pub.title,
            totalCount: totalCount || "",
            hasDoi: doi ? "Y" : "N",
            hasUci: uci ? "Y" : "N",
            hasUrl: url ? "Y" : "N",
            matchedTitle: korTitle || engTitle || "(제목 없음)",
          };
        }
      }
    }

    results.push(row);

    if (i < targets.length - 1) {
      await sleep(ITEM_DELAY_MS);
    }
  }

  console.log("\n=== 국내 conference KCI 등록 여부 판별 결과 ===\n");
  console.log("id | title | totalCount | DOI | UCI | URL | matched_title");
  console.log("---|---|---|---|---|---|---");
  results.forEach((r) => {
    console.log(
      `${r.id} | ${r.title} | ${r.totalCount} | ${r.hasDoi} | ${r.hasUci} | ${r.hasUrl} | ${r.matchedTitle}`
    );
  });

  const hitCount = results.filter(
    (r) => r.hasDoi === "Y" || r.hasUci === "Y" || r.hasUrl === "Y"
  ).length;

  console.log(`\n5건 중 KCI에 잡힌 건수(DOI/UCI/URL 중 하나라도 있음): ${hitCount}`);
  if (hitCount >= 3) {
    console.log("=> 3건 이상 잡힘: 국내 79건 전체로 확대할 가치 있음.");
  } else {
    console.log("=> 2건 이하: 국내는 KCI로도 사실상 커버 안 됨. 비워두는 것을 권장.");
  }
}

main();
