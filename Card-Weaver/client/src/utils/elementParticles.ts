import type { CSSProperties } from "react";

export type ElementParticle = {
  className: string;
  style: CSSProperties;
};

const ELEMENT_VARIANT_MAP: Record<string, string> = {
  nature: "earth",
  tech: "cosmic",
  air: "ice",
  toxic: "shadow",
};

const asStyle = (style: CSSProperties): CSSProperties => style;

const PARTICLE_PRESETS: Record<string, ElementParticle[]> = {
  fire: [
    { className: "particle-fire-1", style: asStyle({ position: "absolute", width: "4px", height: "4px", left: "20%", top: "30%", opacity: 0.8, animation: "float-up 3s ease-in-out infinite", animationDelay: "0s" }) },
    { className: "particle-fire-2", style: asStyle({ position: "absolute", width: "3px", height: "3px", left: "70%", top: "60%", opacity: 0.6, animation: "float-up 2.5s ease-in-out infinite", animationDelay: "0.5s" }) },
    { className: "particle-fire-3", style: asStyle({ position: "absolute", width: "5px", height: "5px", left: "45%", top: "80%", opacity: 0.7, animation: "float-up 3.5s ease-in-out infinite", animationDelay: "1s" }) },
  ],
  water: [
    { className: "particle-water-1", style: asStyle({ position: "absolute", width: "6px", height: "6px", left: "25%", top: "40%", opacity: 0.5, animation: "float-down 4s ease-in-out infinite", animationDelay: "0s" }) },
    { className: "particle-water-2", style: asStyle({ position: "absolute", width: "4px", height: "4px", left: "65%", top: "20%", opacity: 0.6, animation: "float-down 3s ease-in-out infinite", animationDelay: "0.7s" }) },
  ],
  earth: [
    { className: "particle-earth-1", style: asStyle({ position: "absolute", width: "8px", height: "8px", left: "30%", top: "70%", opacity: 0.4, animation: "rotate 10s linear infinite" }) },
    { className: "particle-earth-2", style: asStyle({ position: "absolute", width: "6px", height: "6px", left: "60%", top: "30%", opacity: 0.5, animation: "rotate 8s linear infinite reverse" }) },
    { className: "particle-earth-3", style: asStyle({ position: "absolute", width: "10px", height: "10px", left: "45%", top: "45%", opacity: 0.6, animation: "pulse 5s ease-in-out infinite" }) },
  ],
  cosmic: [
    { className: "particle-cosmic-1", style: asStyle({ position: "absolute", width: "12px", height: "12px", left: "20%", top: "20%", opacity: 0.65, animation: "orbit 6s linear infinite" }) },
    { className: "particle-cosmic-2", style: asStyle({ position: "absolute", width: "8px", height: "8px", left: "70%", top: "30%", opacity: 0.5, animation: "orbit 8s linear infinite reverse" }) },
    { className: "particle-cosmic-3", style: asStyle({ position: "absolute", width: "6px", height: "6px", left: "50%", top: "65%", opacity: 0.5, animation: "twinkle 3s ease-in-out infinite" }) },
  ],
  ice: [
    { className: "particle-ice-1", style: asStyle({ position: "absolute", width: "14px", height: "2px", left: "25%", top: "10%", opacity: 0.4, animation: "drift-down 4s ease-in-out infinite" }) },
    { className: "particle-ice-2", style: asStyle({ position: "absolute", width: "18px", height: "3px", left: "65%", top: "35%", opacity: 0.45, animation: "drift-down 5s ease-in-out infinite" }) },
    { className: "particle-ice-3", style: asStyle({ position: "absolute", width: "10px", height: "2px", left: "45%", top: "70%", opacity: 0.35, animation: "drift-down 4.5s ease-in-out infinite" }) },
  ],
  shadow: [
    { className: "particle-shadow-1", style: asStyle({ position: "absolute", width: "40px", height: "40px", left: "10%", top: "50%", opacity: 0.25, animation: "shadow-pulse 5s ease-in-out infinite" }) },
    { className: "particle-shadow-2", style: asStyle({ position: "absolute", width: "60px", height: "60px", left: "60%", top: "20%", opacity: 0.15, animation: "shadow-pulse 6s ease-in-out infinite" }) },
    { className: "particle-shadow-3", style: asStyle({ position: "absolute", width: "30px", height: "30px", left: "40%", top: "70%", opacity: 0.2, animation: "shadow-pulse 4s ease-in-out infinite" }) },
  ],
  air: [
    { className: "particle-air-1", style: asStyle({ position: "absolute", width: "20px", height: "2px", left: "15%", top: "25%", opacity: 0.3, animation: "wind-blow 2s ease-in-out infinite" }) },
    { className: "particle-air-2", style: asStyle({ position: "absolute", width: "15px", height: "2px", left: "75%", top: "65%", opacity: 0.4, animation: "wind-blow 2.5s ease-in-out infinite" }) },
  ],
};

export const resolveElementVariant = (element: string): string => ELEMENT_VARIANT_MAP[element] ?? element;

export const getElementParticles = (element: string): ElementParticle[] => {
  const variant = resolveElementVariant(element);
  return PARTICLE_PRESETS[variant] ?? [];
};
