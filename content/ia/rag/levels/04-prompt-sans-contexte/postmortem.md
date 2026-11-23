## Cause racine

La variable `contexte` était bien construite… puis **jamais utilisée**. Le prompt envoyé au
modèle ne contenait que la question. Sans documents, le modèle a répondu avec ce qu'il
« croyait savoir » : un tarif inventé, avec beaucoup d'assurance.

La recherche fonctionnait parfaitement. Tout le travail du RAG était perdu à la dernière
étape.

## Correctif

```python
return (
    "Réponds uniquement à partir des documents ci-dessous. "
    "Si la réponse n'y figure pas, réponds : je ne sais pas. "
    "Cite les numéros des documents utilisés.\n\n"
    f"Documents :\n{contexte}\n\n"
    f"Question : {question}"
)
```

## Le réflexe à garder

- **Affiche le prompt final**, exactement tel qu'il part vers le modèle. Les logs montraient
  un prompt de 89 caractères : impossible qu'il contienne les documents.
- Une variable calculée mais jamais utilisée est presque toujours un bug.
- La consigne « réponds uniquement à partir des documents, sinon dis que tu ne sais pas » est
  la protection la plus simple contre les hallucinations.
