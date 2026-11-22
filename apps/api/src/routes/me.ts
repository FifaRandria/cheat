import type { ProfileResponse } from "@rustine/shared";
import { Router } from "express";
import { closeSession, currentUser, requireUser } from "../auth/session.js";
import { db } from "../db.js";
import { toBadge, toPublicUser } from "../game/progression.js";

export const meRouter = Router();
meRouter.use(requireUser);

meRouter.get("/", (req, res) => {
  res.json(toPublicUser(currentUser(req)));
});

meRouter.get("/profile", async (req, res) => {
  const user = currentUser(req);
  const [badges, owned, progress, attempts, museum, recent] = await Promise.all([
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

/** Droit à l'effacement : supprime le compte et toutes ses données (cascade). */
meRouter.delete("/", async (req, res) => {
  await db.user.delete({ where: { id: currentUser(req).id } });
  closeSession(res);
  res.status(204).end();
});
