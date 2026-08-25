"use client";

import { createContext, useContext } from "react";
import type {
  CmsHighlight,
  CmsTestimonial,
} from "@/lib/catalog/cms-types";

type CmsShellValue = {
  highlights: CmsHighlight[];
  testimonials: CmsTestimonial[];
};

const CmsShellContext = createContext<CmsShellValue>({
  highlights: [],
  testimonials: [],
});

export function CmsShellProvider({
  highlights,
  testimonials,
  children,
}: {
  highlights?: CmsHighlight[];
  testimonials?: CmsTestimonial[];
  children: React.ReactNode;
}) {
  return (
    <CmsShellContext.Provider
      value={{
        highlights: highlights ?? [],
        testimonials: testimonials ?? [],
      }}
    >
      {children}
    </CmsShellContext.Provider>
  );
}

export function useCmsShell() {
  return useContext(CmsShellContext);
}
