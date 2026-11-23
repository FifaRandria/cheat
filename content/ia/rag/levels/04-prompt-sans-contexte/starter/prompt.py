# Construit le prompt envoyé au modèle de langage
def construire_prompt(question, passages):
    contexte = "\n".join(passages)
    return f"Tu es un assistant commercial. Question : {question}"
