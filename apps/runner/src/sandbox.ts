import { spawn, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { RunRequest, RunResult, SourceFile } from "@rustine/shared";
import { config } from "./config.js";
import { PYTHON_HARNESS } from "./python-harness.js";
import { parseTap } from "./tap.js";

const SAFE_PATH = /^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*(\/[a-zA-Z0-9_-][a-zA-Z0-9_.-]*)*$/;

export class ValidationError extends Error {}

export function validateRequest(body: unknown): RunRequest {
  const req = body as Partial<RunRequest> | null;
  if (!req || typeof req !== "object") throw new ValidationError("Corps de requête invalide");
  if (req.runtime !== "node" && req.runtime !== "python") {
    throw new ValidationError("runtime doit valoir node ou python");
  }
  const files = checkFiles(req.files, "files");
  const tests = checkFiles(req.tests, "tests");
  const total = [...files, ...tests].reduce((n, f) => n + Buffer.byteLength(f.content), 0);
  if (files.length + tests.length > config.limits.maxFiles) {
    throw new ValidationError("Trop de fichiers");
  }
  if (total > config.limits.maxTotalBytes) throw new ValidationError("Code trop volumineux");
  return { runtime: req.runtime, files, tests };
}

function checkFiles(value: unknown, field: string): SourceFile[] {
  if (!Array.isArray(value)) throw new ValidationError(`${field} doit être un tableau`);
  return value.map((f: Partial<SourceFile>) => {
    if (typeof f?.path !== "string" || typeof f.content !== "string") {
      throw new ValidationError(`${field} : chaque fichier doit avoir path et content`);
    }
    if (!SAFE_PATH.test(f.path) || f.path.includes("..")) {
      throw new ValidationError(`${field} : chemin refusé (${f.path})`);
    }
    return { path: f.path, content: f.content };
  });
}

/** Exécute les tests d'un niveau dans un bac à sable et renvoie un résultat structuré. */
export async function runJob(req: RunRequest): Promise<RunResult> {
  const id = randomUUID();
  const dir = path.join(config.jobsDir, id);
  const started = Date.now();

  try {
    await mkdir(path.join(dir, "src"), { recursive: true });
    await mkdir(path.join(dir, "tests"), { recursive: true });
    for (const f of req.files) await writeInside(dir, "src", f);
    for (const f of req.tests) await writeInside(dir, "tests", f);

    const command = await prepareRuntime(req, dir);
    if (typeof command === "string") return failure(command);

    const exec = config.mode === "docker" ? await execDocker(id, dir, command) : await execLocal(dir, command);

    const { tests, logs } = parseTap(hidePaths(exec.output, dir));
    const passed = tests.filter((t) => t.ok).length;
    const failed = tests.length - passed;

    return {
      ok: !exec.timedOut && exec.exitCode === 0 && failed === 0 && tests.length > 0,
      passed,
      failed,
      total: tests.length,
      durationMs: Date.now() - started,
      timedOut: exec.timedOut,
      tests,
      output: buildOutput(logs, hidePaths(exec.output, dir), exec.timedOut),
    };
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => undefined);
  }
}

async function writeInside(root: string, sub: string, file: SourceFile) {
  const target = path.resolve(root, sub, file.path);
  // Garde-fou supplémentaire contre l'écriture hors du dossier du job.
  if (!target.startsWith(path.resolve(root, sub) + path.sep)) {
    throw new ValidationError(`Chemin refusé (${file.path})`);
  }
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, file.content);
}

interface ExecResult {
  output: string;
  exitCode: number | null;
  timedOut: boolean;
}

/** Commande à lancer selon le langage du niveau. */
interface RuntimeCommand {
  image: string;
  /** argv dans le conteneur (chemins relatifs à /work) */
  argv: string[];
  /** argv en mode unsafe-local */
  localArgv: [string, ...string[]];
  env: Record<string, string>;
}

async function prepareRuntime(req: RunRequest, dir: string): Promise<RuntimeCommand | string> {
  if (req.runtime === "python") {
    const tests = req.tests.filter((t) => /^test_[\w-]*\.py$/.test(path.basename(t.path)));
    if (tests.length === 0) return "Aucun fichier tests/test_*.py fourni.";
    await writeFile(path.join(dir, "harness.py"), PYTHON_HARNESS);
    return {
      image: config.pythonImage,
      argv: ["python", "harness.py"],
      localArgv: [config.pythonBin, "harness.py"],
      env: { PYTHONDONTWRITEBYTECODE: "1", PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" },
    };
  }

  const testFiles = req.tests
    .map((t) => `tests/${t.path}`)
    .filter((p) => /\.test\.(m?js)$/.test(p))
    .sort();
  if (testFiles.length === 0) return "Aucun fichier *.test.js fourni.";
  await writeFile(path.join(dir, "package.json"), '{ "type": "module" }\n');
  const args = ["--test", "--test-reporter=tap", ...testFiles];
  // NODE_NO_WARNINGS : masque l'avertissement « SQLite expérimental » de node:sqlite dans la sortie du joueur.
  return {
    image: config.image,
    argv: ["node", ...args],
    localArgv: [process.execPath, ...args],
    env: { NODE_NO_WARNINGS: "1" },
  };
}

function execDocker(id: string, dir: string, command: RuntimeCommand): Promise<ExecResult> {
  const name = `rustine-job-${id}`;
  const args = [
    "run", "--rm", "--name", name,
    "--network", "none",
    "--memory", config.limits.memory, "--memory-swap", config.limits.memory,
    "--cpus", config.limits.cpus,
    "--pids-limit", String(config.limits.pids),
    "--read-only",
    "--tmpfs", "/tmp:rw,noexec,nosuid,size=16m",
    "--cap-drop", "ALL",
    "--security-opt", "no-new-privileges",
    "--user", "1000:1000",
    "-v", `${dir}:/work:ro`,
    "-w", "/work",
    ...Object.entries(command.env).flatMap(([k, v]) => ["-e", `${k}=${v}`]),
    command.image,
    ...command.argv,
  ];
  return execProcess("docker", args, {}, () => {
    spawnSync("docker", ["kill", name], { stdio: "ignore" });
  });
}

function execLocal(dir: string, command: RuntimeCommand): Promise<ExecResult> {
  // DEV UNIQUEMENT : aucune isolation. Le code tourne avec les droits du runner.
  const [bin, ...args] = command.localArgv;
  return execProcess(
    bin,
    args,
    { cwd: dir, env: { PATH: process.env.PATH ?? "", SYSTEMROOT: process.env.SYSTEMROOT ?? "", ...command.env } },
    () => undefined,
  );
}

function execProcess(
  cmd: string,
  args: string[],
  opts: { cwd?: string; env?: NodeJS.ProcessEnv },
  onTimeout: () => void,
): Promise<ExecResult> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { ...opts, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    let timedOut = false;

    const append = (chunk: Buffer) => {
      if (output.length < config.maxOutput) output += chunk.toString("utf8");
    };
    child.stdout.on("data", append);
    child.stderr.on("data", append);

    const timer = setTimeout(() => {
      timedOut = true;
      onTimeout();
      child.kill("SIGKILL");
    }, config.timeoutMs);

    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({ output: `Impossible de lancer ${cmd} : ${err.message}`, exitCode: null, timedOut: false });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ output: output.slice(0, config.maxOutput), exitCode: code, timedOut });
    });
  });
}

function buildOutput(logs: string[], raw: string, timedOut: boolean): string {
  const parts: string[] = [];
  if (logs.length) parts.push(logs.join("\n"));
  if (timedOut) {
    parts.push(`⏱ Temps limite dépassé (${config.timeoutMs / 1000} s). Boucle infinie ? Promesse jamais résolue ?`);
  }
  // Sans aucun test reconnu, la sortie brute est la seule piste (erreur de syntaxe, import cassé…).
  if (!/^(not )?ok \d+ - /m.test(raw)) parts.push(raw.trim());
  return parts.join("\n\n").trim();
}

/** Remplace le chemin réel du job par /work, pour des messages lisibles et sans fuite d'info. */
function hidePaths(text: string, dir: string): string {
  const variants = [
    dir.replace(/\\/g, "\\\\"),
    dir,
    "file:///" + dir.replace(/\\/g, "/").replace(/^\//, ""),
    dir.replace(/\\/g, "/"),
  ];
  let out = text.replace(/file:\/\/\/work\//g, "/work/");
  for (const v of variants) out = out.split(v).join("/work");
  return out.replace(/\/work\\\\/g, "/work/").replace(/\/work\\/g, "/work/");
}

function failure(message: string): RunResult {
  return {
    ok: false, passed: 0, failed: 0, total: 0, durationMs: 0,
    timedOut: false, tests: [], output: "", error: message,
  };
}
