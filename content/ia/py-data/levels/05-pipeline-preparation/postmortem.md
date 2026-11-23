## Pourquoi cet ordre

Le notebook du stagiaire souffrait de **fuites de données** (*data leakage*) : des
informations de la validation avaient « fuité » vers l'entraînement.

- **Dédoublonner après la séparation** : un même exemple pouvait se trouver des deux côtés.
  Le modèle était évalué sur des exemples qu'il avait déjà vus.
- **Normaliser avant la séparation** : le minimum et le maximum tenaient compte des données de
  validation, qui n'étaient donc plus tout à fait inconnues.

Résultat : une validation trop optimiste (99 %), démentie par la production (70 %).

## Le réflexe à garder

Tout ce qui **apprend** quelque chose des données (min, max, moyenne, vocabulaire…) se calcule
sur l'entraînement **seulement**. Une performance de validation trop belle doit être
vérifiée avant d'être célébrée.
