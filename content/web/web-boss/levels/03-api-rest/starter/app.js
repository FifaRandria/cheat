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

  // ---------------------------------------------------------------------------
  // À toi d'écrire les routes et le gestionnaire d'erreurs (voir l'énoncé).
  //
  //   GET  /outils                 ?categorie=…   public
  //   POST /prets                  { outilId }    connecté (authentifier)
  //   POST /prets/:id/retour                      connecté
  //
  // Les fonctions du dépôt lèvent des ErreurMetier : le tableau STATUTS donne le code HTTP
  // de chacune. Rappel : un gestionnaire d'erreurs a exactement 4 paramètres.
  // ---------------------------------------------------------------------------

  return app;
}
