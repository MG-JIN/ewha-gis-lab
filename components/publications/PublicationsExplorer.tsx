"use client";

import { useId, useMemo, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import Accordion from "@/components/ui/Accordion";
import Modal, { ModalDetailLayout } from "@/components/ui/Modal";
import {
  groupPublicationsByYear,
  type Publication,
  type PublicationType,
} from "@/lib/publications";

const TYPE_LABEL: Record<PublicationType, string> = {
  journal: "Journal",
  conference: "Conference",
  patent: "Patent",
};

// 뱃지에 얇은 흰 테두리(ring)를 둘러 배경(흰 섹션/틴트 섹션)과 무관하게
// 항상 동일한 방식으로 도드라져 보이도록 통일했다.
const TYPE_BADGE_CLASS: Record<PublicationType, string> = {
  journal: "bg-ewha-yellow-green text-ewha-green-900 ring-1 ring-white",
  conference: "bg-ewha-mint text-ewha-green-900 ring-1 ring-white",
  patent: "bg-ewha-coral text-ewha-green-900 ring-1 ring-white",
};

const FILTERS: { value: PublicationType; label: string }[] = [
  { value: "journal", label: "Journal" },
  { value: "conference", label: "Conference" },
  { value: "patent", label: "Patent" },
];

function Badge({ type }: { type: PublicationType }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${TYPE_BADGE_CLASS[type]}`}
    >
      {TYPE_LABEL[type]}
    </span>
  );
}

// 목록 항목 공통: hover 시 행 전체 폭 배경이 흰색으로 바뀌고 클릭 가능함을
// cursor-pointer로 알린다 (클릭하면 상세 모달이 열림).
const ROW_BUTTON_CLASS =
  "block w-full rounded-md px-3 py-3 text-left transition-colors hover:bg-white cursor-pointer";

function JournalConferenceItem({
  pub,
  onSelect,
}: {
  pub: Publication;
  onSelect: (pub: Publication) => void;
}) {
  return (
    <li className="border-b border-gray-100 last:border-none">
      <button type="button" onClick={() => onSelect(pub)} className={ROW_BUTTON_CLASS}>
        <Badge type={pub.type} />
        <p className="mt-2 text-sm text-gray-600">
          {pub.authors} · ({pub.year})
        </p>
        <p className="mt-1 font-medium text-gray-900">&ldquo;{pub.title}&rdquo;</p>
        {pub.venue ? <p className="mt-1 text-sm text-gray-500 italic">{pub.venue}</p> : null}
      </button>
    </li>
  );
}

function PatentItem({
  pub,
  onSelect,
}: {
  pub: Publication;
  onSelect: (pub: Publication) => void;
}) {
  return (
    <li className="border-b border-gray-100 last:border-none">
      <button type="button" onClick={() => onSelect(pub)} className={ROW_BUTTON_CLASS}>
        <Badge type={pub.type} />
        <p className="mt-2 font-medium text-gray-900">{pub.titleKo}</p>
        {pub.titleEn ? <p className="mt-1 text-sm text-gray-500">{pub.titleEn}</p> : null}
        <p className="mt-1 text-sm text-gray-600">
          {pub.authors} · {pub.date}
        </p>
        {pub.description ? (
          <p className="mt-2 text-sm text-gray-600">{pub.description}</p>
        ) : null}
      </button>
    </li>
  );
}

// 아코디언은 "닫힌 연도"의 콘텐츠를 DOM에서 아예 제거(unmount)하기 때문에
// Reveal을 콘텐츠 안에 두면 열 때마다 매번 다시 관찰(observe)-소멸을 반복하게
//된다. 그래서 Reveal은 항상 열려 있는 "헤더(연도 줄)"에만 걸고, 펼침
// 콘텐츠 자체는 Reveal 대상에서 제외했다.
function YearGroupedAccordion({
  publications,
  onSelect,
}: {
  publications: Publication[];
  onSelect: (pub: Publication) => void;
}) {
  const grouped = useMemo(() => groupPublicationsByYear(publications), [publications]);

  if (grouped.length === 0) return null;

  return (
    <Accordion
      defaultOpenIndex={0}
      items={grouped.map(([year, pubs], i) => ({
        key: String(year),
        title: (
          <Reveal delayMs={Math.min(i, 2) * 60}>
            <h4 className="text-xl font-bold text-ewha-green-900">
              {year}
              <span className="ml-2 text-sm font-normal text-gray-400">({pubs.length})</span>
            </h4>
          </Reveal>
        ),
        content: (
          <ul className="space-y-1">
            {pubs.map((pub) => (
              <JournalConferenceItem key={pub.id} pub={pub} onSelect={onSelect} />
            ))}
          </ul>
        ),
      }))}
    />
  );
}

function PublicationModalContent({
  pub,
  titleId,
}: {
  pub: Publication;
  titleId: string;
}) {
  if (pub.type === "patent") {
    return (
      <ModalDetailLayout
        titleId={titleId}
        meta={pub.date ?? ""}
        title={pub.titleKo ?? ""}
        subtitle={pub.titleEn}
        infoLine={pub.authors}
        descriptionLabel="Description"
        description={pub.description ?? "내용이 준비 중입니다."}
      />
    );
  }

  return (
    <ModalDetailLayout
      titleId={titleId}
      meta={`(${pub.year})`}
      title={pub.title ?? ""}
      infoLine={[pub.authors, pub.venue].filter(Boolean).join(" · ")}
      descriptionLabel="Description"
      description="내용이 준비 중입니다."
    />
  );
}

export default function PublicationsExplorer({
  publications,
}: {
  publications: Publication[];
}) {
  const [filter, setFilter] = useState<PublicationType>("journal");
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null);
  const titleId = useId();

  const counts = useMemo(
    () => ({
      journal: publications.filter((pub) => pub.type === "journal").length,
      conference: publications.filter((pub) => pub.type === "conference").length,
      patent: publications.filter((pub) => pub.type === "patent").length,
    }),
    [publications]
  );

  const byType = useMemo(() => {
    const map: Record<PublicationType, Publication[]> = {
      journal: [],
      conference: [],
      patent: [],
    };
    for (const pub of publications) {
      map[pub.type].push(pub);
    }
    return map;
  }, [publications]);

  return (
    <div>
      <Reveal className="mb-10 flex flex-wrap justify-center gap-2">
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
      </Reveal>

      <div>
        {(() => {
          const pubs = byType[filter];
          if (pubs.length === 0) {
            return <p className="text-sm text-gray-500">해당하는 실적이 없습니다.</p>;
          }
          return (
            <div>
              <Reveal>
                <h3 className="mb-6 text-2xl font-bold text-gray-900 uppercase">
                  {TYPE_LABEL[filter]}
                </h3>
              </Reveal>
              {filter === "patent" ? (
                <Reveal>
                  <ul className="space-y-1">
                    {pubs.map((pub) => (
                      <PatentItem key={pub.id} pub={pub} onSelect={setSelectedPub} />
                    ))}
                  </ul>
                </Reveal>
              ) : (
                <YearGroupedAccordion publications={pubs} onSelect={setSelectedPub} />
              )}
            </div>
          );
        })()}
      </div>

      <Modal open={selectedPub !== null} onClose={() => setSelectedPub(null)} titleId={titleId}>
        {selectedPub ? <PublicationModalContent pub={selectedPub} titleId={titleId} /> : null}
      </Modal>
    </div>
  );
}
