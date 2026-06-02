import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const SEEDS = [
  { crop:"Tomato", difficulty:"Easy", harvest:"When fruit fully ripe and soft. Scoop out seeds with gel.", process:"Ferment in water 3 days (breaks gel coating). Rinse, dry on paper. 5-7 days.", storage:"Airtight jar. 4-6 years viability.", drying:"5-7 days room temp. Fully dry before sealing.", tip:"Fermentation removes germination inhibitors and kills fungal diseases. Critical step." },
  { crop:"Chili / Pepper", difficulty:"Easy", harvest:"When fully red/ripe. Cut open, scrape seeds.", process:"Rinse lightly. No fermentation needed.", storage:"Paper envelope in airtight box. 2-4 years viability.", drying:"3-5 days. Can use electric fan in Malaysia's humidity.", tip:"Wear gloves — capsaicin transfers to seeds and irritates eyes." },
  { crop:"Bitter Gourd (Peria)", difficulty:"Easy", harvest:"Let one fruit turn fully orange/yellow and split open naturally.", process:"Scoop seeds out. Rinse, dry.", storage:"2-4 years. Airtight with silica gel packet.", drying:"5-7 days. Very important — high water content.", tip:"Save seeds from the first fruits of the season — they have best genetics." },
  { crop:"Cucumber", difficulty:"Easy", harvest:"Let one cucumber grow old and yellow — past eating stage.", process:"Scoop gel and seeds. Ferment 1-2 days (optional but good).", storage:"5-10 years — excellent longevity.", drying:"5-7 days thoroughly.", tip:"Mark your 'seed cucumber' early so family don't harvest it." },
  { crop:"Kangkung", difficulty:"Easy", harvest:"Let stems flower and seed pods turn brown and dry on plant.", process:"Cut whole stem, dry in paper bag. Shake seeds out.", storage:"2-3 years. Very easy.", drying:"Already dry when harvested if left long enough on plant.", tip:"Kangkung self-seeds prolifically. You may not need to save — it will self-sow." },
  { crop:"Long Bean (Kacang Panjang)", difficulty:"Easy", harvest:"Leave one or two pods on vine until they dry out completely and rattle.", process:"Shell dried pods. Seeds inside ready.", storage:"3-5 years.", drying:"Dry on vine or finish drying indoors in low humidity.", tip:"Select the longest, most prolific vine for seed saving — natural selection." },
  { crop:"Okra (Bendi)", difficulty:"Easy", harvest:"Let one pod stay on plant until it turns brown and papery.", process:"Cut open dried pod. Seeds shell out easily.", storage:"2-4 years.", drying:"Already dry on plant.", tip:"Okra seeds are easy and rewarding to save. Save 20+ seeds to ensure genetic diversity." },
  { crop:"Corn", difficulty:"Medium", harvest:"Leave corn on stalk until husks dry completely (long past eating stage).", process:"Peel, rub kernels off cob. Fully dry.", storage:"1-2 years only — loses viability fast.", drying:"2-4 weeks. Critical — must be bone dry.", tip:"Corn cross-pollinates easily. Isolation from other corn varieties needed (200m minimum) for pure seeds." },
  { crop:"Pumpkin / Labu", difficulty:"Easy", harvest:"Fully ripe — hard skin, dried stem, hollow sound when tapped.", process:"Scoop seeds. Rinse. Ferment 1-2 days if slimy.", storage:"5-8 years — excellent.", drying:"7-10 days.", tip:"Pumpkin and squash cross-pollinate — save from hand-pollinated flowers if growing multiple varieties." },
  { crop:"Durian", difficulty:"Hard", harvest:"Fresh fallen fruit only. Cannot dry or store seeds long.", process:"Plant immediately — seeds lose viability in 1 week.", storage:"Cannot store. Must plant within 3-7 days.", drying:"Do NOT dry. Plant moist.", tip:"Grow from seed for rootstock. Graft named varieties. Seed-grown durian takes 7-10 years to fruit and is unpredictable." },
];

const STORAGE: { method: string; desc: string; materials: string; humidity: string; lifespan: string }[] = [
  { method:"Paper envelope in tin", desc:"Most seeds", materials:"Brown paper envelopes, biscuit tin or cookie tin", humidity:"Dry room or with silica gel", lifespan:"1-3x normal" },
  { method:"Glass jar with silica gel", desc:"Long-term valuable seeds", materials:"Jam jar with rubber seal, blue silica gel beads", humidity:"Keep silica gel blue (active). Replace when pink.", lifespan:"3-5x normal" },
  { method:"Refrigerator storage", desc:"Very long term", materials:"Sealed glass jar, refrigerator at 5-10°C", humidity:"Critical — seeds must be bone dry before refrigerating", lifespan:"5-10x normal" },
  { method:"Freezer storage", desc:"Decades-long storage", materials:"Airtight container, moisture absorber inside", humidity:"Must be completely dry — 0% moisture", lifespan:"10-50 years" },
];

export default function SeedSaving() {
  const [selected, setSelected] = useState(SEEDS[0]);
  const [tab, setTab] = useState<"seeds"|"storage"|"tips">("seeds");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🌾</span>
          <div><h1 className="text-xl font-bold">Seed Saving Guide</h1><p className="text-xs text-muted-foreground">Save and store seeds from your Malaysian garden</p></div>
        </div>
        <div className="container pb-3 flex gap-2">
          {[["seeds","🌱 Crops"],["storage","📦 Storage"],["tips","💡 Tips"]].map(([v,l]) => (
            <button type="button" key={v} onClick={() => setTab(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${tab === v ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        {tab === "seeds" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
              {SEEDS.map(s => (
                <button type="button" key={s.crop} onClick={() => setSelected(s)} className={`w-full text-left glass rounded-xl p-3 border transition-all flex justify-between items-center ${selected.crop === s.crop ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/40 hover:border-emerald-500/30"}`}>
                  <div><p className="font-semibold text-sm">{s.crop}</p><p className="text-xs text-muted-foreground">{s.storage.split(".")[0]}</p></div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${s.difficulty === "Easy" ? "bg-green-500/20 text-green-400" : s.difficulty === "Medium" ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"}`}>{s.difficulty}</span>
                </button>
              ))}
            </div>
            <div className="lg:col-span-2 space-y-3">
              <div className="glass rounded-xl p-5 border border-emerald-500/30">
                <h2 className="text-xl font-bold mb-4">{selected.crop}</h2>
                {[["🌿 When to Harvest",selected.harvest,"border-green-500/20"],["⚗️ Processing",selected.process,"border-blue-500/20"],["☀️ Drying Time",selected.drying,"border-amber-500/20"],["📦 Storage",selected.storage,"border-border/40"]].map(([l,v,b]) => (
                  <div key={String(l)} className={`glass rounded-lg p-3 border ${b} mb-2`}><p className="text-xs font-bold text-muted-foreground mb-1">{l}</p><p className="text-sm">{v}</p></div>
                ))}
                <div className="glass rounded-lg p-3 border border-purple-500/20"><p className="text-xs text-purple-300">💡 {selected.tip}</p></div>
              </div>
            </div>
          </div>
        )}
        {tab === "storage" && <>
          <div className="glass rounded-xl p-4 border border-amber-500/20 mb-4"><p className="text-xs text-amber-300">⚠️ Malaysia's #1 enemy of seed storage: humidity. Kuching averages 82% relative humidity. Seeds must be bone dry before storage. Use silica gel. Store in airtight containers.</p></div>
          <div className="space-y-3">
            {STORAGE.map(s => (
              <div key={s.method} className="glass rounded-xl p-4 border border-border/40">
                <div className="flex justify-between mb-2"><p className="font-bold">{s.method}</p><span className="text-xs text-emerald-400">{s.lifespan}</span></div>
                <p className="text-xs text-muted-foreground mb-1">Best for: {s.desc}</p>
                <p className="text-xs text-muted-foreground mb-1">Materials: {s.materials}</p>
                <p className="text-xs text-amber-300">Humidity: {s.humidity}</p>
              </div>
            ))}
          </div>
        </>}
        {tab === "tips" && (
          <div className="space-y-3">
            {[["Label Everything","Date, variety, source. Seeds look identical after 6 months. No label = mystery seeds."],["Dryness is Everything","In Malaysia, seed failure is almost always dampness. When you think it's dry enough — dry it 2 more days."],["Save Open-Pollinated Only","F1 hybrid seeds (marked on packets) do NOT breed true. Save only from open-pollinated (OP) or heirloom varieties."],["Save from Best Plants","Save from your largest, healthiest, most productive plants. You are gradually adapting varieties to YOUR garden."],["Community Seed Swap","Connect with Kuching Organic Farmers community. Share rare Malaysian heirloom varieties."],["Test Germination Rate","Before growing season: place 10 seeds on damp paper towel, 5-7 days. If fewer than 7 sprout, use more seeds when planting."],["Silica Gel Packets","Collect from vitamin bottles, shoe boxes, electronic packaging. Dry them in oven 100°C for 1 hour to reactivate."]].map(([title, desc]) => (
              <div key={String(title)} className="glass rounded-xl p-4 border border-border/40">
                <p className="font-bold text-sm text-emerald-400 mb-1">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
