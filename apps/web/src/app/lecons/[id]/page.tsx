"use client";

import type { Badge, LessonDetail } from "@rustine/shared";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { SelfCheck } from "@/components/lesson/SelfCheck";
import { Markdown } from "@/components/Markdown";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";
import { accentVars, trackStyle } from "@/lib/tracks";

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading, setUser } = useSession();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [reward, setReward] = useState<{ xp: number; badges: Badge[] } | null>(null);

  useEffect(() => {
    if (loading) return;
    setLesson(null);
    setReward(null);
    api
      .lesson(id)
      .then((l) => {
        setLesson(l);
        document.title = `${l.title} · Rustine`;
        window.scrollTo({ top: 0 });
      })
      .catch((e) => setError(e instanceof ApiError ? e.message : "Erreur inattendue"));
  }, [id, loading, user?.id]);

  const complete = async () => {
    if (!lesson) return;
    setCompleting(true);
    try {
      const res = await api.completeLesson(lesson.id);
      setUser(res.user);
      setReward({ xp: res.xpGained, badges: res.newBadges });
      const mark = <T extends { id: string; completed: boolean }>(l: T): T => (l.id === lesson.id ? { ...l, completed: true } : l);
      setLesson({ ...lesson, completed: true, siblings: lesson.siblings.map(mark) });
    } finally {
      setCompleting(false);
    }
  };

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-break uppercase">Leçon introuvable</p>
        <p className="mt-3 text-ink-2">{error}</p>
        <Link href="/lecons" className="mt-6 inline-block text-fix hover:underline">
          Toutes les leçons
        </Link>
      </div>
    );
  }
  if (!lesson) return <LessonSkeleton />;

  const style = trackStyle(lesson.track.id);
  const position = lesson.siblings.findIndex((s) => s.id === lesson.id) + 1;

  return (
    <div style={accentVars(lesson.track.id)}>
      <ReadingProgress />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-8 pb-24 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_200px]">
        {/* Sommaire du module */}
        <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Leçons du module">
          <Link href={`/lecons?parcours=${lesson.track.id}`} className="flex items-center gap-1.5 text-sm text-ink-3 hover:text-ink">
            <Icon name="arrowLeft" size={15} /> Toutes les leçons
          </Link>
          <div className="mt-6 rounded-2xl border border-line bg-raised/60 p-4">
            <p className="flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.14em] uppercase" style={{ color: style.accent }}>
              <Icon name={style.icon} size={13} /> {lesson.module.code} · {style.short}
            </p>
            <p className="mt-1.5 font-display text-lg leading-tight font-semibold">{lesson.module.title}</p>
            <ol className="mt-4 space-y-0.5">
              {lesson.siblings.map((s, i) => {
                const current = s.id === lesson.id;
                return (
                  <li key={s.id}>
                    <Link
                      href={`/lecons/${s.id}`}
                      aria-current={current ? "page" : undefined}
                      className={`flex items-start gap-2.5 rounded-lg px-2 py-1.5 text-sm transition ${
                        current ? "bg-hover text-ink" : "text-ink-2 hover:bg-hover hover:text-ink"
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border font-mono text-[0.6rem] ${
                          s.completed ? "border-transparent text-bg" : current ? "border-ink text-ink" : "border-line-strong text-ink-3"
                        }`}
                        style={s.completed ? { background: style.accent } : undefined}
                      >
                        {s.completed ? <Icon name="check" size={11} strokeWidth={3} /> : i + 1}
                      </span>
                      <span className="leading-snug">{s.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
            {lesson.practice && (
              <Link
                href={`/niveau/${lesson.practice.id}`}
                className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-line-strong px-3 py-2.5 text-sm text-ink-2 transition hover:border-break hover:text-ink"
              >
                <Icon name="wrench" size={15} className="text-break" />
                <span className="flex-1">Passer à la pratique</span>
                <Icon name="arrowRight" size={14} />
              </Link>
            )}
          </div>
        </aside>

        {/* Article */}
        <article className="min-w-0">
          <header className="max-w-[68ch] animate-rise">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-ink-3">
              <span style={{ color: style.accent }}>
                Leçon {position}/{lesson.siblings.length}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Icon name="clock" size={13} /> {lesson.minutes} min
              </span>
              <span>·</span>
              <span>+{lesson.xp} XP</span>
              {lesson.completed && (
                <span className="flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: style.soft, color: style.accent }}>
                  <Icon name="check" size={11} strokeWidth={3} /> terminée
                </span>
              )}
            </p>
            <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.2rem)] leading-[1.02] font-bold tracking-[-0.04em] text-balance">
              {lesson.title}
            </h1>
            {lesson.summary && <p className="mt-4 text-lg leading-relaxed text-ink-2">{lesson.summary}</p>}
          </header>

          <div className="mt-10 max-w-[68ch]">
            <Markdown className="prose-lesson" runnable>
              {lesson.body}
            </Markdown>

            <SelfCheck questions={lesson.check} />

            {/* Fin de leçon */}
            <section className="mt-16 overflow-hidden rounded-2xl border border-line bg-raised" aria-label="Fin de la leçon">
              <div className="h-1" style={{ background: style.accent }} />
              <div className="p-6">
                {!user ? (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="text-ink-2">Connecte-toi pour enregistrer ta progression et gagner l&apos;XP de la leçon.</p>
                    <Link
                      href={`/connexion?suite=/lecons/${lesson.id}`}
                      className="rounded-lg px-4 py-2.5 text-sm font-semibold text-bg"
                      style={{ background: style.accent }}
                    >
                      Connexion
                    </Link>
                  </div>
                ) : !lesson.completed ? (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-display text-lg font-semibold">Tu as tout compris ?</p>
                      <p className="mt-0.5 text-sm text-ink-3">Marque la leçon comme terminée pour avancer.</p>
                    </div>
                    <button
                      type="button"
                      onClick={complete}
                      disabled={completing}
                      className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-bg transition hover:brightness-110 disabled:opacity-60"
                      style={{ background: style.accent }}
                    >
                      <Icon name="check" size={17} strokeWidth={2.5} />
                      J&apos;ai terminé · +{lesson.xp} XP
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="flex items-center gap-2 font-display text-lg font-semibold">
                      <Icon name="check" size={18} strokeWidth={2.5} style={{ color: style.accent }} />
                      Leçon terminée
                      {reward && reward.xp > 0 && (
                        <span className="animate-rise rounded-md px-2 py-0.5 font-mono text-sm text-bg" style={{ background: style.accent }}>
                          +{reward.xp} XP
                        </span>
                      )}
                    </p>
                    {reward?.badges.map((b) => (
                      <p key={b.slug} className="mt-2 flex animate-rise items-center gap-2 text-sm text-ink-2">
                        <Icon name={b.icon as IconName} size={15} className="text-warn" /> Nouvel insigne :{" "}
                        <span className="font-medium text-ink">{b.name}</span>
                      </p>
                    ))}
                  </div>
                )}

                <div className="mt-6 grid gap-3 border-t border-line pt-5 sm:grid-cols-2">
                  {lesson.next ? (
                    <NavCard href={`/lecons/${lesson.next.id}`} kicker="Leçon suivante" title={lesson.next.title} accent={style.accent} />
                  ) : (
                    <span />
                  )}
                  {lesson.practice && (
                    <NavCard
                      href={`/niveau/${lesson.practice.id}`}
                      kicker={lesson.next ? "Ou directement la pratique" : "Passer à la pratique"}
                      title={lesson.practice.title}
                      accent="var(--break)"
                      icon="wrench"
                    />
                  )}
                </div>
              </div>
            </section>

            {lesson.prev && (
              <Link href={`/lecons/${lesson.prev.id}`} className="mt-6 inline-flex items-center gap-1.5 text-sm text-ink-3 hover:text-ink">
                <Icon name="arrowLeft" size={14} /> {lesson.prev.title}
              </Link>
            )}
          </div>
        </article>

        <OnThisPage body={lesson.body} />
      </div>
    </div>
  );
}

function NavCard({ href, kicker, title, accent, icon = "arrowRight" }: { href: string; kicker: string; title: string; accent: string; icon?: IconName }) {
  return (
    <Link href={href} className="group flex items-center gap-3 rounded-xl border border-line p-4 transition hover:border-line-strong hover:bg-hover">
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[0.65rem] tracking-[0.14em] uppercase" style={{ color: accent }}>
          {kicker}
        </p>
        <p className="mt-1 truncate font-medium">{title}</p>
      </div>
      <Icon name={icon} size={17} className="text-ink-3 transition group-hover:translate-x-0.5 group-hover:text-ink" />
    </Link>
  );
}

/** Table des matières tirée des titres ## de la leçon. */
function OnThisPage({ body }: { body: string }) {
  const headings = [...body.matchAll(/^## (.+)$/gm)].map((m) => m[1] ?? "");
  if (headings.length < 3) return null;
  return (
    <nav className="hidden xl:sticky xl:top-24 xl:block xl:self-start" aria-label="Sur cette page">
      <p className="font-mono text-[0.65rem] tracking-[0.16em] text-ink-3 uppercase">Sur cette page</p>
      <ol className="mt-3 space-y-2 border-l border-line">
        {headings.map((h, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => document.querySelectorAll(".prose-lesson h2")[i]?.scrollIntoView({ behavior: "smooth" })}
              className="-ml-px border-l border-transparent pl-3 text-left text-[0.8rem] leading-snug text-ink-3 transition hover:border-[var(--accent)] hover:text-ink"
            >
              <span className="mr-1.5 font-mono text-[0.65rem]">{String(i + 1).padStart(2, "0")}</span>
              {h.replace(/[`*]/g, "")}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.5" aria-hidden="true">
      <div className="h-full origin-left" style={{ transform: `scaleX(${p})`, background: "var(--accent)" }} />
    </div>
  );
}

function LessonSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-8 sm:px-6 lg:grid-cols-[260px_1fr]" aria-busy="true">
      <div className="hidden h-80 animate-pulse rounded-2xl bg-raised lg:block" />
      <div className="space-y-4">
        <div className="h-4 w-40 animate-pulse rounded bg-raised" />
        <div className="h-12 w-3/4 animate-pulse rounded bg-raised" />
        <div className="h-64 animate-pulse rounded-xl bg-raised" />
      </div>
    </div>
  );
}
