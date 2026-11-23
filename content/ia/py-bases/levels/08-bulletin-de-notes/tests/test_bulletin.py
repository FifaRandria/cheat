from bulletin import bulletin


def test_aucune_note():
    """sans aucune note, le bulletin vaut None"""
    resultat = bulletin([])
    assert resultat is None, f"obtenu : {resultat!r}"


def test_exemple_complet():
    """moyenne arrondie, minimum, maximum et mention"""
    resultat = bulletin([12, 9, 17, 15, 15.5])
    attendu = {"moyenne": 13.7, "min": 9, "max": 17, "mention": "Assez bien"}
    assert resultat == attendu, f"obtenu : {resultat!r}"


def test_une_seule_note():
    """une seule note est à la fois la moyenne, le minimum et le maximum"""
    resultat = bulletin([8])
    attendu = {"moyenne": 8, "min": 8, "max": 8, "mention": "Insuffisant"}
    assert resultat == attendu, f"obtenu : {resultat!r}"


def test_mentions():
    """chaque tranche de moyenne donne la bonne mention"""
    cas = {
        "Passable": [10, 11],
        "Bien": [14, 15],
        "Très bien": [18, 19],
    }
    for mention, notes in cas.items():
        obtenu = bulletin(notes)["mention"]
        assert obtenu == mention, f"notes {notes} : attendu {mention!r}, obtenu {obtenu!r}"


def test_bornes():
    """une moyenne pile sur une borne prend la mention supérieure"""
    for notes, mention in [([12], "Assez bien"), ([14], "Bien"), ([16], "Très bien"), ([10], "Passable")]:
        obtenu = bulletin(notes)["mention"]
        assert obtenu == mention, f"moyenne {notes[0]} : attendu {mention!r}, obtenu {obtenu!r}"
