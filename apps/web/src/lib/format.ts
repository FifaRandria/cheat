/** Titres des rangs, du premier jour d'astreinte à la légende. */
const RANKS = [
  "Stagiaire",
  "Renfort",
  "Dépanneur",
  "Diagnostiqueur",
  "Pompier de prod",
  "Légiste du code",
  "Gardien des logs",
  "Architecte",
  "Oracle",
];

export const rankTitle = (rank: number) => RANKS[Math.min(rank, RANKS.length) - 1] ?? "Oracle";

/** INC-M1-01 : identifiant d'incident affiché sur les tickets. */
export function incidentCode(moduleCode: string, order: number) {
  return `INC-${moduleCode}-${String(order).padStart(2, "0")}`;
}

const BUG_TYPES: Record<string, string> = {
  ecrire: "Écrire à partir des tests",
  accessibilite: "Accessibilité",
  specificite: "Spécificité CSS",
  "mise-en-page": "Mise en page",
  "off-by-one": "Décalage de un",
  "async-await": "await oublié",
  "async-loop": "Boucle async",
  "promise-all": "Échec en cascade",
  "const-reassign": "Constante modifiée",
  "assign-vs-compare": "= au lieu de ===",
  "missing-return": "return oublié",
  "type-mismatch": "Types incompatibles",
  "early-return": "return trop tôt",
  "key-error": "Clé absente",
  "concept-ia": "Concepts d'IA",
  "pipeline": "Ordre des étapes",
  "gestion-projet": "Gestion de projet",
  management: "Management",
  "property-typo": "Propriété mal nommée",
  "missing-next": "next() oublié",
  "http-status": "Mauvais code HTTP",
  "validation": "Validation absente",
  "auth": "Authentification",
  "error-handling": "Erreur non gérée",
  "sql-where": "WHERE oublié",
  "sql-join": "Jointure fausse",
  "sql-injection": "Injection SQL",
  "n-plus-one": "Problème N+1",
  "transaction": "Transaction absente",
  "slice": "Découpage décalé",
  "data-cleaning": "Données sales",
  "missing-values": "Valeurs manquantes",
  "normalization": "Normalisation",
  "similarity": "Similarité fausse",
  "chunk-overlap": "Chunking décalé",
  "top-k": "Mauvais top-k",
  "prompt": "Prompt mal construit",
  "retry": "Réessais",
  "idempotence": "Idempotence",
  "mutation": "État muté",
  "debug-method": "Méthode de diagnostic",
  "git": "Git",
  "http": "HTTP",
  "docker": "Docker",
  "cicd": "CI/CD",
  "risques": "Risques et crises",
  "pilotage": "Pilotage",
};
export const bugTypeLabel = (t: string) => BUG_TYPES[t] ?? t;

const rtf = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

export function relativeTime(iso: string, now = Date.now()) {
  const diff = new Date(iso).getTime() - now;
  const abs = Math.abs(diff);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["day", 86_400_000],
    ["hour", 3_600_000],
    ["minute", 60_000],
  ];
  for (const [unit, ms] of units) {
    if (abs >= ms) return rtf.format(Math.round(diff / ms), unit);
  }
  return "à l'instant";
}

export const plural = (n: number, one: string, many: string) => `${n} ${n > 1 ? many : one}`;
