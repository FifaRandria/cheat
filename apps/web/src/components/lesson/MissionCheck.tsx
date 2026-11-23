"use client";

import { useEffect, useState } from "react";

/**
 * Case d'une mission (`- [ ] …` dans une leçon) : cochable, et retenue dans ce navigateur.
 * La clé combine la page et la ligne de la case dans la leçon.
 */
export function MissionCheck({ line, initial }: { line: number; initial: boolean }) {
  const [checked, setChecked] = useState(initial);
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    const k = `rustine:mission:${window.location.pathname}:${line}`;
    setKey(k);
    try {
      const saved = window.localStorage.getItem(k);
      if (saved !== null) setChecked(saved === "1");
    } catch {
      // stockage indisponible (navigation privée) : la case reste utilisable sans mémoire
    }
  }, [line]);

  return (
    <input
      type="checkbox"
      className="mission-check"
      checked={checked}
      aria-label="Étape de la mission terminée"
      onChange={(e) => {
        setChecked(e.target.checked);
        try {
          if (key) window.localStorage.setItem(key, e.target.checked ? "1" : "0");
        } catch {
          // idem : rien à faire
        }
      }}
    />
  );
}
