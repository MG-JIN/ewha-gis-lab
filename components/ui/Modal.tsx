"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";

export default function Modal({
  open,
  onClose,
  titleId,
  children,
}: {
  open: boolean;
  onClose: () => void;
  titleId: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl focus:outline-none sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-gray-700"
        >
          <span aria-hidden="true" className="text-lg">
            ✕
          </span>
        </button>
        {children}
      </div>
    </div>
  );
}

// Publications/News 모달이 공통으로 쓰는 내부 레이아웃(날짜 → 제목 → 부제 →
// 구분선 → 정보 한 줄 → 소제목+본문). Modal 자체(오버레이/포커스/ESC)는 위
// 컴포넌트가 전담하고, 이 레이아웃은 "내용만 다르게 주입"하는 쪽을 담당한다.
export function ModalDetailLayout({
  titleId,
  meta,
  title,
  subtitle,
  infoLine,
  image,
  link,
  descriptionLabel,
  description,
  footer,
}: {
  titleId: string;
  meta: string;
  title: string;
  subtitle?: string;
  infoLine?: string;
  image?: { src: string; alt: string };
  link?: { label: string; href: string };
  descriptionLabel: string;
  description: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-gray-400">{meta}</p>
      <h2
        id={titleId}
        className="mt-4 text-center text-xl font-bold text-gray-900 sm:text-2xl"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 text-center text-sm text-gray-500">{subtitle}</p>
      ) : null}
      <div className="mx-auto mt-6 h-px w-24 bg-gray-200" />
      {infoLine ? (
        <p className="mt-6 text-center text-sm text-gray-600">{infoLine}</p>
      ) : null}
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={944}
          height={612}
          className="mt-6 h-auto max-w-full rounded-md border border-gray-200"
        />
      ) : null}
      {link ? (
        <p className="mt-6 text-center text-sm">
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ewha-green-900 underline hover:text-ewha-green-700"
          >
            {link.label}
          </a>
        </p>
      ) : null}
      <div className="mt-6">
        <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">
          {descriptionLabel}
        </h3>
        <div className="mt-2 text-sm leading-relaxed text-gray-600">{description}</div>
      </div>
      {footer}
    </div>
  );
}
