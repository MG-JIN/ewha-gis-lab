"use client";

import { createContext, useContext } from "react";
import type { SectionVariant } from "@/lib/sections";

const SectionVariantContext = createContext<SectionVariant>("plain");

export const SectionVariantProvider = SectionVariantContext.Provider;

export function useSectionVariant(): SectionVariant {
  return useContext(SectionVariantContext);
}
