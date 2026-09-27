import Link from "next/link";
import {
  dayPath,
  getAdjacentDays,
  getDayTitle,
  getModuleTitle,
  homePath,
  modules,
  moduleIndexForDay,
  t,
  type Locale,
} from "@/lib/i18n";
import { Markdown } from "@/components/markdown";
import { DaySidebar } from "@/components/day-sidebar";
import { MarkDoneButton } from "@/components/progress";

/** Vue « jour » d'une langue. */
export function DayView({
  locale,
  day,
  content,
}: {
  locale: Locale;
  day: number;
  content: string;
}) {
  const strings = t(locale);
  const index = Math.max(0, moduleIndexForDay(day));
  const mod = modules[index];
  const moduleIndex = index + 1;
  const { prev, next } = getAdjacentDays(day);
  const title = getDayTitle(day, locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Fil d'Ariane */}
      <nav
        aria-label="Fil d'Ariane"
        className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-mute"
      >
        <Link href={homePath(locale)} className="hover:text-ink">
          {strings.home}
        </Link>
        <span aria-hidden="true">/</span>
        <span>
          {strings.moduleLabel(moduleIndex - 1)} ·{" "}
          {getModuleTitle(mod.id, locale)}
        </span>
        <span aria-hidden="true">/</span>
        <span className="font-medium text-ink">
          {strings.dayLabel(day)}
        </span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
        {/* Sommaire des jours (écrans larges) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
            <DaySidebar locale={locale} currentDay={day} />
          </div>
        </aside>

        {/* Sommaire repliable (mobile / tablette) */}
        <details className="nb-details nb-card p-4 lg:hidden">
          <summary className="text-sm font-semibold">
            {strings.courseSummary} — {strings.currentLesson(day, title)}
          </summary>
          <div className="mt-3 max-h-80 overflow-y-auto border-t border-line pt-3">
            <DaySidebar locale={locale} currentDay={day} />
          </div>
        </details>

        <div className="min-w-0">
          {/* En-tête de leçon */}
          <header className="mb-10 border-b border-line pb-8">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="nb-chip nb-chip-accent px-2.5 py-1 text-xs tracking-wide uppercase tabular-nums">
                {strings.dayLabel(day)}
              </span>
              <span className="text-xs font-medium tracking-wide text-mute uppercase">
                {strings.moduleLabel(moduleIndex - 1)} —{" "}
                {getModuleTitle(mod.id, locale)}
              </span>
            </div>
            <h1 className="text-balance text-3xl sm:text-4xl">{title}</h1>
          </header>

          {/* Contenu de la leçon */}
          <article className="nb-prose prose max-w-none prose-headings:scroll-mt-24">
            <Markdown content={content} />
          </article>

          {/* Fin de leçon : marquer comme terminé */}
          <div className="mt-12 flex justify-center border-t border-line pt-8">
            <MarkDoneButton day={day} locale={locale} />
          </div>

          {/* Navigation précédent / suivant */}
          <nav
            aria-label={strings.next}
            className="mt-8 grid gap-3 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                href={dayPath(locale, prev.number)}
                className="nb-card nb-press p-4"
              >
                <span className="text-xs font-medium text-mute">
                  <span aria-hidden="true">←</span> {strings.prev}
                </span>
                <p className="mt-1 text-sm font-semibold">
                  {strings.dayLabel(prev.number)} ·{" "}
                  {getDayTitle(prev.number, locale)}
                </p>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
            {next ? (
              <Link
                href={dayPath(locale, next.number)}
                className="nb-card nb-press p-4 text-right sm:col-start-2"
              >
                <span className="text-xs font-medium text-mute">
                  {strings.next} <span aria-hidden="true">→</span>
                </span>
                <p className="mt-1 text-sm font-semibold">
                  {strings.dayLabel(next.number)} ·{" "}
                  {getDayTitle(next.number, locale)}
                </p>
              </Link>
            ) : (
              <Link
                href={homePath(locale)}
                className="nb-card nb-press p-4 text-right sm:col-start-2"
              >
                <span className="text-xs font-medium text-mute">
                  {strings.endJourney}
                </span>
                <p className="mt-1 text-sm font-semibold">{strings.backHome}</p>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
