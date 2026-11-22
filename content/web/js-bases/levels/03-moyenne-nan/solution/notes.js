export function moyenne(notes) {
  if (notes.length === 0) {
    return 0;
  }

  let somme = 0;
  for (let i = 0; i < notes.length; i++) {
    somme = somme + notes[i];
  }

  return somme / notes.length;
}
