def construire_prompt(question, passages):
    if passages:
        contexte = "\n".join(f"[{i}] {p}" for i, p in enumerate(passages, start=1))
    else:
        contexte = "Aucun document pertinent."
    return (
        "Tu es un assistant commercial. Réponds uniquement à partir des documents ci-dessous. "
        "Si la réponse n'y figure pas, réponds : je ne sais pas. "
        "Cite les numéros des documents utilisés.\n\n"
        f"Documents :\n{contexte}\n\n"
        f"Question : {question}"
    )
