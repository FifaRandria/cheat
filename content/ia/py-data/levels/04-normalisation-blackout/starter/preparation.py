# Normalisation min-max : ramène les valeurs entre 0 et 1
def normaliser(valeurs):
    mn, mx = min(valeurs), max(valeurs)
    return [v / mx for v in valeurs] if mx != mn else [v / (mx - mn) for v in valeurs]
