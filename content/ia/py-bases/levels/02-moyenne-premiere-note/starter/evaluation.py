# Proportion de prédictions correctes (entre 0.0 et 1.0)
def precision(predictions, attendus):
    correctes = 0
    for i in range(len(predictions)):
        if predictions[i] == attendus[i]:
            correctes += 1
        return correctes / len(predictions)
