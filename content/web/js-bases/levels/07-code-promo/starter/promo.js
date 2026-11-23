const REMISES = {
  BIENVENUE: 0.1,
  VIP: 0.2,
  SOLDES: 0.3,
};

// Prix après application du code promo, arrondi au centime
export function totalAvecPromo(prix, code) {
  const taux = REMISES[code.trim()];
  const total = prix - prix * taux;
  return Math.round(total * 100) / 100;
}
