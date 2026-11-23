// Tests de non-régression de l'API : ils protègent les règles de l'association.
import assert from "node:assert/strict";

const ADA = { authorization: "Bearer jeton-ada" };

export async function verifierApi(nouvelleApp) {
  // 1. Le filtre par catégorie ne renvoie que la catégorie demandée.
  {
    const app = nouvelleApp();
    const res = await app.handle({ method: "GET", path: "/outils", query: { categorie: "electro" } });
    assert.equal(res.status, 200);
    assert.ok(res.body.length > 0, "il existe des outils electro");
    assert.ok(
      res.body.every((o) => o.categorie === "electro"),
      "le filtre categorie=electro renvoie d'autres catégories",
    );
  }

  // 2. Emprunter sans être connecté est refusé.
  {
    const app = nouvelleApp();
    const res = await app.handle({ method: "POST", path: "/prets", headers: {}, body: { outilId: 1 } });
    assert.equal(res.status, 401, "un emprunt anonyme doit être refusé");
  }

  // 3. Un outil déjà prêté ne peut pas être emprunté une seconde fois.
  {
    const app = nouvelleApp();
    const premier = await app.handle({ method: "POST", path: "/prets", headers: ADA, body: { outilId: 1 } });
    assert.equal(premier.status, 201);
    const second = await app.handle({ method: "POST", path: "/prets", headers: ADA, body: { outilId: 1 } });
    assert.equal(second.status, 409, "le double emprunt doit répondre 409");
  }

  // 4. Seul l'emprunteur peut rendre un outil (le prêt 1 appartient à Bob).
  {
    const app = nouvelleApp();
    const res = await app.handle({ method: "POST", path: "/prets/1/retour", headers: ADA });
    assert.equal(res.status, 403, "Ada ne doit pas pouvoir rendre le prêt de Bob");
  }
}
