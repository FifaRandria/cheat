"use client";

import type { RunResult } from "@rustine/shared";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "../Icon";

export type PanelState =
  | { kind: "idle" }
  | { kind: "running" }
  | { kind: "result"; result: RunResult }
  | { kind: "error"; message: string }
  | { kind: "auth" };

export function TestPanel({ state, levelId }: { state: PanelState; levelId: string }) {
  const [tab, setTab] = useState<"tests" | "output">("tests");
  const result = state.kind === "result" ? state.result : null;
  const hasOutput = Boolean(result?.output);

  return (
    <section className="flex min-h-0 flex-col border-t border-line bg-sunken" aria-label="Résultats des tests">
      {/* Barre d'onglets + verdict */}
      <div className="flex items-center gap-1 border-b border-line px-2">
        <TabButton active={tab === "tests"} onClick={() => setTab("tests")}>
          Tests
          {result && (
            <span className={`ml-1.5 tabular-nums ${result.ok ? "text-fix" : "text-break"}`}>
              {result.passed}/{result.total}
            </span>
          )}
        </TabButton>
        <TabButton active={tab === "output"} onClick={() => setTab("output")}>
          Sortie
          {hasOutput && <span className="ml-1.5 size-1.5 rounded-full bg-warn" />}
        </TabButton>

        <div className="ml-auto pr-2" aria-live="polite">
          {state.kind === "running" && (
            <span className="flex items-center gap-2 font-mono text-xs text-ink-2">
              <span className="size-3 animate-spin rounded-full border-2 border-line-strong border-t-fix" />
              exécution dans le bac à sable…
            </span>
          )}
          {result && (
            <span className={`font-mono text-xs ${result.ok ? "text-fix" : "text-break"}`}>
              {result.ok ? "✔ tout est au vert" : result.timedOut ? "⏱ temps dépassé" : `✘ ${result.failed} en échec`}
              <span className="ml-2 text-ink-3">{(result.durationMs / 1000).toFixed(1)} s</span>
            </span>
          )}
        </div>
      </div>

      {/* Jauge de tests segmentée */}
      {result && result.total > 0 && (
        <div className="flex gap-0.5 px-3 pt-3" aria-hidden="true">
          {result.tests.map((t, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${t.ok ? "bg-fix" : "bg-break"} animate-rise`}
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto p-3 font-mono text-[0.8rem]">
        {tab === "tests" ? <TestsView state={state} levelId={levelId} /> : <OutputView result={result} />}
      </div>
    </section>
  );
}

function TestsView({ state, levelId }: { state: PanelState; levelId: string }) {
  if (state.kind === "idle") {
    return (
      <div className="grid h-full place-items-center py-6 text-center">
        <div>
          <p className="text-ink-2">Aucun test lancé pour l&apos;instant.</p>
          <p className="mt-1.5 text-xs text-ink-3">
            Lis les logs, formule une hypothèse, corrige, puis{" "}
            <kbd className="rounded border border-line-strong bg-raised px-1.5 py-0.5 text-ink-2">Ctrl</kbd>{" "}
            <kbd className="rounded border border-line-strong bg-raised px-1.5 py-0.5 text-ink-2">Entrée</kbd>
          </p>
        </div>
      </div>
    );
  }
  if (state.kind === "running") {
    return (
      <ul className="space-y-2">
        {[0, 1, 2].map((i) => (
          <li key={i} className="h-8 animate-pulse rounded-md bg-raised" />
        ))}
      </ul>
    );
  }
  if (state.kind === "auth") {
    return (
      <div className="grid h-full place-items-center py-6 text-center font-sans">
        <div>
          <Icon name="key" size={22} className="mx-auto text-warn" />
          <p className="mt-2 text-ink">Connecte-toi pour lancer les tests.</p>
          <p className="mt-1 text-sm text-ink-3">Ton code est exécuté dans un bac à sable isolé, sur nos serveurs.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Link
              href={`/inscription?suite=/niveau/${levelId}`}
              className="rounded-lg bg-fix px-3.5 py-2 text-sm font-semibold text-fix-ink"
            >
              Créer un compte
            </Link>
            <Link
              href={`/connexion?suite=/niveau/${levelId}`}
              className="rounded-lg border border-line-strong px-3.5 py-2 text-sm"
            >
              Connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }
  if (state.kind === "error") {
    return (
      <div className="rounded-lg border border-warn/40 bg-warn-soft p-3 font-sans text-sm">
        <p className="font-semibold text-warn">Le bac à sable n&apos;a pas pu exécuter ton code</p>
        <p className="mt-1 text-ink-2">{state.message}</p>
        <p className="mt-2 text-xs text-ink-3">Ce n&apos;est pas compté comme une tentative.</p>
      </div>
    );
  }

  const { result } = state;
  if (result.total === 0) {
    return (
      <div className="rounded-lg border border-break/40 bg-break-soft p-3">
        <p className="font-sans font-semibold text-break">Aucun test n&apos;a pu s&apos;exécuter</p>
        <p className="mt-1 font-sans text-sm text-ink-2">
          Souvent une erreur de syntaxe ou un import cassé. Regarde l&apos;onglet Sortie.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-1.5">
      {result.tests.map((t, i) => (
        <li
          key={i}
          className={`animate-rise rounded-md border ${t.ok ? "border-transparent" : "border-break/30 bg-break-soft"}`}
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="flex items-start gap-2.5 px-2.5 py-1.5">
            <span className={`mt-px ${t.ok ? "text-fix" : "text-break"}`}>{t.ok ? "✔" : "✘"}</span>
            <span className={`flex-1 ${t.ok ? "text-ink-2" : "text-ink"}`}>{t.name}</span>
            {t.durationMs !== undefined && <span className="text-xs text-ink-3 tabular-nums">{t.durationMs} ms</span>}
          </div>
          {t.message && (
            <pre className="mx-2.5 mb-2 overflow-x-auto rounded border-l-2 border-break bg-bg/60 px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap text-ink-2">
              {t.message}
            </pre>
          )}
        </li>
      ))}
    </ul>
  );
}

function OutputView({ result }: { result: RunResult | null }) {
  if (!result?.output) {
    return (
      <p className="py-4 text-center text-ink-3">
        Rien sur la sortie standard. Un <span className="text-ink-2">console.log</span> dans ton code apparaîtra ici.
      </p>
    );
  }
  return <pre className="leading-relaxed whitespace-pre-wrap text-ink-2">{result.output}</pre>;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative flex items-center px-3 py-2.5 font-mono text-xs tracking-wide uppercase transition ${
        active ? "text-ink" : "text-ink-3 hover:text-ink-2"
      }`}
    >
      {children}
      {active && <span className="absolute inset-x-3 -bottom-px h-0.5 bg-fix" />}
    </button>
  );
}
