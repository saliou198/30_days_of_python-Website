import type { Metadata } from "next";
import { NotFoundView } from "@/components/not-found-view";

export const metadata: Metadata = {
  title: "404 — Page introuvable",
};

export default function FrenchNotFound() {
  return <NotFoundView locale="fr" />;
}
