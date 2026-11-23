import type { LevelSummary, ProfileResponse, ReviewItem, ReviewResponse } from "@rustine/shared";
import { Router } from "express";
import { closeSession, currentUser, requireUser } from "../auth/session.js";
import { db } from "../db.js";
import { toBadge, toPublicUser } from "../game/progression.js";
import { REVIEW_XP } from "../game/submit.js";

export const meRouter = Router();
meRouter.use(requireUser);

meRouter.get("/", (req, res) => {
  res.json(toPublicUser(currentUser(req)));
});

meRouter.get("/profile", async (req, res) => {
  const user = currentUser(req);
  const [badges, owned, progress, attempts, museum, recent, lessonsDone] = await Promise.all([
    db.badge.findMany(),
    db.userBadge.findMany({ where: { userId: user.id } }),
    db.progress.findMany({ where: { userId: user.id }, include: { level: { select: { blackout: true } } } }),
    db.attempt.count({ where: { userId: user.id } }),
    db.bugMuseumEntry.findMany({
      where: { userId: user.id },
      orderBy: { nextReviewAt: "asc" },
      include: { level: { select: { title: true } } },
      take: 20,
    }),
    db.attempt.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { level: { select: { title: true } } },
      take: 8,
    }),
    db.lessonProgress.count({ where: { userId: user.id } }),
  ]);
  const earned = new Map(owned.map((b) => [b.badgeSlug, b.earnedAt]));
  const solved = progress.filter((p) => p.status === "solved");

  const body: ProfileResponse = {
    user: toPublicUser(user),
    badges: badges
      .map((b) => toBadge(b, earned.get(b.slug) ?? null))
      .sort((a, b) => Number(Boolean(b.earnedAt)) - Number(Boolean(a.earnedAt))),
    stats: {
      solved: solved.length,
      attempts,
      hintsUsed: progress.reduce((n, p) => n + p.hintsUsed, 0),
      blackoutSolved: solved.filter((p) => p.level.blackout).length,
      lessonsDone,
    },
    museum: museum.map((m) => ({
      levelId: m.levelId,
      levelTitle: m.level.title,
      bugType: m.bugType,
      occurrences: m.occurrences,
      nextReviewAt: m.nextReviewAt.toISOString(),
    })),
    recent: recent.map((a) => ({
      levelId: a.levelId,
      levelTitle: a.level.title,
      passed: a.passed,
      createdAt: a.createdAt.toISOString(),
    })),
  };
  res.json(body);
});

/** À revoir maintenant : jamais réparé (boîte 0), ou date de révision passée. */
const dueFilter = (userId: string, now: Date) => ({
  userId,
  level: { active: true },
  OR: [{ box: 0 }, { nextReviewAt: { lte: now } }],
});

/** Musée de bugs : ce qui est à revoir aujourd'hui, et ce qui reviendra plus tard. */
meRouter.get("/review", async (req, res) => {
  const user = currentUser(req);
  const now = new Date();
  const [entries, progress] = await Promise.all([
    db.bugMuseumEntry.findMany({
      where: { userId: user.id, level: { active: true } },
      orderBy: { nextReviewAt: "asc" },
      include: { level: { include: { module: true } } },
    }),
    db.progress.findMany({ where: { userId: user.id }, select: { levelId: true, status: true } }),
  ]);
  const status = new Map(progress.map((p) => [p.levelId, p.status as LevelSummary["status"]]));

  const items: Array<ReviewItem & { due: boolean }> = entries.map((e) => ({
    due: e.box === 0 || e.nextReviewAt <= now,
    level: {
      id: e.level.id,
      title: e.level.title,
      order: e.level.order,
      type: e.level.type as LevelSummary["type"],
      difficulty: e.level.difficulty,
      xp: e.level.xp,
      blackout: e.level.blackout,
      bugType: e.level.bugType,
      status: status.get(e.levelId) ?? "todo",
      moduleCode: e.level.module.code,
      trackId: e.level.module.trackId ?? "",
    },
    bugType: e.bugType,
    occurrences: e.occurrences,
    box: e.box,
    nextReviewAt: e.nextReviewAt.toISOString(),
    lastSeenAt: e.lastSeenAt.toISOString(),
  }));

  const strip = ({ due: _due, ...item }: ReviewItem & { due: boolean }): ReviewItem => item;
  const body: ReviewResponse = {
    due: items.filter((i) => i.due).map(strip),
    upcoming: items.filter((i) => !i.due).map(strip),
    reviewXp: REVIEW_XP,
  };
  res.json(body);
});

/** Nombre d'entrées à revoir, pour le badge de l'en-tête. */
meRouter.get("/review/count", async (req, res) => {
  res.json({ due: await db.bugMuseumEntry.count({ where: dueFilter(currentUser(req).id, new Date()) }) });
});

/** Droit à l'effacement : supprime le compte et toutes ses données (cascade). */
meRouter.delete("/", async (req, res) => {
  await db.user.delete({ where: { id: currentUser(req).id } });
  closeSession(res);
  res.status(204).end();
});
