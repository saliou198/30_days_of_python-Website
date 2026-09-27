import Link from "next/link";
import { dayPath, homePath, t, type Locale } from "@/lib/i18n";

export function NotFoundView({ locale }: { locale: Locale }) {
  const strings = t(locale);

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <span
        aria-hidden="true"
        className="nb-num mb-6 h-16 w-16 text-2xl"
        style={{ background: "var(--nb-accent-3)" }}
      >
        404
      </span>
      <h1 className="text-3xl sm:text-4xl">{strings.notFoundTitle}</h1>
      <p className="mt-3 text-mute">{strings.notFoundDesc}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={homePath(locale)}
          className="nb-btn nb-btn-primary px-5 py-2.5 text-sm"
        >
          {strings.notFoundHome}
        </Link>
        <Link
          href={dayPath(locale, 1)}
          className="nb-btn px-5 py-2.5 text-sm"
        >
          {strings.startDay1}
        </Link>
      </div>
    </div>
  );
}
