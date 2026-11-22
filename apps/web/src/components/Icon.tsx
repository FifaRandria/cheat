import type { SVGProps } from "react";

/** Jeu d'icônes maison, tracé à 1,75 px sur une grille de 24. */
const PATHS = {
  wrench: "M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8a2.8 2.8 0 0 1-4-4l8-8-1.3-1.3a4 4 0 0 0-5-5L13 5l-2 2-2-2 2-2a4 4 0 0 1 3.7 3.3Z",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  moon: "M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z",
  sun: "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-14v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  anvil: "M4 6h13a3 3 0 0 0 3 3v1h-6v2a3 3 0 0 0 3 3v3H7v-3a3 3 0 0 0 3-3v-2H8a4 4 0 0 1-4-4V6Z",
  flame: "M12 22a7 7 0 0 0 7-7c0-4-3-6.5-4-10-2 1.5-3 3.5-3 6-1-1-1.5-2-1.5-3.5C8 9 5 11.5 5 15a7 7 0 0 0 7 7Z",
  flag: "M5 21V4m0 0h11l-2 4 2 4H5",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6V11Z",
  play: "M7 4.5v15l12-7.5-12-7.5Z",
  reset: "M3 12a9 9 0 1 0 3-6.7M3 4v5h5",
  check: "m5 12.5 4.5 4.5L19 7.5",
  x: "M6 6l12 12M18 6 6 18",
  arrowRight: "M5 12h14m-6-6 6 6-6 6",
  arrowLeft: "M19 12H5m6 6-6-6 6-6",
  terminal: "m5 8 4 4-4 4m6 0h8M3 4h18v16H3V4Z",
  bug: "M8 9a4 4 0 0 1 8 0v6a4 4 0 0 1-8 0V9Zm4 0v10M8 12H3m18 0h-5M8 8 5 5m11 3 3-3M8 16l-3 3m11-3 3 3",
  file: "M14 3H6v18h12V7l-4-4Zm0 0v4h4",
  key: "M15 7a4 4 0 1 1-3.9 4.9L3 20v-3h3v-3h3l1.3-1.3A4 4 0 0 1 15 7Z",
  logs: "M4 5h16M4 10h10M4 15h16M4 20h8",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 9a8 8 0 0 1 16 0",
  logout: "M15 4h4v16h-4M10 8l-4 4 4 4m-4-4h11",
  github:
    "M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21",
  spark: "M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M6 18l2.5-2.5m7-7L18 6",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4l3 2",
  book: "M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2V5Zm0 16a2 2 0 0 1 2-2h14",
  trash: "M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 18, ...props }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
