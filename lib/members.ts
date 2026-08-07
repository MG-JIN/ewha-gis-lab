import membersData from "@/content/members.json";

export type MemberCategory =
  | "faculty"
  | "phd"
  | "combined-ms-phd"
  | "ms"
  | "combined-bs-ms"
  | "alumni";

export interface Member {
  id: string;
  name: string;
  nameEn?: string;
  role: string;
  category: MemberCategory;
  interests?: string[];
  email?: string;
  photo?: string;
  degree?: "phd" | "ms";
  gradYear?: number;
  thesis?: string;
  affiliation?: string;
}

export function getMembers(): Member[] {
  return membersData as Member[];
}

export function getMembersByCategory(category: MemberCategory): Member[] {
  return getMembers().filter((member) => member.category === category);
}

export function getAlumniByDegree(degree: "phd" | "ms"): Member[] {
  return getMembersByCategory("alumni")
    .filter((member) => member.degree === degree)
    .sort((a, b) => (b.gradYear ?? 0) - (a.gradYear ?? 0));
}
