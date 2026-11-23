from reessai import MAX_TENTATIVES, politique


def test_erreur_definitive():
    """une erreur 400 n'est jamais réessayée"""
    assert politique(1, 400) == ("abandonner", 0), f"obtenu : {politique(1, 400)}"
    assert politique(1, 401)[0] == "abandonner"
    assert politique(1, 404)[0] == "abandonner"


def test_erreurs_passageres():
    """429 et 5xx sont réessayés"""
    assert politique(1, 429)[0] == "reessayer"
    assert politique(1, 503)[0] == "reessayer"
    assert politique(1, 500)[0] == "reessayer"


def test_attente_exponentielle():
    """le délai double à chaque échec : 1, 2, 4 secondes"""
    delais = [politique(t, 503)[1] for t in (1, 2, 3)]
    assert delais == [1, 2, 4], f"obtenu : {delais}"


def test_limite():
    """au-delà du nombre maximal de tentatives, on abandonne"""
    assert politique(MAX_TENTATIVES, 503) == ("abandonner", 0)
