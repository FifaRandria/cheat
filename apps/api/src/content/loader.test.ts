import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

// Le loader lit la configuration à l'import : des valeurs factices suffisent, aucune base n'est contactée.
process.env.DATABASE_URL ??= "postgresql://test@localhost/test";
process.env.JWT_SECRET ??= "secret-de-test-unitaire";
const { isCodeLevel, loadContent } = await import("./loader.js");

const PARCOURS = `
- id: web
  title: Web
  tagline: t
  description: d
  modules:
    - id: bases
      code: W0
      title: Bases
      tagline: t
      phase: MVP
`;

let root: string | undefined;

async function contenuAvecNiveau(levelYml: string) {
  root = await mkdtemp(path.join(tmpdir(), "rustine-loader-"));
  await writeFile(path.join(root, "parcours.yml"), PARCOURS);
  const dir = path.join(root, "web", "bases", "levels", "01-niveau");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "level.yml"), levelYml);
  return root;
}

const NIVEAU_WRITE = `
id: bases-01
title: Écrire une fonction
order: 1
type: write
difficulty: 1
xp: 30
brief: Écris la fonction.
`;

afterEach(async () => {
  if (root) await rm(root, { recursive: true, force: true });
  root = undefined;
});

describe("niveaux « à écrire »", () => {
  it("se chargent comme un niveau de code, avec leur fichier d'entrée", async () => {
    const content = await loadContent(await contenuAvecNiveau(`${NIVEAU_WRITE}entry: prix.js\n`));
    const level = content.levels.get("bases-01");
    expect(level?.config.type).toBe("write");
    expect(level?.config.entry).toBe("prix.js");
  });

  it("exigent un fichier d'entrée", async () => {
    await expect(loadContent(await contenuAvecNiveau(NIVEAU_WRITE))).rejects.toThrow(/entry requis/);
  });

  it("sont des niveaux de code, comme les bug-hunt, contrairement aux quiz", () => {
    expect(isCodeLevel("write")).toBe(true);
    expect(isCodeLevel("bug-hunt")).toBe(true);
    expect(isCodeLevel("quiz")).toBe(false);
    expect(isCodeLevel("ordering")).toBe(false);
  });
});
