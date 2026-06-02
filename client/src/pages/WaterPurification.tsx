import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, AlertTriangle } from "lucide-react";

const METHODS = [
  { id:"boil", name:"Boiling", emoji:"🔥", safety:"★★★★★", removes:"Bacteria, viruses, protozoa (almost all pathogens)", plants:["Banana bark (container if no pot)","Bamboo (boil in section)","Large clay pots (makeshift vessel)"], steps:["Collect water in clean container","Boil vigorously for 1 full minute (3 min at altitude)","Cool before drinking","Don't re-contaminate — cover after boiling"], note:"Most reliable method. If you can only do ONE thing — boil the water. Kills everything biological." },
  { id:"solar", name:"SODIS (Solar Disinfection)", emoji:"☀️", safety:"★★★★☆", removes:"Bacteria, viruses (UV kills most)", plants:["Clear plastic bottle","Sunlight"], steps:["Fill clear PET plastic bottle with water","Shake to oxygenate","Lay on reflective surface (metal, foil, light-coloured rock)","Expose to direct sunlight: 6 hours clear day, 2 days cloudy","Water must be clear — filter turbid water first"], note:"Free, requires only clear bottle and sunshine — abundant in Malaysia. Not effective in cloudy water — must filter first." },
  { id:"filter", name:"Plant Fibre Filter", emoji:"🌿", safety:"★★★☆☆", removes:"Sediment, large particles, some bacteria", plants:["Charcoal from burnt wood","Grass/moss layer","Sand and gravel","Banana leaves (pre-filter layer)"], steps:["Stack filter layers in container: grass/moss, sand, charcoal, fine sand from top to bottom","Pour water through","Collect filtered water — looks clearer","STILL MUST BOIL AFTER — filter removes particles not all pathogens"], note:"Remove sediment and particles. Makes boiling more effective. Critical — filter turbid water BEFORE SODIS." },
  { id:"plant", name:"Moringa Seed Clarification", emoji:"🌿", safety:"★★★☆☆", removes:"Turbidity, bacteria (partially), heavy metals", plants:["Moringa oleifera seeds (dried pods)"], steps:["Take 1-2 dried moringa seeds","Remove seed coat","Crush seeds to powder","Add to 1 litre of water (1 seed per 1 litre)","Stir vigorously for 5 minutes","Let stand 1 hour — particles sink","Carefully pour off clear water","Still boil after this step"], note:"Moringa seeds contain positively-charged protein that attracts negatively-charged bacteria and sediment — they clump and sink. Used in water treatment worldwide." },
  { id:"charcoal", name:"Wood Charcoal Filter", emoji:"⬛", safety:"★★★☆☆", removes:"Chemicals, odours, some heavy metals, some bacteria", plants:["Charcoal from hardwood fire (not coal)"], steps:["Create charcoal by burning hardwood to glowing embers","Extinguish and allow to cool completely","Crush into small pieces — not powder","Use as filter layer in plant fibre filter above","Replace charcoal every few uses"], note:"Activated charcoal in survival situations removes chemical contaminants. Combined with grass/sand filter and then boiling = effective purification." },
  { id:"barrel", name:"Root Barrel Clarification", emoji:"🌳", safety:"★★☆☆☆", removes:"Turbidity, some bacteria", plants:["Fibrous tree roots (tualang, dipterocarp)","Young bamboo bark"], steps:["Find fibrous root mass of large tree","Bundle roots tightly","Let water drip slowly through root mass","Collect in clean container","Boil immediately after"], note:"Traditional Dayak method. The fine root fibres act as mechanical filter. Removes large particles and some bacteria. Must still boil." },
];

const WATER_SOURCES = [
  { source:"Flowing highland stream", safety:"★★★★☆", note:"Best wild source. Less contamination upstream. Still boil." },
  { source:"Bamboo internodes", safety:"★★★★☆", note:"Often pure trapped rainwater inside young bamboo. Crack between nodes." },
  { source:"Banana stem hollow", safety:"★★★★☆", note:"Cut close to ground. Fills with clean water. Usable after brief collecting." },
  { source:"Plant leaves collecting rain", safety:"★★★★★", note:"Cleanest wild water. Direct rain on large clean leaves. Drink immediately." },
  { source:"River water (lowland)", safety:"★★★☆☆", note:"Risk of contamination. Filter + boil essential. Check for upstream activity." },
  { source:"Puddle water", safety:"★★☆☆☆", note:"High contamination risk. Only emergency. Filter → boil → drink." },
  { source:"Stagnant pool", safety:"★★☆☆☆", note:"High risk of protozoa and bacteria. Must filter + boil + cool." },
  { source:"Coastal/tidal water", safety:"★☆☆☆☆", note:"Salt water — cannot purify with these methods. Dehydrates further. Avoid." },
];

export default function WaterPurification() {
  const [selected, setSelected] = useState(METHODS[0]);
  const [tab, setTab] = useState<"methods"|"sources">("methods");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🚿</span>
          <div><h1 className="text-xl font-bold">Water Purification</h1><p className="text-xs text-muted-foreground">Natural methods — survival situations</p></div>
        </div>
        <div className="container pb-3 flex gap-2">
          {[["methods","Methods"],["sources","Water Sources"]].map(([v,l]) => <button type="button" key={v} onClick={() => setTab(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${tab === v ? "bg-blue-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{l}</button>)}
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        <div className="glass rounded-xl p-3 border border-red-500/20 mb-4 flex gap-2"><AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /><p className="text-xs text-red-300">Survival info only. In normal situations: buy bottled water or use municipal supply. Dehydration kills faster than contamination — if you must drink, drink and seek medical help later.</p></div>
        {tab === "methods" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              {METHODS.map(m => <button type="button" key={m.id} onClick={() => setSelected(m)} className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.id === m.id ? "border-blue-500/60 bg-blue-500/5" : "border-border/40 hover:border-blue-500/30"}`}><span className="text-xl">{m.emoji}</span><div><p className="font-semibold text-sm">{m.name}</p><p className="text-xs">{m.safety}</p></div></button>)}
            </div>
            <div className="lg:col-span-2">
              <div className="glass rounded-xl p-5 border border-blue-500/30 space-y-3">
                <div className="flex items-center gap-3"><span className="text-3xl">{selected.emoji}</span><div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-xs">Effectiveness: {selected.safety}</p></div></div>
                <div className="glass rounded-lg p-3 border border-border/40"><p className="text-xs font-bold text-muted-foreground mb-1">✅ Removes</p><p className="text-sm">{selected.removes}</p></div>
                <div><p className="text-xs font-bold text-emerald-400 mb-2">📋 Steps</p><div className="space-y-2">{selected.steps.map((s,i) => <div key={i} className="flex gap-3"><span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center flex-shrink-0">{i+1}</span><p className="text-sm text-muted-foreground">{s}</p></div>)}</div></div>
                {selected.plants.length > 0 && <div className="glass rounded-lg p-3 border border-emerald-500/20"><p className="text-xs font-bold text-emerald-400 mb-2">🌿 Materials needed</p><ul>{selected.plants.map(p => <li key={p} className="text-xs text-muted-foreground">• {p}</li>)}</ul></div>}
                <div className="glass rounded-lg p-3 border border-blue-500/20"><p className="text-xs text-blue-300">💡 {selected.note}</p></div>
              </div>
            </div>
          </div>
        )}
        {tab === "sources" && (
          <div className="space-y-3">
            {WATER_SOURCES.map(s => <div key={s.source} className="glass rounded-xl p-4 border border-border/50"><div className="flex justify-between items-center mb-1"><p className="font-bold text-sm">{s.source}</p><span className="text-sm">{s.safety}</span></div><p className="text-xs text-muted-foreground">{s.note}</p></div>)}
          </div>
        )}
      </div>
    </div>
  );
}
