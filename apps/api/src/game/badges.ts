/** Badges disponibles. Synchronisés en base au démarrage de l'API. */
export const BADGES = [
  {
    slug: "premier-correctif",
    name: "Premier correctif",
    description: "Réparer ton tout premier système cassé.",
    icon: "wrench",
  },
  {
    slug: "premier-coup",
    name: "Du premier coup",
    description: "Réussir un niveau dès la première soumission.",
    icon: "bolt",
  },
  {
    slug: "sans-filet",
    name: "Sans filet",
    description: "Réussir un niveau qui propose des indices sans en ouvrir aucun.",
    icon: "target",
  },
  {
    slug: "blackout",
    name: "Lumières éteintes",
    description: "Réussir un niveau en mode Blackout : logs, terminal et doc officielle seulement.",
    icon: "moon",
  },
  {
    slug: "obstine",
    name: "Obstiné",
    description: "Réussir un niveau après au moins cinq tentatives ratées.",
    icon: "anvil",
  },
  {
    slug: "serie-3",
    name: "Trois jours de garde",
    description: "Jouer trois jours de suite.",
    icon: "flame",
  },
  {
    slug: "serie-7",
    name: "Une semaine d'astreinte",
    description: "Jouer sept jours de suite.",
    icon: "flame",
  },
] as const;

export const moduleBadgeSlug = (moduleId: string) => `module-${moduleId}`;
