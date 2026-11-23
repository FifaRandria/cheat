import type { Element, ElementContent } from "hast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Icon, type IconName } from "./Icon";
import { CodeBlock } from "./lesson/CodeBlock";
import { MissionCheck } from "./lesson/MissionCheck";

/** Encadrés : une citation qui commence par **À retenir**, **Attention** ou **Astuce**. */
const CALLOUTS: Record<string, { cls: string; icon: IconName }> = {
  "à retenir": { cls: "callout-key", icon: "key" },
  attention: { cls: "callout-warn", icon: "bug" },
  astuce: { cls: "callout-tip", icon: "spark" },
  analogie: { cls: "callout-tip", icon: "spark" },
};

const textOf = (n: ElementContent | undefined): string =>
  !n ? "" : n.type === "text" ? n.value : n.type === "element" ? n.children.map(textOf).join("") : "";

function calloutKind(node: Element | undefined) {
  const p = node?.children.find((c): c is Element => c.type === "element" && c.tagName === "p");
  const first = p?.children.find((c) => c.type === "element" || (c.type === "text" && c.value.trim()));
  if (first?.type !== "element" || first.tagName !== "strong") return null;
  return CALLOUTS[textOf(first).trim().toLowerCase()] ?? null;
}

export function Markdown({
  children,
  className = "",
  runnable = false,
}: {
  children: string;
  className?: string;
  /** Rend exécutables les blocs ```js run (leçons) */
  runnable?: boolean;
}) {
  return (
    <div className={`prose-rustine ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children: c }) => (
            <a href={href} target={href?.startsWith("/") ? undefined : "_blank"} rel="noreferrer noopener">
              {c}
            </a>
          ),
          pre: ({ node }) => {
            const code = node?.children.find((c): c is Element => c.type === "element" && c.tagName === "code");
            const cls = (code?.properties.className as string[] | undefined)?.[0] ?? "";
            const language = cls.replace(/^language-/, "");
            const meta = String((code?.data as { meta?: string } | undefined)?.meta ?? "");
            return (
              <CodeBlock
                code={textOf(code)}
                language={language}
                runnable={runnable && language === "js" && /\brun\b/.test(meta)}
              />
            );
          },
          blockquote: ({ node, children: c }) => {
            const kind = calloutKind(node);
            if (!kind) return <blockquote>{c}</blockquote>;
            return (
              <aside className={`callout ${kind.cls}`}>
                <Icon name={kind.icon} size={17} className="callout-icon" />
                <div>{c}</div>
              </aside>
            );
          },
          // Les missions (- [ ] …) : des cases cochables, retenues dans le navigateur.
          input: ({ node, type, checked }) =>
            type === "checkbox" ? (
              <MissionCheck line={node?.position?.start.line ?? 0} initial={Boolean(checked)} />
            ) : (
              <input type={type} />
            ),
          table: ({ children: c }) => (
            <div className="table-wrap">
              <table>{c}</table>
            </div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
