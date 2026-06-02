import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Search } from "lucide-react";

const SPECIES = [
  { name:"Ikan Patin", scientific:"Pangasianodon hypophthalmus", emoji:"🐟", type:"Freshwater", habitat:"Sarawak rivers, especially Batang Lupar and Batang Ai", edible:true, danger:false, note:"Beloved Sarawak river fish. Farmed in abundance. Rich in omega-3. Very important local food fish." },
  { name:"Ikan Terubok", scientific:"Tenualosa toli", emoji:"🐟", type:"Estuarine", habitat:"Batang Sarawak estuary, Kuching area", edible:true, danger:false, note:"Most prized fish in Sarawak. Seasonal (Nov-Feb). Very bony but extremely tasty. Salted terubok is famous export." },
  { name:"Ikan Tapah", scientific:"Wallago attu", emoji:"🐟", type:"Freshwater", habitat:"Large rivers of Sarawak — Batang Rejang, Batang Lupar", edible:true, danger:false, note:"Giant freshwater catfish. Can reach 2m. Important in Iban fishing tradition. Big sport fishing target." },
  { name:"Ikan Baung", scientific:"Hemibagrus nemurus", emoji:"🐟", type:"Freshwater", habitat:"Most Sarawak rivers and streams", edible:true, danger:true, note:"Sharp spines on dorsal and pectoral fins — painful puncture. Very tasty. Common river catch. Handle carefully." },
  { name:"Ikan Empurau", scientific:"Tor tambroides", emoji:"🐟", type:"Freshwater", habitat:"Clear fast-flowing highland rivers — Batang Ai, Ulu Rejang", edible:true, danger:false, note:"World's most expensive freshwater fish. RM 500-2000/kg. Protected. Feeds only on specific jungle fruits. Sarawak's treasure." },
  { name:"Ikan Arwana", scientific:"Scleropages formosus", emoji:"🐟", type:"Freshwater", habitat:"Peat swamp rivers, Batang Lupar area", edible:false, danger:false, note:"Asian Arowana — Critically Endangered. Illegal to catch. Lucky fish in Chinese culture. RM 10,000+ each. Report sightings to SFD." },
  { name:"Ikan Puyu (Climbing Perch)", scientific:"Anabas testudineus", emoji:"🐟", type:"Freshwater", habitat:"Rice fields, slow rivers, drains — everywhere", edible:true, danger:false, note:"Can breathe air and walk on land for short distances. Common kampung food fish. Easy to catch." },
  { name:"Ikan Haruan (Snakehead)", scientific:"Channa striata", emoji:"🐟", type:"Freshwater", habitat:"All slow rivers, ponds, rice paddies", edible:true, danger:false, note:"Best wound-healing fish in Malay tradition. Eaten after surgery. Rich protein. Aggressive and territorial." },
  { name:"Udang Galah (Giant River Prawn)", scientific:"Macrobrachium rosenbergii", emoji:"🦐", type:"Freshwater", habitat:"Major Sarawak rivers, brackish water", edible:true, danger:false, note:"Largest freshwater prawn. Farmed commercially in Sarawak. RM 30-80/kg. Blue claws on males." },
  { name:"Ketam Nipah (Mangrove Crab)", scientific:"Scylla serrata", emoji:"🦀", type:"Marine/Estuarine", habitat:"Mangroves of Sarawak coast — Santubong, Kuching area", edible:true, danger:true, note:"Powerful claws — can cause serious injury. Excellent eating. Trap in mangroves at low tide. Important fishery." },
  { name:"Jellyfish (Box)", scientific:"Chironex fleckeri", emoji:"🪼", type:"Marine", habitat:"Coastal waters — rare in Sarawak South China Sea", edible:false, danger:true, note:"Most venomous marine animal. Rare in Sarawak but possible. Long trailing tentacles. AVOID swimming in murky coastal water." },
  { name:"Stonefish", scientific:"Synanceia verrucosa", emoji:"🐡", type:"Marine", habitat:"Shallow rocky/coral areas — Sarawak coast, Miri area", edible:false, danger:true, note:"World's most venomous fish. Camouflaged as rock. Step on it = extreme agony. Never walk barefoot on rocky reef." },
  { name:"Sting Ray (Freshwater)", scientific:"Himantura polylepis", emoji:"🐟", type:"Freshwater", habitat:"Sandy river beds — common in Sarawak large rivers", edible:true, danger:true, note:"Sharp venomous tail spine. Very camouflaged in sandy river beds. Shuffle feet when wading to disturb and warn away." },
  { name:"Ikan Duri (Catfish)", scientific:"Mystus nemurus", emoji:"🐟", type:"Freshwater", habitat:"Most Sarawak rivers and streams", edible:true, danger:true, note:"Venomous spines — extremely painful. Handle with thick gloves. Common river catch. Delicious despite danger." },
];

export default function MarineGuide() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all"|"Freshwater"|"Marine/Estuarine"|"Marine">("all");
  const [selected, setSelected] = useState(SPECIES[0]);

  const filtered = SPECIES.filter(s =>
    (filter === "all" || s.type.includes(filter)) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.scientific.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🐠</span>
          <div><h1 className="text-xl font-bold">Marine & River Guide</h1><p className="text-xs text-muted-foreground">Sarawak fish, prawns, crabs — edible & dangerous</p></div>
        </div>
        <div className="container pb-3 space-y-2">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search fish..." className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
          <div className="flex gap-2">
            {["all","Freshwater","Marine"].map(f => <button type="button" key={f} onClick={() => setFilter(f as any)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filter === f || (filter === "all" && f === "all") ? "bg-cyan-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{f === "all" ? "All" : f}</button>)}
          </div>
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
            {filtered.map(s => <button type="button" key={s.scientific} onClick={() => setSelected(s)} className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.scientific === s.scientific ? "border-cyan-500/60 bg-cyan-500/5" : "border-border/40 hover:border-cyan-500/30"}`}><span className="text-xl">{s.emoji}</span><div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{s.name}</p><p className="text-xs text-muted-foreground">{s.type}</p></div><div className="flex gap-1 flex-shrink-0">{s.edible && <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">Edible</span>}{s.danger && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">⚠️</span>}</div></button>)}
          </div>
          <div className="lg:col-span-2">
            <div className="glass rounded-xl p-5 border border-cyan-500/30 space-y-3">
              <div className="flex items-center gap-3"><span className="text-3xl">{selected.emoji}</span><div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-xs italic text-muted-foreground">{selected.scientific}</p></div><div className="ml-auto flex gap-2">{selected.edible && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">✅ Edible</span>}{selected.danger && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">⚠️ Dangerous</span>}</div></div>
              {[["🌊 Water Type", selected.type],["📍 Habitat", selected.habitat]].map(([l,v]) => <div key={String(l)} className="glass rounded-lg p-3 border border-border/40"><p className="text-xs font-bold text-muted-foreground mb-1">{l}</p><p className="text-sm">{v}</p></div>)}
              <div className="glass rounded-lg p-3 border border-cyan-500/20"><p className="text-xs text-cyan-300">💡 {selected.note}</p></div>
              <div className="flex gap-2">
                <a href={`https://fishbase.se/summary/${selected.scientific.replace(" ","-")}.html`} target="_blank" rel="noopener noreferrer" className="text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-blue-400">FishBase</a>
                <a href={`https://www.inaturalist.org/search?q=${encodeURIComponent(selected.scientific)}&place_id=6901`} target="_blank" rel="noopener noreferrer" className="text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-green-400">iNaturalist Sarawak</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
