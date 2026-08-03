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

const TRAILING_NAV_ITEMS = [
  { label: "Projects", href: "/projects" },
  { label: "Publications", href: "/publications" },
  { label: "News", href: "/news" },
];

export default function Header() {
  const [membersOpen, setMembersOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMembersOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-ewha-green-900"
            >
              {item.label}
            </Link>
          ))}

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMembersOpen((prev) => !prev)}
              aria-expanded={membersOpen}
              className="flex items-center gap-1 transition-colors hover:text-ewha-green-900"
            >
              Members
              <span aria-hidden="true" className="text-xs">
                ▾
              </span>
            </button>
            {membersOpen ? (
              <div className="absolute left-0 top-full z-10 mt-2 w-44 rounded-md border border-ewha-grey bg-white py-2 shadow-md">
                {MEMBERS_SUBMENU.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMembersOpen(false)}
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
