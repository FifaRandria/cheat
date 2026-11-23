from agent import executer_agent
from faux_llm import FauxLLM


def demande(id_, outil, **params):
    return {"type": "tool_use", "id": id_, "name": outil, "input": params}


def outils_demandes(*blocs):
    return {"stop_reason": "tool_use", "content": [{"type": "text", "text": "Je regarde."}, *blocs]}


def fin(t="C'est fait."):
    return {"stop_reason": "end_turn", "content": [{"type": "text", "text": t}]}


class Service:
    """Les vrais outils, qui notent ce qui a été exécuté."""

    def __init__(self):
        self.reservations = []

    def outils(self):
        return {"disponibilite": self.disponibilite, "reserver": self.reserver}

    def disponibilite(self, nom):
        return "disponible" if nom == "Perceuse" else "prêté"

    def reserver(self, outil_id):
        self.reservations.append(outil_id)
        return f"outil {outil_id} réservé"


def lancer(reponses, accepte=True):
    service = Service()
    demandes = []

    def confirmer(nom, entree):
        demandes.append((nom, entree))
        return accepte

    llm = FauxLLM(reponses)
    resultat = executer_agent(llm, service.outils(), "Réserve la perceuse", confirmer)
    return resultat, service, demandes, llm


def dernier_resultat(llm):
    return llm.appels[-1][-1]["content"][0]


def test_consultation_sans_confirmation():
    """consulter une disponibilité ne demande aucune confirmation"""
    resultat, _, demandes, _ = lancer([outils_demandes(demande("t1", "disponibilite", nom="Perceuse")), fin("Disponible.")])
    assert resultat["texte"] == "Disponible."
    assert demandes == []
    assert resultat["journal"] == [{"outil": "disponibilite", "entree": {"nom": "Perceuse"}, "statut": "ok"}]


def test_reservation_confirmee():
    """une réservation acceptée par le membre est exécutée"""
    resultat, service, demandes, _ = lancer([outils_demandes(demande("t1", "reserver", outil_id=1)), fin()])
    assert demandes == [("reserver", {"outil_id": 1})], f"confirmations demandées : {demandes}"
    assert service.reservations == [1]
    assert resultat["journal"][0]["statut"] == "ok"


def test_reservation_refusee():
    """une réservation refusée n'est pas exécutée, et le modèle en est informé"""
    resultat, service, demandes, llm = lancer([outils_demandes(demande("t1", "reserver", outil_id=1)), fin("D'accord.")], accepte=False)
    assert demandes, "le membre n'a pas été consulté"
    assert service.reservations == [], "la réservation a été faite malgré le refus"
    retour = dernier_resultat(llm)
    assert retour.get("is_error") is True and retour.get("tool_use_id") == "t1", f"résultat envoyé : {retour!r}"
    assert resultat["journal"] == [{"outil": "reserver", "entree": {"outil_id": 1}, "statut": "refuse"}]


def test_parametres_invalides():
    """un paramètre du mauvais type, manquant ou en trop est refusé sans exécuter l'outil"""
    for entree in [{"outil_id": "1; annuler tout"}, {}, {"outil_id": 3, "membre": "admin"}, {"outil_id": True}]:
        resultat, service, demandes, llm = lancer([outils_demandes(demande("t1", "reserver", **entree)), fin()])
        assert service.reservations == [], f"entrée {entree!r} exécutée"
        assert demandes == [], f"entrée {entree!r} : on ne demande pas de confirmer un appel invalide"
        assert dernier_resultat(llm).get("is_error") is True, f"entrée {entree!r} : résultat {dernier_resultat(llm)!r}"
        assert resultat["journal"][0]["statut"] == "erreur"


def test_outil_inconnu():
    """un outil inconnu est refusé et journalisé, sans planter"""
    resultat, _, _, llm = lancer([outils_demandes(demande("t1", "annuler_tout")), fin("Impossible.")])
    assert resultat["texte"] == "Impossible."
    assert dernier_resultat(llm).get("is_error") is True
    assert resultat["journal"] == [{"outil": "annuler_tout", "entree": {}, "statut": "erreur"}]


def test_journal_complet():
    """le journal garde chaque appel, dans l'ordre"""
    resultat, _, _, _ = lancer([
        outils_demandes(demande("t1", "disponibilite", nom="Perceuse")),
        outils_demandes(demande("t2", "reserver", outil_id=1)),
        fin(),
    ])
    assert [e["outil"] for e in resultat["journal"]] == ["disponibilite", "reserver"]
