"use client";

import { useState } from "react";
import { Package, TrendingUp, History, Activity, Building2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PageHeader } from "@/components/ui-senior/PageHeader";
import { SeniorCard } from "@/components/ui-senior/SeniorCard";

export default function Home() {
  const [selectedChartSize, setSelectedChartSize] = useState("#4");

  // --- Mock Data ---
  const mockInventory = [
    {
      code: "4分筋", name: "#4 (D13) 標準筋", qty: 39,
      suppliers: [
        { name: "東鋼", qty: 20, color: "bg-primary" },
        { name: "豐興", qty: 15, color: "bg-primary/60" },
        { name: "海光", qty: 4, color: "bg-primary/30" }
      ]
    },
    {
      code: "3分筋", name: "#3 (D10) 細筋", qty: 100,
      suppliers: [
        { name: "威致", qty: 50, color: "bg-primary" },
        { name: "東鋼", qty: 30, color: "bg-primary/60" },
        { name: "豐興", qty: 20, color: "bg-primary/30" }
      ]
    },
    {
      code: "5分筋", name: "#5 (D16) 主筋", qty: 12,
      suppliers: [
        { name: "海光", qty: 10, color: "bg-accent" },
        { name: "東鋼", qty: 2, color: "bg-accent/60" }
      ]
    },
  ];

  const mockChartData = [
    { month: '10月', "#3": 18500, "#4": 19000, "#5": 19200, "#6": 19500 },
    { month: '11月', "#3": 19200, "#4": 19500, "#5": 19800, "#6": 20000 },
    { month: '12月', "#3": 20500, "#4": 20800, "#5": 21000, "#6": 21500 },
    { month: '1月', "#3": 21200, "#4": 21500, "#5": 21800, "#6": 22000 },
    { month: '2月', "#3": 20800, "#4": 21000, "#5": 21200, "#6": 21500 },
    { month: '3月', "#3": 21500, "#4": 21800, "#5": 22000, "#6": 22500 }
  ];

  const recentShipments = [
    {
      id: 101,
      date: "2025-02-26 14:00",
      spec: "4分筋 (#4 D13)",
      qty: 12,
      note: "工地 A 使用",
      sources: [{ supplier: "C 資源回收", qty: 12, cost: 19500 }]
    },
    {
      id: 102,
      date: "2025-02-25 09:30",
      spec: "3分筋 (#3 D10)",
      qty: 25,
      note: "工地 B 使用",
      sources: [{ supplier: "A 鋼鐵廠", qty: 25, cost: 21200 }]
    },
  ];

  const chartDataKeys = [
    { key: "#3", name: "3分 (#3)", color: "#10b981" },
    { key: "#4", name: "4分 (#4)", color: "#3b82f6" },
    { key: "#5", name: "5分 (#5)", color: "#f59e0b" },
    { key: "#6", name: "6分 (#6)", color: "#8b5cf6" },
  ];

  const activeLine = chartDataKeys.find(k => k.key === selectedChartSize);

  return (
    <div className="space-y-8 pb-32">
      <PageHeader
        title="管理總覽"
        icon={Activity}
        subtitle="快速掌握價格趨勢、庫存現況及最新出貨動態。"
      />

      {/* 1. 價格走勢圖表 */}
      <SeniorCard className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-senior-lg font-black text-slate-700 flex items-center gap-2">
            <TrendingUp className="text-primary" size={24} /> 鋼筋價格走勢
          </h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 snap-x hide-scrollbar">
          {chartDataKeys.map(k => (
            <button
              key={k.key}
              onClick={() => setSelectedChartSize(k.key)}
              className={`snap-center shrink-0 px-4 py-3 rounded-2xl font-black text-sm transition-all active:scale-95 ${selectedChartSize === k.key
                  ? "bg-primary text-white shadow-md shadow-blue-200"
                  : "bg-white border-2 border-border-idle text-slate-500 hover:border-border-hover"
                }`}
            >
              {k.name}
            </button>
          ))}
        </div>

        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockChartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }}
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${(value/1000).toFixed(1)}k`}
                dx={-10}
              />
              <Tooltip
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 700, padding: '12px 20px' }}
                itemStyle={{ color: activeLine?.color, fontWeight: 900 }}
                formatter={(value: number) => [`$${Number(value).toLocaleString()}`, activeLine?.name]}
              />
              <Line
                type="monotone"
                dataKey={selectedChartSize}
                stroke={activeLine?.color}
                strokeWidth={6}
                dot={{ r: 6, strokeWidth: 3, fill: '#fff', stroke: activeLine?.color }}
                activeDot={{ r: 10, strokeWidth: 0 }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SeniorCard>

      {/* 2. 目前庫存分布 */}
      <section className="space-y-4">
        <h2 className="text-senior-lg font-black text-slate-700 flex items-center gap-2 px-2">
          <Package className="text-primary" size={24} /> 庫存現況
        </h2>
        <div className="grid gap-4">
          {mockInventory.map((item) => (
            <SeniorCard
              key={item.code}
              className="space-y-5"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">規格編號 {item.code}</p>
                  <h3 className="text-senior-lg font-black text-slate-800 leading-tight">{item.name}</h3>
                </div>
                <div className="flex flex-col items-end bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 shadow-inner">
                  <span className="text-3xl font-black text-primary tracking-tighter">{item.qty}</span>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter -mt-1">總噸數</p>
                </div>
              </div>

              {item.suppliers && item.suppliers.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <div className="flex w-full h-3 rounded-full overflow-hidden bg-slate-100 shadow-inner ring-4 ring-slate-50/50">
                    {item.suppliers.map((sup, idx) => (
                      <div
                        key={idx}
                        className={`h-full ${sup.color} transition-all duration-1000`}
                        style={{ width: `${(sup.qty / item.qty) * 100}%` }}
                        title={`${sup.name}: ${sup.qty}`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-3">
                    {item.suppliers.map((sup, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${sup.color} shadow-sm`}></span>
                        <span className="text-xs text-slate-500 font-bold">
                          {sup.name} <span className="font-black text-slate-800 ml-1">{sup.qty}t</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </SeniorCard>
          ))}
        </div>
      </section>

      {/* 3. 最近出貨動態 */}
      <section className="space-y-4">
        <h2 className="text-senior-lg font-black text-slate-700 flex items-center gap-2 px-2">
          <History className="text-accent" size={24} /> 最近出貨動態
        </h2>
        <div className="grid gap-4">
          {recentShipments.map(item => (
            <SeniorCard key={item.id} variant="accent" className="bg-white space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-accent-border/10">
                <span className="text-[11px] font-black text-slate-400 tracking-widest">{item.date}</span>
                <span className="bg-accent-surface text-accent px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border border-accent-border/30 shadow-sm uppercase">Shipped</span>
              </div>

              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-slate-800 leading-tight">{item.spec}</h4>
                  <p className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-xl inline-block border border-slate-100">{item.note}</p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-accent tracking-tighter">-{item.qty}</span>
                  <span className="text-xs font-bold text-slate-400 ml-1">噸</span>
                </div>
              </div>

              <div className="bg-accent-surface/30 rounded-2xl p-4 mt-2 space-y-2 border border-accent-border/10">
                <ul className="space-y-2">
                  {item.sources?.map((s, i) => (
                    <li key={i} className="flex justify-between items-center text-[13px]">
                      <span className="font-bold text-slate-600 flex items-center gap-2">
                        <Building2 size={14} className="text-accent/50" /> {s.supplier}
                      </span>
                      <span className="text-slate-500 font-black">扣除 {s.qty} 噸</span>
                    </li>
                  ))}
                </ul>
              </div>
            </SeniorCard>
          ))}
        </div>
      </section>
    </div>
  );
}
