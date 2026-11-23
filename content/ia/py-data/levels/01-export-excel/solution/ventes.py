import csv
import io


def chiffre_affaires(texte_csv):
    entete = texte_csv.splitlines()[0] if texte_csv else ""
    separateur = ";" if ";" in entete else ","
    total = 0
    for ligne in csv.DictReader(io.StringIO(texte_csv), delimiter=separateur):
        quantite = int(ligne["quantite"].strip())
        prix = float(ligne["prix"].strip().replace(",", "."))
        total += quantite * prix
    return round(total, 2)
