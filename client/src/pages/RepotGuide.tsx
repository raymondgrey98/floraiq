import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const SIGNS = [
  { sign:"Roots growing out of drainage holes", urgency:"high" },
  { sign:"Roots circling around or pushing up through soil", urgency:"high" },
  { sign:"Plant dries out within 1-2 days of watering", urgency:"high" },
  { sign:"Visible white salt crust on soil surface", urgency:"medium" },
  { sign:"Plant looks stunted despite good care", urgency:"medium" },
  { sign:"Soil pulling away from pot edges when dry", urgency:"medium" },
  { sign:"Last repotted more than 2 years ago (fast growers)", urgency:"low" },
  { sign:"Plant looks top-heavy or keeps tipping over", urgency:"low" },
];

const POT_GUIDE = [
  { from:"6 cm / 2 inch", to:"8 cm / 3 inch", note:"Seedlings to first repot" },
  { from:"8 cm / 3 inch", to:"10 cm / 4 inch", note:"Young plants" },
  { from:"10 cm / 4 inch", to:"13 cm / 5 inch", note:"Small houseplants" },
  { from:"13 cm / 5 inch", to:"17 cm / 6.5 inch", note:"Medium plants" },
  { from:"17 cm / 6.5 inch", to:"20 cm / 8 inch", note:"Mature plants" },
  { from:"20 cm / 8 inch", to:"25 cm / 10 inch", note:"Large plants and shrubs" },
  { from:"25 cm / 10 inch", to:"30 cm / 12 inch", note:"Established shrubs" },
  { from:"30 cm+", to:"Top dress only", note:"Very large plants — don't upsize, just refresh soil" },
];

const MIXES: Record<string, { ratio: string; note: string }[]> = {
  "Tropical Foliage (Monstera, Pothos)": [
    { ratio:"40% coco peat / coir", note:"Retains moisture" },
    { ratio:"30% perlite", note:"Drainage and aeration" },
    { ratio:"20% compost", note:"Nutrients" },
    { ratio:"10% sand", note:"Weight and drainage" },
  ],
  "Succulents & Cacti": [
    { ratio:"50% coarse sand / grit", note:"Fast drainage essential" },
    { ratio:"30% perlite", note:"Aeration" },
    { ratio:"20% potting mix", note:"Light base" },
  ],
  "Orchids (Phalaenopsis)": [
    { ratio:"70% bark chips (pine/coconut husk)", note:"Air roots need air gaps" },
    { ratio:"20% perlite", note:"Drainage" },
    { ratio:"10% sphagnum moss", note:"Moisture retention" },
  ],
  "Vegetables & Herbs": [
    { ratio:"40% potting soil", note:"Base" },
    { ratio:"30% compost", note:"Rich nutrients" },
    { ratio:"20% perlite", note:"Drainage" },
    { ratio:"10% vermicast", note:"Slow release nutrients" },
  ],
  "Fruit Trees (Container)": [
    { ratio:"40% topsoil", note:"Weight and stability" },
    { ratio:"30% compost", note:"Long-term nutrients" },
    { ratio:"20% sand", note:"Drainage" },
    { ratio:"10% organic fertilizer", note:"Slow release NPK" },
  ],
};

const STEPS = [
  { n:1, title:"Water 24 hours before", desc:"Moist roots slide out easier and suffer less transplant shock than dry roots." },
  { n:2, title:"Prepare new pot", desc:"Cover drainage hole with a mesh or broken pottery shard. Add 2-3cm of fresh mix at bottom." },
  { n:3, title:"Remove plant gently", desc:"Tip pot sideways, support plant base with one hand, squeeze sides if plastic. Don't yank." },
  { n:4, title:"Inspect and trim roots", desc:"Remove dead (black, mushy) roots with clean scissors. Untangle circling roots gently." },
  { n:5, title:"Position in new pot", desc:"Plant should sit 2-3cm below rim to allow for watering. Adjust base depth accordingly." },
  { n:6, title:"Fill with fresh mix", desc:"Add mix around sides, pressing gently to remove air pockets. Don't pack too hard." },
  { n:7, title:"Water thoroughly", desc:"Water until it drains from bottom. This settles the soil around roots." },
  { n:8, title:"Recovery period", desc:"Move to bright indirect light for 2-3 weeks. Don't fertilize for 4-6 weeks." },
];

const URGENCY: Record<string, string> = { high:"text-red-400 bg-red-500/10", medium:"text-amber-400 bg-amber-500/10", low:"text-green-400 bg-green-500/10" };

export default function RepotGuide() {
  const [tab, setTab] = useState<"signs"|"steps"|"mix"|"pots">("signs");
  const [selectedMix, setSelectedMix] = useState(Object.keys(MIXES)[0]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🪴</span>
          <div><h1 className="text-xl font-bold">Repotting Guide</h1><p className="text-xs text-muted-foreground">When, how, and what soil to use</p></div>
        </div>
        <div className="container pb-3 flex gap-2 overflow-x-auto">
          {[["signs","⚠️ When to Repot"],["steps","📋 How To"],["mix","🪱 Soil Mix"],["pots","📏 Pot Size"]].map(([v,l]) => (
            <button type="button" key={v} onClick={() => setTab(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${tab === v ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="container py-6 max-w-3xl space-y-4">
        {tab === "signs" && <>
          <div className="glass rounded-xl p-4 border border-amber-500/20"><p className="text-xs text-amber-300">⏰ Best time to repot in Malaysia: Early morning during dry spell. Avoid repotting in peak monsoon season if outdoors. Most plants can be repotted year-round in tropical climate.</p></div>
          <div className="space-y-2">
            {SIGNS.map(s => (
              <div key={s.sign} className={`glass rounded-xl p-4 border border-border/40 flex items-center gap-3`}>
                <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${URGENCY[s.urgency]}`}>{s.urgency}</span>
                <p className="text-sm">{s.sign}</p>
              </div>
            ))}
          </div>
        </>}
        {tab === "steps" && (
          <div className="space-y-3">
            {STEPS.map(s => (
              <div key={s.n} className="glass rounded-xl p-4 border border-border/40 flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0">{s.n}</div>
                <div><p className="font-semibold text-sm mb-1">{s.title}</p><p className="text-xs text-muted-foreground">{s.desc}</p></div>
              </div>
            ))}
          </div>
        )}
        {tab === "mix" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              {Object.keys(MIXES).map(k => (
                <button type="button" key={k} onClick={() => setSelectedMix(k)} className={`w-full text-left glass rounded-xl p-3 border transition-all text-sm ${selectedMix === k ? "border-emerald-500/60 bg-emerald-500/5 text-emerald-400" : "border-border/40 hover:border-emerald-500/30"}`}>{k}</button>
              ))}
            </div>
            <div className="lg:col-span-2 space-y-2">
              <h3 className="font-bold">{selectedMix}</h3>
              {MIXES[selectedMix].map(m => (
                <div key={m.ratio} className="glass rounded-xl p-4 border border-emerald-500/20 flex justify-between items-center">
                  <span className="font-bold text-emerald-400 text-sm">{m.ratio}</span>
                  <span className="text-xs text-muted-foreground">{m.note}</span>
                </div>
              ))}
              <div className="glass rounded-lg p-3 border border-blue-500/20"><p className="text-xs text-blue-300">💡 In Malaysia, coco peat/coir is cheapest and widely available (RM 5-15/brick). Perlite from hardware stores or nurseries. Avoid pure garden soil — too dense for pots.</p></div>
            </div>
          </div>
        )}
        {tab === "pots" && <>
          <div className="glass rounded-xl p-4 border border-purple-500/20"><p className="text-xs text-purple-300">📏 Rule: Go up ONE pot size only (2-3cm wider). Too big = soil stays wet = root rot. Terracotta breathes better than plastic — good for Malaysia's humidity.</p></div>
          <div className="space-y-2">
            {POT_GUIDE.map(p => (
              <div key={p.from} className="glass rounded-xl p-3 border border-border/40 grid grid-cols-3 gap-2 items-center">
                <span className="text-sm font-medium">{p.from}</span>
                <span className="text-center text-emerald-400">→</span>
                <span className="text-sm font-medium text-right">{p.to}</span>
                <span className="col-span-3 text-xs text-muted-foreground">{p.note}</span>
              </div>
            ))}
          </div>
        </>}
      </div>
    </div>
  );
}
