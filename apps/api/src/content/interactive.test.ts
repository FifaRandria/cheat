import type { LevelConfig } from "@rustine/shared";
import { describe, expect, it } from "vitest";
import { gradeOrdering, gradeQuiz, interactivePayload, interactivePostmortem, quizAnswerKey } from "./interactive.js";

const base: LevelConfig = {
  id: "test-01",
  title: "Test",
  order: 1,
  type: "quiz",
  runtime: "node",
  difficulty: 1,
  xp: 10,
  blackout: false,
  hintCost: 0,
  bugType: "x",
  entry: "",
  brief: "",
  hints: [],
  lessons: [],
  questions: [
    { prompt: "Q1", choices: ["a", "b"], answer: 1, hint: "pense à b", explain: "parce que b" },
    { prompt: "Q2", choices: ["a", "b", "c"], answer: 0 },
  ],
  steps: [],
};

const ordering: LevelConfig = {
  ...base,
  id: "ordre-01",
  type: "ordering",
  questions: [],
  steps: [{ label: "un" }, { label: "deux", detail: "d2" }, { label: "trois" }, { label: "quatre" }],
};

describe("gradeQuiz", () => {
  const key = quizAnswerKey(base);
  const wrongFirst = [1 - (key[0] as number), key[1] as number];

  it("valide quand toutes les réponses sont justes", () => {
    expect(gradeQuiz(base, key)).toMatchObject({ ok: true, passed: 2, failed: 0, total: 2 });
  });

  it("note dans l'ordre affiché : le bon choix est celui que voit le joueur", () => {
    const payload = interactivePayload(base);
    const shown = payload?.kind === "quiz" ? payload.questions[0]?.choices : [];
    expect(shown?.[key[0] as number]).toBe("b");
  });

  it("mélange les choix de façon déterministe sans en perdre", () => {
    const a = interactivePayload(base);
    const b = interactivePayload(base);
    expect(a).toEqual(b);
    const shown = a?.kind === "quiz" ? a.questions[1]?.choices : [];
    expect([...(shown ?? [])].sort()).toEqual(["a", "b", "c"]);
  });

  it("donne la piste de la question ratée, sans la réponse", () => {
    const r = gradeQuiz(base, wrongFirst);
    expect(r.ok).toBe(false);
    expect(r.tests[0]).toMatchObject({ ok: false, message: "pense à b" });
    expect(r.tests[1]?.ok).toBe(true);
  });

  it("ne donne aucune piste en mode Blackout", () => {
    const r = gradeQuiz({ ...base, blackout: true }, wrongFirst);
    expect(r.tests[0]?.message).toBe("Ce n'est pas la bonne réponse.");
  });

  it("refuse un index hors des choix", () => {
    expect(gradeQuiz(base, [99, 99]).passed).toBe(0);
  });

  it("résiste à une soumission absente ou invalide", () => {
    expect(gradeQuiz(base, undefined).passed).toBe(0);
    expect(gradeQuiz(base, "n'importe quoi").ok).toBe(false);
  });
});

describe("remise en ordre", () => {
  const payload = interactivePayload(ordering);
  const steps = payload?.kind === "ordering" ? payload.steps : [];

  it("envoie toutes les étapes, mélangées et jamais déjà dans l'ordre", () => {
    expect(steps.map((s) => s.label).sort()).toEqual(["deux", "quatre", "trois", "un"]);
    expect(steps.map((s) => s.label)).not.toEqual(["un", "deux", "trois", "quatre"]);
    expect(gradeOrdering(ordering, steps.map((s) => s.id)).ok).toBe(false);
  });

  it("mélange toujours de la même façon pour un même niveau", () => {
    const again = interactivePayload(ordering);
    expect(again?.kind === "ordering" && again.steps.map((s) => s.id)).toEqual(steps.map((s) => s.id));
  });

  it("utilise des identifiants opaques qui ne révèlent pas la position", () => {
    for (const s of steps) expect(s.id).toMatch(/^[0-9a-f]{10}$/);
  });

  it("valide le bon ordre", () => {
    const byLabel = new Map(steps.map((s) => [s.label, s.id]));
    const order = ["un", "deux", "trois", "quatre"].map((l) => byLabel.get(l));
    expect(gradeOrdering(ordering, order)).toMatchObject({ ok: true, passed: 4 });
  });

  it("note position par position", () => {
    const byLabel = new Map(steps.map((s) => [s.label, s.id]));
    const r = gradeOrdering(ordering, ["un", "trois", "deux", "quatre"].map((l) => byLabel.get(l)));
    expect(r.tests.map((t) => t.ok)).toEqual([true, false, false, true]);
  });
});

describe("interactivePostmortem", () => {
  it("génère les réponses et explications d'un quiz, puis ajoute le texte écrit", () => {
    const pm = interactivePostmortem(base, "## Bonus\n\ntexte");
    expect(pm).toContain("**Réponse :** b");
    expect(pm).toContain("parce que b");
    expect(pm?.trim().endsWith("texte")).toBe(true);
  });

  it("liste les étapes dans le bon ordre pour une remise en ordre", () => {
    expect(interactivePostmortem(ordering, null)).toContain("2. **deux** : d2");
  });
});
