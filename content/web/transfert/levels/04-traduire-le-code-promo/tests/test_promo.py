from promo import total_avec_promo


def test_code_majuscules():
    """un code en majuscules fonctionne"""
    assert total_avec_promo(100, "VIP") == 80


def test_casse():
    """la casse du code est ignorée"""
    assert total_avec_promo(100, "vip") == 80
    assert total_avec_promo(100, "Soldes") == 70


def test_espaces():
    """les espaces autour du code sont ignorés"""
    assert total_avec_promo(50, " BIENVENUE ") == 45


def test_inconnu():
    """un code inconnu ne retire rien"""
    assert total_avec_promo(100, "GRATUIT") == 100


def test_sans_code():
    """sans code, le prix est inchangé"""
    assert total_avec_promo(100) == 100
    assert total_avec_promo(100, None) == 100


def test_arrondi():
    """le total est arrondi au centime"""
    resultat = total_avec_promo(19.99, "vip")
    assert resultat == 15.99, f"obtenu : {resultat!r}"
