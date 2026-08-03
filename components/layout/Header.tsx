"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/site";

const NAV_ITEMS = [{ label: "About Us", href: "/about" }];

const MEMBERS_SUBMENU = [
  { label: "Current Members", href: "/members" },
  { label: "Alumni", href: "/members/alumni" },
];

const PROJECTS_SUBMENU = [
  { label: "Current Projects", href: "/projects" },
  { label: "Past Projects", href: "/projects/past" },
];

const TRAILING_NAV_ITEMS = [
  { label: "Publications", href: "/publications" },
  { label: "News", href: "/news" },
];

type MenuKey = "members" | "projects";

export default function Header() {
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const membersMenuRef = useRef<HTMLDivElement>(null);
  const projectsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const insideMembers = membersMenuRef.current?.contains(target);
      const insideProjects = projectsMenuRef.current?.contains(target);
      if (!insideMembers && !insideProjects) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function toggleMenu(menu: MenuKey) {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  }

  return (
    <header className="border-b border-ewha-grey bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-y-2 px-6 py-4">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src={withBasePath("/images/ewha-symbol-mark.png")}
            alt="이화여자대학교 심벌마크"
            width={80}
            height={80}
            className="h-10 w-10 shrink-0"
            priority
          />
          <span
            className="flex flex-col leading-tight whitespace-nowrap"
            style={{ fontFamily: "var(--font-ewha-brand)" }}
          >
            <span className="text-xs font-bold text-ewha-green-900">
              이화여자대학교
            </span>
            <span className="text-base font-extrabold text-ewha-green-900">
              공간정보연구실
            </span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-gray-600">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-ewha-green-900"
            >
              {item.label}
            </Link>
          ))}

          <div className="relative" ref={membersMenuRef}>
            <button
              type="button"
              onClick={() => toggleMenu("members")}
              aria-expanded={openMenu === "members"}
              className="flex items-center gap-1 transition-colors hover:text-ewha-green-900"
            >
              Members
              <span aria-hidden="true" className="text-xs">
                ▾
              </span>
            </button>
            {openMenu === "members" ? (
              <div className="absolute left-0 top-full z-10 mt-2 w-44 rounded-md border border-ewha-grey bg-white py-2 shadow-md">
                {MEMBERS_SUBMENU.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpenMenu(null)}
                    className="block px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-ewha-green-50 hover:text-ewha-green-900"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative" ref={projectsMenuRef}>
            <button
              type="button"
              onClick={() => toggleMenu("projects")}
              aria-expanded={openMenu === "projects"}
              className="flex items-center gap-1 transition-colors hover:text-ewha-green-900"
            >
              Projects
              <span aria-hidden="true" className="text-xs">
                ▾
              </span>
            </button>
            {openMenu === "projects" ? (
              <div className="absolute left-0 top-full z-10 mt-2 w-44 rounded-md border border-ewha-grey bg-white py-2 shadow-md">
                {PROJECTS_SUBMENU.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpenMenu(null)}
                    className="block px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-ewha-green-50 hover:text-ewha-green-900"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {TRAILING_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-ewha-green-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
