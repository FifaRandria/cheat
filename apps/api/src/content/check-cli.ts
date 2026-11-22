/**
 * Vérifie chaque niveau via le runner :
 *   - le code de départ doit échouer à au moins un test (sinon il n'y a pas de bug) ;
 *   - la solution de référence doit passer tous les tests.
 *
 *   npm run levels:check            tous les niveaux
 *   npm run levels:check m1-async-01  un seul niveau
 */
import { runCode } from "../runner-client.js";
import { getContent, readLevelFiles } from "./loader.js";

const only = process.argv[2];
const { levels } = await getContent();
let failures = 0;

for (const level of levels.values()) {
  if (only && level.config.id !== only) continue;
  const tests = await readLevelFiles(level, "tests");
  const [starter, solution] = await Promise.all([
    readLevelFiles(level, "starter"),
    readLevelFiles(level, "solution"),
  ]);

  const problems: string[] = [];
  if (!starter.some((f) => f.path === level.config.entry)) problems.push(`entry « ${level.config.entry} » absent de starter/`);
  if (solution.length === 0) problems.push("dossier solution/ vide");

  const broken = await runCode({ runtime: level.config.runtime, files: starter, tests });
  if (broken.error) problems.push(`runner : ${broken.error}`);
  else if (broken.ok) problems.push("le code de départ passe déjà tous les tests");

  const fixed = await runCode({ runtime: level.config.runtime, files: solution, tests });
  if (!fixed.error && !fixed.ok) {
    problems.push(`la solution échoue : ${fixed.tests.filter((t) => !t.ok).map((t) => t.name).join(", ") || fixed.output.slice(0, 200)}`);
  }

  if (problems.length) failures++;
  console.log(`${problems.length ? "✘" : "✔"} ${level.config.id.padEnd(22)} départ ${broken.passed}/${broken.total} · solution ${fixed.passed}/${fixed.total}`);
  for (const p of problems) console.log(`    ${p}`);
}

process.exit(failures ? 1 : 0);
