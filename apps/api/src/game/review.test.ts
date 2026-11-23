import { describe, expect, it } from "vitest";
import { isDueReview } from "./submit.js";

describe("isDueReview", () => {
  const now = new Date("2026-11-23T10:00:00Z");
  const past = new Date("2026-11-22T10:00:00Z");
  const future = new Date("2026-11-30T10:00:00Z");

  it("une entrée réparée dont la date est passée est due", () => {
    expect(isDueReview({ box: 2, nextReviewAt: past }, now)).toBe(true);
  });

  it("une entrée réparée dont la date n'est pas arrivée n'est pas due", () => {
    expect(isDueReview({ box: 2, nextReviewAt: future }, now)).toBe(false);
  });

  it("une entrée jamais réparée (boîte 0) n'est pas une révision", () => {
    expect(isDueReview({ box: 0, nextReviewAt: past }, now)).toBe(false);
  });

  it("aucune entrée : pas de révision", () => {
    expect(isDueReview(null, now)).toBe(false);
  });
});
