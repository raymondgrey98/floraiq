import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Search } from "lucide-react";

const SHAPES = [
  { shape:"Ovate (egg-shaped, widest below middle)", emoji:"🌿", examples:["Rambutan","Guava / Jambu batu","Mango (young)","Morinda citrifolia (Mengkudu)"], id:"Broad at base, narrows to tip. Very common in tropical plants." },
  { shape:"Lanceolate (lance-shaped, long & narrow)", emoji:"🍃", examples:["Lemongrass / Serai","Pandan","Bamboo leaf","Ginger plant","Sugarcane"], id:"Long, narrow. Much longer than wide. Parallel-veined usually." },
  { shape:"Palmate (hand-shaped, lobed)", emoji:"🍁", examples:["Papaya / Betik","Cassava / Ubi kayu","Wild fig","Castor bean"], id:"Lobed like an open hand from a central point. Distinctive shape." },
  { shape:"Pinnate (feather-shaped compound)", emoji:"🌿", examples:["Petai (Stinky bean)","Curry leaf tree","Rain tree / Hujan-hujan","Albizzia","Tamarind"], id:"Multiple leaflets arranged along a central stem. Looks like a feather." },
  { shape:"Elliptic (oval, widest at middle)", emoji:"🍃", examples:["Rubber tree","Durian","Mango (mature)","Cempedak","Jackfruit"], id:"Widest in the middle, tapers both ends equally. Most common leaf shape." },
  { shape:"Heart-shaped (cordate)", emoji:"🍃", examples:["Betel leaf / Sireh","Yam / Keladi","Sweet potato / Ubi keledek","Taro","Daun kaduk"], id:"Heart-shaped base, pointed tip. Often large tropical leaves." },
  { shape:"Arrow-shaped (sagittate/hastate)", emoji:"🌿", examples:["Kangkung (some varieties)","Water hyacinth","Caladium","Canna lily"], id:"Pointed tip with backward-pointing lobes at base like an arrowhead." },
  { shape:"Linear (very narrow, grass-like)", emoji:"🌾", examples:["Padi / Rice","Corn leaf","All grass species","Pandanus (pandan screwpine)"], id:"Very narrow, parallel sides. Grasses and related plants." },
  { shape:"Round/circular (orbicular)", emoji:"⭕", examples:["Pegaga / Gotu kola","Water pennywort","Lotus leaf","Nasturtium"], id:"Almost perfectly round. Uncommon but distinctive when seen." },
  { shape:"Fiddle-shaped (pandurate)", emoji:"🎻", examples:["Fiddle-leaf fig","Some Ficus species"], id:"Waist-like constriction in middle giving figure-8 or violin shape." },
];

const MARGINS = [
  { type:"Smooth (entire)", desc:"No teeth or lobes. Common in tropical plants. Examples: mango, durian, rubber tree." },
  { type:"Serrated (toothed)", desc:"Regular teeth pointing forward. Examples: saw palmetto, some figs, strawberry." },
  { type:"Wavy (undulate)", desc:"Gentle waves, not sharp teeth. Examples: jackfruit, soursop, white mulberry." },
  { type:"Lobed", desc:"Deep regular indentations. Examples: papaya, oak, cassava, fig." },
  { type:"Spiny", desc:"Sharp spines at teeth. Examples: pandan screwpine, holly, some palms." },
];

const TEXTURES = [
  { type:"Glossy", plants:"Rubber tree, durian, mango, cempedak — thick waxy cuticle to reduce water loss" },
  { type:"Hairy/fuzzy", plants:"Tomato, pumpkin, bitter gourd, sunflower — hairs reduce transpiration and deter insects" },
  { type:"Velvety", plants:"African violet, calathea, velvet leaf — specialized hairs with tactile function" },
  { type:"Waxy/blue-green", plants:"Cabbage, kale, broccoli, eucalyptus — very thick cuticle, water-repellent" },
  { type:"Leathery (coriaceous)", plants:"Ficus, many tropical forest trees — thick, tough, drought and heat tolerant" },
  { type:"Thin/papery", plants:"Shade plants: impatiens, begonia, most ferns — adapted to low light" },
];

export default function LeafID() {
  const [tab, setTab] = useState<"shape"|"margin"|"texture">("shape");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(SHAPES[0]);

  const filtered = SHAPES.filter(s =>
    s.shape.toLowerCase().includes(search.toLowerCase()) ||
    s.examples.some(e => e.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🍃</span>
          <div><h1 className="text-xl font-bold">Leaf Shape Analyzer</h1><p className="text-xs text-muted-foreground">Identify plants by leaf shape, margin, texture</p></div>
        </div>
        <div className="container pb-3 space-y-2">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by leaf shape or plant..." className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
          <div className="flex gap-2">
            {[["shape","🌿 Shape"],["margin","✂️ Margin"],["texture","👆 Texture"]].map(([v,l]) => (
              <button type="button" key={v} onClick={() => setTab(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${tab === v ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-4 max-w-5xl">
        {tab === "shape" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5 max-h-[75vh] overflow-y-auto">
              {filtered.map(s => (
                <button type="button" key={s.shape} onClick={() => setSelected(s)} className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.shape === s.shape ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/40 hover:border-emerald-500/30"}`}>
                  <span className="text-xl">{s.emoji}</span>
                  <p className="font-semibold text-sm leading-tight">{s.shape.split("(")[0]}</p>
                </button>
              ))}
            </div>
            <div className="lg:col-span-2">
              <div className="glass rounded-xl p-5 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-3"><span className="text-4xl">{selected.emoji}</span><h2 className="text-lg font-bold leading-tight">{selected.shape}</h2></div>
                <div className="glass rounded-lg p-3 border border-border/40"><p className="text-xs font-bold text-muted-foreground mb-1">🔍 How to identify</p><p className="text-sm">{selected.id}</p></div>
                <div><p className="text-xs font-bold text-emerald-400 mb-2">🌿 Plants with this leaf shape</p><div className="flex flex-wrap gap-2">{selected.examples.map(e => <span key={e} className="text-xs bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded-full border border-emerald-500/20">{e}</span>)}</div></div>
              </div>
            </div>
          </div>
        )}

        {tab === "margin" && (
          <div className="space-y-4">
            <div className="glass rounded-xl p-4 border border-blue-500/20 mb-2">
              <p className="text-xs text-blue-300">Leaf margin = the edge of the leaf. Look at the leaf outline — is it smooth, wavy, or toothed? Use a loupe or phone camera for tiny teeth.</p>
            </div>
            {MARGINS.map(m => (
              <div key={m.type} className="glass rounded-xl p-5 border border-border/40">
                <p className="font-bold mb-1">{m.type}</p>
                <p className="text-sm text-muted-foreground">{m.desc}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "texture" && (
          <div className="space-y-4">
            <div className="glass rounded-xl p-4 border border-purple-500/20 mb-2">
              <p className="text-xs text-purple-300">Leaf texture tells you about the plant's environment and adaptations. Glossy = sun and drought. Hairy = sun and insects. Thin = shade. Useful for ID when shape is hard to see.</p>
            </div>
            {TEXTURES.map(t => (
              <div key={t.type} className="glass rounded-xl p-5 border border-border/40">
                <p className="font-bold mb-1">{t.type}</p>
                <p className="text-sm text-muted-foreground">{t.plants}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
