// content/publications.json의 journal 항목 중 한글 제목 + doi 미보유 건만
// KCI 논문정보서비스(openApiM310List)로 조회해 DOI/URL/UCI 후보를 뽑아
// scripts/kci-candidates.csv로 저장한다.
// 읽기 전용 스크립트 — content/publications.json은 절대 수정하지 않는다.
//
// serviceKey는 process.env.KCI_KEY에서만 읽는다 (하드코딩·파일저장 금지).
// 실행: KCI_KEY='<Encoding 키>' node scripts/fetch-kci-candidates.mjs

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
const MAX_RETRIES = 2; // 최초 시도 + 최대 2회 재시도 = 총 3회 시도

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hasHangul(str) {
  return /[가-힣]/.test(str || "");
}

// ---------- 정규화 / 유사도 ----------

function normalizeLoose(str) {
  // 공백·특수문자 완전 제거 (KCI의 SEAR_* 필드와 같은 형태) — 관대한 매칭용
  return (str || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");
}

function tokenize(str) {
  const normalized = (str || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  return new Set(normalized.split(" ").filter(Boolean));
}

function jaccardSimilarity(a, b) {
  const ta = tokenize(a);
  const tb = tokenize(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let intersection = 0;
  for (const t of ta) {
    if (tb.has(t)) intersection++;
  }
  const union = new Set([...ta, ...tb]).size;
  return union === 0 ? 0 : intersection / union;
}

function bestSimilarity(originalTitle, candidateKor, candidateEng) {
  const scores = [];
  if (candidateKor) scores.push(jaccardSimilarity(originalTitle, candidateKor));
  if (candidateEng) scores.push(jaccardSimilarity(originalTitle, candidateEng));
  // 공백 제거형 완전일치 보너스 (KCI의 SEAR_* 스타일 관대한 매칭)
  if (
    candidateKor &&
    normalizeLoose(originalTitle) === normalizeLoose(candidateKor) &&
    normalizeLoose(originalTitle).length > 0
  ) {
    scores.push(1);
  }
  return scores.length > 0 ? Math.max(...scores) : 0;
}

// ---------- 매우 단순한 XML 태그 추출 (의존성 없음) ----------

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

// ---------- CSV ----------

function csvEscape(value) {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsvRow(fields) {
  return fields.map(csvEscape).join(",");
}

const CSV_HEADERS = [
  "id",
  "original_title",
  "original_authors",
  "original_year",
  "kci_doi",
  "kci_uci",
  "kci_url",
  "kci_matched_title",
  "totalCount",
  "title_similarity",
  "suggested_link",
  "note",
  "confirmed",
];

// ---------- KCI 요청 (재시도 포함) ----------

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

      // 게이트웨이 레벨 오류(OpenAPI_ServiceResponse) — 타임아웃류로 취급, 재시도 대상
      if (/<OpenAPI_ServiceResponse>/.test(text)) {
        const errMsg = extractTag(text, "errMsg") || "GATEWAY_ERROR";
        lastError = new Error(errMsg);
        if (attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAY_MS);
          continue;
        }
        return { ok: false, reason: "timeout", text, errMsg };
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

// ---------- 메인 ----------

function appendCsvRow(csvPath, fields) {
  fs.appendFileSync(csvPath, toCsvRow(fields) + "\r\n", "utf8");
}

async function main() {
  const pubsPath = path.join(process.cwd(), "content/publications.json");
  const csvPath = path.join(process.cwd(), "scripts/kci-candidates.csv");

  const pubs = JSON.parse(fs.readFileSync(pubsPath, "utf8"));
  const targets = pubs.filter(
    (p) => p.type === "journal" && hasHangul(p.title) && !p.doi
  );

  console.log(`대상 건수: ${targets.length}`);

  // 매 항목 처리 직후 append하므로, 헤더를 먼저 BOM과 함께 써둔다.
  const BOM = "﻿";
  fs.writeFileSync(csvPath, BOM + toCsvRow(CSV_HEADERS) + "\r\n", "utf8");

  const stats = { doiFound: 0, urlOnly: 0, uciOnly: 0, failed: 0, noResult: 0 };
  const rowsForSummary = [];

  for (let i = 0; i < targets.length; i++) {
    const pub = targets[i];
    const result = await fetchWithRetry(pub.title);

    let row;
    let statusLabel;

    if (!result.ok) {
      stats.failed++;
      statusLabel = "실패";
      row = {
        id: pub.id,
        original_title: pub.title,
        original_authors: pub.authors,
        original_year: pub.year,
        kci_doi: "",
        kci_uci: "",
        kci_url: "",
        kci_matched_title: "",
        totalCount: "",
        title_similarity: "",
        suggested_link: "",
        note: `조회 실패(타임아웃): ${result.errMsg ?? ""}`,
        confirmed: "",
      };
    } else {
      const resultCode = extractTag(result.text, "resultCode");
      const resultMsg = extractTag(result.text, "resultMsg");
      const totalCount = extractTag(result.text, "totalCount");

      if (resultCode && resultCode !== "00") {
        stats.failed++;
        statusLabel = "API오류";
        row = {
          id: pub.id,
          original_title: pub.title,
          original_authors: pub.authors,
          original_year: pub.year,
          kci_doi: "",
          kci_uci: "",
          kci_url: "",
          kci_matched_title: "",
          totalCount: "",
          title_similarity: "",
          suggested_link: "",
          note: `API 오류: ${resultCode} ${resultMsg}`,
          confirmed: "",
        };
      } else {
        const itemXml = extractFirstItem(result.text);

        if (!itemXml) {
          stats.noResult++;
          statusLabel = "결과없음";
          row = {
            id: pub.id,
            original_title: pub.title,
            original_authors: pub.authors,
            original_year: pub.year,
            kci_doi: "",
            kci_uci: "",
            kci_url: "",
            kci_matched_title: "",
            totalCount: totalCount || "0",
            title_similarity: "",
            suggested_link: "",
            note: "결과 없음",
            confirmed: "",
          };
        } else {
          const korTitle = extractTag(itemXml, "ARTI_KOR_TITL");
          const engTitle = extractTag(itemXml, "ARTI_ENG_TITL") || extractTag(itemXml, "ARTI_FOLA_TITL");
          const doi = extractTag(itemXml, "DOI");
          const uci = extractTag(itemXml, "UCI");
          const url = extractTag(itemXml, "URL");
          const similarity = bestSimilarity(pub.title, korTitle, engTitle);

          let suggestedLink = "";
          let note = "";
          if (doi) {
            suggestedLink = `https://doi.org/${doi}`;
            stats.doiFound++;
            statusLabel = "DOI찾음";
          } else if (url) {
            suggestedLink = url;
            stats.urlOnly++;
            statusLabel = "URL만";
          } else if (uci) {
            note = "UCI만 있음";
            stats.uciOnly++;
            statusLabel = "UCI만";
          } else {
            note = "결과 없음";
            stats.noResult++;
            statusLabel = "결과없음";
          }

          row = {
            id: pub.id,
            original_title: pub.title,
            original_authors: pub.authors,
            original_year: pub.year,
            kci_doi: doi,
            kci_uci: uci,
            kci_url: url,
            kci_matched_title: korTitle || engTitle,
            totalCount: totalCount || "",
            title_similarity: similarity.toFixed(3),
            suggested_link: suggestedLink,
            note,
            confirmed: "",
          };
        }
      }
    }

    appendCsvRow(csvPath, CSV_HEADERS.map((h) => row[h]));
    rowsForSummary.push(row);

    console.log(`${i + 1}/${targets.length} 완료 (${pub.id}, ${statusLabel})`);

    if (i < targets.length - 1) {
      await sleep(ITEM_DELAY_MS);
    }
  }

  console.log("\n=== 요약 ===");
  console.log(`대상 건수: ${targets.length}`);
  console.log(`DOI 찾음: ${stats.doiFound}`);
  console.log(`URL만: ${stats.urlOnly}`);
  console.log(`UCI만: ${stats.uciOnly}`);
  console.log(`결과없음: ${stats.noResult}`);
  console.log(`실패(타임아웃/오류): ${stats.failed}`);
  const highSim = rowsForSummary.filter((r) => parseFloat(r.title_similarity) >= 0.8).length;
  const exactTotal = rowsForSummary.filter((r) => r.totalCount === "1").length;
  console.log(`title_similarity 0.8 이상: ${highSim}`);
  console.log(`totalCount=1(완전일치 후보): ${exactTotal}`);
  console.log(`\nCSV 저장 위치: ${csvPath}`);
}

main();
