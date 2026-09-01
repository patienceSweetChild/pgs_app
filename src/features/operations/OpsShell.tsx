"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { OPS_NAV } from "./nav";
import { AskPgsPanel } from "./components/AskPgsPanel";
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
  showDashLink,
  notificationUnreadCount = 0,
  aiEnabled = false,
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
  showDashLink?: boolean;
  notificationUnreadCount?: number;
  aiEnabled?: boolean;
}) {
  const pathname = usePathname() || "/ops";
  const router = useRouter();
  const permSet = useMemo(() => new Set(permissions), [permissions]);
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<
    Array<{
      domain: string;
      label: string;
      results: Array<{ id: string; label: string; description: string; href: string }>;
    }>
  >([]);

  useEffect(() => {
    document.documentElement.classList.add("pgs-ops-html");
    document.body.classList.add("pgs-ops-body");
    return () => {
      document.documentElement.classList.remove("pgs-ops-html");
      document.body.classList.remove("pgs-ops-body");
    };
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setGroups([]);
      return;
    }
    const handle = window.setTimeout(() => {
      void fetch(`/api/staff/search?q=${encodeURIComponent(query)}`)
        .then((response) => response.json())
        .then((payload) => setGroups(payload.groups ?? []))
        .catch(() => setGroups([]));
    }, 220);
    return () => window.clearTimeout(handle);
  }, [query]);

  const nav = OPS_NAV.filter((item) => {
    const keys = item.anyOf ?? (item.permission ? [item.permission] : []);
    if (keys.length && !keys.some((key) => permSet.has(key))) return false;
    if (item.mentorHidden && (roleKey === "mentor" || preview?.mode === "mentor")) return false;
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
              className={isActive(pathname, item.href, item.exact) ? "is-active" : undefined}
            >
              {item.label}
              {item.href === "/ops/notifications" && notificationUnreadCount > 0 ? (
                <span className="pgs-ops__nav-badge">{notificationUnreadCount}</span>
              ) : null}
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
          <div className="pgs-ops__search">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search students, staff, work"
              aria-label="Search operations"
            />
            {groups.length ? (
              <div className="pgs-ops__search-results">
                {groups.map((group) => (
                  <section key={group.domain}>
                    <p>{group.label}</p>
                    {group.results.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => {
                          setQuery("");
                          setGroups([]);
                          router.refresh();
                        }}
                      >
                        <strong>{item.label}</strong>
                        <span>{item.description}</span>
                      </Link>
                    ))}
                  </section>
                ))}
              </div>
            ) : null}
          </div>
          <div className="pgs-ops__top-actions">
            {aiEnabled ? <AskPgsPanel /> : null}
            {showDashLink ? (
              <Link href="/dash" className="pgs-ops__portal-link">
                Dashboard CMS
              </Link>
            ) : null}
            {showCmsLink ? (
              <Link href="/admin" className="pgs-ops__portal-link">
                CMS Admin
              </Link>
            ) : null}
            <span className="pgs-ops__role-badge">{roleKey.replaceAll("_", " ")}</span>
            <span>{staffName}</span>
          </div>
        </header>
        <div className="pgs-ops__content">{children}</div>
      </div>
    </div>
  );
}
