import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { themeScript } from "@/components/ThemeToggle";
import { SessionProvider } from "@/lib/session";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Rustine · Répare avant d'écrire", template: "%s · Rustine" },
  description:
    "Apprends le développement fullstack et l'IA en réparant des systèmes cassés : logs, tests, diagnostic, et aucune IA pour te souffler la réponse.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f100d" },
    { media: "(prefers-color-scheme: light)", color: "#f2efe4" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="dark" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-fix focus:px-3 focus:py-2 focus:text-fix-ink"
        >
          Aller au contenu
        </a>
        <SessionProvider>
          <SiteHeader />
          <main id="contenu">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
