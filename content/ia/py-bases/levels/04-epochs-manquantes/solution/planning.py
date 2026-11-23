def planning(nb_epochs):
    etiquettes = []
    for epoch in range(1, nb_epochs + 1):
        etiquettes.append(f"epoch {epoch}/{nb_epochs}")
    return etiquettes
