import { useEffect, useState } from "react";
import { Marked } from "marked";
import type { RendererObject, Tokens } from "marked";
import Prism from "../../lib/prism";
import "../../lib/prismLanguages";

export interface MarkdownContentProps {
  content: string;
  className?: string;
}

const LANGUAGE_ALIASES: Record<string, string> = {
  md: "markdown",
  mdown: "markdown",
  mkdn: "markdown",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  js: "javascript",
  ts: "typescript",
  yml: "yaml",
  html: "markup",
  svg: "markup",
  xml: "markup",
  py: "python",
  golang: "go",
  ps1: "powershell",
};

const DISPLAY_NAMES: Record<string, string> = {
  markdown: "markdown",
  markup: "html",
  bash: "bash",
  json: "json",
  javascript: "js",
  typescript: "ts",
  jsx: "jsx",
  tsx: "tsx",
  yaml: "yaml",
  python: "python",
  go: "go",
  sql: "sql",
  http: "http",
  powershell: "powershell",
  nginx: "nginx",
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const loadedLanguages = new Set<string>();

/** Lazily pull in any Prism grammar that wasn't eagerly registered. */
async function ensureLanguage(lang: string): Promise<boolean> {
  if (Prism.languages[lang]) return true;
  if (loadedLanguages.has(lang)) return false;
  loadedLanguages.add(lang);
  try {
    await import(`prismjs/components/prism-${lang}.js`);
    return Boolean(Prism.languages[lang]);
  } catch (error) {
    console.error(`Failed to load Prism language "${lang}":`, error);
    return false;
  }
}

const renderer = {
  async code({ text, lang }: Tokens.Code): Promise<string> {
    const raw = (lang || "").trim().toLowerCase();
    const normalized = LANGUAGE_ALIASES[raw] ?? (raw || "text");
    const label = DISPLAY_NAMES[normalized] ?? normalized;

    if (normalized !== "text" && !Prism.languages[normalized]) {
      await ensureLanguage(normalized);
    }

    const grammar = normalized !== "text" ? Prism.languages[normalized] : undefined;
    const highlighted = grammar
      ? Prism.highlight(text, grammar, normalized)
      : escapeHtml(text);

    return [
      `<div class="markdown-code-block">`,
      `<div class="markdown-code-header"><span>${escapeHtml(label)}</span></div>`,
      `<pre class="language-${normalized}"><code class="language-${normalized}">${highlighted}</code></pre>`,
      `</div>`,
    ].join("");
  },
} as unknown as RendererObject;

const marked = new Marked({ gfm: true, breaks: true, async: true });
marked.use({ renderer });

/**
 * Renders markdown (GFM) to beautiful HTML with Prism-syntax-highlighted
 * fenced code blocks. Both user and AI content is run through this so a
 * ```md / ```ts / ```bash block is parsed and colored instead of shown raw.
 */
export default function MarkdownContent({ content, className }: MarkdownContentProps) {
  const [html, setHtml] = useState(() => escapeHtml(content));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await Promise.resolve(marked.parse(content));
      if (!cancelled) setHtml(result as string);
    })().catch((error: unknown) => {
      console.error("Failed to render markdown:", error);
      if (!cancelled) setHtml(escapeHtml(content));
    });
    return () => {
      cancelled = true;
    };
  }, [content]);

  const classes = ["markdown-body", className].filter(Boolean).join(" ");
  return <div className={classes} dangerouslySetInnerHTML={{ __html: html }} />;
}