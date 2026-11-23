from panier import ajouter, nouvelle_commande


def test_paniers_independants():
    """deux clients sans panier reçoivent chacun un panier neuf"""
    ada = ajouter("clavier")
    bob = ajouter("souris")
    assert bob == ["souris"], f"le panier de Bob contient : {bob!r}"
    assert ada == ["clavier"], f"le panier d'Ada contient : {ada!r}"


def test_panier_existant():
    """un panier fourni est complété"""
    panier = ["écran"]
    resultat = ajouter("câble", panier)
    assert resultat == ["écran", "câble"], f"obtenu : {resultat!r}"


def test_commandes_independantes():
    """deux commandes successives ne se mélangent pas"""
    nouvelle_commande("ada", ["clavier"])
    commande = nouvelle_commande("bob", ["souris", "tapis"])
    articles = [ligne["article"] for ligne in commande["lignes"]]
    assert articles == ["souris", "tapis"], f"la commande de Bob contient : {articles!r}"
    assert commande["client"] == "bob"
