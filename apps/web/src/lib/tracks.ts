import type { IconName } from "@/components/Icon";

/** Identité visuelle de chaque parcours : une couleur de signal et une icône. */
export const TRACK_STYLE: Record<string, { accent: string; soft: string; icon: IconName; short: string }> = {
  web: { accent: "var(--fix)", soft: "var(--fix-soft)", icon: "code", short: "Web" },
  ia: { accent: "var(--info)", soft: "var(--info-soft)", icon: "spark", short: "IA" },
  projet: { accent: "var(--warn)", soft: "var(--warn-soft)", icon: "flag", short: "Projet" },
};

export const trackStyle = (id: string) => TRACK_STYLE[id] ?? TRACK_STYLE.web!;

/** Variables CSS à poser sur un conteneur pour colorer ses enfants avec l'accent du parcours. */
export const accentVars = (id: string) =>
  ({ "--accent": trackStyle(id).accent, "--accent-soft": trackStyle(id).soft }) as React.CSSProperties;
