from paiements import traiter_evenements


def test_reemission_ignoree():
    """un événement reçu deux fois ne crée qu'une facture"""
    evenements = [
        {"id": "evt_7a1", "client": "ada", "montant": 49},
        {"id": "evt_7a1", "client": "ada", "montant": 49},
    ]
    resultat = traiter_evenements(evenements)
    assert resultat == [{"client": "ada", "montant": 49}], f"obtenu : {resultat}"


def test_deux_achats_legitimes():
    """deux paiements différents du même montant donnent deux factures"""
    evenements = [
        {"id": "evt_1", "client": "bob", "montant": 25},
        {"id": "evt_2", "client": "bob", "montant": 25},
    ]
    assert len(traiter_evenements(evenements)) == 2


def test_ordre_et_melange():
    """l'ordre d'arrivée est conservé, doublons ignorés où qu'ils soient"""
    evenements = [
        {"id": "a", "client": "ada", "montant": 10},
        {"id": "b", "client": "eve", "montant": 20},
        {"id": "a", "client": "ada", "montant": 10},
        {"id": "c", "client": "ada", "montant": 10},
    ]
    clients = [f["client"] for f in traiter_evenements(evenements)]
    assert clients == ["ada", "eve", "ada"], f"obtenu : {clients}"
