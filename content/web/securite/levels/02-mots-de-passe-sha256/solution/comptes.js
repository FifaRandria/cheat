// Stockage des mots de passe des membres.
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const LONGUEUR = 64;

export function hacherMotDePasse(mdp) {
  const sel = randomBytes(16).toString("hex");
  const empreinte = scryptSync(mdp, sel, LONGUEUR).toString("hex");
  return `${sel}:${empreinte}`;
}

export function verifierMotDePasse(mdp, stocke) {
  const [sel, empreinte] = String(stocke).split(":");
  if (!sel || !empreinte || !/^[0-9a-f]+$/.test(empreinte)) return false;

  const attendu = Buffer.from(empreinte, "hex");
  if (attendu.length !== LONGUEUR) return false;
  const calcule = scryptSync(mdp, sel, LONGUEUR);
  return timingSafeEqual(calcule, attendu);
}
