from mots import compter_mots


def test_vide():
    """un texte vide donne un dictionnaire vide"""
    resultat = compter_mots("")
    assert resultat == {}, f"obtenu : {resultat!r}"


def test_un_mot():
    """un seul mot est compté une fois"""
    resultat = compter_mots("parfait")
    assert resultat == {"parfait": 1}, f"obtenu : {resultat!r}"


def test_plusieurs_mots():
    """plusieurs mots, dont un répété"""
    resultat = compter_mots("bon produit bon prix")
    assert resultat == {"bon": 2, "produit": 1, "prix": 1}, f"obtenu : {resultat!r}"


def test_majuscules():
    """les majuscules ne créent pas de mot différent"""
    resultat = compter_mots("Super super SUPER")
    assert resultat == {"super": 3}, f"obtenu : {resultat!r}"


def test_ponctuation():
    """la ponctuation est ignorée"""
    resultat = compter_mots("Super produit, super prix !")
    assert resultat == {"super": 2, "produit": 1, "prix": 1}, f"obtenu : {resultat!r}"


def test_espaces():
    """les espaces multiples ne créent pas de mots vides"""
    resultat = compter_mots("  livraison   rapide.Merci  ")
    assert resultat == {"livraison": 1, "rapide": 1, "merci": 1}, f"obtenu : {resultat!r}"
