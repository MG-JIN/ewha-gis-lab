// content/publications.json의 journal 항목만 Crossref works API로 조회해
// DOI 후보를 뽑아 scripts/doi-candidates.csv로 저장한다.
// 읽기 전용 스크립트 — content/publications.json은 절대 수정하지 않는다.
//
// 실행: node scripts/fetch-doi-candidates.mjs

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

// 라이브러리 없이 직접 구현한 토큰 자카드 유사도 (0~1)
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

function hasHangul(str) {
  return /[가-힣]/.test(str || "");
}

async function fetchCandidate(title, author) {
  const params = new URLSearchParams({
    "query.bibliographic": title,
    "query.author": author,
    rows: "3",
  });
  const url = `https://api.crossref.org/works?${params.toString()}`;
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const json = await res.json();
  const items = json.message?.items ?? [];
  return items[0] ?? null;
}

async function main() {
  const pubsPath = path.join(process.cwd(), "content/publications.json");
  const pubs = JSON.parse(fs.readFileSync(pubsPath, "utf8"));
  const journals = pubs.filter((p) => p.type === "journal");

  console.log(`총 journal 건수: ${journals.length}`);

  const rows = [];
  let foundCount = 0;
  let errorCount = 0;

  for (let i = 0; i < journals.length; i++) {
    const pub = journals[i];
    const firstAuthor = (pub.authors || "").split(",")[0].trim();

    let candidate = null;
    let note = "";
    try {
      candidate = await fetchCandidate(pub.title, firstAuthor);
    } catch (err) {
      note = `fetch_error: ${err.message}`;
      errorCount++;
    }

    let row;
    if (candidate) {
      const candidateTitle = candidate.title?.[0] ?? "";
      const similarity = jaccardSimilarity(pub.title, candidateTitle);
      row = {
        id: pub.id,
        original_title: pub.title,
        original_authors: pub.authors,
        original_venue: pub.venue,
        original_year: pub.year,
        candidate_doi: candidate.DOI ?? "",
        candidate_title: candidateTitle,
        candidate_container: candidate["container-title"]?.[0] ?? "",
        candidate_year: candidate.issued?.["date-parts"]?.[0]?.[0] ?? "",
        crossref_score: candidate.score ?? "",
        title_similarity: similarity.toFixed(3),
        confirmed: "",
        note,
      };
      foundCount++;
    } else {
      row = {
        id: pub.id,
        original_title: pub.title,
        original_authors: pub.authors,
        original_venue: pub.venue,
        original_year: pub.year,
        candidate_doi: "",
        candidate_title: "",
        candidate_container: "",
        candidate_year: "",
        crossref_score: "",
        title_similarity: "",
        confirmed: "",
        note: note || "no_candidate",
      };
    }
    rows.push(row);

    console.log(
      `[${i + 1}/${journals.length}] ${pub.id} -> ${
        candidate ? `후보 있음 (sim=${row.title_similarity})` : `후보 없음${note ? " (" + note + ")" : ""}`
      }`
    );

    await sleep(DELAY_MS);
  }

  rows.sort((a, b) => {
    const sa = parseFloat(a.title_similarity) || 0;
    const sb = parseFloat(b.title_similarity) || 0;
    return sb - sa;
  });

  const headers = [
    "id",
    "original_title",
    "original_authors",
    "original_venue",
    "original_year",
    "candidate_doi",
    "candidate_title",
    "candidate_container",
    "candidate_year",
    "crossref_score",
    "title_similarity",
    "confirmed",
    "note",
  ];

  const csvLines = [toCsvRow(headers)];
  for (const row of rows) {
    csvLines.push(toCsvRow(headers.map((h) => row[h])));
  }

  const outPath = path.join(process.cwd(), "scripts/doi-candidates.csv");
  const BOM = "﻿";
  fs.writeFileSync(outPath, BOM + csvLines.join("\r\n"), "utf8");

  const highConfidence = rows.filter((r) => parseFloat(r.title_similarity) >= 0.9).length;
  const midConfidence = rows.filter((r) => {
    const s = parseFloat(r.title_similarity) || 0;
    return s >= 0.7 && s < 0.9;
  }).length;
  const noCandidate = rows.filter((r) => !r.candidate_doi).length;

  const hangulRows = rows.filter((r) => hasHangul(r.original_title));
  const englishRows = rows.filter((r) => !hasHangul(r.original_title));
  const hangulFound = hangulRows.filter((r) => r.candidate_doi).length;
  const englishFound = englishRows.filter((r) => r.candidate_doi).length;

  console.log("\n=== 요약 ===");
  console.log(`총 journal 건수: ${journals.length}`);
  console.log(`후보 찾음: ${foundCount}`);
  console.log(`title_similarity 0.9 이상: ${highConfidence}`);
  console.log(`title_similarity 0.7~0.9: ${midConfidence}`);
  console.log(`후보 없음/오류: ${noCandidate}`);
  console.log(`네트워크 오류: ${errorCount}`);
  console.log(`--- 한글/영문 제목 구분 ---`);
  console.log(`영문 제목 항목: ${englishRows.length}건 중 후보 찾음 ${englishFound}건`);
  console.log(`한글 제목 항목: ${hangulRows.length}건 중 후보 찾음 ${hangulFound}건`);
  console.log(`\nCSV 저장 위치: ${outPath}`);
}

main();
