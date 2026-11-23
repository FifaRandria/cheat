"use client";

import type { ProfileResponse } from "@rustine/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { Avatar } from "@/components/SiteHeader";
import { XpMeter } from "@/components/XpMeter";
import { api, ApiError } from "@/lib/api";
import { bugTypeLabel, plural, rankTitle, relativeTime } from "@/lib/format";
import { useSession } from "@/lib/session";

export default function ProfilePage() {
  const { user, loading, setUser } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/connexion?suite=/profil");
      return;
    }
    api
      .profile()
      .then(setProfile)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Erreur inattendue"));
  }, [user, loading, router]);

  if (error) return <p className="mx-auto max-w-5xl px-4 py-16 text-break">{error}</p>;
  if (!profile) return <ProfileSkeleton />;

  const { user: u, stats, badges, museum, recent } = profile;
  const earned = badges.filter((b) => b.earnedAt).length;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 pb-24 sm:px-6">
      {/* Fiche de l'agent */}
      <header className="relative overflow-hidden rounded-3xl border border-line bg-raised">
        <div className="hazard h-1.5 opacity-80" aria-hidden="true" />
        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[auto_1fr_minmax(260px,340px)] md:items-center">
          <Avatar name={u.displayName} url={u.avatarUrl} size={88} />
          <div>
            <p className="font-mono text-xs tracking-[0.18em] text-ink-3 uppercase">Dossier de l&apos;agent</p>
            <h1 className="mt-1.5 font-display text-4xl font-bold tracking-[-0.04em]">{u.displayName}</h1>
            <p className="mt-1 text-ink-2">
              Rang {u.rank} · <span className="text-fix">{rankTitle(u.rank)}</span>
            </p>
          </div>
          <div className="space-y-4">
            <XpMeter user={u} wide />
            <div className="flex items-center gap-2 text-sm text-ink-2">
              <Icon name="flame" size={16} className={u.streak > 0 ? "text-warn" : "text-ink-3"} />
              Série de <span className="font-semibold text-ink">{plural(u.streak, "jour", "jours")}</span>
              <span className="text-ink-3">· record {u.bestStreak}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Compteurs */}
      <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="XP totale" value={u.xp} accent />
        <Stat label="Leçons terminées" value={stats.lessonsDone} />
        <Stat label="Incidents réparés" value={stats.solved} />
        <Stat label="Tentatives" value={stats.attempts} />
        <Stat label="Résolus en Blackout" value={stats.blackoutSolved} />
      </dl>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* Badges */}
        <section aria-labelledby="badges-title">
          <SectionTitle id="badges-title" meta={`${earned}/${badges.length}`}>
            Insignes
          </SectionTitle>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {badges.map((b) => {
              const has = Boolean(b.earnedAt);
              return (
                <li
                  key={b.slug}
                  className={`flex gap-3.5 rounded-xl border p-4 ${has ? "border-line-strong bg-raised" : "border-dashed border-line"}`}
                >
                  <span
                    className={`grid size-11 shrink-0 place-items-center rounded-xl ${
                      has ? "bg-warn-soft text-warn" : "bg-sunken text-ink-3/60"
                    }`}
                  >
                    <Icon name={has ? (b.icon as IconName) : "lock"} size={20} />
                  </span>
                  <div className="min-w-0">
                    <p className={`font-medium ${has ? "" : "text-ink-3"}`}>{b.name}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-3">{b.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="space-y-10">
          {/* Musée de bugs */}
          <section aria-labelledby="museum-title">
            <SectionTitle id="museum-title" meta={museum.length ? String(museum.length) : undefined}>
              Musée de bugs
            </SectionTitle>
            <p className="mt-2 text-sm text-ink-3">
              Les pièges dans lesquels tu es tombé·e. Ils reviendront, de plus en plus espacés, jusqu&apos;à devenir des
              réflexes.{" "}
              {museum.length > 0 && (
                <Link href="/revision" className="text-fix hover:underline">
                  Ouvrir la révision →
                </Link>
              )}
            </p>
            {museum.length === 0 ? (
              <p className="mt-4 rounded-xl border border-dashed border-line p-5 text-sm text-ink-3">
                Vitrine vide pour l&apos;instant. Chaque test rouge y laissera une trace.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-line rounded-xl border border-line">
                {museum.map((m) => {
                  const due = new Date(m.nextReviewAt).getTime() <= Date.now();
                  return (
                    <li key={m.levelId}>
                      <Link href={`/niveau/${m.levelId}`} className="flex items-center gap-3 px-4 py-3 hover:bg-raised">
                        <Icon name="bug" size={16} className="shrink-0 text-break" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{m.levelTitle}</p>
                          <p className="text-xs text-ink-3">
                            {bugTypeLabel(m.bugType)} · ×{m.occurrences}
                          </p>
                        </div>
                        <span className={`shrink-0 font-mono text-xs ${due ? "text-warn" : "text-ink-3"}`}>
                          {due ? "à revoir" : relativeTime(m.nextReviewAt)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Journal */}
          <section aria-labelledby="log-title">
            <SectionTitle id="log-title">Journal d&apos;astreinte</SectionTitle>
            {recent.length === 0 ? (
              <p className="mt-4 text-sm text-ink-3">Aucune intervention pour l&apos;instant.</p>
            ) : (
              <ol className="mt-4 space-y-0 font-mono text-xs">
                {recent.map((r, i) => (
                  <li key={i} className="flex items-center gap-3 border-l border-line py-1.5 pl-4">
                    <span className={`-ml-[21px] size-2.5 rounded-full ${r.passed ? "bg-fix" : "bg-break"}`} />
                    <span className="w-24 shrink-0 text-ink-3">{relativeTime(r.createdAt)}</span>
                    <span className={`truncate ${r.passed ? "text-ink" : "text-ink-2"}`}>{r.levelTitle}</span>
                    <span className={`ml-auto ${r.passed ? "text-fix" : "text-break"}`}>{r.passed ? "vert" : "rouge"}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </div>

      <DangerZone
        onDeleted={() => {
          setUser(null);
          router.push("/");
        }}
      />
    </div>
  );
}

function DangerZone({ onDeleted }: { onDeleted: () => void }) {
  const [step, setStep] = useState<"idle" | "confirm" | "busy">("idle");
  return (
    <section className="mt-16 rounded-2xl border border-break/30 p-6" aria-labelledby="danger-title">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="danger-title" className="font-display text-lg font-semibold">
            Supprimer mon compte
          </h2>
          <p className="mt-1 text-sm text-ink-3">
            Efface définitivement ton compte, ta progression, tes tentatives et ton musée de bugs.
          </p>
        </div>
        {step === "idle" ? (
          <button
            type="button"
            onClick={() => setStep("confirm")}
            className="rounded-lg border border-break/50 px-4 py-2 text-sm text-break hover:bg-break-soft"
          >
            Supprimer…
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setStep("idle")} className="px-3 py-2 text-sm text-ink-3">
              Annuler
            </button>
            <button
              type="button"
              disabled={step === "busy"}
              onClick={async () => {
                setStep("busy");
                await api.deleteAccount();
                onDeleted();
              }}
              className="flex items-center gap-2 rounded-lg bg-break px-4 py-2 text-sm font-semibold text-break-ink disabled:opacity-60"
            >
              <Icon name="trash" size={15} /> Oui, tout effacer
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-line bg-raised/60 px-5 py-4">
      <dt className="text-xs text-ink-3">{label}</dt>
      <dd className={`mt-1 font-display text-3xl font-semibold tracking-tight tabular-nums ${accent ? "text-fix" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

function SectionTitle({ id, children, meta }: { id: string; children: React.ReactNode; meta?: string }) {
  return (
    <h2 id={id} className="flex items-baseline gap-3 font-display text-xl font-semibold tracking-tight">
      {children}
      {meta && <span className="font-mono text-xs font-normal text-ink-3">{meta}</span>}
    </h2>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 pt-12 sm:px-6" aria-busy="true">
      <div className="h-44 animate-pulse rounded-3xl bg-raised" />
      <div className="grid grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-raised" />
        ))}
      </div>
    </div>
  );
}
