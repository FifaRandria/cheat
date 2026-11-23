// API de facturation.
import { createApp } from "./mini-express.js";

export function creerApp() {
  const utilisateurs = [
    { id: 1, nom: "Ada", email: "ada@atelier.example", role: "membre", jeton: "jeton-ada" },
    { id: 2, nom: "Bob", email: "bob@atelier.example", role: "membre", jeton: "jeton-bob" },
    { id: 3, nom: "Root", email: "root@atelier.example", role: "admin", jeton: "jeton-root" },
  ];
  const factures = [
    { id: 41, clientId: 1, montant: 120 },
    { id: 42, clientId: 2, montant: 560 },
  ];

  const app = createApp();

  function authentifier(req, res, next) {
    const jeton = (req.headers.authorization ?? "").replace("Bearer ", "");
    req.utilisateur = utilisateurs.find((u) => u.jeton === jeton);
    if (!req.utilisateur) return res.status(401).json({ erreur: "Connexion requise" });
    next();
  }

  const publicUtilisateur = ({ id, nom, email, role }) => ({ id, nom, email, role });

  app.get("/factures/:id", authentifier, (req, res) => {
    const facture = factures.find((f) => f.id === Number(req.params.id));
    if (!facture) return res.status(404).json({ erreur: "Facture introuvable" });
    res.json(facture);
  });

  app.put("/profil", authentifier, (req, res) => {
    Object.assign(req.utilisateur, req.body);
    res.json(publicUtilisateur(req.utilisateur));
  });

  app.get("/admin/utilisateurs", authentifier, (req, res) => {
    if (req.headers["x-role"] !== "admin" && req.utilisateur.role !== "admin") {
      return res.status(403).json({ erreur: "Réservé aux administrateurs" });
    }
    if (req.headers["x-role"] === "admin" || req.utilisateur.role === "admin") {
      return res.json(utilisateurs.map(publicUtilisateur));
    }
  });

  return app;
}
