import type { Metadata } from "next";
import { DayView } from "@/components/day-view";
import { days, getDay, getDayTitle, t } from "@/lib/i18n";
import { resolveDay } from "@/lib/day-route";

export const dynamicParams = true;

export function generateStaticParams() {
  return days.map((d) => ({ jour: d.slug }));
}

export async function generateMetadata(
  props: PageProps<"/fr/jour/[jour]">
): Promise<Metadata> {
  const { jour } = await props.params;
  const day = getDay(parseInt(jour, 10));
  if (!day) return {};
  const title = getDayTitle(day.number, "fr");
  return {
    title: t("fr").dayMeta(day.number, title),
    description: t("fr").dayDesc(day.number, title),
  };
}

export default async function FrenchDayPage(props: PageProps<"/fr/jour/[jour]">) {
  const { jour } = await props.params;
  const { day, content } = await resolveDay(jour, "fr");
  return <DayView locale="fr" day={day.number} content={content} />;
}
