## Pourquoi cet ordre

Chaque étape **dépend** de la précédente :

- sans objectif, impossible de savoir quelles données préparer ni comment juger le résultat ;
- LoRA **s'accroche** à un modèle existant : il faut le charger avant ;
- évaluer avant d'entraîner ne mesure que le modèle d'origine (utile comme point de
  comparaison, mais ce n'est pas l'évaluation finale) ;
- on ne déploie que ce qui a été évalué.

## Le réflexe à garder

L'étape la plus sous-estimée est la **préparation du dataset**. Dans un vrai projet, elle
prend souvent plus de temps que l'entraînement lui-même, et c'est elle qui fait la qualité
du résultat.
