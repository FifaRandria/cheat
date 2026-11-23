from agent import MAX_TOURS, executer_agent
from faux_llm import FauxLLM


def demande(id_, nom, **params):
    return {"type": "tool_use", "id": id_, "name": nom, "input": params}


def fin(texte):
    return {"stop_reason": "end_turn", "content": [{"type": "text", "text": texte}]}


def appel_outils(*blocs):
    return {"stop_reason": "tool_use", "content": [{"type": "text", "text": "Je vérifie."}, *blocs]}


OUTILS = {
    "stock_piece": lambda reference: 3 if reference == "CH-11V" else 0,
    "planning_atelier": lambda jour: "2 créneaux libres",
}


def test_reponse_directe():
    """sans outil, l'agent renvoie le texte du modèle"""
    llm = FauxLLM([fin("Bonjour !")])
    assert executer_agent(llm, OUTILS, "Salut") == "Bonjour !"


def test_historique_d_un_tour():
    """après un outil, le modèle reçoit sa demande puis le résultat relié par tool_use_id"""
    llm = FauxLLM([appel_outils(demande("t1", "stock_piece", reference="CH-11V")), fin("3 en stock.")])
    assert executer_agent(llm, OUTILS, "Chaîne CH-11V ?") == "3 en stock."
    messages = llm.appels[1]
    roles = [m["role"] for m in messages]
    assert roles == ["user", "assistant", "user"], f"rôles envoyés au 2e appel : {roles}"
    assert messages[1]["content"][1]["type"] == "tool_use", "la réponse assistant (avec sa demande d'outil) doit être dans l'historique"
    resultat = messages[2]["content"][0]
    assert resultat.get("tool_use_id") == "t1", f"tool_result reçu : {resultat!r}"
    assert resultat["content"] == "3"


def test_plusieurs_outils_un_message():
    """deux demandes dans le même tour donnent deux résultats dans un seul message user"""
    llm = FauxLLM([
        appel_outils(demande("t1", "stock_piece", reference="CH-11V"), demande("t2", "planning_atelier", jour="samedi")),
        fin("OK"),
    ])
    executer_agent(llm, OUTILS, "Réparer samedi ?")
    dernier = llm.appels[1][-1]
    assert dernier["role"] == "user"
    ids = [r.get("tool_use_id") for r in dernier["content"]]
    assert ids == ["t1", "t2"], f"résultats envoyés : {dernier['content']!r}"


def test_outil_inconnu():
    """un outil inconnu produit un résultat d'erreur, sans planter"""
    llm = FauxLLM([appel_outils(demande("t9", "annuler_commande", numero=12)), fin("Je ne peux pas faire ça.")])
    assert executer_agent(llm, OUTILS, "Annule tout") == "Je ne peux pas faire ça."
    resultat = llm.appels[1][-1]["content"][0]
    assert resultat.get("is_error") is True, f"résultat envoyé : {resultat!r}"
    assert resultat.get("tool_use_id") == "t9"


def test_outil_en_erreur():
    """un outil qui lève une exception produit un résultat d'erreur"""
    def casse(**_):
        raise ValueError("planning indisponible")

    llm = FauxLLM([appel_outils(demande("t1", "planning_atelier", jour="lundi")), fin("Réessaie plus tard.")])
    assert executer_agent(llm, {"planning_atelier": casse}, "Lundi ?") == "Réessaie plus tard."
    resultat = llm.appels[1][-1]["content"][0]
    assert resultat.get("is_error") is True and "planning indisponible" in resultat["content"], f"résultat : {resultat!r}"


def test_limite_de_tours():
    """un modèle qui demande des outils sans fin est arrêté après MAX_TOURS appels"""
    llm = FauxLLM([appel_outils(demande("t1", "stock_piece", reference="CH-11V"))])
    assert executer_agent(llm, OUTILS, "Stock ?") == "Désolé, je n'ai pas pu terminer."
    assert len(llm.appels) == MAX_TOURS, f"{len(llm.appels)} appels au modèle"
