// Affichage des commentaires du forum.

export function echapperHTML(texte) {
  return texte.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("&", "&amp;");
}

export function carteCommentaire(c) {
  return `<article class="commentaire" data-auteur="${c.auteur}">
  <h3>${echapperHTML(c.auteur)}</h3>
  <p>${c.texte}</p>
</article>`;
}
