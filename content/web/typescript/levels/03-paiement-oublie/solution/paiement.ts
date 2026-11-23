// Moyens de paiement de la boutique.

export type Paiement =
  | { type: "carte"; numero: string }
  | { type: "virement"; iban: string }
  | { type: "especes" };

/** Appelée quand un cas n'est pas traité : erreur de compilation ET erreur claire à l'exécution. */
function inconnu(p: never): never {
  throw new Error(`type de paiement inconnu : ${(p as { type?: unknown }).type}`);
}

export function libelle(p: Paiement): string {
  switch (p.type) {
    case "carte":
      return `Carte •••• ${p.numero.slice(-4)}`;
    case "virement":
      return `Virement ${p.iban.slice(0, 4)}…`;
    case "especes":
      return "Espèces";
    default:
      return inconnu(p);
  }
}

export function frais(p: Paiement, montant: number): number {
  switch (p.type) {
    case "carte":
      return Math.round(montant * 0.015 * 100) / 100;
    case "virement":
    case "especes":
      return 0;
    default:
      return inconnu(p);
  }
}
