"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  label?: string;
  variant?: "primary" | "accent";
}

export function QuantityStepper({ 
  value, 
  onChange, 
  min = 1, 
  label, 
  variant = "primary" 
}: QuantityStepperProps) {
  const isPrimary = variant === "primary";

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-bold text-slate-500 block ml-1">{label}</label>}
      <div className="flex items-center bg-white rounded-2xl p-1 border-2 border-slate-100 group-focus-within:border-primary/30 transition-all">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 active:scale-90 transition-all border border-slate-100"
        >
          <Minus size={20} strokeWidth={3} />
        </button>
        <input
          type="number"
          className="flex-1 w-full text-center text-2xl font-black bg-transparent border-0 focus:ring-0 p-0 text-slate-800"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        />
        <button
          onClick={() => onChange(value + 1)}
          className={cn(
            "w-12 h-12 flex items-center justify-center text-white rounded-xl shadow-md active:scale-90 transition-all border-2",
            isPrimary 
              ? "bg-primary border-primary/20 shadow-blue-100" 
              : "bg-accent border-accent/20 shadow-amber-100"
          )}
        >
          <Plus size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
