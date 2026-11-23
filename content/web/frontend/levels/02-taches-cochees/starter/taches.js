// Logique de la liste de tâches (utilisée avec un historique « Annuler »).

export function basculer(taches, id) {
  return taches.map((t) => {
    if (t.id === id) {
      t.fait = !t.fait;
    }
    return t;
  });
}

export function trierParTitre(taches) {
  return taches.sort((a, b) => a.titre.localeCompare(b.titre));
}
