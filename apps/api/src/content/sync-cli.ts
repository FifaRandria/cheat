import { db } from "../db.js";
import { syncContent } from "./sync.js";

const result = await syncContent();
console.log(`Contenu synchronisé : ${result.modules} modules, ${result.levels} niveaux.`);
await db.$disconnect();
