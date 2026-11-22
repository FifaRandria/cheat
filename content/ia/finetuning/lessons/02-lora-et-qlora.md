---
id: ia-ft-02
title: Fine-tuning, LoRA et QLoRA
minutes: 16
summary: Pourquoi on adapte un modèle au lieu d'en entraîner un, comment LoRA n'entraîne que 0,5 % des poids, et comment QLoRA fait tenir un grand modèle sur une petite carte graphique.
check:
  - prompt: "Pourquoi QLoRA permet-il d'entraîner un grand modèle sur une petite carte graphique ?"
    choices:
      - Il supprime la moitié des couches du modèle
      - Il charge le modèle de base en 4 bits, ce qui divise sa taille en mémoire par 4, et n'entraîne que de petits adaptateurs
      - Il utilise le processeur au lieu de la carte graphique
    answer: 1
  - prompt: "Que se passe-t-il si le rang r de LoRA est très grand ?"
    choices:
      - Plus de paramètres à entraîner, donc plus de mémoire et un risque accru de sur-apprentissage
      - Le modèle devient plus petit
      - Rien, r n'a aucun effet
    answer: 0
  - prompt: "Un modèle de 7 milliards de paramètres en 16 bits occupe environ…"
    choices: ["3,5 Go", "14 Go", "56 Go"]
    answer: 1
    explain: "16 bits = 2 octets par paramètre. 7 milliards × 2 octets = 14 Go, rien que pour les poids."
---

## Entraîner de zéro, ou adapter ?

Entraîner un grand modèle de langage **depuis zéro** coûte des millions d'euros de calcul et
des milliers de milliards de mots. Personne ne fait ça pour un projet d'entreprise.

On part plutôt d'un modèle **déjà pré-entraîné**, qui sait parler, résumer, raisonner, et on
l'**adapte** à une tâche précise avec quelques centaines ou milliers d'exemples. C'est le
**fine-tuning**.

> **Analogie** : un médecin généraliste ne refait pas sept ans d'études pour devenir
> dermatologue. Il suit une **spécialisation**, beaucoup plus courte, qui s'appuie sur tout ce
> qu'il sait déjà.

## Le problème : la mémoire

Un modèle vit dans la mémoire de la carte graphique, la **VRAM**. Calculons pour un modèle de
**7 milliards** de paramètres (taille courante, notée « 7B ») :

| Précision | Octets par paramètre | Mémoire pour les poids |
|---|---|---|
| 32 bits (`fp32`) | 4 | 28 Go |
| 16 bits (`fp16`, `bf16`) | 2 | **14 Go** |
| 8 bits | 1 | 7 Go |
| 4 bits | 0,5 | **3,5 Go** |

Et ce n'est que pour **stocker** le modèle. Pour l'entraîner entièrement (*full fine-tuning*),
il faut aussi garder, pour chaque paramètre, son gradient et l'état de l'optimiseur : on monte
facilement à **plus de 100 Go**. Hors de portée d'une carte grand public (8 à 24 Go).

## LoRA : n'entraîner que de petits adaptateurs

**LoRA** (*Low-Rank Adaptation*) part d'une idée simple :

1. on **gèle** le modèle d'origine : ses milliards de poids ne bougent plus ;
2. on ajoute, à côté de certaines couches, deux **petites matrices** qu'on entraîne seules ;
3. leur produit vient corriger légèrement la sortie de la couche gelée.

Ordre de grandeur : pour une couche de 4 096 × 4 096 (16,7 millions de poids), deux matrices
LoRA de rang 8 ajoutent 8 × (4 096 + 4 096) = **65 536** paramètres. Soit **0,4 %**.

> **À retenir** : avec LoRA, on n'entraîne qu'une infime fraction des paramètres. Moins de
> mémoire, un entraînement plus rapide, et un fichier d'adaptateur de quelques dizaines de Mo
> au lieu de 14 Go.

## Lire une configuration LoRA

Voici à quoi ressemble une configuration réelle, avec la bibliothèque `peft` :

```python
from peft import LoraConfig

config = LoraConfig(
    r=8,                                  # rang des matrices d'adaptation
    lora_alpha=16,                        # facteur d'échelle
    target_modules=["q_proj", "v_proj"],  # couches à adapter
    lora_dropout=0.05,                    # régularisation contre le sur-apprentissage
)
```

Paramètre par paramètre :

- **`r`**, le **rang** : la « largeur » des adaptateurs. Plus `r` est grand, plus l'adaptateur
  peut apprendre de choses, mais plus il consomme de mémoire et plus il risque de
  **sur-apprendre**. Valeurs courantes : 8 ou 16.
- **`lora_alpha`** : l'intensité de la correction. L'effet réel est proportionnel à
  `alpha / r`. Une habitude répandue : `alpha = 2 × r`.
- **`target_modules`** : quelles couches reçoivent un adaptateur. `q_proj` et `v_proj` sont
  des couches du mécanisme d'**attention**, le cœur des modèles de langage.
- **`lora_dropout`** : désactive aléatoirement une petite partie de l'adaptateur pendant
  l'entraînement, ce qui limite l'apprentissage par cœur.

## QLoRA : le modèle de base en 4 bits

LoRA réduit la mémoire de l'entraînement, mais il faut toujours charger le modèle gelé :
14 Go pour un 7B en 16 bits.

**QLoRA** ajoute une étape : charger ce modèle de base **quantifié en 4 bits**, c'est-à-dire
avec des poids stockés de façon plus compacte et un peu moins précise.

```python
from transformers import BitsAndBytesConfig

bnb = BitsAndBytesConfig(
    load_in_4bit=True,           # le modèle de base est chargé en 4 bits
    bnb_4bit_quant_type="nf4",   # un format 4 bits conçu pour les poids de réseaux de neurones
)
```

Résultat : les poids du 7B passent de 14 Go à environ **3,5 Go**. Avec les adaptateurs et
les calculs intermédiaires, l'entraînement tient sur une carte de **8 à 12 Go**.

| Méthode | Ce qu'on entraîne | VRAM pour un 7B (ordre de grandeur) |
|---|---|---|
| Full fine-tuning | tous les poids | 100 Go et plus |
| LoRA (base en 16 bits) | les adaptateurs | 16 à 20 Go |
| QLoRA (base en 4 bits) | les adaptateurs | 8 à 12 Go |

> **Attention** : la quantification fait perdre un peu de précision au modèle de base. En
> pratique, la perte est faible pour la plupart des usages, et c'est souvent le seul moyen
> d'adapter un grand modèle avec un budget raisonnable.

## Les étapes d'un fine-tuning

1. **Définir l'objectif** et la façon de mesurer le succès.
2. **Préparer le dataset** : des exemples propres, au bon format, séparés en entraînement
   et validation.
3. **Charger le modèle de base** (en 4 bits pour QLoRA).
4. **Configurer LoRA** : rang, alpha, couches ciblées.
5. **Entraîner** en surveillant les deux courbes de loss.
6. **Évaluer** sur des exemples jamais vus, et comparer au modèle d'origine.
7. **Sauvegarder** l'adaptateur, ou le **fusionner** avec le modèle de base pour le déployer.

## Ce que tu sais faire maintenant

- Expliquer pourquoi on adapte un modèle pré-entraîné au lieu d'en entraîner un.
- Estimer la mémoire d'un modèle à partir de sa taille et de sa précision.
- Lire une configuration LoRA et expliquer `r`, `lora_alpha` et `target_modules`.
- Expliquer pourquoi QLoRA fait tenir un grand modèle sur une petite carte graphique.
