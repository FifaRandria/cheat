// L'interface de la Boîte à outils.

const MESSAGES = {
  409: "Cet outil vient d'être emprunté par quelqu'un d'autre.",
  401: "Connecte-toi pour emprunter.",
};

export async function monterBoite(document, fetch, jeton) {
  const liste = document.querySelector("#outils");
  const etatEl = document.querySelector("#etat");
  const message = document.querySelector("#message");

  const etat = { outils: [], chargement: false, erreur: null };

  function afficher() {
    etatEl.textContent = etat.chargement ? "Chargement…" : etat.erreur ?? "";
    liste.replaceChildren();
    for (const outil of etat.outils) {
      const li = document.createElement("li");
      li.append(outil.nom, " ");
      if (!outil.disponible) {
        const span = document.createElement("span");
        span.textContent = "Prêté";
        li.appendChild(span);
      } else if (jeton) {
        const bouton = document.createElement("button");
        bouton.type = "button";
        bouton.dataset.id = String(outil.id);
        bouton.textContent = "Emprunter";
        li.appendChild(bouton);
      }
      liste.appendChild(li);
    }
  }

  async function charger() {
    etat.chargement = true;
    afficher();
    try {
      const reponse = await fetch("/api/outils");
      if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
      etat.outils = await reponse.json();
      etat.erreur = null;
    } catch {
      etat.outils = [];
      etat.erreur = "Impossible de charger le catalogue.";
    } finally {
      etat.chargement = false;
      afficher();
    }
  }

  async function emprunter(outilId) {
    try {
      const reponse = await fetch("/api/prets", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jeton}` },
        body: JSON.stringify({ outilId }),
      });
      if (reponse.status === 201) {
        const pret = await reponse.json();
        const outil = etat.outils.find((o) => o.id === outilId);
        message.textContent = `${outil?.nom ?? "Outil"} empruntée, à rendre le ${pret.finPrevue}.`;
      } else {
        message.textContent = MESSAGES[reponse.status] ?? "Une erreur est survenue.";
      }
    } catch {
      message.textContent = "Une erreur est survenue.";
    }
    await charger(); // l'état réel du serveur, plutôt que deviner
  }

  // Un seul écouteur pour tous les boutons, même ceux créés plus tard (délégation).
  liste.addEventListener("click", (event) => {
    const bouton = event.target.closest("button[data-id]");
    if (bouton) emprunter(Number(bouton.dataset.id));
  });

  await charger();
}
