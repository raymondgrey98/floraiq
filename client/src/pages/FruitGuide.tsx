import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Search } from "lucide-react";

const FRUITS = [
  { name:"Durian",malay:"Durian",scientific:"Durio zibethinus",emoji:"🍈",season:"May-Aug (Sarawak)",nutrition:"High calories, B vitamins, potassium, iron",taste:"Rich creamy custard — strong smell, complex sweet-bitter",grow:"4-6 years from grafted tree. Needs forest conditions. Musang King most valuable.",price:"RM 20-50/kg (Musang King), RM 8-15/kg (ordinary)",fun:"King of Fruits. Banned on public transport. Contains tryptophan — mood enhancer." },
  { name:"Rambutan",malay:"Rambutan",scientific:"Nephelium lappaceum",emoji:"🍒",season:"Jun-Aug",nutrition:"Vitamin C, copper, manganese, fibre",taste:"Sweet and slightly acidic. Lychee-like flesh. Refreshing.",grow:"3-5 years from seedling. Full sun, well-drained. Propagate by budding.",price:"RM 3-8/kg",fun:"Name means 'hairy' in Malay. High in antioxidants. Seed contains fats used in cooking." },
  { name:"Mangosteen",malay:"Manggis",scientific:"Garcinia mangostana",emoji:"🟣",season:"Jun-Aug",nutrition:"Xanthones (powerful antioxidants), Vitamin C",taste:"Sweet, tangy, creamy white flesh. Most delicious tropical fruit.",grow:"Very slow — 8-15 years from seed! Grafting still 5-7 years. Needs acidic soil.",price:"RM 8-20/kg — premium fruit",fun:"Queen of Fruits. One of hardest fruits to grow. Cannot be cultivated outside tropics." },
  { name:"Langsat / Duku",malay:"Langsat",scientific:"Lansium domesticum",emoji:"🍇",season:"Jul-Sep",nutrition:"Vitamin C, riboflavin, thiamine",taste:"Sweet-sour, translucent flesh. Some varieties more bitter.",grow:"8-10 years from seed. Shade tolerant. Grows well in Sarawak.",price:"RM 3-6/kg",fun:"Sarawak is major producer. Peel burns as mosquito repellent. Skin used in traditional medicine." },
  { name:"Mango",malay:"Mangga",scientific:"Mangifera indica",emoji:"🥭",season:"Mar-Jun (Peninsular), Feb-Apr (Sarawak)",nutrition:"Vitamin A, C, folate, fibre",taste:"Sweet, fibrous, tropical. Many varieties from very sweet to sour.",grow:"5-8 years from seed, 3-4 from grafting. Full sun, well-drained. Heat-loving.",price:"RM 3-12/kg depending on variety",fun:"Harum Manis most popular in Malaysia. Over 1000 mango varieties worldwide." },
  { name:"Papaya",malay:"Betik",scientific:"Carica papaya",emoji:"🍈",season:"Year-round",nutrition:"Vitamin C, A, folate, papain enzyme",taste:"Sweet, musky, soft orange flesh. Young papaya used as vegetable.",grow:"Fastest fruiting tree — 9 months! Easy, drought-tolerant. Needs good drainage.",price:"RM 1.50-4/kg",fun:"Papain enzyme is meat tenderiser. One of most nutrient-dense fruits. High Vitamin C even unripe." },
  { name:"Starfruit",malay:"Belimbing",scientific:"Averrhoa carambola",emoji:"⭐",season:"Year-round (2 seasons/year)",nutrition:"Vitamin C, B5, potassium, fibre",taste:"Crisp, sweet-sour. Shaped like 5-pointed star when sliced.",grow:"3-5 years, fruits twice yearly. Full sun. Needs netting to protect from birds.",price:"RM 2-5/kg",fun:"WARNING: Toxic to people with kidney disease. Contains caramboxin — avoid if kidney problems." },
  { name:"Jackfruit",malay:"Nangka",scientific:"Artocarpus heterophyllus",emoji:"🍈",season:"Year-round, peaks Feb-Jun",nutrition:"Vitamin B6, C, potassium, magnesium",taste:"Sweet, fibrous, aromatic. Unripe used as meat substitute (vegan meat).",grow:"3-4 years from seed. Fast growing, large tree. Well-drained soil.",price:"RM 1.50-3/kg",fun:"World's largest tree fruit — up to 50kg! Unripe boiled as vegetable — common in Sarawak." },
  { name:"Pineapple",malay:"Nanas",scientific:"Ananas comosus",emoji:"🍍",season:"Year-round, peaks Mar-Jul",nutrition:"Vitamin C, manganese, bromelain enzyme",taste:"Sweet-tart, juicy. MD2 variety extremely sweet.",grow:"18-24 months to first fruit. Ratoons produce second crop faster. Sarawak highland = sweeter.",price:"RM 1.50-8/kg (Sarawak sweet pineapple premium)",fun:"Bromelain enzyme breaks down protein — meat tenderiser. Sarawak sweet pineapple globally famous." },
  { name:"Dragon Fruit",malay:"Buah naga",scientific:"Selenicereus undatus",emoji:"🐲",season:"Year-round (irregular)",nutrition:"Vitamin C, B1, B2, iron, fibre",taste:"Mild sweet, crisp white or red flesh with tiny seeds.",grow:"1-2 years first fruit. Cactus — loves sun and dry conditions. Stake or trellis essential.",price:"RM 4-10/kg",fun:"Flower only blooms at night, pollinated by bats and moths. Multiple harvests per year." },
  { name:"Banana",malay:"Pisang",scientific:"Musa spp.",emoji:"🍌",season:"Year-round (different varieties peak at different times)",nutrition:"Potassium, B6, Vitamin C, manganese, fibre",taste:"Sweet starchy. Many varieties — from tiny sweet Pisang Emas to large Berangan.",grow:"9-12 months first bunch. Remove all but 1 sucker for next crop. Easy in Malaysia.",price:"RM 1.50-5/kg depending on variety",fun:"Pisang Emas (Golden Banana) = Sarawak favourite. Banana is technically a herb not a tree." },
  { name:"Coconut",malay:"Kelapa",scientific:"Cocos nucifera",emoji:"🥥",season:"Year-round",nutrition:"MCT fats, electrolytes, potassium",taste:"Water: refreshing, sweet-neutral. Flesh: rich, creamy, coconutty.",grow:"4-6 years first nut. Dwarf varieties faster. Coastal and lowland Malaysia.",price:"RM 1.50-3/nut",fun:"Every part used: water, flesh, oil, shell, husk, leaves, trunk. Truly zero-waste fruit." },
  { name:"Pomelo",malay:"Limau bali",scientific:"Citrus maxima",emoji:"🍊",season:"Nov-Feb",nutrition:"Vitamin C, fibre, potassium",taste:"Large citrus, less sour than grapefruit. Thick pith. Honey or sweet varieties available.",grow:"5-7 years from seed. Sarawak pomelo from Sibu is famous. Full sun, good drainage.",price:"RM 5-15/fruit",fun:"Sibu pomelo one of the best in Malaysia — famous export. Used in festive celebrations." },
  { name:"Cempedak",malay:"Cempedak",scientific:"Artocarpus integer",emoji:"🍈",season:"Jun-Aug",nutrition:"Vitamin A, C, fibre",taste:"Strong aroma, sweeter than jackfruit. Yellow sticky flesh.",grow:"3-5 years. Related to jackfruit. Common in rural Sarawak.",price:"RM 2-5/kg",fun:"Often battered and fried as popular street food. Stronger smell than jackfruit. Seeds edible when roasted." },
];

export default function FruitGuide() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(FRUITS[0]);
  const filtered = FRUITS.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.malay.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🥭</span>
          <div><h1 className="text-xl font-bold">Tropical Fruit Guide</h1><p className="text-xs text-muted-foreground">14 Malaysian fruits — season, grow, nutrition</p></div>
        </div>
        <div className="container pb-3">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search fruit..." className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
            {filtered.map(f => (
              <button type="button" key={f.name} onClick={() => setSelected(f)}
                className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.name === f.name ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/40 hover:border-emerald-500/30"}`}>
                <span className="text-2xl">{f.emoji}</span>
                <div><p className="font-semibold text-sm">{f.name}</p><p className="text-xs text-muted-foreground">{f.season}</p></div>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2">
            <div className="glass rounded-xl p-5 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-3"><span className="text-4xl">{selected.emoji}</span><div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-xs text-muted-foreground">{selected.malay} · <span className="italic">{selected.scientific}</span></p></div></div>
              <div className="grid grid-cols-2 gap-3">
                {[["📅 Season", selected.season],["👅 Taste", selected.taste],["💊 Nutrition", selected.nutrition],["💰 Price (Malaysia)", selected.price],["🌱 How to Grow", selected.grow]].map(([l,v]) => (
                  <div key={String(l)} className="glass rounded-lg p-3 border border-border/40"><p className="text-xs font-bold text-emerald-400 mb-1">{l}</p><p className="text-xs text-muted-foreground">{v}</p></div>
                ))}
              </div>
              <div className="glass rounded-lg p-3 border border-amber-500/20"><p className="text-xs text-amber-300">⭐ {selected.fun}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
