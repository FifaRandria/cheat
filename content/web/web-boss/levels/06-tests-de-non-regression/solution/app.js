// L'API REST de la Boîte à outils.
import { createApp } from "./mini-express.js";
import { emprunter, ErreurMetier, listerOutils, membreParJeton, pretsDuMembre, rendre, trouverPret } from "./depot.js";

const STATUTS = { OUTIL_INCONNU: 404, PRET_INCONNU: 404, DEJA_PRETE: 409, DEJA_RENDU: 409 };

/**
 * db : la base (creerBase()), aujourdhui : une fonction qui donne la date du jour.
 * Les recevoir en paramètres permet de tester l'application avec une base neuve et une date fixe.
 */
export function creerApp(db, aujourdhui = () => new Date().toISOString().slice(0, 10)) {
  const app = createApp();

  /** Middleware : retrouve le membre grâce à l'en-tête « Authorization: Bearer <jeton> ». */
  function authentifier(req, res, next) {
    const [type, jeton] = (req.headers.authorization ?? "").split(" ");
    const membre = type === "Bearer" && jeton ? membreParJeton(db, jeton) : null;
    if (!membre) return res.status(401).json({ erreur: "Connexion requise" });
    req.membre = membre;
    next();
  }

  app.get("/outils", (req, res) => {
    res.json(listerOutils(db, req.query.categorie));
  });

  app.post("/prets", authentifier, (req, res) => {
    const outilId = req.body?.outilId;
    if (!Number.isInteger(outilId) || outilId <= 0) {
      return res.status(400).json({ erreur: "outilId doit être un entier positif" });
    }
    res.status(201).json(emprunter(db, req.membre.id, outilId, aujourdhui()));
  });

  app.post("/prets/:id/retour", authentifier, (req, res) => {
    const pret = trouverPret(db, Number(req.params.id));
    if (pret && pret.membreId !== req.membre.id) {
      return res.status(403).json({ erreur: "Seul l'emprunteur peut rendre cet outil" });
    }
    res.json(rendre(db, Number(req.params.id), aujourdhui()));
  });

  app.get("/membres/:id/prets", authentifier, (req, res) => {
    if (Number(req.params.id) !== req.membre.id) return res.status(403).json({ erreur: "Accès refusé" });
    res.json(pretsDuMembre(db, req.membre.id));
  });

  // Gestionnaire d'erreurs (4 paramètres) : les erreurs métier deviennent des codes HTTP clairs,
  // les autres un 500 sans aucun détail technique pour le client.
  app.use((err, req, res, next) => {
    if (err instanceof ErreurMetier) {
      return res.status(STATUTS[err.code] ?? 400).json({ erreur: err.message, code: err.code });
    }
    console.error(err);
    res.status(500).json({ erreur: "Erreur interne" });
  });

  return app;
}
