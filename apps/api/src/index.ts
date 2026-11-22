import { createApp } from "./app.js";
import { syncContent } from "./content/sync.js";
import { db } from "./db.js";
import { env } from "./env.js";

try {
  const { modules, levels } = await syncContent();
  console.log(`[api] contenu synchronisé : ${modules} modules, ${levels} niveaux (${env.levelsDir})`);
} catch (err) {
  console.error("[api] échec de la synchronisation du contenu :", err instanceof Error ? err.message : err);
  console.error("      La base est-elle migrée ? Lance : npm run db:migrate");
  process.exit(1);
}

const server = createApp().listen(env.API_PORT, () => {
  console.log(`[api] prête sur :${env.API_PORT}`);
});

const shutdown = () => {
  server.close(() => void db.$disconnect().then(() => process.exit(0)));
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
