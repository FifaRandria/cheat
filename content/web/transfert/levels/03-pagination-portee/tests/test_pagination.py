from pagination import nombre_de_pages, page


def test_nombre_de_pages():
    """arrondi au-dessus : une page entamée compte"""
    for total, attendu in [(25, 3), (20, 2), (21, 3), (1, 1), (0, 0), (35, 4)]:
        obtenu = nombre_de_pages(total, 10)
        assert obtenu == attendu, f"{total} articles : {attendu} pages attendues, obtenu {obtenu!r}"


def test_premiere_page():
    """la page 1 contient les premiers éléments"""
    elements = list(range(1, 26))
    resultat = page(elements, 1, 10)
    assert resultat == list(range(1, 11)), f"obtenu : {resultat!r}"


def test_derniere_page():
    """la dernière page peut être incomplète"""
    elements = list(range(1, 26))
    resultat = page(elements, 3, 10)
    assert resultat == [21, 22, 23, 24, 25], f"obtenu : {resultat!r}"


def test_page_hors_limites():
    """une page au-delà de la dernière est vide"""
    assert page(list(range(5)), 4, 10) == []
