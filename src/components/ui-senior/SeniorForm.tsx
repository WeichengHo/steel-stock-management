"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeniorInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  variant?: "default" | "accent";
}

export function SeniorInput({ label, icon: Icon, variant = "default", className, ...props }: SeniorInputProps) {
  const isAccent = variant === "accent";

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-500 flex items-center gap-2 ml-1">
        {Icon && <Icon size={16} className={isAccent ? "text-accent" : "text-primary"} />}
        {label}
      </label>
      <input
        className={cn(
          isAccent ? "input-accent-senior" : "input-senior",
          "font-bold",
          className
        )}
        {...props}
      />
    </div>
  );
}

interface SeniorSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon?: LucideIcon;
  options: string[] | { value: string; label: string }[];
}

export function SeniorSelect({ label, icon: Icon, options, className, ...props }: SeniorSelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-bold text-slate-500 flex items-center gap-2 ml-1">
          {Icon && <Icon size={16} className="text-primary" />}
          {label}
        </label>
      )}
      <div className="relative group">
        <select
          className={cn(
            "input-senior font-bold appearance-none bg-white pr-10",
            className
          )}
          {...props}
        >
          {options.map((opt) => {
            const value = typeof opt === "string" ? opt : opt.value;
            const label = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4.5L6 7.5L9 4.5"/></svg>
        </div>
      </div>
    </div>
  );
}
