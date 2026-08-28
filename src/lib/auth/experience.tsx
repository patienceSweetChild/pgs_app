"use client";

import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  publicObjectUrl,
  STORAGE_BUCKETS,
} from "@/lib/supabase/storage";

/** Matches student experience model used across SoftLock / Home / Header. */
export type Experience =
  | "anonymous"
  | "authenticated_standard"
  | "authenticated_premium";

type ExperienceContextValue = {
  experience: Experience;
  setExperience: (next: Experience) => void;
  isLoggedIn: boolean;
  isPremium: boolean;
  loginAs: (next: Exclude<Experience, "anonymous">) => void;
  logout: () => void;
  ready: boolean;
  userId: string | null;
  fullName: string | null;
  email: string | null;
  avatarUrl: string | null;
  pgsCode: string | null;
  refreshSession: () => Promise<void>;
};

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

const DEFAULT_AVATAR = "/assets/img/student-avatar.png";

function experienceFromFlags(loggedIn: boolean, premium: boolean): Experience {
  if (!loggedIn) return "anonymous";
  if (premium) return "authenticated_premium";
  return "authenticated_standard";
}

function clearIdentity(
  setUserId: (v: string | null) => void,
  setFullName: (v: string | null) => void,
  setEmail: (v: string | null) => void,
  setAvatarUrl: (v: string | null) => void,
  setPgsCode: (v: string | null) => void,
) {
  setUserId(null);
  setFullName(null);
  setEmail(null);
  setAvatarUrl(null);
  setPgsCode(null);
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const allowMock =
    process.env.NEXT_PUBLIC_ENABLE_DEV_ROLE_SWITCHER === "true" ||
    (!configured && process.env.NODE_ENV !== "production");

  const [experience, setExperienceState] = useState<Experience>("anonymous");
  const [ready, setReady] = useState(!configured);
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [pgsCode, setPgsCode] = useState<string | null>(null);

  const refreshFromSession = useCallback(async (session?: Session | null) => {
    if (!configured) {
      setReady(true);
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const user =
        session?.user ??
        (
          await supabase.auth.getUser()
        ).data.user;

      if (!user) {
        clearIdentity(
          setUserId,
          setFullName,
          setEmail,
          setAvatarUrl,
          setPgsCode,
        );
        setExperienceState("anonymous");
        setReady(true);
        return;
      }

      setUserId(user.id);
      setEmail(user.email ?? null);

      const [{ data: profile }, { data: premium }] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name, avatar_path, pgs_code, updated_at")
          .eq("id", user.id)
          .maybeSingle(),
        supabase.rpc("student_has_active_premium", { uid: user.id }),
      ]);

      setFullName(profile?.full_name ?? null);
      setPgsCode(profile?.pgs_code ?? null);

      const resolved = publicObjectUrl(
        supabase,
        STORAGE_BUCKETS.avatars,
        profile?.avatar_path,
      );
      if (resolved) {
        const bust = profile?.updated_at
          ? `${resolved.includes("?") ? "&" : "?"}v=${encodeURIComponent(profile.updated_at)}`
          : "";
        setAvatarUrl(`${resolved}${bust}`);
      } else {
        setAvatarUrl(null);
      }

      setExperienceState(experienceFromFlags(true, Boolean(premium)));
    } catch {
      setExperienceState("anonymous");
      clearIdentity(
        setUserId,
        setFullName,
        setEmail,
        setAvatarUrl,
        setPgsCode,
      );
    } finally {
      setReady(true);
    }
  }, [configured]);

  useEffect(() => {
    void refreshFromSession();
    if (!configured) return;

    const supabase = createSupabaseBrowserClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer Supabase calls to avoid deadlocking signInWithPassword (auth-js #762).
      setTimeout(() => {
        void refreshFromSession(session);
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, [configured, refreshFromSession]);

  const setExperience = useCallback(
    (next: Experience) => {
      if (allowMock) setExperienceState(next);
    },
    [allowMock],
  );

  const loginAs = useCallback(
    (next: Exclude<Experience, "anonymous">) => {
      if (allowMock) setExperienceState(next);
    },
    [allowMock],
  );

  const logout = useCallback(() => {
    if (configured) {
      const supabase = createSupabaseBrowserClient();
      void supabase.auth.signOut().then(() => {
        setExperienceState("anonymous");
        clearIdentity(
          setUserId,
          setFullName,
          setEmail,
          setAvatarUrl,
          setPgsCode,
        );
      });
      return;
    }
    setExperienceState("anonymous");
    clearIdentity(setUserId, setFullName, setEmail, setAvatarUrl, setPgsCode);
  }, [configured]);

  const value = useMemo(
    () => ({
      experience,
      setExperience,
      isLoggedIn: experience !== "anonymous",
      isPremium: experience === "authenticated_premium",
      loginAs,
      logout,
      ready,
      userId,
      fullName,
      email,
      avatarUrl,
      pgsCode,
      refreshSession: refreshFromSession,
    }),
    [
      experience,
      setExperience,
      loginAs,
      logout,
      ready,
      userId,
      fullName,
      email,
      avatarUrl,
      pgsCode,
      refreshFromSession,
    ],
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) {
    throw new Error("useExperience must be used within ExperienceProvider");
  }
  return ctx;
}

export { DEFAULT_AVATAR };
