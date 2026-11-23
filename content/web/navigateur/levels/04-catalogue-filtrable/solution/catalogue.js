// Le catalogue filtrable.

export function monterCatalogue(document, outils) {
  const liste = document.querySelector("#outils");
  const compteur = document.querySelector("#compteur");
  const champFiltre = document.querySelector("#filtre");
  const choixCategorie = document.querySelector("#categorie");

  const etat = { filtre: "", categorie: "" };

  function visibles() {
    const texte = etat.filtre.trim().toLowerCase();
    return outils.filter(
      (o) => o.nom.toLowerCase().includes(texte) && (!etat.categorie || o.categorie === etat.categorie),
    );
  }

  function afficher() {
    const resultat = visibles();
    liste.replaceChildren();
    for (const outil of resultat) {
      const li = document.createElement("li");
      li.textContent = outil.nom;
      liste.appendChild(li);
    }
    compteur.textContent =
      resultat.length === 0 ? "Aucun outil" : resultat.length === 1 ? "1 outil" : `${resultat.length} outils`;
  }

  champFiltre.addEventListener("input", (event) => {
    etat.filtre = event.target.value;
    afficher();
  });

  choixCategorie.addEventListener("change", (event) => {
    etat.categorie = event.target.value;
    afficher();
  });

  afficher();
}
