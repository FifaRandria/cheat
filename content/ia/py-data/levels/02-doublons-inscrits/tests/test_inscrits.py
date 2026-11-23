from inscrits import inscrits_uniques


def test_casse_et_espaces():
    """« Ada@Ex.com » et « ada@ex.com » sont la même personne"""
    resultat = inscrits_uniques(["Ada@Ex.com", " ada@ex.com", "bob@ex.com"])
    assert resultat == ["ada@ex.com", "bob@ex.com"], f"obtenu : {resultat}"


def test_ordre():
    """l'ordre de première apparition est conservé"""
    resultat = inscrits_uniques(["eve@ex.com", "ada@ex.com", "EVE@ex.com", "bob@ex.com"])
    assert resultat == ["eve@ex.com", "ada@ex.com", "bob@ex.com"], f"obtenu : {resultat}"


def test_vides():
    """les entrées vides sont ignorées"""
    assert inscrits_uniques(["", "  ", None, "ada@ex.com"]) == ["ada@ex.com"]
