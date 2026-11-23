## Ce qu'il fallait écrire

Une boucle qui, pour chaque cas, interroge l'assistant une fois, décide si la réponse est
réussie (tous les mots attendus, ou « je ne sais pas » pour une question hors sujet), et
accumule les jetons.

## Trois chiffres, trois questions

| Chiffre | La question qu'il pose |
|---|---|
| `reussite` | l'assistant répond-il juste ? |
| `refus_corrects` | sait-il dire « je ne sais pas » au lieu d'inventer ? |
| `jetons_moyens` | combien coûte une réponse ? |

Un assistant à 95 % de réussite qui invente une réponse à chaque question hors sujet est
dangereux. Un assistant parfait mais trois fois plus cher n'est peut-être pas viable. Il faut
regarder les trois.

## Le réflexe à garder

- La recherche, le prompt, le modèle, l'effort : chaque changement se juge sur ces chiffres.
- Les questions ratées en production rejoignent le jeu d'évaluation.
- Vérifier des mots-clés est une mesure grossière mais utile ; pour des réponses libres, un LLM
  juge, validé sur des cas notés par des humains, complète l'évaluation.
