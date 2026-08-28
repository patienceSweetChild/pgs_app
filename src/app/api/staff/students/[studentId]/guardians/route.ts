import { NextResponse } from "next/server";
import { readJsonObject, validUuid } from "@/lib/http";
import {
  GUARDIAN_RELATIONSHIP_LABELS,
  type GuardianRelationshipLabel,
} from "@/lib/guardian-portal";
import { assertStaffPreviewWritable } from "@/lib/operations/staff-preview-server";
import { requireStaffPermission } from "@/lib/auth/student-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ studentId: string }> },
) {
  const { studentId } = await params;
  try {
    await requireStaffPermission("overview.read");
    if (!validUuid(studentId)) {
      return NextResponse.json({ message: "Invalid student." }, { status: 400 });
    }
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("student_guardian_relationships")
      .select("id, student_id, guardian_email, relationship_label, status, created_at")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ ok: true, guardians: data ?? [] });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to load guardians." },
      { status: 403 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ studentId: string }> },
) {
  const { studentId } = await params;
  try {
    await requireStaffPermission("guardians.manage");
    await assertStaffPreviewWritable();
    if (!validUuid(studentId)) {
      return NextResponse.json({ message: "Invalid student." }, { status: 400 });
    }

    const input = await readJsonObject(request);
    const intent = typeof input.intent === "string" ? input.intent : "";

    if (intent === "invite") {
      const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
      const label = typeof input.label === "string" ? input.label : "";
      if (!email || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
        return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
      }
      if (!(GUARDIAN_RELATIONSHIP_LABELS as readonly string[]).includes(label)) {
        return NextResponse.json({ message: "Choose a valid relationship label." }, { status: 400 });
      }

      const { inviteGuardianAction } = await import("@/features/operations/actions");
      await inviteGuardianAction(studentId, email, label as GuardianRelationshipLabel);
      return NextResponse.json({ ok: true });
    }

    if (intent === "revoke") {
      const relationshipId =
        typeof input.relationship_id === "string" ? input.relationship_id : "";
      if (!validUuid(relationshipId)) {
        return NextResponse.json({ message: "Invalid relationship." }, { status: 400 });
      }
      const { revokeGuardianAction } = await import("@/features/operations/actions");
      await revokeGuardianAction(relationshipId, studentId);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ message: "Unknown intent." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Guardian action failed." },
      { status: 403 },
    );
  }
}
