"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui-senior/PageHeader";
import { TransactionCard } from "@/components/ui-senior/TransactionCard";
import { ActionButtonBar } from "@/components/ui-senior/ActionButtonBar";

// CNS 560 常用鋼筋 (分 / 號數 / D 徑)
const mockRebarSpecs = ["3分筋 (#3 D10)", "4分筋 (#4 D13)", "5分筋 (#5 D16)", "6分筋 (#6 D19)", "7分筋 (#7 D22)", "8分筋 (#8 D25)"];
const mockSuppliers = ["A 鋼鐵廠", "B 貿易商", "C 資源回收"];

export default function RestockPage() {
  const router = useRouter();

  // 取得當前時間作為預設值
  const getNowFormatted = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  interface RestockItem {
    id: string;
    supplier: string;
    date: string;
    code: string;
    qty: number;
    cost: number;
  }

  const [items, setItems] = useState<RestockItem[]>(() => [{
    id: typeof crypto !== 'undefined' ? crypto.randomUUID() : 'initial-id',
    supplier: mockSuppliers[0],
    date: getNowFormatted(),
    code: mockRebarSpecs[0],
    qty: 1,
    cost: 0
  }]);

  const addItem = () => {
    const lastItem = items[items.length - 1];
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        supplier: lastItem ? lastItem.supplier : mockSuppliers[0],
        date: lastItem ? lastItem.date : getNowFormatted(),
        code: mockRebarSpecs[0],
        qty: 1,
        cost: 0
      }
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof RestockItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSave = () => {
    if (items.length === 0) {
      alert("請至少新增一筆進貨品項！");
      return;
    }
    const uniqueSuppliers = new Set(items.map(i => i.supplier));
    alert(`已儲存：共 ${items.length} 項貨物，來自 ${uniqueSuppliers.size} 家不同廠商`);
    router.push("/");
  };

  return (
    <>
      <div className="space-y-6 pb-48">
        <PageHeader
          title="多筆進貨登錄"
          subtitle="您可在此一次新增來自不同廠商、不同時間的多筆進貨單。"
        />

        <div className="space-y-6 mt-4">
          {items.map((item, index) => (
            <TransactionCard
              key={item.id}
              index={index}
              type="in"
              data={item}
              suppliers={mockSuppliers}
              rebarSpecs={mockRebarSpecs}
              onUpdate={(field, val) => updateItem(item.id, field as keyof RestockItem, val)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </div>
      </div>

      <ActionButtonBar
        onAdd={addItem}
        onSave={handleSave}
        addLabel="下一筆"
        saveLabel={`確認存檔 (${items.length}筆)`}
      />
    </>
  );
}
