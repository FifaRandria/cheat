"use client";

import type { InteractivePayload, LevelDetail, RunResult, SubmitResponse } from "@rustine/shared";
import Link from "next/link";
import { useCallback, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { incidentCode } from "@/lib/format";
import { useSession } from "@/lib/session";
import { Icon } from "../Icon";
import { ChoiceList } from "../lesson/SelfCheck";
import { Markdown } from "../Markdown";
import { BriefPanel } from "./BriefPanel";
import { PostMortem } from "./PostMortem";

type Feedback = { kind: "idle" } | { kind: "result"; result: RunResult } | { kind: "error"; message: string } | { kind: "auth" };

/** Espace de jeu des niveaux sans code : quiz de mises en situation et remise en ordre d'étapes. */
export function InteractiveWorkspace({ initial }: { initial: LevelDetail }) {
  const { user, setUser } = useSession();
  const [level, setLevel] = useState(initial);
  const payload = initial.interactive as InteractivePayload;
  const [answers, setAnswers] = useState<Array<number | null>>(() =>
    payload.kind === "quiz" ? payload.questions.map(() => null) : [],
  );
  const [order, setOrder] = useState(() => (payload.kind === "ordering" ? payload.steps : []));
  const [feedback, setFeedback] = useState<Feedback>({ kind: "idle" });
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<SubmitResponse | null>(null);

  const result = feedback.kind === "result" ? feedback.result : null;
  const incident = incidentCode(level.module.code, level.order);
  const ready = payload.kind === "quiz" ? answers.every((a) => a !== null) : true;

  const submit = useCallback(async () => {
    if (busy || !ready) return;
    if (!user) {
      setFeedback({ kind: "auth" });
      return;
    }
    setBusy(true);
    try {
      const res = await api.submit(
        level.id,
        payload.kind === "quiz" ? { answers: answers.map((a) => a ?? -1) } : { order: order.map((s) => s.id) },
      );
      setFeedback({ kind: "result", result: res.result });
      if (res.user) setUser(res.user);
      setLevel((l) => ({
        ...l,
        attempts: l.attempts + 1,
        status: res.solved || l.status === "solved" ? "solved" : "in-progress",
        reward: res.firstSolve ? res.xpGained : l.reward,
      }));
      if (res.solved) setTimeout(() => setReport(res), 500);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) setFeedback({ kind: "auth" });
      else setFeedback({ kind: "error", message: e instanceof Error ? e.message : "Erreur inattendue" });
    } finally {
      setBusy(false);
    }
  }, [busy, ready, user, level.id, payload.kind, answers, order, setUser]);

  const unlockHint = async () => {
    const res = await api.unlockHint(level.id);
    setLevel((l) => ({ ...l, hintsUnlocked: res.hintsUnlocked, reward: l.status === "solved" ? l.reward : res.reward }));
  };

  return (
    <div data-blackout={level.blackout ? "true" : undefined} className="relative flex flex-col bg-bg text-ink lg:h-[calc(100dvh-4rem)]">
      {level.blackout && <div className="scanlines pointer-events-none absolute inset-0 z-10" aria-hidden="true" />}

      <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-2.5">
        <Link href={`/parcours/${level.track.id}`} className="flex items-center gap-1.5 rounded-md py-1 pr-2 text-sm text-ink-3 hover:text-ink">
          <Icon name="arrowLeft" size={16} />
          <span className="hidden sm:inline">{level.track.title}</span>
        </Link>
        <span className="h-4 w-px bg-line" aria-hidden="true" />
        <span className="font-mono text-xs text-ink-3">{incident}</span>
        <span className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[0.62rem] tracking-[0.12em] text-ink-2 uppercase">
          {payload.kind === "quiz" ? "Mises en situation" : "Remise en ordre"}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span
            className={`rounded-md px-2 py-1 font-mono text-xs font-semibold ${level.status === "solved" ? "text-ink-3" : "bg-fix-soft text-fix"}`}
          >
            {level.status === "solved" ? `${level.reward} XP gagnés` : `+${level.reward} XP`}
          </span>
          <button
            type="button"
            onClick={submit}
            disabled={busy || !ready}
            title={ready ? undefined : "Réponds à toutes les questions d'abord"}
            className="inline-flex items-center gap-2 rounded-lg bg-fix px-4 py-2 text-sm font-semibold text-fix-ink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? (
              <span className="size-3.5 animate-spin rounded-full border-2 border-fix-ink/30 border-t-fix-ink" />
            ) : (
              <Icon name="check" size={15} strokeWidth={2.5} />
            )}
            Valider
          </button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
        <div className="max-h-[55dvh] min-h-0 overflow-hidden border-b border-line lg:max-h-none lg:border-b-0">
          <BriefPanel level={level} onUnlockHint={unlockHint} canUseHints={Boolean(user)} />
        </div>

        <div className="min-h-0 overflow-y-auto bg-sunken/40">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
            <FeedbackBanner feedback={feedback} levelId={level.id} />

            {payload.kind === "quiz" ? (
              <ol className="space-y-5">
                {payload.questions.map((q, i) => {
                  const r = result?.tests[i];
                  return (
                    <li
                      key={i}
                      className={`rounded-2xl border bg-raised p-5 transition sm:p-6 ${
                        r ? (r.ok ? "border-fix/50" : "border-break/50") : "border-line"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 font-mono text-xs text-ink-3">Q{i + 1}</span>
                        <Markdown className="flex-1 [&_p]:text-ink">{q.prompt}</Markdown>
                        {r && (
                          <span className={`shrink-0 ${r.ok ? "text-fix" : "text-break"}`}>
                            <Icon name={r.ok ? "check" : "x"} size={18} strokeWidth={2.5} />
                          </span>
                        )}
                      </div>
                      <ChoiceList
                        name={`q-${i}`}
                        choices={q.choices}
                        picked={answers[i] ?? null}
                        answer={null}
                        onPick={(c) => {
                          setAnswers((a) => a.map((v, j) => (j === i ? c : v)));
                          if (feedback.kind === "result") setFeedback({ kind: "idle" });
                        }}
                      />
                      {r && !r.ok && r.message && (
                        <p className="mt-3 flex animate-rise items-start gap-2 rounded-lg bg-break-soft px-3 py-2 text-sm text-ink">
                          <Icon name="spark" size={15} className="mt-0.5 shrink-0 text-break" />
                          {r.message}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
            ) : (
              <OrderingBoard
                steps={order}
                onChange={(o) => {
                  setOrder(o);
                  if (feedback.kind === "result") setFeedback({ kind: "idle" });
                }}
                result={result}
              />
            )}

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={submit}
                disabled={busy || !ready}
                className="inline-flex items-center gap-2 rounded-xl bg-fix px-5 py-3 font-semibold text-fix-ink transition hover:brightness-110 disabled:opacity-50"
              >
                <Icon name="check" size={17} strokeWidth={2.5} />
                {payload.kind === "quiz"
                  ? ready
                    ? "Valider mes réponses"
                    : `Encore ${answers.filter((a) => a === null).length} question(s)`
                  : "Valider cet ordre"}
              </button>
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
          postmortem={report.postmortem}
          next={report.next}
          onClose={() => setReport(null)}
        />
      )}
    </div>
  );
}

function FeedbackBanner({ feedback, levelId }: { feedback: Feedback; levelId: string }) {
  if (feedback.kind === "idle") return null;
  if (feedback.kind === "auth") {
    return (
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warn/40 bg-warn-soft p-4 text-sm">
        <span>Connecte-toi pour valider et gagner l&apos;XP.</span>
        <Link href={`/connexion?suite=/niveau/${levelId}`} className="rounded-lg bg-fix px-3 py-1.5 font-semibold text-fix-ink">
          Connexion
        </Link>
      </div>
    );
  }
  if (feedback.kind === "error") {
    return <p className="mb-6 rounded-xl border border-break/40 bg-break-soft p-4 text-sm">{feedback.message}</p>;
  }
  const r = feedback.result;
  return (
    <div
      className={`mb-6 flex animate-rise items-center gap-3 rounded-xl border p-4 ${r.ok ? "border-fix/40 bg-fix-soft" : "border-break/40 bg-break-soft"}`}
      aria-live="polite"
    >
      <span className={`font-display text-2xl font-bold tabular-nums ${r.ok ? "text-fix" : "text-break"}`}>
        {r.passed}/{r.total}
      </span>
      <span className="text-sm text-ink">
        {r.ok
          ? "Parfait, tout est juste."
          : "Pas encore. Les éléments marqués en rouge sont à revoir : relis l'énoncé ou la leçon liée, puis réessaie."}
      </span>
    </div>
  );
}

/** Liste réordonnable : glisser-déposer à la souris, ou boutons ↑ ↓ au clavier. */
function OrderingBoard({
  steps,
  onChange,
  result,
}: {
  steps: Array<{ id: string; label: string; detail: string | null }>;
  onChange: (s: Array<{ id: string; label: string; detail: string | null }>) => void;
  result: RunResult | null;
}) {
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= steps.length || from === to) return;
    const next = [...steps];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item!);
    onChange(next);
  };

  return (
    <div>
      <p className="mb-4 flex items-center gap-2 text-sm text-ink-3">
        <Icon name="grip" size={16} /> Glisse les cartes, ou utilise les flèches, pour les remettre dans le bon ordre.
      </p>
      <ol className="space-y-2.5">
        {steps.map((s, i) => {
          const r = result?.tests[i];
          return (
            <li
              key={s.id}
              draggable
              onDragStart={() => setDragging(i)}
              onDragEnd={() => {
                setDragging(null);
                setOver(null);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(i);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragging !== null) move(dragging, i);
                setDragging(null);
                setOver(null);
              }}
              className={`group flex cursor-grab items-center gap-3 rounded-xl border bg-raised p-3 pr-2 transition active:cursor-grabbing ${
                dragging === i ? "opacity-40" : ""
              } ${over === i && dragging !== i ? "border-fix ring-2 ring-fix/30" : r ? (r.ok ? "border-fix/50" : "border-break/50") : "border-line hover:border-line-strong"}`}
            >
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-lg font-mono text-sm font-bold ${
                  r ? (r.ok ? "bg-fix text-fix-ink" : "bg-break text-break-ink") : "bg-sunken text-ink-2"
                }`}
              >
                {i + 1}
              </span>
              <Icon name="grip" size={16} className="shrink-0 text-ink-3" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{s.label}</p>
                {s.detail && <p className="mt-0.5 text-sm text-ink-3">{s.detail}</p>}
              </div>
              <div className="flex shrink-0 flex-col">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0}
                  className="grid size-7 place-items-center rounded-md text-ink-3 hover:bg-hover hover:text-ink disabled:opacity-25"
                  aria-label={`Monter « ${s.label} »`}
                >
                  <Icon name="chevronUp" size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === steps.length - 1}
                  className="grid size-7 place-items-center rounded-md text-ink-3 hover:bg-hover hover:text-ink disabled:opacity-25"
                  aria-label={`Descendre « ${s.label} »`}
                >
                  <Icon name="chevronDown" size={16} />
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
