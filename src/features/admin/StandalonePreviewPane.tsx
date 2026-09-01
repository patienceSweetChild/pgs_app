"use client";

import { useCallback, useEffect, useRef, useState, Component, type ReactNode } from "react";
import { EventSessionPage } from "@/features/purpleevents/PurpleEventsPage";
import { CourseDetailPage } from "@/features/programsfull/CourseDetailPage";
import { CountryPage } from "@/features/countries/CountryPage";
import { PathwayPage } from "@/features/pathway/PathwayPage";
import { PurpleNonMedicalPage } from "@/features/purplenonmedical/PurpleNonMedicalPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import type { SessionDetail } from "@/features/purpleevents/content";
import type { CourseDetail } from "@/features/programsfull/content";
import type { CountryPageContent } from "@/features/countries/content";
import type { MedicalPathwayPageContent } from "@/features/pathway/page-content";
import type { NonMedicalPathwayPageContent } from "@/features/pathway/page-content";
import type { CountryTopTabId } from "./country-preview-map";
import type { StudentDashboardContent } from "@/features/dashboard/content";
import type { DashboardPreviewIdentity } from "@/features/dashboard/content";

const PREVIEW_WIDTH = 1440;
const MIN_HEIGHT = 900;
const HEIGHT_EPSILON = 24;
const SCALE_EPSILON = 0.008;
const DETAIL_DEBOUNCE_MS = 160;

type Kind =
  | "event"
  | "course"
  | "country"
  | "pathway-medical"
  | "pathway-nonmedical"
  | "dashboard";
export type PreviewPublishMode = "draft" | "publish";

export type DashboardPreviewDetail = {
  content: StudentDashboardContent;
  identity: DashboardPreviewIdentity;
};

/** Catch render errors in the live preview so the admin form stays usable. */
class PreviewErrorBoundary extends Component<
  { children: ReactNode; resetKey: string },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidUpdate(prev: { resetKey: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="pgs-admin-preview-shell__error">
          Preview failed to render. Edit fields and it will retry.
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Scaled live preview of the public session/program page.
 * Renders in-tree (no iframe portal) so React never hits removeChild
 * errors when the preview document is torn down by HMR / remounts.
 */
export function StandalonePreviewPane({
  kind,
  detail,
  label = "Standalone page",
  publishMode = "draft",
  onPublishModeChange,
  showDraftBanner = false,
  activeTabId,
}: {
  kind: Kind;
  detail: unknown;
  label?: string;
  publishMode?: PreviewPublishMode;
  onPublishModeChange?: (mode: PreviewPublishMode) => void;
  showDraftBanner?: boolean;
  activeTabId?: CountryTopTabId;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef(MIN_HEIGHT);
  const scaleRef = useRef(0.4);
  const [frameHeight, setFrameHeight] = useState(MIN_HEIGHT);
  const [scale, setScale] = useState(0.4);
  const [stableDetail, setStableDetail] = useState(detail);

  useEffect(() => {
    const t = window.setTimeout(
      () => setStableDetail(detail),
      DETAIL_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(t);
  }, [detail]);

  const setHeightStable = useCallback((next: number) => {
    const h = Math.max(MIN_HEIGHT, Math.round(next));
    if (Math.abs(h - heightRef.current) < HEIGHT_EPSILON) return;
    heightRef.current = h;
    setFrameHeight(h);
  }, []);

  const setScaleStable = useCallback((next: number) => {
    const s = Math.min(1, Math.max(0.15, next));
    if (Math.abs(s - scaleRef.current) < SCALE_EPSILON) return;
    scaleRef.current = s;
    setScale(s);
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = el.clientWidth - 16;
        if (w > 0) setScaleStable(w / PREVIEW_WIDTH);
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [setScaleStable]);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;
    let raf = 0;
    const report = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setHeightStable(
          Math.max(node.scrollHeight, node.offsetHeight, MIN_HEIGHT),
        );
      });
    };
    report();
    const ro = new ResizeObserver(report);
    ro.observe(node);
    const t1 = window.setTimeout(report, 350);
    const t2 = window.setTimeout(report, 1200);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [stableDetail, kind, publishMode, setHeightStable]);

  const preview =
    kind === "event" ? (
      <EventSessionPage
        sessionId={(stableDetail as SessionDetail).id}
        detail={stableDetail as SessionDetail}
        sessions={
          (stableDetail as SessionDetail).showUpcomingSessions === false
            ? []
            : undefined
        }
      />
    ) : kind === "course" ? (
      <CourseDetailPage
        courseId={(stableDetail as CourseDetail).id}
        detail={stableDetail as CourseDetail}
      />
    ) : kind === "pathway-medical" ? (
      <PathwayPage content={stableDetail as MedicalPathwayPageContent} />
    ) : kind === "pathway-nonmedical" ? (
      <PurpleNonMedicalPage
        content={stableDetail as NonMedicalPathwayPageContent}
      />
    ) : kind === "dashboard" ? (
      <DashboardPage
        content={(stableDetail as DashboardPreviewDetail).content}
        previewIdentity={(stableDetail as DashboardPreviewDetail).identity}
        forceUnlocked
      />
    ) : (
      <CountryPage
        content={stableDetail as CountryPageContent}
        activeTabId={activeTabId}
      />
    );

  const resetKey = `${kind}-${(stableDetail as { id?: string })?.id ?? "draft"}-${publishMode}`;

  return (
    <aside className="pgs-admin-visual__page-preview">
      <header className="pgs-admin-visual__page-preview-head">
        <strong>
          {publishMode === "draft"
            ? `${label} (Draft)`
            : `${label} (Published)`}
        </strong>
        <div
          className="pgs-admin-visual__preview-modes"
          role="group"
          aria-label="Preview mode"
        >
          <button
            type="button"
            className={
              publishMode === "draft"
                ? "pgs-admin-visual__preview-mode is-active"
                : "pgs-admin-visual__preview-mode"
            }
            onClick={() => onPublishModeChange?.("draft")}
          >
            Draft
          </button>
          <button
            type="button"
            className={
              publishMode === "publish"
                ? "pgs-admin-visual__preview-mode is-active is-publish"
                : "pgs-admin-visual__preview-mode"
            }
            onClick={() => onPublishModeChange?.("publish")}
          >
            Publish
          </button>
        </div>
      </header>
      {showDraftBanner || publishMode === "draft" ? (
        <div className="pgs-admin-visual__draft-banner">
          DRAFT PREVIEW · UNPUBLISHED CMS CONTENT
        </div>
      ) : null}
      <div
        ref={viewportRef}
        className="pgs-admin-visual__page-preview-viewport"
      >
        <div
          className="pgs-admin-visual__page-preview-frame"
          style={{
            width: PREVIEW_WIDTH * scale,
            height: frameHeight * scale,
          }}
        >
          <div
            ref={contentRef}
            className="pgs-admin-preview-shell"
            style={{
              width: PREVIEW_WIDTH,
              minHeight: frameHeight,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <PreviewErrorBoundary resetKey={resetKey}>
              {preview}
            </PreviewErrorBoundary>
          </div>
        </div>
      </div>
    </aside>
  );
}
