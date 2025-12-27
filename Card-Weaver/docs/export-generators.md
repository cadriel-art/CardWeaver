# Code Export Generators

This document explains how the HTML/CSS/JS generators work after the latest refactor and how to consume them outside the app.

## Shared Context Helpers

`client/src/utils/codeGenerator.ts` now builds an **export context** that mirrors the ElementalCard preview:

- Palette + gradients
- Hover physics (scale, lift, rotate, glow, speed)
- Layout + spacing + frame thickness
- Background imagery / overlay
- Particle descriptors (position, size, animation)
- Animation flags (border ring, glow field, chromatic layer)
- Owner metadata + sizing label

Every generator (HTML, CSS, JS, React, Vue, Svelte, Tailwind, Full) consumes that context so they all stay in sync.

## HTML / CSS / JS

```ts
import { generateHTML, generateCSS, generateJavaScript } from "@/utils/codeGenerator";
import type { Card } from "@shared/schema";

const html = generateHTML(card);
const css = generateCSS(card);
const js = generateJavaScript(card);
```

- **HTML**: produces the full export shell markup, including meta footer and card controls.
- **CSS**: contains the gradient background, keyframes, particle styles, and the same CSS variables used in the app.
- **JavaScript**: wires up the tilt interaction; it is a no-op if the card disables tilt.

> Tip: `generateFullComponent(card)` bundles all three into a standalone HTML file.

## React / Vue / Svelte / Tailwind

Each framework generator now renders the same card shell:

- Particle `<span>` elements are precomputed from the export context
- Optional imagery overlay is injected when the card has a background URL
- Layout automatically flips between vertical/horizontal
- Owner meta and dimensions render below the card

### Example (React)

```ts
import { generateReactComponent } from "@/utils/codeGenerator";
import fs from "node:fs";

const component = generateReactComponent(card);
fs.writeFileSync("ElementalCard.tsx", component);
```

The generated file already imports `./ElementalCard.css`. Copy the CSS from `generateCSS` or use your own port of those styles.

## Verification Script

Run `npm run test:generators` to execute `script/testGenerators.ts`. The script:

1. Creates a fixture `Card`
2. Executes all generators
3. Asserts that key strings (title, dimensions, particle markup, etc.) exist in the output

Use this script after making changes to the code generators to avoid regressions.
