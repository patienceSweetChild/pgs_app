import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  resolveActorContext,
  staffHasPermission,
} from "@/lib/auth/actor-context";
import { PREVIEW_COOKIE } from "@/lib/operations/staff-preview-server";

export async function POST(request: NextRequest) {
  const actor = await resolveActorContext();
  if (!actor.staff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  let action = "";
  let mode: "student" | "mentor" = "student";
  let targetId = "";
  let targetName = "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as Record<string, string>;
    action = body.action ?? "";
    mode = (body.mode as "student" | "mentor") ?? "student";
    targetId = body.targetId ?? "";
    targetName = body.targetName ?? "";
  } else {
    const form = await request.formData();
    action = String(form.get("action") ?? "");
    mode = (String(form.get("mode") ?? "student") as "student" | "mentor") ?? "student";
    targetId = String(form.get("targetId") ?? "");
    targetName = String(form.get("targetName") ?? "");
  }

  const jar = await cookies();
  const redirectTo = request.nextUrl.searchParams.get("redirect") ?? "/ops";

  if (action === "clear") {
    jar.delete(PREVIEW_COOKIE);
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  if (
    !staffHasPermission(actor.staff, "student_workspace.read_all") &&
    actor.staff.roleKey !== "super_admin" &&
    actor.staff.roleKey !== "admin"
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!targetId) {
    return NextResponse.json({ error: "targetId required" }, { status: 400 });
  }

  jar.set(
    PREVIEW_COOKIE,
    encodeURIComponent(
      JSON.stringify({ mode, targetId, targetName: targetName || "Preview" }),
    ),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 4,
    },
  );

  if (mode === "student") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.redirect(new URL("/ops/students", request.url));
}
