import { timingSafeEqual } from "node:crypto";
import { mkdir } from "node:fs/promises";
import express, { type NextFunction, type Request, type Response } from "express";
import { config } from "./config.js";
import { JobQueue } from "./queue.js";
import { runJob, validateRequest, ValidationError } from "./sandbox.js";

const queue = new JobQueue(config.concurrency, config.maxQueue);
const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "512kb" }));

function requireToken(req: Request, res: Response, next: NextFunction) {
  const given = Buffer.from(req.header("x-runner-token") ?? "");
  const expected = Buffer.from(config.token);
  if (!config.token || given.length !== expected.length || !timingSafeEqual(given, expected)) {
    res.status(401).json({ error: "Jeton du runner invalide" });
    return;
  }
  next();
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, mode: config.mode, ...queue.stats });
});

app.post("/run", requireToken, async (req, res) => {
  let job;
  try {
    job = validateRequest(req.body);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
  if (queue.isFull()) {
    res.status(503).json({ error: "Le runner est saturé, réessaie dans quelques secondes." });
    return;
  }
  res.json(await queue.run(() => runJob(job)));
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[runner]", err);
  res.status(500).json({ error: "Erreur interne du runner" });
});

await mkdir(config.jobsDir, { recursive: true });
app.listen(config.port, () => {
  console.log(`[runner] prêt sur :${config.port} (mode ${config.mode}, ${config.concurrency} jobs en parallèle)`);
  if (config.mode === "unsafe-local") {
    console.warn("[runner] ⚠ MODE unsafe-local : le code des joueurs s'exécute SANS isolation. Développement uniquement.");
  }
  if (!config.token) console.warn("[runner] ⚠ RUNNER_TOKEN vide : toutes les requêtes seront refusées.");
});
