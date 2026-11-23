// Classement du concours de code.

export function scoresTries(scores) {
  return scores.sort();
}

export function podium(participants) {
  const scores = participants.map((p) => p.score);
  const meilleurs = scoresTries(scores).reverse().slice(0, 3);
  return meilleurs.map((s) => participants.find((p) => p.score === s).nom);
}
