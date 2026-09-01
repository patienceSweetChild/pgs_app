import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginPage } from "@/features/auth/LoginPage";
import { StaffLoginSurface } from "@/features/auth/staff-login/StaffLoginSurface";
import { resolveStaffLoginVariant } from "@/features/auth/staff-login/copy";

export const metadata: Metadata = {
  title: "Login",
};

function StaffLoginFallback() {
  return (
    <main className="pgs-staff-login">
      <section className="pgs-staff-login__panel">
        <p className="pgs-staff-login__subtitle">Loading…</p>
      </section>
    </main>
  );
}

export default function Page() {
  const staffVariant = resolveStaffLoginVariant(process.env.NEXT_PUBLIC_PGS_SURFACE);

  if (staffVariant) {
    return (
      <Suspense fallback={<StaffLoginFallback />}>
        <StaffLoginSurface variant={staffVariant} />
      </Suspense>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="wrapper-content mobile-login-pgs">
          <section className="login-box pt-10 text-center">
            <p className="text-black">Loading…</p>
          </section>
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  );
}
