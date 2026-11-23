import { describe, expect, it } from "vitest";
import { nextReviewDate, nextStreak, rankFromXp, rewardFor, xpForRank } from "./progression.js";

describe("rangs", () => {
  it("suit la courbe 0, 100, 300, 600, 1000", () => {
    expect([1, 2, 3, 4, 5].map(xpForRank)).toEqual([0, 100, 300, 600, 1000]);
  });

  it.each([
    [0, 1, 0, 100],
    [99, 1, 99, 100],
    [100, 2, 0, 200],
    [350, 3, 50, 300],
  ])("%i XP donne le rang %i (%i/%i)", (xp, rank, into, next) => {
    expect(rankFromXp(xp)).toEqual({ rank, xpIntoRank: into, xpForNextRank: next });
  });
});

describe("rewardFor", () => {
  it("retire le coût de chaque indice", () => {
    expect(rewardFor(50, 1, 10)).toBe(40);
  });

  it("ne descend jamais sous 25 % de l'XP", () => {
    expect(rewardFor(50, 10, 10)).toBe(13);
  });
});

describe("nextStreak", () => {
  const now = new Date("2026-11-23T10:00:00Z");

  it("démarre à 1 sans activité passée", () => {
    expect(nextStreak({ streak: 0, lastActiveOn: null }, now)).toBe(1);
  });

  it("ne change pas le même jour", () => {
    expect(nextStreak({ streak: 4, lastActiveOn: new Date("2026-11-23T00:00:00Z") }, now)).toBe(4);
  });

  it("augmente le lendemain", () => {
    expect(nextStreak({ streak: 4, lastActiveOn: new Date("2026-11-22T00:00:00Z") }, now)).toBe(5);
  });

  it("repart à 1 après un jour manqué", () => {
    expect(nextStreak({ streak: 4, lastActiveOn: new Date("2026-11-20T00:00:00Z") }, now)).toBe(1);
  });
});

describe("nextReviewDate", () => {
  const from = new Date("2026-11-23T00:00:00Z");
  const days = (d: Date) => (d.getTime() - from.getTime()) / 86_400_000;

  it("espace les révisions : 1, 3, 7, 14 puis 30 jours", () => {
    expect([0, 1, 2, 3, 4, 9].map((box) => days(nextReviewDate(box, from)))).toEqual([1, 3, 7, 14, 30, 30]);
  });
});
