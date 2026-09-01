import "server-only";

import type { AiAnswer } from "@/lib/ai/types";

export type { AiAnswer };

export const AI_MODEL = process.env.PGS_AI_MODEL || "qwen/qwen3.8-27b";
export const AI_MAX_OUTPUT_TOKENS = 800;
export const AI_MAX_INPUT_TOKENS = 4000;

export class AIUnavailableError extends Error {
  constructor(message = "AI Assistant is temporarily unavailable.") {
    super(message);
    this.name = "AIUnavailableError";
  }
}

export class AIRateLimitError extends Error {
  constructor() {
    super("You have made too many AI requests. Please wait a moment and try again.");
    this.name = "AIRateLimitError";
  }
}

export function isAIConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}

export async function completeGroqJson(system: string, user: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new AIUnavailableError("AI provider is not configured.");
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: AI_MODEL,
      temperature: 0.2,
      max_tokens: AI_MAX_OUTPUT_TOKENS,
      reasoning_effort: "none",
      reasoning_format: "hidden",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (response.status === 429) throw new AIRateLimitError();
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new AIUnavailableError(
      detail.includes("model") ? "That AI model is not available on Groq." : "Groq request failed.",
    );
  }
  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return payload.choices?.[0]?.message?.content ?? "";
}

export function parseAiAnswer(raw: string): AiAnswer {
  try {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    const json = start >= 0 && end > start ? raw.slice(start, end + 1) : raw;
    const parsed = JSON.parse(json) as AiAnswer;
    return {
      facts: Array.isArray(parsed.facts)
        ? parsed.facts.filter((item) => typeof item === "string").slice(0, 12)
        : [],
      summary: typeof parsed.summary === "string" ? parsed.summary.slice(0, 1200) : "",
      suggested_next_step:
        typeof parsed.suggested_next_step === "string"
          ? parsed.suggested_next_step.slice(0, 400)
          : undefined,
      sources: Array.isArray(parsed.sources)
        ? parsed.sources
            .filter(
              (item) =>
                item &&
                typeof item.label === "string" &&
                typeof item.href === "string" &&
                item.href.startsWith("/"),
            )
            .slice(0, 6)
        : [],
    };
  } catch {
    return {
      facts: [],
      summary:
        "The AI Assistant was unable to produce a structured answer. Please try rephrasing your question.",
      sources: [],
    };
  }
}

export function buildOpsAdminSystemPrompt(): string {
  return `You are PGS Ops Assistant for authorized staff. ONLY answer from the provided data. Never invent students or metrics. Never disclose credentials. Respond with ONLY valid JSON: {"facts":[],"summary":"","suggested_next_step":"","sources":[{"label":"","href":"/ops/..."}]}`;
}

export function buildOpsMentorSystemPrompt(): string {
  return `You are PGS Ops Assistant for a Mentor. You can only see assigned students. ONLY answer from the provided data. Respond with ONLY valid JSON: {"facts":[],"summary":"","suggested_next_step":"","sources":[{"label":"","href":"/ops/..."}]}`;
}

export function buildOpsUserPrompt(question: string, dataContext: string): string {
  return `PGS DATA:\n${dataContext}\n\nUSER QUESTION:\n${question}`;
}

const buckets = new Map<string, { count: number; reset: number }>();

export function consumeAiRateLimit(userId: string, limit = 10): boolean {
  const now = Date.now();
  const current = buckets.get(userId);
  if (!current || current.reset < now) {
    buckets.set(userId, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}
