import { Link } from "wouter";
import { useState } from "react";
import { Home, Zap, Search } from "lucide-react";
import { TOOLS, CATS, CAT_ICONS, ToolIcon } from "@/lib/tools";

export default function ToolsHub() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = TOOLS.filter(t =>
    (cat === "All" || t.cat === cat) &&
    (!search || t.title.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const liveCount = TOOLS.filter(t => t.live).length;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-14">
          <Link href="/"><button type="button" aria-label="Home" className="text-muted-foreground hover:text-white"><Home className="w-5 h-5" /></button></Link>
          <Zap className="w-5 h-5 text-emerald-400" />
          <div className="flex-1">
            <h1 className="text-base font-bold leading-none">All Tools</h1>
            <p className="text-[11px] text-muted-foreground">{liveCount} tools live · {TOOLS.length} total</p>
          </div>
        </div>

        {/* Search */}
        <div className="container pb-2">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search all tools…"
              className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          {/* 6 categories only */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {CATS.map(c => {
              const CatIcon = CAT_ICONS[c] ?? Zap;
              return (
                <button type="button" key={c} onClick={() => setCat(c)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${cat === c ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>
                  <CatIcon className="w-3.5 h-3.5" strokeWidth={2.2} />{c}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container py-4 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { val:TOOLS.length, label:"Total tools", color:"text-emerald-400", border:"border-emerald-500/20" },
            { val:liveCount, label:"Working now", color:"text-blue-400", border:"border-blue-500/20" },
            { val:TOOLS.length - liveCount, label:"Coming soon", color:"text-amber-400", border:"border-amber-500/20" },
          ].map(s => (
            <div key={s.label} className={`glass rounded-2xl p-3 border ${s.border} text-center`}>
              <p className={`text-xl font-bold ${s.color}`}>{s.val}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
          {filtered.map(tool => (
            tool.live ? (
              <Link key={tool.id} href={tool.href}>
                <div className="glass rounded-2xl p-3.5 border border-emerald-500/15 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer group h-full active:scale-95">
                  <ToolIcon tool={tool} />
                  <p className="font-bold text-sm leading-tight mb-1 group-hover:text-emerald-400 transition-colors">{tool.title}</p>
                  <p className="text-[11px] text-muted-foreground leading-snug">{tool.desc}</p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">LIVE</span>
                </div>
              </Link>
            ) : (
              <div key={tool.id} className="glass rounded-2xl p-3.5 border border-border/20 opacity-50 cursor-not-allowed h-full">
                <ToolIcon tool={tool} dim />
                <p className="font-bold text-sm leading-tight mb-1">{tool.title}</p>
                <p className="text-[11px] text-muted-foreground leading-snug">{tool.desc}</p>
                <span className="inline-block mt-2 text-[10px] font-bold text-muted-foreground bg-border/20 px-2 py-0.5 rounded-full">SOON</span>
              </div>
            )
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-muted-foreground">No tools match "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
