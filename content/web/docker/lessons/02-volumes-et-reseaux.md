---
id: docker-02
title: Volumes, réseaux et ports
minutes: 13
summary: Garder les données d'un conteneur, faire communiquer des conteneurs, et le piège de localhost.
check:
  - prompt: "Dans un conteneur, à quoi correspond `localhost` ?"
    choices:
      - À la machine hôte
      - Au conteneur lui-même
      - À tous les conteneurs
    answer: 1
  - prompt: "L'API (un conteneur) doit joindre PostgreSQL (le service `db` dans docker compose). Quelle adresse utiliser ?"
    choices: ["localhost:5432", "db:5432", "127.0.0.1:5432"]
    answer: 1
  - prompt: "Que fait `-p 8080:3000` ?"
    choices:
      - Il rend le port 3000 du conteneur accessible sur le port 8080 de l'hôte
      - Il rend le port 8080 du conteneur accessible sur le port 3000 de l'hôte
    answer: 0
---

## Les volumes : garder les données

Un conteneur est jetable. Si PostgreSQL tourne dans un conteneur sans volume, toutes les données
disparaissent à sa suppression : après une simple mise à jour de l'image, la base est vide.

Un **volume** est un espace de stockage géré par Docker, qui **survit** aux conteneurs :

```bash
docker run -v donnees-db:/var/lib/postgresql/data postgres:17
```

Le dossier `/var/lib/postgresql/data` du conteneur est stocké dans le volume `donnees-db`. Un
nouveau conteneur qui monte le même volume retrouve toutes les données.

> **À retenir** : tout ce qui doit survivre à un conteneur (base de données, fichiers envoyés
> par les utilisateurs) va dans un **volume**.

## Les ports

Un conteneur est isolé : ses ports ne sont pas accessibles de l'extérieur par défaut. On les
**publie** avec `-p hôte:conteneur` :

```bash
docker run -p 8080:3000 mon-api
# http://localhost:8080 sur ta machine → port 3000 dans le conteneur
```

## Le piège de localhost

Dans un conteneur, **`localhost` désigne le conteneur lui-même**, pas ta machine, et pas les
autres conteneurs.

Sur ton ordinateur, sans Docker, l'API joint PostgreSQL sur `localhost:5432` : les deux
tournent sur la même machine. Une fois l'API dans un conteneur, `localhost:5432`… pointe vers
le conteneur de l'API, où aucune base n'écoute :

```output
Error: connect ECONNREFUSED 127.0.0.1:5432
```

## Les réseaux Docker

Les conteneurs d'un même **réseau** Docker se joignent par leur **nom**. Docker fournit une
sorte d'annuaire : le nom du service devient une adresse.

```output
API  ──── db:5432 ────►  PostgreSQL
(conteneur « api »)       (conteneur « db »)
```

L'URL de connexion de l'API devient donc :

```output
postgresql://rustine:secret@db:5432/rustine
```

> **Astuce** : `ECONNREFUSED 127.0.0.1` depuis un conteneur signifie presque toujours qu'un
> `localhost` traîne dans la configuration, là où il faudrait le nom d'un service.

## Ce que tu sais faire maintenant

- Conserver des données avec un volume.
- Publier un port avec `-p`.
- Expliquer pourquoi `localhost` ne fonctionne pas entre conteneurs.
- Joindre un autre conteneur par son nom de service.
