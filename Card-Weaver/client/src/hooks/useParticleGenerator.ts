import { useMemo } from 'react';
import type { CSSProperties } from 'react';

interface Particle {
  className: string;
  position: CSSProperties['position'];
  width: string;
  height: string;
  left: string;
  top: string;
  bottom?: string;
  right?: string;
  opacity?: number;
  blur?: number;
  scale?: number;
  animation?: string;
  animationDelay?: string;
  animationDuration?: string;
}

export function useParticleGenerator(element: string) {
  const particles = useMemo(() => {
    switch (element) {
      case 'fire':
        return [
          { className: 'particle-fire-1', position: 'absolute' as const, width: '4px', height: '4px', left: '20%', top: '30%', opacity: 0.8, animation: 'float-up 3s ease-in-out infinite', animationDelay: '0s', animationDuration: '3s' },
          { className: 'particle-fire-2', position: 'absolute' as const, width: '3px', height: '3px', left: '70%', top: '60%', opacity: 0.6, animation: 'float-up 2.5s ease-in-out infinite', animationDelay: '0.5s', animationDuration: '2.5s' },
          { className: 'particle-fire-3', position: 'absolute' as const, width: '5px', height: '5px', left: '45%', top: '80%', opacity: 0.7, animation: 'float-up 3.5s ease-in-out infinite', animationDelay: '1s', animationDuration: '3.5s' },
        ];
      case 'water':
        return [
          { className: 'particle-water-1', position: 'absolute' as const, width: '6px', height: '6px', left: '25%', top: '40%', opacity: 0.5, animation: 'float-down 4s ease-in-out infinite', animationDelay: '0s', animationDuration: '4s' },
          { className: 'particle-water-2', position: 'absolute' as const, width: '4px', height: '4px', left: '65%', top: '20%', opacity: 0.6, animation: 'float-down 3s ease-in-out infinite', animationDelay: '0.7s', animationDuration: '3s' },
        ];
      case 'earth':
        return [
          { className: 'particle-earth-1', position: 'absolute' as const, width: '8px', height: '8px', left: '30%', top: '70%', opacity: 0.4, animation: 'rotate 10s linear infinite', animationDelay: '0s', animationDuration: '10s' },
          { className: 'particle-earth-2', position: 'absolute' as const, width: '6px', height: '6px', left: '60%', top: '30%', opacity: 0.5, animation: 'rotate 8s linear infinite reverse', animationDelay: '0s', animationDuration: '8s' },
          { className: 'particle-earth-3', position: 'absolute' as const, width: '10px', height: '10px', left: '45%', top: '45%', opacity: 0.6, animation: 'pulse 5s ease-in-out infinite', animationDelay: '0.4s', animationDuration: '5s' },
        ];
      case 'cosmic':
        return [
          { className: 'particle-cosmic-1', position: 'absolute' as const, width: '12px', height: '12px', left: '20%', top: '20%', opacity: 0.65, animation: 'orbit 6s linear infinite', animationDelay: '0s', animationDuration: '6s' },
          { className: 'particle-cosmic-2', position: 'absolute' as const, width: '8px', height: '8px', left: '70%', top: '30%', opacity: 0.5, animation: 'orbit 8s linear infinite reverse', animationDelay: '0.3s', animationDuration: '8s' },
          { className: 'particle-cosmic-3', position: 'absolute' as const, width: '6px', height: '6px', left: '50%', top: '65%', opacity: 0.5, animation: 'twinkle 3s ease-in-out infinite', animationDelay: '0.6s', animationDuration: '3s' },
        ];
      case 'ice':
        return [
          { className: 'particle-ice-1', position: 'absolute' as const, width: '14px', height: '2px', left: '25%', top: '10%', opacity: 0.4, animation: 'drift-down 4s ease-in-out infinite', animationDelay: '0s', animationDuration: '4s' },
          { className: 'particle-ice-2', position: 'absolute' as const, width: '18px', height: '3px', left: '65%', top: '35%', opacity: 0.45, animation: 'drift-down 5s ease-in-out infinite', animationDelay: '0.8s', animationDuration: '5s' },
          { className: 'particle-ice-3', position: 'absolute' as const, width: '10px', height: '2px', left: '45%', top: '70%', opacity: 0.35, animation: 'drift-down 4.5s ease-in-out infinite', animationDelay: '0.4s', animationDuration: '4.5s' },
        ];
      case 'shadow':
        return [
          { className: 'particle-shadow-1', position: 'absolute' as const, width: '40px', height: '40px', left: '10%', top: '50%', opacity: 0.25, animation: 'shadow-pulse 5s ease-in-out infinite', animationDelay: '0s', animationDuration: '5s' },
          { className: 'particle-shadow-2', position: 'absolute' as const, width: '60px', height: '60px', left: '60%', top: '20%', opacity: 0.15, animation: 'shadow-pulse 6s ease-in-out infinite', animationDelay: '0.5s', animationDuration: '6s' },
          { className: 'particle-shadow-3', position: 'absolute' as const, width: '30px', height: '30px', left: '40%', top: '70%', opacity: 0.2, animation: 'shadow-pulse 4s ease-in-out infinite', animationDelay: '1s', animationDuration: '4s' },
        ];
      case 'air':
        return [
          { className: 'particle-air-1', position: 'absolute' as const, width: '20px', height: '2px', left: '15%', top: '25%', opacity: 0.3, animation: 'wind-blow 2s ease-in-out infinite', animationDelay: '0s', animationDuration: '2s' },
          { className: 'particle-air-2', position: 'absolute' as const, width: '15px', height: '2px', left: '75%', top: '65%', opacity: 0.4, animation: 'wind-blow 2.5s ease-in-out infinite', animationDelay: '0.5s', animationDuration: '2.5s' },
        ];
      default:
        return [];
    }
  }, [element]);

  return { particles };
}
