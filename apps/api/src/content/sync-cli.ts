import { db } from "../db.js";
import { syncContent } from "./sync.js";

const r = await syncContent();
console.log(`Contenu synchronisé : ${r.tracks} parcours, ${r.modules} modules, ${r.lessons} leçons, ${r.levels} niveaux.`);
await db.$disconnect();
