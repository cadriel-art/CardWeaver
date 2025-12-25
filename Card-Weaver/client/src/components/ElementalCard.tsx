import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import type { CardPalette, CardAnimations } from "@shared/schema";
import { clsx } from "clsx";

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
  fontFamily = 'Rajdhani',
}: ElementalCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-300, 300], [15, -15]);
  const rotateY = useTransform(x, [-300, 300], [-15, 15]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // Generate random particles based on element
  const [particles, setParticles] = useState<number[]>([]);
  useEffect(() => {
    setParticles(Array.from({ length: 15 }, (_, i) => i));
  }, [element]);

  // Dynamic Styles
  const cardStyle = {
    "--active-color-1": palette.color1,
    "--active-color-2": palette.color2,
    "--active-color-3": palette.color3,
    "--active-glow": palette.glow,
  } as React.CSSProperties;

  return (
    <div 
      className="perspective-1000 relative" 
      style={{ transform: `scale(${scale})` }}
    >
      <motion.div
        ref={cardRef}
        style={{ 
          rotateX, 
          rotateY, 
          ...cardStyle,
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: `${borderRadius}px`,
          fontFamily: fontFamily
        }}
        className="relative bg-[#12121a] transition-shadow duration-300"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* === CARD FRAME GRADIENT === */}
        <div 
          className="absolute inset-0 p-[3px] bg-gradient-to-br from-[var(--active-color-1)] to-[var(--active-color-2)]"
          style={{ borderRadius: `${borderRadius}px` }}
        >
          <div 
            className="w-full h-full bg-gradient-to-b from-[#1a1a24] to-[#12121a] overflow-hidden relative"
            style={{ borderRadius: `${borderRadius - 2}px` }}
          >
            
            {/* === ROTATING BORDER ANIMATION === */}
            {animations.borderRotation && (
              <div 
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ borderRadius: `${borderRadius}px` }}
              >
                <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent,var(--active-color-1),var(--active-color-2),transparent)] animate-[rotate-border_4s_linear_infinite]" />
                <div 
                  className="absolute inset-[3px] bg-[#1a1a24]" 
                  style={{ borderRadius: `${borderRadius - 2}px` }}
                />
              </div>
            )}

            {/* === GLOW ORBS & ELEMENT SPECIFIC EFFECTS === */}
            {animations.glowPulse && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={clsx("absolute w-[150px] h-[150px] -top-8 -right-8 rounded-full bg-[var(--active-color-2)] blur-[40px] opacity-60", element === 'fire' && 'animate-[fire-pulse-1_2s_ease-in-out_infinite]', element === 'water' && 'animate-[water-float-1_4s_ease-in-out_infinite]', element === 'alien' && 'animate-[alien-morph-1_3s_ease-in-out_infinite]')} />
                <div className={clsx("absolute w-[120px] h-[120px] -bottom-5 -left-5 rounded-full bg-[var(--active-color-1)] blur-[40px] opacity-60", element === 'fire' && 'animate-[fire-pulse-2_2.5s_ease-in-out_infinite]', element === 'water' && 'animate-[water-float-2_5s_ease-in-out_infinite]', element === 'alien' && 'animate-[alien-morph-2_4s_ease-in-out_infinite]')} />
                <div className={clsx("absolute w-[80px] h-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--active-color-3)] blur-[40px] opacity-60", element === 'fire' && 'animate-[fire-pulse-3_1.5s_ease-in-out_infinite]', element === 'water' && 'animate-[water-float-3_3.5s_ease-in-out_infinite]', element === 'alien' && 'animate-[alien-morph-3_2.5s_ease-in-out_infinite]')} />
                
                {/* Specific Element Effects */}
                {element === 'fire' && <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-[var(--active-glow)] to-transparent blur-md animate-[fire-wave-move_2s_ease-in-out_infinite]" />}
                
                {element === 'water' && (
                  <div className="absolute inset-0 overflow-hidden">
                     {[1,2,3].map(i => (
                       <div key={i} className="absolute border-2 border-[var(--active-color-1)] rounded-full opacity-0 animate-[ripple-expand_3s_ease-out_infinite]" style={{ left: `${20 + Math.random()*60}%`, top: `${20 + Math.random()*60}%`, animationDelay: `${i}s` }} />
                     ))}
                  </div>
                )}

                {element === 'alien' && (
                  <div className="absolute top-1/2 left-1/2 w-[100px] h-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,transparent_30%,var(--active-glow)_50%,transparent_90%)] animate-[portal-spin_8s_linear_infinite]">
                    <div className="absolute inset-[-10px] border border-transparent border-t-[var(--active-color-2)] border-b-[var(--active-color-3)] rounded-full animate-[portal-ring_3s_linear_infinite]" />
                  </div>
                )}
              </div>
            )}

            {/* === PARTICLES === */}
            {animations.particles && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((_, i) => (
                  <div 
                    key={i} 
                    className={clsx(
                      "absolute",
                      element === 'electric' && "w-[2px] h-[10px] bg-gradient-to-b from-[var(--active-color-1)] to-transparent animate-[electric-particle_0.5s_linear_infinite]",
                      element === 'fire' && "w-[4px] h-[4px] bg-[var(--active-color-2)] rounded-full bottom-0 animate-[ember-rise_3s_ease-out_infinite]",
                      element === 'water' && "border border-[var(--active-color-2)] rounded-full bg-white/10 animate-[bubble-rise_4s_ease-in-out_infinite]",
                      element === 'alien' && "w-[6px] h-[6px] bg-[var(--active-color-2)] rounded-full animate-[spore-float_5s_ease-in-out_infinite]"
                    )}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: element === 'electric' ? `${Math.random() * 100}%` : undefined,
                      animationDelay: `${Math.random() * 5}s`,
                      animationDuration: element === 'fire' ? `${2 + Math.random() * 2}s` : undefined,
                      width: element === 'water' ? `${5 + Math.random() * 15}px` : undefined,
                      height: element === 'water' ? `var(--width)` : undefined // hack to make circle
                    }}
                  />
                ))}
              </div>
            )}

            {/* === FILTER LAYER (Border Glow) === */}
            <div 
              className={clsx(
                "absolute inset-0 border-[3px] border-[var(--active-color-1)] shadow-[0_0_20px_var(--active-glow),inset_0_0_20px_var(--active-glow)] transition-all duration-500",
                element === 'alien' && "animate-[alien-border-shift_3s_ease-in-out_infinite]"
              )}
              style={{ borderRadius: `${borderRadius}px` }}
            />

            {/* === CHROMATIC LAYER === */}
            {animations.chromatic && (
              <div 
                className="absolute inset-0 animate-[chromatic-shift_2s_ease-in-out_infinite] pointer-events-none" 
                style={{ borderRadius: `${borderRadius}px` }}
              />
            )}

            {/* === CONTENT === */}
            <div className="absolute inset-0 p-[30px] flex flex-col text-[#fafafa] z-10 pointer-events-none">
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
