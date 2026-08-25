"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import "./auth.css";

/**
 * Forgot password — from standalone-html/forgot-password.html
 * (form body; shell provides header/footer). Linked from /login.
 */
export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    setError("");
    setSubmitted(true);
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

                {submitted ? (
                  <div className="form-group pb-3 pt-4">
                    <p className="text-black fs-16 mb-3">
                      If an account exists for <b>{email.trim()}</b>, we&apos;ll
                      send reset instructions. (Mock — wire API later.)
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
                        <input
                          type="email"
                          name="email"
                          className="mb-3"
                          placeholder="Enter Email"
                          required
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      {error ? (
                        <p className="text-danger fs-14 mb-2">{error}</p>
                      ) : null}
                      <button
                        type="submit"
                        className="btn btn-purple w-35"
                        style={{ backgroundColor: "#2489FF" }}
                      >
                        Submit
                      </button>
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
