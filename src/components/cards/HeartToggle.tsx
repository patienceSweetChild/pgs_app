"use client";

import { useEffect, useState } from "react";

type HeartToggleProps = {
  initialSaved?: boolean;
  /** Controlled saved state (preferred when persisting to server). */
  saved?: boolean;
  className?: string;
  onToggle?: (saved: boolean) => void;
  disabled?: boolean;
};

export function HeartToggle({
  initialSaved = false,
  saved: savedProp,
  className = "",
  onToggle,
  disabled = false,
}: HeartToggleProps) {
  const [internalSaved, setInternalSaved] = useState(initialSaved);
  const saved = savedProp ?? internalSaved;

  useEffect(() => {
    if (savedProp === undefined) {
      setInternalSaved(initialSaved);
    }
  }, [initialSaved, savedProp]);

  return (
    <button
      type="button"
      className={`cardbox-heart border-0 bg-transparent p-0${saved ? " is-liked" : ""}${className ? ` ${className}` : ""}`}
      aria-label={saved ? "Unsave" : "Save"}
      aria-pressed={saved}
      disabled={disabled}
      onClick={() => {
        const next = !saved;
        if (savedProp === undefined) {
          setInternalSaved(next);
        }
        onToggle?.(next);
      }}
    >
      <i className={saved ? "bi bi-heart-fill" : "bi bi-heart"} />
    </button>
  );
}
