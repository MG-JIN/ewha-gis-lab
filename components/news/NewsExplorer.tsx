"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import type { NewsSummary } from "@/lib/news";

const CATEGORY_BADGE_CLASS: Record<string, string> = {
  Announcement: "bg-ewha-coral text-ewha-green-900",
  Updates: "bg-ewha-blue text-ewha-green-900",
};

type FilterValue = "all" | "Announcement" | "Updates";

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Announcement", label: "Announcement" },
  { value: "Updates", label: "Updates" },
];

export default function NewsExplorer({ newsList }: { newsList: NewsSummary[] }) {
  const [filter, setFilter] = useState<FilterValue>("all");

  const counts = useMemo(
    () => ({
      all: newsList.length,
      Announcement: newsList.filter((post) => post.category === "Announcement").length,
      Updates: newsList.filter((post) => post.category === "Updates").length,
    }),
    [newsList]
  );

  const filtered = useMemo(
    () =>
      filter === "all"
        ? newsList
        : newsList.filter((post) => post.category === filter),
    [newsList, filter]
  );

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

      <div className="space-y-4">
        {filtered.map((post) => (
          <Link key={post.slug} href={`/news/${post.slug}`}>
            <Card>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{post.date}</span>
                {post.category ? (
                  <span
                    className={`rounded-full px-2 py-0.5 ${
                      CATEGORY_BADGE_CLASS[post.category] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {post.category}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 font-medium text-gray-900">{post.title}</p>
              {post.excerpt ? (
                <p className="mt-2 text-sm text-gray-500">{post.excerpt}</p>
              ) : null}
            </Card>
          </Link>
        ))}
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500">해당하는 게시글이 없습니다.</p>
        ) : null}
      </div>
    </div>
  );
}
