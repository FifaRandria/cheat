# Boucle d'agent : le modèle demande des outils, le code les exécute.

MAX_TOURS = 5


def texte(reponse):
    return "".join(b["text"] for b in reponse["content"] if b["type"] == "text")


def executer_outil(outils, bloc):
    """Exécute un outil demandé ; une erreur devient un résultat d'erreur, pas un plantage."""
    try:
        if bloc["name"] not in outils:
            raise KeyError(f"outil inconnu : {bloc['name']}")
        return {"type": "tool_result", "tool_use_id": bloc["id"], "content": str(outils[bloc["name"]](**bloc["input"]))}
    except Exception as erreur:
        return {"type": "tool_result", "tool_use_id": bloc["id"], "content": f"Erreur : {erreur}", "is_error": True}


def executer_agent(llm, outils, question):
    messages = [{"role": "user", "content": question}]

    for _ in range(MAX_TOURS):  # une limite : chaque tour est un appel facturé
        reponse = llm.creer(messages=messages, outils=list(outils))
        if reponse["stop_reason"] == "end_turn":
            return texte(reponse)

        # 1. Le modèle doit retrouver sa propre demande dans l'historique.
        messages.append({"role": "assistant", "content": reponse["content"]})

        # 2. Tous les résultats, reliés à leur demande, dans un seul message user.
        resultats = [executer_outil(outils, b) for b in reponse["content"] if b["type"] == "tool_use"]
        messages.append({"role": "user", "content": resultats})

    return "Désolé, je n'ai pas pu terminer."
