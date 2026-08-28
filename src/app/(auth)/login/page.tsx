import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginPage } from "@/features/auth/LoginPage";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
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
