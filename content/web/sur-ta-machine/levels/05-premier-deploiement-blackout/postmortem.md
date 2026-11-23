## Ton projet est en ligne

Tu as installé ton poste, créé le dépôt, construit le backend et le frontend, écrit les
tests, configuré la CI et mis l'application en ligne. C'est le parcours complet d'un
développeur, de la page blanche à la production.

## La checklist d'un déploiement

- Écouter sur `process.env.PORT`.
- Appliquer les migrations à chaque déploiement.
- Renvoyer `index.html` pour les routes du frontend.
- Les secrets dans les variables de l'hébergeur, jamais dans Git ; un secret publié se révoque.
- Les données dans une base gérée et persistante, jamais dans le conteneur.
