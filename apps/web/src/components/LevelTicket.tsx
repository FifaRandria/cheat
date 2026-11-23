import type { LevelSummary } from "@rustine/shared";
import Link from "next/link";
import { bugTypeLabel, incidentCode } from "@/lib/format";
import { Icon } from "./Icon";
import { BlackoutTag, Severity, StatusChip, WriteTag } from "./Signals";

/** Un niveau, présenté comme un ticket d'incident perforé. */
export function LevelTicket({ level, moduleCode }: { level: LevelSummary; moduleCode: string }) {
  const solved = level.status === "solved";

  return (
    <Link
      href={`/niveau/${level.id}`}
      className="group relative block focus-visible:outline-none"
      aria-label={`${incidentCode(moduleCode, level.order)} · ${level.title}`}
    >
      <article
        className={`ticket relative flex h-full flex-col overflow-hidden rounded-xl border bg-raised transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-hover group-focus-visible:ring-2 group-focus-visible:ring-fix ${
          solved ? "border-fix/30" : "border-line group-hover:border-line-strong"
        }`}
      >
        {/* Bandeau de signal */}
        <div
          className={`h-1 w-full ${solved ? "bg-fix" : level.status === "in-progress" ? "bg-warn" : "hazard hazard-animated opacity-90"}`}
          aria-hidden="true"
        />

        <div className="flex flex-1 flex-col px-5 pt-4 pb-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[0.7rem] tracking-wider text-ink-3">
              {incidentCode(moduleCode, level.order)}
            </span>
            <StatusChip status={level.status} />
          </div>

          <h3 className="mt-3 font-display text-lg leading-snug font-semibold tracking-tight text-balance">
            {level.title}
          </h3>
          <p className="mt-1 text-xs text-ink-3">{bugTypeLabel(level.bugType)}</p>

          {/* Pointillés de détachement */}
          <div className="mt-auto pt-5">
            <div className="border-t border-dashed border-line-strong" aria-hidden="true" />
            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Severity level={level.difficulty} />
                {level.type === "write" && <WriteTag />}
                {level.blackout && <BlackoutTag />}
              </div>
              <span className={`font-mono text-xs font-semibold ${solved ? "text-ink-3 line-through" : "text-fix"}`}>
                +{level.xp} XP
              </span>
            </div>
          </div>
        </div>

        {solved && (
          <span
            className="pointer-events-none absolute right-4 bottom-12 rotate-[-9deg] rounded-md border-2 border-fix/60 px-2 py-0.5 font-display text-sm font-bold tracking-widest text-fix/60 uppercase"
            aria-hidden="true"
          >
            Résolu
          </span>
        )}

        <Icon
          name="arrowRight"
          size={16}
          className="absolute top-1/2 right-4 -translate-y-1/2 translate-x-2 text-ink-3 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
        />
      </article>
    </Link>
  );
}
