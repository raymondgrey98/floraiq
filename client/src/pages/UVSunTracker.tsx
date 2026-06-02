import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft, Sun } from "lucide-react";

const UV_LEVELS = [
  { range:"0–2", level:"Low", color:"bg-green-500", textColor:"text-green-400", desc:"Safe for most. Sunscreen optional.", plants:"Full sun plants thrive. 8+ hrs ideal." },
  { range:"3–5", level:"Moderate", color:"bg-yellow-400", textColor:"text-yellow-400", desc:"Sunscreen SPF 30+. Hat recommended.", plants:"Most vegetable crops at ideal growth. Water deeply." },
  { range:"6–7", level:"High", color:"bg-orange-400", textColor:"text-orange-400", desc:"Limit midday exposure. SPF 30+ essential.", plants:"Mulch to retain moisture. Young seedlings may wilt — water morning and evening." },
  { range:"8–10", level:"Very High", color:"bg-red-500", textColor:"text-red-400", desc:"Minimize 10am–4pm exposure. SPF 50+.", plants:"Shade cloth for sensitive crops. Move potted plants to partial shade." },
  { range:"11+", level:"Extreme", color:"bg-purple-500", textColor:"text-purple-400", desc:"Avoid all unprotected outdoor time.", plants:"All crops stress. Overhead irrigation to cool. Only shade-tolerant plants unprotected." },
];

const SARAWAK_MONTHLY = [
  { month:"Jan", avg:8, rainfall:"High", farmTip:"Heavy monsoon rain. Great for kangkung. Watch for fungal disease in high-value crops." },
  { month:"Feb", avg:9, rainfall:"Med-High", farmTip:"UV increasing. Check irrigation. Plant heat-tolerant crops." },
  { month:"Mar", avg:10, rainfall:"Med", farmTip:"Very high UV. Shade cloth advised for nursery seedlings." },
  { month:"Apr", avg:11, rainfall:"Low", farmTip:"Peak UV. Water early morning. Mulch all beds. Risk of heat stress." },
  { month:"May", avg:11, rainfall:"Low", farmTip:"Durian season — high UV good for fruit sugar. Vegetable crops need watering 2x daily." },
  { month:"Jun", avg:12, rainfall:"Low", farmTip:"Extreme UV. 11am-3pm = no outdoor work. Plant in evening. Drip irrigation best." },
  { month:"Jul", avg:12, rainfall:"Low", farmTip:"Extreme UV continues. Best time for drying fish, pepper, and produce." },
  { month:"Aug", avg:11, rainfall:"Low-Med", farmTip:"Still very high UV. Transition to planting fast-growing crops for October harvest." },
  { month:"Sep", avg:10, rainfall:"Med", farmTip:"UV easing. Good time to establish new planting beds. Transition season." },
  { month:"Oct", avg:9, rainfall:"Med-High", farmTip:"UV dropping with monsoon approach. Best growing month — high rainfall + moderate UV." },
  { month:"Nov", avg:8, rainfall:"High", farmTip:"Monsoon arrives. UV lower. Excellent growing conditions. Padi season." },
  { month:"Dec", avg:7, rainfall:"High", farmTip:"UV lowest of year. Focus on padi harvest and replanting fast crops." },
];

const PLANT_SUN = [
  { plant:"Durian", sun:"Full sun", hours:"8-12hrs", note:"Needs intense UV for fruit sweetness" },
  { plant:"Pepper (Black)", sun:"Full sun", hours:"6-8hrs", note:"Bright light essential for berry development" },
  { plant:"Tomato", sun:"Full sun", hours:"6-8hrs", note:"High UV increases lycopene content" },
  { plant:"Chili", sun:"Full sun", hours:"6-8hrs", note:"Capsaicin content increases with UV exposure" },
  { plant:"Kangkung", sun:"Full to partial", hours:"4-6hrs", note:"Grows fast in any light — very tolerant" },
  { plant:"Lettuce", sun:"Partial shade", hours:"4hrs", note:"Bolts (flowers too early) in extreme UV — shade cloth needed" },
  { plant:"Ginger", sun:"Partial shade", hours:"3-4hrs", note:"Prefers dappled light under taller plants" },
  { plant:"Turmeric", sun:"Partial shade", hours:"3-5hrs", note:"Under canopy in wild — shade tolerant" },
  { plant:"Orchid (Vanilla)", sun:"Filtered light", hours:"3-4hrs", note:"Needs bright but indirect light" },
  { plant:"Mushrooms", sun:"Shade/Indirect", hours:"0-1hrs", note:"Direct sun kills spawn — keep shaded" },
];

export default function UVSunTracker() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [tab, setTab] = useState<"now"|"calendar"|"plants">("now");
  const [uvInput, setUvInput] = useState(10);

  const current = SARAWAK_MONTHLY[month];
  const uvLevel = UV_LEVELS.find(l => {
    const [min, max] = l.range.split("–").map(Number);
    return uvInput >= min && (isNaN(max) || uvInput <= max);
  }) || UV_LEVELS[UV_LEVELS.length - 1];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <Sun className="w-6 h-6 text-yellow-400" />
          <div><h1 className="text-xl font-bold">UV & Sun Tracker</h1><p className="text-xs text-muted-foreground">UV guide for farming and plant care in Malaysia</p></div>
        </div>
        <div className="container pb-3 flex gap-2">
          {[["now","☀️ UV Guide"],["calendar","📅 Monthly"],["plants","🌱 Plant Sun"]].map(([v,l]) => (
            <button type="button" key={v} onClick={() => setTab(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${tab === v ? "bg-yellow-400 text-black" : "glass border border-border/50 text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="container py-6 max-w-3xl space-y-5">
        {tab === "now" && <>
          <div className="glass rounded-xl p-6 border border-yellow-500/30 text-center">
            <p className="text-sm text-muted-foreground mb-2">Enter current UV Index (from weather app or estimate by month)</p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <button type="button" onClick={() => setUvInput(Math.max(0,uvInput-1))} className="w-10 h-10 rounded-full glass border border-border/50 text-xl font-bold">−</button>
              <div className="text-6xl font-bold text-yellow-400">{uvInput}</div>
              <button type="button" onClick={() => setUvInput(Math.min(14,uvInput+1))} className="w-10 h-10 rounded-full glass border border-border/50 text-xl font-bold">+</button>
            </div>
            <div className={`inline-block px-6 py-2 rounded-full text-lg font-bold text-white ${uvLevel.color} mb-3`}>{uvLevel.level}</div>
            <p className="text-sm text-muted-foreground">{uvLevel.desc}</p>
          </div>
          <div className="glass rounded-xl p-5 border border-emerald-500/20">
            <h3 className="font-bold mb-2 text-emerald-400">🌱 Farming at UV {uvInput}</h3>
            <p className="text-sm text-muted-foreground">{uvLevel.plants}</p>
          </div>
          <div className="space-y-2">
            {UV_LEVELS.map(l => (
              <div key={l.level} className={`glass rounded-xl p-3 border border-border/40 flex items-center gap-3 ${uvLevel.level === l.level ? "ring-1 ring-yellow-400" : ""}`}>
                <div className={`w-10 h-10 rounded-full ${l.color} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>{l.range}</div>
                <div><p className={`font-bold ${l.textColor}`}>{l.level}</p><p className="text-xs text-muted-foreground">{l.desc}</p></div>
              </div>
            ))}
          </div>
        </>}
        {tab === "calendar" && <>
          <div className="grid grid-cols-6 gap-1.5 mb-4">
            {SARAWAK_MONTHLY.map((m, i) => (
              <button type="button" key={m.month} onClick={() => setMonth(i)} className={`py-2 rounded-lg text-xs font-bold transition-all ${month === i ? "bg-yellow-400 text-black" : "glass border border-border/40 text-muted-foreground"}`}>{m.month}</button>
            ))}
          </div>
          <div className="glass rounded-xl p-5 border border-yellow-500/30 text-center">
            <p className="text-sm text-muted-foreground mb-1">Average Peak UV — {SARAWAK_MONTHLY[month].month}</p>
            <p className="text-5xl font-bold text-yellow-400 mb-2">{current.avg}</p>
            <span className={`text-sm font-bold px-3 py-1 rounded-full text-white ${UV_LEVELS.find(l => { const [min,max] = l.range.split("–").map(Number); return current.avg >= min && (isNaN(max) || current.avg <= max); })?.color}`}>{UV_LEVELS.find(l => { const [min,max] = l.range.split("–").map(Number); return current.avg >= min && (isNaN(max) || current.avg <= max); })?.level}</span>
          </div>
          <div className="glass rounded-xl p-5 border border-emerald-500/20">
            <p className="text-xs font-bold text-muted-foreground mb-1">🌾 Farming tip</p>
            <p className="text-sm">{current.farmTip}</p>
          </div>
          <div className="glass rounded-xl p-3 border border-blue-500/20">
            <p className="text-xs font-bold text-muted-foreground mb-2">UV across the year</p>
            <div className="flex items-end gap-1 h-16">
              {SARAWAK_MONTHLY.map((m, i) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className={`w-full rounded-sm ${i === month ? "bg-yellow-400" : "bg-yellow-400/40"}`} style={{height:`${(m.avg/14)*56}px`}} />
                  <span className="text-[8px] text-muted-foreground">{m.month.slice(0,1)}</span>
                </div>
              ))}
            </div>
          </div>
        </>}
        {tab === "plants" && (
          <div className="space-y-2">
            {PLANT_SUN.map(p => (
              <div key={p.plant} className="glass rounded-xl p-4 border border-border/40">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-bold">{p.plant}</p>
                  <span className="text-xs font-bold text-yellow-400">{p.hours}/day</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{p.sun}</p>
                <p className="text-xs text-emerald-400">💡 {p.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
