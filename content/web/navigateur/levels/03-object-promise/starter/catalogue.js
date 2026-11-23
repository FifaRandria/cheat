// Le catalogue des outils, chargé depuis l'API.

export async function charger(document, fetch) {
  const liste = document.querySelector("#outils");

  const reponse = await fetch("/api/outils");
  const outils = reponse.json();

  liste.innerHTML = outils;
  for (const outil of outils) {
    const li = document.createElement("li");
    li.textContent = `${outil.nom} (${outil.disponible ? "disponible" : "prêtée"})`;
    liste.appendChild(li);
  }
}
