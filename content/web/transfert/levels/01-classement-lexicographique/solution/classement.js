// Classement du concours de code.

export function scoresTries(scores) {
  // Une copie, puis un tri NUMÉRIQUE : sans comparateur, sort() compare des textes.
  return [...scores].sort((a, b) => a - b);
}

export function podium(participants) {
  return [...participants]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((p) => p.nom);
}
