import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const here = path.dirname(fileURLToPath(import.meta.url));
const apiRoot = path.resolve(here, "..");

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  API_PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL est requis"),
  WEB_URL: z.string().url().default("http://localhost:3000"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET doit faire au moins 16 caractères"),
  LEVELS_DIR: z.string().default("../../levels"),
  RUNNER_URL: z.string().url().default("http://localhost:4100"),
  RUNNER_TOKEN: z.string().default(""),
  GITHUB_CLIENT_ID: z.string().default(""),
  GITHUB_CLIENT_SECRET: z.string().default(""),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("[api] Configuration invalide :");
  for (const issue of parsed.error.issues) console.error(`  - ${issue.path.join(".")} : ${issue.message}`);
  console.error("  Copie .env.example vers .env à la racine du dépôt, puis complète-le.");
  process.exit(1);
}

export const env = {
  ...parsed.data,
  isProd: parsed.data.NODE_ENV === "production",
  levelsDir: path.resolve(apiRoot, parsed.data.LEVELS_DIR),
  githubEnabled: Boolean(parsed.data.GITHUB_CLIENT_ID && parsed.data.GITHUB_CLIENT_SECRET),
};
