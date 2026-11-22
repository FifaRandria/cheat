"use client";

import type { LevelDetail } from "@rustine/shared";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { Workspace } from "@/components/workspace/Workspace";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";

export default function LevelPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useSession();
  const [level, setLevel] = useState<LevelDetail | null>(null);
  const [error, setError] = useState<{ status: number; message: string } | null>(null);

  useEffect(() => {
    if (loading) return;
    setLevel(null);
    setError(null);
    api
      .level(id)
      .then((l) => {
        setLevel(l);
        document.title = `${l.title} · Rustine`;
      })
      .catch((e) =>
        setError(e instanceof ApiError ? { status: e.status, message: e.message } : { status: 0, message: "Erreur" }),
      );
    // On recharge quand la session change : le brouillon et les indices dépendent du joueur.
  }, [id, loading, user?.id]);

  if (error) {
    return (
      <div className="mx-auto grid min-h-[60dvh] max-w-md place-items-center px-4 text-center">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-break uppercase">
            {error.status === 404 ? "404 · incident introuvable" : "Panne de liaison"}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
            {error.status === 404 ? "Ce ticket n'existe pas." : "Le dossier n'a pas pu être ouvert."}
          </h1>
          <p className="mt-3 text-ink-2">{error.message}</p>
          <Link href="/parcours" className="mt-6 inline-flex items-center gap-2 text-fix hover:underline">
            <Icon name="arrowLeft" size={16} /> Retour au parcours
          </Link>
        </div>
      </div>
    );
  }

  if (!level) return <WorkspaceSkeleton />;
  // La clé force un état neuf quand on passe d'un niveau à l'autre.
  return <Workspace key={`${level.id}:${user?.id ?? "anon"}`} initial={level} />;
}

function WorkspaceSkeleton() {
  return (
    <div className="grid h-[calc(100dvh-4rem)] lg:grid-cols-[minmax(320px,420px)_1fr]" aria-busy="true">
      <div className="space-y-4 border-r border-line p-5">
        <div className="h-4 w-24 animate-pulse rounded bg-raised" />
        <div className="h-8 w-3/4 animate-pulse rounded bg-raised" />
        <div className="h-40 animate-pulse rounded bg-raised" />
      </div>
      <div className="hidden animate-pulse bg-sunken lg:block" />
    </div>
  );
}
