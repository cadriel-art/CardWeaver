# Elemental Card Generator - Complete Effects & Colors Reference

## 🎬 CSS KEYFRAME ANIMATIONS

```css
/* Rotating animation - used for spinning border and alien ring */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Pulsing animation - used for glow orbs and fire wave */
@keyframes pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.2); }
}

/* Ripple animation - used for water element */
@keyframes ripple {
  0% { width: 0; height: 0; opacity: 0.8; }
  100% { width: 300px; height: 300px; opacity: 0; }
}
```

---

## 🔥 ELEMENT-SPECIFIC EFFECTS

### ⚡ Electric Element
```css
.electric-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(color-mix(in srgb, var(--c1) 5%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--c1) 5%, transparent) 1px, transparent 1px);
  background-size: 25px 25px;
}
```

### 🔥 Fire Element
```css
.fire-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(to top, color-mix(in srgb, var(--c1) 15%, transparent), transparent);
  animation: pulse 2s ease-in-out infinite;
}
```

### 💧 Water Element
```css
.water-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid color-mix(in srgb, var(--c1) 20%, transparent);
  border-radius: 50%;
  animation: ripple 3s ease-out infinite;
}

/* Second ripple with delay */
.water-ripple:nth-child(2) {
  animation-delay: 0.7s;
}
```

### 👽 Alien Element
```css
.alien-ring {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  border: 2px dotted color-mix(in srgb, var(--c1) 15%, transparent);
  border-radius: 50%;
  animation: rotate 10s linear infinite;
}
```

---

## ✨ CARD LAYER EFFECTS

### Animated Border (Spinning Gradient)
```css
.border-anim {
  position: absolute;
  inset: 0;
  overflow: hidden;
  padding: 2px;
  border-radius: 32px;
  pointer-events: none;
  z-index: 4;
}

.border-anim .spin {
  position: absolute;
  inset: -100%;
  background: conic-gradient(from 0deg, transparent, var(--c1), var(--c2), transparent 60%);
  animation: rotate 4s linear infinite;
}

.border-anim .mask {
  position: absolute;
  inset: 3px;
  background: #121217;
  border-radius: 29px;
}
```

### Glow Orbs (Pulsing Light Effects)
```css
.glow-wrap {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 5;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
}

.glow-1 {
  width: 200px;
  height: 200px;
  top: -50px;
  right: -50px;
  background: var(--c1);
  filter: blur(60px);
  opacity: 0.4;
  animation: pulse 3s ease-in-out infinite;
}

.glow-2 {
  width: 180px;
  height: 180px;
  bottom: -50px;
  left: -50px;
  background: var(--c2);
  filter: blur(60px);
  opacity: 0.3;
  animation: pulse 3s ease-in-out infinite 1s;
}
```

### Glass Effect (Gradient Border)
```css
.glass {
  position: absolute;
  inset: 0;
  padding: 2px;
  border-radius: 32px;
  background: linear-gradient(135deg, var(--c1), var(--c2));
  z-index: 3;
}

.glass-inner {
  width: 100%;
  height: 100%;
  background: #121217;
  border-radius: 30px;
}
```

### Filter Layer (Box Shadow Glow)
```css
.filter-layer {
  position: absolute;
  inset: 0;
  border-radius: 32px;
  box-shadow: 
    0 0 60px rgba(221, 132, 72, 0.5),
    inset 0 0 60px rgba(221, 132, 72, 0.5);
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 8;
}
```

### Card Hover Effect
```css
.card {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.4s ease;
}

.card:hover {
  transform: translateY(-12px) scale(1.02);
}
```

---

## 🎨 JAVASCRIPT PARTICLE SYSTEM

```javascript
function initParticles() {
  if (particleInt) clearInterval(particleInt);
  document.getElementById('particles').innerHTML = '';
  if (!S.fx.particles) return;
  
  particleInt = setInterval(function() {
    if (!S.fx.particles) return;
    var p = document.createElement('div');
    p.style.cssText = 'position:absolute;pointer-events:none;';
    
    // FIRE PARTICLES - Rising embers
    if (S.el === 'fire') {
      p.style.cssText += 'width:4px;height:4px;background:' + S.c2 + 
        ';border-radius:50%;box-shadow:0 0 6px ' + S.c2 + 
        ';left:' + Math.random() * 100 + '%;bottom:-5px;';
      document.getElementById('particles').appendChild(p);
      p.animate([
        { transform: 'translateY(0) scale(1)', opacity: 1 },
        { transform: 'translateY(-' + (150 + Math.random() * 100) + 'px) scale(0)', opacity: 0 }
      ], { duration: 1500 + Math.random() * 1000 }).onfinish = function() { p.remove() };
    }
    
    // WATER PARTICLES - Rising bubbles
    else if (S.el === 'water') {
      var sz = 3 + Math.random() * 4;
      p.style.cssText += 'width:' + sz + 'px;height:' + sz + 
        'px;border:1px solid rgba(255,255,255,.15);border-radius:50%;left:' + 
        Math.random() * 100 + '%;bottom:-10px;';
      document.getElementById('particles').appendChild(p);
      p.animate([
        { transform: 'translateY(0)', opacity: 0 },
        { transform: 'translateY(-200px)', opacity: 0.4 }
      ], { duration: 2500 }).onfinish = function() { p.remove() };
    }
    
    // ELECTRIC PARTICLES - Lightning strikes
    else if (S.el === 'electric') {
      p.style.cssText += 'width:2px;height:' + (12 + Math.random() * 20) + 
        'px;background:linear-gradient(to top,transparent,' + S.c1 + 
        ',transparent);left:' + Math.random() * 100 + '%;top:' + Math.random() * 100 + '%;';
      document.getElementById('particles').appendChild(p);
      p.animate([
        { opacity: 0, transform: 'scaleY(.5)' },
        { opacity: 1, transform: 'scaleY(1.2)', offset: 0.5 },
        { opacity: 0, transform: 'scaleY(.5)' }
      ], { duration: 250 }).onfinish = function() { p.remove() };
    }
    
    // ALIEN PARTICLES - Floating orbs
    else if (S.el === 'alien') {
      p.style.cssText += 'width:3px;height:3px;background:' + S.c3 + 
        ';border-radius:50%;box-shadow:0 0 6px ' + S.c3 + 
        ';left:' + Math.random() * 100 + '%;top:' + Math.random() * 100 + '%;';
      document.getElementById('particles').appendChild(p);
      p.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 0.6 },
        { transform: 'translate(' + (Math.random() * 40 - 20) + 'px,' + 
          (Math.random() * 40 - 20) + 'px) scale(0)', opacity: 0 }
      ], { duration: 2000 }).onfinish = function() { p.remove() };
    }
  }, 120);
}
```

---

## 🎨 COMPLETE COLOR PALETTES (77 Total, 20 Colors Each)

### SATIN (9 Palettes)

**Stellar Silk**
```
#f5e6e8 #e8d8dc #dcc8e0 #c8dce8 #f0dcc8 #e8d0cc #d0e4e8 #e8dce0 #f0e0d4 #d4c8dc 
#e0d4e8 #d8e0f0 #f0e8dc #dce8f0 #e8f0dc #d4e0e8 #e0e8d4 #f0dce8 #e8dcd4 #dcd4e0
```

**Vaporwave Silk**
```
#ff71ce #01cdfe #b967ff #fe53bb #08f7fe #f706cf #09fbd3 #ff00fe #00f0ff #8338ec 
#ff006e #fb5607 #ffbe0b #3a86ff #8ac926 #1982c4 #6a4c93 #ff595e #ffca3a #c77dff
```

**Ocean Silk**
```
#e0f2f7 #c8e8f0 #b0dde8 #98d2e0 #80c7d8 #68bcd0 #50b1c8 #38a6c0 #209bb8 #0890b0 
#0080a8 #0070a0 #006098 #005090 #004088 #003080 #002878 #002070 #001868 #001060
```

**Sunset Silk**
```
#fff5e6 #ffeacc #ffd9b3 #ffc999 #ffb880 #ffa766 #ff964d #ff8533 #ff751a #ff6400 
#ff5500 #ff4600 #ff3700 #ff2800 #ff1900 #ff0a00 #f00000 #e00000 #d00000 #c00000
```

**Lavender Silk**
```
#f5e6f8 #e8d9f0 #dccce8 #d0bfe0 #c4b2d8 #b8a5d0 #ac98c8 #a08bc0 #947eb8 #8871b0 
#7c64a8 #7057a0 #644a98 #583d90 #4c3088 #402380 #341678 #280970 #1c0068 #100060
```

**Rose Silk**
```
#ffe6f0 #ffd9e6 #ffccdc #ffbfd2 #ffb2c8 #ffa5be #ff98b4 #ff8baa #ff7ea0 #ff7196 
#ff648c #ff5782 #ff4a78 #ff3d6e #ff3064 #ff235a #ff1650 #ff0946 #f0003c #e00032
```

**Mint Silk**
```
#e6f8f0 #d9f0e6 #cce8dc #bfe0d2 #b2d8c8 #a5d0be #98c8b4 #8bc0aa #7eb8a0 #71b096 
#64a88c #57a082 #4a9878 #3d906e #308864 #23805a #167850 #097046 #00683c #006032
```

**Midnight Silk**
```
#2d3748 #374151 #4c5773 #2c3e5a #3d4e6c #1e3a5f #2e4563 #273c55 #3a4f68 #1f3854 
#1a2f47 #15263a #101d2d #0b1420 #060b13 #030609 #000306 #000103 #000001 #000000
```

**Shadow Silk**
```
#52525b #4b5563 #3f3f46 #525252 #57534e #475569 #44403c #4b5563 #3f3f46 #525252 
#3d3d3d #333333 #292929 #1f1f1f #151515 #0b0b0b #080808 #050505 #030303 #000000
```

---

### SATIN SHINE (6 Palettes)

**Satin Shine Gold**
```
#fffef9 #fffcf2 #fffaeb #fff8e4 #fff5dd #fff2d4 #ffefcb #ffecc2 #ffe9b9 #ffe5af 
#ffe1a5 #ffdd9b #ffd991 #ffd587 #ffd17d #ffcd73 #ffc969 #ffc55f #ffc155 #ffbd4b
```

**Satin Shine Silver**
```
#ffffff #f8f8f8 #f0f0f0 #e8e8e8 #e0e0e0 #d8d8d8 #d0d0d0 #c8c8c8 #c0c0c0 #b8b8b8 
#b0b0b0 #a8a8a8 #a0a0a0 #989898 #909090 #888888 #808080 #787878 #707070 #686868
```

**Satin Shine Rose Gold**
```
#fff5f5 #ffecec #ffe3e3 #ffdada #ffd1d1 #ffc8c8 #ffbfbf #ffb6b6 #ffadad #ffa4a4 
#ff9b9b #ff9292 #ff8989 #ff8080 #ff7777 #ff6e6e #ff6565 #ff5c5c #ff5353 #ff4a4a
```

**Satin Shine Copper**
```
#fff5ed #ffebdf #ffe1d1 #ffd7c3 #ffcdb5 #ffc3a7 #ffb999 #ffaf8b #ffa57d #ff9b6f 
#ff9161 #ff8753 #ff7d45 #ff7337 #ff6929 #ff5f1b #ff550d #f54b00 #e74100 #d93700
```

**Satin Shine Pearl**
```
#fffef9 #faf8f0 #f0ede1 #e6e2d7 #dcd7cd #d2ccc3 #c8c1b9 #beb6af #b4aba5 #aaa09b 
#a09591 #968a87 #8c7f7d #827473 #786969 #6e5e5f #645355 #5a484b #503d41 #463237
```

**Satin Shine Platinum**
```
#fafafa #f0f0f0 #e6e6e6 #dcdcdc #d2d2d2 #c8c8c8 #bebebe #b4b4b4 #aaaaaa #a0a0a0 
#969696 #8c8c8c #828282 #787878 #6e6e6e #646464 #5a5a5a #505050 #464646 #3c3c3c
```

---

### GLOWING (14 Palettes)

**Luminous Abyss**
```
#00ff9f #00ffea #00eaff #0095ff #7000ff #e600ff #ff00ae #ff0055 #ff3333 #ff6b35 
#ff9500 #ffbe00 #e6ff00 #9fff00 #00ff55 #00ff9f #00ffea #00eaff #0095ff #7000ff
```

**Neon Fusion**
```
#feca57 #fbc531 #badc58 #7bed9f #a8e6cf #48dbfb #3dc1d3 #00d2d3 #5f68ed #5352ed 
#6c5ce7 #a29bfe #fd79a8 #e84393 #d63031 #e17055 #fdcb6e #f6e58d #dfe6e9 #b2bec3
```

**Purple Spectrum**
```
#f3e8ff #e9d5ff #d8b4fe #c084fc #a855f7 #9333ea #7e22ce #6b21a8 #581c87 #3b0764 
#2e0854 #210644 #140434 #070224 #000014 #100024 #200034 #300044 #400054 #500064
```

**Fuchsia Blaze**
```
#fdf4ff #fae8ff #f5d0fe #f0abfc #e879f9 #d946ef #c026d3 #a21caf #86198f #701a75 
#5a155f #441049 #2e0b33 #18061d #020107 #120117 #220127 #320137 #420147 #520157
```

**Pink Radiance**
```
#fdf2f8 #fce7f3 #fbcfe8 #f9a8d4 #f472b6 #ec4899 #db2777 #be185d #9f1239 #831843 
#6d1339 #570e2f #410925 #2b041b #150011 #250021 #350031 #450041 #550051 #650061
```

**Rose Flare**
```
#fff1f2 #ffe4e6 #fecdd3 #fda4af #fb7185 #f43f5e #e11d48 #be123c #9f1239 #881337 
#721133 #5c0f2f #460d2b #300b27 #1a0923 #0a071f #1a0a2f #2a0d3f #3a104f #4a135f
```

**Cyan Electric**
```
#ecfeff #cffafe #a5f3fc #67e8f9 #22d3ee #06b6d4 #0891b2 #0e7490 #155e75 #164e63 
#134455 #103a47 #0d3039 #0a262b #071c1d #04120f #010801 #041213 #071c25 #0a2637
```

**Emerald Glow**
```
#ecfdf5 #d1fae5 #a7f3d0 #6ee7b7 #34d399 #10b981 #059669 #047857 #065f46 #064e3b 
#054030 #043225 #03241a #02160f #010804 #000000 #011106 #02220c #033312 #044418
```

**Amber Burst**
```
#fffbeb #fef3c7 #fde68a #fcd34d #fbbf24 #f59e0b #d97706 #b45309 #92400e #78350f 
#5e2a0c #441f09 #2a1406 #100903 #000000 #100800 #201000 #301800 #402000 #502800
```

**Milky Whites**
```
#ffffff #fefefe #fdfdfd #fcfcfc #fbfbfb #fafafa #f9f9f9 #f8f8f8 #f7f7f7 #f6f6f6 
#f5f5f5 #f4f4f4 #f3f3f3 #f2f2f2 #f1f1f1 #f0f0f0 #efefef #eeeeee #ededed #ececec
```

**Jewel Tones**
```
#9b2226 #ae2012 #bb3e03 #ca6702 #0a9396 #005f73 #1b4965 #2e86ab #8e24aa #6a1b9a 
#4a148c #311b92 #1a237e #0d47a1 #01579b #006064 #004d40 #1b5e20 #33691e #827717
```

**Cool Spectrum**
```
#e0f7fa #b2ebf2 #80deea #4dd0e1 #26c6da #00bcd4 #00acc1 #0097a7 #00838f #006064 
#004d40 #00695c #00796b #00897b #009688 #26a69a #4db6ac #80cbc4 #b2dfdb #e0f2f1
```

**Neon Pastels**
```
#ffadad #ffd6a5 #fdffb6 #caffbf #9bf6ff #a0c4ff #bdb2ff #ffc6ff #ff9ebb #ffb5e8 
#ff9cee #ff82f4 #ff68fa #f54eff #dc34ff #c21aff #a800ff #8e00e6 #7400cc #5a00b3
```

**Cyberpunk**
```
#00ffff #ff00ff #ffff00 #00ff00 #ff0080 #0080ff #ff3366 #66ffcc #ff1744 #00e676 
#f50057 #651fff #00b0ff #76ff03 #ffea00 #ff6d00 #ff3d00 #dd2c00 #d50000 #c51162
```

---

### HOLOGRAPHIC (8 Palettes)

**Holographic Spectrum**
```
#ff0080 #ff0099 #ff00b3 #ff00cc #e600ff #cc00ff #b300ff #9900ff #7f00ff #6600ff 
#4c00ff #3300ff #1a00ff #0000ff #001aff #0033ff #004dff #0066ff #0080ff #0099ff
```

**Holographic Warm**
```
#ff0000 #ff1a00 #ff3300 #ff4d00 #ff6600 #ff8000 #ff9900 #ffb300 #ffcc00 #ffe600 
#ffff00 #e6ff00 #ccff00 #b3ff00 #99ff00 #80ff00 #66ff00 #4dff00 #33ff00 #1aff00
```

**Holographic Cool**
```
#00ffff #00e6ff #00ccff #00b3ff #0099ff #0080ff #0066ff #004dff #0033ff #001aff 
#0000ff #1a00ff #3300ff #4d00ff #6600ff #8000ff #9900ff #b300ff #cc00ff #e600ff
```

**Holographic Pastel**
```
#ffccff #ffccee #ffccdd #ffddcc #ffeedd #ffffcc #eeffdd #ddffee #ccffff #ccddff 
#ccccff #ddccff #eeccff #ffccff #ffccee #ffccdd #ffddcc #ffeedd #ffffcc #eeffdd
```

**Holographic Neon**
```
#ff00ff #ff00cc #ff0099 #ff0066 #ff0033 #ff3300 #ff6600 #ff9900 #ffcc00 #ffff00 
#ccff00 #99ff00 #66ff00 #33ff00 #00ff33 #00ff66 #00ff99 #00ffcc #00ffff #00ccff
```

**Holographic Aurora**
```
#7fffd4 #40e0d0 #00ced1 #00bfff #1e90ff #4169e1 #6a5acd #7b68ee #9370db #ba55d3 
#da70d6 #ee82ee #ff00ff #ff1493 #ff69b4 #ffb6c1 #ffc0cb #ffe4e1 #fff0f5 #ffffff
```

**Prismatic Shimmer**
```
#ff0000 #ff4000 #ff8000 #ffbf00 #ffff00 #bfff00 #80ff00 #40ff00 #00ff00 #00ff40 
#00ff80 #00ffbf #00ffff #00bfff #0080ff #0040ff #0000ff #4000ff #8000ff #bf00ff
```

**Spectrum Border**
```
#ff0000 #ff7700 #ffff00 #00ff00 #00ffff #0000ff #8b00ff #ff00ff #ff0077 #ffffff 
#000000 #ff0000 #ff7700 #ffff00 #00ff00 #00ffff #0000ff #8b00ff #ff00ff #ff0077
```

---

### GLASS (6 Palettes)

**Frosted Glass Blue**
```
#f0f9ff #e0f2fe #bae6fd #7dd3fc #38bdf8 #0ea5e9 #0284c7 #0369a1 #075985 #0c4a6e 
#083b57 #042c40 #001d29 #000e12 #000000 #000e12 #001d29 #042c40 #083b57 #0c4a6e
```

**Frosted Glass Pink**
```
#fdf2f8 #fce7f3 #fbcfe8 #f9a8d4 #f472b6 #ec4899 #db2777 #be185d #9f1239 #831843 
#6d1339 #570e2f #410925 #2b041b #150011 #2b041b #410925 #570e2f #6d1339 #831843
```

**Frosted Glass Green**
```
#f0fdf4 #dcfce7 #bbf7d0 #86efac #4ade80 #22c55e #16a34a #15803d #166534 #14532d 
#104226 #0c311f #082018 #040f11 #00000a #040f11 #082018 #0c311f #104226 #14532d
```

**Frosted Glass Purple**
```
#faf5ff #f3e8ff #e9d5ff #d8b4fe #c084fc #a855f7 #9333ea #7e22ce #6b21a8 #581c87 
#48186f #381457 #28103f #180c27 #08080f #180c27 #28103f #381457 #48186f #581c87
```

**Frosted Glass Amber**
```
#fffbeb #fef3c7 #fde68a #fcd34d #fbbf24 #f59e0b #d97706 #b45309 #92400e #78350f 
#5e2a0c #441f09 #2a1406 #100903 #000000 #100903 #2a1406 #441f09 #5e2a0c #78350f
```

**Frosted Glass Smoke**
```
#fafafa #f4f4f5 #e4e4e7 #d4d4d8 #a1a1aa #71717a #52525b #3f3f46 #27272a #18181b 
#121214 #0c0c0d #060606 #030303 #000000 #030303 #060606 #0c0c0d #121214 #18181b
```

---

### METALLIC (6 Palettes)

**Metallic Gold**
```
#fff9e6 #fff3cc #ffeab3 #ffe199 #ffd700 #ffca28 #ffb300 #ff9800 #f57c00 #e65100 
#d54500 #c43900 #b32d00 #a22100 #911500 #800900 #6f0000 #5e0000 #4d0000 #3c0000
```

**Metallic Silver**
```
#f5f5f5 #eeeeee #e0e0e0 #d5d5d5 #c0c0c0 #b0b0b0 #a0a0a0 #909090 #808080 #707070 
#606060 #505050 #404040 #303030 #202020 #181818 #101010 #080808 #040404 #000000
```

**Metallic Bronze**
```
#ffefd5 #ffe4b5 #ffd59a #ffc68a #cd7f32 #b87333 #a0522d #8b4513 #704214 #5c3317 
#48241a #34151d #200620 #0c0023 #000026 #0c0023 #200620 #34151d #48241a #5c3317
```

**Metallic Copper**
```
#ffdab9 #ffccaa #ffb88c #ffa566 #ff9248 #f87217 #e67300 #d56500 #c35600 #b87333 
#9d622c #825125 #67401e #4c2f17 #311e10 #160d09 #000000 #160d09 #311e10 #4c2f17
```

**Metallic Rose Gold**
```
#fff5f5 #ffe4e9 #ffc9d9 #ffb3c6 #ff9cb3 #ff85a1 #f76f8e #e0577f #b76e79 #9c7c7c 
#817a7a #666878 #4b5676 #304474 #153272 #002070 #001058 #000040 #000028 #000010
```

**Metallic Platinum**
```
#fafafa #f5f5f5 #f0f0f0 #ebebeb #e5e4e2 #dcdcdc #d3d3d3 #c9c9c9 #bebebe #b4b4b4 
#aaaaaa #a0a0a0 #969696 #8c8c8c #828282 #787878 #6e6e6e #646464 #5a5a5a #505050
```

---

### SOLID (20 Palettes)

**Nebula Storm**
```
#55efc4 #81ecec #74b9ff #a29bfe #dfe6e9 #b2bec3 #6c5ce7 #0984e3 #00b894 #00cec9 
#fdcb6e #ffeaa7 #fab1a0 #ff7675 #fd79a8 #e84393 #d63031 #e17055 #00b894 #55efc4
```

**Solar Flare**
```
#f6e58d #ffbe76 #ff6b6b #95e1d3 #eaf2f8 #a3cbf1 #6ab04c #ee5a6f #f39c12 #f1c40f 
#e74c3c #9b59b6 #3498db #1abc9c #2ecc71 #e67e22 #d35400 #c0392b #8e44ad #2980b9
```

**Quantum Blue**
```
#00b8ff #9b59b6 #f39c12 #2ecc71 #5189b9 #3e7d9a #27ae60 #f1c40f #9b59b6 #00b8ff 
#3498db #1abc9c #e74c3c #e67e22 #16a085 #2980b9 #8e44ad #c0392b #d35400 #27ae60
```

**Cosmic Dawn**
```
#ffa8d5 #ffbe3d #ff6b81 #48dbfb #1dd1a1 #10ac84 #00d2d3 #ff6348 #ff9500 #ff006b 
#5f27cd #341f97 #2e86de #54a0ff #c8d6e5 #8395a7 #576574 #222f3e #ee5a6f #feca57
```

**Photon Burst**
```
#f1c40f #ff9f43 #ee5a6f #b2bec3 #576574 #222f3e #8395a7 #ff6348 #ff5e57 #ffa502 
#ff6b81 #ff4757 #3742fa #2ed573 #1e90ff #5352ed #70a1ff #7bed9f #eccc68 #ff7f50
```

**Plasma Vortex**
```
#fbc531 #badc58 #00d2d3 #f0a6ca #eb3b5a #a5436e #c56cf0 #0a7fb5 #7bed9f #ff9f1a 
#26de81 #fd9644 #fc5c65 #4b7bec #45aaf2 #2bcbba #a55eea #d1d8e0 #778ca3 #4b6584
```

**Stellar Drift**
```
#feca57 #ffa07a #6b88cf #48dbfb #a8e6cf #3dc1d3 #5189b9 #5f68ed #ee5a6f #feca57 
#ff9ff3 #ffeaa7 #dfe6e9 #74b9ff #55efc4 #81ecec #a29bfe #fd79a8 #fab1a0 #ff7675
```

**Aurora Core**
```
#ff6b6b #ff0000 #ffd93d #2ecc71 #17c0eb #17a2b8 #27ae60 #f39c12 #ff9f43 #ee5a6f 
#d63031 #e17055 #fdcb6e #00b894 #00cec9 #0984e3 #6c5ce7 #b2bec3 #636e72 #2d3436
```

**Prism Matrix**
```
#ffb8a3 #0abde3 #f1c40f #2ecc71 #c8f5dc #2d3436 #3dc1d3 #fffacd #2e86de #ff9f43 
#ee5a6f #5f27cd #10ac84 #00d2d3 #ff6348 #ff9500 #feca57 #48dbfb #1dd1a1 #ff6b81
```

**Void Walker**
```
#ffbe9d #ffd861 #7289ff #ff9a76 #d98fb4 #c44569 #ff6348 #6c5ce7 #ffd32a #ff9a76 
#2c3e50 #34495e #95a5a6 #bdc3c7 #ecf0f1 #1abc9c #16a085 #2ecc71 #27ae60 #3498db
```

**Pastel Dreams**
```
#ffd6e8 #ffe8d6 #fffacd #d6f5d6 #d6f5ff #e8d6ff #ffd6f5 #ffeaa7 #a8e6cf #74b9ff 
#ff9ff3 #f8c291 #f6b93b #e55039 #4a69bd #60a3bc #78e08f #b8e994 #f8a5c2 #f5cd79
```

**Monochrome**
```
#ffffff #f8f9fa #f1f3f5 #e9ecef #dee2e6 #ced4da #adb5bd #868e96 #495057 #343a40 
#212529 #1a1d20 #131517 #0c0e0f #050607 #000000 #050607 #0c0e0f #131517 #1a1d20
```

**Earth Tones**
```
#ddb892 #c9a66b #a47551 #8b5a3c #6f4518 #5c3d2e #8d6e63 #a1887f #bcaaa4 #d7ccc8 
#efebe9 #fafafa #d7ccc8 #bcaaa4 #a1887f #8d6e63 #795548 #6d4c41 #5d4037 #4e342e
```

**Ocean Depths**
```
#e0f2f7 #b3e5fc #81d4fa #4fc3f7 #29b6f6 #03a9f4 #039be5 #0288d1 #0277bd #01579b 
#014a8c #013d7d #01306e #00235f #001650 #000941 #000032 #000023 #000014 #000005
```

**Forest Canopy**
```
#e8f5e9 #c8e6c9 #a5d6a7 #81c784 #66bb6a #4caf50 #43a047 #388e3c #2e7d32 #1b5e20 
#165318 #114810 #0c3d08 #073200 #022700 #001c00 #001100 #000600 #000000 #000600
```

**Vintage Retro**
```
#e63946 #f77f00 #fcbf49 #eae2b7 #8ecae6 #219ebc #023047 #fb8500 #ffb703 #d62828 
#003049 #780000 #c1121f #fdf0d5 #669bbc #003049 #780000 #c1121f #fdf0d5 #669bbc
```

**Candy Pop**
```
#ff6b9d #fec5e5 #fff0f5 #c1ffd7 #b4f8c8 #fbe7c6 #ffaaa5 #ff8b94 #ffcfd2 #f1c0e8 
#cfbaf0 #a3c4f3 #90dbf4 #8eecf5 #98f5e1 #b9fbc0 #ffcf9f #ffd6a5 #ffadad #ffd6a5
```

**Corporate Blue**
```
#e3f2fd #bbdefb #90caf9 #64b5f6 #42a5f5 #2196f3 #1e88e5 #1976d2 #1565c0 #0d47a1 
#0b3d91 #093381 #072971 #051f61 #031551 #010b41 #000131 #000021 #000011 #000001
```

**Warm Spectrum**
```
#ffebee #ffcdd2 #ef9a9a #e57373 #ef5350 #f44336 #e53935 #d32f2f #ff6f00 #ff8f00 
#ffa000 #ffb300 #ffc107 #ffca28 #ffd54f #ffe082 #ffecb3 #fff8e1 #fff3e0 #ffe0b2
```

**Vaporwave**
```
#ff71ce #01cdfe #05ffa1 #b967ff #fffb96 #fe53bb #08f7fe #09fbd3 #f706cf #fe00fe 
#00ff00 #ff00ff #00ffff #ffff00 #ff0080 #80ff00 #0080ff #ff8000 #00ff80 #8000ff
```

**Dark Mode**
```
#1a1a2e #16213e #0f3460 #1e2a3a #1f2937 #111827 #0d1117 #161b22 #21262d #30363d 
#484f58 #6e7681 #8b949e #b1bac4 #c9d1d9 #e6edf3 #f0f6fc #ffffff #f0f6fc #e6edf3
```

---

### GRADIENT (5 Palettes)

**Neon Horizons**
```
#00ff9f #00b8ff #ff00ae #7000ff #ffdd00 #ff6b35 #6bff00 #00ffd5 #ff0055 #e600ff 
#00ffff #ff00ff #ffff00 #00ff00 #ff0000 #0000ff #ff8000 #00ff80 #8000ff #80ff00
```

**Sunset Dreams**
```
#f093fb #f5576c #4facfe #00f2fe #43e97b #38f9d7 #fa709a #fee140 #30cfd0 #330867 
#667eea #764ba2 #f77062 #fe5196 #e2b0ff #9795f0 #fbc2eb #a6c1ee #ffecd2 #fcb69f
```

**Cosmic Rays**
```
#ee0979 #ff6a00 #f12711 #f5af19 #c21500 #ffc500 #fc466b #3f5efb #8e2de2 #4a00e0 
#7f00ff #e100ff #ff0080 #ff4d00 #ff9900 #ffdd00 #ddff00 #80ff00 #00ff40 #00ffbf
```

**Sunset Skies**
```
#ff9966 #ff5e62 #ff6e7f #bfe9ff #ff0844 #ffb199 #fc354c #0abfbc #f5af19 #f12711 
#fc4a1a #f7b733 #00c6ff #0072ff #ff0099 #493240 #f953c6 #b91d73 #00d2ff #3a7bd5
```

**Duotone Pairs**
```
#000000 #ff0000 #ffffff #0000ff #ff00ff #00ffff #ffff00 #ff00ff #00ff00 #0000ff 
#ff0000 #000000 #0000ff #ffffff #00ffff #ff00ff #ffff00 #ff00ff #00ff00 #0000ff
```

---

## 🔧 CSS VARIABLES SYSTEM

```css
:root {
  /* Dynamic Colors (set by palette selection) */
  --c1: #dd8448;  /* Primary color */
  --c2: #ff9d66;  /* Secondary color */
  --c3: #ff6b35;  /* Accent color */
  --glow: rgba(221, 132, 72, 0.5);  /* Glow effect color */
  
  /* UI Colors */
  --pink: #ec4899;
  --cyan: #06b6d4;
  --green: #10b981;
  --dark: #0a0a0f;
  --card-bg: #121217;
}
```

---

## 📋 COMPLETE CARD HTML STRUCTURE

```html
<div class="card" data-element="fire" style="width:420px;height:580px;border-radius:32px">
  <!-- Glass gradient border layer -->
  <div class="glass" style="border-radius:32px">
    <div class="glass-inner" style="border-radius:30px"></div>
  </div>
  
  <!-- Animated spinning border -->
  <div class="border-anim" style="border-radius:32px">
    <div class="spin"></div>
    <div class="mask" style="border-radius:29px"></div>
  </div>
  
  <!-- Glow orbs -->
  <div class="glow-wrap">
    <div class="glow-orb glow-1"></div>
    <div class="glow-orb glow-2"></div>
  </div>
  
  <!-- Element-specific effects layer -->
  <div class="fx-layer">
    <div class="fire-wave"></div>
    <div class="water-ripple"></div>
    <div class="water-ripple" style="animation-delay:.7s"></div>
    <div class="alien-ring"></div>
    <div class="electric-grid"></div>
  </div>
  
  <!-- Particle container (JS controlled) -->
  <div class="particles"></div>
  
  <!-- Box shadow filter layer -->
  <div class="filter-layer" style="border-radius:32px"></div>
  
  <!-- Content -->
  <div class="card-content" style="padding:32px;justify-content:space-between">
    <div class="content-top">
      <span class="category">Enterprise</span>
      <span class="app-type">SaaS Platform</span>
    </div>
    <div class="content-bottom">
      <h2 class="card-title" style="font-family:Orbitron;font-size:36px">PROJECT NEXUS</h2>
      <p class="card-desc" style="font-size:15px">Next-generation enterprise solution.</p>
      <div class="tags">
        <span class="tag">React</span>
        <span class="tag">TypeScript</span>
      </div>
    </div>
  </div>
</div>
```

---

## 🎯 QUICK COPY-PASTE EFFECTS

### Spinning Border Only
```css
.border-anim{position:absolute;inset:0;overflow:hidden;padding:2px;border-radius:32px;pointer-events:none}
.border-anim .spin{position:absolute;inset:-100%;background:conic-gradient(from 0deg,transparent,#dd8448,#ff9d66,transparent 60%);animation:rotate 4s linear infinite}
.border-anim .mask{position:absolute;inset:3px;background:#121217;border-radius:29px}
@keyframes rotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
```

### Glow Orbs Only
```css
.glow-wrap{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.glow-orb{position:absolute;border-radius:50%}
.glow-1{width:200px;height:200px;top:-50px;right:-50px;background:#dd8448;filter:blur(60px);opacity:.4;animation:pulse 3s ease-in-out infinite}
.glow-2{width:180px;height:180px;bottom:-50px;left:-50px;background:#ff9d66;filter:blur(60px);opacity:.3;animation:pulse 3s ease-in-out infinite 1s}
@keyframes pulse{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:.9;transform:scale(1.2)}}
```

### Card Hover Effect Only
```css
.card{transition:transform .4s ease}
.card:hover{transform:translateY(-12px) scale(1.02)}
```