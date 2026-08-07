import { withBasePath } from "@/lib/site";

const TEXT_SHADOW = "0 2px 10px rgba(0,0,0,0.45)";

const HASHTAGS = ["#GeoAI", "#Geospatial Information and GIS", "#Spatial Big Data Analysis"];

export default function HeroSection() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden bg-ewha-green-900"
    >
      <picture className="absolute inset-0 h-full w-full">
        <source srcSet={withBasePath("/images/hero-bg.avif")} type="image/avif" />
        <img
          src={withBasePath("/images/hero-bg.avif")}
          alt="이화여자대학교 공간정보연구실 — 도시 항공뷰"
          className="h-full w-full object-cover"
        />
      </picture>

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-24 text-center">
        <h1
          className="text-[clamp(2.5rem,6vw,6rem)] leading-[1.1] font-bold text-white"
          style={{ textShadow: TEXT_SHADOW }}
        >
          Geographic Information
          <br />
          Science Lab
        </h1>

        <p
          className="mt-6 text-base font-medium tracking-[0.2em] text-gray-200 sm:text-lg"
          style={{ textShadow: TEXT_SHADOW }}
        >
          EWHA WOMANS UNIVERSITY
        </p>

        <span className="mt-10 h-px w-full max-w-md bg-white/30" />

        <p
          className="mt-10 max-w-2xl text-lg leading-relaxed font-light text-gray-100 sm:text-xl"
          style={{ textShadow: TEXT_SHADOW }}
        >
          Our research focuses on solving social problems using spatial data,
          <br />
          with an emphasis on Geographic Information Systems (GIS),
          <br />
          remote sensing, and urban and transportation spatial analysis.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {HASHTAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/40 bg-black/30 px-4 py-1.5 text-sm text-gray-100"
            >
              {tag}
            </span>
          ))}
        </div>

        <a
          href="#about"
          aria-label="About 섹션으로 스크롤"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 transition-colors hover:text-white"
        >
          <span className="block animate-bounce text-2xl" aria-hidden="true">
            ↓
          </span>
        </a>
      </div>
    </section>
  );
}
