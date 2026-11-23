import { createApp } from "./mini-express.js";

export const journal = [];
export const app = createApp();

// Journalise chaque requête (et signale les requêtes lentes à venir)
app.use((req, res, next) => {
  journal.push(`${req.method} ${req.path}`);
  if (req.path.startsWith("/rapports")) {
    journal.push("attention : requête potentiellement lente");
    next();
  }
});

app.get("/sante", (req, res) => res.json({ ok: true }));

app.get("/produits", (req, res) => {
  res.json([
    { id: 1, nom: "Clavier" },
    { id: 2, nom: "Souris" },
  ]);
});
