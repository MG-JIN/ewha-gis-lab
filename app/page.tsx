import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import PeopleSection from "@/components/sections/PeopleSection";
import PublicationsSection from "@/components/sections/PublicationsSection";
import CurriculumSection from "@/components/sections/CurriculumSection";
import NewsSection from "@/components/sections/NewsSection";
import ContactSection from "@/components/sections/ContactSection";
import { getCurrentProjects, getPastProjects } from "@/lib/projects";
import { getMembersByCategory, getAlumniByDegree } from "@/lib/members";
import { getPublications } from "@/lib/publications";
import { getCurriculumPrograms } from "@/lib/curriculum";
import { getNewsList } from "@/lib/news";

export default async function Home() {
  const [
    currentProjects,
    pastProjects,
    faculty,
    phdMembers,
    combinedMsPhdMembers,
    msMembers,
    combinedBsMsMembers,
    phdAlumni,
    msAlumni,
    publications,
    curriculumPrograms,
    newsList,
  ] = await Promise.all([
    Promise.resolve(getCurrentProjects()),
    Promise.resolve(getPastProjects()),
    Promise.resolve(getMembersByCategory("faculty")),
    Promise.resolve(getMembersByCategory("phd")),
    Promise.resolve(getMembersByCategory("combined-ms-phd")),
    Promise.resolve(getMembersByCategory("ms")),
    Promise.resolve(getMembersByCategory("combined-bs-ms")),
    Promise.resolve(getAlumniByDegree("phd")),
    Promise.resolve(getAlumniByDegree("ms")),
    Promise.resolve(getPublications()),
    getCurriculumPrograms(),
    Promise.resolve(getNewsList()),
  ]);

  const membersByCategory: Record<string, typeof phdMembers> = {
    phd: phdMembers,
    "combined-ms-phd": combinedMsPhdMembers,
    ms: msMembers,
    "combined-bs-ms": combinedBsMsMembers,
  };

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectsSection currentProjects={currentProjects} pastProjects={pastProjects} />
      <PeopleSection
        faculty={faculty}
        membersByCategory={membersByCategory}
        phdAlumni={phdAlumni}
        msAlumni={msAlumni}
      />
      <PublicationsSection publications={publications} />
      <CurriculumSection programs={curriculumPrograms} />
      <NewsSection newsList={newsList} />
      <ContactSection />
    </>
  );
}
