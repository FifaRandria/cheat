def normaliser(valeurs):
    if not valeurs:
        return []
    mn, mx = min(valeurs), max(valeurs)
    if mx == mn:
        return [0.0 for _ in valeurs]
    return [(v - mn) / (mx - mn) for v in valeurs]
