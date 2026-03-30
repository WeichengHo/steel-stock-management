"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui-senior/PageHeader";
import { TransactionCard } from "@/components/ui-senior/TransactionCard";
import { ActionButtonBar } from "@/components/ui-senior/ActionButtonBar";

// CNS 560 常用鋼筋 (分 / 號數 / D 徑)
const mockRebarSpecs = ["3分筋 (#3 D10)", "4分筋 (#4 D13)", "5分筋 (#5 D16)", "6分筋 (#6 D19)", "7分筋 (#7 D22)", "8分筋 (#8 D25)"];

export default function ShipPage() {
    const router = useRouter();

    // 取得當前時間作為預設值
    const getNowFormatted = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16);
    };

    interface ShipItem {
        id: string;
        date: string;
        code: string;
        qty: number;
        note: string;
    }

    const [items, setItems] = useState<ShipItem[]>(() => [{
        id: typeof crypto !== 'undefined' ? crypto.randomUUID() : 'initial-id',
        date: getNowFormatted(),
        code: mockRebarSpecs[0],
        qty: 1,
        note: ""
    }]);

    const addItem = () => {
        const lastItem = items[items.length - 1];
        setItems([
            ...items,
            {
                id: crypto.randomUUID(),
                date: lastItem ? lastItem.date : getNowFormatted(),
                code: mockRebarSpecs[0],
                qty: 1,
                note: ""
            }
        ]);
    };

    const removeItem = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const updateItem = (id: string, field: keyof ShipItem, value: string | number) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleSave = () => {
        if (items.length === 0) {
            alert("請至少新增一筆出貨品項！");
            return;
        }
        alert(`已送出出貨需求：共 ${items.length} 筆，系統將自動依據 "先進先出 (FIFO)" 扣除庫存。`);
        router.push("/history");
    };

    return (
        <>
            <div className="space-y-6 pb-48">
                <PageHeader
                    title="多筆出貨登錄"
                    subtitle="您可在此一次新增送往不同工地、不同時間的多筆出貨單。"
                />

                <div className="space-y-6 mt-4">
                    {items.map((item, index) => (
                        <TransactionCard
                            key={item.id}
                            index={index}
                            type="out"
                            data={item}
                            rebarSpecs={mockRebarSpecs}
                            onUpdate={(field, val) => updateItem(item.id, field as keyof ShipItem, val)}
                            onRemove={() => removeItem(item.id)}
                        />
                    ))}
                </div>
            </div>

            <ActionButtonBar
                onAdd={addItem}
                onSave={handleSave}
                addLabel="下一個"
                saveLabel={`確認出貨 (${items.length}筆)`}
            />
        </>
    );
}
