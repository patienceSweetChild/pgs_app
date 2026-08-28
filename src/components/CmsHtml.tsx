const HTML_TAG_RE = /<[a-z][\s\S]*>/i;

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "a",
  "ul",
  "ol",
  "li",
  "img",
  "h1",
  "h2",
  "h3",
  "h4",
  "span",
  "div",
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  img: new Set(["src", "alt", "title", "width", "height"]),
  "*": new Set(["class"]),
};

/** True when the string looks like markup rather than plain text. */
export function looksLikeHtml(value: string | null | undefined): boolean {
  if (!value) return false;
  return HTML_TAG_RE.test(value);
}

/**
 * Split newline-separated CMS fields into lines — unless the value is HTML,
 * in which case return a single-item array so callers render one block.
 */
export function splitCmsLines(value: string | null | undefined): string[] {
  if (!value) return [];
  if (looksLikeHtml(value)) return [value];
  return value.split("\n").filter(Boolean);
}

function isSafeUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  ) {
    return false;
  }
  return true;
}

/** Lightweight allowlist sanitizer for staff-authored CMS HTML. */
export function sanitizeCmsHtml(dirty: string): string {
  if (typeof window === "undefined") {
    // Server: strip dangerous tags/attrs with regex fallbacks (no DOM).
    return dirty
      .replace(/<\/?(script|iframe|object|embed|link|meta|style|form)[^>]*>/gi, "")
      .replace(/\son[a-z]+\s*=\s*(["']).*?\1/gi, "")
      .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "")
      .replace(
        /(href|src)\s*=\s*(["'])\s*(javascript|data|vbscript):[^"']*\2/gi,
        '$1=""',
      );
  }

  const doc = new DOMParser().parseFromString(
    `<div id="cms-html-root">${dirty}</div>`,
    "text/html",
  );
  const root = doc.getElementById("cms-html-root");
  if (!root) return "";

  const walk = (node: Node) => {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as Element;
        const tag = el.tagName.toLowerCase();
        if (!ALLOWED_TAGS.has(tag)) {
          // Keep text content of disallowed tags, drop the element wrapper.
          while (el.firstChild) {
            node.insertBefore(el.firstChild, el);
          }
          node.removeChild(el);
          continue;
        }

        const allowed = new Set([
          ...(ALLOWED_ATTRS["*"] ?? []),
          ...(ALLOWED_ATTRS[tag] ?? []),
        ]);
        for (const attr of Array.from(el.attributes)) {
          const name = attr.name.toLowerCase();
          if (name.startsWith("on") || !allowed.has(name)) {
            el.removeAttribute(attr.name);
            continue;
          }
          if (
            (name === "href" || name === "src") &&
            !isSafeUrl(attr.value)
          ) {
            el.removeAttribute(attr.name);
          }
        }
        if (tag === "a") {
          el.setAttribute("rel", "noopener noreferrer");
        }
        walk(el);
      } else if (child.nodeType === Node.COMMENT_NODE) {
        node.removeChild(child);
      }
    }
  };

  walk(root);
  return root.innerHTML;
}

type CmsHtmlProps = {
  html: string | null | undefined;
  className?: string;
  as?: "div" | "span" | "p";
  /** When plain text, preserve newlines (default true for block tags). */
  preWrap?: boolean;
};

/**
 * Renders CMS field values: plain text stays escaped; HTML is sanitized then
 * injected (WordPress-style custom field values).
 */
export function CmsHtml({
  html,
  className,
  as = "div",
  preWrap,
}: CmsHtmlProps) {
  const value = html ?? "";
  const Tag = as;
  const usePreWrap = preWrap ?? as !== "span";

  if (!value) return null;

  if (!looksLikeHtml(value)) {
    return (
      <Tag
        className={className}
        style={usePreWrap ? { whiteSpace: "pre-wrap" } : undefined}
      >
        {value}
      </Tag>
    );
  }

  const safe = sanitizeCmsHtml(value);
  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
