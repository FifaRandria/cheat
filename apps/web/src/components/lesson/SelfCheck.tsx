"use client";

import type { CheckQuestion } from "@rustine/shared";
import { useState } from "react";
import { Icon } from "../Icon";
import { Markdown } from "../Markdown";

/** « Vérifie ta compréhension » : correction immédiate, sans enjeu, explications à l'appui. */
export function SelfCheck({ questions }: { questions: CheckQuestion[] }) {
  const [picked, setPicked] = useState<Array<number | null>>(() => questions.map(() => null));
  const answered = picked.filter((p) => p !== null).length;
  const correct = picked.filter((p, i) => p === questions[i]?.answer).length;

  if (questions.length === 0) return null;

  return (
    <section className="mt-16" aria-labelledby="check-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-[0.18em] text-ink-3 uppercase">Auto-évaluation</p>
          <h2 id="check-title" className="mt-1.5 font-display text-2xl font-semibold tracking-tight">
            Vérifie ta compréhension
          </h2>
        </div>
        {answered > 0 && (
          <p className="font-mono text-sm text-ink-2" aria-live="polite">
            <span className={correct === questions.length ? "text-fix" : "text-ink"}>{correct}</span>/{questions.length} juste
            {correct > 1 ? "s" : ""}
          </p>
        )}
      </div>

      <ol className="mt-6 space-y-5">
        {questions.map((q, i) => (
          <li key={i} className="rounded-2xl border border-line bg-raised/60 p-5">
            <div className="flex gap-3">
              <span className="font-mono text-xs text-ink-3">Q{i + 1}</span>
              <Markdown className="flex-1 text-[0.95rem] [&_p]:text-ink">{q.prompt}</Markdown>
            </div>
            <ChoiceList
              name={`check-${i}`}
              choices={q.choices}
              picked={picked[i] ?? null}
              answer={picked[i] !== null ? q.answer : null}
              onPick={(c) => setPicked((p) => p.map((v, j) => (j === i ? c : v)))}
            />
            {picked[i] !== null && (
              <div
                className={`mt-3 animate-rise rounded-lg px-3.5 py-2.5 text-sm ${
                  picked[i] === q.answer ? "bg-fix-soft text-ink" : "bg-break-soft text-ink"
                }`}
              >
                <p className={`font-semibold ${picked[i] === q.answer ? "text-fix" : "text-break"}`}>
                  {picked[i] === q.answer ? "Exactement." : "Pas tout à fait."}
                </p>
                {q.explain && <Markdown className="mt-1 text-sm">{q.explain}</Markdown>}
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

/**
 * Liste de choix accessible (boutons radio). Si `answer` est fourni, la correction s'affiche
 * et la liste devient verrouillée.
 */
export function ChoiceList({
  name,
  choices,
  picked,
  answer,
  onPick,
  locked = false,
}: {
  name: string;
  choices: string[];
  picked: number | null;
  answer: number | null;
  onPick: (choice: number) => void;
  locked?: boolean;
}) {
  const revealed = answer !== null;
  return (
    <div role="radiogroup" className="mt-4 grid gap-2">
      {choices.map((choice, c) => {
        const isPicked = picked === c;
        const isAnswer = revealed && c === answer;
        const isWrong = revealed && isPicked && c !== answer;
        return (
          <label
            key={c}
            className={`group flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 text-[0.93rem] transition ${
              isAnswer
                ? "border-fix/60 bg-fix-soft"
                : isWrong
                  ? "border-break/60 bg-break-soft"
                  : isPicked
                    ? "border-ink-2 bg-hover"
                    : "border-line hover:border-line-strong hover:bg-hover"
            } ${revealed || locked ? "cursor-default" : ""}`}
          >
            <input
              type="radio"
              name={name}
              className="sr-only"
              checked={isPicked}
              disabled={revealed || locked}
              onChange={() => onPick(c)}
            />
            <span
              className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border font-mono text-[0.6rem] ${
                isAnswer
                  ? "border-fix bg-fix text-fix-ink"
                  : isWrong
                    ? "border-break bg-break text-break-ink"
                    : isPicked
                      ? "border-ink bg-ink text-bg"
                      : "border-line-strong text-ink-3 group-hover:border-ink-2"
              }`}
              aria-hidden="true"
            >
              {isAnswer ? <Icon name="check" size={11} strokeWidth={3} /> : isWrong ? <Icon name="x" size={11} strokeWidth={3} /> : String.fromCharCode(65 + c)}
            </span>
            <Markdown className="flex-1 [&_p]:text-ink">{choice}</Markdown>
          </label>
        );
      })}
    </div>
  );
}
