"use client";

import { useState, useMemo } from "react";
import { Building2, Filter, TrendingUp, Package, FileDown, Calculator } from "lucide-react";
import { PageHeader } from "@/components/ui-senior/PageHeader";
import { SeniorCard } from "@/components/ui-senior/SeniorCard";
import { SeniorSelect } from "@/components/ui-senior/SeniorForm";
import { SeniorRadioGroup } from "@/components/ui-senior/SeniorRadioGroup";

const mockSuppliers = ["A 鋼鐵廠", "B 貿易商", "C 資源回收"];

const initialInventory = [
  { id: 1, date: "2024-10-20T10:00", spec: "4分筋 (#4 D13)", size: "#4", qty: 20, cost: 19500, supplier: "C 資源回收" },
  { id: 2, date: "2024-12-10T14:30", spec: "4分筋 (#4 D13)", size: "#4", qty: 25, cost: 22000, supplier: "B 貿易商" },
  { id: 3, date: "2025-01-15T09:15", spec: "4分筋 (#4 D13)", size: "#4", qty: 30, cost: 20800, supplier: "A 鋼鐵廠" },
  { id: 4, date: "2025-02-20T11:00", spec: "4分筋 (#4 D13)", size: "#4", qty: 25, cost: 21500, supplier: "A 鋼鐵廠" },
  { id: 5, date: "2024-11-05T08:00", spec: "3分筋 (#3 D10)", size: "#3", qty: 15, cost: 21200, supplier: "A 鋼鐵廠" },
];

const initialShipments = [
  {
    id: 101,
    date: "2025-02-26T14:00",
    spec: "4分筋 (#4 D13)",
    qty: 12,
    note: "工地 A 使用",
    sources: [{ supplier: "C 資源回收", qty: 12, cost: 19500 }]
  },
];

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<"in" | "out">("in");
  const [selectedSupplier, setSelectedSupplier] = useState("全部");

  // State for inventory and shipments to support FIFO updates
  const [inventoryList] = useState(initialInventory);
  const [shipmentHistory] = useState(initialShipments);

  // --- Summary Logic ---
  const monthlyStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const inTons = inventoryList.reduce((sum, item) => {
      const d = new Date(item.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        return sum + item.qty;
      }
      return sum;
    }, 0);

    const outTons = shipmentHistory.reduce((sum, item) => {
      const d = new Date(item.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        return sum + item.qty;
      }
      return sum;
    }, 0);

    const totalCost = inventoryList.reduce((sum, item) => {
      const d = new Date(item.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        return sum + (item.qty * item.cost);
      }
      return sum;
    }, 0);

    return { inTons, outTons, totalCost };
  }, [inventoryList, shipmentHistory]);

  const handleExport = () => {
    const fileName = activeTab === "in" ? "進貨對帳單" : "出貨對帳單";
    alert(`正在生成「${fileName}」...\n格式：PDF\n包含：${new Date().getMonth() + 1}月所有紀錄\n\n(完成後將自動分享至 LINE)`);
  };

  // --- History Tab Logic ---
  const filteredRestocks = useMemo(() => {
    return selectedSupplier === "全部"
      ? inventoryList
      : inventoryList.filter(r => r.supplier === selectedSupplier);
  }, [selectedSupplier, inventoryList]);

  const groupedRestocks = useMemo(() => {
    const groups: Record<string, typeof inventoryList> = {};
    filteredRestocks.forEach(r => {
      if (!groups[r.size]) groups[r.size] = [];
      groups[r.size].push(r);
    });
    return groups;
  }, [filteredRestocks]);

  return (
    <div className="space-y-8 pb-32">
      <PageHeader
        title="紀錄與月結"
        action={
          <button
            onClick={handleExport}
            className="bg-white border-2 border-primary text-primary p-3 rounded-2xl flex items-center gap-2 font-black text-sm active:scale-95 transition-all shadow-sm"
          >
            <FileDown size={20} />
            匯出
          </button>
        }
      />

      {/* 月結統計卡片 */}
      <SeniorCard className="bg-white space-y-4 border border-border-idle">
        <div className="flex items-center gap-2 text-primary">
          <Calculator size={20} />
          <span className="font-bold tracking-wider text-slate-700">{new Date().getMonth() + 1} 月數據統計</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface p-4 rounded-2xl border border-border-idle">
            <p className="text-xs font-bold text-slate-500 mb-1">總進貨噸數</p>
            <p className="text-2xl font-black text-slate-800">{monthlyStats.inTons.toLocaleString()} <span className="text-xs font-normal text-slate-500">噸</span></p>
          </div>
          <div className="bg-surface p-4 rounded-2xl border border-border-idle">
            <p className="text-xs font-bold text-slate-500 mb-1">總出貨噸數</p>
            <p className="text-2xl font-black text-slate-800">{monthlyStats.outTons.toLocaleString()} <span className="text-xs font-normal text-slate-500">噸</span></p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-between items-end">
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">本月採購總金額</p>
            <p className="text-xl font-black text-slate-800">$ {monthlyStats.totalCost.toLocaleString()}</p>
          </div>
          <button
            className="text-[10px] font-black bg-surface text-primary border border-border-idle px-3 py-1.5 rounded-full uppercase tracking-tighter"
            onClick={() => alert("詳細月報功能開發中")}
          >
            查看詳情
          </button>
        </div>
      </SeniorCard>

      {/* 類別切換 (Radio Group) */}
      <SeniorRadioGroup
        value={activeTab}
        onChange={(val) => setActiveTab(val as "in" | "out")}
        options={[
          { value: "in", label: "進貨紀錄" },
          { value: "out", label: "出貨紀錄" }
        ]}
        variant={activeTab === "in" ? "primary" : "accent"}
      />

      {activeTab === "in" ? (
        <div className="space-y-8">
          {/* 紀錄列表過濾 */}
          <SeniorCard className="space-y-4 text-center">
            <h2 className="text-slate-700 font-black text-lg">歷史進貨明細</h2>
            <div className="flex items-center gap-2 text-slate-500 justify-center">
              <Filter size={20} className="text-primary" />
              <span className="font-bold text-sm text-senior-base">篩選進貨來源</span>
            </div>
            <SeniorSelect
              label=""
              className="max-w-xs mx-auto text-center"
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              options={["全部", ...mockSuppliers]}
            />
          </SeniorCard>

          {/* 歷史清單 - 按號數分群 */}
          <div className="space-y-10">
            {Object.entries(groupedRestocks).sort().map(([size, items]) => (
              <div key={size} className="space-y-4">
                <div className="flex items-center gap-3 px-2 border-b-2 border-border-idle pb-2">
                  <div className="bg-slate-800 text-white px-4 py-1 rounded-xl font-black text-sm">{size}</div>
                  <h3 className="text-senior-lg font-black text-slate-800">進貨 / 庫存明細</h3>
                </div>
                <div className="grid gap-4">
                  {items.map(item => (
                    <SeniorCard key={item.id} className="bg-white space-y-4">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="text-[11px] font-black text-slate-400 tracking-widest">{item.date.replace("T", " ")}</p>
                          <h4 className="text-senior-lg font-black text-slate-800">{item.supplier}</h4>
                        </div>
                        <div className="bg-accent-surface border border-accent-border/50 px-4 py-2 rounded-2xl text-center shadow-sm">
                          <p className="text-[10px] font-black text-accent uppercase tracking-tighter mb-0.5">每噸單價</p>
                          <p className="text-xl text-accent font-black leading-tight">${item.cost.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <Package size={20} className="text-primary" />
                          <span className="text-sm font-bold text-slate-500">{item.spec}</span>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">目前剩餘</span>
                          <span className={`text-senior-xl font-black ${item.qty > 0 ? 'text-primary' : 'text-danger line-through opacity-50'}`}>{item.qty}</span>
                          <span className="text-xs font-bold text-slate-400 text-senior-base">噸</span>
                        </div>
                      </div>
                    </SeniorCard>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-senior-xl font-black text-slate-700">歷史出貨紀錄</h2>
            <span className="text-sm font-bold text-slate-500 bg-surface px-3 py-1 rounded-full border border-border-idle">{shipmentHistory.length} 筆紀錄</span>
          </div>

          {shipmentHistory.length === 0 ? (
            <div className="bg-surface border-2 border-dashed border-border-idle rounded-[32px] p-12 text-center">
              <p className="text-slate-400 font-bold text-lg">目前尚無出貨紀錄</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {shipmentHistory.map(item => (
                <SeniorCard key={item.id} variant="accent" className="bg-white border-accent-border/20 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-accent-border/10">
                    <span className="text-xs font-black text-slate-400 tracking-widest">{item.date.replace("T", " ")}</span>
                    <span className="bg-accent-surface text-accent px-3 py-1 rounded-lg text-xs font-black tracking-wide border border-accent-border/30">已出貨</span>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-slate-800">{item.spec}</h3>
                      <p className="text-sm font-bold text-slate-500 bg-surface px-3 py-1 rounded-lg inline-block border border-border-idle">{item.note}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-4xl font-black text-accent">-{item.qty}</span>
                      <span className="text-sm font-bold text-slate-400 ml-1">噸</span>
                    </div>
                  </div>

                  {/* FIFO 詳細明細: 顯示扣了哪些廠商 */}
                  <div className="bg-accent-surface/30 rounded-2xl p-4 mt-2 space-y-2 border border-accent-border/20">
                    <p className="text-xs font-bold text-accent flex items-center gap-1">
                      <TrendingUp size={14} /> 庫存扣除明細 (FIFO)
                    </p>
                    <ul className="space-y-2">
                      {item.sources?.map((s, i) => (
                        <li key={i} className="flex justify-between items-center text-sm">
                          <span className="font-bold text-slate-700 flex items-center gap-2">
                            <Building2 size={14} className="text-primary/60" /> {s.supplier}
                          </span>
                          <span className="text-slate-600 font-black">
                            扣除 {s.qty} 噸 <span className="text-xs text-slate-400 font-normal ml-1">(單價 ${s.cost.toLocaleString()})</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </SeniorCard>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
