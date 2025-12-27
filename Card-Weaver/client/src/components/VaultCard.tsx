import { useState, type CSSProperties } from "react";
import { clsx } from "clsx";

import { Copy, Check, Edit, Trash2, Eye } from "lucide-react";
import type { Card, CardPalette, CardAnimations, CardBackgroundLayer, CardGradients, CardShadows, CardSpacing } from "@shared/schema";
import { ElementalCard } from "./ElementalCard";
import { generateFullComponent } from "@/utils/codeGenerator";

interface VaultCardProps {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (id: number) => void;
}

export function VaultCard({ card, onEdit, onDelete }: VaultCardProps) {
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleCopy = async () => {
    const code = generateFullComponent(card);
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHorizontal = card.layout === "horizontal";
  const previewScale = isHorizontal ? 0.48 : 0.78;
  const previewHeight = Math.max(card.height * previewScale + 80, isHorizontal ? 240 : 320);
  const previewStyle: (CSSProperties & Record<string, string>) = {
    "--active-color-1": (card.palette as CardPalette).color1,
    "--active-color-2": (card.palette as CardPalette).color2,
    "--active-color-3": (card.palette as CardPalette).color3,
    "--active-glow": (card.palette as CardPalette).glow,
    height: `${previewHeight}px`,
    aspectRatio: `${card.width}/${card.height}`,
  };

  return (
    <div className="group relative flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur hover:border-white/30 transition-all">
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[var(--active-color-1)]/15 via-transparent to-[var(--active-color-2)]/20"
        style={previewStyle}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff22,transparent_60%)]" />
        <div className="h-full flex items-center justify-center">
          <ElementalCard
            element={card.element}
            palette={card.palette as CardPalette}
            animations={card.animations as CardAnimations}
            title={card.title}
            description={card.description}
            category={card.category}
            appType={card.appType}
            tags={card.tags || []}
            scale={previewScale}
            width={card.width}
            height={card.height}
            borderRadius={card.borderRadius}
            fontFamily={card.fontFamily}
            backgroundImage={
              card.background
                ? {
                    url: (card.background as CardBackgroundLayer).url || "",
                    overlay: (card.background as CardBackgroundLayer).overlay,
                    position:
                      ((card.background as CardBackgroundLayer).position as "center" | "top" | "bottom" | "left" | "right") || "center",
                  }
                : null
            }
            backgroundGradient={(card.gradients as CardGradients) ?? undefined}
            hoverSettings={card.hover ?? undefined}
            shadows={(card.shadows as CardShadows) ?? undefined}
            layout={card.layout as "vertical" | "horizontal"}
            spacing={card.spacing as CardSpacing}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#08080c]" />
      </div>

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 mb-1">#{card.id} · {card.owner || "guest"}</p>
            <h3 className="text-base font-display font-semibold text-white truncate">{card.title}</h3>
            <p className="text-xs text-white/60 line-clamp-2">{card.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(card)}
              className="rounded-full border border-white/20 p-2 text-white/60 hover:text-white hover:border-white/60 transition-colors"
              title="Edit"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(card.id)}
              className="rounded-full border border-red-400/30 p-2 text-red-300/70 hover:text-red-200 hover:border-red-300 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40">
          <span className="px-2 py-0.5 rounded-full border border-white/20">{card.category}</span>
          <span className="px-2 py-0.5 rounded-full border border-white/20">{card.element}</span>
          {card.tags?.slice(0, 2).map((tag) => (
            <span key={`${card.id}-${tag}`} className="px-2 py-0.5 rounded-full border border-white/10 text-white/50">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCode((prev) => !prev)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-xs font-mono uppercase tracking-[0.3em] text-white/70 hover:bg-white/10 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            {showCode ? "Hide Code" : "View Code"}
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-xs font-mono uppercase tracking-[0.3em] text-white/70 hover:bg-white/10 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div
          className={`grid transition-all duration-300 ${showCode ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
            }`}
        >
          <pre className="overflow-hidden rounded-lg border border-white/10 bg-black/60 p-3 text-[10px] text-green-300 font-mono max-h-40 overflow-y-auto">
            {generateFullComponent(card)}
          </pre>
        </div>
      </div>
    </div>
  );
}