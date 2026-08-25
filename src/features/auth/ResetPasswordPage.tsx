"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import "./auth.css";

/**
 * Reset password — from standalone-html/reset-password.html.
 */
export function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setDone(true);
  }

  return (
    <div className="wrapper-content">
      <section className="pt-0 half-section overlap-height position-relative overflow-hidden">
        <div className="container overlap-gap-section p-0">
          <div className="row align-items-center justify-content-md-center">
            <div className="col-lg-4 col-md-12 explore-section mobile-w-80 mobile-m-auto">
              <div className="card card-explore border-color-transparent">
                <h3 className="mb-3 fw-500 fs-50 text-black mobile-fs-25">
                  Time for a quick security refresh?
                </h3>
                <p className="mb-0 fs-18 fw-500">Change password here</p>

                {done ? (
                  <div className="form-group pb-3 pt-4">
                    <p className="text-black fs-16 mb-3">
                      Password updated. (Mock — wire API later.)
                    </p>
                    <Link href="/login" className="btn btn-purple w-35">
                      Back to login
                    </Link>
                  </div>
                ) : (
                  <form
                    className="form-horizontal m-t-20"
                    onSubmit={onSubmit}
                    noValidate
                  >
                    <div className="form-group pb-3 pt-4">
                      <div className="form-password changePassword">
                        <div className="input-group mb-3">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder="Set your password"
                            required
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text d-flex align-items-center"
                              style={{
                                cursor: "pointer",
                                height: "100%",
                                borderRadius: 0,
                              }}
                              onClick={() => setShowPassword((v) => !v)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  setShowPassword((v) => !v);
                                }
                              }}
                            >
                              <i
                                className={`fa ${
                                  showPassword ? "fa-eye-slash" : "fa-eye"
                                }`}
                              />
                            </span>
                          </div>
                        </div>

                        <div className="input-group mb-3">
                          <input
                            type={showConfirm ? "text" : "password"}
                            id="cpassword"
                            name="cpassword"
                            className="form-control"
                            placeholder="Confirm your password"
                            required
                            autoComplete="new-password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text d-flex align-items-center"
                              style={{
                                cursor: "pointer",
                                height: "100%",
                                borderRadius: 0,
                              }}
                              onClick={() => setShowConfirm((v) => !v)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  setShowConfirm((v) => !v);
                                }
                              }}
                            >
                              <i
                                className={`fa ${
                                  showConfirm ? "fa-eye-slash" : "fa-eye"
                                }`}
                              />
                            </span>
                          </div>
                        </div>

                        {error ? (
                          <p className="text-danger fs-14 mb-2">{error}</p>
                        ) : null}

                        <button
                          type="submit"
                          className="btn btn-purple w-35"
                          style={{ backgroundColor: "#2489FF" }}
                        >
                          Reset Password
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
