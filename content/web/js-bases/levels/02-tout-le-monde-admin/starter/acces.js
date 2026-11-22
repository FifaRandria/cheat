// Seuls les administrateurs peuvent supprimer un article.
export function peutSupprimer(utilisateur) {
  if (utilisateur.role = "admin") {
    return true;
  }
  return false;
}
