import Link from "next/link";

/** La rustine : une pièce cousue, légèrement de travers, posée sur la fissure. */
export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M3 20 L12 13 L16 17 L29 6" fill="none" stroke="var(--break)" strokeWidth="2" strokeLinecap="round" />
      <g transform="rotate(-10 16 16)">
        <rect x="7" y="8" width="18" height="16" rx="4" fill="var(--fix)" />
        <rect
          x="9.5"
          y="10.5"
          width="13"
          height="11"
          rx="2.2"
          fill="none"
          stroke="var(--fix-ink)"
          strokeWidth="1.3"
          strokeDasharray="2 2"
          opacity="0.7"
        />
      </g>
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Rustine, accueil">
      <span className="transition-transform duration-300 group-hover:-rotate-6">
        <LogoMark />
      </span>
      <span className="font-display text-[1.35rem] font-bold tracking-[-0.03em]">rustine</span>
    </Link>
  );
}
