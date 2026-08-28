"use client";

import Link from "next/link";
import { useEffect } from "react";

export function LoginRequiredPopup({
  open,
  onClose,
  message = "Please login to access this option.",
}: {
  open: boolean;
  onClose: () => void;
  message?: string;
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
        <p>{message}</p>
        <Link href="/login" className="pgs-login-popup-btn" onClick={onClose}>
          Login Now
        </Link>
      </div>
    </div>
  );
}
