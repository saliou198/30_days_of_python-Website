import type { Metadata } from "next";
import "../globals.css";
import { Document } from "@/components/document";
import { SiteFrame } from "@/components/site-frame";

export const metadata: Metadata = {
  title: {
    default: "30 Jours de Python — Cours progressif pour débutants",
    template: "%s · 30 Jours de Python",
  },
  description:
    "Apprenez Python en 30 jours : un parcours structuré et progressif, du premier « Hello World » jusqu'aux API web. Conçu pour les débutants.",
};

export default function FrenchLayout({ children }: LayoutProps<"/fr">) {
  return (
    <Document lang="fr">
      <SiteFrame locale="fr">{children}</SiteFrame>
    </Document>
  );
}
