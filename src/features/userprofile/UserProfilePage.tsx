"use client";

import { FormEvent, useEffect, useState } from "react";
import { COUNTRIES, DIAL_CODES, STUDY_LEVELS } from "@/features/auth/content";
import { useExperience } from "@/lib/auth/experience";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  publicObjectUrl,
  STORAGE_BUCKETS,
  uploadAvatar,
} from "@/lib/supabase/storage";
import { PROFILE_CARD } from "./content";
import "./userprofile.css";

/**
 * User profile — Saved/Dashboard ID card + form fields + password row.
 */
export function UserProfilePage() {
  const { refreshSession, isLoggedIn, ready: authReady } = useExperience();
  const [avatarSrc, setAvatarSrc] = useState<string>(PROFILE_CARD.avatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [cardName, setCardName] = useState("");
  const [cardId, setCardId] = useState("");
  const [cardHandle, setCardHandle] = useState("");
  const [name, setName] = useState("");
  const [dialCode, setDialCode] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState<"Yes" | "No" | "">("");
  const [country, setCountry] = useState("");
  const [preferredCountry, setPreferredCountry] = useState("");
  const [studyLevel, setStudyLevel] = useState("");
  const [fieldInterest, setFieldInterest] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authReady) return;

    void (async () => {
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      try {
        const supabase = createSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from("profiles")
          .select(
            "full_name, dial_code, phone, whatsapp, citizenship_country, preferred_study_country, study_level, field_interest, work_experience, referral_code, pgs_code, avatar_path",
          )
          .eq("id", user.id)
          .maybeSingle();

        if (fetchError) {
          setError(fetchError.message);
          setLoading(false);
          return;
        }

        const fullName = data?.full_name?.trim() ?? "";
        setName(fullName);
        setCardName(fullName || PROFILE_CARD.name);
        setDialCode(data?.dial_code ?? "");
        setPhone(data?.phone ?? "");
        setWhatsapp(
          data?.whatsapp === true ? "Yes" : data?.whatsapp === false ? "No" : "",
        );
        setCountry(data?.citizenship_country ?? "");
        setPreferredCountry(data?.preferred_study_country ?? "");
        setStudyLevel(data?.study_level ?? "");
        setFieldInterest(data?.field_interest ?? "");
        setWorkExperience(data?.work_experience ?? "");
        setReferralCode(data?.referral_code ?? "");
        setCardId(data?.pgs_code ?? user.id.slice(0, 8));
        setCardHandle(
          user.email ? `@${user.email.split("@")[0]}` : PROFILE_CARD.handle,
        );
        const avatarUrl = publicObjectUrl(
          supabase,
          STORAGE_BUCKETS.avatars,
          data?.avatar_path,
        );
        if (avatarUrl) setAvatarSrc(avatarUrl);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not load profile.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [authReady]);

  function onAvatarChange(file: File | undefined) {
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setAvatarSrc(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus(null);

    if (!name.trim()) {
      setError("Full Name is required.");
      return;
    }

    const changingPassword = Boolean(
      password || confirmPassword || oldPassword,
    );
    if (changingPassword) {
      if (!oldPassword || !password || !confirmPassword) {
        setError("Please fill in all password fields, or leave them empty.");
        return;
      }
      if (password.length < 6) {
        setError("New password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please sign in to save your profile.");
        return;
      }

      let avatarPath: string | undefined;
      if (avatarFile) {
        const uploaded = await uploadAvatar(supabase, user.id, avatarFile);
        avatarPath = uploaded.path;
        setAvatarSrc(uploaded.publicUrl);
        setAvatarFile(null);
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: name.trim(),
          dial_code: dialCode || null,
          phone: phone.trim() || null,
          whatsapp: whatsapp === "Yes" ? true : whatsapp === "No" ? false : null,
          citizenship_country: country || null,
          preferred_study_country: preferredCountry || null,
          study_level: studyLevel || null,
          field_interest: fieldInterest || null,
          work_experience: workExperience || null,
          referral_code: referralCode.trim() || null,
          ...(avatarPath ? { avatar_path: avatarPath } : {}),
        })
        .eq("id", user.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      if (changingPassword) {
        if (!user.email) {
          setError("No email on account; cannot change password.");
          return;
        }
        const { error: reauthError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: oldPassword,
        });
        if (reauthError) {
          setError("Old password is incorrect.");
          return;
        }
        const { error: pwError } = await supabase.auth.updateUser({
          password,
        });
        if (pwError) {
          setError(pwError.message);
          return;
        }
      }

      setCardName(name.trim());
      setOldPassword("");
      setPassword("");
      setConfirmPassword("");
      setStatus("Profile saved.");
      await refreshSession();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile.");
    } finally {
      setSubmitting(false);
    }
  }

  async function sendPasswordLink() {
    setError(null);
    setStatus(null);
    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured.");
      return;
    }
    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.email) {
        setError("No email on account.");
        return;
      }
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        user.email,
        { redirectTo: `${window.location.origin}/change-password` },
      );
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setStatus("Password reset link sent to your email.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not send reset link.",
      );
    }
  }

  if (!authReady || loading) {
    return (
      <div className="wrapper-content pgs-profile-page">
        <section className="pt-0 half-section">
          <p className="text-black text-center pt-10">Loading profile…</p>
        </section>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="wrapper-content pgs-profile-page">
        <section className="pt-0 half-section">
          <p className="text-black text-center pt-10">
            Please sign in to view and edit your profile.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="wrapper-content pgs-profile-page">
      <section className="pt-0 mobile-student-cart about-section half-section overlap-height position-relative overflow-visible pgs-identity-card">
        <div className="pgs-profile-header">
          <div className="w-729px p-0 m-auto">
            <div className="card-box-avatar">
              <div className="avatar-info position-relative">
                <div className="avatar-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarSrc}
                    alt=""
                    className="border-radius-6px"
                  />
                  <div className="avatar_name">
                    <h5 className="mb-3">{cardName || "Student"}</h5>
                    <span>{cardHandle}</span>
                    <span>id: {cardId}</span>
                  </div>
                </div>
                <div className="title-info">
                  <h5 className="mb-0">{PROFILE_CARD.premiumLabel}</h5>
                  <h6 className="mb-0">{PROFILE_CARD.pathway}</h6>
                </div>
              </div>
              <div className="avatar-heading-right-box">
                <h4 className="mb-0">#PURPLEPREMIUM</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-0 half-section overlap-height position-relative overflow-hidden">
        <div className="pgs-profile-form-wrap">
          <form onSubmit={(e) => void onSubmit(e)} encType="multipart/form-data">
            {error ? (
              <div className="pgs-profile-alert" role="alert">
                {error}
              </div>
            ) : null}
            {status ? (
              <p className="text-black fs-16 mb-3" role="status">
                {status}
              </p>
            ) : null}

            <div className="singup-process mt-6 w-80 m-auto">
              <div className="choose-avatar d-flex align-items-center gap-3 position-relative">
                <div className="circle-avartar">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={avatarSrc} alt="avatar" />
                </div>
                <div className="choose-avatar-text">
                  <label htmlFor="profileChooseImg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/img/edit-03.png" alt="Upload" />
                  </label>
                  <input
                    type="file"
                    id="profileChooseImg"
                    name="profile_image"
                    accept="image/*"
                    className="d-none"
                    onChange={(e) => onAvatarChange(e.target.files?.[0])}
                  />
                </div>
                <p className="mb-0">
                  Upload your pic here for personalization, preferably in square
                </p>
              </div>
              <hr />
            </div>

            <div className="w-100 m-auto black-border">
              <div className="form-group d-flex align-items-center border-bottom pb-2">
                <label
                  htmlFor="profile-name"
                  className="form-label w-50 lh-30 text-black fs-24 fw-500 mb-0"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="profile-name"
                  name="name"
                  className="form-control w-70 p-2"
                  placeholder="(as per passport or official ID)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group d-flex align-items-center border-bottom pb-2 pt-2">
                <label
                  htmlFor="profile-phone"
                  className="form-label w-50 lh-30 text-black fs-24 fw-500 mb-0"
                >
                  Phone Number
                </label>
                <div className="w-70 d-flex gap-2">
                  <select
                    name="dial_code"
                    id="profile-dial"
                    className="form-control w-30 p-2"
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
                    id="profile-phone"
                    name="number"
                    className="form-control w-70 p-2"
                    placeholder="(with country code)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group nowrap d-flex align-items-center border-bottom pb-2 pt-2">
                <label className="form-label w-50 lh-30 text-black fs-24 fw-500 mb-0">
                  Whatsapp Number
                </label>
                <div className="d-flex align-items-center gap-3 lh-20-m">
                  <div className="d-flex gap-2 align-items-center w-m-50">
                    <label htmlFor="profileWhatsappYes">Yes</label>
                    <input
                      type="radio"
                      name="whatsapp"
                      id="profileWhatsappYes"
                      value="Yes"
                      className="form-check-input"
                      style={{ padding: 12 }}
                      checked={whatsapp === "Yes"}
                      onChange={() => setWhatsapp("Yes")}
                    />
                  </div>
                  <div className="d-flex gap-2 align-items-center w-m-50">
                    <label htmlFor="profileWhatsappNo">No</label>
                    <input
                      type="radio"
                      name="whatsapp"
                      id="profileWhatsappNo"
                      value="No"
                      className="form-check-input"
                      style={{ padding: 12 }}
                      checked={whatsapp === "No"}
                      onChange={() => setWhatsapp("No")}
                    />
                  </div>
                  Is the above number on Whatsapp?
                </div>
              </div>

              <div className="form-group d-flex align-items-center border-bottom pb-2 pt-2">
                <label
                  htmlFor="profile-country"
                  className="form-label w-50 lh-30 text-black fs-24 fw-500 mb-0"
                >
                  Country of Citizenship
                </label>
                <select
                  name="country_code"
                  id="profile-country"
                  className="w-70 form-select border-radius-8px p-2"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="">(with country code)</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group d-flex align-items-center border-bottom pb-2 pt-2">
                <label
                  htmlFor="profile-preferred-country"
                  className="form-label w-50 lh-30 text-black fs-24 fw-500 mb-0"
                >
                  Preferred Study Country
                </label>
                <select
                  name="preferred_country_code"
                  id="profile-preferred-country"
                  className="w-70 form-select border-radius-8px p-2"
                  value={preferredCountry}
                  onChange={(e) => setPreferredCountry(e.target.value)}
                >
                  <option value="">
                    (multi-select: UK, USA, Canada, Germany, Australia, etc.)
                  </option>
                  {COUNTRIES.map((c) => (
                    <option key={`pref-${c}`} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group d-flex align-items-center border-bottom pb-2 pt-2">
                <label
                  htmlFor="profile-study-level"
                  className="form-label w-50 lh-30 text-black fs-24 fw-500 mb-0"
                >
                  Study Level
                </label>
                <select
                  name="study_level"
                  id="profile-study-level"
                  className="w-70 form-select border-radius-8px p-2"
                  value={studyLevel}
                  onChange={(e) => setStudyLevel(e.target.value)}
                >
                  <option value="">
                    (multi-select: UG / PG / PhD / Post MBBS / Medical Student)
                  </option>
                  {STUDY_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group d-flex align-items-center border-bottom pb-2 pt-2">
                <label
                  htmlFor="profile-field-interest"
                  className="form-label w-50 lh-30 text-black fs-24 fw-500 mb-0"
                >
                  Course or Field of Interest
                </label>
                <textarea
                  name="field_interest"
                  id="profile-field-interest"
                  className="w-70 form-control"
                  rows={3}
                  placeholder="(open text description box)"
                  value={fieldInterest}
                  onChange={(e) => setFieldInterest(e.target.value)}
                />
              </div>

              <div className="form-group d-flex align-items-center border-bottom pb-2 pt-2">
                <label
                  htmlFor="profile-work-experience"
                  className="form-label w-50 lh-30 text-black fs-20 fw-500 mb-0"
                >
                  Work Experience <span>(If Any)</span>
                </label>
                <textarea
                  name="work_experience"
                  id="profile-work-experience"
                  className="w-70 form-control"
                  rows={3}
                  placeholder="(open text description box)"
                  value={workExperience}
                  onChange={(e) => setWorkExperience(e.target.value)}
                />
              </div>

              <div className="form-group d-flex align-items-center pb-2 pt-2 border-bottom">
                <label
                  htmlFor="profile-referral"
                  className="form-label w-50 lh-30 text-black fs-20 fw-500 mb-0"
                >
                  Referral Code
                </label>
                <input
                  type="text"
                  name="referral_code"
                  id="profile-referral"
                  className="form-control w-70 p-2"
                  placeholder="(If Any)"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                />
              </div>

              <div className="pgs-profile-password-row">
                <div className="form-password changePassword text-start">
                  <input
                    type="password"
                    name="old_password"
                    className="mb-3"
                    placeholder="Old password"
                    autoComplete="current-password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    name="password"
                    className="mb-3"
                    placeholder="New password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    name="cpassword"
                    className="mb-3"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn btn-purple w-50 mobile-fs-14"
                    style={{ backgroundColor: "#2489FF" }}
                    disabled={submitting}
                  >
                    {submitting ? "Saving…" : "Save Change"}
                  </button>
                </div>
                <p className="pgs-profile-or">OR</p>
                <button
                  type="button"
                  className="btn btn-purple pgs-profile-send-link"
                  onClick={() => void sendPasswordLink()}
                >
                  SEND PASSWORD LINK
                </button>
              </div>

              <div className="mt-4 text-sm">
                <p className="font-semibold mb-0 text-black">
                  <b>✅ Checkbox:</b>{" "}
                  <span>
                    &quot;I agree to the Terms & Privacy Policy&quot;
                  </span>
                </p>
                <p className="font-semibold text-black">
                  <b>🔒 OTP Verification </b>
                  <span>(Phone or Email)</span>
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
