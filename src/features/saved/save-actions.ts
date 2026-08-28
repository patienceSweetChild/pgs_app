"use server";

import { revalidatePath } from "next/cache";
import type { SavedCardData } from "@/components/cards/types";
import {
  hydrateCourseRowForSave,
  hydrateEventRowForSave,
  mapRowToSavedCard,
} from "@/lib/catalog/saved-catalog";
import { saveItemKey } from "@/lib/catalog/card-surfaces";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type SavedEntityType = "course" | "event";

async function requireUserId(): Promise<string> {
  if (!isSupabaseConfigured()) {
    throw new Error("Sign in required");
  }
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Sign in required");
  }
  return user.id;
}

export async function toggleSavedItem(
  entityType: SavedEntityType,
  entityId: string,
): Promise<{ saved: boolean }> {
  const userId = await requireUserId();
  const numericId = Number(entityId);
  if (!Number.isFinite(numericId)) {
    throw new Error("Invalid item");
  }

  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase
    .from("user_saved_items")
    .select("entity_id")
    .eq("user_id", userId)
    .eq("entity_type", entityType)
    .eq("entity_id", numericId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("user_saved_items")
      .delete()
      .eq("user_id", userId)
      .eq("entity_type", entityType)
      .eq("entity_id", numericId);
    if (error) throw new Error(error.message);
    revalidatePath("/saved");
    return { saved: false };
  }

  const { error } = await supabase.from("user_saved_items").insert({
    user_id: userId,
    entity_type: entityType,
    entity_id: numericId,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/saved");
  return { saved: true };
}

export async function listSavedItemKeysForCurrentUser(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("user_saved_items")
    .select("entity_type, entity_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) =>
    saveItemKey(row.entity_type as SavedEntityType, row.entity_id),
  );
}

export async function listUserSavedCards(): Promise<SavedCardData[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: savedRows, error } = await supabase
    .from("user_saved_items")
    .select("entity_type, entity_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !savedRows?.length) return [];

  const courseIds = savedRows
    .filter((r) => r.entity_type === "course")
    .map((r) => r.entity_id);
  const eventIds = savedRows
    .filter((r) => r.entity_type === "event")
    .map((r) => r.entity_id);

  const [coursesRes, eventsRes] = await Promise.all([
    courseIds.length
      ? supabase.from("courses").select("*").in("id", courseIds)
      : Promise.resolve({ data: [], error: null }),
    eventIds.length
      ? supabase.from("events").select("*").in("id", eventIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const courseMap = new Map(
    (coursesRes.data ?? []).map((row) => [String(row.id), row]),
  );
  const eventMap = new Map(
    (eventsRes.data ?? []).map((row) => [String(row.id), row]),
  );

  const cards: SavedCardData[] = [];

  for (const saved of savedRows) {
    if (saved.entity_type === "course") {
      const row = courseMap.get(String(saved.entity_id));
      if (!row) continue;
      const hydrated = await hydrateCourseRowForSave(supabase, row);
      const card = mapRowToSavedCard("course", hydrated, true);
      if (card) cards.push(card);
    } else {
      const row = eventMap.get(String(saved.entity_id));
      if (!row) continue;
      const hydrated = await hydrateEventRowForSave(supabase, row);
      const card = mapRowToSavedCard("event", hydrated, true);
      if (card) cards.push(card);
    }
  }

  return cards;
}

/** Card composite ids (course:123) for SSR heart state on listing pages. */
export async function listSavedCardIdsForCurrentUser(): Promise<string[]> {
  return listSavedItemKeysForCurrentUser();
}
