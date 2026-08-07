"use client";

import type { CSSProperties, ReactNode } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";

export default function Reveal({
  children,
  className,
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const style: CSSProperties | undefined = delayMs
    ? { transitionDelay: `${delayMs}ms` }
    : undefined;

  return (
    <div
      ref={ref}
      style={style}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
