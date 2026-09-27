"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  DEFAULT_STYLE,
  DEFAULT_THEME,
  STYLES,
  STYLE_STORAGE_KEY,
  THEMES,
  THEME_STORAGE_KEY,
  isStyle,
  isTheme,
  type Style,
  type Theme,
} from "@/lib/appearance";

type Labels = {
  appearanceLabel: string;
  themeLabel: string;
  themeLight: string;
  themeDark: string;
  styleLabel: string;
  styleModern: string;
  styleNeo: string;
};

function readTheme(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME;
  const value = document.documentElement.getAttribute("data-theme");
  return isTheme(value) ? value : DEFAULT_THEME;
}

function readStyle(): Style {
  if (typeof document === "undefined") return DEFAULT_STYLE;
  const value = document.documentElement.getAttribute("data-style");
  return isStyle(value) ? value : DEFAULT_STYLE;
}

function persist(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // stockage indisponible : le choix reste actif pour la session
  }
}

/**
 * Sélecteur d'apparence : thème clair/sombre + style (moderne ou
 * néobrutaliste). L'état est lu dans le DOM, que le script inline du
 * <head> a déjà mis à jour avant le premier rendu : aucun décalage
 * d'hydratation, aucun flash.
 */
export function AppearanceMenu({ labels }: { labels: Labels }) {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [style, setStyle] = useState<Style>(readStyle);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Réapplique les attributs avant peinture : en développement, le remontage
  // de React Strict Mode nettoie <html> de l'attribut ajouté par le script.
  // Sans effet en production.
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-style", style);
  }, [theme, style]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function chooseTheme(next: Theme) {
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    persist(THEME_STORAGE_KEY, next);
  }

  function chooseStyle(next: Style) {
    setStyle(next);
    document.documentElement.setAttribute("data-style", next);
    persist(STYLE_STORAGE_KEY, next);
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={labels.appearanceLabel}
        title={labels.appearanceLabel}
        className="nb-btn h-10 w-10 shrink-0 text-lg"
      >
        {/* Icône pilotée par CSS selon le style actif */}
        <span className="ap-when-modern items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13Z"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M4 9h16M9 9v11"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
        </span>
        <span className="ap-when-neo items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <rect
              x="3.5"
              y="3.5"
              width="17"
              height="17"
              rx="1"
              fill="currentColor"
            />
            <path
              d="M7 7.5h10v9H7z"
              fill="var(--nb-surface)"
            />
          </svg>
        </span>
        <span className="sr-only">{labels.appearanceLabel}</span>
      </button>

      {open ? (
        <div
          ref={panelRef}
          role="group"
          aria-label={labels.appearanceLabel}
          className="nb-card absolute right-0 z-50 mt-2 w-60 p-3"
        >
          <p className="mb-2 text-xs font-semibold tracking-wide text-mute uppercase">
            {labels.themeLabel}
          </p>
          <div className="mb-4 grid grid-cols-2 gap-2">
            {THEMES.map((value) => (
              <Option
                key={value}
                selected={theme === value}
                onSelect={() => chooseTheme(value)}
                icon={
                  value === "light" ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
                      <path
                        d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5 5l1.6 1.6M17.4 17.4 19 19M19 5l-1.6 1.6M6.6 17.4 5 19"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
                        fill="currentColor"
                      />
                    </svg>
                  )
                }
                label={value === "light" ? labels.themeLight : labels.themeDark}
              />
            ))}
          </div>

          <p className="mb-2 text-xs font-semibold tracking-wide text-mute uppercase">
            {labels.styleLabel}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {STYLES.map((value) => (
              <Option
                key={value}
                selected={style === value}
                onSelect={() => chooseStyle(value)}
                icon={
                  value === "modern" ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <rect
                        x="3.5"
                        y="3.5"
                        width="17"
                        height="17"
                        rx="4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <path
                        d="M7.5 9.5h9M7.5 13h6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="2.6"
                      />
                      <path
                        d="M3 21h18"
                        stroke="currentColor"
                        strokeWidth="2.6"
                      />
                    </svg>
                  )
                }
                label={value === "modern" ? labels.styleModern : labels.styleNeo}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Option({
  selected,
  onSelect,
  icon,
  label,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`nb-btn nb-btn-start h-9 gap-2 px-3 text-xs ${
        selected ? "nb-btn-primary" : ""
      }`}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}
