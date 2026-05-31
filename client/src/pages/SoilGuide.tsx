import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const PH_CROPS = [
  { range:"4.5–5.5", label:"Very Acidic", emoji:"🔴", crops:["Blueberry","Tea","Azalea","Potato","Sweet Potato","Pineapple"], fix:"Add lime to raise pH", soil:"Typical Sarawak peat/laterite soil" },
  { range:"5.5–6.0", label:"Slightly Acidic", emoji:"🟠", crops:["Tomato","Chili","Cucumber","Corn","Pumpkin","Strawberry","Durian"], fix:"Add agricultural lime — 1-2 bags per 1000m²", soil:"Common in Sarawak after improvement" },
  { range:"6.0–6.5", label:"Mildly Acidic", emoji:"🟡", crops:["Banana","Papaya","Okra","Brinjal","Most vegetables"], fix:"Small amount of dolomite lime", soil:"Ideal for most Malaysian crops" },
  { range:"6.5–7.0", label:"Near Neutral — IDEAL", emoji:"🟢", crops:["Lettuce","Spinach","Peas","Beans","Carrot","Garlic","Onion"], fix:"No adjustment needed — ideal range", soil:"Best for broadest range of crops" },
  { range:"7.0–7.5", label:"Slightly Alkaline", emoji:"🔵", crops:["Brassica (Cabbage)","Asparagus","Celery","Cauliflower"], fix:"Add sulfur or acidic fertiliser", soil:"Rare in Malaysia naturally" },
  { range:"7.5–8.5", label:"Alkaline", emoji:"🟣", crops:["Most crops struggle — adjust soil","Beets","Artichoke"], fix:"Sulfur, acidifying fertilisers, peat moss", soil:"Can occur near concrete or lime-rich soil" },
];

const SOIL_TYPES = [
  { type:"Laterite (Red Clay)", emoji:"🔴", ph:"4.5–5.5", common:"Most of Sarawak and Sabah", drainage:"Poor — compacts when dry", improve:"Add organic matter, lime, sand, compost", crops:"Sweet potato, pineapple, cassava, rubber, oil palm" },
  { type:"Peat Soil", emoji:"🟤", ph:"3.5–4.5", common:"Coastal and swamp areas of Sarawak", drainage:"Waterlogged — high water table", improve:"Lime heavily, raised beds, drainage channels", crops:"Pineapple, sago, betel nut — limited options" },
  { type:"Alluvial Soil", emoji:"🟡", ph:"5.5–7.0", common:"River deltas, flood plains — Kuching basin", drainage:"Excellent — fertile", improve:"Usually very good — minimal input needed", crops:"Almost anything — best for farming" },
  { type:"Sandy Loam", emoji:"🟠", ph:"6.0–7.0", common:"Coastal areas of Malaysia", drainage:"Very good — drains fast", improve:"Add organic matter to increase water retention", crops:"Groundnut, watermelon, sweet potato" },
  { type:"Clay Loam", emoji:"⬛", ph:"5.5–6.5", common:"Inland areas, hill slopes", drainage:"Moderate — can waterlog", improve:"Add sand, organic matter, raised beds", crops:"Rice, sugarcane, most vegetables" },
  { type:"Volcanic Soil", emoji:"🌋", ph:"5.5–7.5", common:"Sabah near Mt Kinabalu", drainage:"Excellent, very fertile", improve:"Minimal — naturally very productive", crops:"Coffee, cocoa, vegetables — extremely productive" },
];

const AMENDMENTS = [
  { name:"Agricultural Lime", effect:"Raises pH", rate:"1-2 tonnes/ha", time:"Apply 2-3 months before planting", price:"~RM 0.80/kg" },
  { name:"Dolomite Lime", effect:"Raises pH + adds Mg & Ca", rate:"500kg–1 tonne/ha", time:"Apply 4-6 weeks before planting", price:"~RM 1.20/kg" },
  { name:"Sulfur (Flowers)", effect:"Lowers pH", rate:"200-500kg/ha", time:"Apply months before — slow acting", price:"~RM 3.00/kg" },
  { name:"Compost", effect:"Improves structure, neutral pH", rate:"5-10 tonnes/ha", time:"Any time", price:"~RM 0.50/kg" },
  { name:"Peat Moss", effect:"Lowers pH slightly, improves drainage", rate:"10-20% soil mix", time:"Any time", price:"~RM 15/bag" },
  { name:"Wood Ash", effect:"Raises pH, adds K and Ca", rate:"1-2 kg/m²", time:"Mix in before planting", price:"Free if you have it" },
];

export default function SoilGuide() {
  const [tab, setTab] = useState<"ph"|"types"|"amend">("ph");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🪱</span>
          <div>
            <h1 className="text-xl font-bold">Soil & pH Guide</h1>
            <p className="text-xs text-muted-foreground">Match crops to soil type and pH</p>
          </div>
        </div>
        <div className="container pb-3">
          <div className="flex gap-2">
            {[["ph","pH Chart"],["types","Soil Types"],["amend","Amendments"]].map(([v,l]) => (
              <button type="button" key={v} onClick={() => setTab(v as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  tab === v ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"
                }`}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-6 max-w-4xl">
        {tab === "ph" && (
          <div className="space-y-3">
            {PH_CROPS.map(row => (
              <div key={row.range} className="glass rounded-xl p-5 border border-border/50">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{row.emoji}</span>
                  <div>
                    <p className="font-bold">pH {row.range} — {row.label}</p>
                    <p className="text-xs text-muted-foreground">{row.soil}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {row.crops.map(c => <span key={c} className="text-xs bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-full">{c}</span>)}
                </div>
                <p className="text-xs text-amber-400">🔧 {row.fix}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "types" && (
          <div className="space-y-3">
            {SOIL_TYPES.map(s => (
              <div key={s.type} className="glass rounded-xl p-5 border border-border/50">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{s.emoji}</span>
                  <div>
                    <p className="font-bold">{s.type}</p>
                    <p className="text-xs text-muted-foreground">pH {s.ph} · {s.common}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="glass rounded-lg p-2 border border-border/30"><p className="text-muted-foreground">Drainage</p><p>{s.drainage}</p></div>
                  <div className="glass rounded-lg p-2 border border-border/30"><p className="text-muted-foreground">Improve by</p><p>{s.improve}</p></div>
                  <div className="glass rounded-lg p-2 border border-border/30"><p className="text-muted-foreground">Best crops</p><p>{s.crops}</p></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "amend" && (
          <div className="space-y-3">
            <div className="glass rounded-xl p-4 border border-blue-500/20 mb-4">
              <p className="text-sm text-blue-300">💡 Sarawak tip: Most Sarawak soil is laterite (pH 4.5–5.5). Apply agricultural lime 2-3 months before planting to reach pH 6.0. Test with a cheap pH meter (RM 15 at nurseries).</p>
            </div>
            {AMENDMENTS.map(a => (
              <div key={a.name} className="glass rounded-xl p-5 border border-border/50">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold">{a.name}</p>
                  <span className="text-xs text-emerald-400 font-bold">{a.price}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div><p className="font-semibold text-foreground">{a.effect}</p><p>Effect</p></div>
                  <div><p className="font-semibold text-foreground">{a.rate}</p><p>Rate</p></div>
                  <div><p className="font-semibold text-foreground">{a.time}</p><p>Timing</p></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
