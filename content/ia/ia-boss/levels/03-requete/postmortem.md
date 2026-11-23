## Ce qu'il fallait écrire

```python
"system": CONSIGNE + "\n\n" + bloc_documents(passages),
"messages": recents + [{"role": "user", "content": question}],
```

avec des documents délimités par des balises, et un historique limité aux derniers messages.

## Pourquoi tant de soin ?

- Les **balises** séparent clairement les documents des instructions : un texte du règlement
  modifié par un membre malveillant reste une donnée (injection de prompt).
- Les **identifiants** (`R3`) permettent au modèle de citer ses sources, et au bénévole de
  vérifier.
- L'**historique limité** garde le coût de chaque message stable, au lieu de le faire grimper
  avec la longueur de la conversation.

## Le réflexe à garder

Une requête de production est un assemblage soigné : consigne stable, documents délimités,
historique borné, question. Chaque morceau a sa raison d'être.
