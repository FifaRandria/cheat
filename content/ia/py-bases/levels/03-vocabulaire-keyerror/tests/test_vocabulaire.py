from vocabulaire import compter_mots


def test_exemple():
    """compte chaque mot de la phrase"""
    resultat = compter_mots("le chat et le chien")
    assert resultat == {"le": 2, "chat": 1, "et": 1, "chien": 1}, f"obtenu : {resultat}"


def test_majuscules():
    """ignore les majuscules"""
    assert compter_mots("Bonjour bonjour BONJOUR") == {"bonjour": 3}


def test_vide():
    """un texte vide donne un dictionnaire vide"""
    assert compter_mots("") == {}
