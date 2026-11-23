import math


def produit_scalaire(a, b):
    return sum(x * y for x, y in zip(a, b))


def norme(v):
    return math.sqrt(sum(x * x for x in v))


def similarite(a, b):
    na, nb = norme(a), norme(b)
    if na == 0 or nb == 0:
        return 0.0
    return produit_scalaire(a, b) / (na * nb)


def meilleur_document(question, documents):
    """documents : liste de (nom, vecteur). Renvoie le nom du document le plus proche."""
    return max(documents, key=lambda d: similarite(question, d[1]))[0]
