// scripts/kci-candidates.csv에서 confirmed === "O"인 행만 content/publications.json의
// 해당 journal 항목에 역주입한다.
//   - kci_doi가 있으면 doi 필드에 순수 DOI 문자열
//   - kci_doi가 없고 kci_url이 있으면 url 필드에 원문 URL
//
// ⚠️ publications.json은 항목이 한 줄로 저장돼 있어(apply-doi.mjs와 동일한 이유로)
// JSON.parse 후 재직렬화하지 않고, 텍스트 줄 단위로 대상 줄에만 필드를 삽입한다.
//
// 안전장치:
//   - id가 publications.json에 없으면 스킵 + 경고
//   - 대상 필드(doi 또는 url)에 이미 값이 있으면 덮어쓰지 않고 경고(재실행 안전)
//   - doi는 "10."으로 시작하지 않으면 스킵 + 경고
//   - url은 http(s)://로 시작하지 않으면 스킵 + 경고
//   - confirmed가 "O"가 아닌 행은 절대 건드리지 않음
//   - type !== "journal"인 줄(같은 id라도)은 대상 아님
//
// 실행: node scripts/apply-kci.mjs

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
  const csvPath = path.join(process.cwd(), "scripts/kci-candidates.csv");
  const pubsPath = path.join(process.cwd(), "content/publications.json");

  const rows = readCsv(csvPath);
  const lines = fs.readFileSync(pubsPath, "utf8").split("\n");

  const confirmedRows = rows.filter(
    (r) => (r.confirmed || "").trim().toUpperCase() === "O"
  );

  const applied = [];
  const skipped = [];

  for (const row of confirmedRows) {
    const id = row.id;
    const doi = (row.kci_doi || "").trim();
    // kci_url이 비어있고 UCI만 있던 건은 suggested_link에 KCI 상세페이지 URL을
    // 채워뒀으므로(검증 통과분) 그것도 url 소스로 인정한다.
    const url = (row.kci_url || "").trim() || (row.suggested_link || "").trim();

    let field, value;
    if (doi) {
      if (!doi.startsWith("10.")) {
        skipped.push({ id, reason: `kci_doi가 "10."으로 시작하지 않음 (값: "${doi}")` });
        continue;
      }
      field = "doi";
      value = doi;
    } else if (url) {
      if (!/^https?:\/\//.test(url)) {
        skipped.push({ id, reason: `url이 http(s)://로 시작하지 않음 (값: "${url}")` });
        continue;
      }
      field = "url";
      value = url;
    } else {
      skipped.push({ id, reason: "kci_doi/kci_url/suggested_link 전부 없음" });
      continue;
    }

    const idEscaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const lineRegex = new RegExp(
      `^(\\s*\\{\\s*"id":\\s*"${idEscaped}".*"type":\\s*"journal")(\\s*\\})`
    );

    const lineIndex = lines.findIndex((line) => lineRegex.test(line));

    if (lineIndex === -1) {
      skipped.push({ id, reason: "publications.json의 journal 항목에서 해당 줄을 찾을 수 없음" });
      continue;
    }

    const targetLine = lines[lineIndex];
    const fieldPattern = new RegExp(`"${field}":`);

    if (fieldPattern.test(targetLine)) {
      skipped.push({ id, reason: `이미 ${field} 필드가 있음 — 덮어쓰지 않음` });
      continue;
    }

    // url을 넣으려는데 이미 doi가 있으면(모달이 doi를 우선하므로) url은 넣지 않고 경고만 남김
    if (field === "url" && /"doi":/.test(targetLine)) {
      skipped.push({ id, reason: "이미 doi 필드가 있음 — url을 추가하지 않음(모달이 doi 우선)" });
      continue;
    }

    lines[lineIndex] = targetLine.replace(lineRegex, `$1, "${field}": "${value}"$2`);
    applied.push({ id, field, value });
  }

  if (applied.length > 0) {
    fs.writeFileSync(pubsPath, lines.join("\n"), "utf8");
  }

  console.log("=== 반영 결과 ===");
  console.log(`confirmed=O 총 ${confirmedRows.length}건 중 반영 ${applied.length}건, 스킵 ${skipped.length}건`);
  console.log("");
  console.log("--- 반영됨 ---");
  applied.forEach((a) => console.log(`  ${a.id} -> ${a.field}: ${a.value}`));
  if (skipped.length > 0) {
    console.log("");
    console.log("--- 스킵/경고 ---");
    skipped.forEach((s) => console.log(`  ${s.id}: ${s.reason}`));
  }
}

main();
