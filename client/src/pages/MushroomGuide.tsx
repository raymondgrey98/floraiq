import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft, Search, Loader2, ExternalLink } from "lucide-react";

const LOCAL_MUSHROOMS = [
  { name:"Cendawan Susu Rimau",scientific:"Lignosus rhinocerotis",emoji:"🍄",edible:"medicinal",habitat:"Lowland forest",desc:"Tiger Milk Mushroom — most prized medicinal mushroom in Borneo. Extremely rare.",tip:"DO NOT harvest wild — protected in Sarawak. Now commercially cultivated." },
  { name:"Cendawan Tiram",scientific:"Pleurotus ostreatus",emoji:"🍄",edible:"edible",habitat:"Dead wood, fallen logs",desc:"Oyster mushroom — one of the safest and most cultivated mushrooms. Grows on decaying hardwood.",tip:"White to grey fan-shaped clusters on wood. Very common in Malaysia markets and easy to grow at home." },
  { name:"Shiitake",scientific:"Lentinula edodes",emoji:"🍄",edible:"edible",habitat:"Hardwood logs (cultivated in highlands)",desc:"Popular cultivated mushroom. Grown commercially in Cameron Highlands.",tip:"Dark brown umbrella cap, cream gills. Strong umami flavour. Medicinal: immune boost, cholesterol." },
  { name:"Cendawan Kukur",scientific:"Termitomyces heimii",emoji:"🍄",edible:"edible",habitat:"Termite mounds, grassland",desc:"Termite mushroom — large white edible mushroom found near termite nests. Seasonal and prized.",tip:"Found after rain near termite mounds. Highly sought after in rural Sarawak. Cannot be commercially cultivated." },
  { name:"Enoki",scientific:"Flammulina velutipes",emoji:"🍄",edible:"edible",habitat:"Cultivated, dead elm wood",desc:"Long thin white mushrooms with small caps. Very popular in Asian cooking.",tip:"White long stems grown in dark conditions. High antioxidants. Good in hotpot and soups." },
  { name:"Lingzhi / Reishi",scientific:"Ganoderma lucidum",emoji:"🍄",edible:"medicinal",habitat:"Dead hardwood stumps",desc:"Red lacquered shelf mushroom. Major medicinal mushroom in Chinese medicine.",tip:"Too woody to eat directly. Boil as tea or use extract. Immune modulation, cancer support." },
  { name:"Cendawan Kabut",scientific:"Dictyophora indusiata",emoji:"🕸️",edible:"edible",habitat:"Garden soil, compost",desc:"Bridal veil / stinkhorn mushroom. Fancy looking with white veil skirt. Strong smell attracts flies.",tip:"Remove veil, boil egg-stage. Common in Chinese cuisine. Found in Malaysian gardens after rain." },
  { name:"Destroying Angel",scientific:"Amanita phalloides",emoji:"⚠️",edible:"deadly",habitat:"Forest, tree roots",desc:"DEADLY — white innocent-looking mushroom containing amatoxins. No antidote.",tip:"AVOID all white Amanita. Responsible for 90% of mushroom deaths worldwide. Rare in Malaysia but present." },
  { name:"Death Cap",scientific:"Amanita bisporigera",emoji:"☠️",edible:"deadly",habitat:"Forest, near oaks",desc:"DEADLY — pure white, smells pleasant when young. Contains lethal amatoxins.",tip:"NEVER eat white mushrooms from ground without expert verification. Can cause fatal liver failure." },
  { name:"Ear Mushroom (Wood Ear)",scientific:"Auricularia auricula-judae",emoji:"👂",edible:"edible",habitat:"Dead wood, logs",desc:"Jelly-like ear-shaped black/brown mushroom. Common in Chinese cooking.",tip:"Ear-shaped, dark brown jelly fungus on wood. Very common in Malaysia. Blood thinning — caution if on warfarin." },
];

export default function MushroomGuide() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all"|"edible"|"medicinal"|"deadly">("all");
  const [selected, setSelected] = useState(LOCAL_MUSHROOMS[0]);
  const [inatData, setInatData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const filtered = LOCAL_MUSHROOMS.filter(m =>
    (filter === "all" || m.edible === filter) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.scientific.toLowerCase().includes(search.toLowerCase()))
  );

  async function fetchInat(scientific: string) {
    setLoading(true); setInatData([]);
    try {
      const r = await fetch(`https://api.inaturalist.org/v1/observations?taxon_name=${encodeURIComponent(scientific)}&place_id=6901&per_page=6&photos=true&quality_grade=research`, { signal: AbortSignal.timeout(8000) });
      const d = await r.json();
      setInatData(d.results || []);
    } catch { setInatData([]); }
    setLoading(false);
  }

  function selectMushroom(m: typeof LOCAL_MUSHROOMS[0]) { setSelected(m); fetchInat(m.scientific); }

  const EDIBLE_COLOR: Record<string, string> = { edible:"text-green-400 bg-green-500/20 border-green-500/30", medicinal:"text-purple-400 bg-purple-500/20 border-purple-500/30", deadly:"text-red-400 bg-red-500/20 border-red-500/30" };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🍄</span>
          <div><h1 className="text-xl font-bold">Mushroom Guide</h1><p className="text-xs text-muted-foreground">Malaysia fungi — edible, medicinal & deadly</p></div>
        </div>
        <div className="container pb-3 space-y-2">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search mushroom..." className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
          <div className="flex gap-2">
            {(["all","edible","medicinal","deadly"] as const).map(f => (
              <button type="button" key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all capitalize ${filter === f ? "bg-purple-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{f === "all" ? "All" : f === "edible" ? "✅ Edible" : f === "medicinal" ? "💜 Medicinal" : "☠️ Deadly"}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        <div className="glass rounded-xl p-3 border border-red-500/30 mb-4"><p className="text-xs text-red-300 font-bold">⚠️ NEVER eat wild mushrooms without expert identification. Many deadly species look identical to edible ones. When in doubt, don't eat it.</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
            {filtered.map(m => (
              <button type="button" key={m.scientific} onClick={() => selectMushroom(m)}
                className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.scientific === m.scientific ? "border-purple-500/60 bg-purple-500/5" : "border-border/40 hover:border-purple-500/30"}`}>
                <span className="text-xl">{m.emoji}</span>
                <div className="min-w-0 flex-1"><p className="font-semibold text-sm truncate">{m.name}</p><p className="text-xs text-muted-foreground italic truncate">{m.scientific}</p></div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${EDIBLE_COLOR[m.edible]}`}>{m.edible}</span>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-xl p-5 border border-purple-500/30">
              <div className="flex items-center gap-3 mb-3"><span className="text-3xl">{selected.emoji}</span><div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-xs italic text-muted-foreground">{selected.scientific}</p></div><span className={`ml-auto text-xs font-bold px-2 py-1 rounded-full border ${EDIBLE_COLOR[selected.edible]}`}>{selected.edible.toUpperCase()}</span></div>
              <div className="space-y-2">
                <div className="glass rounded-lg p-3 border border-border/40"><p className="text-xs font-bold text-muted-foreground mb-1">🏕️ Habitat</p><p className="text-sm">{selected.habitat}</p></div>
                <div className="glass rounded-lg p-3 border border-border/40"><p className="text-xs font-bold text-muted-foreground mb-1">📝 Description</p><p className="text-sm">{selected.desc}</p></div>
                <div className="glass rounded-lg p-3 border border-blue-500/20"><p className="text-xs text-blue-300">💡 {selected.tip}</p></div>
              </div>
              <div className="flex gap-2 mt-4">
                <a href={`https://mushroomobserver.org/observer/lookup_name?name=${encodeURIComponent(selected.scientific)}`} target="_blank" rel="noopener noreferrer" className="text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-purple-400">Mushroom Observer</a>
                <a href={`https://www.inaturalist.org/search?q=${encodeURIComponent(selected.scientific)}`} target="_blank" rel="noopener noreferrer" className="text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-green-400">iNaturalist</a>
              </div>
              {loading && <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground"><Loader2 className="w-3 h-3 animate-spin" />Loading Malaysia sightings...</div>}
              {inatData.length > 0 && (
                <div className="mt-4"><p className="text-xs font-bold text-muted-foreground mb-2">Malaysia Sightings (iNaturalist)</p>
                  <div className="grid grid-cols-3 gap-2">
                    {inatData.slice(0,6).map((obs, i) => obs.photos?.[0]?.url && (
                      <img key={i} src={obs.photos[0].url.replace("square","small")} alt="" className="w-full aspect-square object-cover rounded-lg" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
