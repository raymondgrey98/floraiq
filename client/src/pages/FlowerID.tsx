import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Search } from "lucide-react";

const FLOWERS = [
  { name:"Ixora (Jungle Flame)", malay:"Jejarum / Siantan", emoji:"🌸", color:"Red/Orange/Yellow/Pink", petals:"4", shape:"Tubular with flat face — 4-petalled", season:"Year-round", found:"Gardens, roadsides, parks — extremely common Malaysia", id:"Clusters of tiny 4-petalled flowers in dense round head. Narrow tube. Very common garden shrub.", use:"Ornamental. Nectar for butterflies. Flowers edible with mild sweet taste.", note:"Most common flowering shrub in Malaysia. Over 500 species. Red is most common in Sarawak." },
  { name:"Hibiscus (Bunga Raya)", malay:"Bunga Raya", emoji:"🌺", color:"Red (national), also pink, yellow, white, purple", petals:"5 (+ complex staminal column)", shape:"Large, funnel-shaped. Stamens project as column", season:"Year-round", found:"Everywhere — national flower of Malaysia", id:"Large showy flower. 5 petals, prominent long staminal column covered in yellow pollen. Unmistakable.", use:"National flower. Calyx edible — used in roselle tea. Leaves soothing for hair.", note:"Malaysia's national flower (Bunga Raya). Red hibiscus = Hibiscus rosa-sinensis. Blooms daily — each flower lasts 1 day." },
  { name:"Bougainvillea", malay:"Bunga Kertas", emoji:"🌸", color:"Purple/Pink/Red/Orange/White (bracts, not petals)", petals:"3 tiny (surrounded by 3 papery bracts)", shape:"Small tube hidden by 3 colourful papery bracts", season:"Year-round, more intense in dry season", found:"Fences, walls, gardens — very common Sarawak", id:"The 'petals' are actually papery bracts (modified leaves). Real flowers are tiny tubes inside. Thorny woody stems.", use:"Ornamental. Drought tolerant. Used for fences and trellises.", note:"Paper flower (bunga kertas) — bracts look like crepe paper. Thrives in heat and drought." },
  { name:"Heliconia", malay:"Heliconia / Pisang-pisangan", emoji:"🌺", color:"Red/Orange/Yellow with green or yellow bracts", petals:"3 petals hidden inside bracts", shape:"Boat-shaped bracts arranged in ranks — spectacular", season:"Year-round", found:"Gardens, forest edges — common Borneo", id:"Dramatic large bracts (boat-shaped) alternate on stem. Real flowers small, inside bracts. Banana-like leaves.", use:"Cut flower. Nectar for sunbirds and hummingbirds.", note:"Attracts sunbirds. Spectacular cut flower. Many species and hybrids. Native to tropical Americas but naturalised in Borneo." },
  { name:"Wild Ginger Flower", malay:"Bunga Kantan / Torch Ginger", emoji:"🌸", color:"Pink/Red/White — spectacular torch shape", petals:"Multiple fused, form torch-like head", shape:"Tall torch-shaped inflorescence — striking and unique", season:"Year-round (peaks wet season)", found:"Forest edges, plantations, gardens — Sarawak native", id:"Giant pink torch emerging from ground on separate stem. Waxy petals. Distinct from leafy ginger stems.", use:"FOOD — essential Sarawak ingredient in Laksa Sarawak, salads, asam fish. Fragrant, citrus-floral flavour.", note:"Etlingera elatior. Bunga Kantan is one of the most important flavouring ingredients in Sarawak cuisine." },
  { name:"Ylang-Ylang (Kenanga)", malay:"Kenanga", emoji:"🌼", color:"Yellow-green when mature, starts green", petals:"6 long strap-like, drooping", shape:"Star-like with 6 narrow drooping petals. Very fragrant.", season:"Year-round (peaks dry season)", found:"Gardens, parks — ornamental tree", id:"Small star flower with 6 narrow pale yellow petals that droop like a spider. Extremely fragrant scent.", use:"Perfume (Chanel No.5 uses ylang ylang). Aromatherapy. Flower worn in hair.", note:"One of most fragrant flowers in the world. Small tree. Flowers used in traditional Malay weddings." },
  { name:"Lotus (Teratai)", malay:"Teratai", emoji:"🪷", color:"Pink/White/Red", petals:"Many overlapping — 20+", shape:"Bowl-shaped, many petals. Rises above water on long stem.", season:"Morning bloomer — closes afternoon. Year-round.", found:"Ponds, slow rivers, parks with ponds", id:"Large showy flower above water. Distinctive seed pod (flat-topped). Round water-repellent leaves.", use:"All parts edible — flower, seed, root (lotus root), young leaves. Sacred in Buddhist culture.", note:"Self-cleaning leaf (lotus effect). Seed pods popular in flower arrangements. Roots sold in markets." },
  { name:"Banana Flower (Jantung Pisang)", malay:"Jantung Pisang", emoji:"🍌", color:"Purple/maroon bracts with cream flowers inside", petals:"5 tiny inside purple bracts", shape:"Large pendant teardrop, bracts peel back revealing rows of flowers", season:"Year-round when banana fruits", found:"Any banana plant when fruiting", id:"Large hanging purple-maroon flower bud below banana bunch. Bracts open one by one revealing cream florets.", use:"FOOD — highly nutritious vegetable. Stir-fry or curry. Must soak in lemon water.", note:"Often discarded but extremely nutritious. High fiber, iron, potassium. Important in Iban and Malay cooking." },
  { name:"Butterfly Pea (Bunga Telang)", malay:"Bunga Telang", emoji:"💜", color:"Vivid blue-purple (rare in nature)", petals:"5 (standard legume flower)", shape:"Typical pea flower shape. Striking blue colour.", season:"Year-round — climbs rapidly", found:"Gardens, fences, roadsides — easy to grow", id:"Intense vivid blue/purple colour — unmistakable. Pea-shaped flower. Twining vine with small tri-leaflets.", use:"FOOD — natural blue dye for nasi kerabu, drinks, cakes. Changes colour with acid/alkaline (add lime = pink).", note:"Clitoria ternatea. pH indicator — blue in neutral, purple-pink with lemon juice. Trendy in drinks and food colouring." },
  { name:"Frangipani (Bunga Kemboja)", malay:"Bunga Kemboja / Cempaka Putih", emoji:"🌼", color:"White/Yellow/Pink/Red", petals:"5, overlapping, waxy, propeller-shaped", shape:"5-petalled propeller arrangement. Very waxy petals.", season:"Year-round (peak dry season)", found:"Gardens, temples, cemeteries — very common Malaysia", id:"Thick waxy petals in propeller arrangement. Intensely fragrant especially at night. Milky sap in stems.", use:"Ornamental. Sacred in Hindu/Buddhist temples. Worn in hair. Used in Balinese offerings.", note:"Associated with death in Malay culture (planted at graves) but beautiful and fragrant. All parts toxic if ingested." },
];

export default function FlowerID() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(FLOWERS[0]);

  const filtered = FLOWERS.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.malay.toLowerCase().includes(search.toLowerCase()) ||
    f.color.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🌸</span>
          <div><h1 className="text-xl font-bold">Flower ID Guide</h1><p className="text-xs text-muted-foreground">Malaysian flowers — identification, uses, notes</p></div>
        </div>
        <div className="container pb-3">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, colour..." className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" /></div>
        </div>
      </div>

      <div className="container py-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
            {filtered.map(f => (
              <button type="button" key={f.name} onClick={() => setSelected(f)} className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.name === f.name ? "border-pink-500/60 bg-pink-500/5" : "border-border/40 hover:border-pink-500/30"}`}>
                <span className="text-xl">{f.emoji}</span>
                <div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{f.name}</p><p className="text-xs text-muted-foreground truncate">{f.color}</p></div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            <div className="glass rounded-xl p-5 border border-pink-500/30 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selected.emoji}</span>
                <div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-sm italic text-muted-foreground">{selected.malay}</p></div>
              </div>
              {[["🎨 Colour", selected.color, "border-border/40"],
                ["🌿 Shape", selected.shape, "border-border/40"],
                ["📅 Season", selected.season, "border-border/40"],
                ["📍 Where found", selected.found, "border-border/40"],
                ["🔍 How to identify", selected.id, "border-blue-500/20"],
                ["🍽️ Uses", selected.use, "border-emerald-500/20"],
              ].map(([l,v,b]) => (
                <div key={String(l)} className={`glass rounded-lg p-3 border ${b}`}>
                  <p className="text-xs font-bold text-muted-foreground mb-1">{l}</p>
                  <p className="text-sm">{v}</p>
                </div>
              ))}
              <div className="glass rounded-lg p-3 border border-pink-500/20">
                <p className="text-xs text-pink-300">💡 {selected.note}</p>
              </div>
              <a href={`https://www.inaturalist.org/search?q=${encodeURIComponent(selected.name)}&place_id=6901`} target="_blank" rel="noopener noreferrer" className="text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-green-400 inline-block">iNaturalist Sarawak</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
