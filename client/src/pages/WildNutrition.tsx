import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Search } from "lucide-react";

interface Plant {
  name: string;
  malay: string;
  emoji: string;
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vit: string[];
  minerals: string[];
  note: string;
}

const PLANTS: Plant[] = [
  { name:"Kangkung (Water Spinach)", malay:"Kangkung", emoji:"🌿", cal:19, protein:2.6, carbs:3.1, fat:0.2, fiber:2.1, vit:["Vitamin A (beta-carotene)","Vitamin C","Vitamin K","Folate","Riboflavin"], minerals:["Iron","Calcium","Potassium","Magnesium"], note:"Excellent iron source — better than spinach by weight. Daily staple in Malaysia. Extremely nutritious stir-fried or blanched." },
  { name:"Moringa (Drumstick tree)", malay:"Murungai / Kelor", emoji:"🌿", cal:64, protein:9.4, carbs:8.3, fat:1.4, fiber:2.0, vit:["Vitamin A (7x carrot)","Vitamin C (7x orange)","Vitamin B6","Folate"], minerals:["Calcium (4x milk)","Iron (3x spinach)","Potassium","Zinc"], note:"Superfood. Leaves are most nutritious part — dry and powder for year-round use. Available fresh in Sarawak markets." },
  { name:"Pegaga (Gotu Kola)", malay:"Pegaga", emoji:"🌿", cal:35, protein:2.5, carbs:6.0, fat:0.8, fiber:3.0, vit:["Vitamin C","Vitamin B1","Vitamin B2","Vitamin A"], minerals:["Calcium","Iron","Phosphorus"], note:"Eaten raw as ulam. Rich in asiaticoside compound — brain and wound healing. Wild-harvested free from riverbanks." },
  { name:"Papaya leaves", malay:"Daun Betik", emoji:"🌿", cal:42, protein:3.8, carbs:7.0, fat:0.5, fiber:4.2, vit:["Vitamin A","Vitamin C","Vitamin K","Folate"], minerals:["Calcium","Iron","Magnesium"], note:"Strong bitter taste — cook with anchovies (ikan bilis) to reduce bitterness. Dengue treatment folk medicine (platelet study ongoing)." },
  { name:"Sweet Potato Leaves", malay:"Daun Ubi Keledek", emoji:"🍠", cal:22, protein:2.8, carbs:3.8, fat:0.3, fiber:3.0, vit:["Vitamin A (very high)","Vitamin C","Vitamin K","Lutein"], minerals:["Iron","Calcium","Potassium"], note:"More nutritious than the root. Often discarded — use as stir-fry vegetable. Very common in Sarawak home gardens." },
  { name:"Tapioca/Cassava Leaves", malay:"Daun Ubi Kayu", emoji:"🌿", cal:37, protein:4.5, carbs:5.4, fat:0.5, fiber:3.7, vit:["Vitamin A","Vitamin C","Thiamine","Riboflavin"], minerals:["Calcium","Iron","Phosphorus"], note:"Must be cooked — raw leaves contain cyanogenic glycosides. Boil 15+ min. Staple in Sarawak (Daun Singgang dish)." },
  { name:"Paku Pakis (Wild Fern)", malay:"Paku Pakis", emoji:"🌿", cal:34, protein:4.6, carbs:5.5, fat:0.4, fiber:4.5, vit:["Vitamin A","Vitamin C","Niacin","Riboflavin"], minerals:["Iron","Potassium","Phosphorus"], note:"Young fiddleheads only — older fronds bitter and less nutritious. Iron content very high. Blanch briefly or stir-fry." },
  { name:"Banana Blossom", malay:"Jantung Pisang", emoji:"🍌", cal:51, protein:1.6, carbs:9.9, fat:0.6, fiber:5.7, vit:["Vitamin A","Vitamin C","Vitamin E","Folate"], minerals:["Potassium","Calcium","Iron","Zinc"], note:"Extremely high fiber. Used in Malay and Iban cooking. Soak in lemon water after cutting to prevent browning." },
  { name:"Ulam Raja (King Salad)", malay:"Ulam Raja", emoji:"🌿", cal:44, protein:3.9, carbs:6.4, fat:1.1, fiber:3.1, vit:["Vitamin A","Vitamin C","Vitamin E","Beta-carotene"], minerals:["Calcium","Potassium","Iron"], note:"Bitter, aromatic. Eaten raw as ulam. Anti-inflammatory properties. Common in Sarawak gardens — very easy to grow." },
  { name:"Daun Kaduk (Wild Pepper Leaf)", malay:"Daun Kaduk", emoji:"🍃", cal:39, protein:3.1, carbs:5.2, fat:1.5, fiber:2.8, vit:["Vitamin A","Vitamin C"], minerals:["Calcium","Iron","Phosphorus"], note:"Peppery flavour. Wrap fish in it before grilling (Ikan Bakar). Rich in antioxidants. Common in Iban traditional cooking." },
  { name:"Serai (Lemongrass)", malay:"Serai", emoji:"🌿", cal:99, protein:1.8, carbs:25.3, fat:0.5, fiber:0, vit:["Vitamin A","Folate","Vitamin B6"], minerals:["Iron","Calcium","Magnesium","Potassium","Zinc"], note:"Use as herb — eaten in small amounts. Rich aroma from citral. Excellent antifungal and antimicrobial properties." },
  { name:"Bamboo Shoots", malay:"Rebung", emoji:"🎍", cal:27, protein:2.6, carbs:5.2, fat:0.3, fiber:2.2, vit:["Vitamin B6","Vitamin E","Thiamine","Riboflavin"], minerals:["Potassium","Zinc","Copper","Iron"], note:"Harvest young shoots only. Boil to remove bitterness (cyanogenic compounds). Very high potassium — good for blood pressure." },
];

export default function WildNutrition() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(PLANTS[0]);

  const filtered = PLANTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.malay.toLowerCase().includes(search.toLowerCase())
  );

  const bars = [
    { label:"Protein", val:selected.protein, max:15, color:"bg-blue-500" },
    { label:"Carbs", val:selected.carbs, max:30, color:"bg-yellow-500" },
    { label:"Fat", val:selected.fat, max:5, color:"bg-orange-500" },
    { label:"Fiber", val:selected.fiber, max:10, color:"bg-green-500" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🥗</span>
          <div><h1 className="text-xl font-bold">Wild Plant Nutrition</h1><p className="text-xs text-muted-foreground">Nutritional value of edible Malaysian plants (per 100g)</p></div>
        </div>
        <div className="container pb-3">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search plant..." className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
        </div>
      </div>

      <div className="container py-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
            {filtered.map(p => (
              <button type="button" key={p.name} onClick={() => setSelected(p)} className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.name === p.name ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/40 hover:border-emerald-500/30"}`}>
                <span className="text-xl">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.malay}</p>
                </div>
                <span className="text-xs text-emerald-400 font-bold flex-shrink-0">{p.cal} kcal</span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 space-y-3">
            <div className="glass rounded-xl p-5 border border-emerald-500/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{selected.emoji}</span>
                <div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-sm text-muted-foreground italic">{selected.malay}</p></div>
                <div className="ml-auto text-right"><p className="text-2xl font-black text-emerald-400">{selected.cal}</p><p className="text-xs text-muted-foreground">kcal/100g</p></div>
              </div>

              <div className="space-y-2 mb-4">
                {bars.map(b => (
                  <div key={b.label}>
                    <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{b.label}</span><span className="font-bold">{b.val}g</span></div>
                    <div className="w-full bg-border/30 rounded-full h-2">
                      <div className={`h-2 rounded-full ${b.color}`} style={{ width: `${Math.min(100, (b.val / b.max) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="glass rounded-lg p-3 border border-blue-500/20">
                  <p className="text-xs font-bold text-blue-400 mb-2">💊 Vitamins</p>
                  {selected.vit.map(v => <p key={v} className="text-xs text-muted-foreground">• {v}</p>)}
                </div>
                <div className="glass rounded-lg p-3 border border-purple-500/20">
                  <p className="text-xs font-bold text-purple-400 mb-2">⚗️ Minerals</p>
                  {selected.minerals.map(m => <p key={m} className="text-xs text-muted-foreground">• {m}</p>)}
                </div>
              </div>
            </div>
            <div className="glass rounded-lg p-3 border border-amber-500/20">
              <p className="text-xs text-amber-300">💡 {selected.note}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
