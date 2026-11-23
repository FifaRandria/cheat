from requete import CONSIGNE, MAX_HISTORIQUE, MODELE, preparer_requete

PASSAGES = [
    {"id": "R3", "titre": "Emprunts", "texte": "Un membre peut emprunter trois outils au maximum en même temps."},
    {"id": "R4", "titre": "Emprunts", "texte": "La durée d'un prêt est de sept jours."},
]


def conversation(n):
    """n messages alternés, en commençant par user."""
    return [{"role": "user" if i % 2 == 0 else "assistant", "content": f"m{i}"} for i in range(n)]


def test_parametres():
    """model et max_tokens sont présents"""
    p = preparer_requete("Combien d'outils ?", PASSAGES, [])
    assert p.get("model") == MODELE
    assert isinstance(p.get("max_tokens"), int) and p["max_tokens"] > 0


def test_consigne_et_documents():
    """system contient la consigne puis les documents délimités"""
    system = preparer_requete("Combien d'outils ?", PASSAGES, [])["system"]
    assert system.startswith(CONSIGNE + "\n\n"), "system commence par la consigne, puis une ligne vide"
    assert '<document id="R3">Emprunts : Un membre peut emprunter trois outils au maximum en même temps.</document>' in system, system
    assert '<document id="R4">' in system
    assert system.index("<documents>") < system.index('<document id="R3">') < system.index("</documents>")


def test_sans_document():
    """sans passage, le bloc de documents le dit"""
    system = preparer_requete("Capitale du Pérou ?", [], [])["system"]
    assert "Aucun document pertinent." in system
    assert "<documents>" in system and "</documents>" in system


def test_question_en_dernier():
    """la question est le dernier message, avec le rôle user"""
    p = preparer_requete("Et le samedi ?", PASSAGES, conversation(2))
    assert p["messages"][-1] == {"role": "user", "content": "Et le samedi ?"}
    assert all(m["role"] != "system" for m in p["messages"]), "la consigne ne va pas dans messages"


def test_historique_limite():
    """au plus 6 messages d'historique sont renvoyés"""
    p = preparer_requete("Question", PASSAGES, conversation(20))
    anciens = p["messages"][:-1]
    assert len(anciens) <= MAX_HISTORIQUE, f"{len(anciens)} messages d'historique renvoyés"
    assert anciens[-1]["content"] == "m19", "ce sont les plus récents qui comptent"


def test_commence_par_user():
    """la conversation envoyée commence toujours par un message user"""
    p = preparer_requete("Question", PASSAGES, conversation(9))
    assert p["messages"][0]["role"] == "user", f"premier message : {p['messages'][0]!r}"


def test_historique_non_modifie():
    """l'historique reçu n'est pas modifié"""
    h = conversation(4)
    copie = [dict(m) for m in h]
    preparer_requete("Question", PASSAGES, h)
    assert h == copie
