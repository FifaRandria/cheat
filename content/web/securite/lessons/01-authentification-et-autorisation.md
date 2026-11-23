---
id: securite-01
title: "Qui es-tu, et as-tu le droit ? Authentification et autorisation"
minutes: 13
summary: Les deux contrôles de toute route privée, les failles de contrôle d'accès, et le principe du moindre privilège.
check:
  - prompt: Un utilisateur connecté change /factures/41 en /factures/42 dans l'URL et voit la facture d'un autre client. Quelle est la faille ?
    choices:
      - Une injection SQL
      - "Un contrôle d'accès manquant (IDOR) : la route vérifie la connexion, pas la propriété de la facture"
      - Une faille XSS
    answer: 1
  - prompt: "Une route fait `Object.assign(utilisateur, req.body)`. Quel est le risque ?"
    choices:
      - Aucun
      - "L'utilisateur peut envoyer n'importe quel champ, par exemple role: \"admin\", et le modifier"
    answer: 1
  - prompt: Quel code HTTP pour un utilisateur connecté qui n'a pas le droit d'accéder à une ressource ?
    choices:
      - "401"
      - "403"
      - "404"
    answer: 1
    explain: "401 : on ne sait pas qui tu es. 403 : on sait qui tu es, et c'est non. Certaines API répondent 404 pour ne même pas révéler que la ressource existe."
---

## Deux questions différentes

Chaque requête vers une ressource privée doit passer **deux** contrôles :

| Contrôle | Question | Échec |
|---|---|---|
| **Authentification** | Qui es-tu ? (jeton, cookie de session) | 401 Unauthorized |
| **Autorisation** | As-tu le droit de faire **ça**, sur **cette** ressource ? | 403 Forbidden |

L'erreur la plus fréquente sur le web n'est pas un piratage sophistiqué : c'est une route qui
fait le premier contrôle et oublie le second. Elle figure en tête du classement des risques de
l'OWASP (*Open Worldwide Application Security Project*) depuis 2021.

## L'IDOR : changer un numéro dans l'URL

```js
app.get("/factures/:id", authentifier, (req, res) => {
  const facture = factures.get(Number(req.params.id));
  res.json(facture);              // la facture de n'importe qui !
});
```

L'utilisateur est bien connecté. Mais rien ne vérifie que la facture **lui appartient**. On
appelle cela une **IDOR** (*Insecure Direct Object Reference*) : il suffit de deviner un autre
identifiant.

```js
app.get("/factures/:id", authentifier, (req, res) => {
  const facture = factures.get(Number(req.params.id));
  if (!facture || facture.clientId !== req.utilisateur.id) {
    return res.status(404).json({ erreur: "Facture introuvable" });
  }
  res.json(facture);
});
```

> **Astuce** : répondre 404 plutôt que 403 évite de confirmer à un curieux que la facture 42
> existe.

## L'affectation de masse

```js
app.put("/profil", authentifier, (req, res) => {
  Object.assign(req.utilisateur, req.body);   // copie TOUS les champs envoyés
  res.json(req.utilisateur);
});
```

Le formulaire n'envoie que `nom` et `email`. Mais rien n'empêche un attaquant d'envoyer
`{ "role": "admin" }` avec un outil comme `curl`. Le serveur doit choisir **lui-même** les
champs modifiables :

```js
const { nom, email } = req.body;
if (nom !== undefined) req.utilisateur.nom = nom;
if (email !== undefined) req.utilisateur.email = email;
```

> **À retenir** : le navigateur est **chez l'attaquant**. Tout ce qui vient du client (URL,
> corps, en-têtes, cookies) peut être modifié. Les contrôles se font sur le serveur, toujours.

## Le moindre privilège

Chaque utilisateur, chaque service, chaque clé d'API n'a que les droits **strictement
nécessaires** :

- un compte de base de données en lecture seule pour les statistiques ;
- une clé d'API limitée à un seul service ;
- les routes d'administration refusées par défaut, ouvertes rôle par rôle.

## Ce que tu sais faire maintenant

- Distinguer authentification (401) et autorisation (403).
- Repérer et corriger une IDOR.
- Empêcher l'affectation de masse en choisissant les champs modifiables.
- Appliquer le principe du moindre privilège.
