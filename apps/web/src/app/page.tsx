import Link from "next/link";
import { HeroConsole } from "@/components/HeroConsole";
import { Icon, type IconName } from "@/components/Icon";

const PROTOCOL: Array<{ code: string; title: string; text: string; icon: IconName }> = [
  {
    code: "01",
    title: "Apprendre",
    text: "Une leçon courte et concrète, avec des exemples que tu exécutes et modifies dans la page. Puis un mini-quiz pour vérifier que c'est acquis.",
    icon: "book",
  },
  {
    code: "02",
    title: "Réparer",
    text: "Un système cassé t'attend : une API qui renvoie undefined, un calcul qui donne NaN. Tu lis les logs, tu formules une hypothèse, tu corriges.",
    icon: "wrench",
  },
  {
    code: "03",
    title: "Comprendre",
    text: "Une fois au vert, le post-mortem explique la cause racine et le réflexe à garder. Tes erreurs reviennent plus tard, pour devenir des automatismes.",
    icon: "target",
  },
];

const LINES: Array<{ id: string; title: string; text: string; icon: IconName; color: string; stops: string[]; first: string }> = [
  {
    id: "web",
    title: "Développeur web fullstack",
    text: "Des bases de JavaScript jusqu'à une app dockerisée avec un CI vert.",
    icon: "code",
    color: "var(--fix)",
    stops: ["Bases JS", "Async", "Git & HTTP", "Express", "PostgreSQL", "React", "Docker", "CI/CD"],
    first: "/lecons/js-bases-01",
  },
  {
    id: "ia",
    title: "Intelligence artificielle",
    text: "Python depuis zéro, puis entraînement, LoRA, QLoRA, RAG et automatisation.",
    icon: "spark",
    color: "var(--info)",
    stops: ["Bases Python", "Data", "Fine-tuning", "RAG", "n8n"],
    first: "/lecons/py-bases-01",
  },
  {
    id: "projet",
    title: "Gestion de projet",
    text: "Mener un projet web du cadrage à la livraison, et diriger une équipe.",
    icon: "flag",
    color: "var(--warn)",
    stops: ["Étapes d'un projet", "Diriger une équipe", "Gérer les crises"],
    first: "/lecons/gp-etapes-01",
  },
];

export default function Home() {
  return (
    <>
      {/* ------------------------------------------------------------------ Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-blueprint pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:pt-24 lg:pb-28">
          <div className="animate-rise">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-raised/70 px-3 py-1 font-mono text-[0.7rem] tracking-[0.14em] text-ink-2 uppercase">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-break text-break" />
              Astreinte en cours
            </p>

            <h1 className="font-display text-[clamp(2.8rem,7.5vw,5.6rem)] leading-[0.92] font-bold tracking-[-0.045em]">
              <span className="relative inline-block">
                <span
                  className="absolute -inset-x-2 inset-y-[0.12em] -z-10 -rotate-2 rounded-lg bg-fix"
                  aria-hidden="true"
                />
                <span className="text-fix-ink">Répare</span>
              </span>{" "}
              avant
              <br />
              d&apos;écrire.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-2">
              Apprends le web fullstack, l&apos;IA et la gestion de projet : une leçon claire, puis un système cassé à
              remettre au vert. <span className="text-ink">La compétence qui reste quand l&apos;IA n&apos;est plus là.</span>
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/lecons/js-bases-01"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-fix px-5 py-3.5 font-semibold text-fix-ink shadow-[0_10px_30px_-10px_var(--fix)] transition hover:brightness-110"
              >
                Commencer par la première leçon
                <Icon name="arrowRight" size={18} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/parcours"
                className="inline-flex items-center gap-2 rounded-xl border border-line-strong px-5 py-3.5 font-medium text-ink transition hover:bg-raised"
              >
                Voir les parcours
              </Link>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
              {[
                ["3", "parcours"],
                ["0", "prérequis"],
                ["0", "IA pour tricher"],
              ].map(([n, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd className="font-display text-2xl font-semibold tracking-tight">{n}</dd>
                  <dd className="mt-0.5 text-xs text-ink-3">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="animate-rise [animation-delay:150ms]">
            <HeroConsole />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- Protocole */}
      <section className="border-y border-line bg-raised/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionLabel>Le protocole</SectionLabel>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            On ne répare bien que ce qu&apos;on comprend. <span className="text-ink-3">Alors on apprend d&apos;abord.</span>
          </h2>

          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {PROTOCOL.map((step, i) => (
              <li
                key={step.code}
                className="group relative rounded-2xl border border-line bg-bg p-6 transition hover:border-line-strong"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-ink-3">ÉTAPE {step.code}</span>
                  <span
                    className={`grid size-10 place-items-center rounded-xl ${
                      i === 0 ? "bg-break-soft text-break" : i === 1 ? "bg-warn-soft text-warn" : "bg-fix-soft text-fix"
                    }`}
                  >
                    <Icon name={step.icon} size={20} />
                  </span>
                </div>
                <h3 className="mt-8 font-display text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">{step.text}</p>
                {i < 2 && (
                  <Icon
                    name="arrowRight"
                    size={18}
                    className="absolute top-1/2 -right-3.5 z-10 hidden -translate-y-1/2 rounded-full border border-line bg-bg p-0.5 text-ink-3 md:block"
                  />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* --------------------------------------------------------------- Blackout */}
      <section data-blackout="true" className="relative overflow-hidden bg-bg text-ink">
        <div className="scanlines pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div className="flicker">
            <p className="font-mono text-xs tracking-[0.3em] text-ink-3 uppercase">Mode Blackout</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
              Pas d&apos;IA. Pas d&apos;indice.
              <br />
              Juste les logs.
            </h2>
            <p className="mt-6 max-w-lg font-mono text-sm leading-relaxed text-ink-2">
              Certains niveaux éteignent la lumière : il ne te reste que la sortie des tests, un extrait de logs et la
              documentation officielle. Exactement comme à 3 h du matin, quand la prod tombe.
            </p>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-line bg-raised p-5 font-mono text-[0.78rem] leading-relaxed text-ink-2">
            <span className="text-ink-3">$ tail -f /var/log/api.log</span>
            {"\n"}[api] GET /api/dashboard → <span className="text-break">500</span> (31 ms)
            {"\n"}[api] Error: connect ECONNREFUSED 10.0.3.7:8080
            {"\n"}          at fetchStocks (services.js:9:11)
            {"\n"}          at async <span className="text-ink">Promise.all</span> (index 1)
            {"\n"}[api] weather: ok · news: ok · stocks: <span className="text-break">ECONNREFUSED</span>
            {"\n"}
            <span className="animate-blink">▍</span>
          </pre>
        </div>
      </section>

      {/* --------------------------------------------------------------- Parcours */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel>Trois lignes</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Choisis ta destination. Chacune part de zéro.
            </h2>
          </div>
          <Link href="/parcours" className="inline-flex items-center gap-1.5 text-sm text-fix hover:underline">
            Plan complet <Icon name="arrowRight" size={15} />
          </Link>
        </div>

        <div className="mt-12 space-y-4">
          {LINES.map((line) => (
            <Link
              key={line.id}
              href={line.first}
              className="group grid gap-5 rounded-2xl border border-line bg-raised/50 p-5 transition hover:border-line-strong hover:bg-raised sm:p-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)_auto] lg:items-center"
            >
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl" style={{ background: `color-mix(in srgb, ${line.color} 14%, transparent)`, color: line.color }}>
                  <Icon name={line.icon} size={22} />
                </span>
                <div>
                  <h3 className="font-display text-lg leading-tight font-semibold">{line.title}</h3>
                  <p className="mt-1 text-sm text-ink-3">{line.text}</p>
                </div>
              </div>
              <ol className="flex items-center overflow-x-auto pb-1" aria-label="Étapes">
                {line.stops.map((stop, i) => (
                  <li key={stop} className="flex shrink-0 items-center">
                    <span className="flex flex-col items-center gap-1.5">
                      <span className="size-3 rounded-full border-2" style={{ borderColor: line.color, background: i === 0 ? line.color : "transparent" }} />
                      <span className={`whitespace-nowrap text-[0.7rem] ${i === 0 ? "text-ink" : "text-ink-3"}`}>{stop}</span>
                    </span>
                    {i < line.stops.length - 1 && <span className="mx-1 mb-5 h-0.5 w-8 sm:w-12" style={{ background: `color-mix(in srgb, ${line.color} 45%, var(--line))` }} />}
                  </li>
                ))}
              </ol>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: line.color }}>
                Première leçon <Icon name="arrowRight" size={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- CTA final */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-raised p-8 sm:p-14">
          <div className="hazard absolute inset-x-0 top-0 h-1.5 opacity-80" aria-hidden="true" />
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                La prod est tombée. <span className="text-fix">On compte sur toi.</span>
              </h2>
              <p className="mt-3 max-w-xl text-ink-2">
                Première leçon en moins de dix minutes. Aucun prérequis : on commence par les bases.
              </p>
            </div>
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-fix px-6 py-4 font-semibold text-fix-ink transition hover:brightness-110"
            >
              Prendre son poste <Icon name="arrowRight" size={18} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-ink-3 sm:px-6">
          <p>Rustine · apprendre en réparant.</p>
          <p className="font-mono text-xs">v0.1 · MVP</p>
        </div>
      </footer>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-ink-3 uppercase">
      <span className="h-px w-6 bg-fix" />
      {children}
    </p>
  );
}
