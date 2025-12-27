planning.md


Here’s a CardWeaver-native roadmap to incorporate every inspiring element from the provided “Elemental Card Generator v3,” organized so we can tackle it in meaningful phases and keep our current stack/style consistent.

---

### Phase 1 – Structural UX Upgrades
1. **Multi-view layout:**  
   - Top nav tabs: `Generator • Vault • Export`.  
   - Hook existing Editor (generator), Gallery (vault), Export (JSON + future formats) sections into tabbed panels.  
   - Add hero block with “CardWeaver – Phase/Version” messaging and grid background overlay.

2. **Preview header + quick actions:**  
   - Display card dimensions/owner label on preview.  
   - Floating action strip for `Save`, `Save as Template`, `Export JSON`.  
   - Keep animations + neon styling aligned with current design tokens.

3. **History controls:**  
   - Local undo/redo stack for editor state (limit ~20 states).  
   - Buttons near nav following snippet’s `↶ / ↷` style with tooltip for hotkeys.

---

### Phase 2 – Editor Panel Refactor
4. **Accordion sections with badges:**  
   - Replace plain scroll with collapsible blocks: `Dimensions`, `Image`, `Hover FX`, `Typography`, `Elements & Palette`, `Gradient`, `Shadows`, `Animations`, `Content`, `Layout`.  
   - Use our Neon cards but add small “NEW” badges where appropriate.

5. **Dimensions + Presets:**  
   - Sliders paired with numeric inputs.  
   - Preset buttons (Vertical, Horizontal, Compact, Square) to set width/height pairs.

6. **Background image tooling:**  
   - Drag/drop upload zone with preview, plus URL field.  
   - Overlay opacity slider and position chips (top/center/bottom).  
   - “Clear Image” action.

7. **Hover effect controls:**  
   - Sliders for scale, rotate, lift, glow, speed.  
   - Toggle for 3D tilt (ties to preview card).  
   - Extend card component props to support these states.

---

### Phase 3 – Visual Styling & Palette Enhancements
8. **Element palette grid:**  
   - Scrollable palette cards showing 3 color swatches + label.  
   - Inline color pickers for fine tuning each channel with live hex readout.

9. **Gradient + shadows:**  
   - Gradient type chips (linear/radial/conic) with angle slider.  
   - Shadow toggles (outer/inset) + blur slider tied to card filter layer.

10. **Animation toggles:**  
    - Switch rows for border rotation, glow pulse, particles, chromatic shift.  
    - Per-effect speed slider (reuse existing card animation infrastructure where possible).

---

### Phase 4 – Content & Layout Tools
11. **Content block:**  
    - Styled inputs for category/type/title/description/tags similar to snippet.  
    - Tag input persists as comma-separated list with chips preview.

12. **Layout controls:**  
    - Buttons for vertical vs horizontal content layout.  
    - Padding slider to adjust card interior spacing.

13. **Owner presets & filter chips:**  
    - Keep our existing owner filter but render as chip row like snippet.

---

### Phase 5 – Vault & Export Experience
14. **Vault redesign:**  
    - Split saved cards into “Templates” (flagged) and “Archives”.  
    - Cards show miniature preview (scaled `<ElementalCard>`) plus actions: `Restore`, `Export`, `Delete`.  
    - Add “Save as Template” path to store with `tpl: true`.

15. **Export view:**  
    - Framework tabs (initially `JSON`, `React`, `Vanilla CSS`).  
    - Sub-tabs for Full/Component/Styles (even if some are placeholders).  
    - Copy button with success state; show code in scrollable panel.

---

### Phase 6 – Micro-interactions & Polish
16. **Toasts + badges:**  
    - Uniform toast component triggered on save/import/export.  
    - “New” badges on sections we just added.

17. **Particles/grid background enhancements:**  
    - Introduce optional layer referencing snippet’s subtle effects (respect performance).

18. **Keyboard shortcuts & tooltips:**  
    - e.g., `Ctrl+S` to save, `Ctrl+Z/Y` for undo/redo, with hints in UI.

---

### Implementation Approach
- Incremental commits per phase to keep diff manageable.  
- Bridge new state (image, hover, gradient settings) through shared schema if they need persistence; otherwise keep client-side first.  
- Reuse existing Tailwind/neon tokens; avoid copying snippet’s fonts wholesale—adapt to our combination (Rajdhani + neon gradients).  
- Add necessary types in `Card` interface, update storage if we persist new fields later.  
- Expand README to document new controls when implemented.  

