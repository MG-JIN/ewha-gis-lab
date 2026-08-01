import PageHeading from "@/components/ui/PageHeading";
import Card from "@/components/ui/Card";
import { getProjects } from "@/lib/projects";

const STATUS_LABEL: Record<string, string> = {
  ongoing: "Ongoing",
  completed: "Completed",
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeading
        title="Projects"
        description="공간정보연구실이 수행 중이거나 완료한 연구 프로젝트입니다."
      />

      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-900">{project.title}</p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  project.status === "ongoing"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {STATUS_LABEL[project.status]}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {project.funder} · {project.period}
            </p>
            <p className="mt-3 text-sm text-gray-600">{project.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
