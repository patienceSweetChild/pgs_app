import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashEditor } from "@/features/dash-cms/DashEditor";
import { loadDashboardEditor } from "@/features/dash-cms/dash-actions";
import { StudentAccessError } from "@/lib/auth/student-access";

export const metadata: Metadata = {
  title: "Edit student dashboard",
};

export default async function DashStudentPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  let payload;
  try {
    payload = await loadDashboardEditor(studentId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (
      error instanceof StudentAccessError ||
      message === "Forbidden" ||
      message === "Staff access is required." ||
      message === "Student not found."
    ) {
      notFound();
    }
    throw error;
  }

  return (
    <div className="pgs-admin__main">
      <div className="pgs-admin__content pgs-admin__content--flush">
        <DashEditor initial={payload} />
      </div>
    </div>
  );
}
