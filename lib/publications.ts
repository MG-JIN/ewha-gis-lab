import publicationsData from "@/content/publications.json";

export type PublicationType = "journal" | "conference" | "patent";

export interface Publication {
  id: string;
  year: number;
  authors: string;
  type: PublicationType;
  link?: string;
  doi?: string;
  url?: string;
  // journal / conference
  title?: string;
  venue?: string;
  // patent
  titleKo?: string;
  titleEn?: string;
  date?: string;
  description?: string;
}

function parsePatentDate(date?: string): number {
  const [y, m] = (date ?? "").split(".").map(Number);
  return y ? y * 100 + (m || 0) : 0;
}

function getSortKey(pub: Publication): number {
  if (pub.type === "patent") {
    return parsePatentDate(pub.date) || pub.year * 100;
  }
  return pub.year * 100;
}

export function getPublications(): Publication[] {
  return [...(publicationsData as Publication[])].sort(
    (a, b) => getSortKey(b) - getSortKey(a)
  );
}

export function groupPublicationsByYear(
  publications: Publication[]
): [number, Publication[]][] {
  const years = Array.from(new Set(publications.map((pub) => pub.year))).sort(
    (a, b) => b - a
  );
  return years.map((year) => [
    year,
    publications.filter((pub) => pub.year === year),
  ]);
}

export function getPublicationsByYear(): [number, Publication[]][] {
  return groupPublicationsByYear(getPublications());
}
