export const SECTIONS = [
  { id: "about", label: "About Our Lab" },
  { id: "projects", label: "Our Projects" },
  { id: "people", label: "People" },
  { id: "publications", label: "Publications" },
  { id: "curriculum", label: "Curriculum" },
  { id: "news", label: "News" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
export type SectionVariant = "plain" | "tint";

// index % 2 === TINT_PARITY 인 섹션이 tint 배경이 된다.
// 교차 시작점을 뒤집고 싶으면 이 값만 0 <-> 1로 바꾸면 된다.
const TINT_PARITY: 0 | 1 = 1;

export function getSectionVariant(index: number): SectionVariant {
  return index % 2 === TINT_PARITY ? "tint" : "plain";
}

export function getSectionIndex(id: SectionId): number {
  return SECTIONS.findIndex((section) => section.id === id);
}

export function getSectionMeta(id: SectionId): {
  index: number;
  label: string;
  variant: SectionVariant;
} {
  const index = getSectionIndex(id);
  return { index, label: SECTIONS[index].label, variant: getSectionVariant(index) };
}
