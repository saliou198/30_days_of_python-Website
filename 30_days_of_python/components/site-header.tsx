import Link from "next/link";
import { homePath, programAnchor, t, type Locale } from "@/lib/i18n";
import { LangSwitch } from "@/components/lang-switch";
import { AppearanceMenu } from "@/components/appearance-menu";
import { ProgressCounter } from "@/components/progress";

export function SiteHeader({ locale }: { locale: Locale }) {
  const strings = t(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href={homePath(locale)}
          className="flex min-w-0 flex-col items-start gap-1"
        >
          <span className="nb-brand max-w-full truncate text-[15px] sm:text-lg">
            {strings.siteName}
          </span>
          <span className="hidden truncate text-xs font-normal text-mute sm:block">
            {strings.tagline}
          </span>
        </Link>

        <nav className="flex shrink-0 items-center gap-2">
          <Link
            href={programAnchor(locale)}
            className="hidden text-sm font-medium text-mute hover:text-ink sm:inline"
          >
            {strings.program}
          </Link>
          <ProgressCounter
            locale={locale}
            title={strings.progress}
          />
          <LangSwitch locale={locale} />
          <AppearanceMenu
            labels={{
              appearanceLabel: strings.appearanceLabel,
              themeLabel: strings.themeLabel,
              themeLight: strings.themeLight,
              themeDark: strings.themeDark,
              styleLabel: strings.styleLabel,
              styleModern: strings.styleModern,
              styleNeo: strings.styleNeo,
            }}
          />
        </nav>
      </div>
    </header>
  );
}
