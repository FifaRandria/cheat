"use client";

import type { LevelDetail } from "@rustine/shared";
import Link from "next/link";
import { useState } from "react";
import { incidentCode } from "@/lib/format";
import { Icon } from "../Icon";
import { Markdown } from "../Markdown";
import { BlackoutTag, Severity, StatusChip } from "../Signals";

interface Props {
  level: LevelDetail;
  onUnlockHint: () => Promise<void>;
  canUseHints: boolean;
}

/** Colonne de gauche : le dossier d'incident (énoncé, logs, indices). */
export function BriefPanel({ level, onUnlockHint, canUseHints }: Props) {
  const [tab, setTab] = useState<"brief" | "hints">("brief");

  return (
    <aside className="flex min-h-0 flex-col border-line bg-bg lg:border-r" aria-label="Dossier d'incident">
      <div className="border-b border-line px-5 pt-5 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs tracking-wider text-ink-3">
            {incidentCode(level.module.code, level.order)}
          </span>
          <StatusChip status={level.status} />
          {level.blackout && <BlackoutTag />}
        </div>
        <h1 className="mt-2.5 font-display text-2xl leading-tight font-bold tracking-[-0.03em]">{level.title}</h1>
        <div className="mt-3 flex items-center gap-4 text-xs text-ink-3">
          <Severity level={level.difficulty} />
          <span>
            {level.module.code} · {level.module.title}
          </span>
        </div>
      </div>

      <div className="flex border-b border-line px-3" role="tablist">
        <PanelTab active={tab === "brief"} onClick={() => setTab("brief")} icon="file">
          Dossier
        </PanelTab>
        <PanelTab active={tab === "hints"} onClick={() => setTab("hints")} icon={level.blackout ? "moon" : "key"}>
          {level.blackout ? "Blackout" : `Indices ${level.hintsUnlocked.length}/${level.hintsTotal}`}
        </PanelTab>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {tab === "brief" ? (
          <>
            <Markdown>{level.brief}</Markdown>
            {level.logs && <LogsBlock logs={level.logs} />}
            {level.lessons.length > 0 && <LessonLinks lessons={level.lessons} blackout={level.blackout} />}
          </>
        ) : level.blackout ? (
          <BlackoutNote />
        ) : (
          <Hints level={level} onUnlock={onUnlockHint} canUse={canUseHints} />
        )}
      </div>
    </aside>
  );
}

/** Renvoi vers les leçons qui expliquent la notion : on ne répare bien que ce qu'on comprend. */
function LessonLinks({ lessons, blackout }: { lessons: LevelDetail["lessons"]; blackout: boolean }) {
  return (
    <div className="mt-6 rounded-xl border border-dashed border-line-strong p-4">
      <p className="flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.14em] text-ink-3 uppercase">
        <Icon name="book" size={13} />
        {blackout ? "Documentation" : "Besoin d'un rappel ?"}
      </p>
      <ul className="mt-2.5 space-y-1">
        {lessons.map((l) => (
          <li key={l.id}>
            <Link
              href={`/lecons/${l.id}`}
              target="_blank"
              className="group flex items-center gap-2 rounded-md py-1 text-sm text-ink-2 hover:text-ink"
            >
              <span className="h-px w-3 bg-line-strong transition-all group-hover:w-5 group-hover:bg-fix" />
              {l.title}
              <Icon name="arrowRight" size={13} className="opacity-0 transition group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-ink-3">S'ouvre dans un nouvel onglet : ton code reste ici.</p>
    </div>
  );
}

function LogsBlock({ logs }: { logs: string }) {
  const lines = logs.trimEnd().split("\n");
  return (
    <figure className="mt-6">
      <figcaption className="mb-2 flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.14em] text-ink-3 uppercase">
        <Icon name="logs" size={13} />
        Logs de production
      </figcaption>
      <pre className="rounded-lg border border-line bg-sunken py-3 font-mono text-[0.74rem] leading-[1.7] break-words whitespace-pre-wrap">
        {lines.map((line, i) => (
          <div key={i} className={`px-3 ${isAlarming(line) ? "bg-break-soft text-ink" : "text-ink-2"}`}>
            {highlightLog(line)}
          </div>
        ))}
      </pre>
    </figure>
  );
}

const isAlarming = (line: string) => /error|500|ECONNREFUSED|TypeError|sent=0/i.test(line);

function highlightLog(line: string) {
  const m = /^(\s*)(\[[\w-]+\])(.*)$/.exec(line);
  if (!m) return line || " ";
  return (
    <>
      {m[1]}
      <span className="text-info">{m[2]}</span>
      {m[3]}
    </>
  );
}

function Hints({ level, onUnlock, canUse }: { level: LevelDetail; onUnlock: () => Promise<void>; canUse: boolean }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const remaining = level.hintsTotal - level.hintsUnlocked.length;
  const solved = level.status === "solved";

  if (level.hintsTotal === 0) {
    return <p className="text-sm text-ink-3">Ce niveau ne propose aucun indice.</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-ink-2">
        Les indices sont écrits à l&apos;avance par l&apos;équipe, jamais générés par une IA. Chacun coûte{" "}
        <span className="font-semibold text-warn">{level.hintCost} XP</span> sur la récompense.
      </p>

      <ol className="space-y-2.5">
        {level.hintsUnlocked.map((hint, i) => (
          <li key={i} className="animate-rise rounded-lg border border-warn/30 bg-warn-soft p-3.5">
            <p className="font-mono text-[0.65rem] tracking-[0.14em] text-warn uppercase">Indice {i + 1}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink">{hint}</p>
          </li>
        ))}

        {Array.from({ length: remaining }, (_, i) => {
          const n = level.hintsUnlocked.length + i + 1;
          const isNext = i === 0;
          return (
            <li key={n} className="rounded-lg border border-dashed border-line-strong p-3.5">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.14em] text-ink-3 uppercase">
                  <Icon name="lock" size={13} />
                  Indice {n}
                </span>
                {isNext && canUse && (
                  confirming ? (
                    <span className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={async () => {
                          setBusy(true);
                          await onUnlock().finally(() => setBusy(false));
                          setConfirming(false);
                        }}
                        className="rounded-md bg-warn px-2.5 py-1 text-xs font-semibold text-bg disabled:opacity-50"
                      >
                        {solved ? "Ouvrir" : `Payer ${level.hintCost} XP`}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirming(false)}
                        className="rounded-md px-2 py-1 text-xs text-ink-3 hover:text-ink"
                      >
                        Annuler
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirming(true)}
                      className="rounded-md border border-line-strong px-2.5 py-1 text-xs text-ink-2 transition hover:border-warn hover:text-warn"
                    >
                      Ouvrir
                    </button>
                  )
                )}
              </div>
              {isNext && !canUse && <p className="mt-2 text-xs text-ink-3">Connecte-toi pour ouvrir les indices.</p>}
            </li>
          );
        })}
      </ol>

      <p className="pt-2 text-xs text-ink-3">
        Récompense actuelle : <span className="font-mono text-fix">+{level.reward} XP</span>
      </p>
    </div>
  );
}

function BlackoutNote() {
  return (
    <div className="space-y-4 font-mono text-sm leading-relaxed text-ink-2">
      <p className="text-ink">Lumières éteintes.</p>
      <p>Aucun indice. Aucune aide. Tu as :</p>
      <ul className="space-y-1.5">
        <li>→ les logs de production, dans le dossier ;</li>
        <li>→ la sortie des tests, après chaque exécution ;</li>
        <li>→ la documentation officielle, liée dans l&apos;énoncé.</li>
      </ul>
      <p className="text-ink-3">Formule une hypothèse. Vérifie-la. Recommence.</p>
    </div>
  );
}

function PanelTab({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: "file" | "key" | "moon";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`relative flex items-center gap-1.5 px-3 py-2.5 text-sm transition ${
        active ? "text-ink" : "text-ink-3 hover:text-ink-2"
      }`}
    >
      <Icon name={icon} size={15} />
      {children}
      {active && <span className="absolute inset-x-2 -bottom-px h-0.5 bg-fix" />}
    </button>
  );
}
