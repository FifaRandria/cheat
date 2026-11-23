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


def valider(nom, entree):
    """Un message d'erreur si l'appel est invalide, sinon None."""
    if nom not in SCHEMAS:
        return f"outil inconnu : {nom}"
    attendus = SCHEMAS[nom]
    if not isinstance(entree, dict) or set(entree) != set(attendus):
        return f"paramètres attendus pour {nom} : {sorted(attendus)}"
    for cle, type_ in attendus.items():
        valeur = entree[cle]
        if not isinstance(valeur, type_) or isinstance(valeur, bool):
            return f"{cle} doit être de type {type_.__name__}"
    return None


def erreur(bloc, message):
    return {"type": "tool_result", "tool_use_id": bloc["id"], "content": message, "is_error": True}


def traiter(bloc, outils, confirmer, journal):
    nom, entree = bloc["name"], bloc["input"]
    probleme = valider(nom, entree)
    if probleme or nom not in outils:
        journal.append({"outil": nom, "entree": entree, "statut": "erreur"})
        return erreur(bloc, probleme or f"outil indisponible : {nom}")

    if nom in SENSIBLES and not confirmer(nom, entree):
        journal.append({"outil": nom, "entree": entree, "statut": "refuse"})
        return erreur(bloc, "Le membre a refusé cette action. Ne la refais pas sans nouvelle demande.")

    try:
        resultat = outils[nom](**entree)
    except Exception as e:
        journal.append({"outil": nom, "entree": entree, "statut": "erreur"})
        return erreur(bloc, f"Erreur : {e}")
    journal.append({"outil": nom, "entree": entree, "statut": "ok"})
    return {"type": "tool_result", "tool_use_id": bloc["id"], "content": str(resultat)}


def executer_agent(llm, outils, question, confirmer):
    messages = [{"role": "user", "content": question}]
    journal = []

    for _ in range(MAX_TOURS):
        reponse = llm.creer(messages=messages, outils=list(outils))
        if reponse["stop_reason"] == "end_turn":
            return {"texte": texte(reponse), "journal": journal}

        messages.append({"role": "assistant", "content": reponse["content"]})
        resultats = [traiter(b, outils, confirmer, journal) for b in reponse["content"] if b["type"] == "tool_use"]
        messages.append({"role": "user", "content": resultats})

    return {"texte": "Désolé, je n'ai pas pu terminer.", "journal": journal}
