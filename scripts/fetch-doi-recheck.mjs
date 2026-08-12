// content/publications.json의 journal 항목 중 doi도 url도 없는 것만 Crossref works API로
// 재조회해(상위 3건 전부) 검증용 scripts/crossref-recheck.csv를 만든다.
// 읽기 전용 스크립트 — content/publications.json은 절대 수정하지 않는다.
//
// 실행: node scripts/fetch-doi-recheck.mjs

import fs from "node:fs";
import path from "node:path";

const CONTACT_EMAIL = "wlsalsrud02@ewha.ac.kr";
const USER_AGENT = `ewha-gis-lab/1.0 (mailto:${CONTACT_EMAIL})`;
const DELAY_MS = 1000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(str) {
  return (str || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(str) {
  return new Set(normalize(str).split(" ").filter(Boolean));
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

function hasHangul(str) {
  return /[가-힣]/.test(str || "");
}

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

async function fetchCandidates(title, author) {
  const params = new URLSearchParams({
    "query.bibliographic": title,
    "query.author": author,
    rows: "3",
  });
  const url = `https://api.crossref.org/works?${params.toString()}`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.message?.items ?? [];
}

const CSV_HEADERS = [
  "id",
  "original_title",
  "original_authors",
  "original_year",
  "rank",
  "candidate_doi",
  "candidate_title",
  "candidate_container",
  "candidate_year",
  "crossref_score",
  "title_similarity",
  "confirmed",
];

async function main() {
  const pubsPath = path.join(process.cwd(), "content/publications.json");
  const csvPath = path.join(process.cwd(), "scripts/crossref-recheck.csv");

  const pubs = JSON.parse(fs.readFileSync(pubsPath, "utf8"));
  const targets = pubs.filter((p) => p.type === "journal" && !p.doi && !p.url);

  console.log(`대상 건수: ${targets.length}`);

  const BOM = "﻿";
  const outLines = [toCsvRow(CSV_HEADERS)];

  let foundCount = 0;
  let highSimCount = 0;
  const hangulTargets = targets.filter((p) => hasHangul(p.title));
  const engTargets = targets.filter((p) => !hasHangul(p.title));
  let hangulFound = 0;
  let engFound = 0;

  for (let i = 0; i < targets.length; i++) {
    const pub = targets[i];
    const firstAuthor = (pub.authors || "").split(",")[0].trim();

    let items = [];
    try {
      items = await fetchCandidates(pub.title, firstAuthor);
    } catch (err) {
      console.log(`[${i + 1}/${targets.length}] ${pub.id} -> 조회 실패: ${err.message}`);
      outLines.push(
        toCsvRow([
          pub.id,
          pub.title,
          pub.authors,
          pub.year,
          1,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ])
      );
      await sleep(DELAY_MS);
      continue;
    }

    const scored = items.map((item) => {
      const candidateTitle = item.title?.[0] ?? "";
      return {
        doi: item.DOI ?? "",
        title: candidateTitle,
        container: item["container-title"]?.[0] ?? "",
        year: item.issued?.["date-parts"]?.[0]?.[0] ?? "",
        score: item.score ?? "",
        similarity: jaccardSimilarity(pub.title, candidateTitle),
      };
    });
    scored.sort((a, b) => b.similarity - a.similarity);

    if (scored.length === 0) {
      outLines.push(
        toCsvRow([pub.id, pub.title, pub.authors, pub.year, 1, "", "", "", "", "", "", ""])
      );
    } else {
      scored.forEach((c, idx) => {
        outLines.push(
          toCsvRow([
            pub.id,
            pub.title,
            pub.authors,
            pub.year,
            idx + 1,
            c.doi,
            c.title,
            c.container,
            c.year,
            c.score,
            c.similarity.toFixed(3),
            "",
          ])
        );
      });
      foundCount++;
      if (hasHangul(pub.title)) hangulFound++;
      else engFound++;
      if (scored[0].similarity >= 0.9) highSimCount++;
    }

    console.log(
      `[${i + 1}/${targets.length}] ${pub.id} -> 후보 ${scored.length}건${
        scored.length > 0 ? ` (최고 sim=${scored[0].similarity.toFixed(3)})` : ""
      }`
    );

    await sleep(DELAY_MS);
  }

  fs.writeFileSync(csvPath, BOM + outLines.join("\r\n"), "utf8");

  console.log("\n=== 요약 ===");
  console.log(`대상 건수: ${targets.length}`);
  console.log(`후보라도 나온 id 수: ${foundCount}`);
  console.log(`title_similarity 0.9 이상(최고 후보 기준) id 수: ${highSimCount}`);
  console.log(`영문 제목 추정: ${engTargets.length}건 중 후보 찾음 ${engFound}건`);
  console.log(`한글 제목 추정: ${hangulTargets.length}건 중 후보 찾음 ${hangulFound}건`);
  console.log(`\nCSV 저장 위치: ${csvPath}`);
}

main();
