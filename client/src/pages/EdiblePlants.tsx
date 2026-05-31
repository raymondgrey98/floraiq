import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Search } from "lucide-react";

type Safety = "safe" | "caution" | "expert";
const SAFETY_COLOR: Record<Safety, string> = {
  safe: "bg-green-500/20 text-green-400 border-green-500/30",
  caution: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  expert: "bg-red-500/20 text-red-400 border-red-500/30",
};

const PLANTS = [
  { name:"Paku Pakis (Wild Fern)", malay:"Paku pakis", emoji:"🌿", safety:"safe" as Safety, part:"Young fronds", how:"Boil or stir-fry young curled fronds. Common in Sarawak markets.", habitat:"Riverbanks, forest edges", season:"Year-round", nutrition:"Iron, folate, vitamin C", tip:"Only eat tightly curled young fronds. Common side dish in Dayak cuisine." },
  { name:"Bamboo Shoots", malay:"Rebung", emoji:"🎍", safety:"safe" as Safety, part:"Young shoots", how:"Boil first to remove bitterness, then stir-fry or add to curries.", habitat:"Bamboo groves", season:"Rainy season", nutrition:"Fibre, potassium, B vitamins", tip:"Must be boiled — raw shoots contain cyanide that cooking destroys." },
  { name:"Wild Banana Heart", malay:"Jantung pisang", emoji:"🍌", safety:"safe" as Safety, part:"Flower bud", how:"Remove outer purple bracts, slice, boil or cook in coconut milk.", habitat:"Wild banana plants in forests", season:"Year-round", nutrition:"Iron, vitamin B6, potassium", tip:"Staple vegetable in Sarawak. Soak sliced bud in salted water to prevent browning." },
  { name:"Tapioca Leaves", malay:"Daun ubi", emoji:"🌿", safety:"safe" as Safety, part:"Young leaves", how:"Boil in multiple changes of water to remove cyanide. Then stir-fry with sambal.", habitat:"Farms, roadsides, jungle edges", season:"Year-round", nutrition:"Protein, iron, calcium", tip:"Staple vegetable for Dayak communities. MUST be boiled — raw leaves are toxic." },
  { name:"Wild Ginger Shoot", malay:"Halia hutan", emoji:"🌿", safety:"safe" as Safety, part:"Young shoots and rhizome", how:"Raw in ulam salad or cooked in curries and soups.", habitat:"Forest understorey, riverbanks", season:"Year-round", nutrition:"Antioxidants, gingerols", tip:"Milder than cultivated ginger. Common foraged ingredient in Sarawak jungle." },
  { name:"Pegaga (Gotu Kola)", malay:"Pegaga", emoji:"🌿", safety:"safe" as Safety, part:"Whole plant", how:"Eat raw as ulam, blend into juice, or add to salads.", habitat:"Wet ground, kampung gardens", season:"Year-round", nutrition:"Antioxidants, brain nutrients, Vitamin C", tip:"Famous memory herb. Very common in Malaysian kampungs — often grows wild." },
  { name:"Ulam Raja", malay:"Ulam raja", emoji:"🌸", safety:"safe" as Safety, part:"Leaves and flowers", how:"Eat raw as ulam with sambal belacan, or blanch lightly.", habitat:"Roadsides, gardens, disturbed land", season:"Year-round", nutrition:"Antioxidants, calcium, iron", tip:"Grows like a weed in Malaysia. Slightly bitter, pairs well with sambal." },
  { name:"Wild Papaya", malay:"Betik hutan", emoji:"🍈", safety:"safe" as Safety, part:"Fruit, flowers, young leaves", how:"Fruit eaten ripe. Young leaves boiled as vegetable. Flowers in soup.", habitat:"Forest edges, disturbed areas", season:"Year-round", nutrition:"Papain enzyme, Vitamin C, A", tip:"Unripe papaya high in papain — avoid in large amounts if pregnant." },
  { name:"Moringa Leaves", malay:"Kelor", emoji:"🌿", safety:"safe" as Safety, part:"Leaves, pods, seeds", how:"Leaves in soup, pods in curry, seeds as water purifier.", habitat:"Roadsides, kampung gardens, dryland", season:"Year-round", nutrition:"Most nutrient-dense plant — protein, iron, all vitamins", tip:"One of world's most nutritious plants. Very common in rural Malaysia." },
  { name:"Wild Amaranth", malay:"Bayam hutan", emoji:"🌿", safety:"safe" as Safety, part:"Young leaves and stems", how:"Boil or stir-fry like spinach. Slightly earthy flavour.", habitat:"Disturbed land, roadsides, farms", season:"Year-round", nutrition:"Iron, calcium, vitamin A and K", tip:"Related to cultivated bayam. Wild version more bitter but equally nutritious." },
  { name:"Rattan Shoots", malay:"Rotan", emoji:"🌴", safety:"safe" as Safety, part:"Growing tips", how:"Remove spines, boil or grill. Traditional Dayak food.", habitat:"Lowland rainforest, Borneo", season:"Year-round", nutrition:"Fibre, vitamins, minerals", tip:"Important food and trade crop in Sarawak. Palm heart-like flavour when young." },
  { name:"Sago Palm Pith", malay:"Sagu", emoji:"🌴", safety:"safe" as Safety, part:"Trunk pith (processed)", how:"Extract starch from trunk, wash thoroughly, dry and cook.", habitat:"Swampy areas, Sarawak coastal", season:"Year-round — harvest when mature", nutrition:"Pure carbohydrate — energy food", tip:"Staple food of coastal Melanau people in Sarawak. Major food security crop." },
  { name:"Wild Turmeric", malay:"Kunyit hutan", emoji:"🌿", safety:"safe" as Safety, part:"Rhizome", how:"Use like cultivated turmeric — curries, rice, medicine.", habitat:"Forest understorey, riverbanks", season:"Year-round", nutrition:"Curcumin, antioxidants", tip:"Multiple wild species in Borneo. Some have medicinal uses beyond cooking." },
  { name:"Mangrove Apple", malay:"Buah pedada", emoji:"🍎", safety:"safe" as Safety, part:"Fruit", how:"Eat ripe fruit raw, make jam, or use in cooking.", habitat:"Mangrove forests, coastal Malaysia", season:"Varies by species", nutrition:"Vitamin C, tannins", tip:"Sonneratia species. Edible fruit popular in Sarawak coastal villages." },
  { name:"Water Hyacinth Shoots", malay:"Keladi bunting", emoji:"🌸", safety:"caution" as Safety, part:"Young shoots (cooked only)", how:"MUST be cooked. Boil shoots and eat as vegetable.", habitat:"Rivers, ponds, wetlands — often invasive", season:"Year-round", nutrition:"Iron, protein", tip:"Only young shoots when cooked. Invasive plant but edible — useful in survival." },
  { name:"Wild Taro Leaves", malay:"Keladi hutan", emoji:"🌿", safety:"expert" as Safety, part:"Leaves (cooked thoroughly)", how:"MUST boil in multiple changes of water. Raw causes intense burning.", habitat:"Wet forest areas, riverbanks", season:"Year-round", nutrition:"Calcium, iron, vitamins", tip:"DANGER: Contains calcium oxalate crystals. Must cook thoroughly. Expert ID needed." },
  { name:"Jungle Figs", malay:"Ara hutan", emoji:"🫐", safety:"caution" as Safety, part:"Ripe fruit", how:"Eat ripe fruit. Unripe fruit has caustic latex.", habitat:"Forests, riverbanks — fig trees", season:"Irregular — watch for ripe fruit", nutrition:"Sugar, fibre, calcium", tip:"Many Ficus species in Malaysia are edible when fully ripe. Learn to identify correctly." },
  { name:"Wild Lemongrass", malay:"Serai hutan", emoji:"🌾", safety:"safe" as Safety, part:"Stems and leaves", how:"Same as cultivated lemongrass — soups, curries, tea.", habitat:"Forest clearings, riverbanks", season:"Year-round", nutrition:"Citral, antioxidants", tip:"Multiple wild species in Borneo — all edible. Slightly less aromatic than cultivated." },
];

export default function EdiblePlants() {
  const [search, setSearch] = useState("");
  const [safety, setSafety] = useState<"all"|Safety>("all");
  const [selected, setSelected] = useState(PLANTS[0]);

  const filtered = PLANTS.filter(p =>
    (safety === "all" || p.safety === safety) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.malay.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🫚</span>
          <div><h1 className="text-xl font-bold">Edible Wild Plants</h1><p className="text-xs text-muted-foreground">Malaysia jungle & kampung foraging guide</p></div>
        </div>
        <div className="container pb-3 space-y-2">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search plants..." className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
          <div className="flex gap-2">
            {(["all","safe","caution","expert"] as const).map(s => (
              <button type="button" key={s} onClick={() => setSafety(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${safety === s ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>
                {s === "all" ? "All" : s === "safe" ? "✅ Safe" : s === "caution" ? "⚠️ Caution" : "🔴 Expert only"}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
            {filtered.map(p => (
              <button type="button" key={p.name} onClick={() => setSelected(p)}
                className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.name === p.name ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/40 hover:border-emerald-500/30"}`}>
                <span className="text-xl">{p.emoji}</span>
                <div className="min-w-0"><p className="font-semibold text-sm truncate">{p.name}</p><p className="text-xs text-muted-foreground">{p.malay}</p></div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${SAFETY_COLOR[p.safety]}`}>{p.safety.toUpperCase()}</span>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2">
            <div className="glass rounded-xl p-5 border border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-3"><span className="text-4xl">{selected.emoji}</span><div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-sm text-muted-foreground">{selected.malay}</p></div><span className={`ml-auto text-xs font-bold px-2 py-1 rounded-full border ${SAFETY_COLOR[selected.safety]}`}>{selected.safety.toUpperCase()}</span></div>
              <div className="grid grid-cols-2 gap-3">
                {[["🍽️ Part Used", selected.part],["🍳 How to Eat", selected.how],["🏕️ Habitat", selected.habitat],["📅 Season", selected.season],["💊 Nutrition", selected.nutrition]].map(([l,v]) => (
                  <div key={String(l)} className="glass rounded-lg p-3 border border-border/40"><p className="text-xs font-bold text-emerald-400 mb-1">{l}</p><p className="text-xs text-muted-foreground">{v}</p></div>
                ))}
              </div>
              <div className="glass rounded-lg p-3 border border-blue-500/20"><p className="text-xs text-blue-300">💡 {selected.tip}</p></div>
              {selected.safety !== "safe" && <div className="glass rounded-lg p-3 border border-red-500/30 bg-red-950/20"><p className="text-xs text-red-300 font-bold">⚠️ Warning: Always confirm ID with expert before consuming. When in doubt, don't eat it.</p></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
