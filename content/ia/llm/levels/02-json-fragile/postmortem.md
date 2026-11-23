## Cause racine

Le script faisait une confiance totale au modèle : `json.loads(texte)`, et c'est tout.

- Quand la réponse contenait une phrase d'introduction ou des balises de code, le parsing
  échouait et **toute la nuit** s'arrêtait.
- Quand le JSON était valide mais les valeurs absurdes (`12`, `"très positif"`), elles étaient
  enregistrées telles quelles.

## Correctif

Extraire, parser dans un `try`, valider chaque champ, et renvoyer `None` pour tout le reste.
Le script de nuit peut ensuite journaliser les avis non analysés, ou les réessayer.

## Le réflexe à garder

- La sortie d'un LLM est une **donnée externe** : elle se valide comme une requête HTTP.
- Une erreur sur un élément ne doit pas arrêter le traitement de tous les autres.
- Quand l'API le propose, les **sorties structurées** (un schéma JSON imposé) évitent
  l'essentiel de ces problèmes ; la validation des règles métier reste dans le code.
