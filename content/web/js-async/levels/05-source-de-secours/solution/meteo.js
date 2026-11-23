export async function chargerAvecSecours(sources) {
  for (const source of sources) {
    try {
      const donnees = await source.charger();
      return { source: source.nom, donnees };
    } catch {
      // Cette source est en panne : on passe à la suivante.
    }
  }
  throw new Error("toutes les sources ont échoué");
}
