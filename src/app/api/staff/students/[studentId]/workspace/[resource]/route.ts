import { NextResponse } from "next/server";
import { CLEAN_DOCUMENT_SCAN_STATUS } from "@/lib/document-access";
import { readJsonObject, validUuid } from "@/lib/http";
import {
  cleanWorkspaceText,
  requirePremiumActor,
  WorkspaceAccessError,
} from "@/lib/premium-workspace";
import {
  assertStudentAlertText,
  studentOperationsMutationError,
} from "@/lib/student-operations";
import { assertStaffPreviewWritable } from "@/lib/operations/staff-preview-server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Context = { params: Promise<{ studentId: string; resource: string }> };

const tables: Record<string, string> = {
  tasks: "student_tasks",
  alerts: "student_alerts",
  requirements: "student_document_requirements",
  documents: "student_documents",
};

function recordId(value: unknown): string {
  if (typeof value !== "string" || !validUuid(value)) {
    throw new Error("Invalid record.");
  }
  return value;
}

function order(value: unknown): number {
  if (value === undefined) return 0;
  if (!Number.isSafeInteger(value) || Number(value) < 0 || Number(value) > 1_000_000) {
    throw new Error("Invalid sort order.");
  }
  return Number(value);
}

function optionalDate(value: unknown): string | null {
  if (value == null || value === "") return null;
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    throw new Error("Invalid date.");
  }
  return new Date(value).toISOString();
}

function writeError(
  error: { message?: string; details?: string } | null,
  fallback: string,
  status = 400,
) {
  const mapped = studentOperationsMutationError(error);
  if (mapped) return NextResponse.json({ message: mapped.message }, { status: mapped.status });
  return NextResponse.json({ message: fallback }, { status });
}

async function context(params: Context["params"]) {
  const { studentId, resource } = await params;
  if (!tables[resource]) {
    throw new WorkspaceAccessError(403, "Unsupported workspace operation.");
  }
  await assertStaffPreviewWritable();
  const actor = await requirePremiumActor(studentId, "manage");
  if (actor.kind === "student") {
    throw new WorkspaceAccessError(403, "Staff access is required.");
  }
  return { actor, resource, table: tables[resource] };
}

export async function POST(request: Request, route: Context) {
  try {
    const { actor, resource, table } = await context(route.params);
    const input = await readJsonObject(request);
    const common = { student_id: actor.studentId };
    let values: Record<string, unknown>;

    if (resource === "tasks") {
      values = {
        ...common,
        column_id: recordId(input.column_id),
        title: cleanWorkspaceText(input.title, 255),
        details:
          typeof input.details === "string" ? input.details.trim().slice(0, 6000) : "",
        sort_order: order(input.sort_order),
        due_at: optionalDate(input.due_at),
        assigned_to:
          typeof input.assigned_to === "string" ? recordId(input.assigned_to) : null,
        created_by: actor.userId,
        updated_by: actor.userId,
      };
    } else if (resource === "alerts") {
      values = {
        ...common,
        alert_text: assertStudentAlertText(input.alert_text),
        severity: ["info", "important", "urgent"].includes(String(input.severity))
          ? input.severity
          : "important",
        sort_order: order(input.sort_order),
        created_by: actor.userId,
        updated_by: actor.userId,
      };
    } else if (resource === "requirements") {
      values = {
        ...common,
        document_type: cleanWorkspaceText(input.document_type, 160),
        requirement_kind: ["required", "additional", "requested"].includes(
          String(input.requirement_kind),
        )
          ? input.requirement_kind
          : "additional",
        instructions:
          typeof input.instructions === "string"
            ? input.instructions.trim().slice(0, 2000)
            : "",
        sort_order: order(input.sort_order),
        requested_by: actor.userId,
      };
    } else {
      return NextResponse.json({ message: "Unsupported create operation." }, { status: 405 });
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from(table).insert(values).select("id").single();
    if (error) return writeError(error, "Unable to create the workspace item.");
    return NextResponse.json({ ok: true, id: data.id });
  } catch (error) {
    if (error instanceof WorkspaceAccessError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    const mapped = studentOperationsMutationError(error instanceof Error ? error : null);
    if (mapped) return NextResponse.json({ message: mapped.message }, { status: mapped.status });
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Invalid workspace item." },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request, route: Context) {
  try {
    const { actor, resource, table } = await context(route.params);
    const input = await readJsonObject(request);
    const idValue = recordId(input.id);
    const values: Record<string, unknown> = {};

    if (resource === "tasks") {
      if (typeof input.title === "string") values.title = cleanWorkspaceText(input.title, 255);
      if (typeof input.details === "string") {
        values.details = input.details.trim().slice(0, 6000);
      }
      if (input.column_id) values.column_id = recordId(input.column_id);
      if (input.sort_order !== undefined) values.sort_order = order(input.sort_order);
      if (input.due_at !== undefined) values.due_at = optionalDate(input.due_at);
      if (input.assigned_to !== undefined) {
        values.assigned_to = input.assigned_to ? recordId(input.assigned_to) : null;
      }
      values.updated_by = actor.userId;
    } else if (resource === "alerts") {
      if (typeof input.alert_text === "string") {
        values.alert_text = assertStudentAlertText(input.alert_text);
      }
      if (typeof input.active === "boolean") values.active = input.active;
      if (["info", "important", "urgent"].includes(String(input.severity))) {
        values.severity = input.severity;
      }
      if (input.sort_order !== undefined) values.sort_order = order(input.sort_order);
      values.updated_by = actor.userId;
    } else if (resource === "requirements") {
      if (typeof input.instructions === "string") {
        values.instructions = input.instructions.trim().slice(0, 2000);
      }
      if (
        ["missing", "uploaded", "in_review", "approved", "rejected", "in_draft", "waived"].includes(
          String(input.status),
        )
      ) {
        values.status = input.status;
      }
    } else if (resource === "documents") {
      if (
        !["pending", "in_review", "in_draft", "approved", "rejected"].includes(
          String(input.qc_status),
        )
      ) {
        return NextResponse.json({ message: "Invalid document status." }, { status: 400 });
      }
      values.qc_status = input.qc_status;
      values.review_note =
        typeof input.review_note === "string" ? input.review_note.trim().slice(0, 2000) : null;
      values.reviewed_by = actor.userId;
      values.reviewed_at = new Date().toISOString();
    }

    if (!Object.keys(values).length) {
      return NextResponse.json({ message: "No supported changes supplied." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    let updateQuery = supabase
      .from(table)
      .update(values)
      .eq("id", idValue)
      .eq("student_id", actor.studentId);
    if (resource === "documents") {
      updateQuery = updateQuery
        .eq("scan_status", CLEAN_DOCUMENT_SCAN_STATUS)
        .is("superseded_at", null)
        .is("archived_at", null)
        .is("purged_at", null);
    }
    const { data, error } = await updateQuery.select("id").maybeSingle();
    if (error) return writeError(error, "Unable to update the workspace item.");
    if (!data) return NextResponse.json({ message: "Workspace item not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof WorkspaceAccessError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    const mapped = studentOperationsMutationError(error instanceof Error ? error : null);
    if (mapped) return NextResponse.json({ message: mapped.message }, { status: mapped.status });
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Invalid workspace update." },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request, route: Context) {
  try {
    const { actor, resource, table } = await context(route.params);
    if (resource === "documents") {
      return NextResponse.json(
        { message: "Document deletion is not available from operations yet." },
        { status: 405 },
      );
    }
    const input = await readJsonObject(request);
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq("id", recordId(input.id))
      .eq("student_id", actor.studentId)
      .select("id")
      .maybeSingle();
    if (error) return writeError(error, "Unable to delete the workspace item.");
    if (!data) return NextResponse.json({ message: "Workspace item not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof WorkspaceAccessError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Invalid workspace deletion." },
      { status: 400 },
    );
  }
}
