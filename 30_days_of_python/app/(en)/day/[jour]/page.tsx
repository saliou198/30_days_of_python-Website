import type { Metadata } from "next";
import { DayView } from "@/components/day-view";
import { days, getDay, getDayTitle, t } from "@/lib/i18n";
import { resolveDay } from "@/lib/day-route";

export const dynamicParams = true;

export function generateStaticParams() {
  return days.map((d) => ({ jour: d.slug }));
}

export async function generateMetadata(
  props: PageProps<"/day/[jour]">
): Promise<Metadata> {
  const { jour } = await props.params;
  const day = getDay(parseInt(jour, 10));
  if (!day) return {};
  const title = getDayTitle(day.number, "en");
  return {
    title: t("en").dayMeta(day.number, title),
    description: t("en").dayDesc(day.number, title),
  };
}

export default async function DayPage(props: PageProps<"/day/[jour]">) {
  const { jour } = await props.params;
  const { day, content } = await resolveDay(jour, "en");
  return <DayView locale="en" day={day.number} content={content} />;
}
