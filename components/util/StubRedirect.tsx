"use client";

import { useEffect } from "react";
import { withBasePath } from "@/lib/site";
import type { SectionId } from "@/lib/sections";

export default function StubRedirect({ anchor }: { anchor: SectionId }) {
  const target = withBasePath(`/#${anchor}`);

  useEffect(() => {
    window.location.replace(target);
  }, [target]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="text-gray-600">이 페이지는 홈페이지로 통합되었습니다.</p>
      <noscript>
        <a href={target} className="mt-4 text-ewha-green-900 underline">
          여기를 눌러 이동하세요
        </a>
      </noscript>
    </div>
  );
}
