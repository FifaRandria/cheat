from prompt import construire_prompt

PASSAGES = ["Offre Pro à 29 €/mois.", "Offre Équipe à 79 €/mois."]
QUESTION = "Combien coûte l'offre Pro ?"


def test_passages_numerotes():
    """chaque passage figure dans le prompt, numéroté"""
    p = construire_prompt(QUESTION, PASSAGES)
    assert "[1] Offre Pro à 29 €/mois." in p, "passage [1] absent du prompt"
    assert "[2] Offre Équipe à 79 €/mois." in p, "passage [2] absent du prompt"


def test_consigne():
    """la consigne interdit d'inventer et prévoit « je ne sais pas »"""
    p = construire_prompt(QUESTION, PASSAGES).lower()
    assert "uniquement" in p, "pas de consigne « uniquement »"
    assert "je ne sais pas" in p, "pas de consigne « je ne sais pas »"


def test_ordre():
    """consigne, puis documents, puis la question à la toute fin"""
    p = construire_prompt(QUESTION, PASSAGES)
    assert p.lower().index("uniquement") < p.index("[1]") < p.index(QUESTION)
    assert p.rstrip().endswith(QUESTION), "la question n'est pas à la fin"


def test_sans_passage():
    """sans passage, le prompt le dit explicitement et garde la consigne"""
    p = construire_prompt(QUESTION, [])
    assert "Aucun document pertinent." in p
    assert "je ne sais pas" in p.lower()
