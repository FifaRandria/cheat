import type { SubmitResponse } from "@rustine/shared";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { currentUser, requireUser } from "../auth/session.js";
import { readLevelFiles, readPostmortem } from "../content/loader.js";
import { recordAttempt } from "../game/submit.js";
import { toPublicUser } from "../game/progression.js";
import { HttpError } from "../http.js";
import { runCode } from "../runner-client.js";
import { findNextLevel, requireLevel, sanitizeFiles } from "./catalog.js";

export const playRouter = Router();

/** Quota d'exécution par joueur (section 14 : coûts d'infrastructure). */
const submitLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 12,
  keyGenerator: (req) => req.user?.id ?? "anonyme",
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Doucement : 12 exécutions par minute au maximum. Relis les logs en attendant." },
});

playRouter.post("/levels/:id/submit", requireUser, submitLimiter, async (req, res) => {
  const user = currentUser(req);
  const { row, loaded } = await requireLevel(String(req.params.id));
  const [starter, tests] = await Promise.all([readLevelFiles(loaded, "starter"), readLevelFiles(loaded, "tests")]);
  const files = sanitizeFiles(req.body?.files, starter);

  const result = await runCode({ runtime: loaded.config.runtime, files, tests });
  if (result.error) {
    // Panne d'infrastructure : ce n'est pas la faute du joueur, on ne compte pas la tentative.
    throw new HttpError(502, result.error, { result });
  }

  const outcome = await recordAttempt(user, row, files, result);
  const body: SubmitResponse = {
    result,
    solved: result.ok,
    firstSolve: outcome.firstSolve,
    xpGained: outcome.xpGained,
    user: toPublicUser(outcome.user),
    newBadges: outcome.newBadges,
    postmortem: result.ok ? await readPostmortem(loaded) : null,
    next: result.ok ? await findNextLevel(row.id) : null,
  };
  res.json(body);
});
