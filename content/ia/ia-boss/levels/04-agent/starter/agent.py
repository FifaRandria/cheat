# L'agent de l'assistant : il peut consulter la disponibilité d'un outil et en réserver un.

MAX_TOURS = 5

# Les paramètres attendus par chaque outil, et leur type.
SCHEMAS = {
    "disponibilite": {"nom": str},
    "reserver": {"outil_id": int},
}

# Les outils qui modifient quelque chose : jamais sans l'accord du membre.
SENSIBLES = {"reserver"}


def texte(reponse):
    return "".join(b["text"] for b in reponse["content"] if b["type"] == "text")


def executer_agent(llm, outils, question, confirmer):
    messages = [{"role": "user", "content": question}]

    for _ in range(MAX_TOURS):
        reponse = llm.creer(messages=messages, outils=list(outils))
        if reponse["stop_reason"] == "end_turn":
            return {"texte": texte(reponse), "journal": []}

        messages.append({"role": "assistant", "content": reponse["content"]})
        resultats = []
        for bloc in reponse["content"]:
            if bloc["type"] != "tool_use":
                continue
            resultat = outils[bloc["name"]](**bloc["input"])
            resultats.append({"type": "tool_result", "tool_use_id": bloc["id"], "content": str(resultat)})
        messages.append({"role": "user", "content": resultats})

    return {"texte": "Désolé, je n'ai pas pu terminer.", "journal": []}
