# Découpe une liste de mots en morceaux qui se chevauchent
def decouper(mots, taille, chevauchement):
    morceaux = []
    for debut in range(0, len(mots) - taille, taille):
        morceaux.append(" ".join(mots[debut:debut + taille]))
    return morceaux
