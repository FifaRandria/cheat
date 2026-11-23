from planning import planning


def test_trois_epochs():
    """3 epochs donnent 3 étiquettes, de 1/3 à 3/3"""
    resultat = planning(3)
    assert resultat == ["epoch 1/3", "epoch 2/3", "epoch 3/3"], f"obtenu : {resultat}"


def test_une_epoch():
    """une seule epoch n'est pas oubliée"""
    assert planning(1) == ["epoch 1/1"], f"obtenu : {planning(1)}"


def test_zero():
    """zéro epoch : aucune étiquette"""
    assert planning(0) == []
