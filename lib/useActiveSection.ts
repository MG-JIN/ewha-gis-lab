"use client";

import { useEffect, useState } from "react";
import { SECTIONS, type SectionId } from "@/lib/sections";

// 뷰포트에 가장 많이 걸쳐 있는 섹션 하나만 active로 판정한다.
// (여러 섹션이 동시에 걸쳐 보여도 항상 단일 승자만 고른다)
export function useActiveSection(): SectionId | null {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return;
    }

    const ratios = new Map<SectionId, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as SectionId;
          ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let winner: SectionId | null = null;
        let max = 0;
        for (const section of SECTIONS) {
          const ratio = ratios.get(section.id) ?? 0;
          if (ratio > max) {
            max = ratio;
            winner = section.id;
          }
        }
        setActive(max > 0 ? winner : null);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-96px 0px -50% 0px" }
    );

    for (const section of SECTIONS) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return active;
}
