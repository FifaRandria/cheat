MAX_TENTATIVES = 4


def politique(tentative, statut):
    passagere = statut == 429 or 500 <= statut <= 599
    if not passagere or tentative >= MAX_TENTATIVES:
        return ("abandonner", 0)
    return ("reessayer", 2 ** (tentative - 1))
