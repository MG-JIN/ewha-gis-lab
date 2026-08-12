// scripts/conf-crossref.csv의 rank=1, confirmed==="O" 행 중에서도
// 사용자가 최종 확정한 아래 8개 id에만 한정해 content/publications.json의
// 해당 conference 항목 doi 필드에 역주입한다.
//
// 저널판 DOI(pub-conf-031/015), 저널판 rank=2 중복(pub-conf-060 rank2),
// 유사도 낮은 매칭(pub-conf-030)은 CSV에 confirmed=O가 찍혀 있어도
// 이 스크립트의 대상 목록(ALLOWED)에 없으므로 절대 반영되지 않는다.
//
// ⚠️ publications.json은 항목이 한 줄로 저장돼 있어 JSON.parse 후
// 재직렬화하지 않고, 텍스트 줄 단위로 대상 줄에만 필드를 삽입한다.
//
// 실행: node scripts/apply-conf-doi.mjs

import fs from "node:fs";
import path from "node:path";

// rank=1, confirmed=O, 유사도 0.6 이상, 발표문(비저널) DOI로 사용자가 확정한 8건만 하드코딩.
// CSV의 confirmed 값이 이후 바뀌더라도 이 목록 외에는 절대 반영하지 않는다.
const ALLOWED = {
  "pub-conf-006": "10.1145/3748636.3766531",
  "pub-conf-029": "10.5194/ica-abs-6-118-2023",
  "pub-conf-040": "10.5194/ica-abs-3-150-2021",
  "pub-conf-060": "10.5194/ica-abs-1-209-2019",
  "pub-conf-062": "10.5194/ica-proc-2-62-2019",
  "pub-conf-061": "10.5194/ica-proc-2-18-2019",
  "pub-conf-005": "10.1145/3748636.3766530",
  "pub-conf-007": "10.1145/3748636.3763213",
};

function main() {
  const pubsPath = path.join(process.cwd(), "content/publications.json");
  const lines = fs.readFileSync(pubsPath, "utf8").split("\n");

  const applied = [];
  const skipped = [];

  for (const [id, doi] of Object.entries(ALLOWED)) {
    if (!doi.startsWith("10.")) {
      skipped.push({ id, reason: `doi가 "10."으로 시작하지 않음 (값: "${doi}")` });
      continue;
    }

    const idEscaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const lineRegex = new RegExp(
      `^(\\s*\\{\\s*"id":\\s*"${idEscaped}".*"type":\\s*"conference")(\\s*\\})`
    );

    const lineIndex = lines.findIndex((line) => lineRegex.test(line));

    if (lineIndex === -1) {
      skipped.push({ id, reason: "publications.json의 conference 항목에서 해당 줄을 찾을 수 없음" });
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
  console.log(`대상 8건 중 반영 ${applied.length}건, 스킵 ${skipped.length}건`);
  console.log("");
  console.log("--- 반영됨 ---");
  applied.forEach((a) => console.log(`  ${a.id} -> doi: ${a.doi}`));
  if (skipped.length > 0) {
    console.log("");
    console.log("--- 스킵/경고 ---");
    skipped.forEach((s) => console.log(`  ${s.id}: ${s.reason}`));
  }
}

main();
