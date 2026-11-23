// Profils des utilisateurs, reçus de l'API des comptes.

export interface Profil {
  nom: string;
  email: string;
  adresse?: { ville: string };
}

type Inconnu = Record<string, unknown>;
const estObjet = (x: unknown): x is Inconnu => typeof x === "object" && x !== null;

/** Vérifie VRAIMENT la forme des données : les types, eux, disparaissent à l'exécution. */
export function lireProfil(donnees: unknown): Profil | null {
  if (!estObjet(donnees)) return null;
  const { nom, email, adresse } = donnees;
  if (typeof nom !== "string" || nom.trim() === "") return null;
  if (typeof email !== "string" || !email.includes("@")) return null;
  if (adresse === undefined) return { nom, email };
  if (!estObjet(adresse) || typeof adresse.ville !== "string") return null;
  return { nom, email, adresse: { ville: adresse.ville } };
}

export function villeAffichee(profil: Profil): string {
  return profil.adresse?.ville.toUpperCase() ?? "Ville inconnue";
}
