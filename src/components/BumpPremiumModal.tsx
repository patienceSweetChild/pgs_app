"use client";

import { type FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./bump-premium-modal.css";

export type BumpModalSelect = {
  label: string;
  options: { value: string; label: string }[];
};

export type BumpModalSuccessConfig = {
  title: string;
  nextTitle: string;
  paragraphs: string[];
  email?: string;
  emailLabel?: string;
  emailNote?: string;
};

export type BumpModalConfig = {
  subLabel: string;
  tagline: string;
  /** Desktop boost lines next to arrow (default: get the boost…) */
  boostLines?: string[];
  boostMobile?: string;
  cta: string;
  ctaMobile?: string;
  phonePlaceholder?: string;
  overlayClassName?: string;
  toggles?: string[];
  selects?: BumpModalSelect[];
  successTitle?: string;
  successBody?: string;
  success?: BumpModalSuccessConfig;
  modalType?: string;
};

const DEFAULT_BOOST = ["get the", "boost", "your", "deserves"];

type BumpModalProps = {
  open: boolean;
  onClose: () => void;
  config: BumpModalConfig;
};

/**
 * Shared #PGS purple modal with heart + bump icon left panel
 * (from standalone-html joinPremium / applicantPremium modals).
 * Portaled to document.body so it always covers the viewport.
 */
export function BumpPremiumModal({
  open,
  onClose,
  config,
}: BumpModalProps) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [goals, setGoals] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const t of config.toggles ?? []) init[t] = true;
    return init;
  });
  const [selectValues, setSelectValues] = useState<Record<string, string>>(
    () => {
      const init: Record<string, string> = {};
      for (const s of config.selects ?? []) {
        init[s.label] = s.options[0]?.value ?? "";
      }
      return init;
    },
  );
  const [done, setDone] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !mounted) return null;

  const boost = config.boostLines ?? DEFAULT_BOOST;

  function close() {
    setDone(false);
    setName("");
    setEmail("");
    setPhone("");
    onClose();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.includes("@")) return;
    try {
      const { isSupabaseConfigured } = await import("@/lib/supabase/config");
      if (isSupabaseConfigured()) {
        const { createSupabaseBrowserClient } = await import(
          "@/lib/supabase/client"
        );
        const supabase = createSupabaseBrowserClient();
        const checklist = Object.entries(goals)
          .filter(([, on]) => on)
          .map(([label]) => label);
        await supabase.from("lead_submissions").insert({
          modal_type: config.modalType ?? "applicant",
          name,
          email,
          phone,
          checklist_items: checklist,
          planning_to_study: Object.values(selectValues).join(" | "),
          source_page:
            typeof window !== "undefined" ? window.location.pathname : "/",
        });
      }
    } catch {
      /* keep existing success UX */
    }
    setDone(true);
  }

  if (done && config.success) {
  const successModal = (
    <div
      className="pgs-modal premium-modal-overlay bump-investor-success-overlay"
      style={{
        display: "flex",
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        zIndex: 10000,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="premium-modal-container purple-modal d-flex bg-white pgs-modal-2 bump-investor-success">
        <button
          className="close-btn"
          type="button"
          aria-label="Close"
          onClick={close}
        >
          ✕
        </button>
        <div className="bump-investor-success__hero text-center">
          <h5 className="fw-700 fs-48 text-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/img/check-12.png"
              style={{ width: 50 }}
              alt=""
            />
            {config.success.title}
          </h5>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/img/okk.png"
            className="bump-investor-success__hand"
            alt=""
          />
          <h5 className="fw-400 fs-24 fnt-family text-black mb-0">
            {config.success.nextTitle}
          </h5>
        </div>

        <div className="bump-investor-success__side mobile-none">
          <div className="bump-investor-success__copy">
            {config.success.paragraphs.map((p) => (
              <p key={p} className="fs-13 fw-400 mb-3 text-black lh-15">
                {p}
              </p>
            ))}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="bump-investor-success__heart"
            src="/assets/img/heart.gif"
            alt=""
          />
          {config.success.email ? (
            <div className="bump-investor-success__cta">
              <p className="fs-13 lh-15 text-white mb-1">
                <a
                  href={`mailto:${config.success.email}`}
                  className="text-white text-decoration-underline"
                >
                  {config.success.emailLabel ?? config.success.email}
                </a>
              </p>
              {config.success.emailNote ? (
                <p className="fs-13 lh-15 text-white mb-0">
                  {config.success.emailNote}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="bump-investor-success__mobile desktop-none">
          {config.success.paragraphs.map((p) => (
            <p key={p} className="fs-13 fw-400 mb-3 text-black lh-15">
              {p}
            </p>
          ))}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/img/heart.gif"
            style={{
              width: 50,
              borderRadius: 10,
              margin: "8px auto 12px",
              display: "block",
            }}
            alt=""
          />
          {config.success.email ? (
            <div className="bump-investor-success__cta">
              <p className="fs-13 lh-15 text-white mb-1">
                <a
                  href={`mailto:${config.success.email}`}
                  className="text-white text-decoration-underline"
                >
                  {config.success.emailLabel ?? config.success.email}
                </a>
              </p>
              {config.success.emailNote ? (
                <p className="fs-13 lh-15 text-white mb-0">
                  {config.success.emailNote}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
  return createPortal(successModal, document.body);
  }

  const modal = (
    <div
      className={`mobile-applicant pgs-modal premium-modal-overlay ${config.overlayClassName ?? ""}`}
      style={{
        display: "flex",
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        zIndex: 10000,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="premium-modal-container purple-modal d-flex">
        <div className="panel-left">
          <button
            className="close-btn desktop-none"
            type="button"
            aria-label="Close"
            onClick={close}
          >
            ✕
          </button>
          <div className="brand-row">
            <div className="brand-title">#PGS</div>
            <div className="heart-badge">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img/heart.gif" alt="" />
            </div>
          </div>
          <div className="sub-label fnt-family">{config.subLabel}</div>
          <p className="tagline lh-18ppx">{config.tagline}</p>

          <div className="boost-wrap">
            <div className="mobile-none" style={{ margin: "0 0 0 auto" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/img/arrow-modal.png"
                style={{ width: 95, marginLeft: -10 }}
                alt=""
              />
              <span className="w-full d-block fs-16 text-white lh-18">
                {boost.map((line, i) => (
                  <span key={`${line}-${i}`}>
                    {line}
                    {i < boost.length - 1 ? <br /> : null}
                  </span>
                ))}
              </span>
            </div>
            <div className="mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img/bump.png" alt="" />
            </div>
            <div className="desktop-none">
              <p className="mb-0 fs-14 lh-20 fw-400 text-white">
                {config.boostMobile ?? (
                  <>
                    get the boost your <br /> PREP deserves
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="panel-right">
          <button
            className="close-btn mobile-none"
            type="button"
            aria-label="Close"
            onClick={close}
          >
            ✕
          </button>

          {done ? (
            <div className="success-msg" style={{ display: "block" }}>
              <div className="checkmark">🎉</div>
              <h3>{config.successTitle ?? "You're all set!"}</h3>
              <p>
                {config.successBody ?? (
                  <>
                    Your personalised checklist is on its way.
                    <br />
                    Check your inbox soon.
                  </>
                )}
              </p>
            </div>
          ) : (
            <form id="formContent" onSubmit={onSubmit}>
              <div className="field-group">
                <div className="field">
                  <input
                    type="text"
                    placeholder="Enter Name *"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="field">
                  <input
                    type="email"
                    placeholder="Email *"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="field">
                  <input
                    type="tel"
                    placeholder={
                      config.phonePlaceholder ??
                      "Phone (Whatsapp number preffered)"
                    }
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {config.toggles && config.toggles.length > 0 ? (
                <div>
                  <p className="section-label mb-0">
                    What are you aiming to sort out?
                  </p>
                  <div className="toggle-list" style={{ marginTop: 12 }}>
                    {config.toggles.map((goal) => (
                      <label className="toggle-row" key={goal}>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={!!goals[goal]}
                            onChange={() =>
                              setGoals((prev) => ({
                                ...prev,
                                [goal]: !prev[goal],
                              }))
                            }
                          />
                          <span className="slider" />
                        </label>
                        <span>{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}

              {config.selects?.map((sel) => (
                <div key={sel.label} className="mt-3">
                  <p className="section-label mb-2">{sel.label}</p>
                  <div className="d-flex gap-3">
                    <select
                      className="modal-btn-pgs text-center"
                      value={selectValues[sel.label] ?? ""}
                      onChange={(e) =>
                        setSelectValues((prev) => ({
                          ...prev,
                          [sel.label]: e.target.value,
                        }))
                      }
                    >
                      {sel.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/assets/img/arrow-btn.png"
                        style={{ width: 26, height: 26 }}
                        alt=""
                      />
                    </span>
                  </div>
                </div>
              ))}

              <div className="divider" />

              <div className="cta-row mt-5">
                <button className="cta-btn" type="submit">
                  <span className="mobile-none">{config.cta}</span>
                  <span className="desktop-none">
                    {config.ctaMobile ?? config.cta}
                  </span>
                  <span className="arrow">←</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

/** Soft-lock unlock — PurplePremium apply with bump panel */
export const UNLOCK_BUMP_CONFIG: BumpModalConfig = {
  subLabel: "#PURPLEPREMIUM",
  tagline:
    "Unlock full access — mentor support, admissions help, and your dashboard.",
  cta: "Apply Now",
  selects: [
    {
      label: "What are you planning to study?",
      options: [
        { value: "1", label: "MS / Masters Abroad" },
        { value: "2", label: "MBA" },
        { value: "3", label: "Medical Pathway" },
        { value: "4", label: "Other" },
      ],
    },
  ],
  successTitle: "You're all set!",
  successBody: "We'll reach out about #PurplePremium seats shortly.",
};

/** Footer “Join The Team!” — investor access */
export const INVESTOR_BUMP_CONFIG: BumpModalConfig = {
  subLabel: "INVESTOR ACCESS",
  tagline: "Interested in investing or partnering with #PGS?",
  boostLines: ["lets", "scale"],
  boostMobile: "lets scale",
  cta: "LETS CONNECT",
  ctaMobile: "RETAIL INVESTOR",
  phonePlaceholder: "Phone (Whatsapp number preferred) (optional)",
  overlayClassName: "pgs-modalSc pgs-modalSplit",
  modalType: "investor",
  selects: [
    {
      label: "What kind of investor are you?",
      options: [
        { value: "1", label: "Retail investor" },
        { value: "2", label: "Institutional" },
      ],
    },
    {
      label: "Pre-seed round open. Want in?",
      options: [
        { value: "1", label: "Yes, actively exploring" },
        { value: "2", label: "Just researching" },
      ],
    },
  ],
  success: {
    title: "you're in",
    nextTitle: "WE'RE EXCITED TO CONNECT.",
    paragraphs: [
      "If you're exploring a business or institutional partnership, our team will reach out to set up a proper conversation.",
      "If you're a retail investor interested in our pre-seed round, we'll keep you on our investor update list.",
    ],
    email: "anjay@purpleguide.study",
    emailLabel: "direct email?",
    emailNote: "(Anjay gets this email directly)",
  },
};

/** Referral access (footer / team) */
export const REFERRAL_BUMP_CONFIG: BumpModalConfig = {
  subLabel: "REFERRAL ACCESS",
  tagline: "Lets do some projects",
  cta: "i need to join",
  selects: [
    {
      label: "What describes you best?",
      options: [
        { value: "1", label: "Reshare Webinars" },
        { value: "2", label: "Campus ambassador" },
        { value: "3", label: "Mentor" },
      ],
    },
  ],
};
