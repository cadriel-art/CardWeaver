import { forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
}

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, children, variant = "primary", isLoading, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={twMerge(
          "relative overflow-hidden rounded-xl px-6 py-3 font-display text-sm font-bold uppercase tracking-widest transition-all duration-300",
          "hover:-translate-y-1 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0",
          variant === "primary" && 
            "bg-gradient-to-br from-[var(--active-color-1)] to-[var(--active-color-2)] text-[#0a0a0f] shadow-[0_0_20px_var(--active-glow)] hover:shadow-[0_10px_30px_var(--active-glow)]",
          variant === "secondary" && 
            "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40",
          variant === "outline" && 
            "bg-transparent border-2 border-[var(--active-color-1)] text-[var(--active-color-1)] hover:bg-[var(--active-color-1)] hover:text-[#0a0a0f]",
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {children}
        </span>
        
        {/* Shine effect for primary */}
        {variant === "primary" && (
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 hover:translate-x-full" />
        )}
      </button>
    );
  }
);
NeonButton.displayName = "NeonButton";
