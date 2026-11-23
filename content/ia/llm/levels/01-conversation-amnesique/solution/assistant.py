# Préparation des appels à l'API Messages, et lecture des réponses.

MODELE = "claude-opus-5-5"
CONSIGNE = "Tu es l'assistant de l'atelier Rustine. Réponds en français, en trois phrases maximum."


def preparer_requete(historique, question):
    return {
        "model": MODELE,
        "max_tokens": 1024,
        "system": CONSIGNE,  # la consigne a son propre champ, ce n'est pas un message
        # L'API est sans état : on renvoie toute la conversation, puis la nouvelle question.
        "messages": list(historique) + [{"role": "user", "content": question}],
    }


def texte_reponse(reponse):
    return "".join(bloc["text"] for bloc in reponse["content"] if bloc["type"] == "text")
