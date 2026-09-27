// Extrait le contenu des deux langues depuis ../30-Days-Of-Python/ et le
// transforme en fichiers markdown propres pour le site :
//   content/en/01..30.md  (anglais — langue par défaut)
//   content/fr/01..30.md  (français)
// Copie aussi les images vers public/images/.
// Usage : node scripts/build-content.mjs

import { mkdir, readFile, writeFile, cp } from "node:fs/promises";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const source = path.resolve(root, "../30-Days-Of-Python");

const pad = (n) => String(n).padStart(2, "0");

// Fichiers sources pour chaque langue, indexés par numéro de jour.
const sources = {
  en: {
    dir: source,
    dayFiles: {
      1: "readme.md",
      2: "02_Day_Variables_builtin_functions/02_variables_builtin_functions.md",
      3: "03_Day_Operators/03_operators.md",
      4: "04_Day_Strings/04_strings.md",
      5: "05_Day_Lists/05_lists.md",
      6: "06_Day_Tuples/06_tuples.md",
      7: "07_Day_Sets/07_sets.md",
      8: "08_Day_Dictionaries/08_dictionaries.md",
      9: "09_Day_Conditionals/09_conditionals.md",
      10: "10_Day_Loops/10_loops.md",
      11: "11_Day_Functions/11_functions.md",
      12: "12_Day_Modules/12_modules.md",
      13: "13_Day_List_comprehension/13_list_comprehension.md",
      14: "14_Day_Higher_order_functions/14_higher_order_functions.md",
      15: "15_Day_Python_type_errors/15_python_type_errors.md",
      16: "16_Day_Python_date_time/16_python_datetime.md",
      17: "17_Day_Exception_handling/17_exception_handling.md",
      18: "18_Day_Regular_expressions/18_regular_expressions.md",
      19: "19_Day_File_handling/19_file_handling.md",
      20: "20_Day_Python_package_manager/20_python_package_manager.md",
      21: "21_Day_Classes_and_objects/21_classes_and_objects.md",
      22: "22_Day_Web_scraping/22_web_scraping.md",
      23: "23_Day_Virtual_environment/23_virtual_environment.md",
      24: "24_Day_Statistics/24_statistics.md",
      25: "25_Day_Pandas/25_pandas.md",
      26: "26_Day_Python_web/26_python_web.md",
      27: "27_Day_Python_with_mongodb/27_python_with_mongodb.md",
      28: "28_Day_API/28_API.md",
      29: "29_Day_Building_API/29_building_API.md",
      30: "30_Day_Conclusions/30_conclusions.md",
    },
  },
  fr: {
    dir: path.join(source, "French"),
    dayFiles: {
      1: "README_fr.md",
      2: "02_variables_builtin_functions_fr.md",
      3: "03_operators_fr.md",
      4: "04_strings_fr.md",
      5: "05_lists_fr.md",
      6: "06_tuples_fr.md",
      7: "07_sets_fr.md",
      8: "08_dictionaries_fr.md",
      9: "09_conditionals_fr.md",
      10: "10_loops_fr.md",
      11: "11_functions_fr.md",
      12: "12_modules_fr.md",
      13: "13_list_comprehension_fr.md",
      14: "14_higher_order_functions_fr.md",
      15: "15_python_type_errors_fr.md",
      16: "16_python_datetime_fr.md",
      17: "17_exception_handling_fr.md",
      18: "18_regular_expressions_fr.md",
      19: "19_file_handling_fr.md",
      20: "20_python_package_manager_fr.md",
      21: "21_classes_and_objects_fr.md",
      22: "22_web_scraping_fr.md",
      23: "23_virtual_environment_fr.md",
      24: "24_statistics_fr.md",
      25: "25_pandas_fr.md",
      26: "26_python_web_fr.md",
      27: "27_python_with_mongodb_fr.md",
      28: "28_API_fr.md",
      29: "29_building_API_fr.md",
      30: "30_conclusions_fr.md",
    },
  },
};

const isNavLine = (line) =>
  /^\s*\[<<\s*(Jour|Day)?\s*\d+/.test(line) ||
  /^\s*\[\s*(Aller au |Go to |Continue to )?(Jour|Day)\s*\d+\s*>>/.test(line) ||
  /^\s*\|\s*\[\s*(Jour|Day)\s*\d+\s*>>/.test(line);

const isTocLine = (line) => /^\s*-\s+\[[^\]]+\]\(#[^)]*\)/.test(line);

const isMainHeading = (line, day) =>
  new RegExp(`^#{1,2}\\s+(📘\\s+)?(Jour|Day)\\s*${day}\\b`).test(line);

function extractDay(raw, day) {
  const lines = raw.split("\n");

  // 1. Trouver le titre principal du jour
  const headingIdx = lines.findIndex((l) => isMainHeading(l, day));
  if (headingIdx === -1) {
    throw new Error(`Heading "Day/Jour ${day}" not found`);
  }

  // 2. Remonter pour inclure le sommaire (bloc de liste qui précède le titre)
  let start = headingIdx;
  let i = headingIdx - 1;
  while (i >= 0) {
    const line = lines[i];
    if (line.trim() === "" || isTocLine(line)) {
      if (isTocLine(line)) start = i;
      i--;
    } else {
      break;
    }
  }

  // 2 bis. Dans le sommaire, ignorer les entrées qui précèdent celle du jour
  // (ex : sommaire global du README avec "Devenir Sponsor")
  const dayEntry = new RegExp(`^\\s*- \\[(📘\\s+)?(Jour|Day)\\s*${day}\\b`);
  while (start < headingIdx && !dayEntry.test(lines[start])) {
    start++;
  }

  // 3. Couper la fin : lignes de navigation inter-jours
  let end = lines.length;
  for (let j = lines.length - 1; j >= headingIdx; j--) {
    const line = lines[j];
    if (line.trim() === "") continue;
    if (isNavLine(line)) {
      end = j;
    } else {
      break;
    }
  }

  return lines.slice(start, end).join("\n").trim();
}

function rewriteLinks(md, lang) {
  const home = lang === "fr" ? "/fr" : "/";
  const dayBase = lang === "fr" ? "/fr/jour/" : "/day/";
  return md
    // images : ../images/x.png, ./images/x.png, .././images/x.png
    //          -> /images/x.png
    .replace(/\((?:\.\.\/)*(?:\.\/)?images\//g, "(/images/")
    // liens relatifs vers un autre jour : ./04_strings_fr.md ou ../04_Day_.../x.md
    .replace(
      /\]\((?:\.\/|\.\.\/)(\d+)[^)]*\.md\)/g,
      (_, day) => `](${dayBase}${pad(parseInt(day, 10))})`
    )
    // autres fichiers md relatifs (ex: ../readme.md) -> accueil de la langue
    .replace(/\]\(\.\.?\/[^)]*\.md\)/g, `](${home})`);
}

async function main() {
  for (const [lang, { dir, dayFiles }] of Object.entries(sources)) {
    // Vérifier que tous les fichiers sources existent
    for (const [day, file] of Object.entries(dayFiles)) {
      if (!existsSync(path.join(dir, file))) {
        throw new Error(`[${lang}] Fichier source manquant pour le jour ${day} : ${file}`);
      }
    }

    const outDir = path.join(root, "content", lang);
    await mkdir(outDir, { recursive: true });

    for (const [day, file] of Object.entries(dayFiles)) {
      const n = parseInt(day, 10);
      const raw = await readFile(path.join(dir, file), "utf8");
      const content = rewriteLinks(extractDay(raw, n), lang);
      await writeFile(path.join(outDir, `${pad(n)}.md`), content + "\n", "utf8");
    }
    console.log(`[${lang}] 30 jours écrits dans content/${lang}/`);
  }

  // L'ancien dossier content/jours/ n'est plus utilisé
  const legacy = path.join(root, "content", "jours");
  if (existsSync(legacy)) {
    rmSync(legacy, { recursive: true });
    console.log("content/jours/ supprimé (remplacé par content/fr/)");
  }

  // Copier les images vers public/images
  if (existsSync(path.join(source, "images"))) {
    await cp(
      path.join(source, "images"),
      path.join(root, "public", "images"),
      { recursive: true }
    );
    console.log("Images copiées vers public/images/");
  }

  console.log("Terminé.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
