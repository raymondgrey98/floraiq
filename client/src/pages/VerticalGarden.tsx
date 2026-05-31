import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const SYSTEMS = [
  { id:"pocket", name:"Pocket/Felt Wall", emoji:"🧱", cost:"RM 30-100", space:"1-5 sqm wall", difficulty:"Easy", plants:["Lettuce","Kangkung","Herbs (basil, mint, chives)","Strawberry","Small flowers"], pros:["Very cheap to make","No carpentry needed","Renter-friendly — removable","Good for balcony"], cons:["Dries out fast — needs frequent watering","Limited root space — not for large plants","Felt can mould in Malaysia humidity"], build:"Sew or buy felt pockets. Mount on wooden pallet or metal frame. Attach to wall with hooks." },
  { id:"pallet", name:"Wood Pallet Garden", emoji:"🪵", cost:"RM 0-50 (recycled pallets free)", space:"1.2m × 1m footprint", difficulty:"Easy", plants:["Lettuce","Herbs","Strawberry","Succulents","Small flowering plants"], pros:["Free from factories","Natural look","Easy to move","Great for renters"], cons:["May contain chemicals — check heat-treated (HT) mark only","Heavy when wet","Limited depth for root vegetables"], build:"Get HT-marked pallet. Line back with weed mat. Fill with potting mix. Tilt at 30° angle to lean against wall." },
  { id:"pipe", name:"PVC Pipe Tower", emoji:"🔧", cost:"RM 50-200", space:"50cm × 50cm footprint", difficulty:"Medium", plants:["Strawberry","Kangkung","Herbs","Lettuce","Small plants"], pros:["Space-efficient — grows upward","Good drainage","Can be made from scrap pipe","Looks modern"], cons:["Needs irrigation (gravity drip works well)","Difficult to repot","Top gets more sun than bottom"], build:"Use 4-inch PVC pipe. Drill 5cm holes every 20cm in staggered pattern. Fill with growing medium. Stand vertically or at angle." },
  { id:"hydro", name:"Hydroponic NFT", emoji:"💧", cost:"RM 200-800", space:"Wall or rack", difficulty:"Advanced", plants:["Lettuce","Kangkung","Herbs","Spinach","Pak choi"], pros:["Fastest growth (3-4× faster than soil)","No soil pests","Very clean","High yield in small space"], cons:["Needs pump and electricity","Learning curve","Pump failure kills crops","Higher initial cost"], build:"Use 3-4 inch PVC channels at 15° angle. Nutrient solution flows from reservoir through pump. pH 5.5-6.5 essential." },
  { id:"trellis", name:"Climbing Trellis", emoji:"🌿", cost:"RM 20-150", space:"Wall, fence, or frame", difficulty:"Easy", plants:["Bitter gourd","Long bean","Cucumber","Passionflower","Winged bean","Pumpkin"], pros:["Best use of vertical space for fruits","Natural shade creator","Very productive","Strong structure needed for heavy fruits"], cons:["Heavy fruits need strong support","Plants spread wide","Needs pollination access"], build:"Install bamboo or metal grid trellis. Plant climbing vegetables at base. Train vines upward. Use clips or soft ties." },
];

const TOP_PLANTS = [
  { name:"Kangkung", why:"Fast, prolific, regrows after cutting. Best for vertical in Malaysia.", space:"15cm pocket depth" },
  { name:"Lettuce", why:"Shallow roots, fast harvest. Needs shade from afternoon sun.", space:"15cm pocket depth" },
  { name:"Bayam (Amaranth)", why:"Heat tolerant, nutritious, fast growing.", space:"20cm pocket depth" },
  { name:"Basil / Herbs", why:"Small root system, aromatic, easy care.", space:"15cm pocket depth" },
  { name:"Chili", why:"Can grow in containers. Productive in vertical system.", space:"25cm pot minimum" },
  { name:"Strawberry", why:"Trailing habit perfect for pockets and towers.", space:"20cm pocket depth" },
  { name:"Spring Onion", why:"Minimal root depth. Regrows after harvest.", space:"10cm pocket depth" },
  { name:"Bitter Gourd (Peria)", why:"Climbs naturally. Very productive on trellis.", space:"Large pot at base" },
];

export default function VerticalGarden() {
  const [selected, setSelected] = useState(SYSTEMS[0]);
  const [tab, setTab] = useState<"systems"|"plants"|"tips">("systems");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🏗️</span>
          <div><h1 className="text-xl font-bold">Vertical Garden Planner</h1><p className="text-xs text-muted-foreground">Grow more in less space — balcony & small garden</p></div>
        </div>
        <div className="container pb-3 flex gap-2">
          {[["systems","Systems"],["plants","Best Plants"],["tips","Tips"]].map(([v,l]) => (
            <button type="button" key={v} onClick={() => setTab(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${tab === v ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        {tab === "systems" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              {SYSTEMS.map(s => (
                <button type="button" key={s.id} onClick={() => setSelected(s)}
                  className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.id === s.id ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/40 hover:border-emerald-500/30"}`}>
                  <span className="text-xl">{s.emoji}</span>
                  <div><p className="font-semibold text-sm">{s.name}</p><p className="text-xs text-muted-foreground">{s.cost} · {s.difficulty}</p></div>
                </button>
              ))}
            </div>
            <div className="lg:col-span-2">
              <div className="glass rounded-xl p-5 border border-emerald-500/30 space-y-4">
                <div className="flex items-center gap-3"><span className="text-3xl">{selected.emoji}</span><div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-xs text-muted-foreground">{selected.cost} · {selected.space} · {selected.difficulty}</p></div></div>
                <div><p className="text-xs font-bold text-emerald-400 mb-2">Best plants for this system:</p><div className="flex flex-wrap gap-1.5">{selected.plants.map(p => <span key={p} className="text-xs bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-full">{p}</span>)}</div></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass rounded-lg p-3 border border-green-500/20"><p className="text-xs font-bold text-green-400 mb-2">✅ Pros</p><ul className="space-y-1">{selected.pros.map(p => <li key={p} className="text-xs text-muted-foreground">• {p}</li>)}</ul></div>
                  <div className="glass rounded-lg p-3 border border-red-500/20"><p className="text-xs font-bold text-red-400 mb-2">❌ Cons</p><ul className="space-y-1">{selected.cons.map(c => <li key={c} className="text-xs text-muted-foreground">• {c}</li>)}</ul></div>
                </div>
                <div className="glass rounded-lg p-3 border border-blue-500/20"><p className="text-xs font-bold text-blue-400 mb-1">🔧 How to build</p><p className="text-sm text-muted-foreground">{selected.build}</p></div>
              </div>
            </div>
          </div>
        )}
        {tab === "plants" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TOP_PLANTS.map(p => (
              <div key={p.name} className="glass rounded-xl p-4 border border-emerald-500/20">
                <p className="font-bold text-sm mb-1">{p.name}</p>
                <p className="text-xs text-muted-foreground mb-2">{p.why}</p>
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Min depth: {p.space}</span>
              </div>
            ))}
          </div>
        )}
        {tab === "tips" && (
          <div className="space-y-4">
            {[["☀️ Malaysian Climate Tips",["West/north-facing walls get gentler morning sun — better for leafy greens","East/south-facing walls get intense afternoon heat — use for chili and heat-lovers","Add 30% shade cloth during hottest months","Automatic drip irrigation essential — vertical gardens dry out 3× faster than ground"]],["💧 Watering System",["Manual watering is hard — invest in timer-controlled drip","-Install reservoir at top, gravity-feed through drip lines","Check daily — felt pockets can dry in 6 hours on hot days","Avoid watering in midday sun — evaporation and leaf burn"]],["🪱 Soil & Growing Medium",["Regular garden soil too heavy — use potting mix with perlite (70:30)","Coco peat is excellent for vertical — lightweight and good water retention","Add slow-release fertilizer pellets into growing medium","Refresh growing medium every 2 seasons — nutrients deplete fast"]],["🏙️ Urban Sarawak Tips",["Balcony limit — check weight. Soil is heavy. Use lightweight media","Windy balconies: use trellis behind for windbreak","High floors = less insects = may need hand pollination for fruiting vegetables","Water runoff — plan drainage to avoid complaints from downstairs neighbour"]]].map(([title, tips]) => (
              <div key={String(title)} className="glass rounded-xl p-5 border border-border/50">
                <h3 className="font-bold mb-3">{String(title)}</h3>
                <ul className="space-y-1.5">{(tips as string[]).map(t => <li key={t} className="flex gap-2 text-sm text-muted-foreground"><span className="text-emerald-400 flex-shrink-0">•</span>{t}</li>)}</ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
