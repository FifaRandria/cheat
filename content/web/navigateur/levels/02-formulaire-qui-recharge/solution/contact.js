// Le formulaire de contact.

export function initialiser(document, envoyer) {
  const formulaire = document.querySelector("#contact");
  const champNom = document.querySelector("#nom");
  const champMessage = document.querySelector("#message");
  const erreur = document.querySelector("#erreur");
  const confirmation = document.querySelector("#confirmation");

  // submit, et non click : la touche Entrée envoie aussi le formulaire.
  formulaire.addEventListener("submit", (event) => {
    event.preventDefault(); // pas de rechargement de la page

    // Les valeurs se lisent au moment de l'envoi, pas au chargement.
    const nom = champNom.value.trim();
    const message = champMessage.value.trim();

    if (!nom || !message) {
      erreur.textContent = "Remplis tous les champs.";
      return;
    }

    envoyer({ nom, message });
    erreur.textContent = "";
    confirmation.textContent = `Merci ${nom} !`; // du texte, jamais du HTML
    champNom.value = "";
    champMessage.value = "";
  });
}
