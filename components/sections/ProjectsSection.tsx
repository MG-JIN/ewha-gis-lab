import Image from "next/image";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Tab from "@/components/ui/Tab";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import PastProjectsPanel from "@/components/sections/PastProjectsPanel";
import { IconFolder } from "@/components/ui/icons";
import { withBasePath } from "@/lib/site";
import { getSectionMeta } from "@/lib/sections";
import type { Project } from "@/lib/projects";

function ProjectDetails({ project }: { project: Project }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ewha-green-50 text-ewha-green-900">
          <IconFolder className="h-3.5 w-3.5" />
        </span>
        <span>{project.period}</span>
      </div>
      <p className="mt-3 font-bold text-gray-900">{project.title}</p>
      <p className="mt-1 text-sm text-gray-500">{project.funder}</p>
      {project.description ? (
        <p className="mt-3 text-sm text-gray-600">{project.description}</p>
      ) : null}
    </div>
  );
}

function CurrentProjectsPanel({ projects }: { projects: Project[] }) {
  return (
    <div className="space-y-6">
      {projects.map((project) =>
        project.roadmapImage ? (
          <Card key={project.id}>
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <a
                href={withBasePath(`/images/${project.roadmapImage}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full shrink-0 md:w-3/5"
              >
                <Image
                  src={withBasePath(`/images/${project.roadmapImage}`)}
                  alt="차세대 디지털 국토정보 구축 프로젝트 로드맵"
                  width={944}
                  height={612}
                  className="h-auto w-full cursor-zoom-in rounded-md border border-gray-200 transition-opacity hover:opacity-90"
                />
              </a>
              <div className="md:w-2/5">
                <ProjectDetails project={project} />
              </div>
            </div>
          </Card>
        ) : (
          <Card key={project.id}>
            <ProjectDetails project={project} />
          </Card>
        )
      )}
    </div>
  );
}

export default function ProjectsSection({
  currentProjects,
  pastProjects,
}: {
  currentProjects: Project[];
  pastProjects: Project[];
}) {
  const { index, label, variant } = getSectionMeta("projects");

  return (
    <Section id="projects" variant={variant}>
      <Reveal>
        <SectionHeader index={index} title={label} />
      </Reveal>
      <Reveal delayMs={80}>
        <Tab
          tabs={[
            {
              label: "Current Projects",
              content: <CurrentProjectsPanel projects={currentProjects} />,
            },
            {
              label: "Past Projects",
              content: <PastProjectsPanel projects={pastProjects} />,
            },
          ]}
        />
      </Reveal>
    </Section>
  );
}
