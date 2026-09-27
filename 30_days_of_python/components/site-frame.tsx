import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import type { Locale } from "@/lib/i18n";

/**
 * Chrome commun (en-tête, contenu, pied de page). Chaque langue a son
 * propre layout racine, qui fournit la locale.
 */
export function SiteFrame({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader locale={locale} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} />
    </>
  );
}
