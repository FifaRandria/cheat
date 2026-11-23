## Les réflexes de qualité

- `strict: true`, et une vérification des types (`tsc --noEmit`) dans la CI.
- Pas de nouveaux `any` ni `@ts-ignore` : une règle de lint les bloque.
- Un test sans `assert` ne teste rien.
- Un test instable (*flaky*) se corrige, il ne se relance pas : la date, l'aléatoire et le réseau
  s'injectent pour être contrôlés.
- Une CI verte n'a de valeur que si elle vérifie les bonnes choses.
