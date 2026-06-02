import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Search, Play, Clock, Users, Flame, ExternalLink } from "lucide-react";

interface Recipe {
  id: string;
  plant: string;
  dish: string;
  origin: string;
  flag: string;
  time: string;
  serves: number;
  difficulty: string;
  calories: number;
  allergens: string[];
  youtubeSearch: string;
  image: string;
  ingredients: string[];
  steps: string[];
  nutrition: { label: string; value: string }[];
  tips: string;
  medicinal: string;
}

const RECIPES: Recipe[] = [
  {
    id:"kangkung-belacan",
    plant:"Kangkung (Water Spinach)", dish:"Kangkung Belacan", origin:"Malaysia", flag:"🇲🇾",
    time:"15 min", serves:4, difficulty:"Easy", calories:120, allergens:["Shellfish (belacan)"],
    youtubeSearch:"kangkung belacan recipe",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Water_spinach_-_Ipomoea_aquatica_-_%E7%A9%BA%E5%BF%83%E8%8F%9C_-_2013.01.20.jpg/320px-Water_spinach_-_Ipomoea_aquatica_-_%E7%A9%BA%E5%BF%83%E8%8F%9C_-_2013.01.20.jpg",
    ingredients:["500g kangkung (washed, cut 5cm)","3 tbsp belacan (shrimp paste)","5 red chilies","4 cloves garlic","2 tbsp oil","1 tsp sugar","Salt to taste"],
    steps:["Pound belacan, chilies, and garlic into a rough paste using mortar","Heat oil in wok until smoking hot","Fry paste until fragrant, about 2 minutes","Add kangkung and stir-fry on high heat","Add sugar and salt, toss quickly","Serve immediately — don't overcook"],
    nutrition:[{label:"Vitamin C",value:"55mg (61% RDA)"},{label:"Iron",value:"1.7mg"},{label:"Calcium",value:"77mg"},{label:"Fiber",value:"2.1g"},{label:"Protein",value:"2.6g"}],
    tips:"High heat is essential — keeps kangkung crisp and bright green. Cook max 3 minutes total.",
    medicinal:"Kangkung is high in iron. Traditional remedy for insomnia (mild sedative effect). Good for diabetes management."
  },
  {
    id:"moringa-soup",
    plant:"Moringa (Drumstick Leaves)", dish:"Sayur Manis / Moringa Soup", origin:"Malaysia/Philippines", flag:"🇲🇾",
    time:"25 min", serves:4, difficulty:"Easy", calories:95, allergens:[],
    youtubeSearch:"moringa leaves soup recipe Malaysia",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Moringa_oleifera_leaves.jpg/320px-Moringa_oleifera_leaves.jpg",
    ingredients:["2 cups fresh moringa leaves","200g chicken or shrimp","2 cloves garlic (minced)","1 small onion","2 cups broth","Salt, pepper","1 tsp fish sauce"],
    steps:["Boil broth in pot","Add garlic and onion, simmer 5 min","Add protein, cook through","Add moringa leaves last 2 minutes only","Season with fish sauce, salt, pepper","Serve hot with rice"],
    nutrition:[{label:"Vitamin C",value:"220mg (244% RDA)"},{label:"Protein",value:"9.4g"},{label:"Iron",value:"4.0mg"},{label:"Calcium",value:"185mg"},{label:"Beta-carotene",value:"6780μg"}],
    tips:"Add moringa leaves LAST — only 2 minutes cooking needed. Overcooking destroys nutrients.",
    medicinal:"Superfood. Anti-inflammatory. Helps manage blood sugar. 7x Vitamin C of oranges. Used in malnutrition treatment globally."
  },
  {
    id:"paku-pakis",
    plant:"Paku Pakis (Wild Fern Shoots)", dish:"Pucuk Paku Goreng Belacan", origin:"Sarawak, Malaysia", flag:"🇲🇾",
    time:"20 min", serves:3, difficulty:"Easy", calories:110, allergens:["Shellfish (belacan)"],
    youtubeSearch:"pucuk paku goreng belacan Sarawak",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Diplazium_esculentum_by_Obsidian_Soul.jpg/320px-Diplazium_esculentum_by_Obsidian_Soul.jpg",
    ingredients:["300g young fern shoots (blanched)","2 tbsp belacan","4 red chilies","3 garlic cloves","1 tomato (quartered)","2 tbsp oil","Salt"],
    steps:["Blanch fern shoots in boiling water 1 minute, drain","Pound belacan, chilies, garlic to paste","Heat wok, fry paste until fragrant","Add fern shoots and tomato","Stir-fry 3-4 minutes on high heat","Season and serve"],
    nutrition:[{label:"Calcium",value:"189mg"},{label:"Protein",value:"4.6g"},{label:"Iron",value:"1.8mg"},{label:"Fiber",value:"3.9g"},{label:"Vitamin C",value:"26mg"}],
    tips:"Only use young, tightly curled shoots. Older fronds are tough and bitter. Blanch before stir-frying to reduce bitterness.",
    medicinal:"High in antioxidants. Traditional Iban remedy for fever. Rich in calcium — important for bone health."
  },
  {
    id:"banana-flower",
    plant:"Banana Flower (Jantung Pisang)", dish:"Jantung Pisang Lemak", origin:"Malaysia/Indonesia", flag:"🇲🇾",
    time:"40 min", serves:4, difficulty:"Medium", calories:185, allergens:["Tree nuts (optional)"],
    youtubeSearch:"jantung pisang masak lemak recipe",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Banana-Blossom.jpg/320px-Banana-Blossom.jpg",
    ingredients:["1 banana flower (cleaned)","400ml coconut milk","2 stalks lemongrass","4 kaffir lime leaves","1 tsp turmeric","3 dried chilies","2 cups water","Salt, sugar"],
    steps:["Peel outer purple bracts off banana flower","Remove stamens from each floret (they're bitter)","Slice flower thinly, soak in salted water 15 min","Boil coconut milk with lemongrass, kaffir lime, turmeric","Add banana flower pieces","Simmer 20 minutes until tender","Season with salt and sugar"],
    nutrition:[{label:"Fiber",value:"5.7g"},{label:"Iron",value:"0.6mg"},{label:"Antioxidants",value:"Very High"},{label:"Calories",value:"65/100g raw"},{label:"Carbs",value:"15g"}],
    tips:"Removing the stamens (white stringy parts) is essential — they cause bitterness. Wear gloves — banana flower sap stains.",
    medicinal:"Helps manage diabetes. Rich in antioxidants. Traditional remedy for menstrual problems. High fiber aids digestion."
  },
  {
    id:"pegaga-ulam",
    plant:"Pegaga (Centella asiatica)", dish:"Ulam Pegaga with Sambal", origin:"Malaysia/Malay tradition", flag:"🇲🇾",
    time:"10 min", serves:2, difficulty:"Easy", calories:65, allergens:[],
    youtubeSearch:"ulam pegaga sambal belacan",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Centella_asiatica_Blanco2.387.png/320px-Centella_asiatica_Blanco2.387.png",
    ingredients:["2 cups fresh pegaga leaves","3 tbsp sambal belacan","1 lime (juiced)","Salt to taste","Optional: fried fish"],
    steps:["Wash pegaga leaves thoroughly","Pick only young, tender leaves","Arrange on plate as salad","Serve with sambal belacan on side","Squeeze lime juice over leaves","Eat raw — this preserves all medicinal compounds"],
    nutrition:[{label:"Vitamin C",value:"48mg"},{label:"Iron",value:"2.2mg"},{label:"Calcium",value:"171mg"},{label:"Triterpenoids",value:"High (medicinal)"},{label:"Antioxidants",value:"Very High"}],
    tips:"ALWAYS eat raw — cooking destroys triterpenoids (the brain-boosting compounds). Pair with sambal belacan for perfect balance.",
    medicinal:"Improves memory and cognitive function. Wound healing. Reduces anxiety (adaptogenic). Traditional Malay brain tonic."
  },
  {
    id:"durian-pengat",
    plant:"Durian (Durio zibethinus)", dish:"Pengat Durian", origin:"Malaysia/Singapore", flag:"🇲🇾",
    time:"30 min", serves:6, difficulty:"Easy", calories:285, allergens:["Tree nuts","Dairy (coconut milk)"],
    youtubeSearch:"pengat durian recipe Malaysia",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/A_Durian_fruit.jpg/320px-A_Durian_fruit.jpg",
    ingredients:["500g durian flesh (no seeds)","400ml coconut milk","200ml water","3 pandan leaves","4 tbsp palm sugar (gula melaka)","Pinch of salt"],
    steps:["Bring coconut milk, water, and pandan leaves to gentle simmer","Add gula melaka, stir until dissolved","Add durian flesh, stir gently","Simmer 10 minutes on low heat","Season with salt","Serve warm or chilled"],
    nutrition:[{label:"Calories",value:"147/100g"},{label:"Vitamin C",value:"19.7mg"},{label:"Potassium",value:"436mg"},{label:"Iron",value:"0.4mg"},{label:"Fiber",value:"3.8g"}],
    tips:"Use ripe but firm durian. Over-ripe durian makes the pengat too strong. Gula melaka (palm sugar) is non-negotiable — white sugar ruins it.",
    medicinal:"High in tryptophan — promotes good sleep. Rich in B vitamins. Despite reputation, moderate amounts are nutritious. Avoid with alcohol."
  },
  {
    id:"morinda-juice",
    plant:"Mengkudu (Noni / Morinda citrifolia)", dish:"Jus Mengkudu", origin:"Polynesia / Malaysia", flag:"🇲🇾",
    time:"10 min", serves:2, difficulty:"Easy", calories:45, allergens:[],
    youtubeSearch:"jus mengkudu recipe health benefits",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Noni_Fruit_Photograph_By_Shazz.jpg/320px-Noni_Fruit_Photograph_By_Shazz.jpg",
    ingredients:["2 ripe mengkudu fruits","1 cup water","2 tbsp honey","1 lime (juiced)","Ice"],
    steps:["Select fully ripe mengkudu (slightly soft, yellowish)","Blend mengkudu with water","Strain through fine mesh (remove seeds/pulp)","Add honey and lime juice to mask bitter taste","Serve over ice"],
    nutrition:[{label:"Vitamin C",value:"33.7mg"},{label:"Antioxidants",value:"High (iridoids)"},{label:"Scopoletin",value:"Anti-inflammatory"},{label:"Iron",value:"0.2mg"},{label:"Fiber",value:"2.3g"}],
    tips:"Mengkudu has strong fermented-cheese smell — this is normal. Honey and lime make it drinkable. Start with small amounts.",
    medicinal:"Immune booster. Traditional cancer-fighting properties (ongoing research). Antibacterial. Helps with hypertension. NOT for pregnant women."
  },
  {
    id:"roselle-drink",
    plant:"Roselle (Hibiscus sabdariffa)", dish:"Air Roselle (Roselle Drink)", origin:"Africa / Malaysia", flag:"🇲🇾",
    time:"20 min", serves:6, difficulty:"Easy", calories:55, allergens:[],
    youtubeSearch:"air roselle hibiscus drink recipe Malaysia",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Hibiscus_sabdariffa_fruits.jpg/320px-Hibiscus_sabdariffa_fruits.jpg",
    ingredients:["15-20 fresh roselle calyxes","1 liter water","3-4 tbsp sugar or honey","2 pandan leaves","Ice"],
    steps:["Separate roselle calyxes from seeds","Boil water with pandan leaves","Add roselle, simmer 10 minutes","Deep red/purple color indicates ready","Strain, add sugar or honey","Cool, serve over ice"],
    nutrition:[{label:"Vitamin C",value:"12mg"},{label:"Calcium",value:"213mg — very high"},{label:"Anthocyanins",value:"High (anti-cancer)"},{label:"Iron",value:"1.4mg"},{label:"Antioxidants",value:"Among highest of any plant"}],
    tips:"Don't boil too long — destroys anthocyanins. The redder the drink, the higher the antioxidants. Seeds are edible too.",
    medicinal:"Lowers blood pressure. High antioxidants. Anti-inflammatory. Liver protective. Better than many supplements for cardiovascular health."
  },
];

const ALLERGY_INFO: Record<string, { description: string; symptoms: string; treatment: string; avoid: string }> = {
  "Shellfish (belacan)": {
    description:"Belacan (shrimp paste) contains concentrated shellfish proteins. Risk even in small amounts.",
    symptoms:"Hives, swelling, breathing difficulty, vomiting within 2 hours",
    treatment:"Antihistamine for mild. EpiPen + hospital for severe. Do not wait.",
    avoid:"Belacan, cincalok, dried shrimp, most Malaysian sambal"
  },
  "Tree nuts": {
    description:"Durian is a tree fruit. Separate from tree nut allergy but cross-reactivity possible.",
    symptoms:"Oral itching, lip swelling, digestive upset",
    treatment:"Antihistamine. Hospital if throat swelling occurs.",
    avoid:"Durian, jackfruit, breadfruit if tree nut allergic — test with small amount first"
  },
  "Dairy (coconut milk)": {
    description:"Coconut milk is NOT dairy but some people react to coconut proteins.",
    symptoms:"Digestive upset, skin rash, rarely anaphylaxis",
    treatment:"Antihistamine. Substitute with oat milk or regular milk.",
    avoid:"All coconut products if confirmed coconut allergy"
  },
};

export default function CookingGuide() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Recipe>(RECIPES[0]);
  const [tab, setTab] = useState<"recipe"|"nutrition"|"medicine"|"allergy">("recipe");

  const filtered = RECIPES.filter(r =>
    r.plant.toLowerCase().includes(search.toLowerCase()) ||
    r.dish.toLowerCase().includes(search.toLowerCase()) ||
    r.origin.toLowerCase().includes(search.toLowerCase())
  );

  function openYouTube() {
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(selected.youtubeSearch)}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-14">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-xl">🍳</span>
          <div className="flex-1"><h1 className="text-lg font-bold">Plant Cooking Guide</h1><p className="text-[11px] text-muted-foreground">Recipes, nutrition, allergy info for Malaysian plants</p></div>
        </div>
        <div className="container pb-3">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search plant or dish…" className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
        </div>
      </div>

      <div className="container py-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recipe list */}
          <div className="space-y-2 max-h-[85vh] overflow-y-auto">
            {filtered.map(r => (
              <button type="button" key={r.id} onClick={() => { setSelected(r); setTab("recipe"); }}
                className={`w-full text-left glass rounded-xl overflow-hidden border transition-all ${selected.id === r.id ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/40 hover:border-emerald-500/30"}`}>
                <img src={r.image} alt={r.dish} className="w-full h-24 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <div className="p-3">
                  <p className="font-bold text-sm">{r.dish}</p>
                  <p className="text-[11px] text-muted-foreground">{r.flag} {r.plant}</p>
                  <div className="flex gap-2 mt-1.5">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{r.time}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Flame className="w-2.5 h-2.5 text-orange-400" />{r.calories} cal</span>
                    {r.allergens.length > 0 && <span className="text-[10px] text-amber-400">⚠️ Allergens</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Hero */}
            <div className="glass rounded-2xl overflow-hidden border border-border/40">
              <div className="relative h-48">
                <img src={selected.image} alt={selected.dish} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-white">{selected.dish}</h2>
                  <p className="text-sm text-white/70">{selected.flag} {selected.plant} · {selected.origin}</p>
                </div>
                <button type="button" onClick={openYouTube}
                  className="absolute top-3 right-3 bg-red-600 hover:bg-red-500 text-white rounded-xl px-3 py-2 text-xs font-bold flex items-center gap-1.5 transition">
                  <Play className="w-3 h-3 fill-white" />Watch on YouTube
                </button>
              </div>
              <div className="p-4 flex gap-4 border-b border-border/30">
                {[
                  { icon:<Clock className="w-4 h-4" />, val:selected.time, label:"Cook time" },
                  { icon:<Users className="w-4 h-4" />, val:selected.serves, label:"Serves" },
                  { icon:<Flame className="w-4 h-4 text-orange-400" />, val:`${selected.calories} cal`, label:"Calories" },
                  { icon:"📊", val:selected.difficulty, label:"Difficulty" },
                ].map(s => (
                  <div key={String(s.label)} className="flex-1 text-center">
                    <div className="flex justify-center mb-1 text-muted-foreground">{typeof s.icon === "string" ? <span>{s.icon}</span> : s.icon}</div>
                    <p className="text-sm font-bold">{s.val}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              {(["recipe","nutrition","medicine","allergy"] as const).map(t => (
                <button type="button" key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${tab === t ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>
                  {t === "recipe" ? "📋 Recipe" : t === "nutrition" ? "🥗 Nutrition" : t === "medicine" ? "💊 Medicinal" : "⚠️ Allergy"}
                </button>
              ))}
            </div>

            {tab === "recipe" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass rounded-2xl p-4 border border-border/40">
                  <p className="text-xs font-bold text-muted-foreground mb-3">INGREDIENTS</p>
                  <ul className="space-y-2">
                    {selected.ingredients.map(ing => (
                      <li key={ing} className="flex gap-2 text-sm"><span className="text-emerald-400 flex-shrink-0">•</span>{ing}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="glass rounded-2xl p-4 border border-border/40">
                    <p className="text-xs font-bold text-muted-foreground mb-3">METHOD</p>
                    <ol className="space-y-2">
                      {selected.steps.map((step, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">{i+1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="glass rounded-2xl p-4 border border-amber-500/20">
                    <p className="text-xs font-bold text-amber-400 mb-1">💡 Chef's Tip</p>
                    <p className="text-sm text-muted-foreground">{selected.tips}</p>
                  </div>
                </div>
              </div>
            )}

            {tab === "nutrition" && (
              <div className="glass rounded-2xl p-5 border border-emerald-500/20 space-y-3">
                <p className="text-xs font-bold text-muted-foreground">NUTRITIONAL HIGHLIGHTS — {selected.plant.toUpperCase()}</p>
                <div className="space-y-2">
                  {selected.nutrition.map(n => (
                    <div key={n.label} className="flex justify-between items-center py-2 border-b border-border/20 last:border-0">
                      <span className="text-sm text-muted-foreground">{n.label}</span>
                      <span className="text-sm font-bold text-emerald-400">{n.value}</span>
                    </div>
                  ))}
                </div>
                <a href={`https://fdc.nal.usda.gov/fdc-app.html#/?query=${encodeURIComponent(selected.plant)}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 flex items-center gap-1 hover:underline">
                  Full USDA Nutrition Data <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {tab === "medicine" && (
              <div className="glass rounded-2xl p-5 border border-purple-500/20">
                <p className="text-xs font-bold text-muted-foreground mb-3">MEDICINAL PROPERTIES</p>
                <p className="text-sm leading-relaxed">{selected.medicinal}</p>
                <a href={`https://www.ncbi.nlm.nih.gov/search/research-articles/?term=${encodeURIComponent(selected.plant)}&filter.term=phytochemistry`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 flex items-center gap-1 mt-3 hover:underline">
                  PubMed Research <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {tab === "allergy" && (
              <div className="space-y-3">
                {selected.allergens.length === 0 ? (
                  <div className="glass rounded-2xl p-5 border border-green-500/20 text-center">
                    <p className="text-3xl mb-2">✅</p>
                    <p className="font-bold">No Major Allergens</p>
                    <p className="text-sm text-muted-foreground mt-1">This recipe is free from the 14 major allergens. Always check individual ingredients.</p>
                  </div>
                ) : (
                  <>
                    <div className="glass rounded-2xl p-3 border border-red-500/30 flex items-center gap-2">
                      <span className="text-xl">⚠️</span>
                      <p className="text-sm font-bold text-red-400">Contains allergens: {selected.allergens.join(", ")}</p>
                    </div>
                    {selected.allergens.map(allergen => {
                      const info = ALLERGY_INFO[allergen];
                      if (!info) return null;
                      return (
                        <div key={allergen} className="glass rounded-2xl p-4 border border-amber-500/20 space-y-2">
                          <p className="font-bold text-amber-400">{allergen}</p>
                          <p className="text-sm text-muted-foreground">{info.description}</p>
                          {[["Symptoms",info.symptoms],["Treatment",info.treatment],["Also avoid",info.avoid]].map(([l,v]) => (
                            <div key={String(l)} className="glass rounded-lg p-2 border border-border/30">
                              <p className="text-[10px] font-bold text-muted-foreground mb-0.5">{l}</p>
                              <p className="text-xs">{v}</p>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </>
                )}
                <div className="glass rounded-2xl p-4 border border-blue-500/20">
                  <p className="text-xs font-bold text-blue-400 mb-1">🏥 Allergy Emergency — Malaysia</p>
                  <p className="text-xs text-muted-foreground">Anaphylaxis: Call 999 immediately. Hospital Kuching: 082-276666. EpiPen recommended for known severe allergies.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
