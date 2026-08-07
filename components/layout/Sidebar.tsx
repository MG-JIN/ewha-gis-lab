"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SECTIONS } from "@/lib/sections";
import { useActiveSection } from "@/lib/useActiveSection";
import { withBasePath } from "@/lib/site";

export default function Sidebar() {
  const active = useActiveSection();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [mobileOpen]);

  function navLinks(onNavigate?: () => void) {
    return (
      <nav className="flex flex-col gap-1">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={onNavigate}
            aria-current={active === section.id ? "true" : undefined}
            className={`rounded-md px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors ${
              active === section.id
                ? "bg-ewha-green-50 text-ewha-green-900"
                : "text-ewha-green-900/70 hover:bg-ewha-green-50 hover:text-ewha-green-900"
            }`}
          >
            {section.label}
          </a>
        ))}
      </nav>
    );
  }

  return (
    <>
      {/* 데스크톱 사이드바 */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col overflow-y-auto border-r border-gray-200 bg-white px-6 py-8 lg:flex">
        <a href="#top" className="mb-10 flex items-center gap-3">
          <Image
            src={withBasePath("/images/ewha-symbol-mark.png")}
            alt="이화여자대학교 심벌마크"
            width={80}
            height={80}
            className="h-12 w-12 shrink-0"
          />
          <span className="font-logo text-sm leading-tight font-normal text-ewha-green-900">
            이화여자대학교
            <br />
            공간정보연구실
          </span>
        </a>
        {navLinks()}
      </aside>

      {/* 모바일 상단 바 */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
        <a href="#top" className="flex items-center gap-2">
          <Image
            src={withBasePath("/images/ewha-symbol-mark.png")}
            alt="이화여자대학교 심벌마크"
            width={32}
            height={32}
          />
          <span className="font-logo text-sm text-ewha-green-900">공간정보연구실</span>
        </a>
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-drawer"
          onClick={() => setMobileOpen(true)}
          className="p-2 text-ewha-green-900"
        >
          <span className="sr-only">메뉴 열기</span>
          <span aria-hidden="true">☰</span>
        </button>
      </div>

      {/* 모바일 드로어 */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-drawer"
            className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-white px-6 py-8 shadow-lg"
          >
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="mb-6 text-sm text-gray-500"
            >
              닫기 ✕
            </button>
            {navLinks(() => setMobileOpen(false))}
          </div>
        </div>
      ) : null}
    </>
  );
}
