// Le formulaire de contact.

export function initialiser(document, envoyer) {
  const bouton = document.querySelector("#contact button");
  const nom = document.querySelector("#nom").value;
  const message = document.querySelector("#message").value;

  bouton.addEventListener("click", () => {
    envoyer({ nom, message });
    document.querySelector("#confirmation").innerHTML = `Merci ${nom} !`;
  });
}
