def decouper(mots, taille, chevauchement):
    if not 0 <= chevauchement < taille:
        raise ValueError("il faut 0 <= chevauchement < taille")
    pas = taille - chevauchement
    morceaux = []
    debut = 0
    while debut < len(mots):
        morceaux.append(" ".join(mots[debut:debut + taille]))
        if debut + taille >= len(mots):
            break
        debut += pas
    return morceaux
