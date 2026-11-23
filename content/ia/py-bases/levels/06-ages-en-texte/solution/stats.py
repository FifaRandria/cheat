def age_moyen(personnes):
    ages = []
    for p in personnes:
        valeur = p.get("age")
        if valeur is None:
            continue
        try:
            ages.append(int(str(valeur).strip()))
        except ValueError:
            continue
    if not ages:
        return 0
    return sum(ages) / len(ages)
