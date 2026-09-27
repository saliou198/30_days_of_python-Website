"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { programAnchor, t, type Locale } from "@/lib/i18n";

const STORAGE_KEY = "p30j-progress";
const TOTAL_DAYS = 30;
const EMPTY: number[] = [];

type Listener = () => void;

const listeners = new Set<Listener>();
let cache: number[] | null = null;

function readStore(): number[] {
  if (cache === null) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      cache = Array.isArray(parsed) ? parsed : [];
    } catch {
      cache = [];
    }
  }
  return cache;
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): number[] {
  return readStore();
}

function getServerSnapshot(): number[] {
  return EMPTY;
}

function toggleDay(day: number) {
  const current = readStore();
  const next = current.includes(day)
    ? current.filter((d) => d !== day)
    : [...current, day].sort((a, b) => a - b);
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // stockage indisponible : on garde en mémoire
  }
  for (const listener of listeners) listener();
}

export function useProgress() {
  const done = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    done,
    toggle: toggleDay,
    isDone: (day: number) => done.includes(day),
  };
}

const Tick = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
    <path
      d="M3 8.5 6.5 12 13 4.5"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Case à cocher pour marquer un jour comme terminé. */
export function DayCheck({ day, locale }: { day: number; locale: Locale }) {
  const { isDone, toggle } = useProgress();
  const checked = isDone(day);

  return (
    <button
      type="button"
      aria-label={t(locale).markDayLabel(day)}
      aria-pressed={checked}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(day);
      }}
      className="nb-check"
      data-checked={checked}
    >
      <Tick />
    </button>
  );
}

/** Compteur de progression pour l'en-tête. */
export function ProgressCounter({
  locale,
  title,
}: {
  locale: Locale;
  title: string;
}) {
  const { done } = useProgress();
  const pct = Math.round((done.length / TOTAL_DAYS) * 100);

  return (
    <Link
      href={programAnchor(locale)}
      className="hidden items-center gap-2.5 sm:flex"
      title={title}
    >
      <span className="nb-bar h-2.5 w-24">
        <span style={{ width: `${pct}%` }} />
      </span>
      <span className="text-sm font-medium tabular-nums text-mute">
        {done.length}/{TOTAL_DAYS}
      </span>
    </Link>
  );
}

/** Gros bouton en fin de leçon pour marquer le jour comme terminé. */
export function MarkDoneButton({ day, locale }: { day: number; locale: Locale }) {
  const { isDone, toggle } = useProgress();
  const checked = isDone(day);
  const strings = t(locale);

  return (
    <button
      type="button"
      onClick={() => toggle(day)}
      aria-pressed={checked}
      className={`nb-btn px-5 py-2.5 text-sm ${
        checked ? "nb-btn-primary" : ""
      }`}
    >
      <Tick className="h-4 w-4" />
      {checked ? strings.dayDone : strings.markDone}
    </button>
  );
}
