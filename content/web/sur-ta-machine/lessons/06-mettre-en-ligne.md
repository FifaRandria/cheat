---
id: machine-06
title: Mettre ton projet en ligne
minutes: 22
summary: Une image Docker qui sert l'API et la page, un hébergeur, une base gérée, les variables d'environnement, et la vérification après livraison.
check:
  - prompt: "Ton API écoute sur le port 4000 en dur. L'hébergeur indique « no open port detected ». Pourquoi ?"
    choices:
      - "L'hébergeur impose son port par la variable PORT : il faut écouter sur process.env.PORT"
      - Le port 4000 est interdit sur internet
    answer: 0
  - prompt: Où se règle DATABASE_URL en production ?
    choices:
      - Dans le fichier .env commité
      - "Dans les variables d'environnement de l'hébergeur, jamais dans le dépôt"
    answer: 1
---

## L'architecture la plus simple

Pour un premier déploiement : **un seul service** qui sert l'API **et** la page construite par
Vite, plus une base PostgreSQL gérée par l'hébergeur.

```text
navigateur ──► ton service (Express)
                 ├─ /api/…       les routes
                 └─ le reste     les fichiers de web/dist (la page React)
               └──► PostgreSQL géré
```

Même origine pour la page et l'API : pas de CORS, et le `fetch("/api/…")` du frontend marche tel
quel.

```js
// dans app.js, après les routes /api
import path from "node:path";

const dist = path.join(import.meta.dirname, "../web/dist");
app.use(express.static(dist));
app.get("/{*chemin}", (req, res) => res.sendFile(path.join(dist, "index.html")));
```

La dernière ligne renvoie la page React pour toute autre adresse (`/profil`, `/outils/3`…) :
c'est le routeur de React qui s'en occupe ensuite.

## L'image Docker

`Dockerfile` à la racine (module « Docker ») :

```dockerfile
FROM node:22-alpine AS web
WORKDIR /app/web
COPY web/package*.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY api/package*.json ./api/
RUN cd api && npm ci --omit=dev
COPY api/ ./api/
COPY --from=web /app/web/dist ./web/dist
ENV NODE_ENV=production
CMD ["node", "api/serveur.js"]
```

La première étape construit la page ; la seconde ne garde que l'API et le résultat de la
construction. L'image finale ne contient ni les outils de construction, ni le code source du
frontend.

```bash
docker build -t boite-a-outils .
docker run --rm -p 4000:4000 -e DATABASE_URL=… boite-a-outils
```

## L'hébergeur

Choisis un hébergeur qui accepte une image Docker (ou une application Node) et propose une
base PostgreSQL gérée : Render, Railway, Fly.io, Scaleway, Clever Cloud… Leurs offres gratuites
changent souvent : vérifie les conditions actuelles avant de choisir.

Les étapes sont presque toujours les mêmes :

1. relier ton dépôt GitHub (déploiement à chaque push sur `main`) ;
2. créer la base PostgreSQL, et copier son adresse dans la variable **`DATABASE_URL`** du
   service ;
3. ajouter les autres variables (secrets, `NODE_ENV=production`) ;
4. lancer la migration (`node api/migrer.js`), souvent dans une commande « avant
   démarrage » ;
5. déployer.

> **Attention** : l'hébergeur choisit le **port** et te le donne dans la variable `PORT`. Ton
> serveur doit écouter sur `process.env.PORT`, ce que fait déjà `serveur.js`.

## Vérifier après la livraison

- [ ] La page s'affiche à l'adresse publique, en **HTTPS** (fourni par l'hébergeur).
- [ ] `/api/outils` répond.
- [ ] Un emprunt fonctionne, et survit à un redémarrage du service (la base est bien persistante).
- [ ] Les journaux de l'hébergeur ne montrent pas d'erreur.
- [ ] Une modification poussée sur `main` est en ligne quelques minutes plus tard, CI verte.

## Ta mission

Mettre la Boîte à outils en ligne, et envoyer son adresse à quelqu'un. C'est ton premier
projet fullstack en production : ajoute le lien dans ton README et sur ton CV.

## Ce que tu sais faire maintenant

- Servir l'API et la page React depuis un seul service.
- Construire une image Docker en deux étapes.
- Déployer sur un hébergeur avec une base gérée et des variables d'environnement.
- Vérifier une livraison.
