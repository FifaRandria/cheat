import type { Badge, RunResult } from "@rustine/shared";
import type { BugMuseumEntry, Level, Progress, User } from "@prisma/client";
import { asJson, db } from "../db.js";
import { BADGES, moduleBadgeSlug } from "./badges.js";
import { nextReviewDate, nextStreak, rewardFor, toBadge } from "./progression.js";

interface Outcome {
  user: User;
  firstSolve: boolean;
  xpGained: number;
  newBadges: Badge[];
  /** Révision espacée réussie (le niveau était dû au musée de bugs) */
  reviewed: boolean;
}

/** XP gagnée en réussissant une révision du musée de bugs à la date prévue. */
export const REVIEW_XP = 10;

/**
 * Enregistre une tentative et applique ses conséquences de jeu :
 * XP, série de jours, badges et musée de bugs.
 */
export async function recordAttempt(
  user: User,
  level: Level,
  /** Code soumis, réponses du quiz ou ordre proposé */
  submission: unknown,
  result: RunResult,
  /** true pour un niveau de code : la soumission devient le brouillon courant */
  keepAsDraft: boolean,
): Promise<Outcome> {
  const key = { userId_levelId: { userId: user.id, levelId: level.id } };
  const before = await db.progress.findUnique({ where: key });
  const alreadySolved = before?.status === "solved";
  const hintsUsed = before?.hintsUsed ?? 0;
  const firstSolve = result.ok && !alreadySolved;
  const now = new Date();
  const entry = await db.bugMuseumEntry.findUnique({ where: key });
  const reviewed = result.ok && !firstSolve && isDueReview(entry, now);
  const xpGained = (firstSolve ? rewardFor(level.xp, hintsUsed, level.hintCost) : 0) + (reviewed ? REVIEW_XP : 0);
  const streak = nextStreak(user, now);

  const [, progress, updatedUser] = await db.$transaction([
    db.attempt.create({
      data: {
        userId: user.id,
        levelId: level.id,
        files: asJson(submission),
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
        ...(keepAsDraft && { lastCode: asJson(submission) }),
        ...(firstSolve && { status: "solved", solvedAt: now, xpEarned: xpGained }),
      },
      update: {
        attempts: { increment: 1 },
        ...(keepAsDraft && { lastCode: asJson(submission) }),
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

  await updateMuseum(user, level, result, entry, now);
  const newBadges = firstSolve ? await awardBadges(updatedUser, level, progress) : await awardStreakBadges(updatedUser);
  return { user: updatedUser, firstSolve, xpGained, newBadges, reviewed };
}

/** Une entrée réparée au moins une fois, dont la date de révision est arrivée. */
export const isDueReview = (entry: Pick<BugMuseumEntry, "box" | "nextReviewAt"> | null, now: Date) =>
  Boolean(entry && entry.box > 0 && entry.nextReviewAt <= now);

/**
 * Musée de bugs, en boîtes de Leitner :
 * - un échec (re)met l'entrée en boîte 0, à revoir le lendemain ;
 * - la première réparation après un échec la passe en boîte 1 ;
 * - une révision réussie à la date prévue la fait monter d'une boîte (révisions plus espacées) ;
 * - rejouer avant la date ne change rien, pour ne pas « tricher » sur l'espacement.
 */
async function updateMuseum(user: User, level: Level, result: RunResult, entry: BugMuseumEntry | null, now: Date) {
  const where = { userId_levelId: { userId: user.id, levelId: level.id } };
  if (!result.ok) {
    await db.bugMuseumEntry.upsert({
      where,
      create: { userId: user.id, levelId: level.id, bugType: level.bugType, nextReviewAt: nextReviewDate(0, now) },
      update: { occurrences: { increment: 1 }, box: 0, lastSeenAt: now, nextReviewAt: nextReviewDate(0, now) },
    });
    return;
  }
  if (entry && (entry.box === 0 || isDueReview(entry, now))) {
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

/** Badges liés aux leçons, appelés quand une leçon est terminée. */
export async function awardLessonBadges(user: User): Promise<Badge[]> {
  const done = await db.lessonProgress.count({ where: { userId: user.id } });
  const slugs = [...streakSlugs(user)];
  if (done >= 1) slugs.push("premiere-lecon");
  if (done >= 10) slugs.push("studieux");
  return grant(user, slugs);
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
