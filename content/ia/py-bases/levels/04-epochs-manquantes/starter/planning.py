# Étiquettes affichées pendant l'entraînement : "epoch 1/3", "epoch 2/3"...
def planning(nb_epochs):
    etiquettes = []
    for epoch in range(1, nb_epochs):
        etiquettes.append(f"epoch {epoch}/{nb_epochs}")
    return etiquettes
