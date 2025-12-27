
cardsdocumentation.md
This documentation provides the implementation details for the Nexus Card Generation System v3.0 animations and special effects, categorized by elemental type.
Elemental Animation & Effects Manifest
1. Global Core Mechanics
All cards share a high-performance 3D tilt engine and a rotating border logic.
3D Tilt (TypeScript/React)
Calculates rotation based on cursor proximity to the card center.
code
Tsx
const handleMouseMove = (e: React.MouseEvent) => {
  if (!cardRef.current) return;
  const rect = cardRef.current.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  setTilt({ x: y * 25, y: -x * 25 });
};
Rotating Border (CSS)
code
CSS
@keyframes rotate-border { 
  from { transform: rotate(0deg); } 
  to { transform: rotate(360deg); } 
}
/* Applied via conic-gradient on a ::before pseudo-element */
2. Element-Specific Effects
🔥 Fire (The Infernal Engine)
Combines three particle types with a "breathing" base glow.
Keyframes:
fire-pulse: Simulates the heat of a core (opacity 0.4 -> 0.7).
flame-wave: Complex wave physics for wispy flames (translateY -140px, scale 0.8, rotate -1deg).
ember-rise: Faster, linear rising for small ash particles.
Implementation (CSS):
code
CSS
.fire-glow-base {
  background: radial-gradient(ellipse at center, var(--c1), transparent 70%);
  animation: fire-pulse 5s infinite ease-in-out alternate;
  mix-blend-mode: screen;
}
⚡ Electric (The High-Voltage Pulse)
Focuses on rapid, jittery particles and "breathing" brightness.
Keyframes:
electric-particle: A sharp vertical descent (translateY 0 -> 20px) with vertical squashing (scaleY 1 -> 0.5).
Implementation (Logic):
Particles are spawned with extremely short durations (0.3s - 0.7s) to simulate electrical discharge.
code
CSS
.particle-electric {
  width: 2px;
  height: 10px;
  background: linear-gradient(to bottom, var(--c1), transparent);
  animation: electric-particle 0.5s linear infinite;
}
💧 Water (The Hydro-Fluidic System)
Utilizes organic "wobble" physics and surface tension simulations.
Keyframes:
bubble-rise-wobble: S-curve translation (translateX -5px -> 5px) while scaling up (1.0 -> 1.5).
bubble-burst-early: A rapid pop effect where the particle scales significantly (2.5x) and fades out quickly.
Implementation (CSS):
code
CSS
.particle-bubble {
  background: radial-gradient(120% 120% at 30% 30%, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(255, 255, 255, 0.1) 20%, 
    transparent 50%, 
    rgba(255, 255, 255, 0.4) 100%);
  mix-blend-mode: overlay;
}
👾 Alien (The Xenon-Morph Interface)
Uses non-linear "glitch" steps and organic morphing shapes.
Keyframes:
alien-bio-float: Floating that changes border-radius over time (50% -> 70/30 morph).
alien-artifact-glitch: Steps-based animation (steps(3)) that simulates a digital jump/rotation .
alien-morph: A 180-degree rotation combined with a scale pulse and border-radius distortion.
Implementation (CSS):
code
CSS
.particle-alien-glyph {
  border: 1px solid var(--c2);
  box-shadow: 0 0 4px var(--c1);
  transform: rotate(45deg);
  animation: alien-artifact-glitch 4s steps(3) infinite;
}
3. Rendering Integration
The CardPreview component uses a useMemo hook to calculate randomized start positions and delays for these particles, ensuring no two cards ever look exactly the same.
code
Tsx
const particles = useMemo(() => {
  return Array.from({ length: 25 }).map((_, i) => ({
    animationDelay: `-${Math.random() * 2}s`,
    left: `${Math.random() * 100}%`,
    // Element specific randoms...
  }));
}, [element]);