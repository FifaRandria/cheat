from chunking import decouper

MOTS = "a b c d e f g h i j".split()


def test_exemple():
    """taille 4, chevauchement 1 : les morceaux se chevauchent d'un mot"""
    resultat = decouper(MOTS, 4, 1)
    assert resultat == ["a b c d", "d e f g", "g h i j"], f"obtenu : {resultat}"


def test_dernier_morceau():
    """le dernier morceau, même court, n'est pas perdu"""
    resultat = decouper(MOTS, 4, 0)
    assert resultat == ["a b c d", "e f g h", "i j"], f"obtenu : {resultat}"


def test_aucun_mot_perdu():
    """tous les mots du document se retrouvent dans au moins un morceau"""
    mots = [f"m{i}" for i in range(103)]
    couverts = set(" ".join(decouper(mots, 10, 3)).split())
    manquants = [m for m in mots if m not in couverts]
    assert manquants == [], f"mots perdus : {manquants}"


def test_document_court():
    """un document plus court qu'un morceau donne un seul morceau"""
    assert decouper(["un", "deux"], 5, 1) == ["un deux"]
