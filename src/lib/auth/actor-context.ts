import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  isStaffRoleKey,
  normalizeRoleKey,
  type StaffRoleKey,
} from "@/lib/auth/permissions";

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
        .select("user_id, role_key, display_name, status")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle(),
      supabase.rpc("student_has_active_premium", { uid: user.id }),
    ]);

  let permissions: string[] = [];
  if (staffRow) {
    const roleKey = normalizeRoleKey(staffRow.role_key) || staffRow.role_key;
    const { data: links } = await supabase
      .from("staff_role_permissions")
      .select("staff_permissions(key), staff_roles!inner(key)")
      .eq("staff_roles.key", roleKey);

    permissions = (links ?? [])
      .map((row) => {
        const perm = row.staff_permissions as
          | { key: string }
          | { key: string }[]
          | null;
        if (Array.isArray(perm)) return perm[0]?.key;
        return perm?.key;
      })
      .filter((k): k is string => Boolean(k));

    if (!permissions.length && roleKey !== staffRow.role_key) {
      const { data: legacyLinks } = await supabase
        .from("staff_role_permissions")
        .select("staff_permissions(key), staff_roles!inner(key)")
        .eq("staff_roles.key", staffRow.role_key);
      permissions = (legacyLinks ?? [])
        .map((row) => {
          const perm = row.staff_permissions as
            | { key: string }
            | { key: string }[]
            | null;
          if (Array.isArray(perm)) return perm[0]?.key;
          return perm?.key;
        })
        .filter((k): k is string => Boolean(k));
    }
  }

  let isGuardian = false;
  if (!staffRow) {
    const { data: guardianRows } = await supabase.rpc("guardian_list_students");
    isGuardian = Array.isArray(guardianRows) && guardianRows.length > 0;
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    isStaff: Boolean(staffRow),
    isPremium: Boolean(premium),
    isGuardian,
    staff: staffRow
      ? {
          userId: staffRow.user_id,
          roleKey: isStaffRoleKey(normalizeRoleKey(staffRow.role_key))
            ? normalizeRoleKey(staffRow.role_key)
            : staffRow.role_key,
          displayName: staffRow.display_name,
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
  return Boolean(staff?.permissions.includes(key));
}
