// Le catalogue des outils, chargé depuis l'API.

export async function charger(document, fetch) {
  const liste = document.querySelector("#outils");
  const etat = document.querySelector("#etat");
  const bouton = document.querySelector("#recharger");

  etat.textContent = "Chargement…";
  bouton.disabled = true; // pas de double chargement

  try {
    const reponse = await fetch("/api/outils");
    // fetch ne lève une erreur que si le réseau est coupé : un 503 se teste à la main.
    if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
    const outils = await reponse.json();

    liste.replaceChildren();
    for (const outil of outils) {
      const li = document.createElement("li");
      li.textContent = `${outil.nom} (${outil.disponible ? "disponible" : "prêtée"})`;
      liste.appendChild(li);
    }
    etat.textContent = "";
  } catch {
    liste.replaceChildren();
    etat.textContent = "Impossible de charger les outils.";
  } finally {
    bouton.disabled = false;
  }
}
