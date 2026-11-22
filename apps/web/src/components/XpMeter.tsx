import type { PublicUser } from "@rustine/shared";
import { rankTitle } from "@/lib/format";

/** Jauge segmentée, façon vu-mètre : 10 segments pour le rang en cours. */
export function XpMeter({ user, segments = 10, wide = false }: { user: PublicUser; segments?: number; wide?: boolean }) {
  const ratio = user.xpForNextRank ? user.xpIntoRank / user.xpForNextRank : 0;
  const lit = Math.floor(ratio * segments);

  return (
    <div className={wide ? "w-full" : ""}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 font-mono text-[0.68rem] uppercase tracking-[0.14em]">
        <span className="text-ink-2">
          Rang {user.rank} · <span className="text-ink">{rankTitle(user.rank)}</span>
        </span>
        <span className="text-ink-3 tabular-nums">
          {user.xpIntoRank}/{user.xpForNextRank}
        </span>
      </div>
      <div
        className="flex gap-[3px]"
        role="progressbar"
        aria-label="Progression vers le rang suivant"
        aria-valuemin={0}
        aria-valuemax={user.xpForNextRank}
        aria-valuenow={user.xpIntoRank}
      >
        {Array.from({ length: segments }, (_, i) => (
          <span
            key={i}
            className={`h-2 flex-1 rounded-[2px] transition-colors duration-500 ${
              i < lit ? "bg-fix" : i === lit && ratio > 0 ? "bg-fix/40" : "bg-line"
            }`}
            style={{ transitionDelay: `${i * 40}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
