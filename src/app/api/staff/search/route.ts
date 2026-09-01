import { NextResponse } from "next/server";
import { readJsonObject } from "@/lib/http";
import { resolveActorContext } from "@/lib/auth/actor-context";
import { searchOperations } from "@/lib/operations/search-server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const actor = await resolveActorContext();
  if (!actor.staff) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const query = new URL(request.url).searchParams.get("q") ?? "";
  const groups = await searchOperations(actor.staff, query);
  return NextResponse.json({ ok: true, query, groups });
}

export async function POST(request: Request) {
  const actor = await resolveActorContext();
  if (!actor.staff) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const input = await readJsonObject(request);
  const query = String(input.q ?? input.query ?? "");
  const groups = await searchOperations(actor.staff, query);
  return NextResponse.json({ ok: true, query, groups });
}
