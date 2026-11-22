import type { LessonCompleteResponse, LessonDetail } from "@rustine/shared";
import { Router } from "express";
import { currentUser, requireUser } from "../auth/session.js";
import { getLoadedLesson } from "../content/loader.js";
import { db } from "../db.js";
import { nextStreak, toPublicUser } from "../game/progression.js";
import { awardLessonBadges } from "../game/submit.js";
import { notFound } from "../http.js";

export const lessonsRouter = Router();

async function requireLesson(id: string) {
  const [row, loaded] = await Promise.all([
    db.lesson.findFirst({ where: { id, active: true }, include: { module: { include: { track: true } } } }),
    getLoadedLesson(id),
  ]);
  if (!row || !loaded) throw notFound("Leçon");
  return { row, loaded };
}

lessonsRouter.get("/lessons/:id", async (req, res) => {
  const { row, loaded } = await requireLesson(String(req.params.id));
  const userId = req.user?.id;

  const [siblings, done, levels, solved] = await Promise.all([
    db.lesson.findMany({ where: { moduleId: row.moduleId, active: true }, orderBy: { order: "asc" } }),
    userId ? db.lessonProgress.findMany({ where: { userId, lesson: { moduleId: row.moduleId } } }) : Promise.resolve([]),
    db.level.findMany({ where: { moduleId: row.moduleId, active: true }, orderBy: { order: "asc" } }),
    userId
      ? db.progress.findMany({ where: { userId, status: "solved", level: { moduleId: row.moduleId } } })
      : Promise.resolve([]),
  ]);
  const doneSet = new Set(done.map((d) => d.lessonId));
  const solvedSet = new Set(solved.map((s) => s.levelId));
  const i = siblings.findIndex((s) => s.id === row.id);
  const pick = (l: { id: string; title: string } | undefined) => (l ? { id: l.id, title: l.title } : null);
  const practice = levels.find((l) => !solvedSet.has(l.id)) ?? levels[0];

  const body: LessonDetail = {
    id: row.id,
    title: row.title,
    order: row.order,
    minutes: row.minutes,
    summary: row.summary,
    completed: doneSet.has(row.id),
    xp: row.xp,
    body: loaded.body,
    check: loaded.meta.check.map((q) => ({
      prompt: q.prompt,
      choices: q.choices,
      answer: q.answer,
      explain: q.explain ?? null,
    })),
    module: { id: row.module.id, code: row.module.code, title: row.module.title },
    track: { id: row.module.track?.id ?? "", title: row.module.track?.title ?? "" },
    siblings: siblings.map((s) => ({
      id: s.id,
      title: s.title,
      order: s.order,
      minutes: s.minutes,
      summary: s.summary,
      completed: doneSet.has(s.id),
    })),
    prev: pick(siblings[i - 1]),
    next: pick(siblings[i + 1]),
    practice: pick(practice),
  };
  res.json(body);
});

/** Marque une leçon comme terminée. L'XP n'est gagnée qu'une fois. */
lessonsRouter.post("/lessons/:id/complete", requireUser, async (req, res) => {
  const user = currentUser(req);
  const { row } = await requireLesson(String(req.params.id));
  const key = { userId_lessonId: { userId: user.id, lessonId: row.id } };
  const already = await db.lessonProgress.findUnique({ where: key });

  const now = new Date();
  const streak = nextStreak(user, now);
  const xpGained = already ? 0 : row.xp;

  const [, updated] = await db.$transaction([
    db.lessonProgress.upsert({ where: key, create: { userId: user.id, lessonId: row.id }, update: {} }),
    db.user.update({
      where: { id: user.id },
      data: { xp: { increment: xpGained }, streak, bestStreak: Math.max(user.bestStreak, streak), lastActiveOn: now },
    }),
  ]);

  const body: LessonCompleteResponse = {
    xpGained,
    user: toPublicUser(updated),
    newBadges: await awardLessonBadges(updated),
  };
  res.json(body);
});
