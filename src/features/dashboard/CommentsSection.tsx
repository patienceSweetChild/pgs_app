"use client";

import { DEFAULT_AVATAR, useExperience } from "@/lib/auth/experience";
import { GUEST_PROFILE } from "./content";
import {
  formatCommentTime,
  useDashboardComments,
} from "./useDashboardComments";

export function CommentsSection() {
  const { isLoggedIn, fullName, avatarUrl } = useExperience();
  const name = isLoggedIn
    ? fullName?.trim() || "Student"
    : GUEST_PROFILE.name;
  const avatar = isLoggedIn ? avatarUrl || DEFAULT_AVATAR : GUEST_PROFILE.avatar;
  const {
    comments,
    draft,
    setDraft,
    submitting,
    hasMore,
    submit,
    vote,
    loadMore,
  } = useDashboardComments({
    name,
    avatar,
  });

  return (
    <>
      <section className="pt-4 pb-0 mobile-pb-10">
        <div>
          <div className="row justify-content-center">
            <div className="col-lg-11 d-flex gap-2 mobile-row-reverse">
              <p className="mb-0 w-60 fw-600 text-black d-flex gap-2 fs-17 lh-22 qd-heading mobile-fs-14 mobile-lh-full">
                <span>*</span>
                Got a quick doubt? Drop it in the comments. For detailed
                queries or feedback, reach out via email, direct call, group
                meet, or join our feedback sessions.
              </p>
              <div className="w-30">
                <div className="tag-perks mobile-tag-perks">Status</div>
                <div>
                  <span className="cardbox-scholarship">
                    Ready for Your <br /> Input
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-4 pb-0">
        <div>
          <div className="row justify-content-center">
            <div className="col-lg-11">
              <div className="comment-box-grid">
                <h3>Comments</h3>

                <div className="comment-input">
                  <div className="comment-header">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatar} alt={name} />
                    {name}
                  </div>
                  <div className="comment-text">
                    <textarea
                      placeholder=" Hey I am facing difficulty with my SOP can you help me out?"
                      className="form-control"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="comment-actions">
                    <div className="vote-btns">
                      <button type="button" aria-label="Upvote (composer)">
                        <i className="bi bi-arrow-up-short" />
                      </button>
                      <button type="button" aria-label="Downvote (composer)">
                        <i className="bi bi-arrow-down-short" />
                      </button>
                    </div>
                    <button
                      className="comment-btn btn"
                      type="button"
                      disabled={submitting || !draft.trim()}
                      onClick={() => void submit()}
                    >
                      Comment
                    </button>
                  </div>
                </div>

                {comments.map((c) => (
                  <div className="comment-item" key={c.id}>
                    <div className="comment-author">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.avatarUrl} alt={c.authorName} />
                      <h4>{c.authorName}</h4>
                    </div>
                    <div className="comment-content">{c.body}</div>
                    <div className="comment-footer">
                      <button
                        type="button"
                        aria-label="Upvote"
                        style={
                          c.userVote === "up"
                            ? { background: "#f3f0ff" }
                            : undefined
                        }
                        onClick={() => void vote(c.id, "up")}
                      >
                        <i className="bi bi-arrow-up-short" />
                      </button>
                      <button
                        type="button"
                        aria-label="Downvote"
                        style={
                          c.userVote === "down"
                            ? { background: "#fff0ed" }
                            : undefined
                        }
                        onClick={() => void vote(c.id, "down")}
                      >
                        <i className="bi bi-arrow-down-short" />
                      </button>
                      <span>{formatCommentTime(c.createdAt)}</span>
                    </div>
                  </div>
                ))}

                {hasMore ? (
                  <div className="load-more">
                    <button
                      type="button"
                      className="btn"
                      onClick={loadMore}
                    >
                      Load More
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
