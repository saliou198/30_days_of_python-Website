import Link from "next/link";
import {
  dayPath,
  getDayTitle,
  getModuleDescription,
  getModuleTitle,
  moduleAccent,
  modules,
  t,
  type Locale,
} from "@/lib/i18n";
import { DayCheck } from "@/components/progress";
import { HomeProgress, NextUpLink } from "@/components/next-up-link";

/** Vue « accueil » d'une langue (le contenu reste identique, seuls les
 *  textes changent). */
export function HomeView({ locale }: { locale: Locale }) {
  const strings = t(locale);
  const programAnchor = locale === "fr" ? "programme" : "program";

  return (
    <>
      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "var(--nb-hero-glow)" }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <p className="nb-chip mb-6 inline-flex px-3.5 py-1.5 text-xs">
            <span className="h-2 w-2 rounded-full bg-accent-3" />
            {strings.freeBadge}
          </p>

          <h1 className="mx-auto max-w-2xl text-balance text-4xl sm:text-5xl">
            {strings.heroTitleA}{" "}
            <span className="nb-highlight">{strings.heroHighlight}</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-mute">
            {strings.heroDesc}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={dayPath(locale, 1)}
              className="nb-btn nb-btn-primary px-6 py-3 text-sm"
            >
              {strings.startDay1}
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href={`#${programAnchor}`}
              className="nb-btn px-6 py-3 text-sm"
            >
              {strings.viewProgram}
            </Link>
            <NextUpLink locale={locale} />
          </div>

          <div className="mt-14">
            <HomeProgress locale={locale} />
          </div>
        </div>
      </section>

      {/* ---- Programme ---- */}
      <section
        id={programAnchor}
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6"
      >
        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl">{strings.program}</h2>
          <p className="mt-3 text-mute">{strings.programIntro}</p>
        </div>

        <div className="space-y-14">
          {modules.map((mod, moduleIndex) => {
            const accent = moduleAccent(moduleIndex);
            return (
              <div key={mod.id}>
                <div className="mb-5 flex items-start gap-4">
                  <span
                    className="nb-num mt-0.5 h-9 w-9 shrink-0 text-sm"
                    style={{ background: accent, color: "#141414" }}
                  >
                    {String(moduleIndex + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg">{getModuleTitle(mod.id, locale)}</h3>
                    <p className="mt-0.5 max-w-2xl text-sm text-mute">
                      {getModuleDescription(mod.id, locale)}
                    </p>
                  </div>
                  <span className="nb-chip ml-auto hidden shrink-0 self-center px-2.5 py-1 text-xs sm:inline-flex">
                    {strings.daysCount(mod.days.length)}
                  </span>
                </div>

                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {mod.days.map((number) => (
                    <li key={number}>
                      <Link
                        href={dayPath(locale, number)}
                        className="nb-card nb-press group flex h-full items-center gap-3 px-4 py-3.5"
                      >
                        <DayCheck day={number} locale={locale} />
                        <span className="nb-chip shrink-0 px-2 py-1 text-xs tabular-nums">
                          {strings.dayLabel(number)}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm font-medium">
                          {getDayTitle(number, locale)}
                        </span>
                        <span
                          aria-hidden="true"
                          className="text-mute transition-transform group-hover:translate-x-0.5"
                        >
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
