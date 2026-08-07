"use client";

import { useSectionVariant } from "@/components/ui/SectionVariantContext";

// 짧은 구분선 톤. tint(#e1f4ec) 배경 위에서는 옅은 회색이 거의 묻혀
// 보이지 않아 variant별로 한 단계 더 진한 톤을 사용한다.
const DIVIDER_CLASS = {
  plain: "bg-gray-300",
  tint: "bg-gray-400",
};

export default function SectionHeader({
  index,
  title,
}: {
  index: number;
  title: string;
}) {
  const variant = useSectionVariant();
  const number = String(index + 1).padStart(2, "0");

  return (
    <div className="mb-16 flex flex-col items-center text-center">
      <span className="text-5xl font-bold text-ewha-green-900 sm:text-6xl">{number}</span>
      <h2 className="mt-4 text-2xl font-bold tracking-wide text-gray-900 uppercase sm:text-3xl">
        {title}
      </h2>
      <span className={`mt-6 h-px w-36 sm:w-40 ${DIVIDER_CLASS[variant]}`} />
    </div>
  );
}
