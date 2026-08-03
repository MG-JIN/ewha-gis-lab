"use client";

import { useMemo, useState } from "react";
import {
  groupPublicationsByYear,
  type Publication,
  type PublicationType,
} from "@/lib/publications";

const TYPE_LABEL: Record<PublicationType, string> = {
  journal: "Journal",
  conference: "Conference",
};

const TYPE_BADGE_CLASS: Record<PublicationType, string> = {
  journal: "bg-ewha-yellow-green text-ewha-green-900",
  conference: "bg-ewha-mint text-ewha-green-900",
};

type FilterValue = "all" | PublicationType;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "journal", label: "Journal" },
  { value: "conference", label: "Conference" },
];

export default function PublicationsExplorer({
  publications,
}: {
  publications: Publication[];
}) {
  const [filter, setFilter] = useState<FilterValue>("all");

  const counts = useMemo(
    () => ({
      all: publications.length,
      journal: publications.filter((pub) => pub.type === "journal").length,
      conference: publications.filter((pub) => pub.type === "conference").length,
    }),
    [publications]
  );

  const filtered = useMemo(
    () =>
      filter === "all"
        ? publications
        : publications.filter((pub) => pub.type === filter),
    [publications, filter]
  );

  const grouped = useMemo(() => groupPublicationsByYear(filtered), [filtered]);

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            aria-pressed={filter === item.value}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === item.value
                ? "bg-ewha-green-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-ewha-green-50 hover:text-ewha-green-900"
            }`}
          >
            {item.label} ({counts[item.value]})
          </button>
        ))}
      </div>

      <div className="space-y-10">
        {grouped.map(([year, pubs]) => (
          <section key={year}>
            <h2 className="mb-4 text-xl font-semibold text-ewha-green-900">{year}</h2>
            <ul className="space-y-4">
              {pubs.map((pub) => (
                <li
                  key={pub.id}
                  className="border-b border-gray-100 pb-4 last:border-none"
                >
                  <p className="font-medium text-gray-900">{pub.title}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    {pub.authors} · {pub.venue}
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${TYPE_BADGE_CLASS[pub.type]}`}
                  >
                    {TYPE_LABEL[pub.type]}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {grouped.length === 0 ? (
          <p className="text-sm text-gray-500">해당하는 실적이 없습니다.</p>
        ) : null}
      </div>
    </div>
  );
}
