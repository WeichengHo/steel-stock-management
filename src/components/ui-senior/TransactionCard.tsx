"use client";

import { Building2, Package, Calendar, Trash2 } from "lucide-react";
import { SeniorCard } from "./SeniorCard";
import { SeniorSelect, SeniorInput } from "./SeniorForm";
import { QuantityStepper } from "./QuantityStepper";

interface TransactionCardProps {
  index: number;
  type: "in" | "out";
  data: any;
  suppliers?: string[];
  rebarSpecs: string[];
  onUpdate: (field: string, value: any) => void;
  onRemove: () => void;
}

export function TransactionCard({ 
  index, 
  type, 
  data, 
  suppliers = [], 
  rebarSpecs, 
  onUpdate, 
  onRemove 
}: TransactionCardProps) {
  const isIn = type === "in";

  return (
    <SeniorCard className="relative space-y-6">
      <div className="flex justify-between items-center border-b pb-3 border-slate-100">
        <span className="font-bold text-lg text-primary flex items-center gap-2">
          <span className="bg-blue-100 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">
            {index + 1}
          </span>
          {isIn ? "進貨單" : "出貨單"}
        </span>
        <button
          onClick={onRemove}
          className="text-danger hover:bg-red-50 p-2 rounded-full transition-colors active:scale-90"
          title="刪除"
        >
          <Trash2 size={24} />
        </button>
      </div>

      {/* Flattened Information Flow */}
      {isIn && suppliers.length > 0 && (
        <SeniorSelect
          label="進貨廠商"
          icon={Building2}
          value={data.supplier}
          options={suppliers}
          onChange={(e) => onUpdate("supplier", e.target.value)}
        />
      )}

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-500 flex items-center gap-2 ml-1">
          <Calendar size={16} className={isIn ? "text-primary" : "text-accent"} /> 
          {isIn ? "進貨時間" : "出貨時間"}
        </label>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <input
            type="date"
            className="input-senior bg-white text-sm px-3 w-full"
            value={data.date ? data.date.split("T")[0] : ""}
            onChange={(e) => {
              const timePart = data.date.split("T")[1] || "12:00";
              onUpdate("date", `${e.target.value}T${timePart}`);
            }}
          />
          <input
            type="time"
            className="input-senior bg-white text-sm px-3 w-full"
            value={data.date ? data.date.split("T")[1] : ""}
            onChange={(e) => {
              const datePart = data.date.split("T")[0];
              onUpdate("date", `${datePart}T${e.target.value}`);
            }}
          />
        </div>
      </div>

      {!isIn && (
        <SeniorInput
          label="用途備註 (選填)"
          placeholder="如: 工地 A 使用"
          value={data.note || ""}
          onChange={(e) => onUpdate("note", e.target.value)}
        />
      )}

      <SeniorSelect
        label={isIn ? "鋼筋規格" : "出貨規格"}
        icon={Package}
        value={data.code}
        options={rebarSpecs}
        onChange={(e) => onUpdate("code", e.target.value)}
        className="font-bold text-lg"
      />

      <div className="grid grid-cols-2 gap-4">
        {isIn ? (
          <SeniorInput
            label="每噸成本 (元)"
            type="number"
            variant="accent"
            placeholder="如: 21500"
            value={data.cost || ""}
            onChange={(e) => onUpdate("cost", parseInt(e.target.value) || 0)}
            className="text-lg p-4"
          />
        ) : (
          <div className="flex items-end pb-2">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Inventory Check</span>
          </div>
        )}

        <QuantityStepper
          label="數量 (噸)"
          variant={isIn ? "primary" : "accent"}
          value={data.qty}
          onChange={(val) => onUpdate("qty", val)}
        />
      </div>
    </SeniorCard>
  );
}
