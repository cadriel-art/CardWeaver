import type {
  Card,
  CardPalette,
  CardHoverSettings,
  CardGradients,
  CardBackgroundLayer,
  CardShadows,
  CardSpacing,
  CardAnimations,
} from "@shared/schema";

type RequiredHover = Required<CardHoverSettings>;

const DEFAULT_HOVER: RequiredHover = {
  scale: 105,
  rotate: 0,
  lift: 8,
  glow: 20,
  speed: 3,
  tilt3d: true,
};

const DEFAULT_SPACING: CardSpacing = {
  padding: 30,
  gap: 12,
};

type StyleVariableMap = Record<string, string>;

type ParticleDescriptor = {
  left: string;
  top: string;
  size: string;
  delay: string;
  duration: string;
};

type ExportContext = {
  palette: CardPalette;
  hover: RequiredHover;
  spacing: CardSpacing;
  gradient: string;
  tags: string[];
  owner: string;
  layoutClass: string;
  animations: ExportAnimationFlags;
  particleDescriptors: ParticleDescriptor[];
  shellStyleMap: StyleVariableMap;
  backgroundLayer: (CardBackgroundLayer & { overlayOpacity: number }) | null;
};

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const getHoverSettings = (hover?: CardHoverSettings | null): RequiredHover => ({
  scale: hover?.scale ?? DEFAULT_HOVER.scale,
  rotate: hover?.rotate ?? DEFAULT_HOVER.rotate,
  lift: hover?.lift ?? DEFAULT_HOVER.lift,
  glow: hover?.glow ?? DEFAULT_HOVER.glow,
  speed: hover?.speed ?? DEFAULT_HOVER.speed,
  tilt3d: hover?.tilt3d ?? DEFAULT_HOVER.tilt3d,
});

const getSpacing = (spacing?: CardSpacing): CardSpacing => ({
  padding: spacing?.padding ?? DEFAULT_SPACING.padding,
  gap: spacing?.gap ?? DEFAULT_SPACING.gap,
});

const getFrameWidth = (shadows?: CardShadows | null) => shadows?.frameWidth ?? 3;

const toGradientString = (palette: CardPalette, gradients?: CardGradients | null) => {
  if (!gradients) {
    return `linear-gradient(135deg, ${palette.color1}, ${palette.color2}, ${palette.color3})`;
  }

  switch (gradients.type) {
    case "radial":
      return `radial-gradient(circle, ${palette.color1}, ${palette.color2}, ${palette.color3})`;
    case "conic":
      return `conic-gradient(from ${gradients.angle}deg, ${palette.color1}, ${palette.color2}, ${palette.color3})`;
    default:
      return `linear-gradient(${gradients.angle}deg, ${palette.color1}, ${palette.color2}, ${palette.color3})`;
  }
};

const sanitizeTags = (tags?: string[] | null) =>
  (tags ?? [])
    .map((tag) => tag.trim())
    .filter(Boolean);

const buildParticleDescriptors = (element: string, count = 16): ParticleDescriptor[] =>
  Array.from({ length: count }).map((_, idx) => {
    const seed = idx + element.length;
    const left = `${(seededRandom(seed) * 100).toFixed(2)}%`;
    const top = `${(seededRandom(seed * 1.37) * 100).toFixed(2)}%`;
    const size = `${(2 + seededRandom(seed * 1.91) * 6).toFixed(2)}px`;
    const delay = `${(seededRandom(seed * 2.17) * 4).toFixed(2)}s`;
    const duration = `${(3 + seededRandom(seed * 2.73) * 4).toFixed(2)}s`;
    return { left, top, size, delay, duration };
  });

const particleDescriptorsToMarkup = (descriptors: ParticleDescriptor[]) =>
  descriptors
    .map(
      (descriptor) =>
        `          <span class="particle-dot" style="left:${descriptor.left};top:${descriptor.top};width:${descriptor.size};height:${descriptor.size};animation-delay:${descriptor.delay};animation-duration:${descriptor.duration};"></span>`,
    )
    .join("\n");

const baseShadowString = (palette: CardPalette, shadows?: CardShadows | null) => {
  const outer = shadows?.outer ? `, 0 0 ${shadows.blur ?? 12}px rgba(0,0,0,0.5)` : "";
  const inset = shadows?.inset ? `, inset 0 0 ${shadows.blur ?? 12}px rgba(0,0,0,0.35)` : "";
  return `0 15px 45px rgba(0,0,0,0.35)${outer}${inset}`.trim();
};

const hoverShadowString = (palette: CardPalette, hover: RequiredHover) =>
  `0 25px 60px rgba(0,0,0,0.4), 0 0 ${hover.glow}px ${palette.glow}`;

const mediaLayers = (background?: CardBackgroundLayer | null, gradients?: CardGradients | null) => {
  if (!background || gradients) return "";

  const overlay = ((background.overlay ?? 60) / 100).toFixed(2);

  return `
        <div
          class="card-media"
          style="background-image:url('${background.url}');background-position:${background.position};"
        ></div>
        <div
          class="card-media-overlay"
          style="opacity:${overlay};"
        ></div>`;
};

type ExportAnimationFlags = {
  borderRotation: boolean;
  glowPulse: boolean;
  chromatic: boolean;
  particles: boolean;
};

const getAnimations = (card: Card): ExportAnimationFlags => {
  const defaults: ExportAnimationFlags = {
    borderRotation: true,
    glowPulse: true,
    chromatic: false,
    particles: true,
  };

  const animations = (card.animations as Partial<CardAnimations> | undefined) ?? {};

  return {
    borderRotation: animations.borderRotation ?? defaults.borderRotation,
    glowPulse: animations.glowPulse ?? defaults.glowPulse,
    chromatic: animations.chromatic ?? defaults.chromatic,
    particles: animations.particles ?? defaults.particles,
  };
};

const buildShellStyleMap = (
  card: Card,
  palette: CardPalette,
  hover: RequiredHover,
  spacing: CardSpacing,
): StyleVariableMap => {
  const width = card.width ?? 380;
  const height = card.height ?? 480;
  const radius = card.borderRadius ?? 20;
  const frameWidth = getFrameWidth(card.shadows);
  const baseShadow = baseShadowString(palette, card.shadows);
  const hoverShadow = hoverShadowString(palette, hover);
  const scale = (hover.scale ?? 105) / 100;
  const hoverSpeed = Math.max(hover.speed / 10, 0.12);
  return {
    "--card-width": `${width}px`,
    "--card-height": `${height}px`,
    "--card-radius": `${radius}px`,
    "--frame-width": `${frameWidth}px`,
    "--card-padding": `${spacing.padding}px`,
    "--card-gap": `${spacing.gap}px`,
    "--hover-scale": `${scale}`,
    "--hover-lift": `${hover.lift}px`,
    "--hover-rotate": `${hover.rotate}deg`,
    "--hover-glow": `${hover.glow}px`,
    "--hover-speed": `${hoverSpeed}s`,
    "--base-shadow": baseShadow,
    "--hover-shadow": hoverShadow,
    "--color-1": palette.color1,
    "--color-2": palette.color2,
    "--color-3": palette.color3,
    "--color-glow": palette.glow,
    "--tilt-x": "0deg",
    "--tilt-y": "0deg",
    "--owner-font": `${card.fontFamily ?? "Rajdhani"}, sans-serif`,
  };
};

const stringifyStyleMap = (map: StyleVariableMap) =>
  Object.entries(map)
    .map(([key, value]) => `${key}:${value}`)
    .join("; ");

const buildExportContext = (card: Card): ExportContext => {
  const palette = card.palette as CardPalette;
  const hover = getHoverSettings(card.hover);
  const spacing = getSpacing(card.spacing);
  const gradient = toGradientString(palette, card.gradients);
  const tags = sanitizeTags(card.tags);
  const owner = card.owner || "guest";
  const layoutClass = card.layout === "horizontal" ? "layout-horizontal" : "layout-vertical";
  const animations = getAnimations(card);
  const particleDescriptors = animations.particles ? buildParticleDescriptors(card.element) : [];
  const shellStyleMap = buildShellStyleMap(card, palette, hover, spacing);
  const backgroundLayer =
    card.background && !card.gradients
      ? {
          ...card.background,
          overlayOpacity: (card.background.overlay ?? 60) / 100,
        }
      : null;
  return {
    palette,
    hover,
    spacing,
    gradient,
    tags,
    owner,
    layoutClass,
    animations,
    particleDescriptors,
    shellStyleMap,
    backgroundLayer,
  };
};

export function generateHTML(card: Card): string {
  const context = buildExportContext(card);

  return `<!-- Exported Elemental Card for ${card.element.toUpperCase()} -->
<div class="export-stage" data-element="${card.element}">
  <div class="export-card-shell ${context.layoutClass}" style="${stringifyStyleMap(context.shellStyleMap)}">
    <div class="card-frame">
      <div class="card-surface" style="background-image:${context.gradient};">
${mediaLayers(card.background, card.gradients)}
        ${
          context.animations.borderRotation
            ? `<div class="border-ring">
          <div class="border-ring__inner"></div>
        </div>`
            : ""
        }
        ${context.animations.glowPulse ? `<div class="glow-field"></div>` : ""}
        ${context.animations.chromatic ? `<div class="chromatic-layer"></div>` : ""}
        <div class="particle-field">
${particleDescriptorsToMarkup(context.particleDescriptors)}
        </div>
        <div class="card-content">
          <div class="content-primary">
            <span class="card-badge">${card.category}</span>
            <span class="card-app">${card.appType}</span>
            <h2 class="card-title">${card.title}</h2>
          </div>
          <div class="divider-line"></div>
          <div class="content-secondary">
            <p class="card-description">${card.description}</p>
            <div class="card-tags">
              ${
                context.tags.length
                  ? context.tags.map((tag) => `            <span class="tag-chip">#${tag}</span>`).join("\n")
                  : `            <span class="tag-chip">#unclassified</span>`
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="card-meta">
    <span>${card.width ?? 380}px × ${card.height ?? 480}px</span>
    <span>Owner · ${context.owner}</span>
  </div>
</div>`;
}

export function generateCSS(card: Card): string {
  const fontFamily = card.fontFamily ?? "Rajdhani, 'Space Grotesk', sans-serif";

  return `/* === Elemental Card Export Styles === */
:root {
  color: #f8f8ff;
}

body {
  min-height: 100vh;
  background: radial-gradient(circle at top, #1c1c28, #050509);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  font-family: ${fontFamily};
}

.export-stage {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.card-meta {
  font-family: ${fontFamily};
  font-size: 12px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  gap: 16px;
}

.export-card-shell {
  width: var(--card-width);
  height: var(--card-height);
  border-radius: var(--card-radius);
  background: #12121a;
  box-shadow: var(--base-shadow);
  transition:
    transform var(--hover-speed) cubic-bezier(.03,.98,.52,.99),
    box-shadow var(--hover-speed) cubic-bezier(.03,.98,.52,.99);
  transform:
    translateY(var(--hover-translate, 0px))
    scale(var(--hover-scale-base, 1))
    rotate(var(--hover-rotate))
    rotateX(var(--tilt-x))
    rotateY(var(--tilt-y));
  perspective: 1200px;
  position: relative;
}

.export-card-shell:hover {
  --hover-translate: calc(-1 * var(--hover-lift));
  --hover-scale-base: var(--hover-scale);
  box-shadow: var(--hover-shadow);
}

.layout-horizontal .card-content {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.card-frame {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: var(--card-radius);
  padding: var(--frame-width);
  background: linear-gradient(135deg, var(--color-1), var(--color-2), var(--color-3));
}

.card-surface {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: calc(var(--card-radius) - var(--frame-width));
  overflow: hidden;
  background-size: cover;
  background-position: center;
}

.card-media,
.card-media-overlay,
.border-ring,
.glow-field,
.chromatic-layer,
.particle-field {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.card-media {
  background-size: cover;
  background-repeat: no-repeat;
  filter: saturate(1.05);
}

.card-media-overlay {
  background: #050509;
}

.border-ring {
  inset: -50%;
  border-radius: 999px;
  background: conic-gradient(from 0deg, transparent, var(--color-1), var(--color-2), transparent);
  animation: rotate-border 4s linear infinite;
}

.border-ring__inner {
  position: absolute;
  inset: calc(50% - 3px);
  width: calc(var(--card-width) + 6px);
  height: calc(var(--card-height) + 6px);
  transform: translate(-50%, -50%);
  border-radius: calc(var(--card-radius) - var(--frame-width));
  background: rgba(10, 10, 18, 0.98);
}

.glow-field::before,
.glow-field::after {
  content: "";
  position: absolute;
  border-radius: 999px;
  filter: blur(40px);
  opacity: 0.5;
  animation: glow-pulse 3s ease-in-out infinite;
}

.glow-field::before {
  width: 160px;
  height: 160px;
  top: -40px;
  right: -40px;
  background: var(--color-2);
}

.glow-field::after {
  width: 140px;
  height: 140px;
  bottom: -30px;
  left: -30px;
  background: var(--color-1);
}

.chromatic-layer {
  background: linear-gradient(120deg, rgba(255,255,255,0.15), transparent, rgba(255,255,255,0.12));
  mix-blend-mode: screen;
  animation: chromatic-shift 2.6s ease-in-out infinite;
}

.particle-field {
  overflow: hidden;
}

.particle-dot {
  position: absolute;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255,255,255,0.8), rgba(255,255,255,0));
  opacity: 0.65;
  animation-name: particle-drift;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.card-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: var(--card-gap);
  padding: var(--card-padding);
  color: rgba(250, 250, 255, 0.95);
}

.content-primary,
.content-secondary {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.divider-line {
  height: 1px;
  width: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
}

.card-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.25);
  background: rgba(255,255,255,0.08);
  font-size: 10px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
}

.card-app {
  font-size: 12px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--color-1);
}

.card-title {
  font-size: clamp(28px, 4vw, 36px);
  margin: 0;
  text-transform: uppercase;
  background: linear-gradient(95deg, #fff, var(--color-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.card-description {
  font-size: 14px;
  line-height: 1.7;
  opacity: 0.85;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-chip {
  font-size: 11px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.04);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

@keyframes rotate-border {
  to { transform: rotate(360deg); }
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.45; transform: scale(0.9); }
  50% { opacity: 0.9; transform: scale(1.1); }
}

@keyframes chromatic-shift {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.35; }
}

@keyframes particle-drift {
  0% { transform: translateY(0px) scale(0.8); opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { transform: translateY(-60px) scale(1.2); opacity: 0; }
}`;
}

export function generateJavaScript(card: Card): string {
  const hover = getHoverSettings(card.hover);

  return `const cardShell = document.querySelector('.export-card-shell');
if (cardShell) {
  const enableTilt = ${hover.tilt3d ? "true" : "false"};
  if (enableTilt) {
    const handleTilt = (event) => {
      const rect = cardShell.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateY = (offsetX * 20).toFixed(2) + 'deg';
      const rotateX = (-offsetY * 20).toFixed(2) + 'deg';
      cardShell.style.setProperty('--tilt-x', rotateX);
      cardShell.style.setProperty('--tilt-y', rotateY);
    };

    cardShell.addEventListener('mousemove', handleTilt);
    cardShell.addEventListener('mouseleave', () => {
      cardShell.style.setProperty('--tilt-x', '0deg');
      cardShell.style.setProperty('--tilt-y', '0deg');
    });
  }
}`;
}

export function generateReactComponent(card: Card): string {
  const context = buildExportContext(card);
  const styleLiteral = JSON.stringify(context.shellStyleMap, null, 2);
  const particlesLiteral = JSON.stringify(context.particleDescriptors, null, 2);
  const tagsLiteral = JSON.stringify(context.tags, null, 2);
  const backgroundLiteral = JSON.stringify(context.backgroundLayer, null, 2);

  return `import React, { useState } from 'react';
import type { CSSProperties } from 'react';
import './ElementalCard.css';

type ParticleDescriptor = {
  left: string;
  top: string;
  size: string;
  delay: string;
  duration: string;
};

const baseStyle = ${styleLiteral};
const particles: ParticleDescriptor[] = ${particlesLiteral};
const tags = ${tagsLiteral};
const backgroundLayer = ${backgroundLiteral};

export const ElementalCard: React.FC = () => {
  const [tilt, setTilt] = useState({ x: baseStyle["--tilt-x"] || '0deg', y: baseStyle["--tilt-y"] || '0deg' });

  const shellStyle = {
    ...baseStyle,
    '--tilt-x': tilt.x,
    '--tilt-y': tilt.y,
  } as CSSProperties;

  const handleTilt = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: \`\${(-offsetY * 20).toFixed(2)}deg\`,
      y: \`\${(offsetX * 20).toFixed(2)}deg\`,
    });
  };

  return (
    <div className="export-stage" data-element="${card.element}">
      <div
        className="export-card-shell ${context.layoutClass}"
        style={shellStyle}
        onMouseMove={handleTilt}
        onMouseLeave={() => setTilt({ x: '0deg', y: '0deg' })}
      >
        <div className="card-frame">
          <div className="card-surface" style={{ backgroundImage: '${context.gradient}' }}>
            {backgroundLayer && (
              <>
                <div
                  className="card-media"
                  style={{
                    backgroundImage: \`url(\${backgroundLayer.url})\`,
                    backgroundPosition: backgroundLayer.position ?? 'center',
                  }}
                />
                <div className="card-media-overlay" style={{ opacity: backgroundLayer.overlayOpacity }} />
              </>
            )}

            <div className="particle-field">
              {particles.map((particle, idx) => (
                <span
                  key={idx}
                  className="particle-dot"
                  style={{
                    left: particle.left,
                    top: particle.top,
                    width: particle.size,
                    height: particle.size,
                    animationDelay: particle.delay,
                    animationDuration: particle.duration,
                  }}
                />
              ))}
            </div>

            <div className="card-content">
              <div className="content-primary">
                <span className="card-badge">${card.category}</span>
                <span className="card-app">${card.appType}</span>
                <h2 className="card-title">${card.title}</h2>
              </div>
              <div className="divider-line" />
              <div className="content-secondary">
                <p className="card-description">${card.description}</p>
                <div className="card-tags">
                  {tags.length > 0 ? (
                    tags.map((tag) => (
                      <span key={tag} className="tag-chip">
                        #{'${'}tag{'}'}
                      </span>
                    ))
                  ) : (
                    <span className="tag-chip">#unclassified</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-meta">
        <span>${card.width ?? 380}px × ${card.height ?? 480}px</span>
        <span>Owner · ${context.owner}</span>
      </div>
    </div>
  );
};`;
}

export function generateVueComponent(card: Card): string {
  const context = buildExportContext(card);
  const styleLiteral = JSON.stringify(context.shellStyleMap, null, 2);
  const particlesLiteral = JSON.stringify(context.particleDescriptors, null, 2);
  const tagsLiteral = JSON.stringify(context.tags, null, 2);
  const backgroundLiteral = JSON.stringify(context.backgroundLayer, null, 2);

  return `<template>
  <div class="export-stage" data-element="${card.element}">
    <div
      class="export-card-shell ${context.layoutClass}"
      :style="shellStyle"
      @mousemove="handleTilt"
      @mouseleave="resetTilt"
    >
      <div class="card-frame">
        <div class="card-surface" :style="surfaceStyle">
          <template v-if="backgroundLayer">
            <div
              class="card-media"
              :style="{
                backgroundImage: \`url(\${backgroundLayer.url})\`,
                backgroundPosition: backgroundLayer.position || 'center'
              }"
            />
            <div class="card-media-overlay" :style="{ opacity: backgroundLayer.overlayOpacity }" />
          </template>

          <div class="particle-field">
            <span
              v-for="(particle, index) in particles"
              :key="index"
              class="particle-dot"
              :style="{
                left: particle.left,
                top: particle.top,
                width: particle.size,
                height: particle.size,
                animationDelay: particle.delay,
                animationDuration: particle.duration
              }"
            />
          </div>

          <div class="card-content">
            <div class="content-primary">
              <span class="card-badge">${card.category}</span>
              <span class="card-app">${card.appType}</span>
              <h2 class="card-title">${card.title}</h2>
            </div>
            <div class="divider-line"></div>
            <div class="content-secondary">
              <p class="card-description">${card.description}</p>
              <div class="card-tags" v-if="tags.length">
                <span v-for="tag in tags" :key="tag" class="tag-chip">#{{ tag }}</span>
              </div>
              <div class="card-tags" v-else>
                <span class="tag-chip">#unclassified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-meta">
      <span>${card.width ?? 380}px × ${card.height ?? 480}px</span>
      <span>Owner · ${context.owner}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

type ParticleDescriptor = {
  left: string;
  top: string;
  size: string;
  delay: string;
  duration: string;
};

const shellStyle = reactive<Record<string, string>>(${styleLiteral});
const surfaceStyle = reactive<Record<string, string>>({ backgroundImage: '${context.gradient}' });
const particles: ParticleDescriptor[] = ${particlesLiteral};
const tags: string[] = ${tagsLiteral};
const backgroundLayer = ${backgroundLiteral};
const baseTilt = {
  x: shellStyle['--tilt-x'] ?? '0deg',
  y: shellStyle['--tilt-y'] ?? '0deg',
};

const handleTilt = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement | null;
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
  const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
  shellStyle['--tilt-x'] = \`\${(-offsetY * 20).toFixed(2)}deg\`;
  shellStyle['--tilt-y'] = \`\${(offsetX * 20).toFixed(2)}deg\`;
};

const resetTilt = () => {
  shellStyle['--tilt-x'] = baseTilt.x;
  shellStyle['--tilt-y'] = baseTilt.y;
};
</script>`;
}

export function generateSvelteComponent(card: Card): string {
  const context = buildExportContext(card);
  const styleLiteral = JSON.stringify(context.shellStyleMap, null, 2);
  const particlesLiteral = JSON.stringify(context.particleDescriptors, null, 2);
  const tagsLiteral = JSON.stringify(context.tags, null, 2);
  const backgroundLiteral = JSON.stringify(context.backgroundLayer, null, 2);

  return `<script lang="ts">
  type ParticleDescriptor = {
    left: string;
    top: string;
    size: string;
    delay: string;
    duration: string;
  };

  const baseStyle: Record<string, string> = ${styleLiteral};
  let tiltX = baseStyle['--tilt-x'] ?? '0deg';
  let tiltY = baseStyle['--tilt-y'] ?? '0deg';

  $: shellStyle = {
    ...baseStyle,
    '--tilt-x': tiltX,
    '--tilt-y': tiltY
  };

  const particles: ParticleDescriptor[] = ${particlesLiteral};
  const tags: string[] = ${tagsLiteral};
  const backgroundLayer = ${backgroundLiteral};

  const surfaceStyle = { backgroundImage: '${context.gradient}' };

  function handleTilt(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement | null;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
    tiltX = \`\${(-offsetY * 20).toFixed(2)}deg\`;
    tiltY = \`\${(offsetX * 20).toFixed(2)}deg\`;
  }

  function resetTilt() {
    tiltX = baseStyle['--tilt-x'] ?? '0deg';
    tiltY = baseStyle['--tilt-y'] ?? '0deg';
  }
</script>

<div class="export-stage" data-element="${card.element}">
  <div
    class="export-card-shell ${context.layoutClass}"
    style={shellStyle}
    on:mousemove={handleTilt}
    on:mouseleave={resetTilt}
  >
    <div class="card-frame">
      <div class="card-surface" style="background-image: ${context.gradient};">
        {#if backgroundLayer}
          <div
            class="card-media"
            style="background-image: url({backgroundLayer.url}); background-position: {backgroundLayer.position || 'center'};"
          ></div>
          <div
            class="card-media-overlay"
            style="opacity: {backgroundLayer.overlayOpacity};"
          ></div>
        {/if}

        <div class="particle-field">
          {#each particles as particle, idx}
            <span
              class="particle-dot"
              style="
                left: {particle.left};
                top: {particle.top};
                width: {particle.size};
                height: {particle.size};
                animation-delay: {particle.delay};
                animation-duration: {particle.duration};
              "
            ></span>
          {/each}
        </div>

        <div class="card-content">
          <div class="content-primary">
            <span class="card-badge">${card.category}</span>
            <span class="card-app">${card.appType}</span>
            <h2 class="card-title">${card.title}</h2>
          </div>
          <div class="divider-line"></div>
          <div class="content-secondary">
            <p class="card-description">${card.description}</p>
            {#if tags.length > 0}
              <div class="card-tags">
                {#each tags as tag}
                  <span class="tag-chip">#{tag}</span>
                {/each}
              </div>
            {:else}
              <div class="card-tags">
                <span class="tag-chip">#unclassified</span>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="card-meta">
    <span>${card.width ?? 380}px × ${card.height ?? 480}px</span>
    <span>Owner · ${context.owner}</span>
  </div>
</div>`;
}

export function generateFullComponent(card: Card): string {
  const html = generateHTML(card);
  const css = generateCSS(card);
  const js = generateJavaScript(card);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${card.title} - Elemental Card</title>
  <style>
${css}
  </style>
</head>
<body>
  
${html}

  <script>
${js}
  </script>
</body>
</html>`;
}

export function generateTailwindComponent(card: Card): string {
  const context = buildExportContext(card);
  const shellClass = context.layoutClass === "layout-horizontal" ? "flex-row" : "flex-col";
  const backgroundGradient = context.gradient.replace("linear-gradient", "bg-[linear-gradient");
  const particleMarkup = context.particleDescriptors
    .map(
      (descriptor, idx) =>
        `<span key="${idx}" class="absolute particle-dot block rounded-full opacity-70" style="left:${descriptor.left};top:${descriptor.top};width:${descriptor.size};height:${descriptor.size};animation-delay:${descriptor.delay};animation-duration:${descriptor.duration};"></span>`,
    )
    .join("\n          ");
  const tagsMarkup = context.tags.length
    ? context.tags.map((tag) => `<span class="tag-chip">${tag}</span>`).join("\n          ")
    : `<span class="tag-chip">#unclassified</span>`;
  const backgroundMedia = context.backgroundLayer
    ? `<div
            class="card-media absolute inset-0 bg-cover bg-center opacity-95"
            style="background-image:url('${context.backgroundLayer.url}');background-position:${context.backgroundLayer.position ?? "center"};"
          ></div>
          <div class="card-media-overlay absolute inset-0 bg-black/70" style="opacity:${context.backgroundLayer.overlayOpacity};"></div>`
    : "";

  return `<!-- Tailwind CSS Component -->
<div class="min-h-screen bg-neutral-950 flex flex-col items-center justify-center py-16 text-white">
  <div
    class="export-card-shell relative w-[${card.width ?? 380}px] h-[${card.height ?? 480}px] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-transform duration-500 hover:-translate-y-4 hover:scale-105"
    style="background: ${context.gradient};"
  >
    <div class="card-frame absolute inset-0 p-[var(--frame-width,3px)] rounded-[inherit] bg-gradient-to-br from-[var(--color-1,#FF71CE)] via-[var(--color-2,#FF006E)] to-[var(--color-3,#C77DFF)]">
      <div class="card-surface relative w-full h-full rounded-[inherit] overflow-hidden bg-gradient-to-b from-[#1a1a24] to-[#12121a]">
        ${backgroundMedia}
        <div class="particle-field absolute inset-0 overflow-hidden pointer-events-none">
          ${particleMarkup}
        </div>
        <div class="card-content relative z-10 flex ${shellClass} gap-6 h-full w-full px-[var(--card-padding,30px)] py-[var(--card-padding,30px)] font-[var(--owner-font,'Rajdhani')] text-sm text-white/90">
          <div class="flex flex-col gap-3 flex-1">
            <span class="card-badge inline-flex items-center justify-center px-3 py-1 text-[10px] tracking-[0.4em] uppercase rounded-full border border-white/25 bg-white/10">
              ${card.category}
            </span>
            <span class="card-app text-[11px] tracking-[0.3em] uppercase text-[var(--color-1,#FF71CE)]">
              ${card.appType}
            </span>
            <h2 class="card-title text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[var(--color-2,#FF006E)] to-white">
              ${card.title}
            </h2>
          </div>
          <div class="divider-line w-full h-px bg-gradient-to-r from-transparent via-white/25 to-transparent my-2" />
          <div class="flex flex-col gap-4 flex-1">
            <p class="card-description text-sm leading-relaxed text-white/70">
              ${card.description}
            </p>
            <div class="card-tags flex flex-wrap gap-2">
              ${tagsMarkup}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="card-meta mt-6 flex gap-8 text-xs tracking-[0.4em] uppercase text-white/60">
    <span>${card.width ?? 380}px × ${card.height ?? 480}px</span>
    <span>Owner · ${context.owner}</span>
  </div>
</div>`;
}
