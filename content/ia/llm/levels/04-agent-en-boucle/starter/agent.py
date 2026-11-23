# Boucle d'agent : le modèle demande des outils, le code les exécute.

MAX_TOURS = 5


def texte(reponse):
    return "".join(b["text"] for b in reponse["content"] if b["type"] == "text")


def executer_agent(llm, outils, question):
    messages = [{"role": "user", "content": question}]
    while True:
        reponse = llm.creer(messages=messages, outils=list(outils))
        if reponse["stop_reason"] == "end_turn":
            return texte(reponse)

        for bloc in reponse["content"]:
            if bloc["type"] == "tool_use":
                resultat = outils[bloc["name"]](**bloc["input"])
                messages.append({"role": "user", "content": [{"type": "tool_result", "content": str(resultat)}]})
