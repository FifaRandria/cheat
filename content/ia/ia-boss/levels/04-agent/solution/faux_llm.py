# Faux LLM pour les tests : il rejoue des réponses écrites à l'avance, avec la même forme que
# l'API Messages. Ce fichier n'est pas en cause.
import copy


class FauxLLM:
    def __init__(self, reponses):
        self.reponses = list(reponses)
        self.appels = []  # copie des messages reçus à chaque appel

    def creer(self, messages, outils):
        self.appels.append(copy.deepcopy(messages))
        if len(self.appels) > 50:
            raise RuntimeError("plus de 50 appels : la boucle ne s'arrête jamais")
        index = min(len(self.appels) - 1, len(self.reponses) - 1)
        return copy.deepcopy(self.reponses[index])
