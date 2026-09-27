import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Locale } from "@/lib/i18n";

const CONTENT_DIR = path.join(process.cwd(), "content");

/** Levée quand le markdown d'un jour est absent (contenu non généré). */
export class MissingLessonError extends Error {
  constructor(day: number, locale: Locale) {
    super(`Leçon introuvable : content/${locale}/${day}.md`);
    this.name = "MissingLessonError";
  }
}

/**
 * Retire le titre H1 « # 📘 Day N » / « Jour N » (affiché séparément dans
 * l'en-tête de la page) ainsi que la première entrée du sommaire qui pointe
 * vers lui.
 */
function stripHeading(markdown: string, day: number): string {
  let out = markdown;
  const heading = new RegExp(
    `^#{1,2}\\s+(📘\\s+)?(Jour|Day)\\s*${day}\\b[^\\n]*\\n?`,
    "m"
  );
  out = out.replace(heading, "");
  const tocEntry = new RegExp(
    `^\\s*- \\[(📘\\s+)?(Jour|Day)\\s*${day}\\]\\(#[^)]*\\)\\n?`,
    "m"
  );
  out = out.replace(tocEntry, "");
  return out.trimStart();
}

export async function getDayContent(
  day: number,
  locale: Locale
): Promise<string> {
  const slug = String(day).padStart(2, "0");
  const file = path.join(CONTENT_DIR, locale, `${slug}.md`);
  try {
    const raw = await readFile(file, "utf8");
    return stripHeading(raw, day);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new MissingLessonError(day, locale);
    }
    throw error;
  }
}
