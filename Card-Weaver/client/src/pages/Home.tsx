import { useState } from "react";
import { NeonButton } from "@/components/NeonButton";
import { NeonInput } from "@/components/NeonInput";
import { NeonSwitch } from "@/components/NeonSwitch";
import { ElementalCard } from "@/components/ElementalCard";
import { useCreateCard, useCards } from "@/hooks/use-cards";
import type { CardPalette, CardAnimations } from "@shared/schema";
import { clsx } from "clsx";
import { Flame, Droplets, Zap, Sprout, Disc, Wind, Skull, Globe, Move, Type, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// === CONSTANTS ===
const ELEMENTS = [
  { id: 'fire', name: 'Fire', icon: Flame },
  { id: 'water', name: 'Water', icon: Droplets },
  { id: 'electric', name: 'Electric', icon: Zap },
  { id: 'nature', name: 'Nature', icon: Sprout },
  { id: 'tech', name: 'Tech', icon: Disc },
  { id: 'air', name: 'Air', icon: Wind },
  { id: 'toxic', name: 'Toxic', icon: Skull },
  { id: 'alien', name: 'Alien', icon: Globe },
];

const FONTS = [
  { name: 'Rajdhani', value: 'Rajdhani' },
  { name: 'Orbitron', value: 'Orbitron' },
  { name: 'JetBrains Mono', value: 'JetBrains Mono' },
  { name: 'Inter', value: 'Inter' },
  { name: 'Playfair Display', value: 'Playfair Display' },
];

const PALETTES: (CardPalette & { name: string })[] = [
  { name: 'Cyberpunk', color1: '#00f0ff', color2: '#7000ff', color3: '#ff003c', glow: 'rgba(0, 240, 255, 0.5)' },
  { name: 'Inferno', color1: '#dd8448', color2: '#ff9d66', color3: '#ff6b35', glow: 'rgba(221, 132, 72, 0.5)' },
  { name: 'Oceanic', color1: '#4facfe', color2: '#00f2fe', color3: '#00c6fb', glow: 'rgba(79, 172, 254, 0.5)' },
  { name: 'Venom', color1: '#ccff00', color2: '#99ff33', color3: '#00ff00', glow: 'rgba(204, 255, 0, 0.5)' },
  { name: 'Neon', color1: '#ff00cc', color2: '#333399', color3: '#ff66ff', glow: 'rgba(255, 0, 204, 0.5)' },
  { name: 'Gold', color1: '#ffd700', color2: '#fdb931', color3: '#bf953f', glow: 'rgba(255, 215, 0, 0.5)' },
];

export default function Home() {
  const { toast } = useToast();
  const createCard = useCreateCard();
  const { data: savedCards } = useCards();

  // === STATE ===
  const [element, setElement] = useState("fire");
  const [palette, setPalette] = useState<CardPalette>(PALETTES[1]);
  const [animations, setAnimations] = useState<CardAnimations>({
    borderRotation: true,
    glowPulse: true,
    chromatic: false,
    particles: true,
  });
  const [title, setTitle] = useState("Flame Weaver");
  const [description, setDescription] = useState("Controls the primal forces of fire to incinerate obstacles and forge new paths.");
  const [category, setCategory] = useState("LEGENDARY");
  const [appType, setAppType] = useState("CHARACTER");
  const [tags, setTags] = useState("fire, damage, dps");

  // Phase 1: Essential Controls
  const [width, setWidth] = useState(380);
  const [height, setHeight] = useState(480);
  const [borderRadius, setBorderRadius] = useState(20);
  const [fontFamily, setFontFamily] = useState("Rajdhani");

  // === HANDLERS ===
  const handleSave = async () => {
    try {
      await createCard.mutateAsync({
        title,
        description,
        category,
        appType,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        element,
        palette,
        animations,
        width,
        height,
        borderRadius,
        fontFamily,
      });
      toast({ title: "Card Saved!", description: "Your elemental card has been stored in the database." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: (err as Error).message });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-white pb-20">
      {/* Background Grid */}
      <div className="grid-bg" />

      {/* Navbar */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-10 px-10 py-4 bg-[#0a0a0f]/90 border border-[var(--active-color-1)]/20 rounded-full backdrop-blur-md">
        <div className="font-display text-xl font-bold bg-gradient-to-br from-[var(--active-color-1)] to-[var(--active-color-2)] bg-clip-text text-transparent">
          ELEMENTAL
        </div>
        <div className="flex gap-8">
          <a href="#" className="font-mono text-xs text-white/60 hover:text-[var(--active-color-1)] uppercase tracking-widest transition-colors">Generator</a>
          <a href="#gallery" className="font-mono text-xs text-white/60 hover:text-[var(--active-color-1)] uppercase tracking-widest transition-colors">Gallery</a>
        </div>
      </nav>

      <main className="pt-32 px-4 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-10">
          
          {/* === LEFT: PREVIEW AREA === */}
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-10 flex flex-col items-center justify-center min-h-[700px] relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-6 left-6 font-mono text-xs text-white/40 tracking-widest uppercase">
              Preview Mode
            </div>
            
            <div style={{
              '--active-color-1': palette.color1,
              '--active-color-2': palette.color2,
              '--active-color-3': palette.color3,
              '--active-glow': palette.glow,
            } as React.CSSProperties}>
              <ElementalCard 
                element={element}
                palette={palette}
                animations={animations}
                title={title}
                description={description}
                category={category}
                appType={appType}
                tags={tags.split(",")}
                width={width}
                height={height}
                borderRadius={borderRadius}
                fontFamily={fontFamily}
              />
            </div>
          </div>

          {/* === RIGHT: CONTROL PANEL === */}
          <div className="bg-[#12121a]/90 border border-white/10 rounded-[20px] p-6 max-h-[800px] overflow-y-auto custom-scrollbar backdrop-blur-md" 
             style={{
               '--active-color-1': palette.color1,
               '--active-color-2': palette.color2,
               '--active-color-3': palette.color3,
               '--active-glow': palette.glow,
             } as React.CSSProperties}
          >
            <div className="flex items-center gap-2 mb-6 text-[var(--active-color-1)]">
               <Zap className="w-5 h-5" />
               <h2 className="font-display font-bold text-lg uppercase tracking-wide">Card Controls</h2>
            </div>

            {/* 0. Dimensions & Style (Phase 1) */}
            <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
               <label className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4 block flex items-center gap-2">
                 <Move className="w-3 h-3" /> Dimensions
               </label>
               
               <div className="space-y-4">
                 <div>
                   <div className="flex justify-between text-xs text-white/60 mb-2">
                     <span>Width</span>
                     <span>{width}px</span>
                   </div>
                   <Slider 
                     value={[width]} 
                     min={200} 
                     max={600} 
                     step={10} 
                     onValueChange={([v]) => setWidth(v)} 
                   />
                 </div>
                 
                 <div>
                   <div className="flex justify-between text-xs text-white/60 mb-2">
                     <span>Height</span>
                     <span>{height}px</span>
                   </div>
                   <Slider 
                     value={[height]} 
                     min={200} 
                     max={800} 
                     step={10} 
                     onValueChange={([v]) => setHeight(v)} 
                   />
                 </div>

                 <div>
                   <div className="flex justify-between text-xs text-white/60 mb-2 flex items-center gap-2">
                     <Square className="w-3 h-3" /> <span>Border Radius</span>
                     <span className="ml-auto">{borderRadius}px</span>
                   </div>
                   <Slider 
                     value={[borderRadius]} 
                     min={0} 
                     max={50} 
                     step={1} 
                     onValueChange={([v]) => setBorderRadius(v)} 
                   />
                 </div>
               </div>
            </div>

            <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
               <label className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4 block flex items-center gap-2">
                 <Type className="w-3 h-3" /> Typography
               </label>
               <Select value={fontFamily} onValueChange={setFontFamily}>
                 <SelectTrigger className="bg-white/10 border-white/10 text-white">
                   <SelectValue placeholder="Select Font" />
                 </SelectTrigger>
                 <SelectContent className="bg-[#12121a] border-white/10 text-white">
                   {FONTS.map(f => (
                     <SelectItem key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                       {f.name}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
            </div>

            {/* 1. Elements Grid */}
            <div className="mb-8">
              <label className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 block">Element Core</label>
              <div className="grid grid-cols-4 gap-2">
                {ELEMENTS.map((el) => {
                  const Icon = el.icon;
                  const isActive = element === el.id;
                  return (
                    <button
                      key={el.id}
                      onClick={() => setElement(el.id)}
                      className={clsx(
                        "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-300",
                        isActive 
                          ? "bg-white/10 border-[var(--active-color-1)] shadow-[0_0_15px_var(--active-glow)]" 
                          : "bg-white/5 border-transparent hover:border-white/20"
                      )}
                    >
                      <Icon className={clsx("w-6 h-6", isActive ? "text-[var(--active-color-1)]" : "text-white/60")} />
                      <span className="font-mono text-[9px] uppercase tracking-wider">{el.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Palette Picker */}
            <div className="mb-8">
              <label className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 block">Energy Signature</label>
              <div className="grid grid-cols-2 gap-3">
                {PALETTES.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPalette(p)}
                    className={clsx(
                      "group flex items-center justify-between p-2 rounded-lg border transition-all",
                      palette.name === p.name ? "border-white bg-white/10" : "border-transparent bg-white/5 hover:bg-white/10"
                    )}
                  >
                    <span className="text-xs font-mono pl-2">{p.name}</span>
                    <div className="flex gap-1">
                      {[p.color1, p.color2, p.color3].map(c => (
                        <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Inputs */}
            <div className="space-y-4 mb-8">
              <NeonInput label="Entity Name" value={title} onChange={e => setTitle(e.target.value)} />
              <div className="space-y-2">
                 <label className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                  <span className="w-1 h-3 bg-[var(--active-color-1)] inline-block rounded-sm"></span>
                  Data Log
                </label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm font-body text-white transition-all duration-200 placeholder:text-white/30 focus:outline-none focus:border-[var(--active-color-1)] focus:shadow-[0_0_15px_var(--active-glow)] h-24 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <NeonInput label="Rarity Class" value={category} onChange={e => setCategory(e.target.value)} />
                <NeonInput label="Type" value={appType} onChange={e => setAppType(e.target.value)} />
              </div>
              <NeonInput label="Tags (CSV)" value={tags} onChange={e => setTags(e.target.value)} />
            </div>

            {/* 4. Toggles */}
            <div className="space-y-2 mb-8">
               <label className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Visual Systems</label>
               <NeonSwitch 
                  label="Border Rotation System" 
                  checked={animations.borderRotation} 
                  onCheckedChange={v => setAnimations(prev => ({ ...prev, borderRotation: v }))} 
               />
               <NeonSwitch 
                  label="Core Glow Pulse" 
                  checked={animations.glowPulse} 
                  onCheckedChange={v => setAnimations(prev => ({ ...prev, glowPulse: v }))} 
               />
               <NeonSwitch 
                  label="Chromatic Aberration" 
                  checked={animations.chromatic} 
                  onCheckedChange={v => setAnimations(prev => ({ ...prev, chromatic: v }))} 
               />
               <NeonSwitch 
                  label="Particle Emitter" 
                  checked={animations.particles} 
                  onCheckedChange={v => setAnimations(prev => ({ ...prev, particles: v }))} 
               />
            </div>

            <NeonButton 
              className="w-full" 
              onClick={handleSave} 
              isLoading={createCard.isPending}
            >
              {createCard.isPending ? "Constructing..." : "Initialise Construction"}
            </NeonButton>

          </div>
        </div>

        {/* === GALLERY SECTION === */}
        <div id="gallery" className="mt-32">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-4xl font-display font-bold text-white">Database Archives</h2>
            <div className="h-px flex-1 bg-white/20"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {savedCards?.map((card) => (
              <div key={card.id} className="transform hover:-translate-y-2 transition-transform duration-300">
                <div style={{
                  '--active-color-1': (card.palette as CardPalette).color1,
                  '--active-color-2': (card.palette as CardPalette).color2,
                  '--active-color-3': (card.palette as CardPalette).color3,
                  '--active-glow': (card.palette as CardPalette).glow,
                } as React.CSSProperties}>
                  <ElementalCard
                    element={card.element}
                    palette={card.palette as CardPalette}
                    animations={card.animations as CardAnimations}
                    title={card.title}
                    description={card.description}
                    category={card.category}
                    appType={card.appType}
                    tags={card.tags || []}
                    scale={0.8}
                    width={card.width}
                    height={card.height}
                    borderRadius={card.borderRadius}
                    fontFamily={card.fontFamily}
                  />
                </div>
              </div>
            ))}
            {savedCards?.length === 0 && (
              <div className="col-span-full text-center py-20 text-white/40 font-mono">
                NO ENTRIES FOUND IN DATABASE. INITIALISE NEW CARDS ABOVE.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
