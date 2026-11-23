from ventes import chiffre_affaires

ANGLAIS = "produit,quantite,prix\nClavier,2,49.90\nSouris,5,19.50\nÉcran,1,189.00\n"
FRANCAIS = "produit;quantite;prix\nClavier;2;49,90\nSouris;5;19,50\nÉcran;1;189,00\n"


def test_format_anglais():
    """l'export anglais fonctionne toujours"""
    assert chiffre_affaires(ANGLAIS) == 386.3


def test_format_francais():
    """l'export Excel français (« ; » et virgule décimale) est accepté"""
    resultat = chiffre_affaires(FRANCAIS)
    assert resultat == 386.3, f"obtenu : {resultat!r}"


def test_espaces():
    """les espaces autour des valeurs ne gênent pas"""
    assert chiffre_affaires("produit;quantite;prix\nClavier; 2 ; 49,90 \n") == 99.8
