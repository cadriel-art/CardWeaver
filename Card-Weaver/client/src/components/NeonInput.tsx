import { forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface NeonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const NeonInput = forwardRef<HTMLInputElement, NeonInputProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
            <span className="w-1 h-3 bg-[var(--active-color-1)] inline-block rounded-sm"></span>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={twMerge(
            "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm font-body text-white transition-all duration-200",
            "placeholder:text-white/30",
            "focus:outline-none focus:border-[var(--active-color-1)] focus:shadow-[0_0_15px_var(--active-glow)]",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
NeonInput.displayName = "NeonInput";
