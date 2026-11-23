import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import type { LessonFrontmatter, LevelConfig, ModuleConfig, SourceFile, TrackConfig } from "@rustine/shared";
import YAML from "yaml";
import { z } from "zod";
import { env } from "../env.js";

// ---------------------------------------------------------------------------
// Schémas de validation du contenu
// ---------------------------------------------------------------------------

const slug = z.string().regex(/^[a-z0-9-]+$/, "identifiant en minuscules, chiffres et tirets");

const moduleSchema = z.object({
  id: slug,
  code: z.string(),
  title: z.string(),
  tagline: z.string(),
  notions: z.array(z.string()).default([]),
  phase: z.enum(["MVP", "V1", "V2", "V3"]),
});

const trackSchema = z.object({
  id: slug,
  title: z.string(),
  tagline: z.string(),
  description: z.string(),
  icon: z.string().default("code"),
  modules: z.array(moduleSchema),
});

const questionSchema = z
  .object({
    prompt: z.string(),
    choices: z.array(z.string()).min(2),
    answer: z.number().int().min(0),
    explain: z.string().optional(),
    hint: z.string().optional(),
  })
  .refine((q) => q.answer < q.choices.length, { message: "answer hors des choix" });

const levelSchema = z
  .object({
    id: slug,
    title: z.string(),
    order: z.number().int(),
    type: z.enum(["bug-hunt", "write", "quiz", "ordering"]).default("bug-hunt"),
    runtime: z.enum(["node", "python"]).default("node"),
    difficulty: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
    xp: z.number().int().positive(),
    blackout: z.boolean().default(false),
    hintCost: z.number().int().min(0).default(10),
    bugType: z.string().default("divers"),
    entry: z.string().default(""),
    brief: z.string(),
    logs: z.string().optional(),
    hints: z.array(z.string()).default([]),
    lessons: z.array(z.string()).default([]),
    questions: z.array(questionSchema).default([]),
    steps: z.array(z.object({ label: z.string(), detail: z.string().optional() })).default([]),
  })
  .superRefine((l, ctx) => {
    if ((l.type === "bug-hunt" || l.type === "write") && !l.entry)
      ctx.addIssue({ code: "custom", message: `entry requis pour un niveau ${l.type}` });
    if (l.type === "quiz" && l.questions.length === 0) ctx.addIssue({ code: "custom", message: "questions requises" });
    if (l.type === "ordering" && l.steps.length < 3) ctx.addIssue({ code: "custom", message: "au moins 3 steps" });
  });

const lessonSchema = z.object({
  id: slug,
  title: z.string(),
  minutes: z.number().int().positive().default(5),
  summary: z.string().default(""),
  xp: z.number().int().min(0).default(10),
  check: z.array(questionSchema).default([]),
});

// ---------------------------------------------------------------------------

export interface LoadedModule extends ModuleConfig {
  trackId: string;
  order: number;
  dir: string;
}

export interface LoadedLevel {
  config: LevelConfig;
  moduleId: string;
  trackId: string;
  dir: string;
  relPath: string;
}

export interface LoadedLesson {
  meta: LessonFrontmatter;
  order: number;
  moduleId: string;
  trackId: string;
  body: string;
  relPath: string;
}

export interface Content {
  tracks: Array<Omit<TrackConfig, "modules"> & { order: number; modules: LoadedModule[] }>;
  modules: Map<string, LoadedModule>;
  levels: Map<string, LoadedLevel>;
  lessons: Map<string, LoadedLesson>;
}

/** Les niveaux où le joueur édite du code exécuté par le runner (réparer ou écrire). */
export const isCodeLevel = (type: string): boolean => type === "bug-hunt" || type === "write";

let cache: Content | null = null;

/** En développement, le contenu est relu à chaque appel : pas besoin de redémarrer l'API. */
export async function getContent(): Promise<Content> {
  if (cache && env.isProd) return cache;
  cache = await loadContent(env.contentDir);
  return cache;
}

export async function loadContent(root: string): Promise<Content> {
  const raw = YAML.parse(await readFile(path.join(root, "parcours.yml"), "utf8"));
  const tracksCfg = parseOrThrow(z.array(trackSchema), raw, "parcours.yml");

  const content: Content = { tracks: [], modules: new Map(), levels: new Map(), lessons: new Map() };

  for (const [trackOrder, t] of tracksCfg.entries()) {
    const modules: LoadedModule[] = [];
    for (const [order, m] of t.modules.entries()) {
      if (content.modules.has(m.id)) throw new Error(`parcours.yml : module en double « ${m.id} »`);
      const mod: LoadedModule = { ...m, trackId: t.id, order, dir: path.join(root, t.id, m.id) };
      modules.push(mod);
      content.modules.set(m.id, mod);
      await loadModule(root, mod, content);
    }
    content.tracks.push({ ...t, order: trackOrder, modules });
  }
  return content;
}

async function loadModule(root: string, mod: LoadedModule, content: Content) {
  // Niveaux : levels/<NN-titre>/level.yml
  for (const name of await subdirs(path.join(mod.dir, "levels"))) {
    const dir = path.join(mod.dir, "levels", name);
    const file = path.join(dir, "level.yml");
    if (!(await exists(file))) continue;
    const relPath = rel(root, dir);
    const config = parseOrThrow(levelSchema, YAML.parse(await readFile(file, "utf8")), `${relPath}/level.yml`) as LevelConfig;
    if (content.levels.has(config.id)) throw new Error(`Identifiant de niveau en double : ${config.id}`);
    content.levels.set(config.id, { config, moduleId: mod.id, trackId: mod.trackId, dir, relPath });
  }

  // Leçons : lessons/<NN-titre>.md avec un en-tête YAML
  const lessonsDir = path.join(mod.dir, "lessons");
  if (!(await exists(lessonsDir))) return;
  for (const name of (await readdir(lessonsDir)).filter((f) => f.endsWith(".md")).sort()) {
    const file = path.join(lessonsDir, name);
    const relPath = rel(root, file);
    const { data, body } = splitFrontmatter(await readFile(file, "utf8"), relPath);
    const meta = parseOrThrow(lessonSchema, data, relPath) as LessonFrontmatter;
    if (content.lessons.has(meta.id)) throw new Error(`Identifiant de leçon en double : ${meta.id}`);
    const order = Number.parseInt(name, 10) || content.lessons.size + 1;
    content.lessons.set(meta.id, { meta, order, moduleId: mod.id, trackId: mod.trackId, body, relPath });
  }
}

function splitFrontmatter(text: string, where: string) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!m) throw new Error(`${where} : en-tête YAML (--- … ---) manquant`);
  return { data: YAML.parse(m[1] ?? "") as unknown, body: (m[2] ?? "").trim() + "\n" };
}

function parseOrThrow<T>(schema: z.ZodType<T, z.ZodTypeDef, unknown>, data: unknown, where: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issue = result.error.issues[0];
    throw new Error(`${where} : ${issue?.path.join(".") || "racine"} ${issue?.message}`);
  }
  return result.data;
}

// ---------------------------------------------------------------------------

export async function getLoadedLevel(id: string) {
  return (await getContent()).levels.get(id);
}

export async function getLoadedLesson(id: string) {
  return (await getContent()).lessons.get(id);
}

/** Lit récursivement les fichiers d'un sous-dossier d'un niveau (starter, tests, solution). */
export async function readLevelFiles(level: LoadedLevel, sub: string): Promise<SourceFile[]> {
  const base = path.join(level.dir, sub);
  if (!(await exists(base))) return [];
  const out: SourceFile[] = [];
  async function walk(dir: string) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== "__pycache__") await walk(full);
      } else out.push({ path: path.relative(base, full).split(path.sep).join("/"), content: await readFile(full, "utf8") });
    }
  }
  await walk(base);
  return out.sort((a, b) => a.path.localeCompare(b.path));
}

export async function readPostmortem(level: LoadedLevel): Promise<string | null> {
  const file = path.join(level.dir, "postmortem.md");
  return (await exists(file)) ? readFile(file, "utf8") : null;
}

const rel = (root: string, p: string) => path.relative(root, p).split(path.sep).join("/");

async function subdirs(dir: string): Promise<string[]> {
  if (!(await exists(dir))) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory() && !e.name.startsWith(".")).map((e) => e.name).sort();
}

async function exists(p: string) {
  return stat(p).then(
    () => true,
    () => false,
  );
}
