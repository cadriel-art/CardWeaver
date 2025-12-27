import { useRef, useEffect, useState, useMemo, type ReactNode } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import type { CardPalette, CardAnimations, CardGradients, CardShadows } from "@shared/schema";
import { clsx } from "clsx";
import { useParticleGenerator } from "@/hooks/useParticleGenerator";
import { resolveElementVariant } from "@/utils/elementParticles";

export interface CardBackgroundLayer {
  url: string;
  overlay: number;
  position: "center" | "top" | "bottom" | "left" | "right";
}

type GlowTriple = [string, string, string];

interface ParticleDescriptor {
  key: string;
  className: string;
  style: React.CSSProperties;
}

interface ElementEffect {
  glow: GlowTriple;
  overlays: ReactNode | null;
  particles: ParticleDescriptor[];
}

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export interface HoverSettings {
  scale: number;
  rotate: number;
  lift: number;
  glow: number;
  speed: number;
  tilt3d: boolean;
}

interface ElementalCardProps {
  element: string; // 'fire', 'water', 'alien', 'electric', etc.
  palette: CardPalette;
  animations: CardAnimations;
  title: string;
  description: string;
  category: string;
  appType: string;
  tags: string[];
  scale?: number;
  width?: number;
  height?: number;
  borderRadius?: number;
  fontFamily?: string;
  backgroundImage?: CardBackgroundLayer | null;
  backgroundGradient?: CardGradients;
  hoverSettings?: HoverSettings;
  shadows?: CardShadows;
  layout?: 'vertical' | 'horizontal';
  spacing?: { padding: number; gap: number };
}

export function ElementalCard({
  element,
  palette,
  animations,
  title,
  description,
  category,
  appType,
  tags,
  scale = 1,
  width = 380,
  height = 480,
  borderRadius = 20,
  fontFamily,
  backgroundImage,
  backgroundGradient,
  hoverSettings,
  shadows,
  layout = 'vertical',
  spacing = { padding: 30, gap: 12 },
}: ElementalCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useTransform(y, [-300, 300], [15, -15]);
  const rotateY = useTransform(x, [-300, 300], [-15, 15]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current || !hoverSettings?.tilt3d) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }

  const visualElement = resolveElementVariant(element);

  const effectConfig = useMemo<ElementEffect>(() => {
    const randomFor = (idx: number, offset = 0) =>
      seededRandom(idx * 13.37 + offset + element.length * 7.13);

    const createParticles = (
      count: number,
      className: string,
      styleBuilder: (idx: number) => React.CSSProperties,
    ) =>
      Array.from({ length: count }).map((_, idx) => ({
        key: `${element}-particle-${idx}`,
        className,
        style: styleBuilder(idx),
      }));

    const defaultParticles = createParticles(
      12,
      "w-[4px] h-[4px] bg-white/20 rounded-full animate-[chromatic-shift_3s_ease-in-out_infinite]",
      (idx) => ({
        left: `${randomFor(idx) * 100}%`,
        top: `${randomFor(idx, 2) * 100}%`,
        animationDelay: `${randomFor(idx, 3) * 3}s`,
      }),
    );

    const baseGlow: GlowTriple = ["", "", ""];

    switch (visualElement) {
      case "fire":
        return {
          glow: [
            "animate-[fire-pulse-1_2s_ease-in-out_infinite]",
            "animate-[fire-pulse-2_2.5s_ease-in-out_infinite]",
            "animate-[fire-pulse-3_1.5s_ease-in-out_infinite]",
          ],
          overlays: (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-[var(--active-glow)] via-transparent to-transparent blur-xl animate-[fire-wave-move_2s_ease-in-out_infinite]" />
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_bottom,var(--active-color-2),rgba(0,0,0,0))]" />
            </div>
          ),
          particles: createParticles(
            20,
            "w-[4px] h-[4px] bg-[var(--active-color-2)] rounded-full animate-[ember-rise_3.2s_ease-out_infinite]",
            (idx) => ({
              left: `${randomFor(idx) * 100}%`,
              bottom: `${randomFor(idx, 5) * 10}%`,
              animationDelay: `${randomFor(idx, 1) * 2}s`,
              animationDuration: `${2 + randomFor(idx, 4) * 2}s`,
            }),
          ),
        };
      case "water":
        return {
          glow: [
            "animate-[water-float-1_4s_ease-in-out_infinite]",
            "animate-[water-float-2_5s_ease-in-out_infinite]",
            "animate-[water-float-3_3.5s_ease-in-out_infinite]",
          ],
          overlays: (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div
                  key={`water-ripple-${i}`}
                  className="absolute border-2 border-[var(--active-color-1)] rounded-full opacity-0 animate-[ripple-expand_3.5s_ease-out_infinite]"
                  style={{
                    left: `${20 + randomFor(i, 1) * 60}%`,
                    top: `${20 + randomFor(i, 2) * 60}%`,
                    animationDelay: `${i * 0.8}s`,
                  }}
                />
              ))}
              <div className="absolute inset-x-0 top-1/3 h-[90px] bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-60 animate-[water-float-2-enhanced_6s_ease-in-out_infinite]" />
            </div>
          ),
          particles: createParticles(
            18,
            "rounded-full border border-[var(--active-color-2)] bg-white/10 animate-[bubble-rise_4s_ease-in-out_infinite]",
            (idx) => {
              const size = 6 + randomFor(idx) * 18;
              return {
                left: `${randomFor(idx, 4) * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${randomFor(idx, 6) * 3}s`,
              };
            },
          ),
        };
      case "electric":
        return {
          glow: [
            "animate-[chromatic-shift_1.5s_linear_infinite]",
            "animate-[electric-particle_0.8s_linear_infinite]",
            "animate-[chromatic-shift_2.2s_linear_infinite]",
          ],
          overlays: (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,var(--active-color-1),transparent)]" />
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={`bolt-${idx}`}
                  className="absolute w-px h-full bg-gradient-to-b from-transparent via-[var(--active-color-1)] to-transparent opacity-70 animate-[electric-particle_0.6s_linear_infinite]"
                  style={{
                    left: `${15 + randomFor(idx, 1) * 70}%`,
                    animationDelay: `${randomFor(idx, 2) * 0.8}s`,
                  }}
                />
              ))}
            </div>
          ),
          particles: createParticles(
            22,
            "w-[2px] h-[14px] bg-gradient-to-b from-[var(--active-color-1)] to-transparent animate-[electric-particle_0.6s_linear_infinite]",
            (idx) => ({
              left: `${randomFor(idx) * 100}%`,
              top: `${randomFor(idx, 2) * 100}%`,
              animationDelay: `${randomFor(idx, 3) * 0.7}s`,
            }),
          ),
        };
      case "alien":
        return {
          glow: [
            "animate-[alien-morph-1_3s_ease-in-out_infinite]",
            "animate-[alien-morph-2_4s_ease-in-out_infinite]",
            "animate-[alien-morph-3_2.5s_ease-in-out_infinite]",
          ],
          overlays: (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 w-[110px] h-[110px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,transparent_30%,var(--active-glow)_50%,transparent_90%)] animate-[portal-spin_8s_linear_infinite]">
                <div className="absolute inset-[-12px] border border-transparent border-t-[var(--active-color-2)] border-b-[var(--active-color-3)] rounded-full animate-[portal-ring_3s_linear_infinite]" />
              </div>
            </div>
          ),
          particles: createParticles(
            18,
            "w-[6px] h-[6px] bg-[var(--active-color-2)] rounded-full animate-[spore-float_5s_ease-in-out_infinite]",
            (idx) => ({
              left: `${randomFor(idx) * 100}%`,
              animationDelay: `${randomFor(idx, 5) * 5}s`,
            }),
          ),
        };
      case "earth":
        return {
          glow: [
            "animate-[earth-aurora-1_4s_ease-in-out_infinite]",
            "animate-[earth-aurora-2_5.2s_ease-in-out_infinite]",
            "animate-[earth-aurora-3_4.6s_ease-in-out_infinite]",
          ],
          overlays: (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_bottom,var(--active-color-1),transparent)]" />
              <div className="absolute inset-x-6 bottom-6 h-24 bg-gradient-to-t from-[var(--active-color-3)]/40 via-transparent to-transparent blur-3xl animate-[earth-bloom_6s_ease-in-out_infinite]" />
            </div>
          ),
          particles: [],
        };
      case "shadow":
        return {
          glow: [
            "animate-[shadow-vein-1_4s_ease-in-out_infinite]",
            "animate-[shadow-vein-2_5s_ease-in-out_infinite]",
            "animate-[shadow-vein-3_6s_ease-in-out_infinite]",
          ],
          overlays: (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle,var(--active-color-3)/15,transparent_60%)]" />
              <div className="absolute inset-0 mix-blend-screen opacity-40 animate-[shadow-mist_5s_ease-in-out_infinite]" />
            </div>
          ),
          particles: [],
        };
      case "cosmic":
        return {
          glow: [
            "animate-[cosmic-core-1_2.4s_linear_infinite]",
            "animate-[cosmic-core-2_3.2s_linear_infinite]",
            "animate-[cosmic-core-3_3.8s_linear_infinite]",
          ],
          overlays: (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,var(--active-color-1),transparent)]" />
              <div className="absolute inset-6 border border-[var(--active-color-2)]/40 rounded-[40%] animate-[cosmic-grid_6s_linear_infinite]" />
            </div>
          ),
          particles: [],
        };
      case "ice":
        return {
          glow: [
            "animate-[ice-wave-1_4.2s_ease-in-out_infinite]",
            "animate-[ice-wave-2_5.3s_ease-in-out_infinite]",
            "animate-[ice-wave-3_3.4s_ease-in-out_infinite]",
          ],
          overlays: (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_top,var(--active-color-1),transparent)]" />
              <div className="absolute inset-4 border border-white/10 rounded-[48%] blur-xl animate-[ice-ring_5s_linear_infinite]" />
            </div>
          ),
          particles: [],
        };
      default:
        return {
          glow: baseGlow,
          overlays: null,
          particles: defaultParticles,
        };
    }
  }, [visualElement, element]);

  const { particles } = useParticleGenerator(element);

  const { glow: glowTriple, overlays, particles: defaultParticles } = effectConfig;
  const [glowOne, glowTwo, glowThree] = glowTriple;

  // Dynamic Styles
  const cardStyle = {
    "--active-color-1": palette.color1,
    "--active-color-2": palette.color2,
    "--active-color-3": palette.color3,
    "--active-glow": palette.glow,
    "--card-color-1": palette.color1,
    "--card-color-2": palette.color2,
    "--card-color-3": palette.color3,
  } as React.CSSProperties;

  const backgroundImageStyle = backgroundGradient ? (
    backgroundGradient.type === 'linear' ? `linear-gradient(${backgroundGradient.angle}deg, ${palette.color1}, ${palette.color2}, ${palette.color3})` :
    backgroundGradient.type === 'radial' ? `radial-gradient(circle, ${palette.color1}, ${palette.color2}, ${palette.color3})` :
    `conic-gradient(from ${backgroundGradient.angle}deg, ${palette.color1}, ${palette.color2}, ${palette.color3})`
  ) : backgroundImage ? `url(${backgroundImage.url})` : undefined;

  const hoverScale = (hoverSettings?.scale ?? 105) / 100;
  const hoverLift = hoverSettings?.lift ?? 8;
  const hoverRotate = hoverSettings?.rotate ?? 0;
  const hoverGlow = hoverSettings?.glow ?? 20;
  const hoverSpeed = hoverSettings?.speed ?? 3;
  const frameWidth = shadows?.frameWidth ?? 3;

  const containerStyle: React.CSSProperties = {
    transform: isHovered
      ? `translateY(-${hoverLift}px) scale(${scale * hoverScale}) rotate(${hoverRotate}deg)`
      : `translateY(0) scale(${scale}) rotate(0deg)`,
    transition: `transform ${Math.max(hoverSpeed / 10, 0.1)}s cubic-bezier(.03,.98,.52,.99)`,
  };

  const glowShadow = isHovered
    ? `0 25px 60px rgba(0,0,0,0.4), 0 0 ${hoverGlow}px var(--active-glow)`
    : "0 15px 45px rgba(0,0,0,0.35)";

  let shadowStr = glowShadow;
  if (shadows?.outer) shadowStr += `, 0 0 ${shadows.blur}px rgba(0,0,0,0.5)`;
  if (shadows?.inset) shadowStr += `, inset 0 0 ${shadows.blur}px rgba(0,0,0,0.5)`;

  const padding = spacing.padding;

  return (
    <div 
      className="perspective-1000 relative" 
      style={containerStyle}
    >
      <motion.div
        ref={cardRef}
        style={{ 
          rotateX, 
          rotateY, 
          ...cardStyle,
          backgroundImage: backgroundImageStyle,
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: `${borderRadius}px`,
          fontFamily: fontFamily
        }}
        className="relative bg-[#12121a] transition-shadow duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          boxShadow: shadowStr,
        }}
      >
        {/* === CARD FRAME GRADIENT === */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[var(--active-color-1)] to-[var(--active-color-2)]"
          style={{ borderRadius: `${borderRadius}px`, padding: `${frameWidth}px` }}
        >
          <div 
            className="w-full h-full bg-gradient-to-b from-[#1a1a24] to-[#12121a] overflow-hidden relative"
            style={{ borderRadius: `${Math.max(borderRadius - frameWidth, 0)}px` }}
          >
            {backgroundImage?.url && !backgroundGradient && (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-90"
                  style={{
                    backgroundImage: `url(${backgroundImage.url})`,
                    backgroundPosition: backgroundImage.position,
                    borderRadius: `${Math.max(borderRadius - frameWidth, 0)}px`,
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: `rgba(0,0,0,${(backgroundImage.overlay ?? 50) / 100})`,
                    borderRadius: `${Math.max(borderRadius - frameWidth, 0)}px`,
                  }}
                />
              </>
            )}
            
            {/* === ROTATING BORDER ANIMATION === */}
            {animations.borderRotation && (
              <div 
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ borderRadius: `${borderRadius}px` }}
              >
                <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent,var(--active-color-1),var(--active-color-2),transparent)] animate-[rotate-border_4s_linear_infinite]" />
                <div 
                  className="absolute inset-[3px] bg-[#1a1a24]" 
                  style={{ borderRadius: `${Math.max(borderRadius - frameWidth, 0)}px`, inset: `${frameWidth}px` }}
                />
              </div>
            )}

            {/* === GLOW ORBS & ELEMENT SPECIFIC EFFECTS === */}
            {animations.glowPulse && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={clsx("absolute w-[150px] h-[150px] -top-8 -right-8 rounded-full bg-[var(--active-color-2)] blur-[40px] opacity-60", glowOne)} />
                <div className={clsx("absolute w-[120px] h-[120px] -bottom-5 -left-5 rounded-full bg-[var(--active-color-1)] blur-[40px] opacity-60", glowTwo)} />
                <div className={clsx("absolute w-[80px] h-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--active-color-3)] blur-[40px] opacity-60", glowThree)} />

                {overlays}
              </div>
            )}

            {/* === CUSTOM PARTICLES (External Specs) === */}
            <div className="element-particles">
              {particles.map((p: any, i: number) => (
                <div key={`${p.className}-${i}`} className={p.className} style={p.style} />
              ))}
            </div>

            {/* === DEFAULT PARTICLES === */}
            {animations.particles && particles.length === 0 && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {defaultParticles.map((particle) => (
                  <div key={particle.key} className={clsx("absolute", particle.className)} style={particle.style} />
                ))}
              </div>
            )}

            {/* === FILTER LAYER (Border Glow) === */}
            <div 
              className={clsx(
                "absolute inset-0 border-solid border-[var(--active-color-1)] shadow-[0_0_20px_var(--active-glow),inset_0_0_20px_var(--active-glow)] transition-all duration-500",
                element === 'alien' && "animate-[alien-border-shift_3s_ease-in-out_infinite]"
              )}
              style={{ borderRadius: `${borderRadius}px`, borderWidth: `${frameWidth}px` }}
            />

            {/* === CHROMATIC LAYER === */}
            {animations.chromatic && (
              <div 
                className="absolute inset-0 animate-[chromatic-shift_2s_ease-in-out_infinite] pointer-events-none" 
                style={{ borderRadius: `${borderRadius}px` }}
              />
            )}

            {/* === CONTENT === */}
            <div className={clsx("absolute inset-0 flex text-[#fafafa] z-10 pointer-events-none", layout === 'horizontal' ? 'flex-row items-center' : 'flex-col')} style={{ padding: `${padding}px` }}>
              <div className="flex flex-col gap-3 flex-1">
                <div className="bg-[var(--active-glow)] border border-[var(--active-color-1)] rounded-[20px] px-3 py-1.5 w-fit text-[10px] font-mono font-medium uppercase tracking-widest text-[var(--active-color-1)]">
                  {category}
                </div>
                <div className="text-[13px] font-medium text-[var(--active-color-1)]">
                  {appType}
                </div>
                <h3 className="text-2xl font-bold leading-tight mt-auto shadow-black drop-shadow-md" style={{ fontFamily }}>
                  {title}
                </h3>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent my-4" />

              <div className="flex flex-col gap-2.5">
                <p className="text-sm text-white/70 leading-relaxed" style={{ fontFamily }}>
                  {description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map(tag => (
                    <span key={tag} className="bg-[var(--active-glow)] border border-[var(--active-color-1)] px-2.5 py-1 rounded-[4px] font-mono text-[10px] text-[var(--active-color-2)] uppercase">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
