"use client";

import { useEffect, useState } from "react";
import {
  getPremiumContentSetting,
  savePremiumContentSetting,
} from "@/features/admin/content-actions";

export function PremiumContentEditor({
  settingKey,
  heading,
}: {
  settingKey: "video" | "meetup";
  heading: string;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const row = await getPremiumContentSetting(settingKey);
        if (row) {
          setTitle(String(row.title ?? ""));
          setBody(String(row.body ?? ""));
          setLinkUrl(String(row.link_url ?? ""));
          setPublished(Boolean(row.published));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      }
    })();
  }, [settingKey]);

  async function save() {
    setError(null);
    setMessage(null);
    try {
      await savePremiumContentSetting(
        settingKey,
        title,
        body,
        linkUrl,
        published,
      );
      setMessage("Saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{heading}</h1>
      {error ? (
        <p role="alert" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      ) : null}
      {message ? <p>{message}</p> : null}
      <div className="pgs-admin__form">
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Body
          <textarea
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </label>
        <label>
          Link / media URL
          <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
        </label>
        <label>
          Published
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
        </label>
        <button type="button" className="pgs-admin__btn" onClick={() => void save()}>
          Save
        </button>
      </div>
    </div>
  );
}
