import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import type { LevelConfig, ModuleConfig, SourceFile } from "@rustine/shared";
import YAML from "yaml";
import { z } from "zod";
import { env } from "../env.js";

const moduleSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  code: z.string(),
  title: z.string(),
  tagline: z.string(),
  notions: z.array(z.string()).default([]),
  phase: z.enum(["MVP", "V1", "V2", "V3"]),
});

const levelSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  module: z.string(),
  order: z.number().int(),
  type: z.enum(["bug-hunt", "quiz", "ordering", "simulation"]).default("bug-hunt"),
  runtime: z.enum(["node", "python"]).default("node"),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  xp: z.number().int().positive(),
  blackout: z.boolean().default(false),
  hintCost: z.number().int().min(0).default(10),
  bugType: z.string().default("divers"),
  entry: z.string(),
  brief: z.string(),
  logs: z.string().optional(),
  hints: z.array(z.string()).default([]),
  tests: z.string().default("tests/"),
});

export interface LoadedLevel {
  config: LevelConfig;
  /** Chemin absolu du dossier du niveau */
  dir: string;
  /** Chemin relatif à LEVELS_DIR */
  relPath: string;
}

export interface Content {
  modules: ModuleConfig[];
  levels: Map<string, LoadedLevel>;
}

let cache: Content | null = null;

/**
 * Charge le contenu pédagogique depuis le disque.
 * En développement, le contenu est relu à chaque appel pour voir les modifications
 * des niveaux sans redémarrer l'API.
 */
export async function getContent(): Promise<Content> {
  if (cache && env.isProd) return cache;
  cache = await loadContent(env.levelsDir);
  return cache;
}

export async function loadContent(root: string): Promise<Content> {
  const modulesRaw = YAML.parse(await readFile(path.join(root, "modules.yml"), "utf8"));
  const modules = z.array(moduleSchema).parse(modulesRaw);
  const moduleIds = new Set(modules.map((m) => m.id));
  const levels = new Map<string, LoadedLevel>();

  for (const moduleDir of await subdirs(root)) {
    for (const levelDir of await subdirs(path.join(root, moduleDir))) {
      const dir = path.join(root, moduleDir, levelDir);
      const file = path.join(dir, "level.yml");
      if (!(await exists(file))) continue;

      const result = levelSchema.safeParse(YAML.parse(await readFile(file, "utf8")));
      if (!result.success) {
        const issue = result.error.issues[0];
        throw new Error(`${moduleDir}/${levelDir}/level.yml : ${issue?.path.join(".")} ${issue?.message}`);
      }
      const config = result.data as LevelConfig;
      if (!moduleIds.has(config.module)) {
        throw new Error(`${config.id} : module inconnu « ${config.module} » (absent de modules.yml)`);
      }
      if (levels.has(config.id)) throw new Error(`Identifiant de niveau en double : ${config.id}`);
      levels.set(config.id, { config, dir, relPath: `${moduleDir}/${levelDir}` });
    }
  }
  return { modules, levels };
}

export async function getLoadedLevel(id: string): Promise<LoadedLevel | undefined> {
  return (await getContent()).levels.get(id);
}

/** Lit récursivement les fichiers d'un sous-dossier d'un niveau (starter, tests, solution). */
export async function readLevelFiles(level: LoadedLevel, sub: string): Promise<SourceFile[]> {
  const base = path.join(level.dir, sub);
  if (!(await exists(base))) return [];
  const out: SourceFile[] = [];
  async function walk(dir: string) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else out.push({ path: path.relative(base, full).split(path.sep).join("/"), content: await readFile(full, "utf8") });
    }
  }
  await walk(base);
  return out.sort((a, b) => a.path.localeCompare(b.path));
}

export async function readPostmortem(level: LoadedLevel): Promise<string | null> {
  const file = path.join(level.dir, "postmortem.md");
  return (await exists(file)) ? readFile(file, "utf8") : null;
}

async function subdirs(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory() && !e.name.startsWith(".")).map((e) => e.name).sort();
}

async function exists(p: string) {
  return stat(p).then(
    () => true,
    () => false,
  );
}
