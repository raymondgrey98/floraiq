import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const RECIPES = [
  { name:"Neem Oil Spray", emoji:"🌿", targets:"Aphids, whitefly, mealybug, spider mite, thrips, scale", ingredients:["5ml neem oil","5ml dish soap (emulsifier)","1 litre water"], steps:["Mix soap with warm water first","Add neem oil and shake well","Spray on all leaf surfaces including undersides","Apply in evening (avoid midday heat)","Repeat every 7 days"], shelfLife:"Use fresh each time", tip:"Most versatile organic pesticide. Available at nurseries in Malaysia for ~RM 15-25." },
  { name:"Chili Garlic Spray", emoji:"🌶️", targets:"Aphids, caterpillars, beetles, ants, rodents", ingredients:["10 red chilis","10 garlic cloves","1 litre water","5ml dish soap"], steps:["Blend chilis and garlic with water","Strain through cloth","Add dish soap","Spray on plants and soil","Don't spray in hot sun — can burn leaves"], shelfLife:"3-5 days refrigerated", tip:"Very effective for aphids. Wear gloves! Keep away from eyes. Strong smell deters many pests." },
  { name:"Soapy Water Spray", emoji:"🧼", targets:"Soft-bodied insects: aphids, whitefly, mealybug, spider mite", ingredients:["5ml dish soap (not antibacterial)","1 litre water"], steps:["Mix soap in cool water — don't foam","Spray directly on insects","Works by suffocating them — contact kill","Rinse plants with clean water after 2 hours","Safe to use daily if needed"], shelfLife:"Use fresh each time", tip:"Cheapest and safest option. Use biodegradable soap. Test on 1 leaf first for sensitive plants." },
  { name:"Baking Soda Fungicide", emoji:"🍶", targets:"Powdery mildew, black spot, early blight, fungal diseases", ingredients:["1 tablespoon baking soda","1 litre water","1 teaspoon dish soap","1 teaspoon vegetable oil (optional)"], steps:["Mix all ingredients well","Spray on affected leaves — both sides","Apply every 5-7 days","Most effective as preventive","Avoid spraying during hot midday"], shelfLife:"Use fresh each time", tip:"Changes leaf surface pH to prevent fungal growth. Very effective for powdery mildew on cucumbers." },
  { name:"Tobacco Water Spray", emoji:"🍂", targets:"Caterpillars, aphids, leafhoppers, most soft insects", ingredients:["100g dried tobacco or cigarette butts","1 litre warm water","Few drops dish soap"], steps:["Soak tobacco in water 24 hours","Strain carefully — very toxic concentrate","Dilute 1:10 with water","Spray on plants — avoid soil","Wash hands thoroughly after"], shelfLife:"1 week refrigerated", tip:"Very effective but USE SPARINGLY — nicotine is highly toxic. Don't use on tomatoes, peppers (same family as tobacco)." },
  { name:"Banana Peel Aphid Trap", emoji:"🍌", targets:"Aphids specifically", ingredients:["Banana peels","Sticks or skewers"], steps:["Bury banana peel 2-3cm deep near plant","Place small pieces on soil surface","Attracts ants which farm aphids — actually REMOVES aphids","OR: aphid larvae are attracted to peel","Replace weekly"], shelfLife:"1 week in soil", tip:"The acids in banana peel repel some aphid species. Unconfirmed but traditional Malaysian method." },
  { name:"Diatomaceous Earth Barrier", emoji:"💎", targets:"Slugs, snails, crawling insects, root grubs", ingredients:["Food-grade diatomaceous earth","Dry conditions"], steps:["Apply thin ring around plant base","Reapply after rain","Create barrier around beds","Sprinkle on soil surface","Don't inhale — wear mask when applying"], shelfLife:"Until wet/rained on", tip:"Microscopic shell fragments cut exoskeleton of crawling insects. Safe for humans and pets when dry. Available online ~RM 30/kg." },
  { name:"Wood Ash Pest Repellent", emoji:"🪵", targets:"Slugs, snails, ants, soft-bodied insects", ingredients:["Clean wood ash (not coal)","Dry weather"], steps:["Sprinkle around plant base","Apply 2cm thick barrier","Keep dry — loses effect when wet","Reapply after rain","Avoid getting on leaves"], shelfLife:"Until rain", tip:"Free if you have wood fire. Raises soil pH slightly. Double benefit as potassium source." },
  { name:"Companion Plant Spray (Marigold)", emoji:"🌼", targets:"Nematodes (soil), aphids, whitefly", ingredients:["Handful of marigold leaves and flowers","1 litre water"], steps:["Boil marigold in water 10 minutes","Cool and strain","Spray on soil and plants","Use fresh within 48 hours","Most effective around roots"], shelfLife:"48 hours", tip:"Alpha-terthienyl in marigold roots is a proven nematicide. Same effect extracted into spray." },
  { name:"Corn Starch Mite Control", emoji:"🌽", targets:"Spider mites", ingredients:["2 tablespoons corn starch","1 litre water"], steps:["Mix until dissolved","Spray on affected leaves","Film traps and kills spider mites","Rinse off after 24 hours","Repeat weekly"], shelfLife:"Use fresh", tip:"Traditional method — the starch clogs the mites' breathing. Safe, food-grade, cheap." },
  { name:"Apple Cider Vinegar Fungicide", emoji:"🍎", targets:"Fungal diseases, bacterial spots, black spot", ingredients:["4 tablespoons apple cider vinegar","1 litre water"], steps:["Dilute thoroughly — too strong burns leaves","Spray on affected areas","Morning application best","Repeat every 3-4 days","Test on 1 leaf first"], shelfLife:"1 week", tip:"Acidic pH inhibits fungal growth. More gentle than baking soda. Good for roses and ornamentals." },
  { name:"Egg Shell Slug Barrier", emoji:"🥚", targets:"Slugs, snails", ingredients:["Dried crushed egg shells","Shells from kitchen waste"], steps:["Dry shells completely in sun","Crush into sharp pieces","Sprinkle ring around plant base","Slugs won't cross sharp barrier","Replenish monthly"], shelfLife:"Months (until washed away)", tip:"Free from kitchen waste. Adds calcium to soil as bonus. Works best when dry." },
];

export default function OrganicPest() {
  const [selected, setSelected] = useState(RECIPES[0]);
  const [done, setDone] = useState<number[]>([]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🌱</span>
          <div><h1 className="text-xl font-bold">Organic Pest Control</h1><p className="text-xs text-muted-foreground">12 natural spray recipes — no chemicals</p></div>
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
            {RECIPES.map(r => (
              <button type="button" key={r.name} onClick={() => setSelected(r)}
                className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.name === r.name ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/40 hover:border-emerald-500/30"}`}>
                <span className="text-xl">{r.emoji}</span>
                <div><p className="font-semibold text-sm">{r.name}</p><p className="text-xs text-muted-foreground truncate">{r.targets.split(",")[0]}...</p></div>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-xl p-5 border border-emerald-500/30">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-1">{selected.emoji} {selected.name}</h2>
              <p className="text-xs text-emerald-400 mb-4">Targets: {selected.targets}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-2">🧪 Ingredients</p>
                  <ul className="space-y-1">{selected.ingredients.map(i => <li key={i} className="text-sm flex gap-2"><span>•</span>{i}</li>)}</ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-2">📋 Steps</p>
                  <ol className="space-y-1">{selected.steps.map((s,i) => <li key={i} className="text-xs text-muted-foreground flex gap-2"><span className="text-emerald-400 font-bold">{i+1}.</span>{s}</li>)}</ol>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="glass rounded-lg p-3 border border-border/40"><p className="text-xs font-bold text-muted-foreground">⏳ Shelf Life</p><p className="text-sm">{selected.shelfLife}</p></div>
                <div className="glass rounded-lg p-3 border border-blue-500/20"><p className="text-xs text-blue-300">💡 {selected.tip}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
