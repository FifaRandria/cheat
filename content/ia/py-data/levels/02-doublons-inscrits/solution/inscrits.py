def inscrits_uniques(emails):
    vus = set()
    resultat = []
    for email in emails:
        propre = (email or "").strip().lower()
        if propre and propre not in vus:
            vus.add(propre)
            resultat.append(propre)
    return resultat
