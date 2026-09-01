import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  DEFAULT_ROLE_PERMISSIONS,
  type RoleMatrixModule,
  ROLE_MATRIX_MODULES,
  type RoleMatrixRow,
  roleKind,
} from "@/lib/operations/role-matrix";
import {
  PRODUCT_ROLE_KEYS,
  type StaffPermission,
  isProductRoleKey,
} from "@/lib/auth/permissions";
import { roleLabel } from "@/lib/operations/staff-access";

export type { RoleMatrixRow };

export async function loadRoleMatrix(): Promise<RoleMatrixRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data: roles } = await supabase
    .from("staff_roles")
    .select("id, key, label")
    .in("key", PRODUCT_ROLE_KEYS);
  const { data: links } = await supabase
    .from("staff_role_permissions")
    .select("role_id, staff_permissions(key)");

  const permsByRoleId = new Map<string, StaffPermission[]>();
  for (const link of links ?? []) {
    const perm = link.staff_permissions as { key: string } | { key: string }[] | null;
    const key = Array.isArray(perm) ? perm[0]?.key : perm?.key;
    if (!key) continue;
    const list = permsByRoleId.get(link.role_id) ?? [];
    list.push(key as StaffPermission);
    permsByRoleId.set(link.role_id, list);
  }

  return PRODUCT_ROLE_KEYS.map((key) => {
    const row = (roles ?? []).find((role) => role.key === key);
    return {
      key,
      label: row?.label || roleLabel(key),
      kind: roleKind(key),
      system: true,
      permissions: row ? (permsByRoleId.get(row.id) ?? DEFAULT_ROLE_PERMISSIONS[key]) : DEFAULT_ROLE_PERMISSIONS[key],
    };
  });
}

export { ROLE_MATRIX_MODULES, isProductRoleKey };
export type { RoleMatrixModule };
