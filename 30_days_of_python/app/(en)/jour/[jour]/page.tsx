import { redirect } from "next/navigation";
import { dayPath, days, getDay } from "@/lib/i18n";

export const dynamicParams = true;

export function generateStaticParams() {
  return days.map((d) => ({ jour: d.slug }));
}

/**
 * Les anciennes URL françaises (/jour/01) datent de la version monolingue :
 * on les renvoie vers leur équivalent dans la section française.
 */
export default async function LegacyFrenchDayPage(
  props: PageProps<"/jour/[jour]">
) {
  const { jour } = await props.params;
  const day = getDay(parseInt(jour, 10));
  redirect(day ? dayPath("fr", day.number) : "/fr");
}
