"use client";

import { useId, useState } from "react";
import { IconFolder } from "@/components/ui/icons";
import Modal, { ModalDetailLayout } from "@/components/ui/Modal";
import { withBasePath } from "@/lib/site";
import type { Project } from "@/lib/projects";

// 이 3건만 클릭 시 Journal과 동일한 Modal 팝업으로 상세를 보여주고,
// 나머지는 기존 flat 목록(PastProjectListItem)을 그대로 유지한다.
const MODAL_PROJECT_IDS = new Set([
  "crime-fear-streetview-2023",
  "jeonju-pedestrian-2021",
  "cnn-tourism-image-2019",
]);

// Publications/News 목록 항목과 동일한 hover/클릭 어포던스.
const ROW_BUTTON_CLASS =
  "block w-full rounded-md px-3 py-3 text-left transition-colors hover:bg-white cursor-pointer";

// 박스(카드) 없는 목록형. 아이콘 컬럼을 flex로 분리해 제목이 줄바꿈돼도
// 두 번째 줄이 아이콘 아래가 아니라 텍스트 시작 위치에 맞춰지도록 했다
// (hanging indent). description은 이 목록에는 표시하지 않는다(데이터는 유지).
function PastProjectListItem({ project }: { project: Project }) {
  return (
    <div className="flex gap-3 py-3">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ewha-green-50 text-ewha-green-900">
        <IconFolder className="h-3.5 w-3.5" />
      </span>
      <p className="leading-relaxed">
        <span className="text-gray-500">({project.period})</span>{" "}
        <span className="font-bold text-ewha-green-900">{project.title}</span>{" "}
        <span className="text-gray-400">({project.funder})</span>
      </p>
    </div>
  );
}

function PastProjectModalTrigger({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: (project: Project) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(project)}
      className={`flex items-center gap-3 ${ROW_BUTTON_CLASS}`}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ewha-green-50 text-ewha-green-900">
        <IconFolder className="h-3.5 w-3.5" />
      </span>
      <span className="flex-1 font-bold text-ewha-green-900">{project.title}</span>
    </button>
  );
}

function PastProjectModalContent({
  project,
  titleId,
}: {
  project: Project;
  titleId: string;
}) {
  return (
    <ModalDetailLayout
      titleId={titleId}
      meta={project.period}
      title={project.title}
      infoLine={project.funder}
      image={
        project.roadmapImage
          ? { src: withBasePath(`/images/${project.roadmapImage}`), alt: project.title }
          : undefined
      }
      descriptionLabel="Description"
      description={project.description ?? "내용이 준비 중입니다."}
    />
  );
}

export default function PastProjectsPanel({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const titleId = useId();

  return (
    <div>
      <div className="divide-y divide-gray-100">
        {projects.map((project) =>
          MODAL_PROJECT_IDS.has(project.id) ? (
            <PastProjectModalTrigger
              key={project.id}
              project={project}
              onSelect={setSelectedProject}
            />
          ) : (
            <PastProjectListItem key={project.id} project={project} />
          )
        )}
      </div>

      <Modal
        open={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        titleId={titleId}
      >
        {selectedProject ? (
          <PastProjectModalContent project={selectedProject} titleId={titleId} />
        ) : null}
      </Modal>
    </div>
  );
}
