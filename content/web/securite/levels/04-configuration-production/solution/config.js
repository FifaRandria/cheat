// Configuration de l'API, lue depuis les variables d'environnement.

const SEPT_JOURS = 7 * 24 * 60 * 60 * 1000;

export function chargerConfig(env) {
  const production = env.NODE_ENV === "production";

  // En production, pas de secret par défaut : mieux vaut refuser de démarrer.
  const jwtSecret = env.JWT_SECRET ?? (production ? undefined : "secret-de-developpement-uniquement");
  if (production && (!jwtSecret || jwtSecret.length < 32)) {
    throw new Error("JWT_SECRET manquant ou trop court (32 caractères minimum) : refus de démarrer");
  }

  const origines = (env.ORIGINES ?? "http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  return {
    port: Number(env.PORT ?? 3000),
    jwtSecret,
    cookie: {
      httpOnly: true,
      secure: production,
      sameSite: "lax",
      maxAge: SEPT_JOURS,
    },
    origineAutorisee: (origine) => origines.includes(origine),
  };
}
