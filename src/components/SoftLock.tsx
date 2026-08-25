"use client";

import type { CSSProperties } from "react";
import "./soft-lock.css";

type SoftLockProps = {
  onUnlock: () => void;
  /** ThemeZaa lock class: lock-box-feed | lock-box | lock-box-2 | lock-box-3 */
  className?: string;
  style?: CSSProperties;
};

/**
 * Soft-lock: frosted transparent layer + centered lock icon.
 * Content stays visible underneath; overlay blocks interaction.
 */
export function SoftLock({
  onUnlock,
  className = "lock-box-feed",
  style,
}: SoftLockProps) {
  return (
    <button
      type="button"
      className={`pgs-soft-lock ${className}`}
      onClick={onUnlock}
      aria-label="Unlock with PurplePremium"
      style={style}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/img/lock.png" alt="" />
    </button>
  );
}
