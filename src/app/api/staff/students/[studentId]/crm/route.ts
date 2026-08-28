import { NextResponse } from "next/server";
import { readJsonObject, validUuid } from "@/lib/http";
import {
  isCrmStage,
  isCrmStream,
  parseCrmTargetYear,
} from "@/lib/operations/student-crm";
import { assertStaffPreviewWritable } from "@/lib/operations/staff-preview-server";
import { requireStaffPermission } from "@/lib/auth/student-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function rpcError(message: string, code?: string): { status: number; message: string } {
  const normalized = message.toLowerCase();
  if (code === "42501" || normalized.includes("not authorized")) {
    return { status: 403, message: "You do not have permission for that CRM operation." };
  }
  if (normalized.includes("reserved tag")) {
    return { status: 400, message: "That tag is reserved for a derived CRM fact." };
  }
  if (normalized.includes("tag exists")) {
    return { status: 400, message: "That tag already exists." };
  }
  if (normalized.includes("invalid tag")) {
    return { status: 400, message: "Enter a valid tag name." };
  }
  if (code === "P0002" || normalized.includes("not found")) {
    return { status: 404, message: "That student or tag is no longer available." };
  }
  return { status: 400, message: "The CRM change could not be saved." };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ studentId: string }> },
) {
  const { studentId } = await params;
  try {
    await requireStaffPermission("overview.read");
    await assertStaffPreviewWritable();
    if (!validUuid(studentId)) {
      return NextResponse.json({ message: "Invalid student." }, { status: 400 });
    }

    const input = await readJsonObject(request);
    const supabase = await createSupabaseServerClient();
    const intent = typeof input.intent === "string" ? input.intent : "";

    let error: { message: string; code?: string } | null = null;
    if (intent === "facts") {
      const streamValue = typeof input.stream === "string" ? input.stream : "";
      const stageValue = typeof input.stage === "string" ? input.stage : "";
      if (streamValue && !isCrmStream(streamValue)) {
        return NextResponse.json({ message: "Choose a valid stream." }, { status: 400 });
      }
      if (stageValue && !isCrmStage(stageValue)) {
        return NextResponse.json({ message: "Choose a valid CRM stage." }, { status: 400 });
      }
      const result = await supabase.rpc("set_student_crm_facts", {
        target_student: studentId,
        next_stream: streamValue || null,
        next_target_year: parseCrmTargetYear(
          typeof input.target_year === "string" || typeof input.target_year === "number"
            ? input.target_year
            : null,
        ),
        next_stage: stageValue || null,
      });
      error = result.error;
    } else if (intent === "attach" || intent === "detach") {
      if (!validUuid(String(input.tag_id ?? ""))) {
        return NextResponse.json({ message: "Choose a valid tag." }, { status: 400 });
      }
      const result =
        intent === "attach"
          ? await supabase.rpc("attach_student_crm_tag", {
              target_student: studentId,
              target_tag: String(input.tag_id),
            })
          : await supabase.rpc("detach_student_crm_tag", {
              target_student: studentId,
              target_tag: String(input.tag_id),
            });
      error = result.error;
    } else if (intent === "create_tag") {
      const name = typeof input.name === "string" ? input.name.trim() : "";
      if (!name) {
        return NextResponse.json({ message: "Enter a tag name." }, { status: 400 });
      }
      const result = await supabase.rpc("create_student_crm_tag", { tag_name: name });
      error = result.error;
    } else {
      return NextResponse.json({ message: "Unsupported CRM operation." }, { status: 400 });
    }

    if (error) {
      const mapped = rpcError(error.message, error.code);
      return NextResponse.json({ message: mapped.message }, { status: mapped.status });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to save CRM details." },
      { status: error instanceof Error && error.message.includes("Forbidden") ? 403 : 500 },
    );
  }
}
