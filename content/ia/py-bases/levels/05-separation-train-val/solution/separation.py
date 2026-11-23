def separer(exemples, ratio=0.8):
    coupure = int(len(exemples) * ratio)
    train = exemples[:coupure]
    validation = exemples[coupure:]
    return train, validation
