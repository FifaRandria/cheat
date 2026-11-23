from recherche import top_k

SCORES = [("CGV", 0.42), ("FAQ livraison", 0.91), ("Recrutement", 0.08), ("Suivi colis", 0.77)]


def test_meilleurs_en_premier():
    """renvoie les k meilleurs, du plus au moins similaire"""
    resultat = top_k(SCORES, 2)
    assert resultat == ["FAQ livraison", "Suivi colis"], f"obtenu : {resultat}"


def test_seuil():
    """écarte les passages sous le seuil"""
    resultat = top_k(SCORES, 4, seuil=0.5)
    assert resultat == ["FAQ livraison", "Suivi colis"], f"obtenu : {resultat}"


def test_rien_de_pertinent():
    """aucun passage au-dessus du seuil : liste vide, pour que le chatbot dise qu'il ne sait pas"""
    assert top_k(SCORES, 3, seuil=0.95) == []


def test_k_plus_grand():
    """k plus grand que le nombre de passages : tous, dans l'ordre"""
    assert top_k(SCORES, 10) == ["FAQ livraison", "Suivi colis", "CGV", "Recrutement"]
