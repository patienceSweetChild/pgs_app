import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { resolveActorContext } from "@/lib/auth/actor-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import "@/features/admin/admin.css";

type PageProps = { params: Promise<{ studentId: string }> };

export default async function PortalStudentPage({ params }: PageProps) {
  if (!isSupabaseConfigured()) notFound();

  const { studentId } = await params;
  const actor = await resolveActorContext();
  if (!actor.userId) {
    redirect(`/login?surface=guardian&redirect=/portal/students/${studentId}`);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("guardian_student_summary", {
    p_student_id: studentId,
  });

  if (error) {
    return (
      <div className="pgs-portal">
        <div className="pgs-portal__content">
          <p role="alert">{error.message}</p>
          <Link href="/portal">Back</Link>
        </div>
      </div>
    );
  }

  const summary = data as {
    student?: {
      full_name?: string;
      crm_stream?: string;
      crm_stage?: string;
      preferred_study_country?: string;
    };
    premium?: boolean;
    workspace?: Record<string, unknown>;
  };

  const student = summary.student ?? {};
  const workspace = summary.workspace ?? {};

  return (
    <div className="pgs-portal">
      <div className="pgs-portal__bar">
        <strong>Guardian portal</strong>
        <Link href="/portal" style={{ color: "#fff" }}>
          All students
        </Link>
      </div>
      <div className="pgs-portal__content">
        <h1>{student.full_name || "Student"}</h1>
        <div className="pgs-portal__card">
          <p>
            <strong>Stream:</strong> {student.crm_stream || "—"}
          </p>
          <p>
            <strong>Stage:</strong> {student.crm_stage || "—"}
          </p>
          <p>
            <strong>Preferred country:</strong>{" "}
            {student.preferred_study_country || "—"}
          </p>
          <p>
            <strong>Premium:</strong> {summary.premium ? "Active" : "No"}
          </p>
        </div>
        <div className="pgs-portal__card">
          <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Progress</h2>
          <p>
            Universities applied:{" "}
            {String(workspace.universities_applied ?? 0)}
          </p>
          <p>Offers: {String(workspace.offers_received ?? 0)}</p>
          <p>Visa: {String(workspace.visa_status || "—")}</p>
          <p>
            Onboarding: {String(workspace.onboarding_percentage ?? "—")}%
          </p>
        </div>
      </div>
    </div>
  );
}
