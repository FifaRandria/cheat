import type { Badge, PublicUser } from "@rustine/shared";
import type { Badge as BadgeRow, User } from "@prisma/client";

/** XP cumulée nécessaire pour atteindre un rang : 0, 100, 300, 600, 1000… */
export const xpForRank = (rank: number) => 50 * rank * (rank - 1);

export function rankFromXp(xp: number) {
  let rank = 1;
  while (xp >= xpForRank(rank + 1)) rank++;
  return {
    rank,
    xpIntoRank: xp - xpForRank(rank),
    xpForNextRank: xpForRank(rank + 1) - xpForRank(rank),
  };
}

/** Récompense d'un niveau compte tenu des indices ouverts. Jamais moins de 25 % de l'XP. */
export function rewardFor(xp: number, hintsUsed: number, hintCost: number) {
  return Math.max(xp - hintsUsed * hintCost, Math.ceil(xp * 0.25));
}

const DAY = 24 * 60 * 60 * 1000;
const utcDay = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

/** Met à jour la série de jours consécutifs à partir de la dernière activité. */
export function nextStreak(user: Pick<User, "streak" | "lastActiveOn">, now = new Date()) {
  const today = utcDay(now);
  if (!user.lastActiveOn) return 1;
  const last = utcDay(user.lastActiveOn);
  if (last === today) return Math.max(user.streak, 1);
  if (today - last === DAY) return user.streak + 1;
  return 1;
}

/** Intervalles de révision du musée de bugs, en jours, par boîte de Leitner. */
const REVIEW_DAYS = [1, 3, 7, 14, 30];
export const nextReviewDate = (box: number, from = new Date()) =>
  new Date(from.getTime() + (REVIEW_DAYS[Math.min(box, REVIEW_DAYS.length - 1)] ?? 30) * DAY);

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    xp: user.xp,
    ...rankFromXp(user.xp),
    streak: user.streak,
    bestStreak: user.bestStreak,
    githubLinked: Boolean(user.githubId),
  };
}

export function toBadge(badge: BadgeRow, earnedAt: Date | null = null): Badge {
  return {
    slug: badge.slug,
    name: badge.name,
    description: badge.description,
    icon: badge.icon,
    earnedAt: earnedAt?.toISOString() ?? null,
  };
}
