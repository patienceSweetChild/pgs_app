"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createComment,
  listComments,
  voteComment,
} from "./commentsRepo";
import { COMMENTS_SEED, type DashboardComment } from "./content";

const PAGE_SIZE = 2;

export function formatCommentTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;

  const day = date.getDate();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  return `${day}${suffix} ${month} ${year}`;
}

export function useDashboardComments(author: {
  name: string;
  avatar: string;
  initial?: DashboardComment[];
}) {
  const [comments, setComments] = useState<DashboardComment[]>(() =>
    (author.initial ?? COMMENTS_SEED).map((c) => ({ ...c })),
  );
  const [draft, setDraft] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [submitting, setSubmitting] = useState(false);

  const initialKey = JSON.stringify(
    (author.initial ?? []).map((item) => [item.id, item.body, item.authorName]),
  );

  useEffect(() => {
    if (author.initial) {
      setComments(author.initial.map((c) => ({ ...c })));
      return;
    }
    let cancelled = false;
    (async () => {
      const rows = await listComments();
      if (!cancelled) setComments(rows);
    })();
    return () => {
      cancelled = true;
    };
    // initialKey captures the CMS document so preview updates without
    // resetting student-typed comments on unrelated parent renders.
  }, [initialKey]);

  const visibleComments = useMemo(
    () => comments.slice(0, visibleCount),
    [comments, visibleCount],
  );

  const hasMore = visibleCount < comments.length;

  const submit = useCallback(async () => {
    const body = draft.trim();
    if (!body || submitting) return;
    setSubmitting(true);
    try {
      const created = await createComment({
        authorName: author.name,
        avatarUrl: author.avatar,
        body,
      });
      setComments((prev) => [created, ...prev]);
      setDraft("");
      setVisibleCount((n) => Math.max(n, PAGE_SIZE));
    } finally {
      setSubmitting(false);
    }
  }, [author.avatar, author.name, draft, submitting]);

  const vote = useCallback(async (id: string, direction: "up" | "down") => {
    const updated = await voteComment(id, direction);
    if (!updated) return;
    setComments((prev) =>
      prev.map((c) => (c.id === id ? updated : c)),
    );
  }, []);

  const loadMore = useCallback(() => {
    setVisibleCount((n) => n + PAGE_SIZE);
  }, []);

  return {
    comments: visibleComments,
    draft,
    setDraft,
    submitting,
    hasMore,
    submit,
    vote,
    loadMore,
  };
}
