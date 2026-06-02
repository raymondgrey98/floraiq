import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const ANIMALS = [
  { name:"Proboscis Monkey", scientific:"Nasalis larvatus", emoji:"🐒", time:"Dawn & dusk (crepuscular)", found:"Coastal mangroves and riverine forest — Bako NP, Kubah, Matang", sound:"Loud honking alarm call. Splashing when entering water.", status:"Endangered — Borneo endemic", see:"Cruise Salak/Santubong rivers at dusk. Bako NP hiking trails at dawn.", fact:"Only found in Borneo. Males have huge pendulous nose. Excellent swimmers — crosses rivers regularly." },
  { name:"Slow Loris", scientific:"Nycticebus menagensis", emoji:"🐾", time:"Nocturnal", found:"Forest — Borneo endemic. Hard to find.", sound:"High-pitched whistle. Rarely vocal.", status:"Vulnerable — protected wildlife", see:"Rarely seen. Night hike in Kubah NP or Lambir Hills with guide.", fact:"Only venomous primate. Toxic bite + arm glands. Illegal as pet. Huge sad eyes adapted for night vision." },
  { name:"Borneo Tarsier", scientific:"Cephalopachus bancanus", emoji:"🐾", time:"Nocturnal", found:"Lowland forest — Bako NP (small population)", sound:"High-pitched calls, duets at night", status:"Vulnerable", see:"Very rarely seen. Look on small branches 1-2m height at night in Bako.", fact:"Huge eyes (relative to body) biggest of any mammal. Eyes are immobile — must rotate head. Carnivorous primate." },
  { name:"Malay Civet", scientific:"Viverra tangalunga", emoji:"🦡", time:"Nocturnal", found:"Forest and plantation edges — fairly common Sarawak", sound:"Cat-like growls and hisses when disturbed.", status:"Least Concern", see:"Night drive in oil palm plantation edges. Road crossing between dusk and midnight.", fact:"Source of musk used in perfume. Marks territory with anal gland secretions. Eats fruit, insects, small animals." },
  { name:"Common Palm Civet (Musang)", scientific:"Paradoxurus hermaphroditus", emoji:"🦡", time:"Nocturnal", found:"Everywhere — forest to urban areas, attics", sound:"High-pitched squeals. Hissing. Scratching in attic.", status:"Least Concern", see:"Often heard in attics and roofs. Road kills at night. Gardens at night.", fact:"Produces Kopi Luwak coffee by eating and excreting coffee berries. Common in Malaysian homes." },
  { name:"Sambar Deer", scientific:"Rusa unicolor", emoji:"🦌", time:"Mostly nocturnal and crepuscular", found:"Forests and forest edges — very common Sarawak", sound:"Loud bark alarm call when startled.", status:"Vulnerable", see:"Night road drive near forest. Salt licks near logged areas. Eyes reflect headlights from 100m.", fact:"Sarawak's largest deer. Important game animal. Can be aggressive during rut season." },
  { name:"Buffy Fish Owl", scientific:"Ketupa ketupu", emoji:"🦉", time:"Nocturnal", found:"Near rivers and forest — common in Sarawak", sound:"Distinctive loud 'boop' or 'bu-boop' call at night — unmistakable.", status:"Least Concern", see:"Listen for call near rivers from 8pm. Shine torch toward call — eyes reflect orange.", fact:"Specialised for catching fish. Rough scales on feet. Very vocal pair duets at night near water." },
  { name:"Spotted Wood Owl", scientific:"Strix seloputo", emoji:"🦉", time:"Nocturnal", found:"Forest edges, plantations, parks", sound:"Loud deep 'hoo-hoo-hoo'. Also makes barking sound.", status:"Least Concern", see:"Urban parks at night. Heard more than seen. Shine light in large trees when calling.", fact:"Largest owl in Sarawak. Hunts rats in plantation. Welcome in oil palm as natural pest control." },
  { name:"Pangolin (Sunda)", scientific:"Manis javanica", emoji:"🦔", time:"Nocturnal", found:"Forests, plantation edges — critically endangered", sound:"Virtually silent. Hisses when threatened.", status:"Critically Endangered — most trafficked animal in world", see:"Extremely rare to see. Report sightings to Sarawak Wildlife immediately.", fact:"Curls into ball when threatened. Scales are keratin (same as fingernails). Illegal wildlife trade decimating population." },
  { name:"Bornean Flying Squirrel", scientific:"Iomys horsfieldi", emoji:"🐿️", time:"Nocturnal", found:"Forest canopy — Borneo", sound:"High-pitched squeaks. Wings make swishing sound when gliding.", status:"Least Concern", see:"Night hike with torch. Look for movement between trees. Glides up to 100m.", fact:"Gliding membrane (patagium) stretches from wrist to ankle. Multiple species of flying squirrel in Sarawak." },
  { name:"Oriental Bay Owl", scientific:"Phodilus badius", emoji:"🦉", time:"Nocturnal", found:"Dense forest", sound:"Eerie ascending whistle repeated 6-7 times", status:"Least Concern", see:"Very rarely seen. Listen for distinctive whistle in primary forest at night.", fact:"Heart-shaped face. Related to barn owl family. Elusive even for experienced birders." },
  { name:"Malay Tapir", scientific:"Tapirus indicus", emoji:"🐾", time:"Nocturnal", found:"Lowland forest — Peninsular Malaysia, very rare in Sarawak", sound:"High-pitched whistle contact call", status:"Endangered", see:"Very rare sighting. Check camera traps in protected forests.", fact:"Bizarre black-and-white pattern breaks up outline in dappled forest light. Ancient species — unchanged for 35 million years." },
];

export default function NocturnalGuide() {
  const [selected, setSelected] = useState(ANIMALS[0]);

  const STATUS_COLOR: Record<string, string> = { "Least Concern":"text-green-400", "Vulnerable":"text-amber-400", "Endangered":"text-orange-400", "Critically Endangered":"text-red-400" };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🌙</span>
          <div><h1 className="text-xl font-bold">Nocturnal Wildlife</h1><p className="text-xs text-muted-foreground">Night creatures of Borneo/Sarawak</p></div>
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
            {ANIMALS.map(a => <button type="button" key={a.scientific} onClick={() => setSelected(a)} className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.scientific === a.scientific ? "border-purple-500/60 bg-purple-500/5" : "border-border/40 hover:border-purple-500/30"}`}><span className="text-xl">{a.emoji}</span><div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{a.name}</p><p className="text-xs text-muted-foreground">{a.time}</p></div></button>)}
          </div>
          <div className="lg:col-span-2">
            <div className="glass rounded-xl p-5 border border-purple-500/30 space-y-3">
              <div className="flex items-center gap-3"><span className="text-3xl">{selected.emoji}</span><div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-xs italic text-muted-foreground">{selected.scientific}</p><p className={`text-xs font-bold ${STATUS_COLOR[selected.status.split(" —")[0]] || "text-muted-foreground"}`}>{selected.status}</p></div></div>
              {[["🌙 Active Time", selected.time, "border-purple-500/20"],["📍 Where Found", selected.found, "border-border/40"],["🔊 Sound", selected.sound, "border-blue-500/20"],["👁️ How to See", selected.see, "border-emerald-500/20"]].map(([l,v,b]) => <div key={String(l)} className={`glass rounded-lg p-3 border ${b}`}><p className="text-xs font-bold text-muted-foreground mb-1">{l}</p><p className="text-sm">{v}</p></div>)}
              <div className="glass rounded-lg p-3 border border-amber-500/20"><p className="text-xs text-amber-300">⭐ {selected.fact}</p></div>
              <a href={`https://www.inaturalist.org/search?q=${encodeURIComponent(selected.scientific)}&place_id=6901`} target="_blank" rel="noopener noreferrer" className="text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-green-400 inline-block">iNaturalist Sarawak sightings</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
