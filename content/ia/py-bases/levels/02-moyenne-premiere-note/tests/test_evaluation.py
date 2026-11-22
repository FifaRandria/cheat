from evaluation import precision


def test_moitie():
    """une bonne réponse sur deux donne 0.5"""
    assert precision(["chat", "chien"], ["chat", "chat"]) == 0.5


def test_premier_faux():
    """le premier exemple faux est bien compté"""
    resultat = precision(["chien", "chat", "chat", "chat"], ["chat", "chat", "chat", "chat"])
    assert resultat == 0.75, f"obtenu : {resultat}"


def test_tout_juste():
    """toutes les prédictions justes donnent 1.0"""
    assert precision(["a", "b", "c"], ["a", "b", "c"]) == 1.0


def test_vide():
    """un jeu de test vide donne 0.0 au lieu de planter"""
    assert precision([], []) == 0.0
