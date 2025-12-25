import { clsx } from "clsx";

interface NeonSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}

export function NeonSwitch({ checked, onCheckedChange, label }: NeonSwitchProps) {
  return (
    <div 
      onClick={() => onCheckedChange(!checked)}
      className={clsx(
        "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent",
        checked ? "bg-white/10 border-[var(--active-glow)]" : "bg-white/5 hover:bg-white/10"
      )}
    >
      <span className="text-xs font-mono text-white/70">{label}</span>
      <div className={clsx(
        "w-10 h-5 rounded-full relative transition-colors duration-300",
        checked ? "bg-[var(--active-color-1)]" : "bg-white/20"
      )}>
        <div className={clsx(
          "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 shadow-sm",
          checked ? "left-[22px]" : "left-1"
        )} />
      </div>
    </div>
  );
}
