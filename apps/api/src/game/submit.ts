import type { Badge, RunResult, SourceFile } from "@rustine/shared";
import type { Level, Progress, User } from "@prisma/client";
import { asJson, db } from "../db.js";
import { BADGES, moduleBadgeSlug } from "./badges.js";
import { nextReviewDate, nextStreak, rewardFor, toBadge } from "./progression.js";

interface Outcome {
  user: User;
  firstSolve: boolean;
  xpGained: number;
  newBadges: Badge[];
}

/**
 * Enregistre une tentative et applique ses conséquences de jeu :
 * XP, série de jours, badges et musée de bugs.
 */
export async function recordAttempt(
  user: User,
  level: Level,
  files: SourceFile[],
  result: RunResult,
): Promise<Outcome> {
  const key = { userId_levelId: { userId: user.id, levelId: level.id } };
  const before = await db.progress.findUnique({ where: key });
  const alreadySolved = before?.status === "solved";
  const hintsUsed = before?.hintsUsed ?? 0;
  const firstSolve = result.ok && !alreadySolved;
  const xpGained = firstSolve ? rewardFor(level.xp, hintsUsed, level.hintCost) : 0;
  const now = new Date();
  const streak = nextStreak(user, now);

  const [, progress, updatedUser] = await db.$transaction([
    db.attempt.create({
      data: {
        userId: user.id,
        levelId: level.id,
        files: asJson(files),
        passed: result.ok,
        testsPassed: result.passed,
        testsTotal: result.total,
        durationMs: result.durationMs,
        hintsUsed,
      },
    }),
    db.progress.upsert({
      where: key,
      create: {
        userId: user.id,
        levelId: level.id,
        attempts: 1,
        lastCode: asJson(files),
        ...(firstSolve && { status: "solved", solvedAt: now, xpEarned: xpGained }),
      },
      update: {
        attempts: { increment: 1 },
        lastCode: asJson(files),
        ...(firstSolve && { status: "solved", solvedAt: now, xpEarned: xpGained }),
      },
    }),
    db.user.update({
      where: { id: user.id },
      data: {
        xp: { increment: xpGained },
        streak,
        bestStreak: Math.max(user.bestStreak, streak),
        lastActiveOn: now,
      },
    }),
  ]);

  await updateMuseum(user, level, result, now);
  const newBadges = firstSolve ? await awardBadges(updatedUser, level, progress) : await awardStreakBadges(updatedUser);
  return { user: updatedUser, firstSolve, xpGained, newBadges };
}

/** Un échec entre au musée ; une réussite fait monter l'entrée d'une boîte (révision plus espacée). */
async function updateMuseum(user: User, level: Level, result: RunResult, now: Date) {
  const where = { userId_levelId: { userId: user.id, levelId: level.id } };
  if (!result.ok) {
    await db.bugMuseumEntry.upsert({
      where,
      create: { userId: user.id, levelId: level.id, bugType: level.bugType, nextReviewAt: nextReviewDate(0, now) },
      update: { occurrences: { increment: 1 }, box: 0, lastSeenAt: now, nextReviewAt: nextReviewDate(0, now) },
    });
    return;
  }
  const entry = await db.bugMuseumEntry.findUnique({ where });
  if (entry) {
    await db.bugMuseumEntry.update({
      where,
      data: { box: entry.box + 1, lastSeenAt: now, nextReviewAt: nextReviewDate(entry.box + 1, now) },
    });
  }
}

async function awardBadges(user: User, level: Level, progress: Progress): Promise<Badge[]> {
  const slugs: string[] = [];
  const solvedCount = await db.progress.count({ where: { userId: user.id, status: "solved" } });

  if (solvedCount === 1) slugs.push("premier-correctif");
  if (progress.attempts === 1) slugs.push("premier-coup");
  if (level.hintsCount > 0 && progress.hintsUsed === 0) slugs.push("sans-filet");
  if (level.blackout) slugs.push("blackout");
  if (progress.attempts >= 6) slugs.push("obstine");

  const [moduleLevels, moduleSolved] = await Promise.all([
    db.level.count({ where: { moduleId: level.moduleId, active: true } }),
    db.progress.count({ where: { userId: user.id, status: "solved", level: { moduleId: level.moduleId, active: true } } }),
  ]);
  if (moduleLevels > 0 && moduleSolved === moduleLevels) slugs.push(moduleBadgeSlug(level.moduleId));

  return grant(user, [...slugs, ...streakSlugs(user)]);
}

async function awardStreakBadges(user: User) {
  return grant(user, streakSlugs(user));
}

function streakSlugs(user: User) {
  const slugs: string[] = [];
  if (user.streak >= 3) slugs.push("serie-3");
  if (user.streak >= 7) slugs.push("serie-7");
  return slugs;
}

async function grant(user: User, slugs: string[]): Promise<Badge[]> {
  if (slugs.length === 0) return [];
  const owned = await db.userBadge.findMany({ where: { userId: user.id, badgeSlug: { in: slugs } } });
  const ownedSet = new Set(owned.map((b) => b.badgeSlug));
  const fresh = slugs.filter((s) => !ownedSet.has(s));
  if (fresh.length === 0) return [];

  const badges = await db.badge.findMany({ where: { slug: { in: fresh } } });
  await db.userBadge.createMany({
    data: badges.map((b) => ({ userId: user.id, badgeSlug: b.slug })),
    skipDuplicates: true,
  });
  const now = new Date();
  const order = new Map<string, number>(BADGES.map((b, i) => [b.slug, i]));
  return badges
    .sort((a, b) => (order.get(a.slug) ?? 99) - (order.get(b.slug) ?? 99))
    .map((b) => toBadge(b, now));
}
