import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { NeonButton } from "@/components/NeonButton";
import { NeonInput } from "@/components/NeonInput";
import { NeonSwitch } from "@/components/NeonSwitch";
import { ElementalCard, type CardBackgroundLayer, type HoverSettings } from "@/components/ElementalCard";
import { VaultCard } from "@/components/VaultCard";
import { CodeExportView } from "@/components/CodeExportView";
import {
  useCreateCard,
  useCards,
  useUpdateCard,
  useDeleteCard,
} from "@/hooks/use-cards";
import type { CardPalette, CardAnimations, CardFilters, Card, CardHoverSettings, CardGradients, CardShadows, CardSpacing } from "@shared/schema";
import { clsx } from "clsx";
import {
  Flame,
  Droplets,
  Zap,
  Mountain,
  Orbit,
  Snowflake,
  Moon,
  Globe,
  Move,
  Type,
  Square,
  Undo2,
  Redo2,
  Sparkles,
  Image as ImageIcon,
  SlidersHorizontal,
  UploadCloud,
  Layers,
  Layout,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { paletteCatalog, type PaletteDefinition } from "@/data/paletteCatalog";

// === CONSTANTS ===
const ELEMENTS = [
  { id: 'fire', name: 'Fire', icon: Flame },
  { id: 'water', name: 'Water', icon: Droplets },
  { id: 'electric', name: 'Electric', icon: Zap },
  { id: 'nature', name: 'Nature', icon: Mountain },
  { id: 'tech', name: 'Tech', icon: Orbit },
  { id: 'air', name: 'Air', icon: Snowflake },
  { id: 'toxic', name: 'Toxic', icon: Moon },
  { id: 'alien', name: 'Alien', icon: Globe },
];

const FONTS = [
  { name: 'Rajdhani', value: 'Rajdhani' },
  { name: 'Orbitron', value: 'Orbitron' },
  { name: 'JetBrains Mono', value: 'JetBrains Mono' },
  { name: 'Inter', value: 'Inter' },
  { name: 'Playfair Display', value: 'Playfair Display' },
];

type NamedPalette = CardPalette & { name: string };

// Use generated catalog instead of hardcoded palettes
const PALETTES: NamedPalette[] = paletteCatalog.flatMap(
  (category) =>
    category.palettes.map((p) => ({
      name: p.name,
      ...p.cardPalette,
    })),
);

type ViewMode = "generator" | "vault" | "export";

const NAV_ITEMS: { id: ViewMode; label: string; badge?: string }[] = [
  { id: "generator", label: "Generator" },
  { id: "vault", label: "Vault" },
  { id: "export", label: "Export" },
];

const SECTION_KEYS = [
  "dimensions",
  "typography",
  "imagery",
  "hover",
  "elements",
  "palette",
  "gradients",
  "shadows",
  "layout",
  "content",
  "systems",
] as const;

type SectionKey = (typeof SECTION_KEYS)[number];

const DEFAULT_HOVER_SETTINGS: HoverSettings = {
  scale: 105,
  rotate: 0,
  lift: 8,
  glow: 20,
  speed: 3,
  tilt3d: true,
};

const HERO_COPY: Record<
  ViewMode,
  { title: string; subtitle: string; badge: string; description: string }
> = {
  generator: {
    title: "Card Reactor v3",
    subtitle: "Phase 2 • Systems Online",
    badge: "LIVE BUILD",
    description: "Design, iterate, and stabilise elemental cards in real time.",
  },
  vault: {
    title: "Card Archives",
    subtitle: "Saved Designs • Templates",
    badge: "DATABASE",
    description: "Browse and manage your created cards.",
  },
  export: {
    title: "Export & Share",
    subtitle: "Framework Bundles • JSON Payloads",
    badge: "DEPLOY",
    description: "Package your creations for clients, front-ends, or handoff.",
  },
};

const MAX_HISTORY = 25;

type EditorSnapshot = {
  element: string;
  palette: CardPalette;
  animations: CardAnimations;
  title: string;
  description: string;
  category: string;
  appType: string;
  tags: string;
  owner: string;
  width: number;
  height: number;
  borderRadius: number;
  fontFamily: string;
  hoverSettings: HoverSettings;
  backgroundLayer: CardBackgroundLayer | null;
  gradients: CardGradients;
  shadows: CardShadows;
  layout: 'vertical' | 'horizontal';
  spacing: { padding: number; gap: number };
};

type SectionCardProps = {
  id?: string;
  title: string;
  icon: LucideIcon;
  badge?: string;
  status?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
};

type SliderControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (value: number) => string;
  onChange: (value: number) => void;
};

const SectionCard = ({
  id,
  title,
  children,
  icon: Icon,
  badge,
  status,
  isOpen,
  onToggle,
}: SectionCardProps) => (
  <div className="mb-4 rounded-2xl border border-white/10 bg-white/5" id={id}>
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-3 text-left"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/10 border border-white/10">
          <Icon className="w-4 h-4 text-white/80" />
        </div>
        <div>
          <div className="text-sm font-mono uppercase tracking-[0.4em] text-white">
            {title}
          </div>
          {badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--active-color-1)]/20 text-[var(--active-color-1)]">
              {badge}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!isOpen && status && (
          <span className="text-[8px] bg-[var(--active-color-1)] text-black px-1 rounded uppercase">
            {status}
          </span>
        )}
        <ChevronDown
          className={clsx("w-4 h-4 transition-transform text-white/70", isOpen && "rotate-180")}
        />
      </div>
    </button>
    <div
      className={clsx(
        "grid transition-all duration-300",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none",
      )}
    >
      <div className="overflow-hidden px-4 pb-4">{children}</div>
    </div>
  </div>
);

const SliderControl = ({
  label,
  value,
  min,
  max,
  step = 1,
  format,
  onChange,
}: SliderControlProps) => (
  <div>
    <div className="flex justify-between text-xs text-white/60 mb-2">
      <span>{label}</span>
      <span>{format ? format(value) : value}</span>
    </div>
    <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} />
  </div>
);

const cloneSnapshot = (snapshot: EditorSnapshot): EditorSnapshot => ({
  ...snapshot,
  palette: { ...snapshot.palette },
  animations: { ...snapshot.animations },
  backgroundLayer: snapshot.backgroundLayer ? { ...snapshot.backgroundLayer } : null,
  hoverSettings: { ...snapshot.hoverSettings },
});

const snapshotKey = (snapshot: EditorSnapshot) => JSON.stringify(snapshot);

const snapshotFromCard = (card: Card): EditorSnapshot => ({
  element: card.element,
  palette: card.palette as CardPalette,
  animations: card.animations as CardAnimations,
  title: card.title,
  description: card.description,
  category: card.category,
  appType: card.appType,
  tags: (card.tags ?? []).join(", "),
  owner: card.owner ?? "guest",
  width: card.width,
  height: card.height,
  borderRadius: card.borderRadius,
  fontFamily: card.fontFamily,
  backgroundLayer: card.background ? card.background as CardBackgroundLayer : null,
  hoverSettings: card.hover ? card.hover as CardHoverSettings : DEFAULT_HOVER_SETTINGS,
  gradients: card.gradients || { type: 'linear', angle: 0 },
  shadows: card.shadows || { outer: true, inset: false, blur: 10, frameWidth: 3 },
  layout: card.layout ?? 'vertical',
  spacing: card.spacing ?? { padding: 30, gap: 12 },
});

export default function Home() {
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createCard = useCreateCard();
  const updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();

  // === Editor State ===
  const [element, setElement] = useState("fire");
  const [palette, setPalette] = useState<CardPalette>(PALETTES[1]);
  const [activePaletteName, setActivePaletteName] = useState<string>(PALETTES[1].name);
  const [animations, setAnimations] = useState<CardAnimations>({
    borderRotation: true,
    glowPulse: true,
    chromatic: false,
    particles: true,
  });

  const [gradients, setGradients] = useState<CardGradients>({ type: 'linear', angle: 0 });
  const [shadows, setShadows] = useState<CardShadows>({ outer: true, inset: false, blur: 10, frameWidth: 3 });
  const [title, setTitle] = useState("Flame Weaver");
  const [description, setDescription] = useState(
    "Controls the primal forces of fire to incinerate obstacles and forge new paths.",
  );
  const [category, setCategory] = useState("LEGENDARY");
  const [appType, setAppType] = useState("CHARACTER");
  const [tags, setTags] = useState("fire, damage, dps");
  const [owner, setOwner] = useState("guest");
  const [backgroundLayer, setBackgroundLayer] = useState<CardBackgroundLayer | null>(null);
  const [hoverSettings, setHoverSettings] = useState<HoverSettings>(DEFAULT_HOVER_SETTINGS);
  const [spacing, setSpacing] = useState<CardSpacing>({ padding: 30, gap: 12 });
  const [layout, setLayout] = useState<'vertical' | 'horizontal'>('vertical');
  const backgroundFileRef = useRef<HTMLInputElement>(null);

  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [view, setView] = useState<ViewMode>("generator");
  const historyRef = useRef<EditorSnapshot[]>([]);
  const historyPointerRef = useRef(-1);
  const snapshotHashRef = useRef("");
  const isRestoringRef = useRef(false);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const [historyLength, setHistoryLength] = useState(0);
  const [historyReady, setHistoryReady] = useState(false);

  // Dimensions
  const [width, setWidth] = useState(380);
  const [height, setHeight] = useState(480);
  const [borderRadius, setBorderRadius] = useState(20);
  const [fontFamily, setFontFamily] = useState("Rajdhani");

  const [isBackgroundDragActive, setIsBackgroundDragActive] = useState(false);
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>(() =>
    SECTION_KEYS.reduce(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      {} as Record<SectionKey, boolean>,
    ),
  );

  const [backgroundError, setBackgroundError] = useState("");

  const handleBackgroundUrlChange = (url: string) => {
    const trimmed = url.trim();
    setBackgroundError("");
    if (!trimmed) {
      setBackgroundLayer(null);
      return;
    }
    setBackgroundLayer((prev) => ({
      url: trimmed,
      overlay: prev?.overlay ?? 60,
      position: prev?.position ?? "center",
    }));
  };

  const handleBackgroundFileUpload = (file: File) => {
    setBackgroundError("");
    const reader = new FileReader();
    reader.onload = () => {
      setBackgroundLayer((prev) => ({
        url: reader.result as string,
        overlay: prev?.overlay ?? 60,
        position: prev?.position ?? "center",
      }));
    };
    reader.readAsDataURL(file);
  };

  const updateHoverSettings = (partial: Partial<HoverSettings>) => {
    setHoverSettings((prev) => ({ ...prev, ...partial }));
  };

  const toggleSection = useCallback((key: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const currentSnapshot = useMemo<EditorSnapshot>(
    () => ({
      element,
      palette,
      animations,
      title,
      description,
      category,
      appType,
      tags,
      owner,
      width,
      height,
      borderRadius,
      fontFamily,
      backgroundLayer,
      hoverSettings,
      gradients,
      shadows,
      layout,
      spacing,
    }),
    [
      element,
      palette,
      animations,
      title,
      description,
      category,
      appType,
      tags,
      owner,
      width,
      height,
      borderRadius,
      fontFamily,
      backgroundLayer,
      hoverSettings,
      gradients,
      shadows,
      layout,
      spacing,
    ],
  );

  const exportCard = useMemo<Card>(
    () =>
      ({
        id: editingCardId ?? 0,
        title,
        description,
        category,
        appType,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        element,
        palette,
        animations,
        width,
        height,
        borderRadius,
        fontFamily,
        owner,
        background: backgroundLayer,
        hover: hoverSettings,
        gradients,
        shadows,
        layout,
        spacing,
        tpl: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }) as Card,
    [
      editingCardId,
      title,
      description,
      category,
      appType,
      tags,
      element,
      palette,
      animations,
      width,
      height,
      borderRadius,
      fontFamily,
      owner,
      backgroundLayer,
      hoverSettings,
      gradients,
      shadows,
      layout,
      spacing,
    ],
  );

  const pushSnapshot = useCallback((snapshot: EditorSnapshot) => {
    const key = snapshotKey(snapshot);
    if (key === snapshotHashRef.current) return;
    const history = historyRef.current.slice(0, historyPointerRef.current + 1);
    history.push(cloneSnapshot(snapshot));
    while (history.length > MAX_HISTORY) {
      history.shift();
    }
    historyRef.current = history;
    historyPointerRef.current = history.length - 1;
    snapshotHashRef.current = key;
    setHistoryPointer(historyPointerRef.current);
    setHistoryLength(history.length);
  }, []);

  const applySnapshot = useCallback((snapshot: EditorSnapshot) => {
    setElement(snapshot.element);
    setPalette(snapshot.palette);
    setAnimations(snapshot.animations);
    setTitle(snapshot.title);
    setDescription(snapshot.description);
    setCategory(snapshot.category);
    setAppType(snapshot.appType);
    setTags(snapshot.tags);
    setOwner(snapshot.owner);
    setWidth(snapshot.width);
    setHeight(snapshot.height);
    setBorderRadius(snapshot.borderRadius);
    setFontFamily(snapshot.fontFamily);
    setBackgroundLayer(snapshot.backgroundLayer);
    setHoverSettings(snapshot.hoverSettings);
    setGradients(snapshot.gradients);
    setShadows(snapshot.shadows);
    setLayout(snapshot.layout);
    setSpacing(snapshot.spacing);
  }, []);

  const handleUndo = useCallback(() => {
    if (historyPointerRef.current <= 0) return;
    isRestoringRef.current = true;
    historyPointerRef.current -= 1;
    setHistoryPointer(historyPointerRef.current);
    const snapshot = historyRef.current[historyPointerRef.current];
    snapshotHashRef.current = snapshotKey(snapshot);
    applySnapshot(cloneSnapshot(snapshot));
  }, [applySnapshot]);

  const handleRedo = useCallback(() => {
    if (historyPointerRef.current >= historyRef.current.length - 1) return;
    isRestoringRef.current = true;
    historyPointerRef.current += 1;
    setHistoryPointer(historyPointerRef.current);
    const snapshot = historyRef.current[historyPointerRef.current];
    snapshotHashRef.current = snapshotKey(snapshot);
    applySnapshot(cloneSnapshot(snapshot));
  }, [applySnapshot]);

  const canUndo = historyPointer > 0;
  const canRedo = historyPointer >= 0 && historyPointer < historyLength - 1;

  useEffect(() => {
    if (!historyReady) {
      const initial = cloneSnapshot(currentSnapshot);
      historyRef.current = [initial];
      historyPointerRef.current = 0;
      snapshotHashRef.current = snapshotKey(initial);
      setHistoryPointer(0);
      setHistoryLength(1);
      setHistoryReady(true);
      return;
    }
    if (isRestoringRef.current) {
      isRestoringRef.current = false;
      return;
    }
    pushSnapshot(currentSnapshot);
  }, [currentSnapshot, historyReady, pushSnapshot]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === "z") {
        event.preventDefault();
        if (event.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((event.metaKey || event.ctrlKey) && key === "y") {
        event.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleUndo, handleRedo]);

  const { data: savedCards } = useCards();

  // === HANDLERS ===
  const buildPayload = () => ({
    title,
    description,
    category,
    appType,
    tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    element,
    palette,
    animations,
    width,
    height,
    borderRadius,
    fontFamily,
    owner,
    background: backgroundLayer,
    hover: hoverSettings,
    gradients,
    shadows,
    layout,
    spacing,
    tpl: false,
  });

  const resetEditor = () => {
    setTitle("Flame Weaver");
    setDescription("Controls the primal forces of fire to incinerate obstacles and forge new paths.");
    setCategory("LEGENDARY");
    setAppType("CHARACTER");
    setTags("fire, damage, dps");
    setElement("fire");
    setPalette(PALETTES[1]);
    setAnimations({
      borderRotation: true,
      glowPulse: true,
      chromatic: false,
      particles: true,
    });
    setWidth(380);
    setHeight(480);
    setBorderRadius(20);
    setFontFamily("Rajdhani");
    setOwner("guest");
    setBackgroundLayer(null);
    setHoverSettings(DEFAULT_HOVER_SETTINGS);
    setGradients({ type: 'linear', angle: 0 });
    setShadows({ outer: true, inset: false, blur: 10, frameWidth: 3 });
    setLayout('vertical');
    setSpacing({ padding: 30, gap: 12 });
    setEditingCardId(null);
  };

  const handleSave = async (options?: { redirectTo?: ViewMode }) => {
    const payload = buildPayload();
    try {
      if (editingCardId !== null) {
        await updateCard.mutateAsync({ id: editingCardId, data: payload });
        toast({ title: "Card Updated", description: "Edits have been saved." });
      } else {
        await createCard.mutateAsync(payload);
        toast({ title: "Card Saved!", description: "Your elemental card has been stored in the database." });
      }
      setEditingCardId(null);
      setView(options?.redirectTo ?? "vault");
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: (err as Error).message });
    }
  };

  const handleInitialiseConstruction = async () => {
    await handleSave({ redirectTo: "export" });
  };

  const handleExportJSON = () => {
    const payload = {
      title,
      description,
      category,
      appType,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      element,
      palette,
      animations,
      width,
      height,
      borderRadius,
      fontFamily,
      owner,
      background: backgroundLayer,
      hover: hoverSettings,
      gradients,
      shadows,
      layout,
      spacing,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title || "card"}-card.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveTemplate = async () => {
    const payload = { ...buildPayload(), tpl: true };
    try {
      await createCard.mutateAsync(payload);
      toast({ title: "Template Saved", description: "Stored in the Templates tab." });
    } catch (err) {
      toast({ variant: "destructive", title: "Template Save Failed", description: (err as Error).message });
    }
  };


  const loadCardState = (card: Card, options?: { editing?: boolean }) => {
    applySnapshot(snapshotFromCard(card));
    if (options?.editing ?? true) {
      setEditingCardId(card.id);
    }
  };

  const handleImportCard = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Partial<Card>;
      const importedCard: Card = {
        id: parsed.id ?? 0,
        createdAt: parsed.createdAt ? new Date(parsed.createdAt) : null,
        title: parsed.title ?? "Imported Entity",
        description: parsed.description ?? "",
        category: parsed.category ?? "COMMON",
        appType: parsed.appType ?? "CHARACTER",
        tags: parsed.tags ?? [],
        element: parsed.element ?? "fire",
        palette: (parsed.palette ?? PALETTES[0]) as CardPalette,
        animations: (parsed.animations ?? animations) as CardAnimations,
        width: parsed.width ?? 380,
        height: parsed.height ?? 480,
        borderRadius: parsed.borderRadius ?? 20,
        fontFamily: parsed.fontFamily ?? "Rajdhani",
        spacing: {
          padding: parsed.spacing && typeof parsed.spacing === "object" && "padding" in parsed.spacing ? (parsed.spacing as CardSpacing).padding ?? 30 : 30,
          gap: parsed.spacing && typeof parsed.spacing === "object" && "gap" in parsed.spacing ? (parsed.spacing as CardSpacing).gap ?? 12 : 12,
        },
        layout: parsed.layout === "horizontal" ? "horizontal" : "vertical",
        owner: parsed.owner ?? "guest",
        background: (parsed.background ?? null) as CardBackgroundLayer | null,
        hover: (parsed.hover ?? null) as CardHoverSettings | null,
        gradients: (parsed.gradients ?? { type: "linear", angle: 0 }) as CardGradients,
        shadows: (parsed.shadows ?? { outer: true, inset: false, blur: 10 }) as CardShadows,
        tpl: parsed.tpl ?? false,
      };
      loadCardState(importedCard, { editing: false });
      toast({ title: "Card Imported", description: "Design loaded into the editor." });
    } catch (err) {
      toast({ variant: "destructive", title: "Import Failed", description: (err as Error).message });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const hero = HERO_COPY[view];

  return (
    <div 
      className="min-h-screen relative overflow-hidden text-white pb-20"
      style={{
        "--c1": palette.color1,
        "--c2": palette.color2,
        "--c3": palette.color3,
        "--glow": palette.glow,
        "--active-color-1": palette.color1,
        "--active-color-2": palette.color2,
        "--active-color-3": palette.color3,
        "--active-glow": palette.glow,
      } as React.CSSProperties}
    >
      {/* Background Grid */}
      <div className="grid-bg" />

      {/* Navbar */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 px-10 py-4 bg-[#0a0a0f]/95 border border-white/10 rounded-full backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.45)]">
        <div className="font-display text-xl font-bold bg-gradient-to-br from-[var(--active-color-1)] to-[var(--active-color-2)] bg-clip-text text-transparent tracking-[0.2em]">
          CARDWEAVER
        </div>
        <div className="flex gap-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={clsx(
                "px-4 py-2 text-[10px] font-mono uppercase tracking-[0.3em] rounded-full border transition-all duration-200 flex items-center gap-2",
                view === item.id
                  ? "border-white bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                  : "border-white/10 text-white/60 hover:text-white hover:border-white/30",
              )}
            >
              {item.label}
              {item.badge && (
                <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-[var(--active-color-1)]/20 text-[var(--active-color-1)]">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pl-4 border-l border-white/10">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className={clsx(
              "w-9 h-9 rounded-lg border flex items-center justify-center transition-all",
              canUndo
                ? "border-white/30 text-white hover:bg-white/10"
                : "border-white/10 text-white/30 cursor-not-allowed",
            )}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className={clsx(
              "w-9 h-9 rounded-lg border flex items-center justify-center transition-all",
              canRedo
                ? "border-white/30 text-white hover:bg-white/10"
                : "border-white/10 text-white/30 cursor-not-allowed",
            )}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <main className="pt-40 px-4 max-w-[1600px] mx-auto space-y-14">
        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[var(--active-color-1)]/15 text-[var(--active-color-1)] text-[10px] font-mono tracking-[0.4em] uppercase mb-5">
                <Sparkles className="w-4 h-4" />
                {hero.badge}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">{hero.title}</h1>
              <p className="text-xs font-mono uppercase tracking-[0.5em] text-white/50 mt-4">
                {hero.subtitle}
              </p>
              <p className="text-base text-white/70 mt-6 max-w-2xl">{hero.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-2xl border border-white/10 bg-black/20">
                <div className="text-xs font-mono uppercase tracking-[0.4em] text-white/40">Width</div>
                <div className="text-3xl font-display">{width}px</div>
              </div>
              <div className="p-4 rounded-2xl border border-white/10 bg-black/20">
                <div className="text-xs font-mono uppercase tracking-[0.4em] text-white/40">Height</div>
                <div className="text-3xl font-display">{height}px</div>
              </div>
              <div className="p-4 rounded-2xl border border-white/10 bg-black/20">
                <div className="text-xs font-mono uppercase tracking-[0.4em] text-white/40">Owner</div>
                <div className="text-xl font-display">{owner || "guest"}</div>
              </div>
              <div className="p-4 rounded-2xl border border-white/10 bg-black/20">
                <div className="text-xs font-mono uppercase tracking-[0.4em] text-white/40">History</div>
                <div className="text-xl font-display">
                  {historyPointer + 1}/{historyLength}
                </div>
              </div>
            </div>
          </div>
        </header>

        {view === "generator" && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-10">
            {/* === LEFT: PREVIEW AREA === */}
            <div
              ref={previewRef}
              className="bg-white/5 border border-white/10 rounded-[20px] p-10 flex-col items-center justify-center min-h-[700px] relative overflow-hidden backdrop-blur-sm"
            >
              <div className="absolute top-6 left-6 font-mono text-xs text-white/40 tracking-[0.4em] uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--active-color-1)] animate-pulse" />
                Live Preview
              </div>
              <div className="absolute top-6 right-6 text-right text-xs font-mono tracking-[0.3em] text-white/60 space-y-1">
                <div>{width}px × {height}px</div>
                <div>Owner · {owner || "guest"}</div>
              </div>
              <div
                style={{
                  "--active-color-1": palette.color1,
                  "--active-color-2": palette.color2,
                  "--active-color-3": palette.color3,
                  "--active-glow": palette.glow,
                } as React.CSSProperties}
              >
                <ElementalCard
                  element={element}
                  palette={palette}
                  animations={animations}
                  title={title}
                  description={description}
                  category={category}
                  appType={appType}
                  tags={tags.split(",")}
                  scale={1}
                  width={width}
                  height={height}
                  borderRadius={borderRadius}
                  fontFamily={fontFamily}
                  backgroundImage={backgroundLayer}
                  backgroundGradient={gradients}
                  hoverSettings={hoverSettings}
                  shadows={shadows}
                  layout={layout}
                  spacing={spacing}
                />

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  <NeonButton
                    onClick={() => handleSave()}
                    isLoading={createCard.isPending || updateCard.isPending}
                  >
                    {editingCardId !== null ? (updateCard.isPending ? "Updating..." : "Save Update") : createCard.isPending ? "Constructing..." : "Save Card"}
                  </NeonButton>
                  <button
                    onClick={handleSaveTemplate}
                    className="px-4 py-3 text-xs font-mono uppercase tracking-[0.4em] border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    Save Template
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="px-4 py-3 text-xs font-mono uppercase tracking-[0.4em] border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    Export JSON
                  </button>
                </div>
              </div>
            </div>

            {/* === RIGHT: CONTROL PANEL === */}
            <div
              className="bg-[#12121a]/90 border border-white/10 rounded-[20px] p-6 max-h-[800px] overflow-y-auto custom-scrollbar backdrop-blur-md"
              style={{
                "--active-color-1": palette.color1,
                "--active-color-2": palette.color2,
                "--active-color-3": palette.color3,
                "--active-glow": palette.glow,
              } as React.CSSProperties}
            >
              <div className="flex items-center gap-2 mb-6 text-[var(--active-color-1)]">
                <Zap className="w-5 h-5" />
                <h2 className="font-display font-bold text-lg uppercase tracking-wide">Card Controls</h2>
              </div>

              <SectionCard
                icon={Move}
                title="Dimensions & Layout"
                isOpen={openSections.dimensions}
                onToggle={() => toggleSection("dimensions")}
              >
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-white/60 mb-2">
                      <span>Width</span>
                      <span>{width}px</span>
                    </div>
                    <Slider value={[width]} min={200} max={600} step={10} onValueChange={([v]) => setWidth(v)} />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-white/60 mb-2">
                      <span>Height</span>
                      <span>{height}px</span>
                    </div>
                    <Slider value={[height]} min={200} max={800} step={10} onValueChange={([v]) => setHeight(v)} />
                  </div>

                  <div>
                    <div className="flex justify-between items-center gap-2 text-xs text-white/60 mb-2">
                      <Square className="w-3 h-3" /> <span>Corner Radius</span>
                      <span className="ml-auto">{borderRadius}px</span>
                    </div>
                    <Slider value={[borderRadius]} min={0} max={50} step={1} onValueChange={([v]) => setBorderRadius(v)} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-white/60 mb-2">
                      <span>Frame Width</span>
                      <span>{(shadows.frameWidth ?? 3)}px</span>
                    </div>
                    <Slider value={[shadows.frameWidth ?? 3]} min={1} max={12} step={1} onValueChange={([v]) => setShadows((prev) => ({ ...prev, frameWidth: v }))} />
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                icon={Type}
                title="Typography System"
                isOpen={openSections.typography}
                onToggle={() => toggleSection("typography")}
              >
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger className="bg-white/10 border-white/10 text-white">
                    <SelectValue placeholder="Select Font" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#12121a] border-white/10 text-white">
                    {FONTS.map((f) => (
                      <SelectItem key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SectionCard>

              <SectionCard
                icon={ImageIcon}
                title="Background Imagery"
                badge="NEW"
                status={backgroundLayer ? "IMG" : undefined}
                isOpen={openSections.imagery}
                onToggle={() => toggleSection("imagery")}
              >
                <div className="space-y-4">
                  <NeonInput
                    label="Image URL"
                    value={backgroundLayer?.url || ""}
                    onChange={(e) => handleBackgroundUrlChange(e.target.value)}
                  />
                  <motion.div
                    className={clsx(
                      "border-2 border-dashed rounded-xl p-4 text-center text-sm transition-colors cursor-pointer",
                      isBackgroundDragActive ? "border-white/60 bg-white/5" : "border-white/20 hover:border-white/40",
                    )}
                    animate={{ scale: isBackgroundDragActive ? 1.02 : 1 }}
                    transition={{ duration: 0.2 }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsBackgroundDragActive(true);
                    }}
                    onDragLeave={() => setIsBackgroundDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsBackgroundDragActive(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleBackgroundFileUpload(file);
                    }}
                    onClick={() => backgroundFileRef.current?.click()}
                  >
                    <UploadCloud className="w-6 h-6 mx-auto mb-2 text-white/70" />
                    <p className="font-mono uppercase tracking-[0.3em] text-xs">Drop or click to upload</p>
                    <p className="text-[11px] text-white/40 mt-2">PNG, JPG, GIF up to 5MB</p>
                  </motion.div>
                  {backgroundError && <p className="text-red-400 text-xs">{backgroundError}</p>}
                  {backgroundLayer && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <img src={backgroundLayer.url} alt="Background preview" className="w-12 h-12 object-cover rounded border border-white/20" onError={() => setBackgroundError("Failed to load image")} onLoad={() => setBackgroundError("")} />
                        <button onClick={() => setBackgroundLayer(null)} className="px-2 py-1 text-xs font-mono uppercase tracking-widest border border-white/20 rounded hover:bg-white/10 transition-colors">Remove</button>
                      </div>
                      <SliderControl label="Overlay Opacity" value={backgroundLayer.overlay} min={0} max={100} format={(v) => `${v}%`} onChange={(v) => setBackgroundLayer((prev) => prev ? { ...prev, overlay: v } : null)} />
                      <div>
                        <label className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Position</label>
                        <div className="flex flex-wrap gap-2">
                          {["center", "top", "left", "right", "bottom"].map((pos) => (
                            <button
                              key={pos}
                              onClick={() => setBackgroundLayer((prev) => prev ? { ...prev, position: pos as any } : null)}
                              className={clsx("px-3 py-1 text-xs font-mono uppercase tracking-widest border rounded-full transition-colors", backgroundLayer.position === pos ? "border-[var(--active-color-1)] bg-[var(--active-color-1)]/20" : "border-white/20 hover:border-white/40")}
                            >
                              {pos}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  ref={backgroundFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleBackgroundFileUpload(file);
                  }}
                />
              </SectionCard>

              <SectionCard
                icon={SlidersHorizontal}
                title="Hover FX"
                badge="NEW"
                status={JSON.stringify(hoverSettings) !== JSON.stringify(DEFAULT_HOVER_SETTINGS) ? "FX" : undefined}
                isOpen={openSections.hover}
                onToggle={() => toggleSection("hover")}
              >
                <div className="space-y-4">
                  <SliderControl
                    label="Scale"
                    value={hoverSettings.scale}
                    min={80}
                    max={150}
                    onChange={(v) => updateHoverSettings({ scale: v })}
                  />
                  <SliderControl
                    label="Speed"
                    value={hoverSettings.speed}
                    min={1}
                    max={10}
                    step={1}
                    format={(v) => `0.${v}s`}
                    onChange={(v) => updateHoverSettings({ speed: v })}
                  />
                  <NeonSwitch
                    label="3D Tilt"
                    checked={hoverSettings.tilt3d}
                    onCheckedChange={(checked) => updateHoverSettings({ tilt3d: checked })}
                  />
                </div>
              </SectionCard>

              <SectionCard
                icon={Sparkles}
                title="Element Core"
                isOpen={openSections.elements}
                onToggle={() => toggleSection("elements")}
              >
                <div className="grid grid-cols-4 gap-2">
                  {ELEMENTS.map((el) => {
                    const Icon = el.icon;
                    const isActive = element === el.id;
                    return (
                      <button
                        key={el.id}
                        onClick={() => setElement(el.id)}
                        className={clsx(
                          "flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-300",
                          isActive
                            ? "bg-white/10 border-[var(--active-color-1)] shadow-[0_0_15px_var(--active-glow)]"
                            : "bg-white/5 border-transparent hover:border-white/20",
                        )}
                      >
                        <Icon className={clsx("w-6 h-6", isActive ? "text-[var(--active-color-1)]" : "text-white/60")} />
                        <span className="font-mono text-[9px] uppercase tracking-wider">{el.name}</span>
                      </button>
                    );
                  })}
                </div>
              </SectionCard>

              <SectionCard
                icon={Layers}
                title="Energy Signature"
                isOpen={openSections.palette}
                onToggle={() => toggleSection("palette")}
              >
                <div className="space-y-4">
                  {paletteCatalog.map((category) => (
                    <div key={category.name}>
                      <h3 className="text-xs font-mono uppercase tracking-widest text-white/60 mb-2">{category.name}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {category.palettes.map((p) => {
                          const isActive = activePaletteName === p.name;
                          return (
                            <button
                              key={p.id}
                              onClick={() => {
                                setPalette(p.cardPalette);
                                setActivePaletteName(p.name);
                              }}
                              className={clsx(
                                "group flex items-center justify-between p-2 rounded-lg border transition-all",
                                isActive ? "border-white bg-white/10" : "border-transparent bg-white/5 hover:bg-white/10",
                              )}
                            >
                              <span className="text-xs font-mono pl-2">{p.name}</span>
                              <div className="flex gap-1">
                                {[p.cardPalette.color1, p.cardPalette.color2, p.cardPalette.color3].map((c, idx) => (
                                  <div key={`${p.id}-${idx}`} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                                ))}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 mt-4">
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Fine Tune Colors</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-white/60">Color 1</label>
                      <input
                        type="color"
                        value={palette.color1}
                        onChange={(e) => {
                          setActivePaletteName("custom");
                          setPalette((prev) => ({ ...prev, color1: e.target.value }));
                        }}
                        className="w-full h-8 border border-white/20 rounded"
                      />
                      <input
                        type="text"
                        value={palette.color1}
                        onChange={(e) => {
                          setActivePaletteName("custom");
                          setPalette((prev) => ({ ...prev, color1: e.target.value }));
                        }}
                        className="w-full text-xs bg-white/5 border border-white/10 rounded px-2 py-1 mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/60">Color 2</label>
                      <input
                        type="color"
                        value={palette.color2}
                        onChange={(e) => {
                          setActivePaletteName("custom");
                          setPalette((prev) => ({ ...prev, color2: e.target.value }));
                        }}
                        className="w-full h-8 border border-white/20 rounded"
                      />
                      <input
                        type="text"
                        value={palette.color2}
                        onChange={(e) => {
                          setActivePaletteName("custom");
                          setPalette((prev) => ({ ...prev, color2: e.target.value }));
                        }}
                        className="w-full text-xs bg-white/5 border border-white/10 rounded px-2 py-1 mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/60">Color 3</label>
                      <input
                        type="color"
                        value={palette.color3}
                        onChange={(e) => {
                          setActivePaletteName("custom");
                          setPalette((prev) => ({ ...prev, color3: e.target.value }));
                        }}
                        className="w-full h-8 border border-white/20 rounded"
                      />
                      <input
                        type="text"
                        value={palette.color3}
                        onChange={(e) => {
                          setActivePaletteName("custom");
                          setPalette((prev) => ({ ...prev, color3: e.target.value }));
                        }}
                        className="w-full text-xs bg-white/5 border border-white/10 rounded px-2 py-1 mt-1"
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                icon={Sparkles}
                title="Gradient Background"
                isOpen={openSections.gradients}
                onToggle={() => toggleSection("gradients")}
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Type</label>
                    <div className="flex gap-2">
                      {(['linear', 'radial', 'conic'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setGradients((prev) => ({ ...prev, type }))}
                          className={clsx("px-3 py-1 text-xs font-mono uppercase tracking-widest border rounded-full transition-colors", gradients.type === type ? "border-[var(--active-color-1)] bg-[var(--active-color-1)]/20" : "border-white/20 hover:border-white/40")}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <SliderControl label="Angle" value={gradients.angle} min={0} max={360} format={(v) => `${v}°`} onChange={(v) => setGradients((prev) => ({ ...prev, angle: v }))} />
                </div>
              </SectionCard>

              <SectionCard
                icon={Square}
                title="Shadow Effects"
                isOpen={openSections.shadows}
                onToggle={() => toggleSection("shadows")}
              >
                <div className="space-y-4">
                  <NeonSwitch label="Outer Shadow" checked={shadows.outer} onCheckedChange={(checked) => setShadows((prev) => ({ ...prev, outer: checked }))} />
                  <NeonSwitch label="Inset Shadow" checked={shadows.inset} onCheckedChange={(checked) => setShadows((prev) => ({ ...prev, inset: checked }))} />
                  <SliderControl label="Blur" value={shadows.blur} min={0} max={50} format={(v) => `${v}px`} onChange={(v) => setShadows((prev) => ({ ...prev, blur: v }))} />
                  <SliderControl label="Frame Width" value={shadows.frameWidth ?? 3} min={1} max={12} format={(v) => `${v}px`} onChange={(v) => setShadows((prev) => ({ ...prev, frameWidth: v }))} />
                </div>
              </SectionCard>

              <SectionCard
                icon={Layout}
                title="Layout & Spacing"
                isOpen={openSections.layout}
                onToggle={() => toggleSection("layout")}
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Content Layout</label>
                    <div className="flex gap-2">
                      {(['vertical', 'horizontal'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setLayout(type)}
                          className={clsx("px-3 py-1 text-xs font-mono uppercase tracking-widest border rounded-full transition-colors", layout === type ? "border-[var(--active-color-1)] bg-[var(--active-color-1)]/20" : "border-white/20 hover:border-white/40")}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <SliderControl label="Padding" value={spacing.padding} min={10} max={100} format={(v) => `${v}px`} onChange={(v) => setSpacing((prev) => ({ ...prev, padding: v }))} />
                </div>
              </SectionCard>

              <SectionCard
                icon={Layers}
                title="Narrative Content"
                isOpen={openSections.content}
                onToggle={() => toggleSection("content")}
              >
                <NeonInput label="Entity Name" value={title} onChange={(e) => setTitle(e.target.value)} />
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                    <span className="w-1 h-3 bg-[var(--active-color-1)] inline-block rounded-sm"></span>
                    Data Log
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm font-body text-white transition-all duration-200 placeholder:text-white/30 focus:outline-none focus:border-[var(--active-color-1)] focus:shadow-[0_0_15px_var(--active-glow)] h-24 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <NeonInput label="Rarity Class" value={category} onChange={(e) => setCategory(e.target.value)} />
                  <NeonInput label="Type" value={appType} onChange={(e) => setAppType(e.target.value)} />
                </div>
                <NeonInput label="Tags (CSV)" value={tags} onChange={(e) => setTags(e.target.value)} />
                <NeonInput label="Owner / Gallery" value={owner} onChange={(e) => setOwner(e.target.value)} />
              </SectionCard>

              <SectionCard
                icon={SlidersHorizontal}
                title="Visual Systems"
                isOpen={openSections.systems}
                onToggle={() => toggleSection("systems")}
              >
                <div className="space-y-2">
                  <NeonSwitch
                    label="Border Rotation System"
                    checked={animations.borderRotation}
                    onCheckedChange={(v) => setAnimations((prev) => ({ ...prev, borderRotation: v }))}
                  />
                  <NeonSwitch
                    label="Core Glow Pulse"
                    checked={animations.glowPulse}
                    onCheckedChange={(v) => setAnimations((prev) => ({ ...prev, glowPulse: v }))}
                  />
                  <NeonSwitch
                    label="Chromatic Aberration"
                    checked={animations.chromatic}
                    onCheckedChange={(v) => setAnimations((prev) => ({ ...prev, chromatic: v }))}
                  />
                  <NeonSwitch
                    label="Particle Emitter"
                    checked={animations.particles}
                    onCheckedChange={(v) => setAnimations((prev) => ({ ...prev, particles: v }))}
                  />
                </div>
                {editingCardId !== null && (
                  <div className="px-3 py-2 text-xs font-mono uppercase tracking-widest text-yellow-300 border border-yellow-500/30 rounded-lg bg-yellow-500/10">
                    Editing card #{editingCardId}
                  </div>
                )}
                <div className="flex-col gap-3">
                  <NeonButton className="w-full" onClick={handleInitialiseConstruction} isLoading={createCard.isPending || updateCard.isPending}>
                    {editingCardId !== null ? (updateCard.isPending ? "Updating..." : "Update Card") : createCard.isPending ? "Constructing..." : "Initialise Construction"}
                  </NeonButton>
                  <button
                    onClick={resetEditor}
                    className="w-full px-4 py-2 text-sm font-mono uppercase tracking-widest border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Reset Editor
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <button
                    onClick={handleExportJSON}
                    className="px-3 py-2 text-xs font-mono uppercase tracking-widest border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Export JSON
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 text-xs font-mono uppercase tracking-widest border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Import JSON
                  </button>
                  <button
                    disabled
                    title="Coming soon"
                    className="px-3 py-2 text-xs font-mono uppercase tracking-widest border border-white/20 rounded-lg text-white/40 cursor-not-allowed"
                  >
                    Export Image
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportCard} />
              </SectionCard>
            </div>
          </div>
        )}

        {view === "vault" && (
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-display font-bold text-white">Saved Cards</h2>
              <p className="text-white/60 font-mono text-sm">Browse your created card designs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {savedCards?.map((card) => (
                <VaultCard
                  key={card.id}
                  card={card}
                  onEdit={(c) => {
                    loadCardState(c);
                    setEditingCardId(c.id);
                    setView("generator");
                  }}
                  onDelete={(id) => deleteCard.mutate(id)}
                />
              ))}
            </div>

            {savedCards && savedCards.length === 0 && (
              <div className="text-center py-20 text-white/40 font-mono">
                NO CARDS SAVED YET. CREATE YOUR FIRST CARD ABOVE!
              </div>
            )}
          </section>
        )}

        {view === "export" && (
          <section
            className="grid grid-cols-1 xl:grid-cols-[minmax(0,520px)_1fr] gap-8"
            style={{
              "--active-color-1": palette.color1,
              "--active-color-2": palette.color2,
              "--active-color-3": palette.color3,
              "--active-glow": palette.glow,
            } as React.CSSProperties}
          >
            <div className="bg-white/5 border border-white/10 rounded-[20px] p-8 relative overflow-hidden">
              <div className="absolute top-6 left-6 font-mono text-xs text-white/50 tracking-[0.4em] uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--active-color-1)] animate-pulse" />
                Export Preview
              </div>
              <div className="absolute top-6 right-6 text-right text-xs font-mono tracking-[0.3em] text-white/60 space-y-1">
                <div>{width}px × {height}px</div>
                <div>Owner · {owner || "guest"}</div>
              </div>
              <div className="mt-16 flex items-center justify-center">
                <ElementalCard
                  element={element}
                  palette={palette}
                  animations={animations}
                  title={title}
                  description={description}
                  category={category}
                  appType={appType}
                  tags={tags.split(",")}
                  scale={0.9}
                  width={width}
                  height={height}
                  borderRadius={borderRadius}
                  fontFamily={fontFamily}
                  backgroundImage={backgroundLayer}
                  backgroundGradient={gradients}
                  hoverSettings={hoverSettings}
                  shadows={shadows}
                  layout={layout}
                  spacing={spacing}
                />
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <NeonButton onClick={() => setView("generator")}>Back to Generator</NeonButton>
                <button
                  onClick={() => setView("vault")}
                  className="px-4 py-3 text-xs font-mono uppercase tracking-[0.4em] border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                >
                  View Vault
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[20px] p-6">
              <CodeExportView card={exportCard} />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
