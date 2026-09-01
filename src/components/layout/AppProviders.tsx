"use client";

import type { ReactNode } from "react";
import { ExperienceProvider } from "@/lib/auth/experience";

/** Minimal client providers for staff surfaces (login, password reset, etc.). */
export function AppProviders({ children }: { children: ReactNode }) {
  return <ExperienceProvider>{children}</ExperienceProvider>;
}
