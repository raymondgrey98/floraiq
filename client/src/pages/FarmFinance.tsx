import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Download, TrendingUp, TrendingDown, DollarSign, Trash2, BarChart3, Calendar, Filter } from "lucide-react";

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  date: string;
  crop?: string;
}

const INCOME_CATS = ["Crop Sales", "Livestock Sales", "Government Subsidy", "Land Rental", "Contract Farming", "Other Income"];
const EXPENSE_CATS = ["Seeds & Seedlings", "Fertilizer (Baja)", "Pesticide", "Labour", "Equipment & Tools", "Fuel & Transport", "Water & Irrigation", "Land Rent", "Loan Repayment", "Packaging", "Other Expense"];
const CROPS = ["Padi", "Getah (Rubber)", "Kelapa Sawit", "Durian", "Pisang", "Sayur-sayuran", "Tomato", "Cili", "Timun", "Nenas", "Betik", "Jagung", "Ubi Kayu", "Kelapa", "Other"];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function fmt(n: number) {
  return `RM ${n.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function FarmFinance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [form, setForm] = useState({
    type: "income" as "income" | "expense",
    category: "",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    crop: "",
  });
  const [activeTab, setActiveTab] = useState<"dashboard" | "transactions" | "report">("dashboard");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("floraiq_finance");
      if (stored) setTransactions(JSON.parse(stored));
    } catch {}
  }, []);

  function save(txns: Transaction[]) {
    setTransactions(txns);
    localStorage.setItem("floraiq_finance", JSON.stringify(txns));
  }

  function addTransaction() {
    if (!form.category || !form.amount || !form.date) return;
    const txn: Transaction = {
      id: Date.now().toString(),
      type: form.type,
      category: form.category,
      description: form.description,
      amount: parseFloat(form.amount),
      date: form.date,
      crop: form.crop || undefined,
    };
    save([txn, ...transactions]);
    setForm({ type: "income", category: "", description: "", amount: "", date: new Date().toISOString().split("T")[0], crop: "" });
    setShowForm(false);
  }

  function deleteTransaction(id: string) {
    save(transactions.filter(t => t.id !== id));
  }

  // Filtering
  const filtered = transactions.filter(t => {
    const monthMatch = filterMonth === "all" || t.date.startsWith(filterMonth);
    const typeMatch = filterType === "all" || t.type === filterType;
    return monthMatch && typeMatch;
  });

  const totalIncome  = filtered.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const netProfit    = totalIncome - totalExpense;

  // Monthly breakdown for current year
  const year = new Date().getFullYear();
  const monthly = MONTHS.map((m, i) => {
    const prefix = `${year}-${String(i + 1).padStart(2, "0")}`;
    const inc = transactions.filter(t => t.type === "income"  && t.date.startsWith(prefix)).reduce((s, t) => s + t.amount, 0);
    const exp = transactions.filter(t => t.type === "expense" && t.date.startsWith(prefix)).reduce((s, t) => s + t.amount, 0);
    return { month: m, income: inc, expense: exp, profit: inc - exp };
  });

  // Category breakdown
  const catBreakdown = (type: "income" | "expense") => {
    const cats: Record<string, number> = {};
    filtered.filter(t => t.type === type).forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + t.amount;
    });
    return Object.entries(cats).sort((a, b) => b[1] - a[1]);
  };

  // Export CSV
  function exportCSV() {
    const rows = [
      ["Date", "Type", "Category", "Crop", "Description", "Amount (RM)"],
      ...filtered.map(t => [t.date, t.type, t.category, t.crop || "", t.description, t.amount.toFixed(2)]),
    ];
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `farm_finance_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  }

  // Available months
  const allMonths = [...new Set(transactions.map(t => t.date.slice(0, 7)))].sort().reverse();
  const maxBar = Math.max(...monthly.map(m => Math.max(m.income, m.expense)), 1);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/farm"><button type="button" className="text-muted-foreground hover:text-foreground"><ChevronLeft className="w-5 h-5" /></button></Link>
            <DollarSign className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-bold">Farm Finance</h1>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={exportCSV} variant="outline" size="sm" className="border-border/50 hidden sm:flex">
              <Download className="w-4 h-4 mr-1" />Export CSV
            </Button>
            <Button type="button" onClick={() => setShowForm(true)} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Plus className="w-4 h-4 mr-1" />Add
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="container flex gap-1 pb-3 overflow-x-auto">
          {[
            { id: "dashboard",    label: "📊 Dashboard" },
            { id: "transactions", label: "📋 Transactions" },
            { id: "report",       label: "📈 Monthly Report" },
          ].map(tab => (
            <button type="button" key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-emerald-500 text-white" : "text-muted-foreground hover:text-foreground"}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container py-6 max-w-4xl">

        {/* ── ADD FORM ── */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <div className="glass rounded-2xl border border-emerald-500/30 w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
              <h2 className="font-bold text-lg">Add Transaction</h2>

              {/* Income / Expense toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setForm(f => ({ ...f, type: "income", category: "" }))}
                  className={`py-2 rounded-xl text-sm font-bold transition ${form.type === "income" ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>
                  ↑ Income
                </button>
                <button type="button" onClick={() => setForm(f => ({ ...f, type: "expense", category: "" }))}
                  className={`py-2 rounded-xl text-sm font-bold transition ${form.type === "expense" ? "bg-red-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>
                  ↓ Expense
                </button>
              </div>

              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                aria-label="Category" title="Category"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">Select Category...</option>
                {(form.type === "income" ? INCOME_CATS : EXPENSE_CATS).map(c => <option key={c}>{c}</option>)}
              </select>

              <select value={form.crop} onChange={e => setForm(f => ({ ...f, crop: e.target.value }))}
                aria-label="Crop" title="Crop"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">Crop (optional)...</option>
                {CROPS.map(c => <option key={c}>{c}</option>)}
              </select>

              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Description (optional)"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />

              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">RM</span>
                  <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    placeholder="0.00" min="0" step="0.01"
                    className="w-full bg-background border border-border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div className="flex gap-2">
                <Button type="button" onClick={addTransaction} disabled={!form.category || !form.amount}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50">Save</Button>
                <Button type="button" onClick={() => setShowForm(false)} variant="outline" className="border-border/50">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {activeTab === "dashboard" && (
          <div className="space-y-5">
            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass rounded-xl p-4 border border-emerald-500/30">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3 text-emerald-400" />Total Income</p>
                <p className="text-lg font-bold text-emerald-400">{fmt(totalIncome)}</p>
              </div>
              <div className="glass rounded-xl p-4 border border-red-500/30">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><TrendingDown className="w-3 h-3 text-red-400" />Total Expense</p>
                <p className="text-lg font-bold text-red-400">{fmt(totalExpense)}</p>
              </div>
              <div className={`glass rounded-xl p-4 border ${netProfit >= 0 ? "border-emerald-500/30" : "border-red-500/30"}`}>
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><BarChart3 className="w-3 h-3" />Net Profit</p>
                <p className={`text-lg font-bold ${netProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>{fmt(netProfit)}</p>
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2 flex-wrap items-center">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
                aria-label="Filter by month" title="Filter by month"
                className="bg-background border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="all">All Time</option>
                {allMonths.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              {["all","income","expense"].map(t => (
                <button type="button" key={t} onClick={() => setFilterType(t as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${filterType === t ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>
                  {t === "all" ? "All" : t === "income" ? "Income" : "Expense"}
                </button>
              ))}
            </div>

            {/* Category breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass rounded-xl p-5 border border-border/50">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-3">Income by Category</p>
                {catBreakdown("income").length === 0
                  ? <p className="text-xs text-muted-foreground">No income recorded</p>
                  : catBreakdown("income").map(([cat, amt]) => (
                    <div key={cat} className="flex justify-between items-center py-1.5 border-b border-border/30 last:border-0">
                      <span className="text-sm text-muted-foreground">{cat}</span>
                      <span className="text-sm font-semibold text-emerald-400">{fmt(amt)}</span>
                    </div>
                  ))
                }
              </div>
              <div className="glass rounded-xl p-5 border border-border/50">
                <p className="text-xs font-bold text-red-400 uppercase tracking-wide mb-3">Expense by Category</p>
                {catBreakdown("expense").length === 0
                  ? <p className="text-xs text-muted-foreground">No expenses recorded</p>
                  : catBreakdown("expense").map(([cat, amt]) => (
                    <div key={cat} className="flex justify-between items-center py-1.5 border-b border-border/30 last:border-0">
                      <span className="text-sm text-muted-foreground">{cat}</span>
                      <span className="text-sm font-semibold text-red-400">{fmt(amt)}</span>
                    </div>
                  ))
                }
              </div>
            </div>

            {transactions.length === 0 && (
              <div className="text-center py-16">
                <DollarSign className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground/60 mt-1">Tap + Add to record income or expenses</p>
              </div>
            )}
          </div>
        )}

        {/* ── TRANSACTIONS ── */}
        {activeTab === "transactions" && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap items-center">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
                aria-label="Filter by month" title="Filter by month"
                className="bg-background border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none">
                <option value="all">All Time</option>
                {allMonths.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              {["all","income","expense"].map(t => (
                <button type="button" key={t} onClick={() => setFilterType(t as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${filterType === t ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>
                  {t === "all" ? "All" : t === "income" ? "Income" : "Expense"}
                </button>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">No transactions found</div>
            )}

            <div className="space-y-2">
              {filtered.map(t => (
                <div key={t.id} className="glass rounded-xl p-4 border border-border/50 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${t.type === "income" ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
                    {t.type === "income" ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate">{t.category}</span>
                      {t.crop && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">{t.crop}</span>}
                    </div>
                    {t.description && <p className="text-xs text-muted-foreground truncate">{t.description}</p>}
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Calendar className="w-3 h-3" />{t.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`font-bold ${t.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                      {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                    </p>
                    <button type="button" onClick={() => deleteTransaction(t.id)}
                      className="text-muted-foreground hover:text-red-400 transition mt-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MONTHLY REPORT ── */}
        {activeTab === "report" && (
          <div className="space-y-5">
            <div className="glass rounded-xl p-5 border border-border/50">
              <p className="text-sm font-bold mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-emerald-400" />Monthly Overview {year} (RM)</p>
              <div className="space-y-3">
                {monthly.map(m => (
                  <div key={m.month}>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span className="font-semibold text-foreground w-8">{m.month}</span>
                      <span className="text-emerald-400">+{fmt(m.income)}</span>
                      <span className="text-red-400">-{fmt(m.expense)}</span>
                      <span className={m.profit >= 0 ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>{fmt(m.profit)}</span>
                    </div>
                    {(m.income > 0 || m.expense > 0) && (
                      <div className="flex gap-1 h-3">
                        <div className="bg-emerald-500/60 rounded-sm" style={{ width: `${(m.income / maxBar) * 100}%`, minWidth: m.income > 0 ? "2px" : "0" }} />
                        <div className="bg-red-500/60 rounded-sm" style={{ width: `${(m.expense / maxBar) * 100}%`, minWidth: m.expense > 0 ? "2px" : "0" }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Yearly summary */}
            <div className="glass rounded-xl p-5 border border-emerald-500/20">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-4">Yearly Summary {year}</p>
              {[
                { label: "Total Income", value: transactions.filter(t => t.type === "income" && t.date.startsWith(String(year))).reduce((s, t) => s + t.amount, 0), color: "text-emerald-400" },
                { label: "Total Expenses", value: transactions.filter(t => t.type === "expense" && t.date.startsWith(String(year))).reduce((s, t) => s + t.amount, 0), color: "text-red-400" },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                  <span className={`font-bold ${row.color}`}>{fmt(row.value)}</span>
                </div>
              ))}
              {(() => {
                const inc = transactions.filter(t => t.type === "income" && t.date.startsWith(String(year))).reduce((s, t) => s + t.amount, 0);
                const exp = transactions.filter(t => t.type === "expense" && t.date.startsWith(String(year))).reduce((s, t) => s + t.amount, 0);
                const net = inc - exp;
                return (
                  <div className="flex justify-between items-center pt-3">
                    <span className="font-bold">Net Profit / Loss</span>
                    <span className={`text-xl font-bold ${net >= 0 ? "text-emerald-400" : "text-red-400"}`}>{fmt(net)}</span>
                  </div>
                );
              })()}
            </div>

            <Button type="button" onClick={exportCSV} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
              <Download className="w-4 h-4 mr-2" />Export Full Report (CSV)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
