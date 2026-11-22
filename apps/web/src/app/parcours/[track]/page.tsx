"use client";

import type { ModuleSummary } from "@rustine/shared";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Icon } from "@/components/Icon";
import { LevelTicket } from "@/components/LevelTicket";
import { plural } from "@/lib/format";
import { accentVars, trackStyle } from "@/lib/tracks";
import { trackStats, useTracks } from "@/lib/use-tracks";

export default function TrackPage() {
  const { track: trackId } = useParams<{ track: string }>();
  const { tracks, error } = useTracks();
  const track = tracks?.find((t) => t.id === trackId);
  const style = trackStyle(trackId);

  if (error) return <p className="mx-auto max-w-6xl px-4 py-16 text-break">{error}</p>;
  if (tracks && !track) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-ink-2">Ce parcours n&apos;existe pas.</p>
        <Link href="/parcours" className="mt-4 inline-block text-fix hover:underline">
          Voir les parcours
        </Link>
      </div>
    );
  }

  const s = track ? trackStats(track) : null;

  return (
    <div className="relative" style={accentVars(trackId)}>
      <div className="bg-blueprint pointer-events-none absolute inset-x-0 top-0 h-80 opacity-50" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 pt-10 pb-24 sm:px-6">
        <Link href="/parcours" className="inline-flex items-center gap-1.5 text-sm text-ink-3 hover:text-ink">
          <Icon name="arrowLeft" size={15} /> Tous les parcours
        </Link>

        <header className="mt-6 grid gap-8 lg:grid-cols-[1fr_minmax(260px,320px)] lg:items-end">
          <div>
            <p className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] uppercase" style={{ color: style.accent }}>
              <Icon name={style.icon} size={14} /> Parcours
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
              {track?.title ?? <span className="inline-block h-12 w-96 animate-pulse rounded bg-raised" />}
            </h1>
            {track && <p className="mt-4 max-w-2xl leading-relaxed text-ink-2">{track.description}</p>}
          </div>
          {s && (
            <dl className="grid grid-cols-2 gap-3">
              <MiniStat label="leçons lues" value={`${s.lessonsDone}/${s.lessons}`} />
              <MiniStat label="incidents réparés" value={`${s.solved}/${s.levels}`} />
            </dl>
          )}
        </header>

        {track && (
          <ol className="relative mt-14">
            <span
              className="absolute top-3 bottom-3 left-[19px] w-0.5 sm:left-[23px]"
              style={{ background: "linear-gradient(to bottom, var(--accent), var(--line-strong) 40%, var(--line))" }}
              aria-hidden="true"
            />
            {track.modules.map((m) => (
              <Station key={m.id} module={m} />
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

function Station({ module: m }: { module: ModuleSummary }) {
  const open = m.lessons.length + m.levels.length > 0;
  const complete = open && m.lessonsDone === m.lessons.length && m.solvedCount === m.levels.length;

  return (
    <li className={`relative pl-14 sm:pl-20 ${open ? "pb-14" : "pb-7"}`}>
      <span
        className="absolute top-0 left-0 grid size-10 place-items-center rounded-full border-2 bg-bg font-mono text-[0.62rem] font-bold sm:size-12 sm:text-[0.7rem]"
        style={
          complete
            ? { background: "var(--accent)", borderColor: "var(--accent)", color: "var(--bg)" }
            : open
              ? { borderColor: "var(--accent)", color: "var(--accent)" }
              : { borderColor: "var(--line-strong)", color: "var(--ink-3)" }
        }
      >
        {complete ? <Icon name="check" size={18} strokeWidth={3} /> : m.code}
      </span>

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-1.5 sm:pt-2.5">
        <h2 className={`font-display text-xl font-semibold tracking-tight sm:text-2xl ${open ? "" : "text-ink-2"}`}>{m.title}</h2>
        {!open && (
          <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[0.6rem] tracking-[0.14em] text-ink-3 uppercase">
            Chantier {m.phase}
          </span>
        )}
      </div>
      <p className={`mt-1 text-sm ${open ? "text-ink-2" : "text-ink-3"}`}>{m.tagline}</p>

      {!open ? (
        <ul className="mt-2.5 flex flex-wrap gap-1.5" aria-label="Notions">
          {m.notions.map((n) => (
            <li key={n} className="rounded-md bg-raised px-2 py-0.5 text-xs text-ink-3">
              {n}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          {m.lessons.length > 0 && (
            <section aria-label={`Leçons de ${m.title}`}>
              <h3 className="mb-3 flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.16em] text-ink-3 uppercase">
                <span className="grid size-5 place-items-center rounded font-sans text-[0.65rem] font-bold text-bg" style={{ background: "var(--accent)" }}>
                  1
                </span>
                Apprendre · {m.lessonsDone}/{plural(m.lessons.length, "leçon", "leçons")}
              </h3>
              <ol className="overflow-hidden rounded-2xl border border-line bg-raised/60">
                {m.lessons.map((l, i) => (
                  <li key={l.id} className="border-b border-line last:border-b-0">
                    <Link href={`/lecons/${l.id}`} className="group flex items-center gap-3 px-4 py-3 transition hover:bg-hover">
                      <span
                        className="grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[0.62rem]"
                        style={
                          l.completed
                            ? { background: "var(--accent)", borderColor: "var(--accent)", color: "var(--bg)" }
                            : { borderColor: "var(--line-strong)", color: "var(--ink-3)" }
                        }
                      >
                        {l.completed ? <Icon name="check" size={12} strokeWidth={3} /> : i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate text-[0.93rem] ${l.completed ? "text-ink-2" : "text-ink"}`}>{l.title}</span>
                      </span>
                      <span className="shrink-0 font-mono text-xs text-ink-3">{l.minutes} min</span>
                      <Icon name="arrowRight" size={14} className="shrink-0 text-ink-3 opacity-0 transition group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {m.levels.length > 0 && (
            <section aria-label={`Incidents de ${m.title}`}>
              <h3 className="mb-3 flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.16em] text-ink-3 uppercase">
                <span className="grid size-5 place-items-center rounded bg-break font-sans text-[0.65rem] font-bold text-break-ink">
                  {m.lessons.length > 0 ? 2 : 1}
                </span>
                Réparer · {m.solvedCount}/{plural(m.levels.length, "incident", "incidents")}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {m.levels.map((l) => (
                  <LevelTicket key={l.id} level={l} moduleCode={m.code} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </li>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-raised/80 px-4 py-3 backdrop-blur">
      <dd className="font-display text-2xl font-semibold tabular-nums">{value}</dd>
      <dt className="text-xs text-ink-3">{label}</dt>
    </div>
  );
}
