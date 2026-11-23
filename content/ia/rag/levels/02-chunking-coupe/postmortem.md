## Cause racine

Deux erreurs dans une seule ligne :

```python
for debut in range(0, len(mots) - taille, taille):
```

1. **Le pas** valait `taille` au lieu de `taille - chevauchement` : les morceaux se suivaient
   bout à bout, **sans aucun chevauchement**. Une information à cheval sur une frontière était
   coupée en deux, et aucun morceau ne la contenait en entier.
2. **La borne de fin** `len(mots) - taille` (exclue, comme toujours avec `range`) arrêtait la
   boucle avant le dernier morceau. Les derniers mots de chaque document, souvent la
   conclusion, n'étaient **jamais indexés**.

## Correctif

```python
pas = taille - chevauchement
debut = 0
while debut < len(mots):
    morceaux.append(" ".join(mots[debut:debut + taille]))
    if debut + taille >= len(mots):
        break
    debut += pas
```

Et une garde : un chevauchement supérieur ou égal à la taille donnerait un pas nul, donc une
boucle infinie.

## Le réflexe à garder

- Vérifie toujours la **couverture** : tous les mots se retrouvent-ils dans au moins un
  morceau ? (Les logs le montraient : 1 000 mots sur 1 030.)
- Un RAG qui « ne trouve jamais » certaines informations pourtant présentes : regarde d'abord
  le découpage, morceau par morceau.
