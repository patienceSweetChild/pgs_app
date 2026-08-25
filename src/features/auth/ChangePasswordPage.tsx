"use client";

import { FormEvent, useState } from "react";
import { useExperience } from "@/lib/auth/experience";
import { StudentIdentityCard } from "@/features/home/components/HeroTops";
import "./auth.css";

/**
 * Change password — from standalone-html/change-password.html
 * (logged-in security refresh with old + new password fields).
 */
export function ChangePasswordPage() {
  const { experience } = useExperience();
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const premium =
    experience === "authenticated_premium"
      ? "approved"
      : experience === "authenticated_standard"
        ? "none"
        : "none";

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSuccess("");
    if (!oldPassword || !password || !confirm) {
      setError("Please fill in all password fields.");
      return;
    }
    if (password.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    setError("");
    setSuccess("Password updated successfully. (Mock — wire API later.)");
    setOldPassword("");
    setPassword("");
    setConfirm("");
  }

  return (
    <div className="wrapper-content mobile-change-password">
      {experience !== "anonymous" ? (
        <StudentIdentityCard premium={premium} />
      ) : null}

      <section className="pt-0 half-section overlap-height position-relative overflow-hidden">
        <div className="container overlap-gap-section p-0">
          <div className="row align-items-center justify-content-md-center">
            <div className="w-305px explore-section">
              <div className="card card-explore border-color-transparent">
                <h3 className="mb-3 fw-500 fs-40 text-black mobile-fs-20 mobile-lh-full">
                  Time for a quick security refresh?
                </h3>
                <p className="mb-0 fs-18 fw-500 mobile-fs-14">
                  Change password here
                </p>

                {success ? (
                  <div
                    className="alert alert-success"
                    role="alert"
                    style={{
                      padding: "12px 16px",
                      marginBottom: 20,
                      backgroundColor: "#d4edda",
                      color: "#155724",
                      border: "1px solid #c3e6cb",
                      borderRadius: 4,
                    }}
                  >
                    {success}
                  </div>
                ) : null}

                {error ? (
                  <div
                    className="alert alert-danger"
                    role="alert"
                    style={{
                      padding: "12px 16px",
                      marginBottom: 20,
                      backgroundColor: "#f8d7da",
                      color: "#721c24",
                      border: "1px solid #f5c6cb",
                      borderRadius: 4,
                    }}
                  >
                    {error}
                  </div>
                ) : null}

                <form onSubmit={onSubmit} noValidate>
                  <div className="form-group pb-3 pt-4">
                    <div className="form-password changePassword">
                      <input
                        type="password"
                        name="old_password"
                        className="mb-3"
                        placeholder="Old password"
                        required
                        autoComplete="current-password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                      <input
                        type="password"
                        name="password"
                        className="mb-3"
                        placeholder="Set your password"
                        required
                        minLength={6}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <input
                        type="password"
                        name="cpassword"
                        className="mb-3"
                        placeholder="Confirm your password"
                        required
                        minLength={6}
                        autoComplete="new-password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-purple w-50 mobile-fs-14 mobile-w-60"
                      style={{ backgroundColor: "#2489FF" }}
                    >
                      Save Change
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
