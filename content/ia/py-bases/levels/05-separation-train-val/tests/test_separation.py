from separation import separer

DATASET = [{"question": f"q{i}", "reponse": f"r{i}"} for i in range(10)]


def test_aucun_exemple_perdu():
    """aucun exemple n'est perdu"""
    train, validation = separer(DATASET, 0.8)
    assert len(train) + len(validation) == len(DATASET), f"{len(train)} + {len(validation)} != {len(DATASET)}"


def test_tailles():
    """80 % en entraînement, 20 % en validation"""
    train, validation = separer(DATASET, 0.8)
    assert (len(train), len(validation)) == (8, 2), f"obtenu : {len(train)} et {len(validation)}"


def test_pas_de_fuite():
    """aucun exemple n'est à la fois en entraînement et en validation"""
    train, validation = separer(DATASET, 0.8)
    communs = [ex for ex in validation if ex in train]
    assert communs == [], f"exemples en double : {communs}"


def test_ordre_conserve():
    """la validation reprend exactement là où l'entraînement s'arrête"""
    train, validation = separer(DATASET, 0.5)
    assert validation[0] == DATASET[5], f"premier exemple de validation : {validation[0] if validation else None}"
