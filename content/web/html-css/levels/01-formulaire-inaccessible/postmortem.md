## Cause racine

Le formulaire « marchait » à la souris pour une personne voyante, et pour personne d'autre :

1. Le nom était annoncé par un simple `<p>`, et l'e-mail par un `<label>` sans `for` : aucun
   lien entre le texte et le champ.
2. `label for="mdp"` visait un id qui n'existe pas (`motdepasse`).
3. Le mot de passe était en `type="text"`, donc lisible par-dessus l'épaule.
4. L'envoi passait par une `div` cliquable, invisible pour le clavier.

## Correctif

```html
<label for="email">E-mail</label>
<input type="email" name="email" id="email" required>
…
<button type="submit">S'inscrire</button>
```

Les `name` n'ont pas bougé : le serveur continue de recevoir `nom`, `email` et `motdepasse`.

## Le réflexe à garder

- Tester un formulaire **au clavier seul** : Tab pour avancer, Entrée pour envoyer.
- `for` = `id`, toujours. Un label cliquable est le signe qu'il est bien relié.
- Le bon `type` de champ apporte gratuitement le clavier mobile, la validation et le masquage.
- Les outils d'audit (Lighthouse dans Chrome, onglet « Accessibilité ») détectent ces erreurs
  en quelques secondes.
