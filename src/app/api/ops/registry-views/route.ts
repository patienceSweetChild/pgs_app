import { NextResponse } from "next/server";
import { readJsonObject } from "@/lib/http";
import { resolveActorContext } from "@/lib/auth/actor-context";
import { REGISTRY_SAVED_VIEW_MAX } from "@/lib/operations/student-registry";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const actor = await resolveActorContext();
  if (!actor.staff) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const input = await readJsonObject(request);
  const supabase = await createSupabaseServerClient();
  if (input.action === "delete") {
    const { error } = await supabase
      .from("staff_registry_saved_views")
      .delete()
      .eq("id", String(input.id ?? ""))
      .eq("staff_user_id", actor.userId);
    if (error) return NextResponse.json({ message: "Unable to delete the view." }, { status: 400 });
    return NextResponse.json({ ok: true });
  }
  const name = String(input.name ?? "").trim().slice(0, 40);
  if (!name) return NextResponse.json({ message: "Enter a view name." }, { status: 400 });
  const { count } = await supabase
    .from("staff_registry_saved_views")
    .select("*", { count: "exact", head: true })
    .eq("staff_user_id", actor.userId);
  if ((count ?? 0) >= REGISTRY_SAVED_VIEW_MAX) {
    return NextResponse.json({ message: "You can save up to 20 views." }, { status: 400 });
  }
  const { error } = await supabase.from("staff_registry_saved_views").insert({
    staff_user_id: actor.userId,
    name,
    query: input.query ?? {},
  });
  if (error) return NextResponse.json({ message: "Unable to save this view." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
