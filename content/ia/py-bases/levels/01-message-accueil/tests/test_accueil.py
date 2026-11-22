from accueil import message_accueil


def test_ada():
    """salue Ada avec son âge"""
    resultat = message_accueil("Ada", 36)
    assert resultat == "Bienvenue Ada ! Tu as 36 ans.", f"obtenu : {resultat!r}"


def test_autre():
    """fonctionne pour un autre utilisateur"""
    resultat = message_accueil("Linus", 19)
    assert resultat == "Bienvenue Linus ! Tu as 19 ans.", f"obtenu : {resultat!r}"
