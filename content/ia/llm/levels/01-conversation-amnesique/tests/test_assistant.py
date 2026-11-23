from assistant import CONSIGNE, preparer_requete, texte_reponse

HISTORIQUE = [
    {"role": "user", "content": "Je m'appelle Ada."},
    {"role": "assistant", "content": "Enchanté Ada !"},
]


def test_historique_renvoye():
    """l'historique complet est renvoyé, suivi de la nouvelle question"""
    params = preparer_requete(HISTORIQUE, "Comment je m'appelle ?")
    attendu = HISTORIQUE + [{"role": "user", "content": "Comment je m'appelle ?"}]
    assert params["messages"] == attendu, f"messages envoyés : {params['messages']!r}"


def test_historique_non_modifie():
    """la liste d'historique reçue n'est pas modifiée"""
    historique = list(HISTORIQUE)
    preparer_requete(historique, "Et toi ?")
    assert historique == HISTORIQUE


def test_consigne_dans_system():
    """la consigne est dans le champ system, et aucun message n'a le rôle system"""
    params = preparer_requete([], "Bonjour")
    assert params.get("system") == CONSIGNE, f"system = {params.get('system')!r}"
    roles = [m["role"] for m in params["messages"]]
    assert "system" not in roles, f"rôles des messages : {roles}"
    assert params["messages"][0]["role"] == "user", "la conversation commence par un message user"


def test_parametres_obligatoires():
    """model et max_tokens sont présents"""
    params = preparer_requete([], "Bonjour")
    assert params.get("model"), "model manquant"
    assert isinstance(params.get("max_tokens"), int) and params["max_tokens"] > 0, "max_tokens manquant ou invalide"


def test_texte_simple():
    """une réponse d'un seul bloc de texte"""
    reponse = {"content": [{"type": "text", "text": "Bonjour Ada !"}], "stop_reason": "end_turn"}
    assert texte_reponse(reponse) == "Bonjour Ada !"


def test_texte_ignore_autres_blocs():
    """les blocs qui ne sont pas du texte sont ignorés, les blocs de texte sont concaténés"""
    reponse = {
        "content": [
            {"type": "thinking", "thinking": ""},
            {"type": "text", "text": "Ta chaîne est usée. "},
            {"type": "text", "text": "Passe à l'atelier."},
        ],
        "stop_reason": "end_turn",
    }
    resultat = texte_reponse(reponse)
    assert resultat == "Ta chaîne est usée. Passe à l'atelier.", f"obtenu : {resultat!r}"
