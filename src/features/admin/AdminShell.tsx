"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ADMIN_NAV, type AdminNavGroup, type AdminNavItem } from "./nav";
import "./admin.css";

function isGroup(item: AdminNavItem | AdminNavGroup): item is AdminNavGroup {
  return "items" in item;
}

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function groupOpen(pathname: string, group: AdminNavGroup) {
  return group.items.some((item) => isActive(pathname, item.href));
}

export function AdminShell({
  children,
  staffName,
  roleKey,
}: {
  children: React.ReactNode;
  staffName: string;
  roleKey?: string;
}) {
  const pathname = usePathname() || "/admin";
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    document.documentElement.classList.add("pgs-admin-html");
    document.body.classList.add("pgs-admin-body");
    return () => {
      document.documentElement.classList.remove("pgs-admin-html");
      document.body.classList.remove("pgs-admin-body");
    };
  }, []);

  useEffect(() => {
    const next: Record<string, boolean> = {};
    for (const item of ADMIN_NAV) {
      if (isGroup(item) && groupOpen(pathname, item)) next[item.id] = true;
    }
    setOpenGroups((prev) => ({ ...prev, ...next }));
  }, [pathname]);

  const nav = useMemo(() => {
    return ADMIN_NAV.filter((item) => {
      if (!isGroup(item) && item.superAdminOnly) {
        return roleKey === "super_admin";
      }
      return true;
    });
  }, [roleKey]);

  return (
    <div className="pgs-admin">
      <aside className="pgs-admin__sidebar">
        <div className="pgs-admin__brand">#purpleGuide Admin</div>
        <nav className="pgs-admin__nav" aria-label="Admin">
          {nav.map((item) => {
            if (!isGroup(item)) {
              const active = isActive(pathname, item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={active ? "is-active" : undefined}
                >
                  {item.label}
                </Link>
              );
            }

            const open = openGroups[item.id] ?? groupOpen(pathname, item);
            return (
              <div key={item.id} className="pgs-admin__nav-group">
                <button
                  type="button"
                  className="pgs-admin__nav-group-btn"
                  onClick={() =>
                    setOpenGroups((prev) => ({
                      ...prev,
                      [item.id]: !open,
                    }))
                  }
                >
                  <span>{item.label}</span>
                  <span aria-hidden>{open ? "▾" : "▸"}</span>
                </button>
                {open ? (
                  <div className="pgs-admin__nav-sub">
                    {item.items.map((sub) => {
                      const active = isActive(pathname, sub.href);
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          prefetch={false}
                          className={active ? "is-active" : undefined}
                        >
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </aside>
      <div className="pgs-admin__main">
        <header className="pgs-admin__top">
          <strong>Operations</strong>
          <span>{staffName || "Admin"}</span>
        </header>
        <div className="pgs-admin__content">{children}</div>
      </div>
    </div>
  );
}
