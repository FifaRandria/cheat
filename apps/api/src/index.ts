import { watch } from "node:fs";
import { createApp } from "./app.js";
import { syncContent } from "./content/sync.js";
import { db } from "./db.js";
import { env } from "./env.js";

try {
  const r = await syncContent();
  console.log(`[api] contenu synchronisé : ${r.tracks} parcours, ${r.modules} modules, ${r.lessons} leçons, ${r.levels} niveaux (${env.contentDir})`);
} catch (err) {
  console.error("[api] échec de la synchronisation du contenu :", err instanceof Error ? err.message : err);
  console.error("      La base est-elle migrée ? Lance : npm run db:migrate");
  process.exit(1);
}

// En développement : resynchroniser la base dès qu'un fichier de contenu change,
// pour qu'un nouveau niveau ou une nouvelle leçon apparaisse sans redémarrer l'API.
if (!env.isProd) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    watch(env.contentDir, { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        syncContent()
          .then((r) => console.log(`[api] contenu resynchronisé : ${r.lessons} leçons, ${r.levels} niveaux`))
          .catch((err) => console.error("[api] contenu invalide :", err instanceof Error ? err.message : err));
      }, 400);
    });
  } catch {
    console.warn("[api] surveillance du contenu indisponible : lance npm run levels:sync après chaque modification.");
  }
}

const server = createApp().listen(env.API_PORT, () => {
  console.log(`[api] prête sur :${env.API_PORT}`);
});

const shutdown = () => {
  server.close(() => void db.$disconnect().then(() => process.exit(0)));
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
