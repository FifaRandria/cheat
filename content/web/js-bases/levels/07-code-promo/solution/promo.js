const REMISES = {
  BIENVENUE: 0.1,
  VIP: 0.2,
  SOLDES: 0.3,
};

export function totalAvecPromo(prix, code) {
  const cle = (code ?? "").trim().toUpperCase();
  const taux = REMISES[cle] ?? 0;
  const total = prix - prix * taux;
  return Math.round(total * 100) / 100;
}
