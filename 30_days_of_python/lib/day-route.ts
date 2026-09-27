import { notFound, redirect } from "next/navigation";
import { getDay, dayPath, type Day, type Locale } from "@/lib/i18n";
import { MissingLessonError, getDayContent } from "@/lib/content";

/**
 * Valide le segment d'URL d'une leçon et charge son markdown.
 * - `/day/3` et `/fr/jour/3` → redirection vers la forme canonique `03`
 * - jour inconnu ou contenu absent → 404
 */
export async function resolveDay(
  jour: string,
  locale: Locale
): Promise<{ day: Day; content: string }> {
  const day = getDay(Number.parseInt(jour, 10));

  if (!day) notFound();
  if (day.slug !== jour) redirect(dayPath(locale, day.number));

  let content: string;
  try {
    content = await getDayContent(day.number, locale);
  } catch (error) {
    if (error instanceof MissingLessonError) notFound();
    throw error;
  }

  return { day, content };
}
