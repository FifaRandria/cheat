"use client";

import { Highlight, type PrismTheme } from "prism-react-renderer";
import { useRef, useState } from "react";
import { type ConsoleLine, runSnippet } from "@/lib/js-sandbox";
import { Icon } from "../Icon";

/** Thème Prism branché sur les jetons de couleur : il suit le thème clair, sombre et Blackout. */
const theme: PrismTheme = {
  plain: { color: "var(--ink)", backgroundColor: "transparent" },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "var(--ink-3)", fontStyle: "italic" } },
    { types: ["keyword", "builtin", "important", "atrule"], style: { color: "var(--info)" } },
    { types: ["string", "char", "template-string", "attr-value", "regex"], style: { color: "var(--fix)" } },
    { types: ["number", "boolean", "constant"], style: { color: "var(--warn)" } },
    { types: ["function", "class-name"], style: { color: "var(--warn)" } },
    { types: ["tag", "selector"], style: { color: "var(--break)" } },
    { types: ["attr-name", "property"], style: { color: "var(--info)" } },
    { types: ["punctuation", "operator"], style: { color: "var(--ink-2)" } },
    { types: ["interpolation-punctuation", "template-punctuation"], style: { color: "var(--break)" } },
  ],
};

const LANG: Record<string, string> = {
  js: "javascript",
  javascript: "javascript",
  py: "python",
  python: "python",
  ts: "typescript",
  sql: "sql",
  json: "json",
  yaml: "yaml",
  yml: "yaml",
  bash: "bash",
  sh: "bash",
  shell: "bash",
  dockerfile: "dockerfile",
  http: "http",
  html: "markup",
  markup: "markup",
  css: "css",
};
const LABEL: Record<string, string> = {
  javascript: "JavaScript",
  python: "Python",
  typescript: "TypeScript",
  sql: "SQL",
  json: "JSON",
  yaml: "YAML",
  bash: "Terminal",
  dockerfile: "Dockerfile",
  http: "HTTP",
  markup: "HTML",
  css: "CSS",
};

export function CodeBlock({ code, language, runnable }: { code: string; language: string; runnable: boolean }) {
  if (language === "output") return <OutputBlock text={code} />;
  if (runnable) return <RunnableCode initial={code} />;
  return (
    <figure className="code-figure">
      {LABEL[LANG[language] ?? ""] && <figcaption>{LABEL[LANG[language] ?? ""]}</figcaption>}
      <Highlighted code={code} language={language} />
    </figure>
  );
}

function Highlighted({ code, language }: { code: string; language: string }) {
  return (
    <Highlight code={code.replace(/\n$/, "")} language={LANG[language] ?? language ?? "text"} theme={theme}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre className="code-pre">
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, j) => (
                <span key={j} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

function OutputBlock({ text }: { text: string }) {
  return (
    <figure className="code-figure code-output">
      <figcaption>
        <Icon name="terminal" size={12} /> Sortie
      </figcaption>
      <pre className="code-pre">{text.replace(/\n$/, "")}</pre>
    </figure>
  );
}

/** Exemple modifiable et exécutable directement dans la leçon. */
function RunnableCode({ initial }: { initial: string }) {
  const original = initial.replace(/\n$/, "");
  const [code, setCode] = useState(original);
  const [editing, setEditing] = useState(false);
  const [lines, setLines] = useState<ConsoleLine[] | null>(null);
  const [running, setRunning] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const run = async () => {
    if (running) return;
    setRunning(true);
    setTimedOut(false);
    const out: ConsoleLine[] = [];
    setLines([]);
    const res = await runSnippet(code, (line) => {
      out.push(line);
      setLines([...out]);
    });
    setTimedOut(res.timedOut);
    setRunning(false);
  };

  const modified = code !== original;

  return (
    <figure className="code-figure code-runnable">
      <figcaption>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-fix" /> JavaScript · exécutable
        </span>
        <span className="ml-auto flex items-center gap-1">
          {modified && (
            <button
              type="button"
              onClick={() => {
                setCode(original);
                setLines(null);
              }}
              className="code-btn"
              title="Revenir au code d'origine"
            >
              <Icon name="reset" size={12} /> Rétablir
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setEditing((e) => !e);
              setTimeout(() => taRef.current?.focus(), 0);
            }}
            className="code-btn"
            aria-pressed={editing}
          >
            {editing ? "Terminer" : "Modifier"}
          </button>
          <button type="button" onClick={run} disabled={running} className="code-btn code-btn-run">
            {running ? (
              <span className="size-3 animate-spin rounded-full border-2 border-fix-ink/30 border-t-fix-ink" />
            ) : (
              <Icon name="play" size={11} fill="currentColor" />
            )}
            Exécuter
          </button>
        </span>
      </figcaption>

      {editing ? (
        <textarea
          ref={taRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              void run();
            }
            if (e.key === "Tab" && !e.shiftKey) {
              e.preventDefault();
              const t = e.currentTarget;
              const { selectionStart: s, selectionEnd: end } = t;
              setCode(code.slice(0, s) + "  " + code.slice(end));
              requestAnimationFrame(() => t.setSelectionRange(s + 2, s + 2));
            }
          }}
          spellCheck={false}
          rows={Math.max(3, code.split("\n").length + 1)}
          className="code-pre code-textarea"
          aria-label="Code de l'exemple, modifiable. Ctrl+Entrée pour exécuter."
        />
      ) : (
        <div onDoubleClick={() => setEditing(true)}>
          <Highlighted code={code} language="javascript" />
        </div>
      )}

      {lines !== null && (
        <div className="code-console" aria-live="polite">
          {lines.length === 0 && !running && <p className="text-ink-3">(rien n&apos;a été affiché)</p>}
          {lines.map((l, i) => (
            <p key={i} className={l.kind === "error" ? "text-break" : l.kind === "warn" ? "text-warn" : "text-ink"}>
              {l.kind === "error" && "✘ "}
              {l.text}
            </p>
          ))}
          {running && <p className="animate-pulse text-ink-3">…</p>}
          {timedOut && <p className="text-warn">⏱ Arrêté au bout de 5 s. Boucle infinie ?</p>}
        </div>
      )}
    </figure>
  );
}
