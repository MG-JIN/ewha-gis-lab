// content/publications.json의 type==="conference" 항목 중 venue/title이 영문 위주인
// "국제 학회" 약 20건만 Crossref works API로 조회해(top-3) 검증용 CSV를 만든다.
// 읽기 전용 스크립트 — content/publications.json은 절대 수정하지 않는다.
//
// 실행: node scripts/fetch-conf-crossref.mjs

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
  "original_venue",
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
  const csvPath = path.join(process.cwd(), "scripts/conf-crossref.csv");

  const pubs = JSON.parse(fs.readFileSync(pubsPath, "utf8"));
  const targets = pubs.filter((p) => {
    if (p.type !== "conference") return false;
    const text = (p.venue || "") + " " + (p.title || "");
    return !hasHangul(text);
  });

  console.log(`대상 건수(국제 conference): ${targets.length}`);

  const allRows = [];
  let foundCount = 0;
  let highSimCount = 0;

  for (let i = 0; i < targets.length; i++) {
    const pub = targets[i];
    const firstAuthor = (pub.authors || "").split(",")[0].trim();

    let items = [];
    try {
      items = await fetchCandidates(pub.title, firstAuthor);
    } catch (err) {
      console.log(`[${i + 1}/${targets.length}] ${pub.id} -> 조회 실패: ${err.message}`);
      allRows.push({
        id: pub.id,
        original_title: pub.title,
        original_authors: pub.authors,
        original_venue: pub.venue,
        original_year: pub.year,
        rank: 1,
        candidate_doi: "",
        candidate_title: "",
        candidate_container: "",
        candidate_year: "",
        crossref_score: "",
        title_similarity: "",
        confirmed: "",
      });
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
      allRows.push({
        id: pub.id,
        original_title: pub.title,
        original_authors: pub.authors,
        original_venue: pub.venue,
        original_year: pub.year,
        rank: 1,
        candidate_doi: "",
        candidate_title: "",
        candidate_container: "",
        candidate_year: "",
        crossref_score: "",
        title_similarity: "",
        confirmed: "",
      });
    } else {
      scored.forEach((c, idx) => {
        allRows.push({
          id: pub.id,
          original_title: pub.title,
          original_authors: pub.authors,
          original_venue: pub.venue,
          original_year: pub.year,
          rank: idx + 1,
          candidate_doi: c.doi,
          candidate_title: c.title,
          candidate_container: c.container,
          candidate_year: c.year,
          crossref_score: c.score,
          title_similarity: c.similarity.toFixed(3),
          confirmed: "",
        });
      });
      foundCount++;
      if (scored[0].similarity >= 0.85) highSimCount++;
    }

    console.log(
      `[${i + 1}/${targets.length}] ${pub.id} -> 후보 ${scored.length}건${
        scored.length > 0 ? ` (최고 sim=${scored[0].similarity.toFixed(3)})` : ""
      }`
    );

    await sleep(DELAY_MS);
  }

  // rank 1 행의 similarity 기준 내림차순, 같은 id의 rank 2/3은 바로 뒤에 붙인다
  const byId = new Map();
  for (const row of allRows) {
    if (!byId.has(row.id)) byId.set(row.id, []);
    byId.get(row.id).push(row);
  }
  const idsSortedBySim = [...byId.keys()].sort((a, b) => {
    const topA = parseFloat(byId.get(a)[0].title_similarity) || 0;
    const topB = parseFloat(byId.get(b)[0].title_similarity) || 0;
    return topB - topA;
  });

  const BOM = "﻿";
  const outLines = [toCsvRow(CSV_HEADERS)];
  for (const id of idsSortedBySim) {
    for (const row of byId.get(id)) {
      outLines.push(toCsvRow(CSV_HEADERS.map((h) => row[h])));
    }
  }
  fs.writeFileSync(csvPath, BOM + outLines.join("\r\n"), "utf8");

  console.log("\n=== 요약 ===");
  console.log(`대상 건수: ${targets.length}`);
  console.log(`후보라도 나온 id 수: ${foundCount}`);
  console.log(`title_similarity 0.85 이상(최고 후보 기준) id 수: ${highSimCount}`);
  console.log(`\nCSV 저장 위치: ${csvPath}`);
}

main();
