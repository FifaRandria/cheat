import type { RunRequest, RunResult } from "@rustine/shared";
import { env } from "./env.js";

const infraFailure = (error: string): RunResult => ({
  ok: false, passed: 0, failed: 0, total: 0, durationMs: 0,
  timedOut: false, tests: [], output: "", error,
});

/** Envoie un job au runner. Ne lève jamais : les pannes deviennent un RunResult avec `error`. */
export async function runCode(req: RunRequest): Promise<RunResult> {
  try {
    const res = await fetch(new URL("/run", env.RUNNER_URL), {
      method: "POST",
      headers: { "content-type": "application/json", "x-runner-token": env.RUNNER_TOKEN },
      body: JSON.stringify(req),
      signal: AbortSignal.timeout(30_000),
    });
    const body = (await res.json().catch(() => ({}))) as RunResult & { error?: string };
    if (!res.ok) return infraFailure(body.error ?? `Runner : HTTP ${res.status}`);
    return body;
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    return infraFailure(`Le runner est injoignable (${reason}). Est-il démarré ?`);
  }
}
