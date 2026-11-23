# Les k passages les plus similaires, au-dessus du seuil
def top_k(scores, k, seuil=0.0):
    tries = sorted(scores, key=lambda s: s[1])
    return [passage for passage, score in tries[:k]]
