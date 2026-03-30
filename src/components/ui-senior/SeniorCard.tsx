"use client";

import { cn } from "@/lib/utils";

interface SeniorCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent" | "danger";
  noPadding?: boolean;
}

export function SeniorCard({ children, className, variant = "default", noPadding = false }: SeniorCardProps) {
  const variantStyles = {
    default: "bg-white border-border-idle",
    accent: "bg-accent-surface/30 border-accent-border/30",
    danger: "bg-red-50/30 border-red-100",
  };

  return (
    <div className={cn(
      "card-senior",
      variantStyles[variant],
      noPadding ? "p-0" : "p-5",
      className
    )}>
      {children}
    </div>
  );
}
