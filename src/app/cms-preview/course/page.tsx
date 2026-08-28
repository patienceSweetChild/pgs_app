"use client";

import { useEffect, useState } from "react";
import { CourseDetailPage } from "@/features/programsfull/CourseDetailPage";
import type { CourseDetail } from "@/features/programsfull/content";

const MSG = "pgs-cms-preview-course";

type CmsCoursePreviewMessage = {
  type: typeof MSG;
  detail: CourseDetail;
};

function isCmsCoursePreviewMessage(
  data: unknown,
): data is CmsCoursePreviewMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as { type?: string }).type === MSG &&
    typeof (data as { detail?: unknown }).detail === "object"
  );
}

/**
 * Public-shell preview frame for admin CMS.
 * Same route chrome as /programsfull/program/[id].
 */
export default function CmsCoursePreviewPage() {
  const [detail, setDetail] = useState<CourseDetail | null>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (!isCmsCoursePreviewMessage(event.data)) return;
      setDetail(event.data.detail);
    }
    window.addEventListener("message", onMessage);
    window.parent.postMessage(
      { type: "pgs-cms-preview-ready", kind: "course" },
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
        { type: "pgs-cms-preview-height", kind: "course", height },
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

  return <CourseDetailPage courseId={detail.id} detail={detail} />;
}
