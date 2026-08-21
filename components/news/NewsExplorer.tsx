"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import Accordion from "@/components/ui/Accordion";
import Modal, { ModalDetailLayout } from "@/components/ui/Modal";
import FilterToggle from "@/components/ui/FilterToggle";
import type { NewsSummary } from "@/lib/news";

// 뱃지에 얇은 흰 테두리(ring)를 둘러 배경(흰 섹션/틴트 섹션)과 무관하게
// 항상 동일한 방식으로 도드라져 보이도록 통일했다.
const CATEGORY_BADGE_CLASS: Record<string, string> = {
  Announcement: "bg-ewha-yellow-green text-ewha-green-900 ring-1 ring-white",
  Updates: "bg-ewha-blue text-ewha-green-900 ring-1 ring-white",
};

type FilterValue = "Announcement" | "Updates";

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "Announcement", label: "Announcement" },
  { value: "Updates", label: "Updates" },
];

// date는 "YYYY-MM-DD" 문자열로 고정되어 있어(전체 100건 확인 완료),
// Date 객체 파싱 대신 앞 4자리 문자열 추출로 연도를 안전하게 뽑는다.
function getYear(date: string): string {
  return date.slice(0, 4);
}

function groupByYear(posts: NewsSummary[]): [string, NewsSummary[]][] {
  const years = Array.from(new Set(posts.map((post) => getYear(post.date)))).sort(
    (a, b) => Number(b) - Number(a)
  );
  return years.map((year) => [year, posts.filter((post) => getYear(post.date) === year)]);
}

const ROW_BUTTON_CLASS =
  "block w-full rounded-md px-3 py-3 text-left transition-colors hover:bg-white cursor-pointer";

function NewsListItem({
  post,
  onSelect,
}: {
  post: NewsSummary;
  onSelect: (post: NewsSummary) => void;
}) {
  return (
    <button type="button" onClick={() => onSelect(post)} className={ROW_BUTTON_CLASS}>
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
      {post.excerpt ? <p className="mt-2 text-sm text-gray-500">{post.excerpt}</p> : null}
    </button>
  );
}

// 아코디언은 닫힌 연도의 콘텐츠를 DOM에서 제거(unmount)한다. Reveal을 콘텐츠
// 안에 두면 열 때마다 매번 다시 관찰-소멸을 반복하므로, 항상 존재하는
// "헤더(연도 줄)"에만 Reveal을 걸고 펼침 콘텐츠는 Reveal 대상에서 뺐다.
function YearGroupedAccordion({
  posts,
  onSelect,
}: {
  posts: NewsSummary[];
  onSelect: (post: NewsSummary) => void;
}) {
  const grouped = useMemo(() => groupByYear(posts), [posts]);

  if (grouped.length === 0) return null;

  return (
    <Accordion
      defaultOpenIndex={0}
      items={grouped.map(([year, yearPosts], i) => ({
        key: year,
        title: (
          <Reveal delayMs={Math.min(i, 2) * 60}>
            <h4 className="text-xl font-bold text-ewha-green-900">
              {year}
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({yearPosts.length})
              </span>
            </h4>
          </Reveal>
        ),
        content: (
          <div className="divide-y divide-gray-100">
            {yearPosts.map((post) => (
              <NewsListItem key={post.slug} post={post} onSelect={onSelect} />
            ))}
          </div>
        ),
      }))}
    />
  );
}

function NewsModalContent({ post, titleId }: { post: NewsSummary; titleId: string }) {
  return (
    <ModalDetailLayout
      titleId={titleId}
      meta={`${post.date}${post.category ? ` · ${post.category}` : ""}`}
      title={post.title}
      descriptionLabel="Summary"
      description={post.excerpt ?? "요약이 없습니다."}
      footer={
        <Link
          href={`/news/${post.slug}`}
          className="mt-6 inline-block text-sm font-medium text-ewha-green-900 hover:underline"
        >
          전체 보기 →
        </Link>
      }
    />
  );
}

export default function NewsExplorer({ newsList }: { newsList: NewsSummary[] }) {
  const [filter, setFilter] = useState<FilterValue>("Announcement");
  const [selectedPost, setSelectedPost] = useState<NewsSummary | null>(null);
  const titleId = useId();

  const counts = useMemo(
    () => ({
      Announcement: newsList.filter((post) => post.category === "Announcement").length,
      Updates: newsList.filter((post) => post.category === "Updates").length,
    }),
    [newsList]
  );

  const filtered = useMemo(
    () => newsList.filter((post) => post.category === filter),
    [newsList, filter]
  );

  return (
    <div>
      <Reveal className="mb-10">
        <FilterToggle
          items={FILTERS.map((f) => ({ ...f, count: counts[f.value] }))}
          value={filter}
          onChange={setFilter}
        />
      </Reveal>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500">해당하는 게시글이 없습니다.</p>
      ) : (
        <YearGroupedAccordion posts={filtered} onSelect={setSelectedPost} />
      )}

      <Modal open={selectedPost !== null} onClose={() => setSelectedPost(null)} titleId={titleId}>
        {selectedPost ? <NewsModalContent post={selectedPost} titleId={titleId} /> : null}
      </Modal>
    </div>
  );
}
