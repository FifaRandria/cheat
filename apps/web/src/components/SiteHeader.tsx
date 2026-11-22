"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/session";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/parcours", label: "Parcours" },
  { href: "/lecons", label: "Leçons" },
  { href: "/profil", label: "Dossier" },
];

export function SiteHeader() {
  const { user, loading, logout } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="ml-4 hidden items-center gap-1 sm:flex" aria-label="Navigation principale">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-1.5 text-sm transition ${
                  active ? "bg-raised text-ink" : "text-ink-2 hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          {user && (
            <div
              className="hidden items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 font-mono text-xs md:flex"
              title={`Série de ${user.streak} jour(s), record : ${user.bestStreak}`}
            >
              <Icon name="flame" size={14} className={user.streak > 0 ? "text-warn" : "text-ink-3"} />
              <span className="tabular-nums">{user.streak}</span>
              <span className="mx-1.5 h-3 w-px bg-line" />
              <span className="text-fix tabular-nums">{user.xp}</span>
              <span className="text-ink-3">XP</span>
            </div>
          )}

          <ThemeToggle />

          {loading ? (
            <span className="h-9 w-24 animate-pulse rounded-lg bg-raised" />
          ) : user ? (
            <div className="flex items-center gap-1">
              <Link
                href="/profil"
                className="flex items-center gap-2 rounded-lg py-1 pr-1 pl-2.5 text-sm hover:bg-raised"
              >
                <span className="hidden max-w-[10ch] truncate sm:inline">{user.displayName}</span>
                <Avatar name={user.displayName} url={user.avatarUrl} />
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  router.push("/");
                }}
                className="grid size-9 place-items-center rounded-lg text-ink-3 hover:bg-raised hover:text-ink"
                aria-label="Se déconnecter"
                title="Se déconnecter"
              >
                <Icon name="logout" size={17} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/connexion" className="hidden px-2 text-sm text-ink-2 hover:text-ink sm:inline">
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="rounded-lg bg-fix px-3.5 py-2 text-sm font-semibold text-fix-ink transition hover:brightness-110"
              >
                Prendre son poste
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Navigation mobile */}
      <nav className="flex border-t border-line sm:hidden" aria-label="Navigation principale">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 py-2.5 text-center text-sm ${
              pathname.startsWith(item.href) ? "text-ink shadow-[inset_0_-2px_0_var(--fix)]" : "text-ink-3"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function Avatar({ name, url, size = 30 }: { name: string; url: string | null; size?: number }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" width={size} height={size} className="rounded-md" style={{ width: size, height: size }} />;
  }
  return (
    <span
      className="grid place-items-center rounded-md bg-fix font-display font-bold text-fix-ink"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
      aria-hidden="true"
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}
