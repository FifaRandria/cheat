# Service panier, porté depuis JavaScript.
# Original : function ajouter(article, panier = []) { panier.push(article); return panier; }


def ajouter(article, panier=[]):
    panier.append(article)
    return panier


def nouvelle_commande(client, articles, lignes=[]):
    for article in articles:
        lignes.append({"article": article, "quantite": 1})
    return {"client": client, "lignes": lignes}
