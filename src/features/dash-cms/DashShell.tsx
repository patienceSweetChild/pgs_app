"use client";

import { useEffect, type ReactNode } from "react";
import "@/features/admin/admin.css";
import "@/features/admin/admin-field-overrides.css";

export function DashShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("pgs-admin-html");
    document.body.classList.add("pgs-admin-body");
    return () => {
      document.documentElement.classList.remove("pgs-admin-html");
      document.body.classList.remove("pgs-admin-body");
    };
  }, []);

  return <div className="pgs-admin pgs-admin--bare">{children}</div>;
}
