# Lecture des analyses d'avis renvoyées par le LLM.
import json

SENTIMENTS = {"positif", "negatif", "neutre", "hors-sujet"}


def lire_analyse(texte):
    return json.loads(texte)
