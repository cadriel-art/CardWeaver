import { useState } from "react";
import { clsx } from "clsx";
import { Copy, Check } from "lucide-react";
import type { Card } from "@shared/schema";
import {
  generateHTML,
  generateCSS,
  generateJavaScript,
  generateReactComponent,
  generateVueComponent,
  generateSvelteComponent,
  generateTailwindComponent,
  generateFullComponent,
} from "@/utils/codeGenerator";

interface CodeExportViewProps {
  card: Card;
}

type CodeTab = "html" | "css" | "javascript" | "full" | "react" | "vue" | "svelte" | "tailwind";

export function CodeExportView({ card }: CodeExportViewProps) {
  const [activeTab, setActiveTab] = useState<CodeTab>("full");
  const [copied, setCopied] = useState(false);

  const getCode = () => {
    switch (activeTab) {
      case "html":
        return generateHTML(card);
      case "css":
        return generateCSS(card);
      case "javascript":
        return generateJavaScript(card);
      case "full":
        return generateFullComponent(card);
      case "react":
        return generateReactComponent(card);
      case "vue":
        return generateVueComponent(card);
      case "svelte":
        return generateSvelteComponent(card);
      case "tailwind":
        return generateTailwindComponent(card);
      default:
        return "";
    }
  };

  const handleCopy = async () => {
    const code = getCode();
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: CodeTab; label: string }[] = [
    { id: "full", label: "FULL COMPONENT" },
    { id: "html", label: "HTML STRUCTURE" },
    { id: "css", label: "CSS STYLES" },
    { id: "javascript", label: "JAVASCRIPT" },
    { id: "react", label: "REACT" },
    { id: "vue", label: "VUE 3" },
    { id: "svelte", label: "SVELTE" },
    { id: "tailwind", label: "TAILWIND" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">
            {card.title} - Code Export
          </h2>
          <p className="text-sm text-white/60 font-mono">
            Element: {card.element.toUpperCase()} • Owner: {card.owner || "guest"}
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--active-color-1)] text-black font-mono text-sm uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy {activeTab === "full" ? "Full Component" : activeTab.toUpperCase()}
            </>
          )}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "px-4 py-2 text-xs font-mono uppercase tracking-widest border rounded-lg transition-colors",
              activeTab === tab.id
                ? "border-[var(--active-color-1)] bg-[var(--active-color-1)]/20 text-white"
                : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-black border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <span className="text-xs font-mono text-white/60 ml-3">
              {activeTab === "full" ? "complete-component.html" : `${card.element}-card.${activeTab === "html" ? "html" : activeTab === "css" ? "css" : activeTab === "javascript" ? "js" : activeTab}`}
            </span>
          </div>
          <span className="text-xs font-mono text-white/40">
            {getCode().split("\n").length} lines
          </span>
        </div>
        <pre className="p-6 overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
          <code className="text-sm font-mono text-white/90 leading-relaxed">
            {getCode()}
          </code>
        </pre>
      </div>
    </div>
  );
}
