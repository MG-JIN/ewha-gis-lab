import Link from "next/link";
import { withBasePath } from "@/lib/site";

const TEXT_SHADOW = "0 2px 10px rgba(0,0,0,0.45)";

export default function Hero() {
  return (
    <section className="relative flex h-[60vh] min-h-[420px] items-start overflow-hidden sm:h-[70vh] lg:h-[80vh]">
      {/*
        배경 이미지: AVIF 우선 적용. 현재 대체 포맷(.jpg/.webp) 원본 파일이
        없어 <picture>의 <img> fallback도 동일한 AVIF 파일을 가리킴 — 구형
        브라우저 대응이 필요해지면, 아래 <source>보다 "뒤"에 예:
        <source srcSet={withBasePath("/images/hero2.webp")} type="image/webp" />
        와 img의 src를 .jpg 등으로 추가/교체하면 자동으로 폴백된다.
      */}
      <picture className="absolute inset-0 h-full w-full">
        <source srcSet={withBasePath("/images/hero2.avif")} type="image/avif" />
        <img
          src={withBasePath("/images/hero2.avif")}
          alt="이화여자대학교 공간정보연구실 — 어두운 배경의 지도 시각화"
          className="h-full w-full object-cover"
        />
      </picture>

      {/*
        방향성 오버레이: 텍스트가 위치하는 좌측 하단은 어둡게, 사진이 밝게
        보여야 하는 우측 상단은 거의 투명하게. (요청하신 예시는 135deg였으나
        135deg는 실제로는 좌상단이 어둡고 우하단이 밝아지는 방향이라, 의도한
        "좌하단 어둡게/우상단 밝게" 효과를 내기 위해 45deg로 조정함 — 색상·
        불투명도 값은 요청하신 그대로 유지)
      */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(45deg, rgba(10,20,40,0.5) 0%, rgba(10,20,40,0.15) 60%, rgba(10,20,40,0.05) 100%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-5xl px-6 pt-10 sm:pt-14 lg:pt-16">
        <div className="inline-block max-w-xl rounded-2xl bg-[rgba(10,20,40,0.35)] px-6 py-6 sm:px-8 sm:py-8">
          <h1
            className="text-4xl leading-[1.2] font-extrabold text-white sm:text-5xl lg:text-6xl"
            style={{ textShadow: TEXT_SHADOW }}
          >
            공간정보연구실
          </h1>
          <p
            className="mt-2 text-lg font-medium text-white"
            style={{ textShadow: TEXT_SHADOW, letterSpacing: "0.18em" }}
          >
            Geographic Information Science Lab
          </p>
          <p
            className="mt-4 text-base text-white sm:text-lg"
            style={{ textShadow: TEXT_SHADOW }}
          >
            이화여자대학교 공간정보연구실은 공간정보시스템(GIS), 원격탐사, 도시·교통
            공간분석을 중심으로 공간 데이터를 활용한 사회 문제 해결 연구를 수행합니다.
          </p>
          <Link
            href="/about"
            className="mt-6 inline-block rounded-md border-2 border-white px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-ewha-green-900"
            style={{ textShadow: TEXT_SHADOW }}
          >
            About Lab
          </Link>
        </div>
      </div>
    </section>
  );
}
