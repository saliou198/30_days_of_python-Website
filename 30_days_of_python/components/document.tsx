import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { appearanceInitScript, DEFAULT_STYLE, DEFAULT_THEME } from "@/lib/appearance";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Police d'affichage : utilisée uniquement par le style néobrutaliste. */
const displayFont = Space_Grotesk({
  variable: "--font-display-font",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

/**
 * Document commun aux deux langues (chaque langue a son propre layout
 * racine, qui fournit `lang`). Les attributs data-theme / data-style
 * positionnés ici ne sont que des valeurs par défaut serveur : le script
 * inline les remplace avant le premier rendu d'après la préférence
 * enregistrée sur l'appareil.
 */
export function Document({
  lang,
  children,
}: {
  lang: string;
  children: React.ReactNode;
}) {
  return (
    <html
      lang={lang}
      data-theme={DEFAULT_THEME}
      data-style={DEFAULT_STYLE}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable} h-full antialiased`}
    >
      {/* eslint-disable-next-line @next/next/no-head-element -- le script
          d'apparence doit s'exécuter avant le premier rendu (cf. guide
          « Preventing flash before hydration ») */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: appearanceInitScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
