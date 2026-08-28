"use client";

import type { Session, User } from "@supabase/supabase-js";
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
  refreshSession: (session?: Session | null) => Promise<void>;
};

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

const DEFAULT_AVATAR = "/assets/img/student-avatar.png";
const PROFILE_FETCH_TIMEOUT_MS = 8_000;

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

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("Profile fetch timed out")), ms);
    }),
  ]);
}

async function loadProfileAndPremium(user: User) {
  const supabase = createSupabaseBrowserClient();
  const [{ data: profile }, { data: premium }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, avatar_path, pgs_code, updated_at")
      .eq("id", user.id)
      .maybeSingle(),
    supabase.rpc("student_has_active_premium", { uid: user.id }),
  ]);

  return { profile, premium: Boolean(premium) };
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

  const applyProfile = useCallback(
    (user: User, profile: Awaited<ReturnType<typeof loadProfileAndPremium>>["profile"], premium: boolean) => {
      setFullName(profile?.full_name ?? null);
      setPgsCode(profile?.pgs_code ?? null);

      const supabase = createSupabaseBrowserClient();
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

      setExperienceState(experienceFromFlags(true, premium));
    },
    [],
  );

  const refreshFromSession = useCallback(
    async (session?: Session | null) => {
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

        // Fast path: mark logged in immediately so login redirect is not blocked.
        setUserId(user.id);
        setEmail(user.email ?? null);
        setExperienceState("authenticated_standard");
        setReady(true);

        // Slow path: profile + premium in background (never blocks login redirect).
        try {
          const { profile, premium } = await withTimeout(
            loadProfileAndPremium(user),
            PROFILE_FETCH_TIMEOUT_MS,
          );
          applyProfile(user, profile, premium);
        } catch {
          // Keep authenticated_standard when profile/RPC is slow or unavailable.
        }
      } catch {
        setExperienceState("anonymous");
        clearIdentity(
          setUserId,
          setFullName,
          setEmail,
          setAvatarUrl,
          setPgsCode,
        );
        setReady(true);
      }
    },
    [applyProfile, configured],
  );

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
