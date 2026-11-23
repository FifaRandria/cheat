from evaluation import evaluer

JEU = [
    {"id": "a1", "avis": "Super réparation", "attendu": "positif"},
    {"id": "a2", "avis": "Trois semaines d'attente", "attendu": "negatif"},
    {"id": "a3", "avis": "Vélo comme neuf", "attendu": "positif"},
    {"id": "a4", "avis": "Prix trop élevé", "attendu": "negatif"},
]


def optimiste(avis):
    """Un faux classifieur qui répond toujours positif."""
    return "positif"


def parfait(avis):
    return next(c["attendu"] for c in JEU if c["avis"] == avis)


def test_jeu_vide():
    """un jeu vide ne fait pas planter la mesure"""
    resultat = evaluer(optimiste, [])
    assert resultat == {"precision": 0, "par_categorie": {}, "erreurs": []}, f"obtenu : {resultat!r}"


def test_classifieur_parfait():
    """un classifieur parfait obtient 1.0 partout"""
    resultat = evaluer(parfait, JEU)
    assert resultat == {"precision": 1.0, "par_categorie": {"positif": 1.0, "negatif": 1.0}, "erreurs": []}, f"obtenu : {resultat!r}"


def test_precision_globale():
    """la précision globale est la part de bonnes réponses"""
    assert evaluer(optimiste, JEU)["precision"] == 0.5


def test_par_categorie():
    """la précision par catégorie révèle ce que le chiffre global cache"""
    resultat = evaluer(optimiste, JEU)["par_categorie"]
    assert resultat == {"positif": 1.0, "negatif": 0.0}, f"obtenu : {resultat!r}"


def test_erreurs():
    """les id mal classés, dans l'ordre du jeu"""
    assert evaluer(optimiste, JEU)["erreurs"] == ["a2", "a4"]


def test_un_appel_par_cas():
    """le classifieur est appelé exactement une fois par cas (chaque appel est facturé)"""
    appels = []

    def compte(avis):
        appels.append(avis)
        return "positif"

    evaluer(compte, JEU)
    assert len(appels) == len(JEU), f"{len(appels)} appels pour {len(JEU)} cas"


def test_arrondi():
    """la précision est arrondie à deux décimales"""
    jeu = [{"id": str(i), "avis": str(i), "attendu": "positif" if i == 0 else "negatif"} for i in range(3)]
    assert evaluer(optimiste, jeu)["precision"] == 0.33
