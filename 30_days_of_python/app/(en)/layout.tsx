import type { Metadata } from "next";
import "../globals.css";
import { Document } from "@/components/document";
import { SiteFrame } from "@/components/site-frame";

export const metadata: Metadata = {
  title: {
    default: "30 Days of Python — A progressive course for beginners",
    template: "%s · 30 Days of Python",
  },
  description:
    "Learn Python in 30 days: a structured, progressive path from your first “Hello World” to web APIs. Built for beginners.",
};

export default function EnglishLayout({ children }: LayoutProps<"/">) {
  return (
    <Document lang="en">
      <SiteFrame locale="en">{children}</SiteFrame>
    </Document>
  );
}
