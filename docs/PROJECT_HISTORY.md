# 이화여대 공간정보연구실(GIS Lab) 홈페이지 — 프로젝트 히스토리

```
작성 기준일: 2026-08-14
기준 커밋: 6a34ca7
갱신 방법: 주요 마일스톤 완료 시 해당 섹션만 수정하고 기준 커밋을 갱신한다.
```

---

## 1. 프로젝트 개요

이화여자대학교 공간정보연구실(GIS Lab)의 대외 홍보용 정적 웹사이트다.

- **스택**: Next.js 16.2.12(App Router) + TypeScript + Tailwind CSS v4(`@theme` 토큰, `tailwind.config.js` 없음)
- **배포**: `output: "export"` 정적 export → GitHub Pages, `basePath: "/ewha-gis-lab"`(`next.config.ts`)
- **배포 파이프라인**: `main` 브랜치 push 시 `.github/workflows/deploy.yml`이 빌드 후 `peaceiris/actions-gh-pages`로 `gh-pages` 브랜치에 게시
- **핵심 설계 원칙**: UI 컴포넌트와 콘텐츠 데이터의 분리 — "연구실 구성원이 개발 지식 없이 콘텐츠를 갱신할 수 있어야" 하므로 텍스트는 전부 `content/`(JSON·Markdown)에 두고 컴포넌트는 읽어서 렌더링만 한다 (`CLAUDE.md`, `.claude/skills/lab-content-entry/SKILL.md:12`)
- **구조**: 현재는 싱글페이지 아키텍처 — 하나의 긴 스크롤 페이지(`app/page.tsx`)에 8개 섹션(Hero/About/People/Projects/Publications/Curriculum/News/Contact)을 배치하고, 과거 개별 라우트(`/about`, `/members` 등)는 클라이언트 사이드 리다이렉트 스텁으로 유지

---

## 2. 개발 타임라인

전체 커밋 93개(2026-08-01 ~ 2026-08-12), `git log --reverse --date=short --pretty=format:"%ad %s"` 기준. 저장소의 첫 커밋이 이미 "basePath 수정"이라 그 이전의 최초 스캐폴딩(예: `create-next-app`) 이력은 이 저장소에 존재하지 않는다 — **확인 필요**(별도 초기화 후 이 저장소에 처음 커밋했을 가능성).

### 마일스톤 1 — 초기 구조 정비 (2026-08-01 ~ 08-03 오전)
- basePath 버그 수정, `next/image` unoptimized 조합에서의 basePath 미적용 버그 수정(`BASE_PATH` 공용 상수 도입)
- 이화그린 공식 컬러 시스템 적용, 헤더에 이화여대 심벌마크·연구실명 로고 추가
- Projects를 `status` 필드 기반 Current/Past로 분리 + 과거 프로젝트 33건 반영, Header 드롭다운 추가
- About Us에서 연혁 삭제, Curriculum 페이지 분리 + Header 드롭다운
- Publications에 Patent 타입 추가 + 특허 5건 반영
- 홈에 Location 섹션(지도+연락처) 추가

### 마일스톤 2 — 콘텐츠 확충 (2026-08-03 ~ 08-04)
- 학부/대학원 커리큘럼 실데이터 반영(Markdown 파이프라인 전환)
- About 페이지 연구실 소개에 사진 추가
- 졸업생 소개를 줄글 → 표 형태로 변경(`AlumniTable.tsx`)
- 진행중 프로젝트 카드에 로드맵 이미지 추가
- 재학 구성원 프로필 사진 추가 (세부는 [4]항 참조)
- 학부 커리큘럼 안내 이미지 추가(최적화 적용)
- News CMS 게시판 1~25번(notice), 1~45번(news) 신규 등록(placeholder로 시작)
- News에 Publications와 동일한 필터 UI 적용

### 마일스톤 3 — 뉴스 본문 대량 보강 (2026-08-04 ~ 08-06)
- `content: 뉴스 게시글 본문 보강` 계열 커밋 다수 — notice-1~25, news-1~60 전 항목을 여러 배치 커밋으로 채움
- 히어로 섹션을 풀블리드 배경 이미지 방식으로 리디자인
- 헤더 로고 폰트/배경색 스타일 조정 다수

### 마일스톤 4 — 싱글페이지 UI 전환 (2026-08-07)
- 싱글페이지용 공용 컴포넌트(`Section`, `Reveal` 등) 및 스크롤 훅 추가
- 상단 헤더 → 고정 사이드바 교체, 싱글 페이지 전환
- 기존 개별 라우트를 메인 섹션 앵커로 리다이렉트(`StubRedirect`)
- 7개 섹션 UI 구현 + 등장 애니메이션 적용
- 논문·뉴스 목록을 연도별 그룹핑 + 상세 모달 연결로 리팩터
- PR #1, #2 머지(`feat/single-page-ui` → `main`)
- 지도교수 Education/Experience 데이터 반영
- 배포 방식을 브랜치(gh-pages) 기반으로 임시 전환(`ci:` 커밋 — 사유는 [7]항 참조)

### 마일스톤 5 — Past Projects 상세화 + Publications 링크 시스템 (2026-08-10 ~ 08-12)
- Past Projects 3건: 아코디언 → 모달 팝업 전환, roadmapImage/description 추가, 대표 이미지 WebP 변환(706KB→61KB)
- People 섹션 교수 블록 정렬·간격 조정
- Publications에 `doi`/`url` 스키마 및 모달 UI 추가
- Crossref/KCI Open API로 journal 44건(Crossref 14 + KCI 30) DOI, KCI 9건 URL 역주입
- conference 8건(ACM SIGSPATIAL, ICA) DOI 역주입
- 위 작업에 쓰인 조회·역주입 스크립트 및 검증 CSV 정리·커밋

---

## 3. 현재 구현 완료 항목

| 영역 | 파일 |
|---|---|
| 싱글페이지 라우팅/섹션 관리 | `lib/sections.ts`, `components/ui/Section.tsx`, `components/ui/SectionVariantContext.tsx` |
| 고정 사이드바(스크롤 스파이 + 모바일 드로어) | `components/layout/Sidebar.tsx`, `lib/useActiveSection.ts` |
| 구 라우트 → 앵커 리다이렉트 스텁 | `components/util/StubRedirect.tsx` |
| 섹션별 콘텐츠 컴포넌트 | `components/sections/{Hero,About,People,Projects,Publications,Curriculum,News,Contact}Section.tsx` |
| Past Projects 모달 | `components/sections/PastProjectsPanel.tsx` |
| 공용 UI: 모달/아코디언/탭/스크롤 리빌 | `components/ui/{Modal,Accordion,Tab,Reveal,Card,SectionHeader}.tsx`, `lib/useScrollReveal.ts` |
| 논문 탐색기(연도별 그룹핑, 필터, DOI/URL 링크) | `components/publications/PublicationsExplorer.tsx` |
| 뉴스 탐색기(연도별 그룹핑, 필터) | `components/news/NewsExplorer.tsx` |
| 콘텐츠 데이터 로딩 계층 | `lib/{members,projects,publications,news,curriculum}.ts` |
| basePath 유틸 | `lib/site.ts` |

---

## 4. 데이터 현황

| 파일 | 총 건수 | 세부 |
|---|---|---|
| `content/members.json` | 45 | 지도교수 1 · 재학 12(박사 2, 석박사통합과정 1, 석사과정 8, 학·석사연계과정 1) · 졸업생 32(박사 4, 석사 28) [^1] |
| `content/projects.json` | 37 | ongoing 1 / completed 36 · description 보유 4건(33건 미보유) [^2] |
| `content/publications.json` | 202 | journal 98(doi 44 · url 9 · 링크없음 45) / conference 99(doi 8 · 링크없음 91) / patent 5(전부 링크없음) [^3] |
| `content/news/*.md` | 100 | `news-*.md` 60 / `notice-*.md` 40 [^4] |

[^1]: `node -e "const m=require('./content/members.json'); /* role/category별 reduce 집계 */"` — 구성원 개인 실명·이메일은 본 문서에 옮기지 않고 인원수·학위과정 분포만 기재함.
[^2]: `node -e "const p=require('./content/projects.json'); p.filter(x=>x.status===...).length / p.filter(x=>!x.description).length"`
[^3]: `node -e "const p=require('./content/publications.json'); p.filter(x=>x.type===...).length, .filter(x=>x.doi), .filter(x=>x.url)"`
[^4]: `ls content/news | grep -c "^news-"` / `ls content/news | grep -c "^notice-"`

---

## 5. 개발 하네스

| 구성요소 | 역할 |
|---|---|
| `CLAUDE.md` | 프로젝트 전역 규칙(스택, 폴더 구조, 내비게이션, 언어 규칙) + "하네스: 연구실 홈페이지 운영" 섹션(`gis-lab-orchestrator` 스킬 호출 트리거, 변경 이력 표) |
| `.claude/skills/gis-lab-orchestrator/` | 콘텐츠 등록·UI 구현·자산 최적화·배포 검증을 여러 에이전트로 나눠 조율하는 오케스트레이터. 작업 전 `git status` 확인, 자산→콘텐츠→검증 순서 의존성, 커밋은 사용자 요청 시에만 수행 등을 규정 |
| `.claude/skills/lab-content-entry/` | 구성원/논문/프로젝트/공지 등 `content/` 데이터 등록·수정 절차 |
| `.claude/skills/lab-deploy-check/` (+ `scripts/check-static-links.mjs`) | 빌드·정적 export·링크 무결성·접근성 검증. `out/`의 모든 HTML을 훑어 404/`NO_BASE`(basePath 누락)/고아 자산을 전수 검사 |
| `.claude/skills/lab-image-pipeline/` (+ `scripts/optimize-image.mjs`) | 이미지 WebP/AVIF 변환, 자산 최적화(정적 호스팅이라 `images.unoptimized: true`이므로 원본 용량이 그대로 전송됨) |
| `.claude/skills/lab-ui-components/` | 섹션/컴포넌트 구현, basePath·컬러 토큰 등 UI 작업 규칙 |
| `.claude/agents/{asset-optimizer,content-curator,release-qa,web-builder}.md` | 오케스트레이터가 호출하는 전문 서브에이전트 정의 |
| `scripts/*.mjs`, `scripts/*.csv` | Crossref/KCI Open API를 통한 논문 DOI·원문링크 조회 및 `content/publications.json`으로의 역주입 스크립트, 검증용 CSV |
| `.agents/skills/source-command-summarize-webwork/` | **미추적(untracked) 상태 — 용도 및 `.claude/commands/summarize-webwork.md`와의 관계 확인 필요** |

---

## 6. 프로젝트 고유 제약사항

이 프로젝트에서 반드시 지켜야 하는 규칙과 근거.

1. **이미지·내부 링크 `src`에는 `withBasePath()`를 반드시 적용한다.**
   근거: `lib/site.ts:1-5`(`BASE_PATH`/`withBasePath()` 정의), `.claude/skills/lab-ui-components/SKILL.md:31`, `.claude/agents/web-builder.md:23`, `.claude/skills/lab-deploy-check/SKILL.md:67`.
   이유: 정적 export는 `basePath`를 컴포넌트 코드에 자동으로 적용해주지 않는다. 하드코딩한 `/images/foo.png`는 **로컬 개발 서버에서는 정상 동작하고 배포 후에만 404**가 난다.

2. **아코디언(펼침) 콘텐츠 내부에는 `Reveal`을 걸지 않는다 — 항상 열려 있는 헤더에만 건다.**
   근거: `components/publications/PublicationsExplorer.tsx:94-96`, `components/news/NewsExplorer.tsx:67-69`의 코드 주석 — "Reveal을 콘텐츠 안에 두면 열 때마다 매번 다시 관찰(observe)-소멸을 반복하게 된다."
   이유: `Accordion`은 닫힌 항목의 콘텐츠를 DOM에서 unmount한다. 그 안에 `IntersectionObserver` 기반 `Reveal`을 두면 열고 닫을 때마다 재관찰이 반복된다.
   비고: CLAUDE.md·SKILL.md류의 "공식 규칙" 문서에는 명문화돼 있지 않고, 실제 구현 파일의 코드 주석에서만 확인됨.

3. **`content/publications.json`(및 `projects.json`)은 전체 재직렬화(JSON.stringify pretty-print) 금지 — 줄 단위 텍스트 삽입만 사용한다.**
   근거: `scripts/apply-doi.mjs:4-5`, `scripts/apply-kci.mjs:6-7`, `scripts/apply-conf-doi.mjs:9-10`의 주석 — "항목이 한 줄로 저장돼 있어 JSON.parse 후 재직렬화하면 전체 항목의 포맷이 바뀌어버린다."
   이유: 파일이 항목당 한 줄(non-pretty-printed) 포맷이라, 전체 재직렬화 시 `git diff`가 수백 줄로 오염돼 실제 변경 내용을 알아볼 수 없게 된다.

4. **데이터 변경 커밋과 UI 변경 커밋을 분리한다.**
   **근거 미확인** — `CLAUDE.md`·`.claude/skills/*`·`.claude/agents/*` 어디에도 이를 명문화한 규칙은 찾지 못함. 다만 `git log`상 `data:`/`content:` 접두사 커밋과 `feat:`/`style:`/`refactor:` 접두사 커밋이 실제로 분리되어 있는 관행은 관찰됨(예: 마일스톤 5의 "Publications 모달에 DOI/원문 링크 표시 기능 추가(스키마+UI)"와 "journal 14건 DOI 추가"가 별도 커밋).

5. **배포 전 `check-static-links.mjs`로 basePath 누락·404·고아 자산을 검증한다.**
   근거: `.claude/skills/lab-deploy-check/scripts/check-static-links.mjs:1-13`(스크립트 상단 주석), `.claude/skills/lab-deploy-check/SKILL.md:40-58`.
   이유: `out/`의 모든 HTML을 정적으로 훑어 basePath 빠진 절대경로(`NO_BASE`)를 전수 검사한다 — 이런 버그는 "로컬 개발 서버에서는 정상 동작하고 배포 후에만 깨지는" 가장 놓치기 쉬운 부류이기 때문.

---

## 7. 미완료 / 알려진 이슈

- **배포 방식 임시 전환**: `.github/workflows/deploy.yml` 상단 주석 — `actions/deploy-pages`(배포 API) 방식이 deploy job에서 매번 ~10분 지점에 원인 불명 타임아웃/실패가 반복되어, GitHub Support 회신을 받을 때까지 브랜치(gh-pages) 기반 배포로 임시 전환한 상태. 원래 방식은 `deploy.yml.bak`에 보존돼 있으며 **문제 해결 후 원복 필요**.
- **콘텐츠 공백**: publications 202건 중 199건, projects 37건 중 33건에 `description`이 없어 모달에 "내용이 준비 중입니다" placeholder가 노출됨(`components/publications/PublicationsExplorer.tsx:135,165,178`, `components/sections/PastProjectsPanel.tsx:79`).
- **논문 원문링크 미완성**: journal 45건 · conference 91건 · patent 5건에 doi/url 없음. conference 국내 79건은 KCI 등록 여부 5건 샘플 테스트를 사용자가 로컬에서 진행하기로 한 상태로 결과 미회신(직전 대화 기준) — 확대 적용 여부 미결.
- **임시 폰트**: `app/layout.tsx:25-26` 주석 — Pretendard를 CDN으로 임시 적용 중이며, 이화체 웹폰트 도입 시 교체 예정이라고 명시돼 있음.
- **접근성(명도 대비) 기존 이슈**: `docs/badge-contrast-todo.md` — `ewha-blue`(3.74) · `ewha-mint`(4.16) · `ewha-coral`(3.89) 뱃지 배색이 WCAG AA 4.5:1 기준 미달로 남아있음. 브랜드 팔레트 자체를 건드려야 해서 의도적으로 분리해둔 사안(`.claude/skills/lab-deploy-check/SKILL.md:80-88`).
- **`StubRedirect` 기반 구 라우트는 서버/빌드타임 리다이렉트가 아닌 클라이언트 사이드 리다이렉트다 (확정, SEO 영향 있음)**: `/about`, `/members`, `/members/alumni`, `/projects`, `/projects/past`, `/publications`, `/news`, `/about/curriculum` 8개 구 라우트(`app/about/page.tsx`, `app/members/page.tsx`, `app/members/alumni/page.tsx`, `app/projects/page.tsx`, `app/projects/past/page.tsx`, `app/publications/page.tsx`, `app/news/page.tsx`, `app/about/curriculum/page.tsx`)는 전부 `<StubRedirect anchor="..." />` 하나만 렌더링하는 동일한 얇은 래퍼이며, 서버 사이드 로직(`redirect()`, `generateMetadata` 등)이 전혀 없다. 실제 리다이렉트는 `components/util/StubRedirect.tsx:10-12`의 `useEffect(() => { window.location.replace(target); }, [target])`로만 수행되는 **순수 클라이언트 사이드** 처리다. `next.config.ts`에는 `redirects()` 설정 자체가 없으며, `output: "export"`(정적 export) 구성에서는 이 옵션이 애초에 동작하지 않는다.
  JS를 실행하지 않는 크롤러에는 `StubRedirect.tsx:17-21`의 `<noscript>` 안 링크 하나(`이 페이지는 홈페이지로 통합되었습니다` + 이동 링크)만 노출되고, 서버 측 301/308이나 `<meta http-equiv="refresh">`는 존재하지 않는다. 즉 구 URL 8개는 각각 200 OK로 응답하는 별도의 얇은 페이지로 남아 검색엔진에 노출될 수 있고, 이전 URL의 색인 신호(백링크 등)가 새 앵커(`/#about` 등)로 이전되는지는 크롤러의 JS 실행·클라이언트 리다이렉트 해석 방식에 달려 있다.
  다만 이 영향이 실제 검색 순위·색인에 얼마나 반영되는지(구글 Search Console 등에서 관측되는 실측치)는 배포된 사이트에 대한 외부 도구 확인이 필요해 이 저장소의 코드만으로는 판단할 수 없다 — **그 실측 확인은 여전히 확인 필요**로 남긴다.
- **`sitemap.xml` / `robots.txt` / 404 페이지 부재**: `app/`·`public/` 전체를 검색한 결과 `sitemap.xml`, `robots.txt`, `app/not-found.tsx` 어디에도 존재하지 않음(코드로 확인, 파일 없음).
- **반응형(모바일) 대응**: `app/`·`components/` 내 `.tsx` 37개 중 11개 파일에서 Tailwind 반응형 브레이크포인트(`sm:`/`md:`/`lg:`, 총 39회: sm 18·md 16·lg 5)를 사용 중이며, `components/layout/Sidebar.tsx`에는 별도의 모바일 드로어 상태(`mobileOpen`)와 `aria-expanded`/`aria-controls` 속성이 구현돼 있음. 다만 37개 파일 중 26개는 브레이크포인트를 전혀 쓰지 않아 **전체 섹션에 걸친 반응형 적용 범위는 파일 단위로만 확인했을 뿐 실제 화면별 검증(실기기·뷰포트 테스트)은 이 문서의 근거 범위 밖**임.
- **미추적 파일들**: `.agents/`, `public/images/c1.png`, `public/files/2020 공간데이터 분석 및 시각화 경진대회 안내문.hwp` — git에 아직 add되지 않은 상태, 용도·커밋 필요 여부 확인 필요.
- **`CLAUDE.md` 변경사항 미커밋**: "하네스" 섹션이 장기간 unstaged 상태로 남아 있음 — 의도적 보류인지 확인 필요.

---

## 8. 다음 단계 후보

- Publications/Projects `description` 공백 채우기
- Conference 국내 79건 KCI 등록 여부 조사 완료 후 확대 적용 여부 결정
- GitHub Pages 배포 방식 원복(`deploy.yml.bak` 참고) 여부 — GitHub Support 회신 대기 중
- `sitemap.xml`/`robots.txt` 추가 여부 및 `StubRedirect`의 검색 인덱싱 영향 확인
- `.agents/` 디렉터리 정리 또는 커밋 여부 결정
- 뱃지 명도 대비(AA 미달 3건) 브랜드 팔레트 조정 여부
