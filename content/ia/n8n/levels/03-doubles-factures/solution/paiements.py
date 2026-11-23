def traiter_evenements(evenements):
    deja_traites = set()
    factures = []
    for e in evenements:
        if e["id"] in deja_traites:
            continue
        deja_traites.add(e["id"])
        factures.append({"client": e["client"], "montant": e["montant"]})
    return factures
