REMISES = {"BIENVENUE": 0.1, "VIP": 0.2, "SOLDES": 0.3}


def total_avec_promo(prix, code=None):
    cle = (code or "").strip().upper()
    taux = REMISES.get(cle, 0)
    return round(prix * (1 - taux), 2)
