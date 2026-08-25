"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { useExperience, DEFAULT_AVATAR } from "@/lib/auth/experience";
import { SIDEBAR_LINKS, UNIVMEET } from "@/lib/content/univmeet";
import { useShellUi } from "./shell-ui";
import "./sidebar-extras.css";

function pathActive(pathname: string, target: string) {
  return pathname.toLowerCase() === target.toLowerCase();
}

function LoginRequiredPopup({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={`pgs-login-popup-overlay${open ? " show" : ""}`}
      id="pgsLoginPopup"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="pgs-login-popup-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pgsLoginPopupTitle"
      >
        <button
          type="button"
          className="pgs-login-popup-close"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="pgs-login-popup-icon">
          <i className="bi bi-lock-fill" />
        </div>
        <h4 id="pgsLoginPopupTitle">Login Required</h4>
        <p>Please login to access this option.</p>
        <Link href="/login" className="pgs-login-popup-btn" onClick={onClose}>
          Login Now
        </Link>
      </div>
    </div>
  );
}

function UnivMeetWidget({ meet }: { meet: typeof UNIVMEET }) {
  return (
    <Link href={meet.href} className="date-box pgs-univmeet-link">
      <h5>#univMeet</h5>
      <div className="box-date-info pgs-univmeet-slot">
        <span className="date">{meet.slot1_date}</span>
        <span className="month">{meet.slot1_month}</span>
      </div>
      <div className="box-date-info pgs-univmeet-slot">
        <span className="date">{meet.slot2_date}</span>
        <span className="month">{meet.slot2_month}</span>
      </div>
    </Link>
  );
}

export function Sidebar({
  univMeet,
}: {
  univMeet?: typeof UNIVMEET;
} = {}) {
  const pathname = usePathname();
  const { isLoggedIn, logout, fullName, avatarUrl } = useExperience();
  const { mobileDrawerOpen, closeMobileDrawer } = useShellUi();
  const [panelOpen, setPanelOpen] = useState(false);
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  const [mobilePpOpen, setMobilePpOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const meet = univMeet ?? UNIVMEET;

  const displayName = isLoggedIn
    ? fullName?.trim() || "Student"
    : "Aspirant";
  const avatarSrc = avatarUrl || DEFAULT_AVATAR;

  useEffect(() => {
    closeMobileDrawer();
    setPanelOpen(false);
    setMobilePpOpen(false);
    setMobileExploreOpen(false);
  }, [pathname, closeMobileDrawer]);

  function requireAuth(e: MouseEvent) {
    if (isLoggedIn) return;
    e.preventDefault();
    setLoginPopupOpen(true);
  }

  function togglePanel() {
    setPanelOpen((v) => !v);
  }

  return (
    <>
      <div
        className={`overlay${mobileDrawerOpen ? " active" : ""}`}
        id="overlay"
        onClick={closeMobileDrawer}
      />

      <LoginRequiredPopup
        open={loginPopupOpen}
        onClose={() => setLoginPopupOpen(false)}
      />

      <section className="pt-1 pb-0 mobile-frame-sidebar">
        <div className="container-fluid px-4">
          <div
            className={`arrow-box sidebar-box${panelOpen ? " active" : ""}`}
            id="sidebar"
          >
            <div className="d-flex justify-content-space align-items-start">
              <h5 className="pt-13 text-black fs-48 fnt-family text-start">
                Welcome <br />
                {displayName}
              </h5>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/img/sidebar-arrow.png"
                id="close_Btn"
                className="flot-arrow-sidebar"
                alt=""
                onClick={togglePanel}
              />
            </div>

            <ul className="ml-0">
              {SIDEBAR_LINKS.map((item) => {
                const locked = item.requiresAuth && !isLoggedIn;
                return (
                  <li key={item.label}>
                    <Link
                      href={locked ? "#" : item.href}
                      onClick={locked ? requireAuth : undefined}
                    >
                      <span className="fit-icon-sidebar">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.icon} alt="" />
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="d-flex justify-content-space mt-30">
              {isLoggedIn ? (
                <Link href="/userprofile" className="text-black fs-20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/profile-icon.png"
                    className="d-block mb-10"
                    alt=""
                  />
                  Profile
                </Link>
              ) : (
                <a
                  href="#"
                  className="text-black fs-20"
                  onClick={requireAuth}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/profile-icon.png"
                    className="d-block mb-10"
                    alt=""
                  />
                  Profile
                </a>
              )}

              {isLoggedIn ? (
                <Link href="/saved" className="text-black fs-20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/heart-icon.png"
                    className="d-block mb-10"
                    alt=""
                  />
                  Saved List
                </Link>
              ) : (
                <a
                  href="#"
                  className="text-black fs-20"
                  onClick={requireAuth}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/heart-icon.png"
                    className="d-block mb-10"
                    alt=""
                  />
                  Saved List
                </a>
              )}

              {isLoggedIn ? (
                <button
                  type="button"
                  className="text-black fs-20 bg-transparent border-0 p-0"
                  onClick={logout}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/logout.png"
                    className="d-block"
                    alt=""
                  />
                  Logout
                </button>
              ) : (
                <Link href="/login" className="text-black fs-20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/logout.png"
                    className="d-block"
                    alt=""
                  />
                  Login
                </Link>
              )}
            </div>
          </div>

          <div
            className="row g-4"
            style={{ alignItems: "flex-start", justifyContent: "space-evenly" }}
          >
            <div className="col-xl-1 col-lg-1">
              <div
                className={`arrow-box${panelOpen ? " sidebar-toggle-slot" : ""}`}
                id="toggleBtn"
                role="button"
                tabIndex={0}
                aria-label="Open sidebar"
                onClick={togglePanel}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    togglePanel();
                  }
                }}
              >
                <i
                  className={`bi ${
                    panelOpen
                      ? "bi-arrow-left-square-fill"
                      : "bi-arrow-right-square-fill"
                  }`}
                />
              </div>
            </div>

            <div
              className={`avatar-box w-12${panelOpen ? " sidebar-hello-hidden" : ""}`}
            >
              <div className="avatar-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarSrc}
                  alt=""
                  className="pgs-student-avatar"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                  }}
                />
              </div>
              <div className="avatar-info">
                <h5 className="mb-0">
                  Hello <span>👋</span>
                </h5>
                <h4 className="mb-0">{displayName}</h4>
              </div>
            </div>

            <div className="col-xl-5 mt-0 col-lg-5 d-flex align-items-center mobile-tags-scrolling" />

            <div
              className="col-xl-4 justify-content-end col-lg-4 d-flex gap-7 mobile-none"
              style={{ width: "37%" }}
            >
              <div className="d-flex align-items-start gap-3">
                <UnivMeetWidget meet={meet} />
                <div className="search-box">
                  <div className="input-group">
                    <span>
                      <i className="bi bi-search" />
                    </span>
                    <input
                      type="search"
                      className="search-control"
                      placeholder="Search programs & events…"
                      aria-label="Search programs and events"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={`drawer${mobileDrawerOpen ? " active" : ""}`} id="drawer">
        <div className="d-flex d-flex-space justify-content-space">
          <div>
            <Link href="/" onClick={closeMobileDrawer}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/img/white-logo.png"
                alt="Purple Guide Study"
                style={{ width: 120 }}
              />
            </Link>
          </div>
          <div className="d-flex d-flex-space justify-content-space">
            <button
              type="button"
              className="btn-toggle-mobile text-end"
              onClick={closeMobileDrawer}
              style={{ width: 84 }}
              aria-label="Close menu"
            >
              <span style={{ fontSize: 28, lineHeight: 1 }}>&times;</span>
            </button>
          </div>
        </div>

        <ul className="header-tab-top d-block">
          <li>
            <Link
              href="/dashboard"
              style={{ padding: "2px 5px" }}
              className={`tab-button text-black${
                pathActive(pathname, "/dashboard") ? " active-tab" : ""
              }`}
              onClick={closeMobileDrawer}
            >
              #feed
            </Link>
          </li>

          <li className="mb-2" id="mobilePpWrapper">
            <a
              href="#"
              className={`tab-button text-black${
                pathActive(pathname, "/purplepremiumhome") ? " active-tab" : ""
              }`}
              style={{
                padding: 4,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
              onClick={(e) => {
                e.preventDefault();
                setMobilePpOpen((v) => !v);
                setMobileExploreOpen(false);
              }}
            >
              #purplePremium
              <span
                style={{
                  fontSize: 11,
                  transition: "transform 0.2s",
                  transform: mobilePpOpen ? "rotate(180deg)" : undefined,
                }}
              >
                ▼
              </span>
            </a>
            <ul
              style={{
                display: mobilePpOpen ? "block" : "none",
                listStyle: "none",
                padding: "6px 0",
                margin: "0 0 10px",
                width: "85%",
                background: "#FFDE7F",
                borderRadius: 10,
                border: "0.5px solid #e0d200",
              }}
            >
              <li>
                <Link
                  href="/purplepremiumhome"
                  className="pp-mobile-link"
                  onClick={closeMobileDrawer}
                >
                  OVERVIEW
                </Link>
              </li>
              <li>
                <Link
                  href="/purplenonmedical"
                  className="pp-mobile-link"
                  onClick={closeMobileDrawer}
                >
                  STEM
                </Link>
              </li>
              <li>
                <Link
                  href="/purplenonmedical"
                  className="pp-mobile-link"
                  onClick={closeMobileDrawer}
                >
                  MBA
                </Link>
              </li>
              <li>
                <Link
                  href="/purpleusme"
                  className="pp-mobile-link"
                  onClick={closeMobileDrawer}
                >
                  USMLE
                </Link>
              </li>
              <li>
                <Link
                  href="/purpleplab"
                  className="pp-mobile-link"
                  onClick={closeMobileDrawer}
                >
                  PLAB
                </Link>
              </li>
              <li>
                <Link
                  href="/purpleamc"
                  className="pp-mobile-link"
                  onClick={closeMobileDrawer}
                >
                  AMC
                </Link>
              </li>
              <li>
                <Link
                  href="/purplenonmedical"
                  className="pp-mobile-link"
                  onClick={closeMobileDrawer}
                >
                  OTHER PATHS
                </Link>
              </li>
            </ul>
          </li>

          <li className="mb-2">
            <Link
              href="/cvreadyprogram"
              className={`tab-button text-black${
                pathActive(pathname, "/cvreadyprogram") ? " active-tab" : ""
              }`}
              style={{ padding: 4 }}
              onClick={closeMobileDrawer}
            >
              #cvReadyPrograms
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/usmlerotation"
              className={`tab-button text-black${
                pathActive(pathname, "/usmlerotation") ? " active-tab" : ""
              }`}
              style={{ padding: 4 }}
              onClick={closeMobileDrawer}
            >
              #USMLERotation
            </Link>
          </li>
          <li className="mb-2" id="mobileExploreWrapper">
            <a
              href="#"
              className={`tab-button text-black${
                pathActive(pathname, "/explorecountries") ? " active-tab" : ""
              }`}
              style={{
                padding: 4,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
              onClick={(e) => {
                e.preventDefault();
                setMobileExploreOpen((v) => !v);
                setMobilePpOpen(false);
              }}
            >
              #exploreCountries
              <span
                style={{
                  fontSize: 11,
                  transition: "transform 0.2s",
                  transform: mobileExploreOpen ? "rotate(180deg)" : undefined,
                }}
              >
                ▼
              </span>
            </a>
            <ul
              style={{
                display: mobileExploreOpen ? "block" : "none",
                listStyle: "none",
                padding: "6px 0",
                margin: "0 0 10px",
                width: "85%",
                background: "#FFDE7F",
                borderRadius: 10,
                border: "0.5px solid #e0d200",
              }}
            >
              <li>
                <Link
                  href="/countries/usa"
                  className="pp-mobile-link"
                  onClick={closeMobileDrawer}
                >
                  USA
                </Link>
              </li>
              <li>
                <Link
                  href="/countries/uk"
                  className="pp-mobile-link"
                  onClick={closeMobileDrawer}
                >
                  UK
                </Link>
              </li>
              <li>
                <Link
                  href="/countries/aus"
                  className="pp-mobile-link"
                  onClick={closeMobileDrawer}
                >
                  AUSTRALIA
                </Link>
              </li>
              <li>
                <Link
                  href="/countries/germany"
                  className="pp-mobile-link"
                  onClick={closeMobileDrawer}
                >
                  GERMANY
                </Link>
              </li>
              <li>
                <Link
                  href="/explorecountries"
                  className="pp-mobile-link"
                  onClick={closeMobileDrawer}
                >
                  FULL COUNTRY LIST
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
}
