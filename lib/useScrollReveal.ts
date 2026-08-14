"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof IntersectionObserver === "undefined" || prefersReducedMotion) {
      // effect 본문에서 setState를 동기 호출하지 않도록 rAF 콜백으로 감쌈
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    // threshold: 0.15는 "요소 높이의 15%가 뷰포트에 동시에 들어와야" 발동한다.
    // 모바일 1열 레이아웃처럼 요소가 세로로 길어져 15% 지점이 뷰포트 높이보다
    // 커지면 이 조건이 물리적으로 충족되지 않아 콘텐츠가 영원히 숨겨진다
    // (예: People 섹션 카드 전체를 감싼 Reveal이 모바일에서 이 문제로 안 보였음).
    // threshold: 0은 요소가 1px이라도 걸치면 발동하므로 높이와 무관하게 안전하고,
    // rootMargin으로 뷰포트 하단을 10% 당겨 와서 화면에 닿자마자가 아니라
    // 어느 정도 올라왔을 때 시작되는 기존 체감을 유지한다.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(node);
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}
