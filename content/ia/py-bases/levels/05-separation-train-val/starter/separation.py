# Sépare un dataset en (entraînement, validation)
def separer(exemples, ratio=0.8):
    coupure = int(len(exemples) * ratio)
    train = exemples[:coupure]
    validation = exemples[coupure + 1:]
    return train, validation
