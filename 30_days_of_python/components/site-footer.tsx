import { t, type Locale } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const strings = t(locale);

  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-mute sm:flex-row sm:px-6">
        <p>
          {strings.footerCredit}{" "}
          <a
            href="https://github.com/Asabeneh/30-Days-Of-Python"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-ink underline decoration-line underline-offset-2 hover:decoration-ink"
          >
            {strings.footerAuthor}
          </a>
        </p>
        <p className="text-center text-xs sm:text-end">
          {strings.footerStorage}
        </p>
      </div>
    </footer>
  );
}
