import { enregistrer } from "./stock.js";

export async function passerCommande(panier) {
  try {
    const r = await enregistrer(panier);
    return { ok: true, id: r.id };
  } catch (erreur) {
    return { ok: false, erreur: erreur.message };
  }
}
