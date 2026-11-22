"use client";

import type { ModuleSummary } from "@rustine/shared";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { LevelTicket } from "@/components/LevelTicket";
import { XpMeter } from "@/components/XpMeter";
import { api, ApiError } from "@/lib/api";
import { plural } from "@/lib/format";
import { useSession } from "@/lib/session";

export default function ParcoursPage() {
  const { user } = useSession();
  const [modules, setModules] = useState<ModuleSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .modules()
      .then(setModules)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Erreur inattendue"));
  }, [user?.id]);

  const levels = modules?.flatMap((m) => m.levels) ?? [];
  const solved = levels.filter((l) => l.status === "solved").length;
  const nextUp = levels.find((l) => l.status !== "solved");

  return (
    <div className="relative">
      <div className="bg-blueprint pointer-events-none absolute inset-x-0 top-0 h-80 opacity-50" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-24 sm:px-6">
        {/* En-tête : tableau d'astreinte */}
        <header className="grid gap-8 lg:grid-cols-[1fr_minmax(280px,360px)] lg:items-end">
          <div>
            <p className="font-mono text-xs tracking-[0.18em] text-ink-3 uppercase">Tableau d&apos;astreinte</p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Le parcours</h1>
            <p className="mt-3 max-w-xl text-ink-2">
              Chaque station est un module, chaque ticket un incident réel à remettre au vert. Les stations grisées
              sont en chantier.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-raised/80 p-5 backdrop-blur">
            {user ? (
              <>
                <XpMeter user={user} wide />
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-ink-2">
                    <span className="font-semibold text-ink">{solved}</span> / {levels.length} incidents réparés
                  </span>
                  {nextUp && (
                    <Link
                      href={`/niveau/${nextUp.id}`}
                      className="inline-flex items-center gap-1 font-medium text-fix hover:underline"
                    >
                      Continuer <Icon name="arrowRight" size={14} />
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-ink-2">Connecte-toi pour suivre ta progression et gagner de l&apos;XP.</p>
                <Link
                  href="/inscription"
                  className="shrink-0 rounded-lg bg-fix px-3 py-2 text-sm font-semibold text-fix-ink hover:brightness-110"
                >
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </div>
        </header>

        {error && (
          <div className="mt-12 rounded-xl border border-break/40 bg-break-soft p-5 text-sm">
            <p className="font-semibold text-break">Impossible de charger le parcours</p>
            <p className="mt-1 text-ink-2">{error}</p>
          </div>
        )}

        {!modules && !error && <TrackSkeleton />}

        {modules && (
          <ol className="relative mt-16">
            {/* La ligne */}
            <span
              className="absolute top-3 bottom-3 left-[19px] w-0.5 bg-gradient-to-b from-fix via-line-strong to-line sm:left-[23px]"
              aria-hidden="true"
            />
            {modules.map((m) => (
              <ModuleStation key={m.id} module={m} />
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

function ModuleStation({ module: m }: { module: ModuleSummary }) {
  const open = m.levels.length > 0;
  const complete = open && m.solvedCount === m.levels.length;

  return (
    <li className={`relative pb-12 pl-14 sm:pl-20 ${open ? "" : "pb-6"}`}>
      {/* Station */}
      <span
        className={`absolute top-0 left-0 grid size-10 place-items-center rounded-full border-2 font-mono text-[0.68rem] font-bold sm:size-12 sm:text-xs ${
          complete
            ? "border-fix bg-fix text-fix-ink"
            : open
              ? "border-fix bg-bg text-fix"
              : "border-line-strong bg-bg text-ink-3"
        }`}
      >
        {complete ? <Icon name="check" size={18} strokeWidth={3} /> : m.code}
      </span>

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-1.5 sm:pt-2.5">
        <h2 className={`font-display text-xl font-semibold tracking-tight sm:text-2xl ${open ? "" : "text-ink-2"}`}>
          {m.title}
        </h2>
        {open ? (
          <span className="font-mono text-xs text-ink-3">
            {m.solvedCount}/{plural(m.levels.length, "incident", "incidents")}
          </span>
        ) : (
          <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[0.6rem] tracking-[0.14em] text-ink-3 uppercase">
            Chantier {m.phase}
          </span>
        )}
      </div>
      <p className={`mt-1 text-sm ${open ? "text-ink-2" : "text-ink-3"}`}>{m.tagline}</p>

      {open ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {m.levels.map((l) => (
            <LevelTicket key={l.id} level={l} moduleCode={m.code} />
          ))}
        </div>
      ) : (
        <ul className="mt-2.5 flex flex-wrap gap-1.5" aria-label="Notions">
          {m.notions.map((n) => (
            <li key={n} className="rounded-md bg-raised px-2 py-0.5 text-xs text-ink-3">
              {n}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function TrackSkeleton() {
  return (
    <div className="mt-16 space-y-10" aria-busy="true" aria-label="Chargement du parcours">
      {[0, 1].map((i) => (
        <div key={i} className="pl-20">
          <div className="h-6 w-48 animate-pulse rounded bg-raised" />
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((j) => (
              <div key={j} className="h-40 animate-pulse rounded-xl bg-raised" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
