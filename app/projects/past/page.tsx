import PageHeading from "@/components/ui/PageHeading";
import Card from "@/components/ui/Card";
import { getPastProjects } from "@/lib/projects";

export default function PastProjectsPage() {
  const projects = getPastProjects();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeading
        title="Past Projects"
        description="공간정보연구실이 과거에 수행한 연구 프로젝트입니다."
      />

      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <p className="font-medium text-gray-900">{project.title}</p>
            <p className="mt-2 text-sm text-gray-500">
              {project.funder} · {project.period}
            </p>
            {project.description ? (
              <p className="mt-3 text-sm text-gray-600">{project.description}</p>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
