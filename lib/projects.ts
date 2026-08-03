import projectsData from "@/content/projects.json";

export type ProjectStatus = "ongoing" | "completed";

export interface Project {
  id: string;
  title: string;
  funder: string;
  period: string;
  status: ProjectStatus;
  description?: string;
}

export function getProjects(): Project[] {
  return projectsData as Project[];
}

function getEndYear(period: string): number {
  const matches = period.match(/\d{4}/g);
  return matches ? Number(matches[matches.length - 1]) : 0;
}

export function getCurrentProjects(): Project[] {
  return getProjects().filter((project) => project.status === "ongoing");
}

export function getPastProjects(): Project[] {
  return getProjects()
    .filter((project) => project.status === "completed")
    .sort((a, b) => getEndYear(b.period) - getEndYear(a.period));
}
