"use client";

import { useState, type ReactNode } from "react";

export default function Accordion({
  items,
  defaultOpenIndex,
}: {
  items: { key: string; title: ReactNode; content: ReactNode }[];
  defaultOpenIndex?: number | null;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex ?? null);

  return (
    <div className="divide-y divide-gray-200">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.key}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              {item.title}
              <span
                aria-hidden="true"
                className={`ml-4 shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>
            {isOpen ? <div className="pb-8">{item.content}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
