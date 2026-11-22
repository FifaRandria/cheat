"use client";

import type { Badge } from "@rustine/shared";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "../Icon";
import { Markdown } from "../Markdown";

interface Props {
  incident: string;
  title: string;
  xpGained: number;
  firstSolve: boolean;
  badges: Badge[];
  postmortem: string | null;
  next: { id: string; title: string } | null;
  onClose: () => void;
}

/** Rapport d'incident tamponné « RÉSOLU », affiché quand tous les tests passent. */
export function PostMortem({ incident, title, xpGained, firstSolve, badges, postmortem, next, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const xp = useCountUp(xpGained);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="presentation">
      <div className="absolute inset-0 animate-[rise_0.3s_both] bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pm-title"
        className="relative flex max-h-[92dvh] w-full max-w-2xl animate-rise flex-col overflow-hidden rounded-t-3xl border border-line-strong bg-raised shadow-2xl sm:rounded-3xl"
      >
        <div className="h-1.5 bg-fix" aria-hidden="true" />

        {/* En-tête du rapport */}
        <header className="relative border-b border-line px-6 pt-6 pb-5 sm:px-8">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 grid size-9 place-items-center rounded-lg text-ink-3 hover:bg-hover hover:text-ink"
            aria-label="Fermer le rapport"
          >
            <Icon name="x" />
          </button>

          <p className="font-mono text-xs tracking-[0.16em] text-ink-3 uppercase">Rapport post-mortem · {incident}</p>
          <h2 id="pm-title" className="mt-2 pr-28 font-display text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
            {title}
          </h2>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {firstSolve ? (
              <span className="inline-flex items-center gap-2 rounded-xl bg-fix px-3.5 py-2 font-mono text-lg font-bold text-fix-ink tabular-nums">
                +{xp} XP
              </span>
            ) : (
              <span className="rounded-xl border border-line-strong px-3.5 py-2 font-mono text-sm text-ink-2">
                Déjà résolu : pas d&apos;XP supplémentaire
              </span>
            )}
            {badges.map((b, i) => (
              <span
                key={b.slug}
                className="inline-flex animate-rise items-center gap-2 rounded-xl border border-warn/40 bg-warn-soft px-3 py-2 text-sm"
                style={{ animationDelay: `${400 + i * 150}ms` }}
                title={b.description}
              >
                <Icon name={b.icon as IconName} size={16} className="text-warn" />
                <span className="font-medium">{b.name}</span>
              </span>
            ))}
          </div>

          <span
            className="pointer-events-none absolute top-12 right-8 hidden animate-stamp rounded-lg border-[3px] border-fix px-3 py-1 font-display text-2xl font-extrabold tracking-[0.12em] text-fix uppercase opacity-90 sm:block"
            aria-hidden="true"
          >
            Résolu
          </span>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {postmortem ? <Markdown>{postmortem}</Markdown> : <p className="text-ink-3">Pas de post-mortem pour ce niveau.</p>}
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-line bg-bg/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-2.5 text-sm text-ink-2 hover:text-ink">
            Relire mon code
          </button>
          {next ? (
            <Link
              href={`/niveau/${next.id}`}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-fix px-4 py-2.5 font-semibold text-fix-ink hover:brightness-110"
            >
              Incident suivant : {next.title}
              <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <Link
              href="/parcours"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-fix px-4 py-2.5 font-semibold text-fix-ink"
            >
              Retour au parcours
            </Link>
          )}
        </footer>
      </div>
    </div>
  );
}

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now() + 250;
    const tick = (now: number) => {
      const t = Math.min(Math.max((now - start) / duration, 0), 1);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}
