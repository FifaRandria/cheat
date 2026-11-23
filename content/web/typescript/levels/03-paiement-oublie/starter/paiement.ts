// Moyens de paiement de la boutique.

export type Paiement =
  | { type: "carte"; numero: string }
  | { type: "virement"; iban: string }
  | { type: "especes" };

export function libelle(p: Paiement): string {
  switch (p.type) {
    case "carte":
      return `Carte •••• ${p.numero.slice(-4)}`;
    case "virement":
      return `Virement ${p.iban.slice(0, 4)}…`;
  }
  return undefined as unknown as string;
}

export function frais(p: Paiement, montant: number): number {
  let taux;
  if (p.type === "carte") taux = 0.015;
  if (p.type === "virement") taux = 0;
  return Math.round(montant * taux * 100) / 100;
}
