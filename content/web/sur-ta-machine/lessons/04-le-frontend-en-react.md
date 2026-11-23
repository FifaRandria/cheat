---
id: machine-04
title: "Le frontend en vrai : React avec Vite"
minutes: 22
summary: Créer l'application React, configurer le proxy vers l'API, et réécrire l'interface du projet final en composants.
check:
  - prompt: "À quoi sert `server.proxy` dans la configuration de Vite ?"
    choices:
      - "À relayer les appels /api vers le serveur de l'API pendant le développement : pas de CORS, et le même code qu'en production"
      - À accélérer le site
    answer: 0
  - prompt: "Où charger le catalogue au premier affichage d'un composant React ?"
    choices:
      - Directement dans le corps du composant
      - "Dans un useEffect avec un tableau de dépendances vide, pour ne le faire qu'une fois"
    answer: 1
---

## Créer l'application

À la racine du projet :

```bash
npm create vite@latest web -- --template react
cd web
npm install
npm run dev
```

Vite affiche une adresse (souvent `http://localhost:5173`) : ouvre-la, c'est ta page React.

## Le proxy vers l'API

`web/vite.config.js` :

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});
```

La page appelle `fetch("/api/outils")`. Vite relaie la requête vers l'API : pour le
navigateur, tout vient de la même origine, donc **pas d'erreur CORS**. En production, l'API
servira elle-même la page (dernière leçon), et le code restera identique.

## L'interface en composants

Tu as écrit cette interface à la main dans l'étape 4 du projet final : un état, un rendu, un
chargement. En React, ces trois idées ont un nom :

```jsx
// web/src/Catalogue.jsx
import { useEffect, useState } from "react";

export function Catalogue({ jeton }) {
  const [outils, setOutils] = useState([]);
  const [etat, setEtat] = useState("chargement");
  const [message, setMessage] = useState("");

  async function charger() {
    setEtat("chargement");
    try {
      const reponse = await fetch("/api/outils");
      if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
      setOutils(await reponse.json());
      setEtat("pret");
    } catch {
      setEtat("erreur");
    }
  }

  useEffect(() => {
    charger();
  }, []);

  async function emprunter(outil) {
    const reponse = await fetch("/api/prets", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${jeton}` },
      body: JSON.stringify({ outilId: outil.id }),
    });
    if (reponse.status === 201) {
      const pret = await reponse.json();
      setMessage(`${outil.nom} empruntée, à rendre le ${pret.finPrevue}.`);
    } else if (reponse.status === 409) {
      setMessage("Cet outil vient d'être emprunté par quelqu'un d'autre.");
    } else {
      setMessage("Une erreur est survenue.");
    }
    charger();
  }

  if (etat === "chargement") return <p>Chargement…</p>;
  if (etat === "erreur") return <p role="alert">Impossible de charger le catalogue.</p>;

  return (
    <>
      {message && <p role="alert">{message}</p>}
      <ul>
        {outils.map((outil) => (
          <li key={outil.id}>
            {outil.nom}{" "}
            {outil.disponible ? (
              jeton && <button onClick={() => emprunter(outil)}>Emprunter</button>
            ) : (
              <span>Prêté</span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
```

| Étape 4 du projet final | React |
|---|---|
| l'objet `etat` | `useState` |
| `afficher()` | le JSX renvoyé par le composant |
| `charger()` au démarrage | `useEffect(…, [])` |
| la délégation des clics | `onClick` sur chaque bouton |
| `textContent` (pas de XSS) | `{outil.nom}` : React échappe automatiquement |

> **Attention** : le tableau vide `[]` à la fin du `useEffect` est essentiel. Sans lui, l'effet
> se relance à chaque rendu, `setOutils` provoque un nouveau rendu… c'est la boucle infinie du
> module React.

## Ta mission

- [ ] Créer `web/` avec Vite, et configurer le proxy.
- [ ] Écrire le composant `Catalogue`, et l'afficher dans `App.jsx`.
- [ ] Lancer l'API et le frontend ensemble, et emprunter un outil depuis la page.
- [ ] Vérifier dans l'onglet Réseau que la requête passe par `/api`.
- [ ] Commiter.

## Ce que tu sais faire maintenant

- Créer une application React avec Vite.
- Relier le frontend à l'API grâce au proxy de développement.
- Traduire une interface « état et rendu » en composant React.
