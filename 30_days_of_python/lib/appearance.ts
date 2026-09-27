export const THEME_STORAGE_KEY = "p30j-theme";
export const STYLE_STORAGE_KEY = "p30j-style";

export type Theme = "light" | "dark";
export type Style = "modern" | "neo";

/**
 * Apparence par défaut du site, appliquée tant que l'appareil n'a pas
 * enregistré de choix : thème clair, style néobrutaliste.
 */
export const DEFAULT_THEME: Theme = "light";
export const DEFAULT_STYLE: Style = "neo";

/** Ordre d'affichage dans le sélecteur : le défaut en premier. */
export const THEMES: readonly Theme[] = ["light", "dark"];
export const STYLES: readonly Style[] = ["neo", "modern"];

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export function isStyle(value: unknown): value is Style {
  return value === "modern" || value === "neo";
}

/**
 * Script inline à placer dans le <head> : applique le thème et le style
 * choisis sur l'appareil AVANT le premier rendu, pour éviter tout flash.
 * Sans choix enregistré, on retombe sur l'apparence par défaut du site
 * (thème clair, style néobrutaliste).
 */
export const appearanceInitScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t!=="light"&&t!=="dark"){t="${DEFAULT_THEME}"}d.setAttribute("data-theme",t);var s=localStorage.getItem(${JSON.stringify(STYLE_STORAGE_KEY)});d.setAttribute("data-style",(s==="neo"||s==="modern")?s:"${DEFAULT_STYLE}")}catch(e){d.setAttribute("data-theme","${DEFAULT_THEME}");d.setAttribute("data-style","${DEFAULT_STYLE}")}})()`;
