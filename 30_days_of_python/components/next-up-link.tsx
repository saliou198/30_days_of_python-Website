"use client";

import Link from "next/link";
import {
  dayPath,
  days,
  getDayTitle,
  t,
  type Locale,
} from "@/lib/i18n";
import { useProgress } from "@/components/progress";

const TOTAL_DAYS = 30;

/** Affiche un lien vers le premier jour non terminé (si le cours a commencé). */
export function NextUpLink({ locale }: { locale: Locale }) {
  const { done } = useProgress();
  const strings = t(locale);

  if (done.length === 0) return null;

  const next = days.find((d) => !done.includes(d.number)) ?? days[days.length - 1];

  return (
    <Link
      href={dayPath(locale, next.number)}
      className="nb-btn nb-btn-primary px-5 py-2.5 text-sm"
    >
      {strings.resumeAt(next.number)}
      <span aria-hidden="true">→</span>
    </Link>
  );
}

/** Barre de progression affichée sur la page d'accueil. */
export function HomeProgress({ locale }: { locale: Locale }) {
  const { done } = useProgress();
  const count = done.length;
  const pct = Math.round((count / TOTAL_DAYS) * 100);
  const strings = t(locale);
  const lesson = count > 0 ? getDayTitle(count === TOTAL_DAYS ? 30 : count + 1, locale) : null;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">{strings.progress}</span>
        <span className="tabular-nums text-mute">
          {count}/{TOTAL_DAYS} {strings.progressUnit} · {pct}%
        </span>
      </div>
      <div className="nb-bar h-3">
        <span style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-xs text-mute">
        {count === 0
          ? strings.progressHintStart
          : count === TOTAL_DAYS
            ? strings.progressHintDone
            : `${strings.progressHintMid} ${strings.currentLesson(
                count + 1,
                lesson ?? ""
              )}`}
      </p>
    </div>
  );
}
