# CLAUDE.md

이 문서는 이화여자대학교 공간정보연구실(GIS Lab) 홈페이지 프로젝트에 대한 가이드입니다.
이 저장소에서 작업하는 모든 사람(및 Claude Code)은 아래 규칙을 따릅니다.

## 1. 프로젝트 목적

- 이화여자대학교 공간정보연구실(GIS Lab)의 대외 홍보용 정적 웹사이트
- 연구실 소개(연구 분야 포함), 구성원, 프로젝트, 논문/실적, 공지사항을 제공
- 콘텐츠 갱신(구성원 추가, 논문 등록, 공지 작성 등)이 개발 지식 없이도 쉬워야 함
  → UI 컴포넌트와 콘텐츠 데이터를 분리하는 것이 핵심 설계 원칙

## 2. 기술 스택

- **Next.js 14+ (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **패키지 매니저**: npm
- **배포**: GitHub Pages 정적 배포 (Static Export)
- **언어**: 단일 언어 사이트. 메뉴/제목 등 UI 텍스트는 영어, 본문 콘텐츠(소개글, 논문 정보, 공지 내용 등)는 한국어로 작성. 별도의 다국어(i18n) 라우팅은 사용하지 않음.

### next.config.js 설정 방침

```js
const nextConfig = {
  output: 'export',
  basePath: '/ewha-gis-lab',
  assetPrefix: '/ewha-gis-lab/',
  images: { unoptimized: true },
  trailingSlash: true,
};
```

- 저장소 이름: `ewha-gis-lab` (프로젝트 페이지 방식, `https://<user>.github.io/ewha-gis-lab`)
- 이미지 최적화 서버가 없는 정적 호스팅이므로 `images.unoptimized: true` 필수
- `.github/workflows/deploy.yml`에서 `main` 브랜치 push 시 `npm run build` → `out/` 디렉터리를 GitHub Pages에 배포

## 3. 폴더 구조 규칙

```
ewha-gis-lab/
├── app/
│   ├── layout.tsx              # RootLayout: Header + Footer 포함
│   ├── page.tsx                # 홈
│   ├── about/
│   │   └── page.tsx            # About Us (연구실 소개 + 연구 분야 섹션 포함)
│   ├── members/
│   │   └── page.tsx            # Members
│   ├── projects/
│   │   └── page.tsx            # Projects
│   ├── publications/
│   │   └── page.tsx            # Publications
│   └── news/
│       ├── page.tsx            # News 목록
│       └── [slug]/
│           └── page.tsx        # News 상세 (generateStaticParams 사용)
├── components/
│   ├── layout/                  # Header, Footer, Nav 등 레이아웃 컴포넌트
│   └── ui/                      # 버튼, 카드 등 재사용 가능한 UI 컴포넌트
├── content/
│   ├── members.json
│   ├── publications.json
│   ├── projects.json
│   └── news/
│       └── *.md                 # frontmatter 기반 공지사항 원본
├── lib/                          # content/ 데이터 로딩·파싱 유틸리티
├── public/                       # 이미지, 파비콘 등 정적 자산
├── next.config.js
├── .github/
│   └── workflows/
│       └── deploy.yml
└── CLAUDE.md
```

### 규칙

- 텍스트 콘텐츠(구성원, 논문, 프로젝트, 공지)는 반드시 `content/` 아래 JSON 또는 Markdown으로 관리하고, 컴포넌트 코드에 하드코딩하지 않는다.
- 페이지 컴포넌트(`app/**/page.tsx`)는 `content/`에서 데이터를 불러와 렌더링하는 얇은 레이어로 유지한다.
- 재사용 가능한 UI는 `components/ui/`에, 레이아웃 관련(헤더/푸터/내비게이션)은 `components/layout/`에 둔다.
- 동적 목록(News 상세 등)은 `generateStaticParams`를 사용해 빌드 타임에 정적 페이지로 생성한다.

## 4. 내비게이션 & 페이지 구성

**상단 메뉴 (5개, 영어 라벨):** About Us / Members / Projects는 각각 하위 페이지 2개를 갖는 Header 드롭다운(`▾`)으로 구성된다.

| 메뉴 | 경로 | 내용 |
|---|---|---|
| About Us | `/about` (About Us) · `/about/curriculum` (Curriculum) — 별도 페이지 + 드롭다운 | About Us: 연구실 소개, 지도교수 + **연구 분야 섹션 포함** (연혁 항목 없음) / Curriculum: 학부·대학원 교육과정 소개 |
| Members | `/members` (Current Members) · `/members/alumni` (Alumni) — 별도 페이지 + 드롭다운 | Current Members: 교수/박사·석사과정 등 재학 구성원 — 사진, 이름, 관심분야 / Alumni: 졸업생 소개 |
| Projects | `/projects` (Current Projects) · `/projects/past` (Past Projects) — 별도 페이지 + 드롭다운 | Current Projects: 진행 중 프로젝트 / Past Projects: 완료된 과거 프로젝트 — 지원기관, 기간 |
| Publications | `/publications` | 연도별 논문 목록, 저널/학회 필터 |
| News | `/news` (+ `/news/[slug]`) | 세미나, 채용, 학회 소식 등 공지사항 |

- 홈(`/`)은 별도 랜딩 페이지로 존재하며 상단 로고/사이트 타이틀 클릭 시 이동. 한 줄 소개, 최근 공지, 최근 논문/프로젝트 하이라이트를 담는다.
- **Contact(연락처)는 별도 페이지 없이 Footer에만 노출**한다 (주소, 이메일, 오시는 길 등).

## 5. 콘텐츠 언어 규칙

- 내비게이션 라벨, 섹션 제목, 버튼 텍스트 등 UI 텍스트: 영어
- 실제 소개글, 구성원 설명, 논문 제목/초록, 공지 본문 등 콘텐츠: 한국어
- 예외가 필요한 경우(예: 영문 논문 제목은 원문 그대로 표기) 콘텐츠 작성 시점에 자연스럽게 판단한다.

## 6. 커밋 규칙

### 커밋 단위 분리
- 데이터 변경과 UI/로직 변경은 별도 커밋으로 분리한다.
  - 데이터: `content/*.json`, `content/news/*.md`
  - UI/로직: `components/`, `lib/`, `app/`
  - 기타(스크립트·문서·설정): `scripts/`, `docs/`, `.claude/`, `.github/`
    — 위 두 범주와 섞지 않고 별도 커밋으로 분리한다.
  - 예: 논문 DOI 값 추가(`content/publications.json`)와
    그 값을 보여주는 UI 변경(`components/publications/PublicationsExplorer.tsx`)은 각각 별도 커밋.

- **예외 — 에셋과 참조는 함께 커밋한다.**
  `public/` 아래 이미지·파일을 추가하면서 그것을 가리키는 데이터 필드를
  동시에 채우는 경우는 한 커밋으로 묶는다.
  분리하면 중간 커밋 시점에 참조가 깨진 상태가 남기 때문이다.
  예: 구성원 사진 `public/images/*.webp` 추가 +
      `content/members.json`의 `photo` 필드 입력 → 한 커밋.

### 커밋 메시지
- 형식: `타입: 한국어 설명` 또는 `타입(범위): 한국어 설명` — 범위 표기는 선택이며, 변경 영역을 구체적으로 짚을 때만 붙인다(예: `feat(routing):`, `style(header):`).
- 타입은 영어 소문자, 설명은 한국어로 쓴다.
- 관측된 타입: `feat` `fix` `chore` `data` `content` `style` `docs` `refactor` `perf` `ci`

### 배치 단위
- 콘텐츠 대량 등록 시 7건 내외를 한 커밋으로 묶는다.
  한 커밋이 지나치게 커지면 리뷰와 되돌리기가 어렵다.

### push
- push는 사용자의 명시적 지시가 있을 때만 한다.
  커밋 승인이 push 승인을 포함하지 않는다.
