/**
 * Exécute un extrait JavaScript de leçon dans un Web Worker jetable :
 * pas d'accès à la page, au DOM ni aux cookies, et arrêt forcé au bout de quelques secondes.
 * La sortie imite celle de Node (console.log d'objets, de tableaux, de promesses…).
 */

export interface ConsoleLine {
  kind: "log" | "error" | "warn" | "info";
  text: string;
}

const WORKER_SOURCE = String.raw`
const fmt = (v, depth = 0, top = true) => {
  if (typeof v === "string") return top ? v : "'" + v + "'";
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (typeof v === "number" || typeof v === "boolean" || typeof v === "bigint") return String(v);
  if (typeof v === "function") return "[Function: " + (v.name || "(anonyme)") + "]";
  if (v instanceof Error) return v.name + ": " + v.message;
  if (v instanceof Promise) return "Promise { <pending> }";
  if (depth > 2) return Array.isArray(v) ? "[Array]" : "[Object]";
  if (Array.isArray(v)) {
    const items = v.map((x) => fmt(x, depth + 1, false));
    const one = "[ " + items.join(", ") + " ]";
    return v.length === 0 ? "[]" : one.length <= 72 ? one : "[\n" + items.map((i) => "  ".repeat(depth + 1) + i).join(",\n") + "\n" + "  ".repeat(depth) + "]";
  }
  const keys = Object.keys(v);
  if (keys.length === 0) return "{}";
  const items = keys.map((k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : "'" + k + "'") + ": " + fmt(v[k], depth + 1, false));
  const one = "{ " + items.join(", ") + " }";
  return one.length <= 72 ? one : "{\n" + items.map((i) => "  ".repeat(depth + 1) + i).join(",\n") + "\n" + "  ".repeat(depth) + "}";
};
const send = (kind, args) => self.postMessage({ kind, text: args.map((a) => fmt(a)).join(" ") });
console.log = (...a) => send("log", a);
console.info = (...a) => send("info", a);
console.warn = (...a) => send("warn", a);
console.error = (...a) => send("error", a);
const describe = (e) => (e && e.name ? e.name + ": " + e.message : "Uncaught " + fmt(e, 0, false));
self.addEventListener("unhandledrejection", (ev) => { ev.preventDefault(); send("error", [describe(ev.reason)]); });
self.onmessage = async (e) => {
  try {
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    await new AsyncFunction(e.data)();
  } catch (err) {
    send("error", [describe(err)]);
  }
  self.postMessage({ kind: "done" });
};
`;

let workerUrl: string | null = null;

export function runSnippet(
  code: string,
  onLine: (line: ConsoleLine) => void,
  { hardLimitMs = 5000, idleMs = 1500 } = {},
): Promise<{ timedOut: boolean }> {
  workerUrl ??= URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
  const worker = new Worker(workerUrl);

  return new Promise((resolve) => {
    let finished = false;
    let mainDone = false;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;

    const stop = (timedOut: boolean) => {
      if (finished) return;
      finished = true;
      clearTimeout(hard);
      clearTimeout(idleTimer);
      worker.terminate();
      resolve({ timedOut });
    };
    // Le code peut programmer des setTimeout : on attend un peu de silence avant d'arrêter.
    const armIdle = () => {
      clearTimeout(idleTimer);
      if (mainDone) idleTimer = setTimeout(() => stop(false), idleMs);
    };
    const hard = setTimeout(() => stop(true), hardLimitMs);

    worker.onmessage = (e: MessageEvent<{ kind: string; text?: string }>) => {
      if (e.data.kind === "done") mainDone = true;
      else onLine({ kind: e.data.kind as ConsoleLine["kind"], text: e.data.text ?? "" });
      armIdle();
    };
    worker.onerror = (e) => {
      e.preventDefault();
      onLine({ kind: "error", text: e.message.replace(/^Uncaught /, "") });
      armIdle();
    };
    worker.postMessage(code);
  });
}
