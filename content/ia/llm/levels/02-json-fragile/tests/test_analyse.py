from analyse import lire_analyse


def test_json_seul():
    """un JSON seul et valide est lu"""
    resultat = lire_analyse('{"note": 4, "sentiment": "positif"}')
    assert resultat == {"note": 4, "sentiment": "positif"}, f"obtenu : {resultat!r}"


def test_json_entoure():
    """un JSON entouré de texte ou de balises de code est extrait"""
    texte = "Voici l'analyse :\n```json\n{\"note\": 2, \"sentiment\": \"negatif\"}\n```\nBonne journée."
    resultat = lire_analyse(texte)
    assert resultat == {"note": 2, "sentiment": "negatif"}, f"obtenu : {resultat!r}"


def test_pas_de_json():
    """une réponse sans JSON donne None, sans exception"""
    assert lire_analyse("Je ne peux pas analyser cet avis.") is None


def test_json_invalide():
    """un JSON mal formé donne None, sans exception"""
    assert lire_analyse('{"note": 4, "sentiment": }') is None


def test_note_hors_limites():
    """une note hors de 1 à 5, ou qui n'est pas un entier, est rejetée"""
    for note in [0, 6, 12, -1, "4", 4.5, True, None]:
        texte = '{"note": %s, "sentiment": "positif"}' % (f'"{note}"' if isinstance(note, str) else ("true" if note is True else ("null" if note is None else note)))
        assert lire_analyse(texte) is None, f"note {note!r} acceptée"


def test_sentiment_inconnu():
    """un sentiment hors de la liste est rejeté"""
    assert lire_analyse('{"note": 5, "sentiment": "très positif"}') is None


def test_champs_en_trop_ignores():
    """seuls note et sentiment sont gardés"""
    resultat = lire_analyse('{"note": 3, "sentiment": "neutre", "commentaire": "ras"}')
    assert resultat == {"note": 3, "sentiment": "neutre"}, f"obtenu : {resultat!r}"
