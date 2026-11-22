"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Icon } from "@/components/Icon";
import { accentVars, trackStyle } from "@/lib/tracks";
import { trackStats, useTracks } from "@/lib/use-tracks";

export default function LessonsPage() {
  return (
    <Suspense>
      <Library />
    </Suspense>
  );
}

function Library() {
  const { tracks, error } = useTracks();
  const params = useSearchParams();
  const router = useRouter();
  const selected = params.get("parcours") ?? tracks?.[0]?.id ?? "web";
  const track = tracks?.find((t) => t.id === selected) ?? tracks?.[0];
  const style = trackStyle(track?.id ?? "web");

  return (
    <div className="relative" style={accentVars(track?.id ?? "web")}>
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-24 sm:px-6">
        <header className="max-w-2xl">
          <p className="font-mono text-xs tracking-[0.18em] text-ink-3 uppercase">Le manuel d&apos;atelier</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Leçons</h1>
          <p className="mt-3 leading-relaxed text-ink-2">
            On ne répare bien que ce qu&apos;on comprend. Des leçons courtes, des exemples à exécuter et à modifier
            directement dans la page, et un petit quiz pour vérifier que c&apos;est acquis.
          </p>
        </header>

        {/* Onglets de parcours */}
        <div className="mt-10 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Parcours">
          {(tracks ?? []).map((t) => {
            const st = trackStyle(t.id);
            const active = t.id === track?.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => router.replace(`/lecons?parcours=${t.id}`, { scroll: false })}
                className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition ${
                  active ? "border-transparent font-semibold text-bg" : "border-line text-ink-2 hover:border-line-strong hover:text-ink"
                }`}
                style={active ? { background: st.accent } : undefined}
              >
                <Icon name={st.icon} size={16} />
                {t.title}
              </button>
            );
          })}
        </div>

        {error && <p className="mt-8 text-break">{error}</p>}
        {!tracks && !error && <div className="mt-8 h-96 animate-pulse rounded-2xl bg-raised" />}

        {track && (
          <>
            {(() => {
              const s = trackStats(track);
              const nextLesson = track.modules.flatMap((m) => m.lessons).find((l) => !l.completed);
              return (
                nextLesson && (
                  <Link
                    href={`/lecons/${nextLesson.id}`}
                    className="group mt-8 flex items-center gap-4 rounded-2xl border p-5 transition hover:brightness-110"
                    style={{ borderColor: "color-mix(in srgb, var(--accent) 40%, transparent)", background: "var(--accent-soft)" }}
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl text-bg" style={{ background: "var(--accent)" }}>
                      <Icon name="book" size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[0.65rem] tracking-[0.14em] uppercase" style={{ color: "var(--accent)" }}>
                        {s.lessonsDone === 0 ? "Commencer ici" : "Reprendre"}
                      </span>
                      <span className="mt-0.5 block truncate font-display text-lg font-semibold">{nextLesson.title}</span>
                    </span>
                    <Icon name="arrowRight" size={20} className="shrink-0 transition group-hover:translate-x-1" style={{ color: "var(--accent)" }} />
                  </Link>
                )
              );
            })()}

            <div className="mt-10 space-y-12">
              {track.modules.map((m) => (
                <section key={m.id} aria-labelledby={`mod-${m.id}`}>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line pb-3">
                    <span className="font-mono text-xs font-bold" style={{ color: m.lessons.length ? style.accent : "var(--ink-3)" }}>
                      {m.code}
                    </span>
                    <h2 id={`mod-${m.id}`} className={`font-display text-xl font-semibold tracking-tight ${m.lessons.length ? "" : "text-ink-3"}`}>
                      {m.title}
                    </h2>
                    {m.lessons.length > 0 ? (
                      <span className="ml-auto font-mono text-xs text-ink-3">
                        {m.lessonsDone}/{m.lessons.length} lues
                      </span>
                    ) : (
                      <span className="ml-auto font-mono text-[0.65rem] tracking-[0.12em] text-ink-3 uppercase">
                        en rédaction · {m.phase}
                      </span>
                    )}
                  </div>

                  {m.lessons.length > 0 && (
                    <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {m.lessons.map((l, i) => (
                        <li key={l.id}>
                          <Link
                            href={`/lecons/${l.id}`}
                            className="group flex h-full flex-col rounded-2xl border border-line bg-raised/60 p-5 transition hover:-translate-y-0.5 hover:border-line-strong hover:bg-hover"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-display text-3xl font-bold tracking-tight text-ink-3/50 tabular-nums">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              {l.completed ? (
                                <span className="flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[0.62rem] uppercase" style={{ background: style.soft, color: style.accent }}>
                                  <Icon name="check" size={11} strokeWidth={3} /> lue
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 font-mono text-xs text-ink-3">
                                  <Icon name="clock" size={12} /> {l.minutes} min
                                </span>
                              )}
                            </div>
                            <h3 className="mt-3 font-display text-lg leading-snug font-semibold">{l.title}</h3>
                            <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-ink-3">{l.summary}</p>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  )}
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
