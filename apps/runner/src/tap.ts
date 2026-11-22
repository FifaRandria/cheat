import type { TestCaseResult } from "@rustine/shared";

export interface ParsedTap {
  tests: TestCaseResult[];
  /** Lignes écrites par le code du joueur (console.log), remontées en commentaires TAP. */
  logs: string[];
}

const RESULT_LINE = /^(not )?ok \d+ - (.*)$/;
const SUMMARY_LINE = /^# (tests|suites|pass|fail|cancelled|skipped|todo|duration_ms) /;
const SUBTEST_LINE = /^# Subtest: /;

/**
 * Lit la sortie TAP du test runner de Node (node --test).
 * Seuls les tests de premier niveau sont retenus.
 */
export function parseTap(output: string): ParsedTap {
  const lines = output.split(/\r?\n/);
  const tests: TestCaseResult[] = [];
  const logs: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    const match = RESULT_LINE.exec(line);

    if (match) {
      const test: TestCaseResult = { name: unescape(match[2] ?? ""), ok: !match[1] };
      // Bloc YAML de diagnostic, indenté de deux espaces, terminé par « ... »
      if (lines[i + 1]?.trim() === "---") {
        const block: string[] = [];
        i += 2;
        while (i < lines.length && lines[i]?.trim() !== "...") block.push(lines[i++] ?? "");
        const yaml = readYamlBlock(block);
        if (yaml.duration_ms) test.durationMs = Math.round(Number(yaml.duration_ms) * 10) / 10;
        if (!test.ok && yaml.error) test.message = yaml.error;
      }
      tests.push(test);
      continue;
    }

    if (line.startsWith("# ") && !SUMMARY_LINE.test(line) && !SUBTEST_LINE.test(line)) {
      logs.push(line.slice(2));
    }
  }

  return { tests, logs };
}

/** Lecture minimale des clés de premier niveau d'un bloc YAML TAP. */
function readYamlBlock(block: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < block.length; i++) {
    const m = /^ {2}([a-zA-Z_]+): ?(.*)$/.exec(block[i] ?? "");
    if (!m) continue;
    const key = m[1] as string;
    const value = m[2] ?? "";
    if (value === "|-" || value === "|" || value === ">-") {
      const body: string[] = [];
      while (i + 1 < block.length && /^ {4}|^\s*$/.test(block[i + 1] ?? "")) {
        body.push((block[++i] ?? "").replace(/^ {4}/, ""));
      }
      result[key] = body.join("\n").trim();
    } else {
      result[key] = value.replace(/^'(.*)'$/, "$1").replace(/''/g, "'");
    }
  }
  return result;
}

function unescape(name: string): string {
  return name.replace(/\\#/g, "#").replace(/\\\\/g, "\\");
}
