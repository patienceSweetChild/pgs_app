import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  isProductRoleKey,
  isStaffRoleKey,
  normalizeRoleKey,
  type StaffPermission,
  type StaffRoleKey,
} from "@/lib/auth/permissions";
import { DEFAULT_ROLE_PERMISSIONS } from "@/lib/operations/role-matrix";

export type StaffContext = {
  userId: string;
  roleKey: StaffRoleKey | string;
  displayName: string;
  permissions: string[];
};

export type ActorContext = {
  userId: string | null;
  email: string | null;
  isStaff: boolean;
  isPremium: boolean;
  isGuardian: boolean;
  staff: StaffContext | null;
  profile: {
    id: string;
    fullName: string;
  } | null;
};

function permissionsFromRoleRows(
  rows: Array<{
    staff_permissions: { key: string } | { key: string }[] | null;
  }> | null,
): string[] {
  return (rows ?? [])
    .map((row) => {
      const perm = row.staff_permissions;
      if (Array.isArray(perm)) return perm[0]?.key;
      return perm?.key;
    })
    .filter((k): k is string => Boolean(k));
}

function defaultPermissionsForRole(roleKey: string): string[] {
  const canonical = normalizeRoleKey(roleKey) || roleKey;
  if (!isProductRoleKey(canonical)) return [];
  return [...DEFAULT_ROLE_PERMISSIONS[canonical]];
}

async function loadStaffPermissions(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  roleKey: string,
  rawRoleKey: string,
): Promise<string[]> {
  async function queryForRole(key: string) {
    const { data: role } = await supabase
      .from("staff_roles")
      .select("staff_role_permissions(staff_permissions(key))")
      .eq("key", key)
      .maybeSingle();

    return permissionsFromRoleRows(
      (role?.staff_role_permissions ?? null) as Array<{
        staff_permissions: { key: string } | { key: string }[] | null;
      }> | null,
    );
  }

  let permissions = await queryForRole(roleKey);
  if (!permissions.length && rawRoleKey !== roleKey) {
    permissions = await queryForRole(rawRoleKey);
  }
  if (!permissions.length) {
    permissions = defaultPermissionsForRole(roleKey);
  }
  return permissions;
}

export const resolveActorContext = cache(async (): Promise<ActorContext> => {
  const empty: ActorContext = {
    userId: null,
    email: null,
    isStaff: false,
    isPremium: false,
    isGuardian: false,
    staff: null,
    profile: null,
  };

  if (!isSupabaseConfigured()) return empty;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return empty;

  const [{ data: profile }, { data: staffRow }, { data: premium }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("staff_profiles")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle(),
      supabase.rpc("student_has_active_premium", { uid: user.id }),
    ]);

  let permissions: string[] = [];
  const staffProfile = staffRow as
    | ({
        user_id: string;
        display_name: string;
        status: string;
        role_key?: string | null;
        role?: string | null;
      })
    | null;

  if (staffProfile) {
    const rawRole = staffProfile.role_key ?? staffProfile.role ?? "";
    const roleKey = normalizeRoleKey(rawRole) || rawRole;
    permissions = await loadStaffPermissions(supabase, roleKey, rawRole);
  }

  let isGuardian = false;
  if (!staffRow) {
    const { data: guardianRows } = await supabase.rpc("guardian_list_students");
    isGuardian = Array.isArray(guardianRows) && guardianRows.length > 0;
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    isStaff: Boolean(staffProfile),
    isPremium: Boolean(premium),
    isGuardian,
    staff: staffProfile
      ? {
          userId: staffProfile.user_id,
          roleKey: (() => {
            const raw = staffProfile.role_key ?? staffProfile.role ?? "";
            const normalized = normalizeRoleKey(raw) || raw;
            return isStaffRoleKey(normalized) ? normalized : raw;
          })(),
          displayName: staffProfile.display_name,
          permissions,
        }
      : null,
    profile: profile
      ? { id: profile.id, fullName: profile.full_name }
      : { id: user.id, fullName: "" },
  };
});

export function staffHasPermission(
  staff: StaffContext | null,
  key: string,
): boolean {
  if (!staff) return false;
  if (staff.permissions.includes(key)) return true;
  const role = normalizeRoleKey(staff.roleKey) || staff.roleKey;
  if (!isProductRoleKey(role)) return false;
  return DEFAULT_ROLE_PERMISSIONS[role].includes(key as StaffPermission);
}
