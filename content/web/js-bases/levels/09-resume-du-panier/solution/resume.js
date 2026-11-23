export function resumePanier(articles) {
  let nbArticles = 0;
  let total = 0;
  let plusCher = null;

  for (const article of articles) {
    nbArticles += article.quantite;
    total += article.prix * article.quantite;
    if (plusCher === null || article.prix > plusCher.prix) {
      plusCher = article;
    }
  }

  return {
    nbArticles,
    total: Math.round(total * 100) / 100,
    plusCher: plusCher ? plusCher.nom : null,
  };
}
