# La recherche dans le règlement (le « R » de RAG).
from vecteurs import similarite, vecteur


def decouper(reglement):
    """Un passage par paragraphe, avec le titre de sa section : [{id, titre, texte}]."""
    passages = []
    titre = ""
    for ligne in reglement.splitlines():
        ligne = ligne.strip()
        if not ligne:
            continue
        if ligne.startswith("## "):
            titre = ligne[3:].strip()
            continue
        passages.append({"id": f"R{len(passages) + 1}", "titre": titre, "texte": ligne})
    return passages


def rechercher(question, passages, k=2, seuil=0.15):
    """Les k passages les plus proches de la question, au-dessus du seuil, du plus proche au moins proche."""
    q = vecteur(question)
    scores = [(similarite(q, vecteur(f"{p['titre']} {p['texte']}")), p) for p in passages]
    pertinents = [(s, p) for s, p in scores if s >= seuil]
    pertinents.sort(key=lambda sp: sp[0], reverse=True)
    return [p for s, p in pertinents[:k]]
