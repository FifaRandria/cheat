import { enregistrer } from "./stock.js";

export async function passerCommande(panier) {
  try {
    const enregistrement = enregistrer(panier);
    return enregistrement.then((r) => ({ ok: true, id: r.id }));
  } catch (erreur) {
    return { ok: false, erreur: erreur.message };
  }
}
