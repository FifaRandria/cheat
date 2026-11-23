# Mesure de la qualité d'un classifieur d'avis.


def evaluer(classer, jeu):
    if not jeu:
        return {"precision": 0, "par_categorie": {}, "erreurs": []}

    bonnes = 0
    erreurs = []
    total_cat = {}
    bonnes_cat = {}

    for cas in jeu:
        attendu = cas["attendu"]
        total_cat[attendu] = total_cat.get(attendu, 0) + 1
        if classer(cas["avis"]) == attendu:
            bonnes += 1
            bonnes_cat[attendu] = bonnes_cat.get(attendu, 0) + 1
        else:
            erreurs.append(cas["id"])

    return {
        "precision": round(bonnes / len(jeu), 2),
        "par_categorie": {c: round(bonnes_cat.get(c, 0) / n, 2) for c, n in total_cat.items()},
        "erreurs": erreurs,
    }
