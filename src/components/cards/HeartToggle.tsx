"use client";

import { useState } from "react";

type HeartToggleProps = {
  initialSaved?: boolean;
  className?: string;
  onToggle?: (saved: boolean) => void;
};

export function HeartToggle({
  initialSaved = false,
  className = "",
  onToggle,
}: HeartToggleProps) {
  const [saved, setSaved] = useState(initialSaved);

  return (
    <button
      type="button"
      className={`cardbox-heart border-0 bg-transparent p-0${saved ? " is-liked" : ""}${className ? ` ${className}` : ""}`}
      aria-label={saved ? "Unsave" : "Save"}
      aria-pressed={saved}
      onClick={() => {
        setSaved((v) => {
          const next = !v;
          onToggle?.(next);
          return next;
        });
      }}
    >
      <i className={saved ? "bi bi-heart-fill" : "bi bi-heart"} />
    </button>
  );
}
