"use client";

import { useRef, useState } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  rows?: number;
};

type Mode = "edit" | "html";

function wrapSelection(
  el: HTMLTextAreaElement,
  before: string,
  after: string,
  value: string,
  onChange: (next: string) => void,
) {
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const selected = value.slice(start, end) || "text";
  const next =
    value.slice(0, start) + before + selected + after + value.slice(end);
  onChange(next);
  requestAnimationFrame(() => {
    el.focus();
    el.setSelectionRange(
      start + before.length,
      start + before.length + selected.length,
    );
  });
}

function insertBlock(
  el: HTMLTextAreaElement,
  open: string,
  close: string,
  value: string,
  onChange: (next: string) => void,
) {
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const selected = value.slice(start, end) || "…";
  const needsNlBefore = start > 0 && value[start - 1] !== "\n" ? "\n" : "";
  const needsNlAfter = end < value.length && value[end] !== "\n" ? "\n" : "";
  const chunk = `${needsNlBefore}${open}${selected}${close}${needsNlAfter}`;
  const next = value.slice(0, start) + chunk + value.slice(end);
  onChange(next);
  requestAnimationFrame(() => {
    el.focus();
    const selStart = start + needsNlBefore.length + open.length;
    el.setSelectionRange(selStart, selStart + selected.length);
  });
}

function promptLink(
  el: HTMLTextAreaElement,
  value: string,
  onChange: (next: string) => void,
) {
  const url = window.prompt("Link URL", "https://");
  if (!url) return;
  wrapSelection(el, `<a href="${url}">`, "</a>", value, onChange);
}

type Tool = {
  id: string;
  label: string;
  run: (
    el: HTMLTextAreaElement,
    value: string,
    onChange: (next: string) => void,
  ) => void;
};

const TOOLS: Tool[] = [
  {
    id: "bold",
    label: "Bold",
    run: (el, v, c) => wrapSelection(el, "<strong>", "</strong>", v, c),
  },
  {
    id: "italic",
    label: "Italic",
    run: (el, v, c) => wrapSelection(el, "<em>", "</em>", v, c),
  },
  {
    id: "link",
    label: "Link",
    run: (el, v, c) => promptLink(el, v, c),
  },
  {
    id: "ul",
    label: "Ul",
    run: (el, v, c) =>
      insertBlock(el, "<ul>\n  <li>", "</li>\n</ul>", v, c),
  },
  {
    id: "ol",
    label: "Ol",
    run: (el, v, c) =>
      insertBlock(el, "<ol>\n  <li>", "</li>\n</ol>", v, c),
  },
  {
    id: "quote",
    label: "Quote",
    run: (el, v, c) =>
      insertBlock(el, "<blockquote>", "</blockquote>", v, c),
  },
];

export function AdminRichTextField({
  label,
  value,
  onChange,
  rows = 6,
}: Props) {
  const [mode, setMode] = useState<Mode>("edit");
  const ref = useRef<HTMLTextAreaElement>(null);

  function runTool(tool: Tool) {
    const el = ref.current;
    if (!el) return;
    tool.run(el, value, onChange);
  }

  return (
    <div className="pgs-admin-rich">
      <div className="pgs-admin-rich__head">
        {label ? <strong>{label}</strong> : <span />}
        <span className="pgs-admin-rich__hint">HTML allowed</span>
        <div className="pgs-admin-rich__modes" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "edit"}
            className={
              mode === "edit"
                ? "pgs-admin-rich__mode is-active"
                : "pgs-admin-rich__mode"
            }
            onClick={() => setMode("edit")}
          >
            Edit
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "html"}
            className={
              mode === "html"
                ? "pgs-admin-rich__mode is-active"
                : "pgs-admin-rich__mode"
            }
            onClick={() => setMode("html")}
          >
            HTML
          </button>
        </div>
      </div>
      {mode === "edit" ? (
        <div className="pgs-admin-rich__toolbar">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              className="pgs-admin-rich__tool"
              onClick={() => runTool(tool)}
            >
              {tool.label}
            </button>
          ))}
        </div>
      ) : null}
      <textarea
        ref={ref}
        className={
          mode === "html"
            ? "pgs-admin-rich__textarea pgs-admin-rich__textarea--source"
            : "pgs-admin-rich__textarea"
        }
        style={{ padding: "12px 16px" }}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={mode === "edit"}
      />
    </div>
  );
}
