import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const SIGNS = [
  { sign:"Roots coming out of drainage holes", severity:"Urgent", emoji:"🚨" },
  { sign:"Roots circling inside pot (root-bound)", severity:"Urgent", emoji:"🚨" },
  { sign:"Plant wilts quickly after watering", severity:"High", emoji:"⚠️" },
  { sign:"Water drains in seconds (no absorption)", severity:"High", emoji:"⚠️" },
  { sign:"Plant much larger than pot", severity:"Medium", emoji:"🟡" },
  { sign:"Soil surface completely covered with roots", severity:"Medium", emoji:"🟡" },
  { sign:"Plant topples easily / unstable", severity:"Medium", emoji:"🟡" },
  { sign:"Not repotted in 2+ years", severity:"Low", emoji:"ℹ️" },
  { sign:"Salt crust on soil surface (white deposits)", severity:"Low", emoji:"ℹ️" },
];

const POT_SIZES = [
  { current:"3\" (8cm)", next:"4–5\" (10–13cm)", note:"Small seedling stage" },
  { current:"4\" (10cm)", next:"6\" (15cm)", note:"Young plant" },
  { current:"6\" (15cm)", next:"8–10\" (20–25cm)", note:"Standard houseplant" },
  { current:"8\" (20cm)", next:"10–12\" (25–30cm)", note:"Medium plant" },
  { current:"10\" (25cm)", next:"12–14\" (30–35cm)", note:"Large plant" },
  { current:"12\"+ (30cm+)", next:"Same pot (just refresh soil)", note:"Large mature plant — refresh annually" },
];

const MIXES: { type: string; emoji: string; recipe: string; plants: string }[] = [
  { type:"General Tropical Mix", emoji:"🌿", recipe:"60% potting soil + 30% perlite/sand + 10% compost", plants:"Monstera, pothos, philodendron, ferns, most houseplants" },
  { type:"Succulent/Cactus Mix", emoji:"🌵", recipe:"30% potting soil + 50% coarse sand + 20% perlite", plants:"Cactus, aloe, agave, sedum, echeveria" },
  { type:"Orchid Mix", emoji:"🌸", recipe:"60% bark chips + 20% perlite + 20% charcoal", plants:"Phalaenopsis, Dendrobium, all epiphytic orchids" },
  { type:"African Violet / Herb Mix", emoji:"🌱", recipe:"50% potting soil + 20% perlite + 30% compost", plants:"African violet, herbs (basil, mint), begonia" },
  { type:"Heavy Feeders (Fruiting)", emoji:"🍅", recipe:"40% potting soil + 30% compost + 20% perlite + 10% slow-release fertilizer", plants:"Chili, tomato, eggplant, pepper grown in containers" },
  { type:"Malaysian Clay Soil Breaker", emoji:"🪱", recipe:"30% local garden soil + 30% compost + 30% rice husk ash + 10% perlite", plants:"Good for tropical plants. Improves heavy Sarawak red clay soil." },
];

const STEPS = [
  { step:"Choose pot", detail:"Go 1–2\" larger than current pot. NEVER jump more than 2 sizes — too much soil stays wet and rots roots." },
  { step:"Prepare drainage", detail:"Add 2–3cm of gravel or broken pot shards at bottom. Essential for Malaysia's humid climate." },
  { step:"Water plant first", detail:"Water the plant 1–2 days before repotting. Moist soil holds together. Dry soil falls apart and damages roots." },
  { step:"Remove from old pot", detail:"Squeeze plastic pot sides. Gently tip and slide out. Do NOT pull the stem — support the root ball." },
  { step:"Inspect and prune roots", detail:"Remove dead/black roots (soft, smelly). Untangle circling roots. Trim thick circling roots by 1/3 with clean scissors." },
  { step:"Add fresh soil", detail:"Add enough mix so plant sits at same level as before. Don't bury stem deeper." },
  { step:"Position plant", detail:"Center plant. Fill gaps with mix, firming gently. Leave 2cm gap at top for watering." },
  { step:"Water thoroughly", detail:"Water slowly until drains from bottom. Let settle. Don't fertilize for 4–6 weeks — new roots are sensitive." },
  { step:"Recovery care", detail:"Keep in bright indirect light for 2 weeks. Avoid direct sun. Normal wilting for 1–3 days is expected." },
];

export default function RepottingGuide() {
  const [tab, setTab] = useState<"signs"|"steps"|"mixes"|"pots">("signs");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🪴</span>
          <div><h1 className="text-xl font-bold">Repotting Guide</h1><p className="text-xs text-muted-foreground">When, how, and what soil to use</p></div>
        </div>
        <div className="container pb-3 flex gap-2 overflow-x-auto">
          {[["signs","🚨 Signs"],["steps","📋 Steps"],["mixes","🌱 Soil Mixes"],["pots","📐 Pot Size"]].map(([v,l]) => (
            <button type="button" key={v} onClick={() => setTab(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${tab === v ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="container py-6 max-w-3xl space-y-4">
        {tab === "signs" && <>
          <div className="glass rounded-xl p-4 border border-blue-500/20 mb-2">
            <p className="text-xs text-blue-300">Best time to repot in Malaysia: any time except during active flowering or extreme heat. Avoid midday — do it in the morning or evening.</p>
          </div>
          {SIGNS.map(s => (
            <div key={s.sign} className={`glass rounded-xl p-4 border flex items-center gap-3 ${s.severity === "Urgent" ? "border-red-500/30" : s.severity === "High" ? "border-amber-500/30" : "border-border/40"}`}>
              <span className="text-2xl">{s.emoji}</span>
              <div className="flex-1"><p className="font-semibold text-sm">{s.sign}</p></div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.severity === "Urgent" ? "bg-red-500/20 text-red-400" : s.severity === "High" ? "bg-amber-500/20 text-amber-400" : s.severity === "Medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-border/30 text-muted-foreground"}`}>{s.severity}</span>
            </div>
          ))}
        </>}

        {tab === "steps" && (
          <div className="space-y-3">
            {STEPS.map((s, i) => (
              <div key={s.step} className="glass rounded-xl p-4 border border-border/40 flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                <div><p className="font-bold text-sm">{s.step}</p><p className="text-xs text-muted-foreground mt-1">{s.detail}</p></div>
              </div>
            ))}
          </div>
        )}

        {tab === "mixes" && (
          <div className="space-y-3">
            {MIXES.map(m => (
              <div key={m.type} className="glass rounded-xl p-5 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2"><span className="text-2xl">{m.emoji}</span><p className="font-bold">{m.type}</p></div>
                <div className="glass rounded-lg p-3 border border-border/30 mb-2"><p className="text-xs font-mono text-emerald-300">{m.recipe}</p></div>
                <p className="text-xs text-muted-foreground">Best for: {m.plants}</p>
              </div>
            ))}
            <div className="glass rounded-xl p-4 border border-amber-500/20">
              <p className="text-xs text-amber-300">Malaysia tip: Add neem cake (bungkil neem) 1 tbsp per pot to prevent fungal gnats and root rot — common in our humid climate. Available at nurseries RM 5–10/kg.</p>
            </div>
          </div>
        )}

        {tab === "pots" && <>
          <div className="space-y-2">
            {POT_SIZES.map(p => (
              <div key={p.current} className="glass rounded-xl p-4 border border-border/40 flex items-center gap-4">
                <div className="text-center w-20 flex-shrink-0"><p className="font-bold text-sm">{p.current}</p><p className="text-xs text-muted-foreground">Current</p></div>
                <span className="text-muted-foreground">→</span>
                <div className="text-center w-28 flex-shrink-0"><p className="font-bold text-sm text-emerald-400">{p.next}</p><p className="text-xs text-muted-foreground">Next pot</p></div>
                <p className="text-xs text-muted-foreground flex-1">{p.note}</p>
              </div>
            ))}
          </div>
          <div className="glass rounded-xl p-5 border border-border/40 space-y-2">
            <h3 className="font-bold text-sm">Pot material comparison</h3>
            {[["Plastic","Retains moisture. Lightweight. Cheap. Best for most tropical plants and Malaysia's humid climate."],
              ["Terracotta","Breathes and dries faster. Better for succulents, cacti. Can dry out too fast in direct sun."],
              ["Ceramic/glazed","Retains moisture like plastic. Heavier. Looks premium. Fine for most houseplants."],
              ["Fabric grow bags","Excellent drainage and air pruning. Great for tomato, chili outdoors. Dries fast — water more often."],
            ].map(([t,d]) => <div key={t}><p className="text-sm font-semibold">{t}</p><p className="text-xs text-muted-foreground">{d}</p></div>)}
          </div>
        </>}
      </div>
    </div>
  );
}
