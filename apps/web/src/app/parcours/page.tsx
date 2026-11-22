"use client";

import type { TrackSummary } from "@rustine/shared";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { XpMeter } from "@/components/XpMeter";
import { useSession } from "@/lib/session";
import { accentVars, trackStyle } from "@/lib/tracks";
import { trackStats, useTracks } from "@/lib/use-tracks";

export default function ParcoursPage() {
  const { user } = useSession();
  const { tracks, error } = useTracks();

  return (
    <div className="relative">
      <div className="bg-blueprint pointer-events-none absolute inset-x-0 top-0 h-96 opacity-50" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-24 sm:px-6">
        <header className="grid gap-8 lg:grid-cols-[1fr_minmax(280px,360px)] lg:items-end">
          <div>
            <p className="font-mono text-xs tracking-[0.18em] text-ink-3 uppercase">Plan du réseau</p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Choisis ta ligne.</h1>
            <p className="mt-3 max-w-2xl text-ink-2">
              Trois parcours indépendants. Chacun commence par les bases, sans prérequis : des leçons claires d&apos;abord,
              puis des incidents à réparer pour ancrer ce que tu as appris.
            </p>
          </div>
          {user && (
            <div className="rounded-2xl border border-line bg-raised/80 p-5 backdrop-blur">
              <XpMeter user={user} wide />
            </div>
          )}
        </header>

        {error && <p className="mt-12 rounded-xl border border-break/40 bg-break-soft p-5 text-sm text-ink">{error}</p>}

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {tracks
            ? tracks.map((t, i) => <TrackCard key={t.id} track={t} index={i} />)
            : [0, 1, 2].map((i) => <div key={i} className="h-[440px] animate-pulse rounded-3xl bg-raised" />)}
        </div>

        <aside className="mt-12 grid gap-4 rounded-2xl border border-dashed border-line-strong p-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <span className="grid size-11 place-items-center rounded-xl bg-raised text-ink-2">
            <Icon name="book" size={20} />
          </span>
          <p className="text-sm leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">La méthode :</span> dans chaque module, lis les leçons dans l&apos;ordre
            (avec leurs exemples à exécuter), puis attaque les incidents. Bloqué·e ? Chaque incident renvoie vers la
            leçon qui l&apos;explique.
          </p>
        </aside>
      </div>
    </div>
  );
}

function TrackCard({ track, index }: { track: TrackSummary; index: number }) {
  const style = trackStyle(track.id);
  const s = trackStats(track);
  const started = s.lessonsDone + s.solved > 0;

  return (
    <article
      style={{ ...accentVars(track.id), animationDelay: `${index * 90}ms` }}
      className="group relative flex animate-rise flex-col overflow-hidden rounded-3xl border border-line bg-raised transition hover:border-line-strong"
    >
      <div className="h-1.5" style={{ background: "var(--accent)" }} />
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <span className="grid size-12 place-items-center rounded-2xl" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
            <Icon name={style.icon} size={24} />
          </span>
          <span className="font-mono text-[0.68rem] tracking-[0.16em] text-ink-3 uppercase">
            Ligne {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h2 className="mt-6 font-display text-2xl leading-tight font-bold tracking-[-0.03em]">{track.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">{track.tagline}</p>

        {/* Mini-ligne de stations */}
        <ol className="mt-7 flex items-center" aria-label="Modules">
          {track.modules.map((m, i) => {
            const open = m.lessons.length + m.levels.length > 0;
            const done = open && m.lessonsDone === m.lessons.length && m.solvedCount === m.levels.length;
            return (
              <li key={m.id} className="flex flex-1 items-center last:flex-none" title={`${m.code} · ${m.title}`}>
                <span
                  className="grid size-6 shrink-0 place-items-center rounded-full border-2 font-mono text-[0.5rem] font-bold"
                  style={
                    done
                      ? { background: "var(--accent)", borderColor: "var(--accent)", color: "var(--bg)" }
                      : open
                        ? { borderColor: "var(--accent)", color: "var(--accent)" }
                        : { borderColor: "var(--line-strong)", color: "var(--ink-3)" }
                  }
                >
                  {done ? <Icon name="check" size={10} strokeWidth={3.5} /> : i}
                </span>
                {i < track.modules.length - 1 && (
                  <span className="h-0.5 flex-1" style={{ background: open ? "var(--accent)" : "var(--line)" }} />
                )}
              </li>
            );
          })}
        </ol>

        <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5 text-center">
          <Stat label="modules" value={track.modules.length} />
          <Stat label="leçons" value={s.lessons} />
          <Stat label="incidents" value={s.levels} />
        </dl>

        {started && (
          <div className="mt-5">
            <div className="flex justify-between font-mono text-[0.65rem] text-ink-3 uppercase">
              <span>Avancement</span>
              <span>{Math.round(s.ratio * 100)} %</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.ratio * 100}%`, background: "var(--accent)" }} />
            </div>
          </div>
        )}

        <div className="mt-auto flex gap-2 pt-7">
          {s.next && (
            <Link
              href={s.next.kind === "lesson" ? `/lecons/${s.next.id}` : `/niveau/${s.next.id}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-bg transition hover:brightness-110"
              style={{ background: "var(--accent)" }}
            >
              {started ? "Continuer" : "Commencer"}
              <Icon name="arrowRight" size={16} />
            </Link>
          )}
          <Link
            href={`/parcours/${track.id}`}
            className="flex items-center justify-center rounded-xl border border-line-strong px-4 py-3 text-sm transition hover:bg-hover"
          >
            Voir la ligne
          </Link>
        </div>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dd className="font-display text-2xl font-semibold tabular-nums">{value}</dd>
      <dt className="text-xs text-ink-3">{label}</dt>
    </div>
  );
}
