"use client";

import { cn } from "@/lib/utils";

interface SeniorRadioGroupProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  variant?: "primary" | "accent";
}

export function SeniorRadioGroup({
  options,
  value,
  onChange,
  className,
  variant = "primary"
}: SeniorRadioGroupProps) {
  const isPrimary = variant === "primary";

  return (
    <div className={cn(
      "flex p-1.5 rounded-[24px] border-2 bg-surface",
      isPrimary ? "border-border-idle" : "border-accent-border/30",
      className
    )}>
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 py-4 px-2 rounded-[18px] text-lg font-black transition-all duration-200 active:scale-95",
              isActive
                ? (isPrimary ? "bg-primary text-white shadow-md" : "bg-accent text-white shadow-md")
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
