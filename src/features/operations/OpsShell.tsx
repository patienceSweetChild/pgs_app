"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { OPS_NAV } from "./nav";
import "./operations.css";
import "./ops-field-overrides.css";

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function OpsShell({
  children,
  staffName,
  roleKey,
  permissions,
  preview,
  showCmsLink,
}: {
  children: React.ReactNode;
  staffName: string;
  roleKey: string;
  permissions: string[];
  preview?: {
    mode: "student" | "mentor";
    targetName: string;
  } | null;
  showCmsLink?: boolean;
}) {
  const pathname = usePathname() || "/ops";
  const permSet = useMemo(() => new Set(permissions), [permissions]);

  useEffect(() => {
    document.documentElement.classList.add("pgs-ops-html");
    document.body.classList.add("pgs-ops-body");
    return () => {
      document.documentElement.classList.remove("pgs-ops-html");
      document.body.classList.remove("pgs-ops-body");
    };
  }, []);

  useEffect(() => {
    const id = "pgs-ops-field-fix";
    let el = document.getElementById(id) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = `
html.pgs-ops-html .pgs-ops input:not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="hidden"]),
html.pgs-ops-html .pgs-ops select,
html.pgs-ops-html .pgs-ops textarea,
html.pgs-ops-html .pgs-ops button {
  font-family: inherit !important;
}
html.pgs-ops-html .pgs-ops input:not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="hidden"]),
html.pgs-ops-html .pgs-ops select,
html.pgs-ops-html .pgs-ops textarea {
  box-sizing: border-box !important;
  min-height: 38px !important;
  padding: 0.45rem 0.65rem !important;
  text-indent: 0 !important;
}
html.pgs-ops-html .pgs-ops h2 {
  font-size: 1.05rem !important;
}
html.pgs-ops-html .pgs-ops button.pgs-ops__btn {
  width: auto !important;
  display: inline-flex !important;
}
html.pgs-ops-html .pgs-ops .pgs-ops__action-bar .pgs-ops__btn {
  width: 100% !important;
}
html.pgs-ops-html .pgs-ops .pgs-ops__form-toolbar,
html.pgs-ops-html .pgs-ops .pgs-ops__form-inline {
  display: flex !important;
}
`;
    return () => {
      el?.remove();
    };
  }, []);

  const nav = OPS_NAV.filter((item) => {
    if (!permSet.has(item.permission)) return false;
    if (item.mentorHidden && roleKey === "mentor") return false;
    return true;
  });

  return (
    <div className="pgs-ops">
      <aside className="pgs-ops__sidebar">
        <div className="pgs-ops__brand">
          #purple<span>Ops</span>
        </div>
        <nav className="pgs-ops__nav" aria-label="Operations">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={
                isActive(pathname, item.href, item.exact) ? "is-active" : undefined
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="pgs-ops__main">
        {preview ? (
          <div className="pgs-ops__preview-banner">
            <span>
              Previewing as {preview.mode}: {preview.targetName}
            </span>
            <form action="/api/ops/preview" method="post">
              <input type="hidden" name="action" value="clear" />
              <button type="submit" className="pgs-ops__btn pgs-ops__btn--ghost">
                Exit preview
              </button>
            </form>
          </div>
        ) : null}
        <header className="pgs-ops__top">
          <strong>Operations Portal</strong>
          <div className="pgs-ops__top-actions">
            {showCmsLink ? (
              <Link href="/admin" className="pgs-ops__portal-link">
                CMS Admin
              </Link>
            ) : null}
            <span className="pgs-ops__role-badge">{roleKey.replace("_", " ")}</span>
            <span>{staffName}</span>
          </div>
        </header>
        <div className="pgs-ops__content">{children}</div>
      </div>
    </div>
  );
}
