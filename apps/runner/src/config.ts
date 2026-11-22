import os from "node:os";
import path from "node:path";

export type RunnerMode = "docker" | "unsafe-local";

const mode = (process.env.RUNNER_MODE ?? "docker") as RunnerMode;
if (mode !== "docker" && mode !== "unsafe-local") {
  throw new Error(`RUNNER_MODE invalide : ${String(mode)} (attendu : docker | unsafe-local)`);
}

export const config = {
  port: Number(process.env.RUNNER_PORT ?? 4100),
  token: process.env.RUNNER_TOKEN ?? "",
  mode,
  image: process.env.RUNNER_IMAGE ?? "node:22-alpine",
  timeoutMs: Number(process.env.RUNNER_TIMEOUT_MS ?? 8000),
  concurrency: Number(process.env.RUNNER_CONCURRENCY ?? 4),
  maxQueue: Number(process.env.RUNNER_MAX_QUEUE ?? 50),
  jobsDir: path.resolve(process.env.RUNNER_JOBS_DIR ?? path.join(os.tmpdir(), "rustine-jobs")),
  /** Taille maximale de la sortie conservée (octets). */
  maxOutput: 64 * 1024,
  limits: {
    memory: "128m",
    cpus: "0.5",
    pids: 64,
    maxFiles: 30,
    maxTotalBytes: 200 * 1024,
  },
};
