// Configuration de l'API, lue depuis les variables d'environnement.

export function chargerConfig(env) {
  return {
    port: Number(env.PORT ?? 3000),
    jwtSecret: env.JWT_SECRET ?? "dev-secret",
    cookie: {
      httpOnly: false,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 365,
    },
    origineAutorisee: (origine) => origine.includes(env.ORIGINES ?? "localhost:3000"),
  };
}
