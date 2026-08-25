"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { updateStaffProfile } from "@/features/admin/content-actions";

export default function AdminProfilePage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    void (async () => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");
      const { data } = await supabase
        .from("staff_profiles")
        .select("display_name, role_key")
        .eq("user_id", user.id)
        .maybeSingle();
      setDisplayName(data?.display_name ?? "");
      setRole(data?.role_key ?? "");
    })();
  }, []);

  async function save() {
    setError(null);
    setMessage(null);
    try {
      await updateStaffProfile(displayName);
      setMessage("Profile updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function logout() {
    if (!isSupabaseConfigured()) return;
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/login?surface=admin";
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Profile</h1>
      {error ? (
        <p role="alert" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      ) : null}
      {message ? <p>{message}</p> : null}
      <div className="pgs-admin__form">
        <label>
          Display name
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </label>
        <label>
          Email
          <input value={email} disabled />
        </label>
        <label>
          Role
          <input value={role} disabled />
        </label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            className="pgs-admin__btn"
            onClick={() => void save()}
          >
            Save
          </button>
          <button
            type="button"
            className="pgs-admin__btn pgs-admin__btn--ghost"
            onClick={() => void logout()}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
