"use client";

import type { ReviewItem, ReviewResponse } from "@rustine/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { BlackoutTag, Severity } from "@/components/Signals";
import { api, ApiError } from "@/lib/api";
import { bugTypeLabel, incidentCode, plural, relativeTime } from "@/lib/format";
import { useSession } from "@/lib/session";
import { trackStyle } from "@/lib/tracks";

/** Nombre de boîtes avant de considérer un piège comme maîtrisé (révisions à 1, 3, 7, 14, 30 jours). */
const MASTERY = 5;

export default function RevisionPage() {
  const { user, loading } = useSession();
  const router = useRouter();
  const [data, setData] = useState<ReviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/connexion?suite=/revision");
      return;
    }
    api
      .review()
      .then(setData)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Erreur inattendue"));
  }, [user, loading, router]);

  const nextUp = data?.upcoming[0];

  return (
    <div className="relative">
      <div className="bg-blueprint pointer-events-none absolute inset-x-0 top-0 h-80 opacity-50" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-24 sm:px-6">
        <header className="max-w-2xl">
          <p className="font-mono text-xs tracking-[0.18em] text-ink-3 uppercase">Musée de bugs</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Révision</h1>
          <p className="mt-3 leading-relaxed text-ink-2">
            Chaque piège dans lequel tu es tombé·e est exposé ici. Il revient au bon moment : le lendemain, puis
            3 jours, 7 jours, 14 jours, un mois plus tard. À chaque révision réussie, il s&apos;espace un peu plus,
            jusqu&apos;à devenir un réflexe.
          </p>
        </header>

        {error && <p className="mt-10 rounded-xl border border-break/40 bg-break-soft p-5 text-sm">{error}</p>}
        {!data && !error && <div className="mt-12 h-72 animate-pulse rounded-3xl bg-raised" />}

        {data && data.due.length + data.upcoming.length === 0 && (
          <div className="mt-12 rounded-3xl border border-dashed border-line-strong p-10 text-center">
            <Icon name="bug" size={28} className="mx-auto text-ink-3" />
            <p className="mt-4 font-display text-xl font-semibold">Vitrine vide.</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-3">
              Chaque test rouge y laissera une pièce. C&apos;est normal, et c&apos;est le but : on apprend surtout de ses
              erreurs.
            </p>
            <Link href="/parcours" className="mt-6 inline-flex items-center gap-2 text-fix hover:underline">
              Aller casser des choses <Icon name="arrowRight" size={15} />
            </Link>
          </div>
        )}

        {data && data.due.length + data.upcoming.length > 0 && (
          <>
            <section className="mt-12" aria-labelledby="due-title">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 id="due-title" className="flex items-center gap-3 font-display text-2xl font-semibold tracking-tight">
                  À revoir aujourd&apos;hui
                  {data.due.length > 0 && (
                    <span className="rounded-full bg-break px-2.5 py-0.5 font-mono text-sm text-break-ink">{data.due.length}</span>
                  )}
                </h2>
                {data.due.length > 0 && (
                  <p className="font-mono text-xs text-ink-3">+{data.reviewXp} XP par révision réussie</p>
                )}
              </div>

              {data.due.length === 0 ? (
                <div className="mt-5 flex items-center gap-4 rounded-2xl border border-fix/30 bg-fix-soft p-5">
                  <Icon name="check" size={22} strokeWidth={2.5} className="shrink-0 text-fix" />
                  <p className="text-sm text-ink">
                    Rien à revoir pour aujourd&apos;hui.
                    {nextUp && (
                      <span className="text-ink-2">
                        {" "}
                        Prochaine révision : <span className="font-medium text-ink">{nextUp.level.title}</span>,{" "}
                        {relativeTime(nextUp.nextReviewAt)}.
                      </span>
                    )}
                  </p>
                </div>
              ) : (
                <ul className="mt-5 grid gap-4 md:grid-cols-2">
                  {data.due.map((item, i) => (
                    <DueCard key={item.level.id} item={item} index={i} />
                  ))}
                </ul>
              )}
            </section>

            <FamilySummary items={[...data.due, ...data.upcoming]} />

            {data.upcoming.length > 0 && (
              <section className="mt-14" aria-labelledby="upcoming-title">
                <h2 id="upcoming-title" className="font-display text-xl font-semibold tracking-tight">
                  En consolidation
                </h2>
                <p className="mt-1 text-sm text-ink-3">Réparés, et qui reviendront à leur date.</p>
                <ul className="mt-5 divide-y divide-line overflow-hidden rounded-2xl border border-line">
                  {data.upcoming.map((item) => (
                    <li key={item.level.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-raised/40 px-5 py-3.5">
                      <span className="font-mono text-xs text-ink-3">{incidentCode(item.level.moduleCode, item.level.order)}</span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.level.title}</span>
                      <span className="text-xs text-ink-3">{bugTypeLabel(item.bugType)}</span>
                      <Mastery box={item.box} />
                      <span className="w-28 text-right font-mono text-xs text-ink-2">{relativeTime(item.nextReviewAt)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Le musée rangé par famille de bug : un même piège rencontré en JavaScript et en Python
 * apparaît ensemble. C'est la famille qu'on apprend à reconnaître, pas le langage.
 */
function FamilySummary({ items }: { items: ReviewItem[] }) {
  const families = new Map<string, { count: number; mastery: number; tracks: Set<string> }>();
  for (const item of items) {
    const f = families.get(item.bugType) ?? { count: 0, mastery: 0, tracks: new Set<string>() };
    f.count += 1;
    f.mastery += Math.min(item.box, MASTERY);
    f.tracks.add(item.level.trackId);
    families.set(item.bugType, f);
  }
  const rows = [...families.entries()].sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]));
  if (rows.length < 2) return null;

  return (
    <section className="mt-14" aria-labelledby="families-title">
      <h2 id="families-title" className="font-display text-xl font-semibold tracking-tight">
        Par famille
      </h2>
      <p className="mt-1 text-sm text-ink-3">
        Les mêmes pièges reviennent dans tous les langages. Reconnaître la famille, c&apos;est déjà la moitié du
        diagnostic.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(([type, f]) => (
          <li key={type} className="flex items-center gap-3 rounded-xl border border-line bg-raised/40 px-4 py-3">
            <span className="flex shrink-0 gap-1">
              {[...f.tracks].map((t) => {
                const style = trackStyle(t);
                return <Icon key={t} name={style.icon} size={14} style={{ color: style.accent }} />;
              })}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{bugTypeLabel(type)}</span>
            <span className="font-mono text-xs text-ink-3">{plural(f.count, "pièce", "pièces")}</span>
            <Mastery box={Math.round(f.mastery / f.count)} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Une pièce de musée : le bug, sa plaque descriptive et le bouton pour le rejouer. */
function DueCard({ item, index }: { item: ReviewItem; index: number }) {
  const style = trackStyle(item.level.trackId);
  const neverFixed = item.box === 0;

  return (
    <li className="animate-rise" style={{ animationDelay: `${index * 70}ms` }}>
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-raised">
        <div className="hazard hazard-animated h-1 opacity-90" aria-hidden="true" />
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 font-mono text-xs text-ink-3">
              <Icon name={style.icon} size={13} style={{ color: style.accent }} />
              {incidentCode(item.level.moduleCode, item.level.order)}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 font-mono text-[0.62rem] font-semibold tracking-[0.12em] uppercase ${
                neverFixed ? "bg-break-soft text-break" : "bg-warn-soft text-warn"
              }`}
            >
              {neverFixed ? "Toujours cassé" : "Révision due"}
            </span>
          </div>

          <h3 className="mt-3 font-display text-lg leading-snug font-semibold">{item.level.title}</h3>

          {/* Plaque du musée */}
          <dl className="mt-4 grid grid-cols-3 gap-3 rounded-xl border border-dashed border-line-strong bg-sunken/60 p-3 text-xs">
            <div>
              <dt className="text-ink-3">Famille</dt>
              <dd className="mt-0.5 font-medium text-ink">{bugTypeLabel(item.bugType)}</dd>
            </div>
            <div>
              <dt className="text-ink-3">Chutes</dt>
              <dd className="mt-0.5 font-medium text-ink">{plural(item.occurrences, "fois", "fois")}</dd>
            </div>
            <div>
              <dt className="text-ink-3">Maîtrise</dt>
              <dd className="mt-1.5">
                <Mastery box={item.box} />
              </dd>
            </div>
          </dl>

          <div className="mt-auto flex items-center justify-between gap-3 pt-5">
            <span className="flex items-center gap-2.5">
              <Severity level={item.level.difficulty} />
              {item.level.blackout && <BlackoutTag />}
            </span>
            <Link
              href={`/niveau/${item.level.id}?revision=1`}
              className="inline-flex items-center gap-2 rounded-lg bg-fix px-3.5 py-2 text-sm font-semibold text-fix-ink transition hover:brightness-110"
            >
              <Icon name="reset" size={14} />
              {neverFixed ? "Réparer" : "Rejouer"}
            </Link>
          </div>
        </div>
      </article>
    </li>
  );
}

function Mastery({ box }: { box: number }) {
  return (
    <span className="inline-flex gap-1" title={`Boîte ${box} sur ${MASTERY}`} aria-label={`Maîtrise ${Math.min(box, MASTERY)} sur ${MASTERY}`}>
      {Array.from({ length: MASTERY }, (_, i) => (
        <span key={i} className={`size-1.5 rounded-full ${i < box ? "bg-fix" : "bg-line-strong"}`} />
      ))}
    </span>
  );
}
