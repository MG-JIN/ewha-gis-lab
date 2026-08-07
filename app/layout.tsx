import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Ewha GIS Lab",
  description: "이화여자대학교 공간정보연구실(GIS Lab) 홈페이지",
};

// Reveal 컴포넌트(fade-up 등장 애니메이션)의 no-JS/JS-실패 폴백 장치.
// JS가 실행돼야만 html에 "js-ready" 클래스가 붙고, 그때만 globals.css의
// .reveal 초기 opacity:0 규칙이 적용된다. JS가 아예 안 돌면 클래스가 없으니
// .reveal도 기본값(불투명) 그대로 남아 콘텐츠가 항상 보인다.
const JS_READY_SCRIPT = "document.documentElement.classList.add('js-ready')";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* 임시 브랜드 폰트(Pretendard) CDN. 이화체 웹폰트 도입 시 이 태그를 제거하고
            globals.css의 --font-ewha-brand 값을 'EwhaFont'로 교체하면 됨 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
        <script dangerouslySetInnerHTML={{ __html: JS_READY_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col bg-white text-gray-900 antialiased">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
