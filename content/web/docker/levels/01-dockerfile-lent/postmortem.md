## Pourquoi cet ordre

Docker réutilise une couche en cache si l'instruction **et tout ce qui la précède** n'ont pas
changé.

- Avec `COPY . .` **avant** `npm ci`, la moindre modification du code invalide le cache de cette
  couche, et donc de **toutes les suivantes** : l'installation repart de zéro.
- Avec `package.json` copié **seul**, puis `npm ci`, puis le reste du code, une modification du
  code n'invalide que la dernière couche. Le build passe de 6 minutes à quelques secondes.

## Le réflexe à garder

Ce qui change **rarement** en haut, ce qui change **souvent** en bas. Et un `.dockerignore`
pour ne pas copier `node_modules`, `.git` ni `.env`.
