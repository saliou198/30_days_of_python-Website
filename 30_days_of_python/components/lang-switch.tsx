"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  otherLocale,
  swapLocalePath,
  t,
  type Locale,
} from "@/lib/i18n";

/**
 * Bascule entre les deux langues en conservant la page courante.
 * Le changement de langue traverse deux layouts racine : Next recharge
 * donc la page (le lien est un <Link>, le retour arrière reste intact).
 */
export function LangSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const target = otherLocale(locale);
  const strings = t(locale);

  return (
    <Link
      href={swapLocalePath(pathname, locale)}
      hrefLang={target}
      lang={target}
      aria-label={`${strings.langSwitchLabel} — ${t(target).langName}`}
      title={`${strings.langSwitchLabel} — ${t(target).langName}`}
      className="nb-btn h-10 shrink-0 px-3 text-xs"
    >
      <span aria-hidden="true">{target.toUpperCase()}</span>
    </Link>
  );
}
