import { notFound } from "next/navigation";

/** Attrape toutes les URL qui ne correspondent à aucune route anglaise. */
export default function CatchAll() {
  notFound();
}
