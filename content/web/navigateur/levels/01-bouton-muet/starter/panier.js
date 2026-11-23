// Le panier de la page d'un outil.

export function initialiser(document) {
  const ajouterBtn = document.querySelector("#ajouter");
  const viderBtn = document.querySelector("#btn-vider");
  const affichage = document.querySelector("#quantite");
  let quantite = 0;

  function ajouter() {
    quantite += 1;
    affichage.textContent = String(quantite);
  }

  function vider() {
    quantite = 0;
  }

  ajouterBtn.addEventListener("onclick", ajouter());
  viderBtn.addEventListener("click", vider);
}
