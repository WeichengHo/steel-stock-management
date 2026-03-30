"use client";

import { Plus, Save } from "lucide-react";

interface ActionButtonBarProps {
  onAdd?: () => void;
  onSave: () => void;
  addLabel?: string;
  saveLabel?: string;
  saveDisabled?: boolean;
}

export function ActionButtonBar({
  onAdd,
  onSave,
  addLabel = "新增",
  saveLabel = "確認存檔",
  saveDisabled = false
}: ActionButtonBarProps) {
  return (
    <div className="fixed bottom-[80px] left-0 right-0 z-40 p-4 pb-6 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
      <div className="max-w-md mx-auto flex gap-3 pointer-events-auto">
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex-1 bg-white border-2 border-primary/20 text-primary rounded-2xl h-16 flex items-center justify-center gap-2 font-black shadow-lg active:scale-95 transition-all"
          >
            <Plus size={24} strokeWidth={3} />
            {addLabel}
          </button>
        )}
        <button
          onClick={onSave}
          disabled={saveDisabled}
          className="flex-[2] bg-primary text-white rounded-2xl h-16 flex items-center justify-center gap-2 font-black shadow-xl shadow-blue-200 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
        >
          <Save size={24} strokeWidth={3} />
          {saveLabel}
        </button>
      </div>
    </div>
  );
}
