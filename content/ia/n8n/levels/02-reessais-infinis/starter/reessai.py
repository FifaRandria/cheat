MAX_TENTATIVES = 4


# Que faire après l'échec de la tentative n° « tentative » (à partir de 1) ?
def politique(tentative, statut):
    if statut >= 400:
        return ("reessayer", 0)
    return ("abandonner", 0)
