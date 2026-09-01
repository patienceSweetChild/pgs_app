import { NextResponse } from "next/server";
import { readJsonObject, validUuid } from "@/lib/http";
import { resolveActorContext } from "@/lib/auth/actor-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!validUuid(id)) return NextResponse.json({ message: "Invalid notification." }, { status: 400 });
  const actor = await resolveActorContext();
  if (!actor.userId) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const input = await readJsonObject(request);
  const supabase = await createSupabaseServerClient();
  const values: Record<string, unknown> = {};
  if (input.action === "archive") values.archived_at = new Date().toISOString();
  else values.read_at = new Date().toISOString();
  const { error } = await supabase
    .from("staff_notifications")
    .update(values)
    .eq("id", id)
    .eq("recipient_user_id", actor.userId);
  if (error) return NextResponse.json({ message: "Unable to update notification." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
