import { NextResponse } from "next/server";
import { readJsonObject } from "@/lib/http";
import { resolveActorContext } from "@/lib/auth/actor-context";
import { assertStaffPreviewWritable } from "@/lib/operations/staff-preview-server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DEFAULT_ROLE_PERMISSIONS } from "@/lib/operations/role-matrix";
import {
  PRODUCT_ROLE_KEYS,
  STAFF_PERMISSIONS,
  isProductRoleKey,
  type StaffPermission,
} from "@/lib/auth/permissions";
import { loadRoleMatrix } from "@/lib/operations/role-matrix-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const actor = await resolveActorContext();
  if (!actor.staff || actor.staff.roleKey !== "super_admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  const roles = await loadRoleMatrix();
  return NextResponse.json({ ok: true, roles });
}

export async function POST(request: Request) {
  try {
    await assertStaffPreviewWritable();
    const actor = await resolveActorContext();
    if (!actor.staff || actor.staff.roleKey !== "super_admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const input = await readJsonObject(request);
    const roleKey = String(input.role ?? "");
    if (!isProductRoleKey(roleKey) || roleKey === "super_admin") {
      return NextResponse.json(
        { message: "Super Admin permissions cannot be changed." },
        { status: 400 },
      );
    }
    const requested = Array.isArray(input.permissions)
      ? input.permissions.filter(
          (key): key is StaffPermission =>
            typeof key === "string" && (STAFF_PERMISSIONS as readonly string[]).includes(key),
        )
      : [];
    const actorPerms = new Set(actor.staff.permissions);
    const granted = requested.filter((key) => actorPerms.has(key));

    const supabase = await createSupabaseServerClient();
    let { data: role } = await supabase
      .from("staff_roles")
      .select("id")
      .eq("key", roleKey)
      .maybeSingle();
    if (!role) {
      const inserted = await supabase
        .from("staff_roles")
        .insert({
          key: roleKey,
          label: roleKey.replaceAll("_", " "),
          description: "",
        })
        .select("id")
        .single();
      if (inserted.error || !inserted.data) {
        return NextResponse.json(
          { message: inserted.error?.message ?? "Unable to save this role." },
          { status: 400 },
        );
      }
      role = inserted.data;
    }
    const { data: permissionRows } = await supabase
      .from("staff_permissions")
      .select("id, key")
      .in("key", granted.length ? granted : ["overview.read"]);
    await supabase.from("staff_role_permissions").delete().eq("role_id", role.id);
    if (granted.length && permissionRows?.length) {
      await supabase.from("staff_role_permissions").insert(
        permissionRows
          .filter((row) => granted.includes(row.key as StaffPermission))
          .map((row) => ({ role_id: role!.id, permission_id: row.id })),
      );
    }
    await supabase.rpc("write_ops_audit_event", {
      p_event_type: "staff.role_permissions.updated",
      p_actor_user_id: actor.userId,
      p_target_type: "staff_role",
      p_target_id: roleKey,
      p_outcome: "succeeded",
      p_metadata: { permissions: granted },
    });
    const roles = await loadRoleMatrix();
    return NextResponse.json({ ok: true, roles });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to save permissions." },
      { status: 400 },
    );
  }
}

export { PRODUCT_ROLE_KEYS, DEFAULT_ROLE_PERMISSIONS };
