/**
 * Vérifie le contenu pédagogique.
 *   - Niveaux de code : le départ doit échouer, la solution doit passer (via le runner).
 *   - Quiz et remises en ordre : la solution attendue doit être acceptée.
 *   - Leçons et niveaux : les leçons liées doivent exister.
 *
 *   npm run levels:check             tout le contenu
 *   npm run levels:check js-async-01  un seul niveau
 */
import { gradeOrdering, gradeQuiz, interactivePayload, quizAnswerKey } from "./interactive.js";
import { getContent, readLevelFiles } from "./loader.js";
import { runCode } from "../runner-client.js";

const only = process.argv[2];
const content = await getContent();
let failures = 0;

console.log(`${content.tracks.length} parcours, ${content.modules.size} modules, ${content.lessons.size} leçons, ${content.levels.size} niveaux\n`);

for (const level of content.levels.values()) {
  const c = level.config;
  if (only && c.id !== only) continue;
  const problems: string[] = [];
  let summary = "";

  for (const id of c.lessons) if (!content.lessons.has(id)) problems.push(`leçon liée introuvable : ${id}`);

  if (c.type === "quiz") {
    const r = gradeQuiz(c, quizAnswerKey(c));
    if (!r.ok) problems.push("les bonnes réponses ne sont pas acceptées");
    summary = `quiz · ${c.questions.length} questions`;
  } else if (c.type === "ordering") {
    const payload = interactivePayload(c);
    const ids = payload?.kind === "ordering" ? payload.steps.map((s) => s.id) : [];
    const shuffledOk = gradeOrdering(c, ids).ok;
    if (shuffledOk) problems.push("l'ordre mélangé est déjà correct");
    summary = `remise en ordre · ${c.steps.length} étapes`;
  } else {
    const tests = await readLevelFiles(level, "tests");
    const [starter, solution] = await Promise.all([readLevelFiles(level, "starter"), readLevelFiles(level, "solution")]);
    if (!starter.some((f) => f.path === c.entry)) problems.push(`entry « ${c.entry} » absent de starter/`);
    if (solution.length === 0) problems.push("dossier solution/ vide");

    const broken = await runCode({ runtime: c.runtime, files: starter, tests });
    if (broken.error) problems.push(`runner : ${broken.error}`);
    else if (broken.ok) problems.push("le code de départ passe déjà tous les tests");

    const fixed = await runCode({ runtime: c.runtime, files: solution, tests });
    if (!fixed.error && !fixed.ok) {
      const ko = fixed.tests.filter((t) => !t.ok);
      problems.push(`la solution échoue : ${ko.map((t) => `${t.name} (${t.message?.split("\n")[0]})`).join(", ") || fixed.output.slice(0, 300)}`);
    }
    summary = `${c.runtime} · départ ${broken.passed}/${broken.total} · solution ${fixed.passed}/${fixed.total}`;
  }

  if (problems.length) failures++;
  console.log(`${problems.length ? "✘" : "✔"} ${c.id.padEnd(16)} ${summary}`);
  for (const p of problems) console.log(`    ${p}`);
}

process.exit(failures ? 1 : 0);
