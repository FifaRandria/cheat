import { createApp } from "./mini-express.js";

export const app = createApp();

function introuvable(message) {
  const erreur = new Error(message);
  erreur.status = 404;
  return erreur;
}

app.get("/commandes/:id", async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) {
    throw introuvable("Commande introuvable");
  }
  if (req.params.id === "500") {
    throw new Error("Connexion à la base perdue : mot de passe refusé pour admin@db-prod");
  }
  res.json({ id: Number(req.params.id), total: 42 });
});

// Gestionnaire d'erreurs : réponse propre, sans détail interne
app.use((err, req, res) => {
  const status = err.status ?? 500;
  res.status(status).json({ error: status === 500 ? "Erreur interne" : err.message });
});
