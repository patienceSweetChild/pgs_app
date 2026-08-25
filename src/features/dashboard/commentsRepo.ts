import { COMMENTS_SEED, type DashboardComment } from "./content";

/**
 * Mock comments API. Swap implementations for Supabase later —
 * callers already use async Promise-returning methods.
 */
let store: DashboardComment[] = COMMENTS_SEED.map((c) => ({ ...c }));

export async function listComments(): Promise<DashboardComment[]> {
  return store.map((c) => ({ ...c }));
}

export async function createComment(input: {
  authorName: string;
  avatarUrl: string;
  body: string;
}): Promise<DashboardComment> {
  const comment: DashboardComment = {
    id: `cmt-${Date.now()}`,
    authorName: input.authorName,
    avatarUrl: input.avatarUrl,
    body: input.body.trim(),
    createdAt: new Date().toISOString(),
    score: 0,
    userVote: null,
  };
  store = [comment, ...store];
  return { ...comment };
}

export async function voteComment(
  id: string,
  vote: "up" | "down",
): Promise<DashboardComment | null> {
  const idx = store.findIndex((c) => c.id === id);
  if (idx < 0) return null;

  const current = store[idx];
  let score = current.score;
  let userVote: DashboardComment["userVote"] = vote;

  if (current.userVote === vote) {
    // Toggle off
    score += vote === "up" ? -1 : 1;
    userVote = null;
  } else if (current.userVote === null) {
    score += vote === "up" ? 1 : -1;
  } else {
    // Switch vote
    score += vote === "up" ? 2 : -2;
  }

  const updated: DashboardComment = { ...current, score, userVote };
  store = [...store.slice(0, idx), updated, ...store.slice(idx + 1)];
  return { ...updated };
}

/** Test helper — reset in-memory store to seed */
export function resetCommentsStore() {
  store = COMMENTS_SEED.map((c) => ({ ...c }));
}
