import Image from "next/image";
import PageHeading from "@/components/ui/PageHeading";
import Card from "@/components/ui/Card";
import { getCurrentProjects, type Project } from "@/lib/projects";
import { withBasePath } from "@/lib/site";

function ProjectDetails({ project }: { project: Project }) {
  return (
    <div>
      <p className="font-medium text-gray-900">{project.title}</p>
      <p className="mt-2 text-sm text-gray-500">
        {project.funder} · {project.period}
      </p>
      {project.description ? (
        <p className="mt-3 text-sm text-gray-600">{project.description}</p>
      ) : null}
    </div>
  );
}

export default function ProjectsPage() {
  const projects = getCurrentProjects();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeading title="Current Projects" />

      <div className="space-y-4">
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
    </div>
  );
}
