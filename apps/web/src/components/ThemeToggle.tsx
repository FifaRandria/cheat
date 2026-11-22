"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

type Theme = "dark" | "light";

/** Script injecté dans <head> : applique le thème avant le premier rendu (pas de flash). */
export const themeScript = `(function(){try{var t=localStorage.getItem('rustine-theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}})()`;

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as Theme) ?? "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("rustine-theme", next);
    } catch {
      // stockage indisponible : le thème vaut pour cette page seulement
    }
    setTheme(next);
    window.dispatchEvent(new CustomEvent("rustine-theme", { detail: next }));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="grid size-9 place-items-center rounded-lg border border-line text-ink-2 transition hover:border-line-strong hover:text-ink"
      aria-label={theme === "light" ? "Passer en thème sombre" : "Passer en thème clair"}
      title={theme === "light" ? "Atelier de nuit" : "Atelier de jour"}
    >
      <Icon name={theme === "light" ? "moon" : "sun"} size={17} />
    </button>
  );
}
