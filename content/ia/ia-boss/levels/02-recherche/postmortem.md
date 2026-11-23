## Ce qu'il fallait écrire

- `decouper` : un passage par paragraphe, en gardant le **titre** de la section. Sans lui, la
  question « quels sont les horaires ? » ne trouvait rien : le mot « horaires » n'est que dans
  le titre.
- `rechercher` : un score par passage, un **seuil**, un tri décroissant, puis les `k` premiers.

## Le seuil, c'est le droit de dire « je ne sais pas »

Sans seuil, la question « capitale du Pérou » renverrait quand même les deux passages « les moins
éloignés ». Le modèle recevrait alors des documents sans rapport, et risquerait d'inventer une
réponse. Une liste vide permet au prompt de dire honnêtement : « aucun document pertinent ».

## Le réflexe à garder

- Le découpage décide de ce que la recherche peut trouver : garder le contexte (titre, section).
- Un seuil de pertinence, réglé sur le jeu d'évaluation.
- Un vrai modèle d'embeddings rapprocherait « prolonger » et « prolongée » ; le nôtre compare des
  mots, mais l'architecture est la même.
