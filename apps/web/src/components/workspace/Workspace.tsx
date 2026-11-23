"use client";

import type { LevelDetail, SourceFile, SubmitResponse } from "@rustine/shared";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { incidentCode } from "@/lib/format";
import { useSession } from "@/lib/session";
import { Icon } from "../Icon";
import { BriefPanel } from "./BriefPanel";
import { CodeEditor } from "./CodeEditor";
import { PostMortem } from "./PostMortem";
import { type PanelState, TestPanel } from "./TestPanel";

export function Workspace({ initial, revision = false }: { initial: LevelDetail; revision?: boolean }) {
  const { user, setUser } = useSession();
  const [level, setLevel] = useState(initial);
  const [files, setFiles] = useState<SourceFile[]>(initial.files);
  const [active, setActive] = useState(initial.entry);
  const [panel, setPanel] = useState<PanelState>({ kind: "idle" });
  const [report, setReport] = useState<SubmitResponse | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [saved, setSaved] = useState<"idle" | "saving" | "saved">("idle");
  const dirty = useRef(false);

  const running = panel.kind === "running";
  const current = files.find((f) => f.path === active) ?? files[0];
  const incident = incidentCode(level.module.code, level.order);

  // Sauvegarde automatique du brouillon (1,2 s après la dernière frappe).
  useEffect(() => {
    if (!user || !dirty.current) return;
    setSaved("saving");
    const t = setTimeout(() => {
      api
        .saveDraft(level.id, files)
        .then(() => setSaved("saved"))
        .catch(() => setSaved("idle"));
    }, 1200);
    return () => clearTimeout(t);
  }, [files, user, level.id]);

  const edit = (content: string) => {
    dirty.current = true;
    setFiles((fs) => fs.map((f) => (f.path === current?.path ? { ...f, content } : f)));
  };

  const run = useCallback(async () => {
    if (running) return;
    if (!user) {
      setPanel({ kind: "auth" });
      return;
    }
    setPanel({ kind: "running" });
    try {
      const res = await api.submit(level.id, { files });
      setPanel({ kind: "result", result: res.result });
      if (res.user) setUser(res.user);
      setLevel((l) => ({
        ...l,
        attempts: l.attempts + 1,
        status: res.solved ? "solved" : l.status === "solved" ? "solved" : "in-progress",
        reward: res.firstSolve ? res.xpGained : l.reward,
        postmortem: res.postmortem ?? l.postmortem,
      }));
      if (res.solved) setTimeout(() => setReport(res), 650);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) setPanel({ kind: "auth" });
      else setPanel({ kind: "error", message: e instanceof Error ? e.message : "Erreur inattendue" });
    }
  }, [running, user, level.id, files, setUser]);

  // Raccourci global, y compris quand le focus n'est pas dans l'éditeur.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        void run();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [run]);

  const reset = async () => {
    const starter = await api.starter(level.id);
    dirty.current = true;
    setFiles(starter);
    setConfirmReset(false);
    setPanel({ kind: "idle" });
  };

  const unlockHint = async () => {
    try {
      const res = await api.unlockHint(level.id);
      setLevel((l) => ({ ...l, hintsUnlocked: res.hintsUnlocked, reward: l.status === "solved" ? l.reward : res.reward }));
    } catch (e) {
      setPanel({ kind: "error", message: e instanceof Error ? e.message : "Impossible d'ouvrir l'indice" });
    }
  };

  return (
    <div
      data-blackout={level.blackout ? "true" : undefined}
      className="relative flex flex-col bg-bg text-ink lg:h-[calc(100dvh-4rem)]"
    >
      {level.blackout && <div className="scanlines pointer-events-none absolute inset-0 z-10" aria-hidden="true" />}

      {/* Barre d'outils */}
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-2.5">
        <Link
          href={`/parcours/${level.track.id}`}
          className="flex items-center gap-1.5 rounded-md py-1 pr-2 text-sm text-ink-3 hover:text-ink"
          aria-label="Retour au parcours"
        >
          <Icon name="arrowLeft" size={16} />
          <span className="hidden sm:inline">{level.track.title}</span>
        </Link>
        <span className="h-4 w-px bg-line" aria-hidden="true" />
        <span className="font-mono text-xs text-ink-3">{incident}</span>
        {revision && (
          <Link
            href="/revision"
            className="flex items-center gap-1.5 rounded-md bg-warn-soft px-2 py-0.5 font-mono text-[0.62rem] font-semibold tracking-[0.12em] text-warn uppercase"
            title="Tu rejoues ce niveau depuis le musée de bugs"
          >
            <Icon name="reset" size={11} /> Révision
          </Link>
        )}

        {level.blackout && (
          <span className="flicker hidden font-mono text-[0.68rem] tracking-[0.24em] text-ink uppercase md:inline">
            ● Blackout · aucune aide
          </span>
        )}

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden font-mono text-xs text-ink-3 md:inline" aria-live="polite">
            {saved === "saving" ? "enregistrement…" : saved === "saved" ? "brouillon enregistré" : ""}
          </span>
          <span
            className={`rounded-md px-2 py-1 font-mono text-xs font-semibold ${
              level.status === "solved" ? "text-ink-3" : "bg-fix-soft text-fix"
            }`}
            title="Récompense restante"
          >
            {level.status === "solved" ? `${level.reward} XP gagnés` : `+${level.reward} XP`}
          </span>

          {confirmReset ? (
            <span className="flex items-center gap-1">
              <button
                type="button"
                onClick={reset}
                className="rounded-lg bg-break px-3 py-2 text-sm font-medium text-break-ink"
              >
                Tout effacer
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="rounded-lg px-2.5 py-2 text-sm text-ink-3"
              >
                Annuler
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="grid size-9 place-items-center rounded-lg border border-line text-ink-3 transition hover:border-line-strong hover:text-ink"
              aria-label="Revenir au code de départ"
              title="Revenir au code de départ"
            >
              <Icon name="reset" size={16} />
            </button>
          )}

          <button
            type="button"
            onClick={run}
            disabled={running}
            className="group inline-flex items-center gap-2 rounded-lg bg-fix px-4 py-2 text-sm font-semibold text-fix-ink transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
          >
            {running ? (
              <span className="size-3.5 animate-spin rounded-full border-2 border-fix-ink/30 border-t-fix-ink" />
            ) : (
              <Icon name="play" size={14} fill="currentColor" />
            )}
            Lancer les tests
            <kbd className="hidden rounded bg-fix-ink/10 px-1.5 py-0.5 font-mono text-[0.65rem] lg:inline">Ctrl ↵</kbd>
          </button>
        </div>
      </div>

      {/* Zone de travail */}
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
        <div className="max-h-[55dvh] min-h-0 overflow-hidden border-b border-line lg:max-h-none lg:border-b-0">
          <BriefPanel level={level} onUnlockHint={unlockHint} canUseHints={Boolean(user)} />
        </div>

        <div className="flex min-h-0 flex-col">
          {/* Onglets de fichiers */}
          <div className="flex overflow-x-auto border-b border-line bg-bg" role="tablist" aria-label="Fichiers">
            {files.map((f) => {
              const isActive = f.path === current?.path;
              return (
                <button
                  key={f.path}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(f.path)}
                  className={`relative flex shrink-0 items-center gap-2 border-r border-line px-4 py-2.5 font-mono text-[0.8rem] transition ${
                    isActive ? "bg-sunken text-ink" : "text-ink-3 hover:text-ink-2"
                  }`}
                >
                  <Icon name="file" size={14} className={f.path === level.entry ? "text-break" : ""} />
                  {f.path}
                  {isActive && <span className="absolute inset-x-0 top-0 h-0.5 bg-fix" />}
                </button>
              );
            })}
          </div>

          <div className="h-[55dvh] min-h-0 lg:h-auto lg:flex-[1_1_60%]">
            {current && (
              <CodeEditor
                path={current.path}
                value={current.content}
                onChange={edit}
                onRun={() => void run()}
                blackout={level.blackout}
              />
            )}
          </div>

          <div className="flex h-[340px] min-h-0 lg:h-auto lg:flex-[1_1_40%]">
            <div className="flex min-w-0 flex-1 flex-col">
              <TestPanel state={panel} levelId={level.id} />
            </div>
          </div>
        </div>
      </div>

      {report && (
        <PostMortem
          incident={incident}
          title={level.title}
          xpGained={report.xpGained}
          firstSolve={report.firstSolve}
          badges={report.newBadges}
          reviewed={report.reviewed}
          postmortem={report.postmortem}
          next={report.next}
          onClose={() => setReport(null)}
        />
      )}
    </div>
  );
}
