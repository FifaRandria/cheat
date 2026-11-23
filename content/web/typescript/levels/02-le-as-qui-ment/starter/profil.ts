// Profils des utilisateurs, reçus de l'API des comptes.

export interface Profil {
  nom: string;
  email: string;
  adresse?: { ville: string };
}

export function lireProfil(donnees: unknown): Profil | null {
  return donnees as Profil;
}

export function villeAffichee(profil: Profil): string {
  return profil.adresse!.ville.toUpperCase();
}
