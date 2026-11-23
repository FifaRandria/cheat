import type { RunResult, SubmitResponse } from "@rustine/shared";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { currentUser, requireUser } from "../auth/session.js";
import { gradeOrdering, gradeQuiz } from "../content/interactive.js";
import { isCodeLevel, readLevelFiles } from "../content/loader.js";
import { recordAttempt } from "../game/submit.js";
import { toPublicUser } from "../game/progression.js";
import { HttpError } from "../http.js";
import { runCode } from "../runner-client.js";
import { findNextLevel, levelPostmortem, requireLevel, sanitizeFiles } from "./catalog.js";

export const playRouter = Router();

/** Quota d'exécution par joueur (section 14 : coûts d'infrastructure). */
const submitLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 12,
  keyGenerator: (req) => req.user?.id ?? "anonyme",
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Doucement : 12 soumissions par minute au maximum. Relis l'énoncé en attendant." },
});

playRouter.post("/levels/:id/submit", requireUser, submitLimiter, async (req, res) => {
  const user = currentUser(req);
  const { row, loaded } = await requireLevel(String(req.params.id));
  const config = loaded.config;

  let result: RunResult;
  let saved: unknown;

  if (config.type === "quiz") {
    result = gradeQuiz(config, req.body?.answers);
    saved = { answers: req.body?.answers ?? [] };
  } else if (config.type === "ordering") {
    result = gradeOrdering(config, req.body?.order);
    saved = { order: req.body?.order ?? [] };
  } else {
    const [starter, tests] = await Promise.all([readLevelFiles(loaded, "starter"), readLevelFiles(loaded, "tests")]);
    const files = sanitizeFiles(req.body?.files, starter);
    result = await runCode({ runtime: config.runtime, files, tests });
    if (result.error) {
      // Panne d'infrastructure : ce n'est pas la faute du joueur, on ne compte pas la tentative.
      throw new HttpError(502, result.error, { result });
    }
    saved = files;
  }

  const outcome = await recordAttempt(user, row, saved, result, isCodeLevel(config.type));
  const body: SubmitResponse = {
    result,
    solved: result.ok,
    firstSolve: outcome.firstSolve,
    xpGained: outcome.xpGained,
    user: toPublicUser(outcome.user),
    newBadges: outcome.newBadges,
    reviewed: outcome.reviewed,
    postmortem: result.ok ? await levelPostmortem(loaded) : null,
    next: result.ok ? await findNextLevel(row.id) : null,
  };
  res.json(body);
});
