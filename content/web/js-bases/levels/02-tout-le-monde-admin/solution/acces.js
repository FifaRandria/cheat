export function peutSupprimer(utilisateur) {
  if (utilisateur.role === "admin") {
    return true;
  }
  return false;
}
