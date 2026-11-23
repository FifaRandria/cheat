// Affichage des commentaires du forum.

export function echapperHTML(texte) {
  return String(texte)
    .replaceAll("&", "&amp;") // en premier : sinon on échappe nos propres entités
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function carteCommentaire(c) {
  return `<article class="commentaire" data-auteur="${echapperHTML(c.auteur)}">
  <h3>${echapperHTML(c.auteur)}</h3>
  <p>${echapperHTML(c.texte)}</p>
</article>`;
}
