"use client";

import { useState } from "react";
import type { AiAnswer } from "@/lib/ai/types";

const SUGGESTED = [
  "What needs my attention today?",
  "Which Premium students have no mentor?",
  "What is overdue in work targets?",
];

export function AskPgsPanel() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [pending, setPending] = useState(false);
  const [answer, setAnswer] = useState<AiAnswer | null>(null);
  const [error, setError] = useState("");

  async function ask(value: string) {
    setPending(true);
    setError("");
    const response = await fetch("/api/ai/ops", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: value }),
    });
    const payload = (await response.json()) as { answer?: AiAnswer; message?: string };
    setPending(false);
    if (!response.ok) {
      setError(payload.message ?? "Unable to answer.");
      return;
    }
    setAnswer(payload.answer ?? null);
  }

  if (!open) {
    return (
      <button type="button" className="pgs-ops__portal-link" onClick={() => setOpen(true)}>
        Ask PGS
      </button>
    );
  }

  return (
    <div className="pgs-ops__ask">
      <div className="pgs-ops__ask-head">
        <strong>Ask PGS</strong>
        <button type="button" className="pgs-ops__btn pgs-ops__btn--ghost" onClick={() => setOpen(false)}>
          Close
        </button>
      </div>
      <div className="pgs-ops__ask-prompts">
        {SUGGESTED.map((item) => (
          <button key={item} type="button" onClick={() => void ask(item)}>
            {item}
          </button>
        ))}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (question.trim()) void ask(question.trim());
        }}
      >
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask about students, premium, or work"
        />
        <button className="pgs-ops__btn" type="submit" disabled={pending}>
          {pending ? "Thinking…" : "Ask"}
        </button>
      </form>
      {error ? <p className="pgs-ops__alert">{error}</p> : null}
      {answer ? (
        <div className="pgs-ops__ask-answer">
          {answer.facts.length ? (
            <ul>
              {answer.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          ) : null}
          {answer.summary ? <p>{answer.summary}</p> : null}
          {answer.suggested_next_step ? <p className="pgs-ops__note">{answer.suggested_next_step}</p> : null}
          {answer.sources.map((source) => (
            <a key={source.href} href={source.href}>
              {source.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
