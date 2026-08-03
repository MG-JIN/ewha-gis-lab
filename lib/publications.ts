import publicationsData from "@/content/publications.json";

export type PublicationType = "journal" | "conference";

export interface Publication {
  id: string;
  year: number;
  authors: string;
  title: string;
  venue: string;
  type: PublicationType;
  link?: string;
}

export function getPublications(): Publication[] {
  return [...(publicationsData as Publication[])].sort((a, b) => b.year - a.year);
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
