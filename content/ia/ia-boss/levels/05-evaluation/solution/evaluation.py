# Mesure de la qualité de l'assistant.

REFUS = "je ne sais pas"


def reussi(cas, texte):
    texte = texte.lower()
    if cas["attendu"] is None:
        return REFUS in texte
    return all(mot.lower() in texte for mot in cas["attendu"])


def evaluer_assistant(repondre, jeu):
    if not jeu:
        return {"reussite": 0, "refus_corrects": None, "jetons_moyens": 0, "echecs": []}

    echecs = []
    jetons = 0
    hors_sujet = 0
    refus_ok = 0

    for cas in jeu:
        reponse = repondre(cas["question"])
        jetons += reponse["jetons"]
        ok = reussi(cas, reponse["texte"])
        if cas["attendu"] is None:
            hors_sujet += 1
            refus_ok += 1 if ok else 0
        if not ok:
            echecs.append(cas["id"])

    return {
        "reussite": round((len(jeu) - len(echecs)) / len(jeu), 2),
        "refus_corrects": round(refus_ok / hors_sujet, 2) if hors_sujet else None,
        "jetons_moyens": round(jetons / len(jeu)),
        "echecs": echecs,
    }
