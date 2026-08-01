import projectsData from "@/content/projects.json";

export type ProjectStatus = "ongoing" | "completed";

export interface Project {
  id: string;
  title: string;
  funder: string;
  period: string;
  status: ProjectStatus;
  description: string;
}

export function getProjects(): Project[] {
  return projectsData as Project[];
}
