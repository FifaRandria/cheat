import math

from similarite import meilleur_document, similarite


def test_meme_direction():
    """deux vecteurs de même direction ont une similarité de 1, quelle que soit leur longueur"""
    resultat = similarite([1, 2, 0], [3, 6, 0])
    assert math.isclose(resultat, 1.0), f"obtenu : {resultat}"


def test_orthogonaux():
    """des vecteurs sans rapport ont une similarité de 0"""
    assert similarite([1, 0], [0, 5]) == 0


def test_vecteur_nul():
    """un vecteur nul donne 0 au lieu de planter"""
    assert similarite([0, 0, 0], [1, 2, 3]) == 0.0


def test_la_faq_gagne():
    """la FAQ courte et précise l'emporte sur le long document hors sujet"""
    question = [0, 1, 1, 0]
    documents = [("CGV", [40, 12, 9, 55]), ("FAQ livraison", [0, 1, 1, 0])]
    assert meilleur_document(question, documents) == "FAQ livraison"
