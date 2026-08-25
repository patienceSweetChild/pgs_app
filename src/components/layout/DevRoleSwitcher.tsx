"use client";

import { useExperience, type Experience } from "@/lib/auth/experience";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const ROLES: { id: Experience; label: string }[] = [
  { id: "anonymous", label: "Guest" },
  { id: "authenticated_standard", label: "Student" },
  { id: "authenticated_premium", label: "Premium" },
];

/** Dev-only chrome — not part of public design. */
export function DevRoleSwitcher() {
  const { experience, setExperience } = useExperience();

  if (process.env.NODE_ENV === "production") return null;

  const configured = isSupabaseConfigured();
  const forceOn = process.env.NEXT_PUBLIC_ENABLE_DEV_ROLE_SWITCHER === "true";
  if (configured && !forceOn) return null;

  return (
    <div className="dev-role-switcher" aria-label="Mock experience switcher">
      {ROLES.map((role) => (
        <button
          key={role.id}
          type="button"
          className={experience === role.id ? "is-active" : undefined}
          onClick={() => setExperience(role.id)}
        >
          {role.label}
        </button>
      ))}
    </div>
  );
}
