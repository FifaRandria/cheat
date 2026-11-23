// Le panier de la page d'un outil.

export function initialiser(document) {
  const ajouterBtn = document.querySelector("#btn-ajouter");
  const viderBtn = document.querySelector("#btn-vider");
  const affichage = document.querySelector("#quantite");
  let quantite = 0;

  function afficher() {
    affichage.textContent = String(quantite);
  }

  ajouterBtn.addEventListener("click", () => {
    quantite += 1;
    afficher();
  });

  viderBtn.addEventListener("click", () => {
    quantite = 0;
    afficher();
  });

  afficher();
}
