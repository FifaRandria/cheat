// Calcule la moyenne d'une liste de notes.
export function moyenne(notes) {
  let somme = 0;

  for (let i = 0; i <= notes.length; i++) {
    somme = somme + notes[i];
  }

  return somme / notes.length;
}
