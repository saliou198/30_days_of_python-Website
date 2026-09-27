export type Locale = "en" | "fr";

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALES: readonly Locale[] = ["en", "fr"];

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "fr";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "fr" : "en";
}

/* ---------- Chemins ---------- */

export function homePath(locale: Locale): string {
  return locale === "fr" ? "/fr" : "/";
}

export function dayBase(locale: Locale): string {
  return locale === "fr" ? "/fr/jour" : "/day";
}

export function dayPath(locale: Locale, day: number): string {
  return `${dayBase(locale)}/${String(day).padStart(2, "0")}`;
}

/** Ancre de la section « programme » sur la page d'accueil. */
export function programAnchor(locale: Locale): string {
  return locale === "fr" ? "/fr#programme" : "/#program";
}

/**
 * Chemin équivalent dans l'autre langue, pour le sélecteur de langue.
 * `/` → `/fr`, `/fr/jour/03` → `/day/03`, `/day/03` → `/fr/jour/03`.
 */
export function swapLocalePath(pathname: string, locale: Locale): string {
  const target = otherLocale(locale);
  const stripped = pathname.replace(/^\/fr(?=\/|$)/, "") || "/";

  if (target === "en") return stripped;

  const french = stripped.replace(/^\/day\/(\d+)/, "/fr/jour/$1");
  if (french === "/") return "/fr";
  return french.startsWith("/fr") ? french : `/fr${french}`;
}

/* ---------- Structure du programme (langue-agnostique) ---------- */

export type ModuleDef = { id: string; days: number[] };

export const modules: ModuleDef[] = [
  { id: "fundamentals", days: [1, 2, 3, 4] },
  { id: "data-structures", days: [5, 6, 7, 8] },
  { id: "logic-functions", days: [9, 10, 11, 12] },
  { id: "going-further", days: [13, 14, 15, 16, 17] },
  { id: "files-tools", days: [18, 19, 20] },
  { id: "oop", days: [21] },
  { id: "data-ecosystem", days: [22, 23, 24, 25] },
  { id: "web-dev", days: [26, 27, 28, 29] },
  { id: "conclusion", days: [30] },
];

/** Couleur d'accent (hex) attribuée à chaque module, dans l'ordre. */
export const moduleAccents: string[] = [
  "#FFD94A", // yellow
  "#7FE3FF", // cyan
  "#FF8FC0", // pink
  "#A6F26D", // lime
  "#FFB35C", // orange
  "#C0A3FF", // purple
  "#7CD1FF", // sky
  "#FFA9A3", // rose
  "#F5E663", // sand
];

export function moduleAccent(moduleIndex: number): string {
  return moduleAccents[moduleIndex % moduleAccents.length];
}

export function moduleIndexForDay(day: number): number {
  return modules.findIndex((m) => m.days.includes(day));
}

export type Day = { number: number; slug: string; moduleId: string };

const moduleIdByDay = new Map<number, string>();
for (const mod of modules) {
  for (const n of mod.days) moduleIdByDay.set(n, mod.id);
}

export const days: Day[] = Array.from({ length: 30 }, (_, i) => {
  const number = i + 1;
  return {
    number,
    slug: String(number).padStart(2, "0"),
    moduleId: moduleIdByDay.get(number)!,
  };
});

export function getDay(number: number): Day | undefined {
  return days.find((d) => d.number === number);
}

export function getAdjacentDays(
  number: number
): { prev?: Day; next?: Day } {
  const idx = days.findIndex((d) => d.number === number);
  return {
    prev: idx > 0 ? days[idx - 1] : undefined,
    next: idx >= 0 && idx < days.length - 1 ? days[idx + 1] : undefined,
  };
}

/* ---------- Traductions ---------- */

type ModuleMeta = { title: string; description: string };

const moduleMeta: Record<Locale, Record<string, ModuleMeta>> = {
  en: {
    fundamentals: {
      title: "Fundamentals",
      description:
        "Install Python, write your first lines of code and discover the building blocks of the language.",
    },
    "data-structures": {
      title: "Data Structures",
      description:
        "Learn to organize and manipulate data: lists, tuples, sets and dictionaries.",
    },
    "logic-functions": {
      title: "Logic and Functions",
      description:
        "Give your programs a brain: conditionals, loops, functions and modules.",
    },
    "going-further": {
      title: "Going Further",
      description:
        "Intermediate techniques: list comprehensions, higher-order functions, dates and exceptions.",
    },
    "files-tools": {
      title: "Files and Tools",
      description:
        "Work with real files, master regular expressions and the pip package manager.",
    },
    oop: {
      title: "Object-Oriented Programming",
      description:
        "Model the real world with classes and objects — the backbone of large applications.",
    },
    "data-ecosystem": {
      title: "Data and Ecosystem",
      description:
        "Explore the Python ecosystem: web scraping, virtual environments, statistics and Pandas.",
    },
    "web-dev": {
      title: "Web Development",
      description:
        "Build complete applications: Flask, MongoDB databases and REST APIs.",
    },
    conclusion: {
      title: "Conclusion",
      description: "A look back at the journey and paths to keep improving.",
    },
  },
  fr: {
    fundamentals: {
      title: "Fondamentaux",
      description:
        "Installez Python, écrivez vos premières lignes de code et découvrez les briques de base du langage.",
    },
    "data-structures": {
      title: "Structures de données",
      description:
        "Apprenez à organiser et manipuler vos données : listes, tuples, ensembles et dictionnaires.",
    },
    "logic-functions": {
      title: "Logique et fonctions",
      description:
        "Donnez de l'intelligence à vos programmes : conditions, boucles, fonctions et modules.",
    },
    "going-further": {
      title: "Aller plus loin",
      description:
        "Techniques intermédiaires : listes en compréhension, fonctions d'ordre supérieur, dates et exceptions.",
    },
    "files-tools": {
      title: "Fichiers et outils",
      description:
        "Travaillez avec des fichiers réels, maîtrisez les expressions régulières et le gestionnaire de paquets pip.",
    },
    oop: {
      title: "Programmation orientée objet",
      description:
        "Modélisez le monde réel avec des classes et des objets, le pilier des grandes applications.",
    },
    "data-ecosystem": {
      title: "Données et écosystème",
      description:
        "Explorez l'écosystème Python : web scraping, environnements virtuels, statistiques et Pandas.",
    },
    "web-dev": {
      title: "Développement web",
      description:
        "Construisez des applications complètes : Flask, bases de données MongoDB et API REST.",
    },
    conclusion: {
      title: "Conclusion",
      description:
        "Le point sur le parcours accompli et les pistes pour continuer à progresser.",
    },
  },
};

const dayTitles: Record<Locale, Record<number, string>> = {
  en: {
    1: "Introduction",
    2: "Variables, Built-in Functions",
    3: "Operators",
    4: "Strings",
    5: "Lists",
    6: "Tuples",
    7: "Sets",
    8: "Dictionaries",
    9: "Conditionals",
    10: "Loops",
    11: "Functions",
    12: "Modules",
    13: "List Comprehension",
    14: "Higher Order Functions",
    15: "Python Type Errors",
    16: "Python Date Time",
    17: "Exception Handling",
    18: "Regular Expressions",
    19: "File Handling",
    20: "Python Package Manager",
    21: "Classes and Objects",
    22: "Web Scraping",
    23: "Virtual Environment",
    24: "Statistics",
    25: "Pandas",
    26: "Python Web",
    27: "Python with MongoDB",
    28: "API",
    29: "Building API",
    30: "Conclusions",
  },
  fr: {
    1: "Introduction",
    2: "Variables et fonctions natives",
    3: "Opérateurs",
    4: "Chaînes de caractères",
    5: "Listes",
    6: "Tuples",
    7: "Ensembles",
    8: "Dictionnaires",
    9: "Conditions",
    10: "Boucles",
    11: "Fonctions",
    12: "Modules",
    13: "Listes en compréhension",
    14: "Fonctions d'ordre supérieur",
    15: "Erreurs de type",
    16: "Dates et heures",
    17: "Gestion des exceptions",
    18: "Expressions régulières",
    19: "Manipulation de fichiers",
    20: "Gestionnaire de paquets",
    21: "Classes et objets",
    22: "Web scraping",
    23: "Environnement virtuel",
    24: "Statistiques",
    25: "Pandas",
    26: "Python et le web",
    27: "Python avec MongoDB",
    28: "API",
    29: "Construire une API",
    30: "Conclusions",
  },
};

export function getModuleTitle(id: string, locale: Locale): string {
  return moduleMeta[locale][id].title;
}

export function getModuleDescription(id: string, locale: Locale): string {
  return moduleMeta[locale][id].description;
}

export function getDayTitle(day: number, locale: Locale): string {
  return dayTitles[locale][day];
}

/* ---------- Chaînes d'interface ---------- */

export const ui = {
  en: {
    siteName: "30 Days of Python",
    tagline: "Progressive course for beginners",
    freeBadge: "Free course · 30 lessons · 9 modules",
    heroTitleA: "Learn Python,",
    heroHighlight: "one day at a time",
    heroDesc:
      "A path designed for beginners: every day introduces one new concept, with commented examples and hands-on exercises. No prerequisites.",
    startDay1: "Start Day 1",
    viewProgram: "View the program",
    resumeAt: (n: number) => `Resume at Day ${n}`,
    program: "Program",
    programIntro:
      "30 days organized into 9 progressive modules, from simplest to most advanced. Follow the order: each day builds on the previous ones.",
    moduleLabel: (i: number) => `Module ${i + 1}`,
    dayLabel: (n: number) => `Day ${n}`,
    daysCount: (n: number) => `${n} ${n > 1 ? "days" : "day"}`,
    progress: "Your progress",
    progressUnit: "days",
    progressHintStart:
      "Check off a day once you've completed it — your progress stays on this device.",
    progressHintMid: "Keep going, every day counts.",
    progressHintDone: "Congratulations, you've completed all 30 days! 🎉",
    courseSummary: "Course summary",
    currentLesson: (n: number, title: string) => `Day ${n}: ${title}`,
    markDone: "Mark this day as completed",
    dayDone: "Day completed — well done!",
    prev: "Previous day",
    next: "Next day",
    endJourney: "End of the journey",
    backHome: "Back to home",
    home: "Home",
    markDayLabel: (n: number) => `Mark Day ${n} as completed`,
    dayMeta: (n: number, title: string) => `Day ${n} — ${title}`,
    dayDesc: (n: number, title: string) =>
      `Day ${n} of the 30 Days of Python course: ${title}.`,
    notFoundTitle: "404 — Page not found",
    notFoundDesc: "This page does not exist. Cette page n'existe pas.",
    notFoundHome: "Back to the English homepage",
    appearance: "Appearance",
    appearanceLabel: "Change appearance",
    themeLabel: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    styleLabel: "Style",
    styleModern: "Modern",
    styleNeo: "Neo-brutalism",
    langSwitchLabel: "Change language",
    langName: "English",
    footerCredit: "Course adapted from",
    footerAuthor: "30 Days Of Python by Asabeneh Yetayeh",
    footerStorage: "Your progress is saved locally in your browser.",
  },
  fr: {
    siteName: "30 Jours de Python",
    tagline: "Cours progressif pour débutants",
    freeBadge: "Cours gratuit · 30 leçons · 9 modules",
    heroTitleA: "Apprenez Python,",
    heroHighlight: "un jour à la fois",
    heroDesc:
      "Un parcours pensé pour les débutants : chaque jour introduit une notion nouvelle, avec des exemples commentés et des exercices pratiques. Aucun prérequis.",
    startDay1: "Commencer le Jour 1",
    viewProgram: "Voir le programme",
    resumeAt: (n: number) => `Reprendre au Jour ${n}`,
    program: "Programme",
    programIntro:
      "30 jours organisés en 9 modules progressifs, du plus simple au plus avancé. Suivez l'ordre : chaque jour s'appuie sur les notions des jours précédents.",
    moduleLabel: (i: number) => `Module ${i + 1}`,
    dayLabel: (n: number) => `Jour ${n}`,
    daysCount: (n: number) => `${n} ${n > 1 ? "jours" : "jour"}`,
    progress: "Votre progression",
    progressUnit: "jours",
    progressHintStart:
      "Cochez un jour lorsque vous l'avez terminé — votre avancée reste sur cet appareil.",
    progressHintMid: "Continuez, chaque jour compte.",
    progressHintDone: "Félicitations, vous avez terminé les 30 jours ! 🎉",
    courseSummary: "Sommaire du cours",
    currentLesson: (n: number, title: string) => `Jour ${n} : ${title}`,
    markDone: "Marquer ce jour comme terminé",
    dayDone: "Jour terminé — bien joué !",
    prev: "Jour précédent",
    next: "Jour suivant",
    endJourney: "Fin du parcours",
    backHome: "Retour à l'accueil",
    home: "Accueil",
    markDayLabel: (n: number) => `Marquer le Jour ${n} comme terminé`,
    dayMeta: (n: number, title: string) => `Jour ${n} — ${title}`,
    dayDesc: (n: number, title: string) =>
      `Leçon du jour ${n} du cours 30 Jours de Python : ${title}.`,
    notFoundTitle: "404 — Page introuvable",
    notFoundDesc: "Cette page n'existe pas. This page does not exist.",
    notFoundHome: "Retour à l'accueil français",
    appearance: "Apparence",
    appearanceLabel: "Changer l'apparence",
    themeLabel: "Thème",
    themeLight: "Clair",
    themeDark: "Sombre",
    styleLabel: "Style",
    styleModern: "Moderne",
    styleNeo: "Néobrutalisme",
    langSwitchLabel: "Changer de langue",
    langName: "Français",
    footerCredit: "Cours adapté de",
    footerAuthor: "30 Days Of Python d'Asabeneh Yetayeh",
    footerStorage: "Votre progression est enregistrée localement dans votre navigateur.",
  },
} as const;

export type UiStrings = (typeof ui)["en"];

export function t(locale: Locale): UiStrings {
  return ui[locale] as UiStrings;
}
