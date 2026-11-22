import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[70dvh] max-w-xl place-items-center px-4 text-center">
      <div>
        <p className="font-mono text-xs tracking-[0.2em] text-break uppercase">HTTP 404</p>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-[-0.04em]">Route introuvable.</h1>
        <pre className="mx-auto mt-6 max-w-sm rounded-lg border border-line bg-sunken p-4 text-left font-mono text-xs leading-relaxed text-ink-2">
          {"[web] GET "}
          <span className="text-ink">cette-page</span>
          {" → "}
          <span className="text-break">404</span>
          {"\n[web] hypothèse : lien cassé ou faute de frappe"}
        </pre>
        <Link href="/parcours" className="mt-8 inline-block rounded-xl bg-fix px-5 py-3 font-semibold text-fix-ink">
          Retour au parcours
        </Link>
      </div>
    </div>
  );
}
