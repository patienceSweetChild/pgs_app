"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function StudentResourcesSettingsPage() {
  const [json, setJson] = useState('{\n  "headline": "",\n  "subcopy": ""\n}');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    void (async () => {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "student_resources")
        .maybeSingle();
      if (data?.value) {
        setJson(JSON.stringify(data.value, null, 2));
      }
    })();
  }, []);

  async function save() {
    setError(null);
    setMessage(null);
    if (!isSupabaseConfigured()) {
      setError("Supabase not configured");
      return;
    }
    try {
      const value = JSON.parse(json);
      const supabase = createSupabaseBrowserClient();
      const { error: upsertError } = await supabase.from("site_settings").upsert({
        key: "student_resources",
        value,
        description: "Student resources page settings",
        updated_at: new Date().toISOString(),
      });
      if (upsertError) throw upsertError;
      setMessage("Saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Student Resources Settings</h1>
      {error ? (
        <p role="alert" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      ) : null}
      {message ? <p>{message}</p> : null}
      <div className="pgs-admin__form" style={{ maxWidth: 720 }}>
        <label>
          Settings JSON
          <textarea
            rows={12}
            value={json}
            onChange={(e) => setJson(e.target.value)}
          />
        </label>
        <button type="button" className="pgs-admin__btn" onClick={() => void save()}>
          Save
        </button>
      </div>
    </div>
  );
}
