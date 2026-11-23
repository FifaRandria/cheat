# Transforme les webhooks de paiement reçus en factures à créer
def traiter_evenements(evenements):
    factures = []
    for e in evenements:
        factures.append({"client": e["client"], "montant": e["montant"]})
    return factures
