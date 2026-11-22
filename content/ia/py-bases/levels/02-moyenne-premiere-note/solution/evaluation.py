def precision(predictions, attendus):
    if len(predictions) == 0:
        return 0.0
    correctes = 0
    for i in range(len(predictions)):
        if predictions[i] == attendus[i]:
            correctes += 1
    return correctes / len(predictions)
