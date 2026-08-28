"use client";

import { useEffect, useState } from "react";
import { EventSessionPage } from "@/features/purpleevents/PurpleEventsPage";
import type { SessionDetail } from "@/features/purpleevents/content";

const MSG = "pgs-cms-preview-event";

type CmsEventPreviewMessage = {
  type: typeof MSG;
  detail: SessionDetail;
};

function isCmsEventPreviewMessage(
  data: unknown,
): data is CmsEventPreviewMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as { type?: string }).type === MSG &&
    typeof (data as { detail?: unknown }).detail === "object"
  );
}

/**
 * Public-shell preview frame for admin CMS.
 * Receives live draft SessionDetail via postMessage — same chrome as
 * /purpleevents/session/[id].
 */
export default function CmsEventPreviewPage() {
  const [detail, setDetail] = useState<SessionDetail | null>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (!isCmsEventPreviewMessage(event.data)) return;
      setDetail(event.data.detail);
    }
    window.addEventListener("message", onMessage);
    window.parent.postMessage(
      { type: "pgs-cms-preview-ready", kind: "event" },
      window.location.origin,
    );
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    const report = () => {
      const height = Math.max(
        document.documentElement.scrollHeight,
        document.body?.scrollHeight ?? 0,
        900,
      );
      window.parent.postMessage(
        { type: "pgs-cms-preview-height", kind: "event", height },
        window.location.origin,
      );
    };
    report();
    const ro = new ResizeObserver(report);
    ro.observe(document.documentElement);
    const id = window.setInterval(report, 500);
    return () => {
      ro.disconnect();
      window.clearInterval(id);
    };
  }, [detail]);

  if (!detail) {
    return (
      <div className="wrapper-content p-5 text-center text-black">
        Waiting for live preview…
      </div>
    );
  }

  return (
    <EventSessionPage sessionId={detail.id} detail={detail} sessions={[]} />
  );
}
