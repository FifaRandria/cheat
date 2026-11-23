def top_k(scores, k, seuil=0.0):
    pertinents = [s for s in scores if s[1] >= seuil]
    tries = sorted(pertinents, key=lambda s: s[1], reverse=True)
    return [passage for passage, score in tries[:k]]
