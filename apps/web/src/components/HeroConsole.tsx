"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

/**
 * Démonstration en boucle du cœur du jeu : un test rouge, un diagnostic, un correctif, un test vert.
 * Phases : 0 cassé → 1 log suspect → 2 correctif tapé → 3 tests verts.
 */
const TIMINGS = [2600, 2200, 1900, 3200];
const FIX = "await ";

export function HeroConsole() {
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase(3);
      setTyped(FIX.length);
      return;
    }
    const t = setTimeout(() => setPhase((p) => (p + 1) % 4), TIMINGS[phase]);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase === 0) setTyped(0);
    if (phase !== 2) return;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTyped(i);
      if (i >= FIX.length) clearInterval(t);
    }, 110);
    return () => clearInterval(t);
  }, [phase]);

  const fixed = phase === 3;
  const broken = !fixed;

  return (
    <div className="relative" aria-label="Démonstration : réparer un await oublié" role="img">
      {/* Halo de signal derrière la fenêtre */}
      <div
        className={`absolute -inset-6 -z-10 rounded-[2rem] blur-3xl transition-colors duration-700 ${
          fixed ? "bg-fix/15" : "bg-break/12"
        }`}
      />

      <div className="overflow-hidden rounded-2xl border border-line-strong bg-raised shadow-[var(--shadow)]">
        {/* Barre de titre */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
          </div>
          <span className="font-mono text-xs text-ink-3">INC-M1-01 · profile.js</span>
          <span
            className={`ml-auto flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[0.65rem] font-semibold tracking-wider uppercase transition-colors duration-500 ${
              fixed ? "bg-fix-soft text-fix" : "bg-break-soft text-break"
            }`}
          >
            <span className={`size-1.5 rounded-full bg-current ${broken ? "animate-pulse-dot" : ""}`} />
            {fixed ? "réparé" : "cassé"}
          </span>
        </div>

        {/* Code */}
        <pre className="overflow-x-auto px-0 py-4 font-mono text-[0.8rem] leading-[1.75] sm:text-[0.85rem]">
          <Line n={1}>
            <K>import</K> {"{ findUserById }"} <K>from</K> <S>&quot;./db.js&quot;</S>;
          </Line>
          <Line n={2}> </Line>
          <Line n={3}>
            <K>export async function</K> <F>getProfile</F>(id) {"{"}
          </Line>
          <Line n={4} state={phase === 1 ? "suspect" : phase === 3 ? "fixed" : undefined}>
            {"  "}
            <K>const</K> user = {phase >= 2 && <span className="rounded-sm bg-fix-soft text-fix">{FIX.slice(0, typed)}</span>}
            {phase === 2 && typed < FIX.length && <span className="animate-blink text-fix">▍</span>}
            <F>findUserById</F>(id);
          </Line>
          <Line n={5}>
            {"  "}
            <K>return</K> {"{ name: user.name, plan: user.plan }"};
          </Line>
          <Line n={6}>{"}"}</Line>
        </pre>

        {/* Console */}
        <div className="border-t border-line bg-sunken px-4 py-3 font-mono text-[0.72rem] leading-relaxed sm:text-xs">
          <div className="mb-1.5 flex items-center gap-2 text-ink-3">
            <Icon name="terminal" size={13} />
            <span>node --test</span>
          </div>
          {broken ? (
            <>
              <TestRow ok={false} label="renvoie le nom et l'offre" />
              <TestRow ok={false} label="rejette si introuvable" />
              <p
                className={`mt-1.5 pl-5 text-ink-3 transition-opacity duration-500 ${
                  phase >= 1 ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="text-warn">console.log(user)</span> → Promise {"{ <pending> }"}
              </p>
            </>
          ) : (
            <>
              <TestRow ok label="renvoie le nom et l'offre" />
              <TestRow ok label="rejette si introuvable" />
              <p className="mt-1.5 flex items-center gap-2 pl-5 text-fix">
                2/2 tests au vert
                <span className="animate-rise rounded bg-fix px-1.5 font-semibold text-fix-ink">+50 XP</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Line({ n, state, children }: { n: number; state?: "suspect" | "fixed"; children: React.ReactNode }) {
  const bg =
    state === "suspect"
      ? "bg-break-soft shadow-[inset_3px_0_0_var(--break)]"
      : state === "fixed"
        ? "bg-fix-soft shadow-[inset_3px_0_0_var(--fix)]"
        : "";
  return (
    <div className={`flex pr-4 transition-colors duration-500 ${bg}`}>
      <span className="w-10 shrink-0 pr-3 text-right text-ink-3/60 select-none">{n}</span>
      <span className="whitespace-pre text-ink">{children}</span>
    </div>
  );
}

const K = ({ children }: { children: React.ReactNode }) => <span className="text-info">{children}</span>;
const F = ({ children }: { children: React.ReactNode }) => <span className="text-warn">{children}</span>;
const S = ({ children }: { children: React.ReactNode }) => <span className="text-fix">{children}</span>;

function TestRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <p className="flex items-center gap-2">
      <span className={ok ? "text-fix" : "text-break"}>{ok ? "✔" : "✘"}</span>
      <span className={ok ? "text-ink-2" : "text-ink"}>{label}</span>
    </p>
  );
}
