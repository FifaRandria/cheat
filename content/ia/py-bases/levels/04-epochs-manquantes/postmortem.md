## Cause racine

`range(1, nb_epochs)` produit les nombres de 1 **jusqu'à `nb_epochs` exclu**. Pour 3 epochs,
on obtient `1, 2` : la dernière epoch n'était jamais planifiée.

## Correctif

```python
for epoch in range(1, nb_epochs + 1):
```

## Le réflexe à garder

- La borne de fin de `range` est toujours **exclue**. Pour compter de 1 à `n` inclus :
  `range(1, n + 1)`.
- Teste toujours le cas limite : avec `nb_epochs = 1`, l'ancien code ne produisait **aucune**
  étiquette. Un entraînement d'une epoch n'aurait tout simplement pas eu lieu.
