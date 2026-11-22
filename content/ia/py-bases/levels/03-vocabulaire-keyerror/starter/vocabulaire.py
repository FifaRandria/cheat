# Compte les occurrences de chaque mot (sans tenir compte des majuscules)
def compter_mots(texte):
    compteur = {}
    for mot in texte.lower().split():
        compteur[mot] += 1
    return compteur
