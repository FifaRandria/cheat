MANQUANTES = {"", "na", "n/a"}


def est_manquante(r):
    return r is None or str(r).strip().lower() in MANQUANTES


def resume(releves):
    valeurs = [float(str(r).strip()) for r in releves if not est_manquante(r)]
    manquantes = len(releves) - len(valeurs)
    moyenne = round(sum(valeurs) / len(valeurs), 1) if valeurs else None
    return {"moyenne": moyenne, "manquantes": manquantes}
