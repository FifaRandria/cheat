# Lecture des analyses d'avis renvoyées par le LLM.
import json

SENTIMENTS = {"positif", "negatif", "neutre", "hors-sujet"}


def lire_analyse(texte):
    # 1. Extraire : le modèle entoure parfois le JSON de texte ou de balises de code.
    debut, fin = texte.find("{"), texte.rfind("}")
    if debut == -1 or fin < debut:
        return None

    # 2. Parser, sans laisser une réponse invalide faire planter la nuit entière.
    try:
        donnees = json.loads(texte[debut : fin + 1])
    except json.JSONDecodeError:
        return None
    if not isinstance(donnees, dict):
        return None

    # 3. Valider : le modèle a reçu des consignes, le code les fait respecter.
    note, sentiment = donnees.get("note"), donnees.get("sentiment")
    if not isinstance(note, int) or isinstance(note, bool) or not 1 <= note <= 5:
        return None
    if sentiment not in SENTIMENTS:
        return None
    return {"note": note, "sentiment": sentiment}
