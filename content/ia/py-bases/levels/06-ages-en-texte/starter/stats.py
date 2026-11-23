# Âge moyen des inscrits
def age_moyen(personnes):
    total = 0
    for p in personnes:
        total += p["age"]
    return total / len(personnes)
