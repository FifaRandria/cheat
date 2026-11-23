# Des « embeddings » très simples : un texte devient un dictionnaire {mot: nombre d'apparitions}.
# Les vrais modèles d'embeddings capturent le sens (« prolonger » et « prolongée » seraient
# proches) ; celui-ci ne compare que les mots, mais la recherche fonctionne de la même façon.
# Ce fichier n'est pas en cause.
import math
import re

MOTS_VIDES = {
    "les", "des", "une", "est", "que", "qui", "pour", "par", "dans", "avec", "sur", "pas", "son",
    "ses", "aux", "elle", "mon", "mes", "puis", "peut", "quel", "quels", "quelle", "quelles",
    "combien", "comment", "est-ce", "faut", "fait", "sont", "être", "tous", "toutes",
}


def vecteur(texte):
    """Compte les mots significatifs (3 lettres ou plus, hors mots vides), au singulier."""
    compte = {}
    for mot in re.findall(r"[a-zàâçéèêëîïôûùüÿœ]+", texte.lower()):
        if len(mot) < 3 or mot in MOTS_VIDES:
            continue
        if mot.endswith("s") and len(mot) > 3:
            mot = mot[:-1]
        compte[mot] = compte.get(mot, 0) + 1
    return compte


def similarite(a, b):
    """Similarité cosinus entre deux vecteurs-dictionnaires, entre 0 et 1."""
    produit = sum(n * b.get(mot, 0) for mot, n in a.items())
    na = math.sqrt(sum(n * n for n in a.values()))
    nb = math.sqrt(sum(n * n for n in b.values()))
    if na == 0 or nb == 0:
        return 0.0
    return produit / (na * nb)
