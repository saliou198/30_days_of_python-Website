import type { Metadata } from "next";
import { NotFoundView } from "@/components/not-found-view";

export const metadata: Metadata = {
  title: "404 — Page not found",
};

export default function NotFound() {
  return <NotFoundView locale="en" />;
}
