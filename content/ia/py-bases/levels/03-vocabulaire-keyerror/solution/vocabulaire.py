def compter_mots(texte):
    compteur = {}
    for mot in texte.lower().split():
        compteur[mot] = compteur.get(mot, 0) + 1
    return compteur
