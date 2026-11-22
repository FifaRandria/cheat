import type { LevelDetail, LevelStatus, ModuleSummary, SourceFile } from "@rustine/shared";
import { Router } from "express";
import { z } from "zod";
import { currentUser, requireUser } from "../auth/session.js";
import { getLoadedLevel, readLevelFiles, readPostmortem } from "../content/loader.js";
import { asJson, db } from "../db.js";
import { rewardFor } from "../game/progression.js";
import { HttpError, notFound } from "../http.js";

export const catalogRouter = Router();

catalogRouter.get("/modules", async (req, res) => {
  const [modules, progress] = await Promise.all([
    db.module.findMany({
      orderBy: { order: "asc" },
      include: { levels: { where: { active: true }, orderBy: { order: "asc" } } },
    }),
    req.user ? db.progress.findMany({ where: { userId: req.user.id } }) : Promise.resolve([]),
  ]);
  const status = new Map(progress.map((p) => [p.levelId, p.status as LevelStatus]));

  const body: ModuleSummary[] = modules.map((m) => {
    const levels = m.levels.map((l) => ({
      id: l.id,
      title: l.title,
      order: l.order,
      type: l.type as LevelDetail["type"],
      difficulty: l.difficulty,
      xp: l.xp,
      blackout: l.blackout,
      bugType: l.bugType,
      status: status.get(l.id) ?? ("todo" as const),
    }));
    return {
      id: m.id,
      code: m.code,
      title: m.title,
      tagline: m.tagline,
      notions: m.notions,
      phase: m.phase as ModuleSummary["phase"],
      order: m.order,
      levels,
      solvedCount: levels.filter((l) => l.status === "solved").length,
    };
  });
  res.json(body);
});

/** Niveau suivant : le suivant dans le module, sinon le premier du module suivant qui en a. */
export async function findNextLevel(levelId: string) {
  const levels = await db.level.findMany({
    where: { active: true },
    orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
    select: { id: true, title: true },
  });
  const i = levels.findIndex((l) => l.id === levelId);
  return i >= 0 ? (levels[i + 1] ?? null) : null;
}

export async function requireLevel(id: string) {
  const [row, loaded] = await Promise.all([
    db.level.findFirst({ where: { id, active: true }, include: { module: true } }),
    getLoadedLevel(id),
  ]);
  if (!row || !loaded) throw notFound("Niveau");
  return { row, loaded };
}

const filesSchema = z
  .array(z.object({ path: z.string(), content: z.string().max(100_000, "Fichier trop volumineux") }))
  .max(30);

/** Seuls les fichiers du code de départ peuvent être modifiés : on ignore tout le reste. */
export function sanitizeFiles(input: unknown, starter: SourceFile[]): SourceFile[] {
  const files = filesSchema.parse(input);
  const allowed = new Set(starter.map((f) => f.path));
  const byPath = new Map(files.filter((f) => allowed.has(f.path)).map((f) => [f.path, f.content]));
  return starter.map((f) => ({ path: f.path, content: byPath.get(f.path) ?? f.content }));
}

catalogRouter.get("/levels/:id", async (req, res) => {
  const { row, loaded } = await requireLevel(String(req.params.id));
  const progress = req.user
    ? await db.progress.findUnique({ where: { userId_levelId: { userId: req.user.id, levelId: row.id } } })
    : null;

  const starter = await readLevelFiles(loaded, "starter");
  const files = progress?.lastCode ? sanitizeFiles(progress.lastCode, starter) : starter;
  const hintsUsed = progress?.hintsUsed ?? 0;
  const solved = progress?.status === "solved";

  const body: LevelDetail = {
    id: row.id,
    title: row.title,
    order: row.order,
    type: row.type as LevelDetail["type"],
    difficulty: row.difficulty,
    xp: row.xp,
    blackout: row.blackout,
    bugType: row.bugType,
    status: (progress?.status as LevelStatus | undefined) ?? "todo",
    module: { id: row.module.id, code: row.module.code, title: row.module.title },
    brief: loaded.config.brief,
    logs: loaded.config.logs ?? null,
    entry: loaded.config.entry,
    files,
    hintCost: row.hintCost,
    hintsTotal: row.hintsCount,
    hintsUnlocked: loaded.config.hints.slice(0, hintsUsed),
    reward: solved ? (progress?.xpEarned ?? 0) : rewardFor(row.xp, hintsUsed, row.hintCost),
    attempts: progress?.attempts ?? 0,
    postmortem: solved ? await readPostmortem(loaded) : null,
    next: await findNextLevel(row.id),
  };
  res.json(body);
});

catalogRouter.get("/levels/:id/starter", async (req, res) => {
  const { loaded } = await requireLevel(String(req.params.id));
  res.json(await readLevelFiles(loaded, "starter"));
});

/** Sauvegarde automatique du brouillon, sans exécuter les tests. */
catalogRouter.put("/levels/:id/draft", requireUser, async (req, res) => {
  const user = currentUser(req);
  const { row, loaded } = await requireLevel(String(req.params.id));
  const files = sanitizeFiles(req.body?.files, await readLevelFiles(loaded, "starter"));
  await db.progress.upsert({
    where: { userId_levelId: { userId: user.id, levelId: row.id } },
    create: { userId: user.id, levelId: row.id, lastCode: asJson(files) },
    update: { lastCode: asJson(files) },
  });
  res.status(204).end();
});

catalogRouter.post("/levels/:id/hints", requireUser, async (req, res) => {
  const user = currentUser(req);
  const { row, loaded } = await requireLevel(String(req.params.id));
  if (row.blackout) throw new HttpError(403, "Mode Blackout : aucun indice disponible. Fais confiance aux logs.");

  const key = { userId_levelId: { userId: user.id, levelId: row.id } };
  const current = await db.progress.findUnique({ where: key });
  const used = current?.hintsUsed ?? 0;
  if (used >= row.hintsCount) throw new HttpError(409, "Tous les indices sont déjà ouverts.");

  const progress = await db.progress.upsert({
    where: key,
    create: { userId: user.id, levelId: row.id, hintsUsed: 1 },
    update: { hintsUsed: { increment: 1 } },
  });
  res.json({
    hintsUnlocked: loaded.config.hints.slice(0, progress.hintsUsed),
    reward: rewardFor(row.xp, progress.hintsUsed, row.hintCost),
  });
});
