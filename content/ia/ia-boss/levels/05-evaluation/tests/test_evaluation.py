from evaluation import evaluer_assistant

JEU = [
    {"id": "q1", "question": "Combien coûte l'adhésion ?", "attendu": ["20 euros"]},
    {"id": "q2", "question": "Combien d'outils en même temps ?", "attendu": ["trois", "R3"]},
    {"id": "q3", "question": "Horaires ?", "attendu": ["mercredi", "samedi"]},
    {"id": "q4", "question": "Capitale du Pérou ?", "attendu": None},
]

REPONSES = {
    "Combien coûte l'adhésion ?": ("L'adhésion coûte 20 Euros par an [R1].", 300),
    "Combien d'outils en même temps ?": ("Trois outils au maximum [R3].", 280),
    "Horaires ?": ("La Boîte est ouverte le mercredi.", 260),
    "Capitale du Pérou ?": ("Je ne sais pas.", 160),
}


def assistant(question):
    texte, jetons = REPONSES[question]
    return {"texte": texte, "jetons": jetons}


def test_jeu_vide():
    """un jeu vide ne fait pas planter la mesure"""
    resultat = evaluer_assistant(assistant, [])
    assert resultat == {"reussite": 0, "refus_corrects": None, "jetons_moyens": 0, "echecs": []}, f"obtenu : {resultat!r}"


def test_mesure_complete():
    """réussite, refus corrects, jetons moyens et échecs"""
    resultat = evaluer_assistant(assistant, JEU)
    attendu = {"reussite": 0.75, "refus_corrects": 1.0, "jetons_moyens": 250, "echecs": ["q3"]}
    assert resultat == attendu, f"obtenu : {resultat!r}"


def test_majuscules_ignorees():
    """« 20 Euros » contient bien « 20 euros », et « Trois » contient « trois »"""
    resultat = evaluer_assistant(assistant, JEU[:2])
    assert resultat["echecs"] == [], f"échecs : {resultat['echecs']}"


def test_tous_les_mots_attendus():
    """une réponse qui ne contient qu'une partie des mots attendus est ratée"""
    assert evaluer_assistant(assistant, [JEU[2]])["echecs"] == ["q3"]


def test_refus_rate():
    """une réponse inventée à une question hors sujet est ratée"""
    def bavard(question):
        return {"texte": "La capitale du Pérou est Lima.", "jetons": 100}

    resultat = evaluer_assistant(bavard, [JEU[3]])
    assert resultat["refus_corrects"] == 0.0
    assert resultat["echecs"] == ["q4"]


def test_sans_hors_sujet():
    """sans question hors sujet, refus_corrects vaut None"""
    assert evaluer_assistant(assistant, JEU[:3])["refus_corrects"] is None


def test_un_appel_par_cas():
    """l'assistant est appelé une fois par cas"""
    appels = []

    def compte(question):
        appels.append(question)
        return assistant(question)

    evaluer_assistant(compte, JEU)
    assert len(appels) == len(JEU)
