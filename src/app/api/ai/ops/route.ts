import { NextResponse } from "next/server";
import { readJsonObject, validUuid } from "@/lib/http";
import { resolveActorContext, staffHasPermission } from "@/lib/auth/actor-context";
import { loadOperationsScoreboard } from "@/lib/operations/scoreboard-server";
import { searchOperations } from "@/lib/operations/search-server";
import {
  AIUnavailableError,
  AIRateLimitError,
  buildOpsAdminSystemPrompt,
  buildOpsMentorSystemPrompt,
  buildOpsUserPrompt,
  completeGroqJson,
  consumeAiRateLimit,
  isAIConfigured,
  parseAiAnswer,
} from "@/lib/ai/ops";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isAIConfigured()) {
    return NextResponse.json(
      { ok: false, unavailable: true, message: "AI Assistant is not configured." },
      { status: 503 },
    );
  }
  const actor = await resolveActorContext();
  if (!actor.staff || !staffHasPermission(actor.staff, "overview.read")) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  if (!staffHasPermission(actor.staff, "ai.analyze")) {
    return NextResponse.json({ message: "AI analysis is not enabled for your role." }, { status: 403 });
  }
  if (!actor.userId || !consumeAiRateLimit(actor.userId)) {
    return NextResponse.json({ message: "Too many AI requests. Wait a moment." }, { status: 429 });
  }

  try {
    const input = await readJsonObject(request);
    const question = String(input.question ?? "").trim().slice(0, 500);
    if (question.length < 2) {
      return NextResponse.json({ message: "Enter a question." }, { status: 400 });
    }
    const isMentorOnly =
      !staffHasPermission(actor.staff, "student_workspace.read_all") &&
      !staffHasPermission(actor.staff, "students.read");
    const scoreboard = await loadOperationsScoreboard();
    const search = await searchOperations(actor.staff, question).catch(() => []);
    const context = [
      `Scope: ${scoreboard.scope}`,
      ...scoreboard.metrics.map((metric) => `${metric.label}: ${metric.value} ${metric.href ?? ""}`),
      ...search.flatMap((group) =>
        group.results.map((item) => `${group.label}: ${item.label} ${item.href}`),
      ),
    ].join("\n");
    const studentId = typeof input.student_id === "string" && validUuid(input.student_id)
      ? input.student_id
      : null;
    const raw = await completeGroqJson(
      isMentorOnly ? buildOpsMentorSystemPrompt() : buildOpsAdminSystemPrompt(),
      buildOpsUserPrompt(
        question + (studentId ? `\nStudent context id: ${studentId}` : ""),
        context,
      ),
    );
    return NextResponse.json({ ok: true, answer: parseAiAnswer(raw) });
  } catch (error) {
    if (error instanceof AIRateLimitError) {
      return NextResponse.json({ message: error.message }, { status: 429 });
    }
    if (error instanceof AIUnavailableError) {
      return NextResponse.json({ message: error.message, unavailable: true }, { status: 503 });
    }
    return NextResponse.json({ message: "Unable to answer that question." }, { status: 400 });
  }
}
