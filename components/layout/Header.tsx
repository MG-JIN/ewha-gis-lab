"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-gray-900">
          Ewha GIS Lab
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMembersOpen((prev) => !prev)}
              aria-expanded={membersOpen}
              className="flex items-center gap-1 transition-colors hover:text-gray-900"
            >
              Members
              <span aria-hidden="true" className="text-xs">
                ▾
              </span>
            </button>
            {membersOpen ? (
              <div className="absolute left-0 top-full z-10 mt-2 w-44 rounded-md border border-gray-200 bg-white py-2 shadow-md">
                {MEMBERS_SUBMENU.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMembersOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
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
              className="transition-colors hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
