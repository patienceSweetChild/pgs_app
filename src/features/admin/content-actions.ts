"use server";

import { revalidatePath } from "next/cache";
import { resolveActorContext, staffHasPermission } from "@/lib/auth/actor-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CONTENT_ENTITIES, type ContentField } from "./content-registry";

async function requireContentStaff(permission = "content.manage") {
  const actor = await resolveActorContext();
  const ok =
    actor.staff &&
    (staffHasPermission(actor.staff, permission) ||
      staffHasPermission(actor.staff, "catalog.manage") ||
      staffHasPermission(actor.staff, "cms.publish"));
  if (!ok) throw new Error("Forbidden");
  return actor;
}

const FK_NUMBER_KEYS = new Set([
  "country_id",
  "course_id",
  "category_id",
  "university_id",
  "display_order",
]);

function pickContentWritable(
  fields: ContentField[],
  defaultValues: Record<string, unknown> | undefined,
  payload: Record<string, unknown>,
) {
  const allowed = new Set(fields.map((f) => f.key));
  for (const key of Object.keys(defaultValues ?? {})) {
    if (!(key in payload) || payload[key] === undefined) continue;
    allowed.add(key);
  }
  const fieldByKey = new Map(fields.map((f) => [f.key, f]));
  const next: Record<string, unknown> = {};

  for (const key of allowed) {
    if (key === "id") continue;
    if (!(key in payload) && !(defaultValues && key in defaultValues)) continue;
    let value = key in payload ? payload[key] : defaultValues?.[key];
    const field = fieldByKey.get(key);
    const nullable = Boolean(field?.nullable);

    if (
      nullable &&
      (value === "" ||
        value === undefined ||
        ((key === "country_id" ||
          key === "course_id" ||
          key === "university_id" ||
          key === "category_id") &&
          (value === 0 || value === "0")))
    ) {
      value = null;
    } else if (field?.type === "number" || FK_NUMBER_KEYS.has(key)) {
      if (value === "" || value === null || value === undefined) {
        value = nullable ? null : 0;
      } else {
        value = Number(value);
      }
    } else if (nullable && value === "") {
      value = null;
    }

    if (value !== undefined) next[key] = value;
  }

  if (defaultValues) {
    for (const [k, v] of Object.entries(defaultValues)) {
      if (!(k in next) && (k === "person_type" || k === "notice_type")) {
        next[k] = v;
      }
    }
  }

  return next;
}

export async function listContentFkOptions(
  source: "countries" | "universities" | "courses",
): Promise<{ value: string; label: string }[]> {
  await requireContentStaff();
  const supabase = await createSupabaseServerClient();
  if (source === "countries") {
    const { data, error } = await supabase
      .from("countries")
      .select("id, name")
      .order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({ value: String(r.id), label: r.name }));
  }
  if (source === "universities") {
    const { data, error } = await supabase
      .from("universities")
      .select("id, name")
      .order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({ value: String(r.id), label: r.name }));
  }
  const { data, error } = await supabase
    .from("courses")
    .select("id, title")
    .order("title", { ascending: true })
    .limit(500);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({ value: String(r.id), label: r.title }));
}

export async function listContentRows(entityKey: string) {
  const config = CONTENT_ENTITIES[entityKey];
  if (!config) throw new Error("Unknown entity");
  await requireContentStaff(config.permission);

  const supabase = await createSupabaseServerClient();
  let query = supabase.from(config.table).select("*");

  if (config.filters) {
    for (const [k, v] of Object.entries(config.filters)) {
      query = query.eq(k, v);
    }
  }

  const order = config.orderBy ?? { column: "id", ascending: false };
  query = query.order(order.column, { ascending: order.ascending ?? false });

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function upsertContentRow(
  entityKey: string,
  payload: Record<string, unknown>,
) {
  const config = CONTENT_ENTITIES[entityKey];
  if (!config) throw new Error("Unknown entity");
  await requireContentStaff(config.permission);

  const supabase = await createSupabaseServerClient();
  const idKey = config.idKey ?? "id";
  const id = payload[idKey];
  const rest = pickContentWritable(
    config.fields,
    config.defaultValues,
    payload,
  );

  if (id !== undefined && id !== null && id !== "") {
    const { error } = await supabase
      .from(config.table)
      .update(rest)
      .eq(idKey, id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from(config.table).insert(rest);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/studentresources");
  revalidatePath("/purpleboard");
  revalidatePath("/privacy");
  revalidatePath("/terms");
  revalidatePath("/refund");
  revalidatePath("/scholarship");
  revalidatePath("/purpleevents");
  revalidatePath("/purplepremiumhome");
  revalidatePath("/explorecountries");
}

export async function deleteContentRow(entityKey: string, id: string | number) {
  const config = CONTENT_ENTITIES[entityKey];
  if (!config) throw new Error("Unknown entity");
  await requireContentStaff(config.permission);

  const supabase = await createSupabaseServerClient();
  const idKey = config.idKey ?? "id";
  const { error } = await supabase.from(config.table).delete().eq(idKey, id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/studentresources");
  revalidatePath("/purpleboard");
  revalidatePath("/privacy");
  revalidatePath("/terms");
  revalidatePath("/refund");
  revalidatePath("/scholarship");
  revalidatePath("/purpleevents");
  revalidatePath("/purplepremiumhome");
}

export async function listReadOnlyRows(
  table: string,
  orderColumn = "created_at",
) {
  await requireContentStaff("leads.manage");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order(orderColumn, { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getLegalDocument(documentType: string) {
  await requireContentStaff();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("legal_documents")
    .select("*")
    .eq("document_type", documentType)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function saveLegalDocument(
  documentType: string,
  title: string,
  body: string,
  status: "draft" | "published" | "unpublished",
) {
  const actor = await requireContentStaff();
  const supabase = await createSupabaseServerClient();
  const existing = await getLegalDocument(documentType);

  if (existing) {
    const { error } = await supabase
      .from("legal_documents")
      .update({
        title,
        body,
        status,
        updated_by: actor.userId,
        published_at: status === "published" ? new Date().toISOString() : null,
        version: Number(existing.version ?? 1) + 1,
      })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("legal_documents").insert({
      document_type: documentType,
      title,
      body,
      status,
      updated_by: actor.userId,
      published_at: status === "published" ? new Date().toISOString() : null,
    });
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin");
  revalidatePath("/privacy");
  revalidatePath("/terms");
  revalidatePath("/refund");
}

export async function getPremiumContentSetting(key: "video" | "meetup") {
  await requireContentStaff();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("premium_content_settings")
    .select("*")
    .eq("key", key)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function savePremiumContentSetting(
  key: "video" | "meetup",
  title: string,
  body: string,
  linkUrl: string,
  published: boolean,
  mediaAssetId?: string | null,
) {
  const actor = await requireContentStaff();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("premium_content_settings").upsert({
    key,
    title,
    body,
    link_url: linkUrl || null,
    media_asset_id: mediaAssetId || null,
    published,
    updated_by: actor.userId,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/purplepremiumhome");
  revalidatePath("/", "layout");
}

export async function listAuditLogs() {
  const actor = await resolveActorContext();
  if (!actor.staff || !staffHasPermission(actor.staff, "audit.read")) {
    throw new Error("Forbidden");
  }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("admin_audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listPremiumWorkspaces() {
  const actor = await resolveActorContext();
  if (
    !actor.staff ||
    !(
      staffHasPermission(actor.staff, "students.manage") ||
      staffHasPermission(actor.staff, "premium.manage") ||
      staffHasPermission(actor.staff, "student_workspace.read")
    )
  ) {
    throw new Error("Forbidden");
  }
  const supabase = await createSupabaseServerClient();

  if (
    actor.staff.roleKey === "mentor" &&
    !staffHasPermission(actor.staff, "students.manage") &&
    !staffHasPermission(actor.staff, "student_workspace.read_all")
  ) {
    const { data: assignments } = await supabase
      .from("mentor_assignments")
      .select("student_id")
      .eq("mentor_id", actor.userId!)
      .eq("status", "active");
    const studentIds = (assignments ?? []).map((a) => a.student_id);
    if (studentIds.length === 0) return [];
    const { data, error } = await supabase
      .from("premium_workspace_profiles")
      .select("*, profiles(full_name)")
      .in("student_id", studentIds)
      .order("updated_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  const { data, error } = await supabase
    .from("premium_workspace_profiles")
    .select("*, profiles(full_name)")
    .order("updated_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateStaffProfile(displayName: string) {
  const actor = await resolveActorContext();
  if (!actor.userId || !actor.staff) throw new Error("Forbidden");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("staff_profiles")
    .update({ display_name: displayName })
    .eq("user_id", actor.userId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/profile");
}
