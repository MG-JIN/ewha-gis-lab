"use client";

import { useState } from "react";
import Image from "next/image";
import { IconFolder } from "@/components/ui/icons";
import { withBasePath } from "@/lib/site";
import type { Project } from "@/lib/projects";

// Publications/News의 Accordion과 달리 이 3건은 목록 안에 흩어져 있어(연속된
// 그룹이 아님) 하나를 열면 다른 게 닫히는 "그룹" 동작이 아니라, 각자 독립적으로
// 토글되는 방식으로 구현했다. 기본은 항상 닫힘(defaultOpenIndex 없음).
export default function PastProjectAccordionItem({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-3">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 text-left"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ewha-green-50 text-ewha-green-900">
          <IconFolder className="h-3.5 w-3.5" />
        </span>
        <span className="flex-1 font-bold text-ewha-green-900">{project.title}</span>
        <span
          aria-hidden="true"
          className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open ? (
        <div className="mt-3 pl-9">
          <p className="text-sm text-gray-500">{project.funder}</p>
          <p className="mt-1 text-xs text-gray-400">{project.period}</p>
          {project.roadmapImage ? (
            <Image
              src={withBasePath(`/images/${project.roadmapImage}`)}
              alt={project.title}
              width={944}
              height={612}
              className="mt-4 h-auto max-w-full rounded-md border border-gray-200"
            />
          ) : null}
          <p className="mt-4 text-sm text-gray-600">
            {project.description ?? "설명 준비 중입니다."}
          </p>
        </div>
      ) : null}
    </div>
  );
}
