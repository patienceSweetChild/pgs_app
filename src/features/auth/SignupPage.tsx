"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useExperience } from "@/lib/auth/experience";
import { uploadAvatar } from "@/lib/supabase/storage";
import "./auth.css";
import {
  COUNTRIES,
  DIAL_CODES,
  PATHWAYS,
  PENDING_SIGNUP_KEY,
  STUDY_LEVELS,
} from "./content";

export function SignupPage() {
  const router = useRouter();
  const { loginAs } = useExperience();
  const [email, setEmail] = useState("");
  const [ready, setReady] = useState(false);
  const [pathwayOpen, setPathwayOpen] = useState(false);
  const [activePath, setActivePath] = useState<string | null>(null);
  const [avatarSrc, setAvatarSrc] = useState("/assets/img/avatar.png");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [dialCode, setDialCode] = useState("");
  const [number, setNumber] = useState("");
  const [whatsapp, setWhatsapp] = useState<"Yes" | "No" | "">("");
  const [country, setCountry] = useState("");
  const [preferredCountry, setPreferredCountry] = useState("");
  const [studyLevel, setStudyLevel] = useState("");
  const [fieldInterest, setFieldInterest] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    let pending = "";
    try {
      pending = sessionStorage.getItem(PENDING_SIGNUP_KEY) || "";
    } catch {
      pending = "";
    }
    if (!pending) {
      setError("Please register first to complete your profile.");
      router.replace("/login?signup=1");
      return;
    }
    setEmail(pending);
    setReady(true);
  }, [router]);

  function selectPathway(id: string) {
    setActivePath(id);
    setPathwayOpen(true);
  }

  function onAvatarChange(file: File | undefined) {
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setAvatarSrc(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Full Name is required.");
      return;
    }
    if (!dialCode || !number.trim()) {
      setError("Phone number is required.");
      return;
    }
    if (!whatsapp) {
      setError("Please confirm if the number is on WhatsApp.");
      return;
    }
    if (!country || !preferredCountry || !studyLevel) {
      setError("Please complete country and study level fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      sessionStorage.removeItem(PENDING_SIGNUP_KEY);
    } catch {
      /* ignore */
    }

    try {
      const { isSupabaseConfigured } = await import("@/lib/supabase/config");
      if (!isSupabaseConfigured()) {
        loginAs("authenticated_standard");
        router.push("/");
        return;
      }

      const { createSupabaseBrowserClient } = await import(
        "@/lib/supabase/client"
      );
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please sign in again to complete your profile.");
        router.replace("/login?signup=1");
        return;
      }

      let avatarPath: string | null = null;
      if (avatarFile) {
        const uploaded = await uploadAvatar(supabase, user.id, avatarFile);
        avatarPath = uploaded.path;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: name.trim(),
          dial_code: dialCode,
          phone: number.trim(),
          whatsapp: whatsapp === "Yes",
          citizenship_country: country,
          preferred_study_country: preferredCountry,
          study_level: studyLevel,
          field_interest: fieldInterest,
          work_experience: workExperience,
          referral_code: referralCode || null,
          ...(avatarPath ? { avatar_path: avatarPath } : {}),
          profile_completed_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready) {
    return (
      <div className="wrapper-content pgs-auth-page">
        <section className="pgs-signup-section about-section half-section overlap-height position-relative">
          <div className="m-auto overlap-gap-section p-0 text-center pt-10">
            <p className="text-black">Loading…</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="wrapper-content pgs-auth-page">
      <section className="pgs-signup-section about-section half-section overlap-height position-relative">
        <div className="m-auto overlap-gap-section p-0">
          <div className="row align-items-center justify-content-md-center">
            <div className="">
              <div className="text-center mobile-flow-arrow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/img/arrow-down-1.png"
                  className="newarrow-singup"
                  alt=""
                />
                <h5
                  className="fnt-family text-black fs-48 text-start m-auto"
                  style={{ width: 327 }}
                >
                  Start by choosing your pathway.
                </h5>
              </div>

              <div className="path">
                <div className="heart-icon w-80">
                  <i className="bi bi-heart-fill" />
                </div>

                {PATHWAYS.map((path) => (
                  <div
                    key={path.id}
                    data-target="content1"
                    role="button"
                    tabIndex={0}
                    onClick={() => selectPathway(path.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        selectPathway(path.id);
                      }
                    }}
                    className={`d-flex w-723px m-auto justify-content-center align-items-center gap-1 mt-2 path-item flex-item-m${
                      activePath === path.id ? " active" : ""
                    }`}
                  >
                    <div className="bg-path">
                      <span>{path.label}</span>
                      <br />
                      <i className="bi bi-arrow-right-short fs-40" />
                    </div>
                    <h5 className="mb-0 fs-18 lh-25 text-black bg-gray border-radius-8px p-2 fw-500">
                      {path.lines.map((line, i) => (
                        <span key={line}>
                          {line}
                          {i < path.lines.length - 1 ? <br /> : null}
                        </span>
                      ))}
                    </h5>
                  </div>
                ))}
              </div>

              <div className="w-704px m-auto">
                <div
                  className="content"
                  id="content1"
                  style={{ display: pathwayOpen ? "block" : "none" }}
                >
                  {error ? (
                    <div className="auth-alert auth-alert-danger" role="alert">
                      {error}
                    </div>
                  ) : null}

                  <form onSubmit={onSubmit} encType="multipart/form-data">
                    <div className="singup-process mt-10 w-80 m-auto">
                      <div className="choose-avatar d-flex align-items-center gap-3 position-relative">
                        <div className="circle-avartar">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img id="avatarPreview" src={avatarSrc} alt="avatar" />
                        </div>
                        <div className="choose-avatar-text">
                          <label htmlFor="chooseImg">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/assets/img/edit-03.png" alt="Upload" />
                          </label>
                          <input
                            type="file"
                            id="chooseImg"
                            name="profile_image"
                            accept="image/*"
                            className="d-none"
                            onChange={(e) =>
                              onAvatarChange(e.target.files?.[0])
                            }
                          />
                        </div>
                        <p className="mb-0">
                          Upload your pic here for personalization , preferably
                          in square
                        </p>
                      </div>
                      <hr />
                    </div>

                    <div className="w-100 m-auto black-border">
                      <div className="form-group d-flex align-items-center border-bottom pb-2">
                        <label
                          htmlFor="name"
                          className="form-label w-50 lh-30 text-black fs-24 fw-500 mb-0"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="form-control w-70 p-2"
                          id="name"
                          placeholder="Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group d-flex align-items-center border-bottom pb-2 pt-2">
                        <label
                          htmlFor="email"
                          className="form-label w-50 lh-30 text-black fs-24 fw-500 mb-0"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="form-control w-70 p-2"
                          id="email"
                          value={email}
                          readOnly
                          style={{ backgroundColor: "#f0f0f0" }}
                        />
                      </div>

                      <div className="form-group d-flex align-items-center border-bottom pb-2 pt-2">
                        <label
                          htmlFor="dial_code"
                          className="form-label w-50 lh-30 text-black fs-24 fw-500 mb-0"
                        >
                          Phone Number
                        </label>
                        <div className="w-70 d-flex gap-2">
                          <select
                            name="dial_code"
                            id="dial_code"
                            className="form-control w-30 p-2"
                            required
                            value={dialCode}
                            onChange={(e) => setDialCode(e.target.value)}
                          >
                            <option value="">Code</option>
                            {DIAL_CODES.map((code) => (
                              <option key={code} value={code}>
                                {code}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            name="number"
                            className="form-control w-70 p-2"
                            placeholder="Phone Number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group nowrap d-flex align-items-center border-bottom pb-2 pt-2">
                        <label className="form-label w-50 lh-30 text-black fs-24 fw-500 mb-0">
                          Whatsapp Number
                        </label>
                        <div className="d-flex align-items-center gap-3 lh-20-m">
                          <div className="d-flex gap-2 align-items-center w-m-50">
                            <label htmlFor="whatsappYes">Yes</label>
                            <input
                              type="radio"
                              name="whatsapp"
                              id="whatsappYes"
                              value="Yes"
                              className="form-check-input"
                              style={{ padding: "12px" }}
                              checked={whatsapp === "Yes"}
                              onChange={() => setWhatsapp("Yes")}
                              required
                            />
                          </div>
                          <div className="d-flex gap-2 align-items-center w-m-50">
                            <label htmlFor="whatsappNo">No</label>
                            <input
                              type="radio"
                              name="whatsapp"
                              id="whatsappNo"
                              value="No"
                              className="form-check-input"
                              style={{ padding: "12px" }}
                              checked={whatsapp === "No"}
                              onChange={() => setWhatsapp("No")}
                            />
                          </div>
                          Is the above number on Whatsapp?
                        </div>
                      </div>

                      <div className="form-group d-flex align-items-center border-bottom pb-2 pt-2">
                        <label
                          htmlFor="country_code"
                          className="form-label w-50 lh-30 text-black fs-24 fw-500 mb-0"
                        >
                          Country of Citizenship
                        </label>
                        <select
                          name="country_code"
                          id="country_code"
                          className="w-70 form-select border-radius-8px p-2"
                          required
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                        >
                          <option value="">-- Select Country --</option>
                          {COUNTRIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group d-flex align-items-center border-bottom pb-2 pt-2">
                        <label
                          htmlFor="preferred_country_code"
                          className="form-label w-50 lh-30 text-black fs-24 fw-500 mb-0"
                        >
                          Preferred Study Country
                        </label>
                        <select
                          name="preferred_country_code"
                          id="preferred_country_code"
                          className="w-70 form-select border-radius-8px p-2"
                          required
                          value={preferredCountry}
                          onChange={(e) => setPreferredCountry(e.target.value)}
                        >
                          <option value="">-- Preferred Study Country --</option>
                          {COUNTRIES.map((c) => (
                            <option key={`pref-${c}`} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group d-flex align-items-center border-bottom pb-2 pt-2">
                        <label
                          htmlFor="study_level"
                          className="form-label w-50 lh-30 text-black fs-24 fw-500 mb-0"
                        >
                          Study Level
                        </label>
                        <select
                          name="study_level"
                          id="study_level"
                          className="w-70 form-select border-radius-8px p-2"
                          required
                          value={studyLevel}
                          onChange={(e) => setStudyLevel(e.target.value)}
                        >
                          <option value="">-- Study Level --</option>
                          {STUDY_LEVELS.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group d-flex align-items-center border-bottom pb-2 pt-2">
                        <label
                          htmlFor="field_interest"
                          className="form-label w-50 lh-30 text-black fs-24 fw-500 mb-0"
                        >
                          Course or Field of Interest
                        </label>
                        <textarea
                          name="field_interest"
                          id="field_interest"
                          className="w-70 form-control"
                          rows={3}
                          value={fieldInterest}
                          onChange={(e) => setFieldInterest(e.target.value)}
                        />
                      </div>

                      <div className="form-group d-flex align-items-center border-bottom pb-2 pt-2">
                        <label
                          htmlFor="work_experience"
                          className="form-label w-50 lh-30 text-black fs-20 fw-500 mb-0"
                        >
                          Work Experience <span> (If Any)</span>
                        </label>
                        <textarea
                          name="work_experience"
                          id="work_experience"
                          className="w-70 form-control"
                          rows={3}
                          value={workExperience}
                          onChange={(e) => setWorkExperience(e.target.value)}
                        />
                      </div>

                      <div className="form-group d-flex align-items-center pb-2 pt-2 border-bottom">
                        <label
                          htmlFor="referral_code"
                          className="form-label w-50 lh-30 text-black fs-20 fw-500 mb-0"
                        >
                          Referral Code
                        </label>
                        <input
                          type="text"
                          name="referral_code"
                          id="referral_code"
                          className="form-control w-70 p-2"
                          value={referralCode}
                          onChange={(e) => setReferralCode(e.target.value)}
                        />
                      </div>

                      <div className="form-group d-flex align-items-start w-50 pb-3 pt-4 text-end m-w-100">
                        <div className="form-password text-start">
                          <input
                            type="password"
                            name="password"
                            className="mb-3 p-2 border-radius-0px"
                            placeholder="Set your password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <input
                            type="password"
                            name="cpassword"
                            className="mb-3 p-2 border-radius-0px"
                            placeholder="Confirm your password"
                            required
                            minLength={6}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                          <button
                            type="submit"
                            className="btn btn-purple w-50"
                            style={{ backgroundColor: "#2489FF" }}
                            disabled={submitting}
                          >
                            Complete Profile
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 text-sm">
                        <p className="text-green-600 font-semibold mb-0 text-black">
                          <b>✅ Checkbox:</b>{" "}
                          <span className="text-black">
                            &quot;I agree to the Terms & Privacy Policy&quot;
                          </span>
                        </p>
                        <p className="text-green-700 font-semibold text-black">
                          <b> 🔒 OTP Verification </b>
                          <span className="text-black">(Phone or Email)</span>
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
