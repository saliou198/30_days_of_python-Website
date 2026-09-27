# 30 Days of Python — Site du cours

Site web Next.js qui présente le cours [30 Days Of Python](https://github.com/Asabeneh/30-Days-Of-Python)
en français et en anglais, sous forme de parcours structuré pour débutants :
30 leçons organisées en 9 modules progressifs, avec suivi de progression local.

## Démarrer

```bash
npm install
npm run dev
```

Ouvrez <http://localhost:3000>.

## URLs

L'anglais est la langue par défaut, le français vit sous `/fr`.

| Page            | Anglais             | Français        |
| --------------- | ------------------ | --------------- |
| Accueil         | `/`                | `/fr`           |
| Leçon           | `/day/01` … `/day/30` | `/fr/jour/01` … `/fr/jour/30` |
| Ancienne URL FR | `/jour/01` → redirigée vers `/fr/jour/01` | |

Le nom des fichiers de leçon est canonique (`/day/3` redirige vers `/day/03`).
Changer de langue recharge la page (chaque langue a son propre layout racine,
ce qui garantit le bon attribut `lang` sur `<html>`).

## Apparence

Deux réglages indépendants, combinables, mémorisés sur l'appareil
(`localStorage`, clés `p30j-theme` et `p30j-style`) et appliqués **avant le
premier rendu** par un script inline dans le `<head>` (pas de flash) :

- **Thème** : clair (par défaut) / sombre.
- **Style** : `neo` — néobrutalisme (par défaut) / `modern`.

L'apparence par défaut est déclarée une seule fois, dans `lib/appearance.ts`
(`DEFAULT_THEME`, `DEFAULT_STYLE`). Le sélecteur se trouve dans l'en-tête, à
côté du bouton de langue.

## Structure

- `content/en/01.md … 30.md`, `content/fr/01.md … 30.md` — contenu des leçons
- `scripts/build-content.mjs` — régénère `content/` et `public/images/` depuis
  le dépôt source `../30-Days-Of-Python` (dossiers racine et `French/`)
- `lib/i18n.ts` — modules, titres, chemins par langue, chaînes d'interface
- `lib/content.ts` — lecture du markdown d'une leçon
- `lib/day-route.ts` — validation du segment d'URL + chargement d'une leçon
- `lib/appearance.ts` — clés de stockage et script d'application du thème/style
- `app/(en)/…`, `app/fr/…` — une racine par langue (layouts, pages, 404)
- `components/home-view.tsx`, `components/day-view.tsx` — vues partagées entre
  les deux langues (seul le texte change)
- `components/appearance-menu.tsx`, `components/lang-switch.tsx` — contrôles
  d'apparence et de langue

## Workflow

- **Modifier une leçon** : éditer `content/<locale>/NN.md` puis relancer le build.
- **Régénérer tout le contenu depuis le dépôt source** : `npm run content`
  (nécessite le dossier `../30-Days-Of-Python` à côté de ce projet).
- **Réorganiser les modules / l'ordre** : éditer `lib/i18n.ts`.
- **Ajouter une langue** : ajouter les entrées dans `lib/i18n.ts`, dupliquer
  `app/fr` en `app/<locale>` et ajouter le dossier `content/<locale>`.

## Notes techniques

- Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4.
- `turbopack.root` est défini dans `next.config.ts` pour ignorer le
  `package.json` présent dans le répertoire personnel.
- La progression de l'élève est stockée dans `localStorage` (clé `p30j-progress`).
- Le style est piloté par des variables CSS (`--nb-*`) exposées à Tailwind via
  `@theme inline` : les composants n'utilisent que des classes
  sémantiques (`bg-surface`, `text-ink`, `border-line`, `nb-card`, `nb-btn`…),
  jamais de couleurs en dur, et **aucune variante `dark:`** — le thème est un
  attribut sur `<html>`, pas la préférence système.

### Ajouter un style

1. Déclarer le style dans `lib/appearance.ts` (`STYLES`, `Style`,
   `isStyle`) et, s'il devient l'apparence par défaut, `DEFAULT_STYLE`.
2. Ajouter un bloc `html[data-style="<nom>"]` dans `app/globals.css` qui
   surcharge les variables `--nb-*` (et `html[data-style="<nom>"][data-theme="dark"]`
   pour la variante sombre), plus les règles de décor propres au style.
3. Ajouter son libellé dans `lib/i18n.ts` (`styleModern`, `styleNeo`, …).
