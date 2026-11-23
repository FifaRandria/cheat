from preparation import normaliser


def test_min_max():
    """le minimum devient 0 et le maximum 1"""
    resultat = normaliser([20, 65, 110, 200])
    assert resultat == [0.0, 0.25, 0.5, 1.0], f"obtenu : {resultat}"


def test_valeurs_negatives():
    """fonctionne aussi avec des valeurs négatives"""
    assert normaliser([-10, 0, 10]) == [0.0, 0.5, 1.0]


def test_valeurs_egales():
    """toutes les valeurs égales : des zéros, sans division par zéro"""
    assert normaliser([3, 3, 3]) == [0.0, 0.0, 0.0]


def test_vide():
    """une liste vide donne une liste vide"""
    assert normaliser([]) == []
