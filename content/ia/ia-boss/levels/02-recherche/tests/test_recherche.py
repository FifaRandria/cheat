from recherche import decouper, rechercher
from reglement import REGLEMENT

PASSAGES = None


def passages():
    global PASSAGES
    if PASSAGES is None:
        PASSAGES = decouper(REGLEMENT)
    return PASSAGES


def ids(question, **options):
    return [p["id"] for p in rechercher(question, passages(), **options)]


def test_decoupage():
    """un passage par paragraphe, avec le titre de sa section"""
    p = passages()
    assert len(p) == 8, f"{len(p)} passages (8 paragraphes attendus)"
    assert p[0] == {
        "id": "R1",
        "titre": "Adhésion",
        "texte": "L'adhésion coûte 20 euros par an et donne accès à tous les outils de la Boîte.",
    }, f"premier passage : {p[0]!r}"
    assert [x["id"] for x in p] == [f"R{i}" for i in range(1, 9)]
    assert p[7]["titre"] == "Horaires"


def test_titres_non_decoupes():
    """les lignes de titre ne deviennent pas des passages"""
    assert not any(x["texte"].startswith("##") for x in passages())


def test_questions_simples():
    """chaque question trouve le bon passage en premier"""
    cas = {
        "Combien coûte l'adhésion ?": "R1",
        "Un mineur peut-il adhérer ?": "R2",
        "Combien d'outils puis-je emprunter en même temps ?": "R3",
        "La durée du prêt peut-elle être prolongée ?": "R4",
        "Faut-il payer une caution ?": "R5",
        "Que se passe-t-il en cas de retard ?": "R6",
        "Quels sont les horaires d'ouverture ?": "R8",
    }
    for question, attendu in cas.items():
        trouves = ids(question)
        assert trouves and trouves[0] == attendu, f"{question!r} : {trouves} (attendu {attendu} en premier)"


def test_k_passages_au_plus():
    """au plus k passages, du plus proche au moins proche"""
    trouves = ids("Combien coûte l'adhésion ?", k=1)
    assert trouves == ["R1"], f"obtenu : {trouves}"
    assert len(ids("outil cassé caution retard", k=3)) <= 3


def test_hors_sujet():
    """une question hors sujet ne renvoie aucun passage"""
    trouves = ids("Quelle est la capitale du Pérou ?")
    assert trouves == [], f"passages renvoyés pour une question hors sujet : {trouves}"


def test_casse():
    """la question sur un outil cassé retrouve le paragraphe sur la casse"""
    assert "R7" in ids("Que se passe-t-il si mon outil est cassé ?")
