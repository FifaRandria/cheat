import csv
import io


# Chiffre d'affaires d'un export de ventes (quantite x prix), arrondi au centime
def chiffre_affaires(texte_csv):
    total = 0
    for ligne in csv.DictReader(io.StringIO(texte_csv)):
        total += int(ligne["quantite"]) * float(ligne["prix"])
    return round(total, 2)
