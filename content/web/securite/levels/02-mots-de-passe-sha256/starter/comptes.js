// Stockage des mots de passe des membres.
import { createHash } from "node:crypto";

export function hacherMotDePasse(mdp) {
  return createHash("sha256").update(mdp).digest("hex");
}

export function verifierMotDePasse(mdp, stocke) {
  return hacherMotDePasse(mdp) === stocke;
}
