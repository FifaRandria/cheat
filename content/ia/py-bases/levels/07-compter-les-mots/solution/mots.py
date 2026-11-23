PONCTUATION = ".,;:!?"


def compter_mots(texte):
    texte = texte.lower()
    for signe in PONCTUATION:
        texte = texte.replace(signe, " ")

    resultat = {}
    for mot in texte.split():
        resultat[mot] = resultat.get(mot, 0) + 1
    return resultat
