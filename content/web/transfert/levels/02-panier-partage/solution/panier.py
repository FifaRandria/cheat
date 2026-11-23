# Service panier, porté depuis JavaScript.
# En Python, une valeur par défaut est créée UNE fois : jamais de liste ou de dictionnaire
# comme valeur par défaut. On utilise None, et on crée la liste dans la fonction.


def ajouter(article, panier=None):
    if panier is None:
        panier = []
    panier.append(article)
    return panier


def nouvelle_commande(client, articles):
    lignes = [{"article": article, "quantite": 1} for article in articles]
    return {"client": client, "lignes": lignes}
