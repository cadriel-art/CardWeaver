import fs from "fs";
import path from "path";

const projectRoot = path.resolve(".");
const mdPath = path.join(projectRoot, "elemental_card_generator_v3.md");
const outDir = path.join(projectRoot, "client", "src", "data");
const outPath = path.join(outDir, "paletteCatalog.ts");

if (!fs.existsSync(mdPath)) {
  console.error("Cannot find palette reference at", mdPath);
  process.exit(1);
}

const rawMd = fs.readFileSync(mdPath, "utf8");
const palettesSectionStart = rawMd.indexOf("## 🎨 COMPLETE COLOR PALETTES");
const palettesSectionEnd = rawMd.indexOf("## 🔧 CSS VARIABLES");

if (palettesSectionStart === -1 || palettesSectionEnd === -1) {
  console.error("Unable to locate palette section in reference file");
  process.exit(1);
}

const palettesSection = rawMd
  .slice(palettesSectionStart, palettesSectionEnd)
  .replace(/\r/g, "");

const categoryBlocks = palettesSection
  .split(/###\s+/)
  .slice(1); // drop intro before first category

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const hexToRgba = (hex, alpha = 0.45) => {
  if (!hex) return `rgba(255, 255, 255, ${alpha})`;
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  const intVal = parseInt(clean, 16);
  const r = (intVal >> 16) & 255;
  const g = (intVal >> 8) & 255;
  const b = intVal & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const categories = [];

for (const block of categoryBlocks) {
  const [headerLine, ...rest] = block.split("\n");
  const categoryName = headerLine.trim();
  const body = rest.join("\n");
  const paletteRegex = /\*\*(.+?)\*\*\s*```[\s\S]*?```/g;
  const palettes = [];
  let match;
  while ((match = paletteRegex.exec(body))) {
    const paletteName = match[1].trim();
    const codeBlockMatch = match[0].match(/```[\s\S]*?```/);
    if (!codeBlockMatch) continue;
    const hexMatches = codeBlockMatch[0].match(/#[0-9a-fA-F]{3,6}/g) || [];
    if (!hexMatches.length) continue;
    const swatches = hexMatches.map((hex) => hex.toLowerCase());
    const midIndex = Math.floor(swatches.length / 2);
    const cardPalette = {
      color1: swatches[0],
      color2: swatches[midIndex] || swatches[0],
      color3: swatches[swatches.length - 1] || swatches[0],
      glow: hexToRgba(swatches[1] || swatches[0], 0.45),
    };
    palettes.push({
      id: `${slugify(categoryName)}-${slugify(paletteName)}`,
      name: paletteName,
      swatches,
      cardPalette,
    });
  }
  if (palettes.length) {
    categories.push({
      name: categoryName,
      palettes,
    });
  }
}

if (!categories.length) {
  console.error("No palettes parsed. Aborting.");
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const fileHeader = `// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.\n// Generated from elemental_card_generator_v3.md via scripts/generatePaletteCatalog.mjs\n\nimport type { CardPalette } from "@shared/schema";\n\nexport interface PaletteDefinition {\n  id: string;\n  name: string;\n  swatches: string[];\n  cardPalette: CardPalette;\n}\n\nexport interface PaletteCategory {\n  name: string;\n  palettes: PaletteDefinition[];\n}\n\nexport const paletteCatalog: PaletteCategory[] = `;

const fileFooter = `;\n\nexport const paletteIndex = paletteCatalog.flatMap((category) =>\n  category.palettes.map((palette) => ({ ...palette, category: category.name }))\n);\n\nexport function findPaletteById(id: string) {\n  return paletteIndex.find((entry) => entry.id === id) || null;\n}\n`;

const formattedData = JSON.stringify(categories, null, 2)
  .replace(/"([^\"]+)":/g, " $1:")
  .replace(/"#/g, "\"#")
  .replace(/\\"/g, '"');

const fileContents = `${fileHeader}${formattedData}${fileFooter}`;

fs.writeFileSync(outPath, fileContents + "\n", "utf8");

console.log(`Generated palette catalog with ${categories.length} categories.`);
