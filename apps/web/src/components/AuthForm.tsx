"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";
import { Icon } from "./Icon";
import { LogoMark } from "./Logo";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const { setUser } = useSession();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(params.get("erreur"));
  const [busy, setBusy] = useState(false);
  const [github, setGithub] = useState(false);

  // Redirection après connexion : uniquement vers une page interne.
  const next = params.get("suite");
  const target = next && next.startsWith("/") && !next.startsWith("//") ? next : "/parcours";

  useEffect(() => {
    api
      .providers()
      .then((p) => setGithub(p.github))
      .catch(() => setGithub(false));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { user } =
        mode === "register" ? await api.register({ email, displayName, password }) : await api.login({ email, password });
      setUser(user);
      router.push(target);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur inattendue");
      setBusy(false);
    }
  };

  const isRegister = mode === "register";

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] overflow-hidden">
      <div className="bg-blueprint pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 py-12 sm:px-6 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-2">
        <div className="mx-auto w-full max-w-md animate-rise">
          <p className="font-mono text-xs tracking-[0.18em] text-ink-3 uppercase">
            {isRegister ? "Nouvelle recrue" : "Retour au poste"}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.04em]">
            {isRegister ? "Prends ton poste." : "Reprends l'astreinte."}
          </h1>
          <p className="mt-3 text-ink-2">
            {isRegister
              ? "Un e-mail et un mot de passe suffisent. On ne collecte rien d'autre que ta progression."
              : "La prod t'attend. Tes brouillons aussi."}
          </p>

          {github && (
            <>
              <a
                href="/api/auth/github"
                className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-xl border border-line-strong bg-raised px-4 py-3 font-medium transition hover:bg-hover"
              >
                <Icon name="github" size={18} />
                Continuer avec GitHub
              </a>
              <div className="my-6 flex items-center gap-3 text-xs text-ink-3">
                <span className="h-px flex-1 bg-line" /> ou par e-mail <span className="h-px flex-1 bg-line" />
              </div>
            </>
          )}

          <form onSubmit={submit} className={`space-y-4 ${github ? "" : "mt-8"}`} noValidate>
            {isRegister && (
              <Field
                label="Pseudo"
                value={displayName}
                onChange={setDisplayName}
                autoComplete="nickname"
                placeholder="ada"
                maxLength={32}
              />
            )}
            <Field label="E-mail" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="toi@exemple.com" />
            <Field
              label="Mot de passe"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete={isRegister ? "new-password" : "current-password"}
              hint={isRegister ? "8 caractères minimum" : undefined}
            />

            {error && (
              <p role="alert" className="flex items-start gap-2 rounded-lg border border-break/40 bg-break-soft px-3 py-2.5 text-sm text-ink">
                <Icon name="x" size={16} className="mt-0.5 shrink-0 text-break" />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-fix px-4 py-3.5 font-semibold text-fix-ink transition hover:brightness-110 disabled:opacity-60"
            >
              {busy && <span className="size-4 animate-spin rounded-full border-2 border-fix-ink/30 border-t-fix-ink" />}
              {isRegister ? "Créer mon badge" : "Badger"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-3">
            {isRegister ? "Déjà en poste ? " : "Pas encore de badge ? "}
            <Link
              href={`${isRegister ? "/connexion" : "/inscription"}${next ? `?suite=${encodeURIComponent(next)}` : ""}`}
              className="text-fix hover:underline"
            >
              {isRegister ? "Connexion" : "Inscription"}
            </Link>
          </p>
        </div>

        <div className="hidden justify-center lg:flex">
          <AccessBadge name={isRegister ? displayName : ""} email={email} />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  hint,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  hint?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-sm font-medium">
        {label}
        {hint && <span className="text-xs font-normal text-ink-3">{hint}</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="mt-1.5 w-full rounded-xl border border-line bg-raised px-3.5 py-3 text-ink transition outline-none placeholder:text-ink-3/70 focus:border-fix focus:ring-2 focus:ring-fix/25"
        {...rest}
      />
    </label>
  );
}

/** Badge d'accès à l'atelier, qui se remplit pendant que la personne tape. */
function AccessBadge({ name, email }: { name: string; email: string }) {
  const shown = name.trim() || email.split("@")[0] || "nouvelle recrue";
  return (
    <div className="relative animate-rise [animation-delay:150ms]">
      {/* Lanière */}
      <div className="absolute -top-24 left-1/2 h-28 w-8 -translate-x-1/2 bg-[repeating-linear-gradient(90deg,var(--fix)_0_4px,var(--fix-ink)_4px_6px)] opacity-80" />
      <div className="relative mx-auto -mb-3 h-6 w-16 rounded-md border border-line-strong bg-line" />

      <div className="relative w-[320px] rotate-[3deg] overflow-hidden rounded-3xl border border-line-strong bg-raised shadow-[var(--shadow)] transition-transform duration-500 hover:rotate-0">
        <div className="hazard h-2 opacity-90" />
        <div className="p-7">
          <div className="flex items-center justify-between">
            <LogoMark size={34} />
            <span className="font-mono text-[0.6rem] tracking-[0.22em] text-ink-3 uppercase">Accès atelier</span>
          </div>

          <div className="mt-8 grid size-24 place-items-center rounded-2xl bg-fix font-display text-5xl font-bold text-fix-ink">
            {shown.slice(0, 1).toUpperCase()}
          </div>

          <p className="mt-6 font-mono text-[0.62rem] tracking-[0.2em] text-ink-3 uppercase">Agent d&apos;astreinte</p>
          <p className="mt-1 truncate font-display text-2xl font-bold tracking-tight">{shown}</p>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-dashed border-line-strong pt-5 font-mono text-xs">
            <div>
              <p className="text-ink-3">Rang</p>
              <p className="mt-0.5">01 · Stagiaire</p>
            </div>
            <div>
              <p className="text-ink-3">Habilitation</p>
              <p className="mt-0.5 text-fix">M0 · M1</p>
            </div>
          </div>

          {/* Code-barres décoratif */}
          <div className="mt-6 flex h-9 items-stretch gap-[2px]" aria-hidden="true">
            {Array.from({ length: 42 }, (_, i) => (
              <span key={i} className="bg-ink" style={{ width: (i * 7) % 3 === 0 ? 3 : 1, opacity: (i * 13) % 5 === 0 ? 0.3 : 0.85 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
