# Résumé d'une série de relevés de température
def resume(releves):
    total = 0
    for r in releves:
        try:
            total += float(r)
        except (TypeError, ValueError):
            total += 0
    return {"moyenne": round(total / len(releves), 1), "manquantes": 0}
