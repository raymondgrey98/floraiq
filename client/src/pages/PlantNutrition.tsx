import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Search } from "lucide-react";

const PLANTS = [
  { name:"Kangkung (Water Spinach)", malay:"Kangkung", cal:19, protein:2.6, fat:0.2, carb:2.7, fiber:2.1, vitC:55, iron:1.7, calcium:77, beta:4640, note:"One of the most nutritious leafy greens in Malaysia. High in iron and Vitamin C." },
  { name:"Paku Pakis (Fern Shoots)", malay:"Paku pakis", cal:34, protein:4.6, fat:0.4, carb:5.5, fiber:3.9, vitC:26, iron:1.8, calcium:189, beta:2100, note:"Wild fern shoots are a nutritional powerhouse — very high calcium and protein for a vegetable." },
  { name:"Ulam Raja (Cosmos)", malay:"Ulam raja", cal:67, protein:5.5, fat:1.2, carb:8.0, fiber:3.2, vitC:150, iron:3.2, calcium:312, beta:9900, note:"Extremely high in beta-carotene and Vitamin C. Traditional ulam — eat raw with sambal." },
  { name:"Pegaga (Pennywort)", malay:"Pegaga", cal:43, protein:1.7, fat:0.7, carb:8.5, fiber:2.1, vitC:48, iron:2.2, calcium:171, beta:5770, note:"Revered in Malay medicine. Rich in triterpenoids. Enhances memory and wound healing." },
  { name:"Moringa (Drumstick Leaves)", malay:"Murungga/Kelor", cal:64, protein:9.4, fat:1.4, carb:8.3, fiber:2.0, vitC:220, iron:4.0, calcium:185, beta:6780, note:"Superfood. 7x Vitamin C of oranges. 4x calcium of milk. 3x potassium of bananas. Easy to grow in Malaysia." },
  { name:"Sweet Potato Leaves", malay:"Daun ubi keledek", cal:86, protein:3.5, fat:0.5, carb:19.9, fiber:3.5, vitC:11, iron:1.0, calcium:30, beta:8509, note:"Very high beta-carotene. Common in Sarawak cooking. The leaves are more nutritious than the tuber." },
  { name:"Bamboo Shoots", malay:"Pucuk buluh", cal:27, protein:2.6, fat:0.3, carb:5.2, fiber:2.2, vitC:4, iron:0.5, calcium:13, beta:0, note:"Low calorie, good fiber and protein. Needs cooking to remove toxins. Very common in Sarawak jungle." },
  { name:"Banana Flower", malay:"Jantung pisang", cal:65, protein:1.6, fat:0.6, carb:15.0, fiber:5.7, vitC:9, iron:0.6, calcium:56, beta:0, note:"High in fiber and antioxidants. Popular in Malay cooking. Helps with diabetes management." },
  { name:"Tapioca Leaves", malay:"Daun ubi kayu", cal:71, protein:7.0, fat:0.9, carb:13.4, fiber:4.8, vitC:61, iron:2.0, calcium:165, beta:4900, note:"CAUTION: Contains cyanide — MUST be cooked. Once cooked, very nutritious. Common in Sarawak." },
  { name:"Papaya Leaves", malay:"Daun betik", cal:37, protein:3.3, fat:0.3, carb:5.6, fiber:2.1, vitC:102, iron:0.4, calcium:64, beta:1230, note:"Contains papain enzyme. Used for dengue fever recovery (increases platelets). Bitter — usually cooked or juiced." },
  { name:"Sweet Potato (Orange)", malay:"Ubi keledek", cal:86, protein:1.6, fat:0.1, carb:20.1, fiber:3.0, vitC:2.4, iron:0.6, calcium:30, beta:8509, note:"Staple carbohydrate with very high beta-carotene (orange variety). Low GI — good for diabetes." },
  { name:"Jackfruit (Young)", malay:"Nangka muda", cal:94, protein:3.3, fat:0.3, carb:18.9, fiber:1.5, vitC:6.7, iron:0.6, calcium:24, beta:0, note:"Young jackfruit is high protein vegetable substitute. Very popular in curries and rendang." },
  { name:"Morinda/Mengkudu", malay:"Mengkudu (Noni)", cal:49, protein:0.4, fat:0.3, carb:11.0, fiber:2.3, vitC:33.7, iron:0.2, calcium:36, beta:0, note:"Traditional medicine plant. Bitter taste. Rich in antioxidants. Juice used for immune support." },
  { name:"Roselle Leaves", malay:"Asam keping/Roselle", cal:49, protein:1.9, fat:0.7, carb:11.3, fiber:2.5, vitC:14, iron:1.4, calcium:213, beta:285, note:"Extremely high calcium. Sour taste. Rich in anthocyanins (deep red pigment) — antioxidant." },
];

const BARS: Record<string, { max: number; color: string }> = {
  vitC: { max:220, color:"bg-orange-400" },
  protein: { max:10, color:"bg-blue-400" },
  iron: { max:4, color:"bg-red-400" },
  calcium: { max:320, color:"bg-yellow-400" },
  beta: { max:10000, color:"bg-amber-500" },
};

export default function PlantNutrition() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(PLANTS[0]);
  const [metric, setMetric] = useState<keyof typeof BARS>("vitC");

  const filtered = PLANTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.malay.toLowerCase().includes(search.toLowerCase()));
  const sorted = [...PLANTS].sort((a, b) => (b[metric as keyof typeof PLANTS[0]] as number) - (a[metric as keyof typeof PLANTS[0]] as number));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🥗</span>
          <div><h1 className="text-xl font-bold">Plant Nutrition</h1><p className="text-xs text-muted-foreground">Nutritional data for Malaysian wild & garden plants</p></div>
        </div>
        <div className="container pb-3">
          <div className="relative mb-2"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search plant..." className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
            {filtered.map(p => (
              <button type="button" key={p.name} onClick={() => setSelected(p)} className={`w-full text-left glass rounded-xl p-3 border transition-all ${selected.name === p.name ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/40 hover:border-emerald-500/30"}`}>
                <p className="font-semibold text-sm">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.malay} · {p.cal} kcal/100g</p>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-xl p-5 border border-emerald-500/30 space-y-3">
              <div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-sm text-muted-foreground italic">{selected.malay}</p><p className="text-xs text-muted-foreground mt-1">Per 100g edible portion</p></div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                {[["⚡","Calories",`${selected.cal} kcal`],["💪","Protein",`${selected.protein}g`],["🫚","Fat",`${selected.fat}g`],["🌾","Carbs",`${selected.carb}g`],["🧵","Fiber",`${selected.fiber}g`],["🍊","Vit C",`${selected.vitC}mg`]].map(([e,l,v]) => (
                  <div key={String(l)} className="glass rounded-lg p-2 border border-border/30"><p className="text-lg">{e}</p><p className="text-[10px] text-muted-foreground">{l}</p><p className="text-xs font-bold">{v}</p></div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[["🔩 Iron",`${selected.iron} mg`,"(RDA: 18mg)"],["🦴 Calcium",`${selected.calcium} mg`,"(RDA: 1000mg)"],["🥕 Beta-carotene",`${selected.beta} μg`,"(Vit A precursor)"]].map(([l,v,sub]) => (
                  <div key={String(l)} className="glass rounded-lg p-3 border border-border/40"><p className="text-xs text-muted-foreground">{l}</p><p className="font-bold">{v}</p><p className="text-[10px] text-muted-foreground">{sub}</p></div>
                ))}
              </div>
              <div className="glass rounded-lg p-3 border border-blue-500/20"><p className="text-xs text-blue-300">💡 {selected.note}</p></div>
            </div>
            <div className="glass rounded-xl p-5 border border-border/40">
              <div className="flex gap-2 mb-4 flex-wrap">
                {Object.keys(BARS).map(k => <button type="button" key={k} onClick={() => setMetric(k as any)} className={`px-3 py-1 rounded-full text-xs font-bold ${metric === k ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{k === "vitC" ? "Vit C" : k === "beta" ? "Beta-carotene" : k.charAt(0).toUpperCase() + k.slice(1)}</button>)}
              </div>
              <p className="text-xs text-muted-foreground mb-3">Ranked by {metric === "vitC" ? "Vitamin C (mg)" : metric === "beta" ? "Beta-carotene (μg)" : metric + " (g or mg)"}</p>
              <div className="space-y-2">
                {sorted.slice(0,8).map((p, i) => {
                  const val = p[metric as keyof typeof PLANTS[0]] as number;
                  const pct = Math.round((val / BARS[metric].max) * 100);
                  return (
                    <div key={p.name}>
                      <div className="flex justify-between text-xs mb-0.5"><span className="text-muted-foreground">{i+1}. {p.name}</span><span className="font-bold">{val}</span></div>
                      <div className="h-1.5 bg-border/30 rounded-full"><div className={`h-full rounded-full ${BARS[metric].color}`} style={{width:`${Math.min(pct,100)}%`}} /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
