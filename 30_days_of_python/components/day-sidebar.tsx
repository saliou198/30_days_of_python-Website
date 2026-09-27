"use client";

import Link from "next/link";
import {
  dayPath,
  getDayTitle,
  getModuleTitle,
  modules,
  t,
  type Locale,
} from "@/lib/i18n";
import { DayCheck, useProgress } from "@/components/progress";

export function DaySidebar({
  locale,
  currentDay,
  className,
}: {
  locale: Locale;
  currentDay: number;
  className?: string;
}) {
  const { isDone } = useProgress();
  const strings = t(locale);

  return (
    <nav aria-label={strings.courseSummary} className={className}>
      {modules.map((mod, i) => {
        const moduleDone = mod.days.filter((n) => isDone(n)).length;

        return (
          <div key={mod.id} className="mb-5">
            <p className="mb-1.5 flex items-baseline gap-1.5 px-2 text-[11px] font-semibold tracking-wider text-mute uppercase">
              {strings.moduleLabel(i)} · {getModuleTitle(mod.id, locale)}
              <span className="font-normal tabular-nums">
                {moduleDone}/{mod.days.length}
              </span>
            </p>
            <ul className="space-y-0.5">
              {mod.days.map((number) => {
                const active = number === currentDay;
                return (
                  <li key={number}>
                    <Link
                      href={dayPath(locale, number)}
                      aria-current={active ? "page" : undefined}
                      data-active={active}
                      className="nb-row px-2 py-1.5 text-sm"
                    >
                      <DayCheck day={number} locale={locale} />
                      <span className="tabular-nums text-mute">
                        {String(number).padStart(2, "0")}
                      </span>
                      <span className="truncate">
                        {getDayTitle(number, locale)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
