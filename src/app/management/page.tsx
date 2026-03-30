"use client";

import { useState } from "react";
import { Building2, Plus, Trash2, Ruler, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui-senior/PageHeader";
import { SeniorCard } from "@/components/ui-senior/SeniorCard";
import { SeniorInput } from "@/components/ui-senior/SeniorForm";
import { ActionButtonBar } from "@/components/ui-senior/ActionButtonBar";

// CNS 560 Standards
const CNS560_STANDARDS = [
  { code: "3分筋", name: "#3 (D10)" },
  { code: "4分筋", name: "#4 (D13)" },
  { code: "5分筋", name: "#5 (D16)" },
  { code: "6分筋", name: "#6 (D19)" },
];

export default function ManagementPage() {
  const [activeTab, setActiveTab] = useState<"suppliers" | "specs">("suppliers");
  
  // Suppliers State
  const [suppliers, setSuppliers] = useState(["A 公司", "B 貿易", "C 批發"]);
  const [newSupplier, setNewSupplier] = useState("");

  // Specs State
  const [specs, setSpecs] = useState(CNS560_STANDARDS);
  const [newSpecCode, setNewSpecCode] = useState("");
  const [newSpecName, setNewSpecName] = useState("");

  const addSupplier = () => {
    if (newSupplier.trim()) {
      setSuppliers([...suppliers, newSupplier.trim()]);
      setNewSupplier("");
    }
  };

  const addSpec = () => {
    if (newSpecCode.trim()) {
      setSpecs([...specs, { code: newSpecCode.trim(), name: newSpecName.trim() || newSpecCode.trim() }]);
      setNewSpecCode("");
      setNewSpecName("");
    }
  };

  return (
    <div className="space-y-8 pb-32">
      <PageHeader 
        title="基本資料管理" 
        icon={Building2} 
        subtitle="維護您的廠商清單與鋼筋規格標準。"
      />

      {/* 頁面切換 */}
      <div className="flex bg-surface p-2 rounded-[32px] border-2 border-border-idle mx-1">
        <button
          onClick={() => setActiveTab("suppliers")}
          className={`flex-1 btn-senior rounded-2xl transition-all ${activeTab === "suppliers" ? "bg-white shadow-md text-primary font-black border-2 border-border-idle" : "text-slate-400 font-bold"}`}
        >
          廠商名單
        </button>
        <button
          onClick={() => setActiveTab("specs")}
          className={`flex-1 btn-senior rounded-2xl transition-all ${activeTab === "specs" ? "bg-white shadow-md text-primary font-black border-2 border-border-idle" : "text-slate-400 font-bold"}`}
        >
          規格標準
        </button>
      </div>

      <div className="px-1">
        {activeTab === "suppliers" ? (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-senior-lg font-black text-slate-700 px-2">現有廠商列表</h2>
              <div className="grid gap-3">
                {suppliers.map((s, i) => (
                  <SeniorCard key={i} className="flex justify-between items-center p-5">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/5 p-3 rounded-2xl border border-primary/10">
                        <Building2 className="text-primary" size={24} />
                      </div>
                      <span className="text-senior-lg font-black text-slate-800">{s}</span>
                    </div>
                    <button onClick={() => setSuppliers(suppliers.filter((_, idx) => idx !== i))} className="text-danger/40 hover:text-danger hover:bg-red-50 p-3 rounded-2xl transition-all active:scale-90"><Trash2 size={24} /></button>
                  </SeniorCard>
                ))}
              </div>
            </div>

            <SeniorCard variant="accent" className="border-dashed space-y-5 bg-white mb-24">
              <SeniorInput
                label="新增廠商名稱"
                icon={Plus}
                placeholder="例如：台塑鋼鐵"
                value={newSupplier}
                onChange={(e) => setNewSupplier(e.target.value)}
              />
            </SeniorCard>
            <ActionButtonBar
              onSave={addSupplier}
              saveLabel="確認加入廠商"
              saveDisabled={!newSupplier.trim()}
            />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-senior-lg font-black text-slate-700 px-2">常用規格清單</h2>
              <div className="grid gap-3">
                {specs.map((s, i) => (
                  <SeniorCard key={i} className="flex justify-between items-center p-5">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/5 p-3 rounded-2xl border border-primary/10"><CheckCircle2 className="text-primary" size={24} /></div>
                      <div>
                        <span className="text-senior-lg block font-black text-slate-800 leading-tight">{s.code}</span>
                        <span className="text-xs text-slate-400 font-black tracking-wider uppercase">{s.name}</span>
                      </div>
                    </div>
                    <button onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))} className="text-danger/40 hover:text-danger hover:bg-red-50 p-3 rounded-2xl transition-all active:scale-90"><Trash2 size={24} /></button>
                  </SeniorCard>
                ))}
              </div>
            </div>

            <SeniorCard variant="accent" className="border-dashed space-y-6 bg-white mb-24">
              <label className="text-senior-lg block font-black text-accent ml-1">新增特殊規格</label>
              <div className="grid grid-cols-2 gap-4">
                <SeniorInput label="號數" placeholder="#號數" value={newSpecCode} onChange={(e) => setNewSpecCode(e.target.value)} />
                <SeniorInput label="備註" placeholder="D徑" value={newSpecName} onChange={(e) => setNewSpecName(e.target.value)} />
              </div>
            </SeniorCard>
            <ActionButtonBar
              onSave={addSpec}
              saveLabel="加入規格清單"
              saveDisabled={!newSpecCode.trim()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
