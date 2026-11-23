import type { LevelStatus } from "@rustine/shared";
import { Icon } from "./Icon";

const STATUS: Record<LevelStatus, { label: string; cls: string; pulse: boolean }> = {
  todo: { label: "Cassé", cls: "bg-break-soft text-break", pulse: true },
  "in-progress": { label: "En cours", cls: "bg-warn-soft text-warn", pulse: true },
  solved: { label: "Réparé", cls: "bg-fix-soft text-fix", pulse: false },
};

export function StatusChip({ status }: { status: LevelStatus }) {
  const s = STATUS[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[0.62rem] font-semibold tracking-[0.12em] uppercase ${s.cls}`}
    >
      {status === "solved" ? (
        <Icon name="check" size={11} strokeWidth={3} />
      ) : (
        <span className={`size-1.5 rounded-full bg-current ${s.pulse ? "animate-pulse-dot" : ""}`} />
      )}
      {s.label}
    </span>
  );
}

/** Gravité de l'incident, de 1 à 5 barres croissantes. */
export function Severity({ level, label = true }: { level: number; label?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2" title={`Gravité ${level}/5`}>
      <span className="flex items-end gap-[2px]" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`w-[3px] rounded-[1px] ${i <= level ? (level >= 4 ? "bg-break" : level >= 3 ? "bg-warn" : "bg-ink-2") : "bg-line-strong"}`}
            style={{ height: 4 + i * 2 }}
          />
        ))}
      </span>
      {label && <span className="sr-only">Gravité {level} sur 5</span>}
    </span>
  );
}

/** Niveau « écrire » : pas de bug à trouver, une fonction à écrire à partir des tests. */
export function WriteTag() {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md bg-info-soft px-1.5 py-0.5 font-mono text-[0.6rem] font-bold tracking-[0.14em] text-info uppercase"
      title="Exercice d'écriture : les tests décrivent ce que ton code doit faire"
    >
      <Icon name="code" size={10} strokeWidth={2.5} />
      À écrire
    </span>
  );
}

export function BlackoutTag() {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md bg-ink px-1.5 py-0.5 font-mono text-[0.6rem] font-bold tracking-[0.14em] text-bg uppercase"
      title="Mode Blackout : aucun indice"
    >
      <Icon name="moon" size={10} strokeWidth={2.5} />
      Blackout
    </span>
  );
}
