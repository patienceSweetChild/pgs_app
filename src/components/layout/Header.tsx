"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useExperience } from "@/lib/auth/experience";
import { useShellUi } from "./shell-ui";
import "./header-extras.css";

const MARQUEE = {
  text: "PurplePremium applications open — book your free strategy call.",
  link: "/purplepremiumhome",
  /** Set true to show the top announcement bar again */
  enabled: false,
};

function pathActive(pathname: string, target: string) {
  return pathname.toLowerCase() === target.toLowerCase();
}

export function Header() {
  const pathname = usePathname();
  const { isLoggedIn, logout } = useExperience();
  const { openMobileDrawer } = useShellUi();
  const [ppOpen, setPpOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);

  useEffect(() => {
    setPpOpen(false);
    setExploreOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as HTMLElement;
      if (!t.closest("#ppWrapper")) setPpOpen(false);
      if (!t.closest("#exploreCountriesWrapper")) setExploreOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <header>
      <div
        className={`topbar${MARQUEE.enabled ? "" : " topbar--disabled"}`}
        aria-hidden={!MARQUEE.enabled}
      >
        <div className="topbar-content">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/img/watch.png" alt="" />
          <h5>
            <Link href={MARQUEE.link} tabIndex={MARQUEE.enabled ? undefined : -1}>
              {MARQUEE.text}
            </Link>
          </h5>
        </div>
      </div>

      <div className="mobile-none">
        <nav className="navbar navbar-expand-lg header-light header-transparent bg-transparent disable-fixed">
          <div className="container-fluid">
            <div className="col-lg-8 align-items-center">
              <div className="me-lg-0 me-auto">
                <Link className="navbar-brand" href="/">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/logo.png"
                    alt="Purple Guide Study"
                    className="default-logo"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/logo.png"
                    alt=""
                    className="alt-logo"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/logo.png"
                    alt=""
                    className="mobile-logo"
                  />
                </Link>
              </div>

              <div className="col-auto menu-order position-static">
                <ul className="header-tab-top">
                  <li>
                    <Link
                      href="/dashboard"
                      style={{ padding: "2px 5px" }}
                      className={`tab-button text-black${
                        pathActive(pathname, "/dashboard") ? " active-tab" : ""
                      }`}
                    >
                      #feed
                    </Link>
                  </li>
                  <li className="dropdown-wrapper" id="ppWrapper">
                    <a
                      href="javascript:void(0)"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setPpOpen((v) => !v);
                        setExploreOpen(false);
                      }}
                      className={`tab-button text-black ${
                        pathActive(pathname, "/purplepremiumhome")
                          ? "active-tab"
                          : ""
                      }`}
                      style={{ padding: 4 }}
                    >
                      #purplePremium
                    </a>
                    <div
                      className={`dropdown-menu${ppOpen ? " open" : ""}`}
                      id="ppDropdown"
                    >
                      <Link href="/purplepremiumhome">OVERVIEW</Link>
                      <Link href="/purplenonmedical">STEM</Link>
                      <Link href="/purplenonmedical">MBA</Link>
                      <Link href="/purpleusme">USMLE</Link>
                      <Link href="/purpleplab">PLAB</Link>
                      <Link href="/purpleamc">AMC</Link>
                      <Link href="/purplenonmedical">OTHER PATHS</Link>
                    </div>
                  </li>
                  <li>
                    <Link
                      href="/cvreadyprogram"
                      className={`tab-button text-black ${
                        pathActive(pathname, "/cvreadyprogram")
                          ? "active-tab"
                          : ""
                      }`}
                      style={{ padding: 4 }}
                    >
                      #cvReadyPrograms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-auto col-lg-4 text-end flex-grid">
              <Link
                href="/usmlerotation"
                className="btn btn-trapsparent text-decoration-none"
              >
                #USMLERotation
              </Link>

              <div className="explore-wrapper" id="exploreCountriesWrapper">
                <a
                  href="javascript:void(0)"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setExploreOpen((v) => !v);
                    setPpOpen(false);
                  }}
                  className={`btn btn-trapsparent text-decoration-none ${
                    pathActive(pathname, "/explorecountries") ? "active-tab" : ""
                  }`}
                >
                  #exploreCountries
                </a>
                <div
                  className={`explore-dropdown-menu${exploreOpen ? " open" : ""}`}
                  id="exploreCountriesDropdown"
                >
                  <Link href="/countries/usa">USA</Link>
                  <Link href="/countries/uk">UK</Link>
                  <Link href="/countries/aus">AUSTRALIA</Link>
                  <Link href="/countries/germany">GERMANY</Link>
                  <Link href="/explorecountries">FULL COUNTRY LIST</Link>
                </div>
              </div>

              {isLoggedIn ? (
                <button
                  type="button"
                  className="btn btn-login"
                  onClick={logout}
                >
                  Logout
                </button>
              ) : (
                <Link href="/login" className="btn btn-login">
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>

      <div className="mobile-block mobile-header">
        <div className="d-flex d-flex-space justify-content-space">
          <div>
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img/white-logo.png" alt="Purple Guide Study" />
            </Link>
          </div>
          <div className="d-flex d-flex-space justify-content-space">
            {isLoggedIn ? (
              <button
                type="button"
                className="btn btn-login"
                onClick={logout}
              >
                Logout
              </button>
            ) : (
              <Link href="/login" className="btn btn-login">
                Login
              </Link>
            )}
            <button
              type="button"
              className="btn-toggle-mobile"
              aria-label="Menu"
              onClick={openMobileDrawer}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img/toggle-lines.png" alt="" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
