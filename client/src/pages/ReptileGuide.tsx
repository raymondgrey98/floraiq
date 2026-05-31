import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Search } from "lucide-react";

type Danger = "venomous" | "dangerous" | "harmless" | "protected";
const DANGER_STYLE: Record<Danger, string> = {
  venomous:  "bg-red-500/20 text-red-400 border-red-500/30",
  dangerous: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  harmless:  "bg-green-500/20 text-green-400 border-green-500/30",
  protected: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const REPTILES = [
  { name:"King Cobra", scientific:"Ophiophagus hannah", emoji:"🐍", danger:"venomous" as Danger, found:"Forests, plantations, near water — all Malaysia", id:"Largest venomous snake. Olive/black with yellow cross-bands. Raises hood.", action:"BACK AWAY SLOWLY. Don't run. Keep eye on snake. Call 999.", firstAid:"Immobilise bitten limb. Go hospital IMMEDIATELY. Antivenom needed.", note:"Despite fearsome reputation, avoids humans. Only attacks if cornered." },
  { name:"Malayan Pit Viper", scientific:"Calloselasma rhodostoma", emoji:"🐍", danger:"venomous" as Danger, found:"Rubber/oil palm plantations, forest edges — very common Sarawak", id:"Triangular head, pinkish-brown with dark triangular pattern. Coiled on ground.", action:"Do NOT move — extremely cryptic. Step away carefully. Wear boots in plantation.", firstAid:"Immobilise, rush to hospital. Causes severe tissue necrosis — antivenom urgently.", note:"Responsible for most snakebites in Malaysia. Most bites on feet — wear boots always." },
  { name:"Banded Krait", scientific:"Bungarus fasciatus", emoji:"🐍", danger:"venomous" as Danger, found:"Lowland forests, near water, sometimes houses — Borneo, Peninsular", id:"Bold black and yellow bands. Docile in day, active at night.", action:"Leave alone. More dangerous at night — check bedding in jungle camping.", firstAid:"Hospital immediately — neurotoxic venom, victim may not feel severe pain but can die.", note:"Responsible for some deaths in Malaysia. Most bites occur when people accidentally grab them." },
  { name:"Reticulated Python", scientific:"Malayopython reticulatus", emoji:"🐍", danger:"dangerous" as Danger, found:"Forests, near rivers, oil palm plantations, sometimes urban areas", id:"World's longest snake — can reach 8m. Brown/gold diamond pattern.", action:"Back away. Never approach large python. Call wildlife department if in urban area.", firstAid:"If constricting: pour water or spray repellent near head. Multiple people needed to unwind.", note:"Feeds on small mammals, birds, occasionally deer. Non-venomous but deadly by constriction." },
  { name:"Sunbeam Snake", scientific:"Xenopeltis unicolor", emoji:"🐍", danger:"harmless" as Danger, found:"Moist soil, gardens, rice fields, forest — very common in Sarawak", id:"Iridescent rainbow scales in sunlight. Dark brown/black, smooth.", action:"No action needed — completely harmless. Beneficial — eats rodents.", firstAid:"Not applicable — harmless. Wash bite if defensive nip occurs.", note:"Beautiful iridescent scales often mistaken for dangerous species. Totally harmless." },
  { name:"Paradise Tree Snake", scientific:"Chrysopelea paradisi", emoji:"🐍", danger:"harmless" as Danger, found:"Tree canopies, forest, gardens — glides between trees", id:"Bright green with black edges and orange-red flecks. Slender, climbs trees.", action:"Harmless — can watch from safe distance. Fascinating glider.", firstAid:"Not applicable — mildly venomous rear fangs only dangerous to small lizards.", note:"Can glide up to 10 metres between trees. One of Malaysia's most beautiful snakes." },
  { name:"Green Tree Lizard (Changeable Lizard)", scientific:"Calotes versicolor", emoji:"🦎", danger:"harmless" as Danger, found:"Gardens, roadsides, parks — extremely common everywhere in Malaysia", id:"Green with striped sides. Male has red head when displaying.", action:"Totally harmless. Common garden visitor. Eats insects.", firstAid:"Not applicable.", note:"Males turn bright red/orange during breeding season. Excellent pest controller." },
  { name:"Monitor Lizard (Biawak)", scientific:"Varanus salvator", emoji:"🦎", danger:"dangerous" as Danger, found:"Everywhere — rivers, drains, mangroves, parks, urban Sarawak", id:"Large grey/black. Up to 2m. Forked tongue. Often near water.", action:"Leave alone. They look scary but avoid humans. Don't corner them — will bite and scratch.", firstAid:"Wash bite thoroughly with soap. Go to clinic — bacteria in mouth cause infections.", note:"Protected wildlife. Completely harmless unless provoked. Important scavenger." },
  { name:"Tokay Gecko", scientific:"Gekko gecko", emoji:"🦎", danger:"harmless" as Danger, found:"Houses, buildings, trees — most common large gecko", id:"Blue-grey with orange-red spots. Distinctive loud 'to-KAY' call at night.", action:"Harmless house gecko. Will bite if handled — has strong jaw.", firstAid:"If bitten: don't pull away — wait for gecko to release. Clean wound.", note:"Extremely beneficial — eats cockroaches, mosquitoes, other insects. Welcome guest." },
  { name:"Flying Lizard", scientific:"Draco volans", emoji:"🦎", danger:"harmless" as Danger, found:"Forest trees — Borneo speciality", id:"Small brownish lizard with wing-like flaps extending from ribs.", action:"Completely harmless and shy. Glides between trees — watch from distance.", firstAid:"Not applicable.", note:"Cannot truly fly but glides up to 60m. Males have yellow throat pouch used for display." },
  { name:"Saltwater Crocodile", scientific:"Crocodylus porosus", emoji:"🐊", danger:"dangerous" as Danger, found:"Mangroves, tidal rivers, coastal Sarawak — Lundu, Satok, Bako", id:"Very large. Brown-grey. Seen in Sarawak rivers — especially near estuary.", action:"Never swim or wade in estuarine rivers in Sarawak. Never approach. Potentially fatal.", firstAid:"Emergency 999. Tourniquet if limb. Rush to hospital.", note:"Responsible for deaths in Sarawak. Heed crocodile warning signs. Never enter water near estuary." },
  { name:"Painted Terrapin", scientific:"Batagur borneoensis", emoji:"🐢", danger:"protected" as Danger, found:"Major rivers of Sarawak and Sabah", id:"Large freshwater turtle. Red and blue face markings in breeding males.", action:"Protected species. Do not disturb nests or take eggs. Report sightings to Sarawak Forestry.", firstAid:"Not applicable — harmless.", note:"Critically endangered. Protected under Sarawak Wildlife Protection Ordinance. Nests on river beaches." },
];

export default function ReptileGuide() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Danger|"all">("all");
  const [selected, setSelected] = useState(REPTILES[0]);

  const filtered = REPTILES.filter(r =>
    (filter === "all" || r.danger === filter) &&
    (r.name.toLowerCase().includes(search.toLowerCase()) || r.found.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🦎</span>
          <div><h1 className="text-xl font-bold">Reptile Guide</h1><p className="text-xs text-muted-foreground">Snakes, lizards & crocodiles of Malaysia/Sarawak</p></div>
        </div>
        <div className="container pb-3 space-y-2">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reptile or location..." className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
          <div className="flex gap-2 overflow-x-auto">
            {(["all","venomous","dangerous","harmless","protected"] as const).map(f => (
              <button type="button" key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filter === f ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>
                {f === "all" ? "All" : f === "venomous" ? "☠️ Venomous" : f === "dangerous" ? "⚠️ Dangerous" : f === "harmless" ? "✅ Harmless" : "🛡️ Protected"}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        <div className="glass rounded-xl p-3 border border-red-500/20 mb-4"><p className="text-xs text-red-300">🏥 Snakebite emergency: Hospital Sarawak 082-276666 · Hospital Miri 085-420033 · Emergency 999</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
            {filtered.map(r => (
              <button type="button" key={r.scientific} onClick={() => setSelected(r)}
                className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.scientific === r.scientific ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/40 hover:border-emerald-500/30"}`}>
                <span className="text-xl">{r.emoji}</span>
                <div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{r.name}</p><p className="text-xs text-muted-foreground italic truncate">{r.scientific}</p></div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 capitalize ${DANGER_STYLE[r.danger]}`}>{r.danger}</span>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2">
            <div className="glass rounded-xl p-5 border border-border/50 space-y-3">
              <div className="flex items-center gap-3"><span className="text-3xl">{selected.emoji}</span><div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-xs italic text-muted-foreground">{selected.scientific}</p></div><span className={`ml-auto text-xs font-bold px-2 py-1 rounded-full border capitalize ${DANGER_STYLE[selected.danger]}`}>{selected.danger}</span></div>
              {[["📍 Found In", selected.found, "border-border/40"],["🔍 How to Identify", selected.id, "border-blue-500/20"],["🏃 What to Do", selected.action, "border-amber-500/30"],["🏥 First Aid", selected.firstAid, "border-red-500/30"]].map(([l,v,b]) => (
                <div key={String(l)} className={`glass rounded-lg p-3 border ${b}`}><p className="text-xs font-bold text-muted-foreground mb-1">{l}</p><p className="text-sm">{v}</p></div>
              ))}
              <div className="glass rounded-lg p-3 border border-emerald-500/20"><p className="text-xs text-emerald-300">💡 {selected.note}</p></div>
              <div className="flex gap-2">
                <a href={`https://www.inaturalist.org/search?q=${encodeURIComponent(selected.scientific)}`} target="_blank" rel="noopener noreferrer" className="text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-green-400">iNaturalist</a>
                <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(selected.scientific)}`} target="_blank" rel="noopener noreferrer" className="text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-blue-400">Wikipedia</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
