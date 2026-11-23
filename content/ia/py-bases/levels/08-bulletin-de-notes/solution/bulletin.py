def mention(moyenne):
    if moyenne < 10:
        return "Insuffisant"
    elif moyenne < 12:
        return "Passable"
    elif moyenne < 14:
        return "Assez bien"
    elif moyenne < 16:
        return "Bien"
    return "Très bien"


def bulletin(notes):
    if not notes:
        return None
    moyenne = round(sum(notes) / len(notes), 1)
    return {
        "moyenne": moyenne,
        "min": min(notes),
        "max": max(notes),
        "mention": mention(moyenne),
    }
