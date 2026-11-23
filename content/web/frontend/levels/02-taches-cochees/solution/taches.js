export function basculer(taches, id) {
  return taches.map((t) => (t.id === id ? { ...t, fait: !t.fait } : t));
}

export function trierParTitre(taches) {
  return [...taches].sort((a, b) => a.titre.localeCompare(b.titre));
}
