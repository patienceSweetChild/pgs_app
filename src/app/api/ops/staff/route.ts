import { NextResponse } from "next/server";
import { readJsonObject } from "@/lib/http";
import {
  resolveActorContext,
  staffHasPermission,
} from "@/lib/auth/actor-context";
import { requireStaffPermission } from "@/lib/auth/student-access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { assertStaffPreviewWritable } from "@/lib/operations/staff-preview-server";
import { applyStaffAccessChange } from "@/lib/operations/staff-access-server";
import {
  isStaffAssignableRole,
  isValidStaffEmail,
  normalizeStaffEmail,
  type StaffInviteIdentity,
  type StaffRoleKey,
} from "@/lib/operations/staff-access";
import { rpcMissing } from "@/lib/operations/role-matrix";

export const dynamic = "force-dynamic";

async function lookupIdentity(email: string): Promise<StaffInviteIdentity | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("lookup_staff_invite_identity", {
    target_email: email,
  });
  if (error && !rpcMissing(error)) throw new Error(error.message);
  if (error || !data) {
    const admin = createSupabaseAdminClient();
    const { data: users } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const user = users.users.find((item) => item.email?.toLowerCase() === email);
    if (!user) return null;
    const { data: staff } = await supabase
      .from("staff_profiles")
      .select("status, role_key")
      .eq("user_id", user.id)
      .maybeSingle();
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    return {
      user_id: user.id,
      has_student_profile: Boolean(profile),
      has_staff_profile: Boolean(staff),
      staff_status: (staff?.status as StaffInviteIdentity["staff_status"]) ?? null,
      staff_role: (staff?.role_key as StaffInviteIdentity["staff_role"]) ?? null,
      email_confirmed: Boolean(user.email_confirmed_at),
      has_signed_in: Boolean(user.last_sign_in_at),
      invite_pending: !user.last_sign_in_at,
    };
  }
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;
  return row as StaffInviteIdentity;
}

async function grantAccess(input: {
  userId: string;
  role: StaffRoleKey;
  displayName: string;
  reason?: string;
}) {
  await applyStaffAccessChange({
    userId: input.userId,
    role: input.role,
    displayName: input.displayName,
    active: true,
    status: "active",
    reason: input.reason ?? "Granted from operations",
  });
}

export async function POST(request: Request) {
  try {
    await requireStaffPermission("roles.manage");
    await assertStaffPreviewWritable();
    const actor = await resolveActorContext();
    if (!actor.staff || !staffHasPermission(actor.staff, "roles.manage")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const input = await readJsonObject(request);
    const action = String(input.action ?? "");
    const email = normalizeStaffEmail(String(input.email ?? ""));
    const displayName = String(input.display_name ?? "").trim().slice(0, 80);
    const role = String(input.role ?? "mentor");

    if (action === "resolve") {
      if (!isValidStaffEmail(email)) {
        return NextResponse.json({ message: "Enter a valid staff email." }, { status: 400 });
      }
      const identity = await lookupIdentity(email);
      return NextResponse.json({ ok: true, identity });
    }

    if (!isStaffAssignableRole(role)) {
      return NextResponse.json(
        { message: "Choose Admin, Mentor, or Viewer. Super Admin, Guardian, and Student cannot be assigned here." },
        { status: 400 },
      );
    }

    if (action === "invite") {
      if (!isValidStaffEmail(email) || !displayName) {
        return NextResponse.json({ message: "Name and email are required." }, { status: 400 });
      }
      const identity = await lookupIdentity(email);
      const admin = createSupabaseAdminClient();
      const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
      if (identity?.has_staff_profile && identity.staff_status === "active") {
        return NextResponse.json(
          { ok: false, user_id: identity.user_id, message: "This person already has staff access." },
          { status: 409 },
        );
      }
      let userId = identity?.user_id;
      if (!userId) {
        const invited = await admin.auth.admin.inviteUserByEmail(email, {
          redirectTo: `${origin}/auth/callback?redirect=/ops`,
          data: { pgs_context: "staff", invited_for: "pgs_staff" },
        });
        if (invited.error || !invited.data.user) {
          return NextResponse.json(
            { message: invited.error?.message ?? "Unable to send the invite." },
            { status: 400 },
          );
        }
        userId = invited.data.user.id;
      } else {
        await admin.auth.admin.inviteUserByEmail(email, {
          redirectTo: `${origin}/auth/callback?redirect=/ops`,
        }).catch(() => undefined);
      }
      await grantAccess({ userId, role, displayName, reason: "Invited from operations" });
      return NextResponse.json({ ok: true, user_id: userId });
    }

    if (action === "create") {
      if (!isValidStaffEmail(email) || !displayName) {
        return NextResponse.json({ message: "Name and email are required." }, { status: 400 });
      }
      const identity = await lookupIdentity(email);
      if (identity?.has_staff_profile && identity.staff_status === "active") {
        return NextResponse.json(
          { ok: false, user_id: identity.user_id, message: "This person already has staff access." },
          { status: 409 },
        );
      }
      const admin = createSupabaseAdminClient();
      const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
      let userId = identity?.user_id;
      if (!userId) {
        const created = await admin.auth.admin.createUser({
          email,
          email_confirm: false,
          user_metadata: { full_name: displayName, pgs_context: "staff" },
        });
        if (created.error || !created.data.user) {
          return NextResponse.json(
            { message: created.error?.message ?? "Unable to create the staff account." },
            { status: 400 },
          );
        }
        userId = created.data.user.id;
      }
      await grantAccess({ userId, role, displayName, reason: "Created from operations" });
      const link = await admin.auth.admin.generateLink({
        type: "invite",
        email,
        options: { redirectTo: `${origin}/auth/callback?redirect=/ops` },
      });
      return NextResponse.json({
        ok: true,
        user_id: userId,
        setup_link: link.data.properties?.action_link ?? null,
      });
    }

    if (action === "assign" || action === "revoke") {
      const userId = String(input.user_id ?? "");
      if (!userId) return NextResponse.json({ message: "Missing staff member." }, { status: 400 });
      await applyStaffAccessChange({
        userId,
        role,
        displayName,
        active: action === "assign",
        status: action === "assign" ? "active" : "ended",
        reason: String(input.reason ?? action),
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ message: "Unknown action." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to update staff access." },
      { status: 400 },
    );
  }
}
