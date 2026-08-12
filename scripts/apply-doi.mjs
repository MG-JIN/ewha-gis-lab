// scripts/doi-candidates.csv에서 confirmed === "O"인 행의 candidate_doi만
// content/publications.json의 해당 journal 항목 doi 필드에 순수 문자열로 반영한다.
//
// ⚠️ publications.json은 항목 하나가 한 줄로 저장돼 있어(JSON.stringify(_, null, 2)
// 포맷이 아님), JSON.parse 후 재직렬화하면 202개 항목 전체의 포맷이 바뀌어버린다.
// 그래서 이 스크립트는 파일을 "텍스트"로 다루면서 대상 줄에만 "doi" 키를
// 정규식으로 삽입한다 — 다른 줄은 바이트 단위로 그대로 유지된다.
//
// 안전장치:
//   - id가 publications.json에 없으면 스킵 + 경고
//   - 대상 항목이 이미 doi를 갖고 있으면 덮어쓰지 않고 경고(재실행 안전)
//   - candidate_doi가 "10."으로 시작하지 않으면 스킵 + 경고
//   - confirmed가 "O"가 아닌 행은 절대 건드리지 않음
//   - type !== "journal"인 줄(같은 id라도)은 대상 아님
//
// 실행: node scripts/apply-doi.mjs

import fs from "node:fs";
import path from "node:path";

function parseCsvLine(line) {
  const fields = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      fields.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  fields.push(cur);
  return fields;
}

function readCsv(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  if (content.charCodeAt(0) === 0xfeff) content = content.slice(1);
  const lines = content.split(/\r\n|\n/).filter((l) => l.length > 0);
  const header = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const fields = parseCsvLine(line);
    const row = {};
    header.forEach((h, i) => {
      row[h] = fields[i] ?? "";
    });
    return row;
  });
}

function main() {
  const csvPath = path.join(process.cwd(), "scripts/doi-candidates.csv");
  const pubsPath = path.join(process.cwd(), "content/publications.json");

  const rows = readCsv(csvPath);
  let raw = fs.readFileSync(pubsPath, "utf8");
  const lines = raw.split("\n");

  const confirmedRows = rows.filter(
    (r) => (r.confirmed || "").trim().toUpperCase() === "O"
  );

  const applied = [];
  const skipped = [];

  for (const row of confirmedRows) {
    const id = row.id;
    const doi = (row.candidate_doi || "").trim();

    if (!doi.startsWith("10.")) {
      skipped.push({ id, reason: `candidate_doi가 "10."으로 시작하지 않음 (값: "${doi}")` });
      continue;
    }

    const idEscaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // journal 항목은 한 줄에 "id": "...", ..., "type": "journal" }, 형태로 저장되어 있다.
    const lineRegex = new RegExp(
      `^(\\s*\\{\\s*"id":\\s*"${idEscaped}".*"type":\\s*"journal")(\\s*\\})`
    );

    const lineIndex = lines.findIndex((line) => lineRegex.test(line));

    if (lineIndex === -1) {
      skipped.push({ id, reason: "publications.json의 journal 항목에서 해당 줄을 찾을 수 없음" });
      continue;
    }

    const targetLine = lines[lineIndex];

    if (/"doi":/.test(targetLine)) {
      skipped.push({ id, reason: "이미 doi 필드가 있음 — 덮어쓰지 않음" });
      continue;
    }

    lines[lineIndex] = targetLine.replace(lineRegex, `$1, "doi": "${doi}"$2`);
    applied.push({ id, doi });
  }

  if (applied.length > 0) {
    fs.writeFileSync(pubsPath, lines.join("\n"), "utf8");
  }

  console.log("=== 반영 결과 ===");
  console.log(`confirmed=O 총 ${confirmedRows.length}건 중 반영 ${applied.length}건, 스킵 ${skipped.length}건`);
  console.log("");
  console.log("--- 반영됨 ---");
  applied.forEach((a) => console.log(`  ${a.id} -> ${a.doi}`));
  if (skipped.length > 0) {
    console.log("");
    console.log("--- 스킵/경고 ---");
    skipped.forEach((s) => console.log(`  ${s.id}: ${s.reason}`));
  }
}

main();
