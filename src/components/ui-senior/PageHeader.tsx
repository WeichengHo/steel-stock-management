"use client";

import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  subtitle?: string;
}

export function PageHeader({ title, icon: Icon, action, subtitle }: PageHeaderProps) {
  return (
    <header className="space-y-2 mb-6">
      <div className="flex items-center justify-between px-1">
        <h1 className="text-senior-xl font-black text-slate-800 flex items-center gap-3">
          {Icon && <Icon className="text-primary" size={32} />}
          {title}
        </h1>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {subtitle && <p className="text-sm text-slate-500 font-bold px-1">{subtitle}</p>}
    </header>
  );
}
