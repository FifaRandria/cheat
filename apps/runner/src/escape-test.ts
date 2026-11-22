/**
 * Tests d'évasion de base du bac à sable (critère d'acceptation du MVP).
 *
 * Chaque attaque est écrite comme un test qui PASSE si l'attaque réussit.
 * Le bac à sable est sain si toutes les attaques échouent ou expirent.
 *
 *   npm run test:escape
 */
import { mkdir } from "node:fs/promises";
import { config } from "./config.js";
import { runJob } from "./sandbox.js";

interface Attack {
  name: string;
  code: string;
}

const attacks: Attack[] = [
  {
    name: "accès réseau sortant",
    code: `await fetch("http://1.1.1.1", { signal: AbortSignal.timeout(2000) });`,
  },
  {
    name: "écriture dans le dossier de travail",
    code: `const fs = await import("node:fs"); fs.writeFileSync("/work/pwn.txt", "x");`,
  },
  {
    name: "lecture des secrets du runner",
    code: `if (!process.env.RUNNER_TOKEN && !process.env.DATABASE_URL) throw new Error("aucun secret visible");`,
  },
  {
    name: "boucle infinie",
    code: `while (true) {} `,
  },
  {
    name: "épuisement de la mémoire (1 Go)",
    code: `const keep = []; for (let i = 0; i < 1024; i++) keep.push(Buffer.alloc(1024 * 1024, 1));`,
  },
  {
    name: "fork bomb (200 processus)",
    code: `const { spawn } = await import("node:child_process");
const kids = [];
for (let i = 0; i < 200; i++) kids.push(spawn("sleep", ["5"]));
await Promise.all(kids.map((k) => new Promise((ok, ko) => { k.on("spawn", ok); k.on("error", ko); })));`,
  },
];

await mkdir(config.jobsDir, { recursive: true });
console.log(`Tests d'évasion (mode ${config.mode}, image ${config.image})\n`);

let escaped = 0;
for (const attack of attacks) {
  const result = await runJob({
    runtime: "node",
    files: [{ path: "noop.js", content: "export {};\n" }],
    tests: [
      {
        path: "attack.test.js",
        content: `import { test } from "node:test";\ntest("attaque", async () => {\n${attack.code}\n});\n`,
      },
    ],
  });
  const contained = !result.ok;
  if (!contained) escaped++;
  const why = result.error ?? (result.timedOut ? "temps limite" : result.tests[0]?.message?.split("\n")[0] ?? "bloquée");
  console.log(`${contained ? "✔ contenue " : "✘ ÉVASION  "} ${attack.name.padEnd(38)} ${contained ? why : ""}`);
}

console.log();
if (escaped > 0) {
  console.log(`${escaped} attaque(s) ont réussi.`);
  if (config.mode === "unsafe-local") {
    console.log("Normal en mode unsafe-local, qui n'isole rien. Relance avec RUNNER_MODE=docker.");
  }
  process.exit(1);
}
console.log("Toutes les attaques ont été contenues.");
