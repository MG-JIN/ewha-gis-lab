import type { ReactNode } from "react";
import { SectionVariantProvider } from "@/components/ui/SectionVariantContext";
import type { SectionVariant } from "@/lib/sections";

const VARIANT_BG: Record<SectionVariant, string> = {
  plain: "bg-white",
  tint: "bg-section-tint",
};

export default function Section({
  id,
  variant,
  children,
  className,
}: {
  id?: string;
  variant: SectionVariant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`${VARIANT_BG[variant]} py-24 ${className ?? ""}`}>
      <SectionVariantProvider value={variant}>
        <div className="mx-auto max-w-5xl px-6">{children}</div>
      </SectionVariantProvider>
    </section>
  );
}
