import { notFound } from "next/navigation";

/** Attrape toutes les URL qui ne correspondent à aucune route française. */
export default function FrenchCatchAll() {
  notFound();
}
