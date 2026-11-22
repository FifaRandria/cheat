import { createHash } from "node:crypto";
import type { InteractivePayload, LevelConfig, RunResult } from "@rustine/shared";

/**
 * Niveaux non codés (quiz, remise en ordre) : notés directement par l'API,
 * sans passer par le runner. Les bonnes réponses ne quittent jamais le serveur.
 */

/** Identifiant opaque d'une étape : ne révèle pas sa position. */
const stepId = (levelId: string, index: number) =>
  createHash("sha256").update(`${levelId}:${index}`).digest("hex").slice(0, 10);

/** Mélange déterministe (même ordre à chaque chargement), jamais identique à la solution. */
function shuffled<T>(items: T[], seed: string): T[] {
  let h = createHash("sha256").update(seed).digest().readUInt32LE(0);
  const rand = () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  if (out.every((v, i) => v === items[i])) out.push(out.shift() as T);
  return out;
}

export function interactivePayload(config: LevelConfig): InteractivePayload | null {
  if (config.type === "quiz") {
    return { kind: "quiz", questions: config.questions.map((q) => ({ prompt: q.prompt, choices: q.choices })) };
  }
  if (config.type === "ordering") {
    const steps = config.steps.map((s, i) => ({ id: stepId(config.id, i), label: s.label, detail: s.detail ?? null }));
    return { kind: "ordering", steps: shuffled(steps, config.id) };
  }
  return null;
}

export function gradeQuiz(config: LevelConfig, answers: unknown): RunResult {
  const given = Array.isArray(answers) ? answers : [];
  const tests = config.questions.map((q, i) => {
    const ok = given[i] === q.answer;
    return {
      name: `Question ${i + 1}`,
      ok,
      message: ok ? undefined : config.blackout ? "Ce n'est pas la bonne réponse." : (q.hint ?? "Ce n'est pas la bonne réponse. Relis la situation."),
    };
  });
  return toResult(tests);
}

export function gradeOrdering(config: LevelConfig, order: unknown): RunResult {
  const given = Array.isArray(order) ? order : [];
  const expected = config.steps.map((_, i) => stepId(config.id, i));
  const labels = new Map(config.steps.map((s, i) => [stepId(config.id, i), s.label]));
  const tests = expected.map((id, i) => {
    const placed = given[i];
    const ok = placed === id;
    return {
      name: `${i + 1}. ${labels.get(String(placed)) ?? "(vide)"}`,
      ok,
      message: ok ? undefined : "Pas à sa place.",
    };
  });
  return toResult(tests);
}

function toResult(tests: RunResult["tests"]): RunResult {
  const passed = tests.filter((t) => t.ok).length;
  return {
    ok: passed === tests.length,
    passed,
    failed: tests.length - passed,
    total: tests.length,
    durationMs: 0,
    timedOut: false,
    tests,
    output: "",
  };
}

/** Post-mortem généré à partir des explications, complété par postmortem.md s'il existe. */
export function interactivePostmortem(config: LevelConfig, written: string | null): string | null {
  const parts: string[] = [];
  if (config.type === "quiz") {
    config.questions.forEach((q, i) => {
      parts.push(`## Question ${i + 1}\n\n${q.prompt.trim()}\n\n**Réponse :** ${q.choices[q.answer]}${q.explain ? `\n\n${q.explain.trim()}` : ""}`);
    });
  }
  if (config.type === "ordering") {
    parts.push(
      "## Le bon ordre\n\n" +
        config.steps.map((s, i) => `${i + 1}. **${s.label}**${s.detail ? ` : ${s.detail.trim()}` : ""}`).join("\n"),
    );
  }
  if (written) parts.push(written.trim());
  return parts.length ? parts.join("\n\n") + "\n" : null;
}
