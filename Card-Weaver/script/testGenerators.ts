import assert from "node:assert";
import {
  generateHTML,
  generateCSS,
  generateJavaScript,
  generateReactComponent,
  generateVueComponent,
  generateSvelteComponent,
  generateTailwindComponent,
  generateFullComponent,
} from "../client/src/utils/codeGenerator";
import type { Card } from "../shared/schema";

const fixtureCard: Card = {
  id: 1,
  title: "Nebula Warden",
  description: "Guardian construct forged from stellar alloys and quantum light.",
  category: "MYTHIC",
  appType: "AVATAR",
  tags: ["guardian", "stellar", "support"],
  element: "alien",
  palette: {
    color1: "#8a5cf6",
    color2: "#02d4ff",
    color3: "#f27dff",
    glow: "rgba(130, 239, 255, 0.65)",
  },
  animations: {
    borderRotation: true,
    glowPulse: true,
    chromatic: true,
    particles: true,
  },
  owner: "test-suite",
  width: 420,
  height: 520,
  borderRadius: 28,
  fontFamily: "Orbitron",
  spacing: { padding: 30, gap: 12 },
  background: {
    url: "https://images.unsplash.com/photo-1450849608880-6f787542c88a",
    overlay: 55,
    position: "center",
  },
  layout: "vertical",
  hover: {
    scale: 110,
    rotate: 2,
    lift: 14,
    glow: 28,
    speed: 4,
    tilt3d: true,
  },
  gradients: { type: "linear", angle: 25 },
  shadows: { outer: true, inset: false, blur: 12, frameWidth: 4 },
  tpl: false,
  createdAt: new Date(),
};

const html = generateHTML(fixtureCard);
assert(html.includes("Nebula Warden"), "HTML should include the title");
assert(html.includes("guardian"), "HTML should render tags");

const css = generateCSS(fixtureCard);
assert(css.includes(".export-card-shell"), "CSS should define export shell styles");

const js = generateJavaScript(fixtureCard);
assert(js.includes("document.querySelector('.export-card-shell')"), "JS should reference card shell selector");

const reactComponent = generateReactComponent(fixtureCard);
assert(reactComponent.includes("export-stage"), "React component should render export stage");

const vueComponent = generateVueComponent(fixtureCard);
assert(vueComponent.includes("<template>"), "Vue component should include template tag");

const svelteComponent = generateSvelteComponent(fixtureCard);
assert(svelteComponent.includes("<script lang=\"ts\">"), "Svelte component should include script block");

const tailwindComponent = generateTailwindComponent(fixtureCard);
assert(tailwindComponent.includes("Tailwind CSS Component"), "Tailwind generator should emit labelled snippet");

const fullComponent = generateFullComponent(fixtureCard);
assert(fullComponent.startsWith("<!DOCTYPE html>"), "Full component should be standalone HTML");

console.log("Generator smoke tests passed for fixture card.");
