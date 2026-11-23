from meteo import resume


def test_sans_manquante():
    """une série complète"""
    assert resume(["20", "22", "21"]) == {"moyenne": 21.0, "manquantes": 0}


def test_manquantes_ignorees():
    """les relevés manquants sont ignorés dans la moyenne, et comptés"""
    resultat = resume(["20", "", "22", "NA", None, " n/a ", "21"])
    assert resultat == {"moyenne": 21.0, "manquantes": 4}, f"obtenu : {resultat}"


def test_zero_est_une_mesure():
    """« 0 » est une vraie mesure, pas une valeur manquante"""
    assert resume(["0", "4"]) == {"moyenne": 2.0, "manquantes": 0}


def test_tout_manque():
    """aucun relevé valide : moyenne None au lieu de planter"""
    assert resume(["", "NA"]) == {"moyenne": None, "manquantes": 2}
