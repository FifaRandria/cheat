# Préparation des appels à l'API Messages, et lecture des réponses.

MODELE = "claude-opus-5-5"
CONSIGNE = "Tu es l'assistant de l'atelier Rustine. Réponds en français, en trois phrases maximum."


def preparer_requete(historique, question):
    return {
        "model": MODELE,
        "messages": [
            {"role": "system", "content": CONSIGNE},
            {"role": "user", "content": question},
        ],
    }


def texte_reponse(reponse):
    return reponse["content"][0]["text"]
