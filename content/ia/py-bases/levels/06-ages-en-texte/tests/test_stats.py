from stats import age_moyen


def test_nombres():
    """fonctionne avec des âges numériques"""
    assert age_moyen([{"age": 30}, {"age": 40}]) == 35


def test_textes():
    """accepte des âges saisis comme du texte, avec des espaces"""
    resultat = age_moyen([{"age": 36}, {"age": "41"}, {"age": " 28 "}])
    assert resultat == 35, f"obtenu : {resultat!r}"


def test_invalides_ignores():
    """ignore les âges absents, vides ou non numériques"""
    personnes = [{"age": 20}, {"nom": "sans âge"}, {"age": ""}, {"age": "quarante"}, {"age": 30}]
    resultat = age_moyen(personnes)
    assert resultat == 25, f"obtenu : {resultat!r}"


def test_aucun_age():
    """aucun âge valide : la moyenne vaut 0"""
    assert age_moyen([{"nom": "x"}]) == 0
    assert age_moyen([]) == 0
