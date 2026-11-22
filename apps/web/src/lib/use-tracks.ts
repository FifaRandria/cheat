"use client";

import type { TrackSummary } from "@rustine/shared";
import { useEffect, useState } from "react";
import { api, ApiError } from "./api";
import { useSession } from "./session";

/** Charge les parcours (et l'avancement du joueur connecté). */
export function useTracks() {
  const { user, loading } = useSession();
  const [tracks, setTracks] = useState<TrackSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    api
      .tracks()
      .then(setTracks)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Erreur inattendue"));
  }, [loading, user?.id]);

  return { tracks, error };
}

/** Statistiques d'avancement d'un parcours. */
export function trackStats(t: TrackSummary) {
  const lessons = t.modules.flatMap((m) => m.lessons);
  const levels = t.modules.flatMap((m) => m.levels);
  const lessonsDone = lessons.filter((l) => l.completed).length;
  const solved = levels.filter((l) => l.status === "solved").length;
  const total = lessons.length + levels.length;
  return {
    lessons: lessons.length,
    lessonsDone,
    levels: levels.length,
    solved,
    ratio: total ? (lessonsDone + solved) / total : 0,
    openModules: t.modules.filter((m) => m.lessons.length + m.levels.length > 0).length,
    /** Prochaine étape conseillée : la première leçon non lue, sinon le premier niveau non résolu */
    next:
      (lessons.find((l) => !l.completed) && { kind: "lesson" as const, ...lessons.find((l) => !l.completed)! }) ||
      (levels.find((l) => l.status !== "solved") && { kind: "level" as const, ...levels.find((l) => l.status !== "solved")! }) ||
      null,
  };
}
