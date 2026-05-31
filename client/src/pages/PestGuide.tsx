import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Search, Bug } from "lucide-react";

const PESTS = [
  { name:"Aphids",emoji:"🐜",crops:"Chili, tomato, kangkung, beans",signs:"Sticky honeydew, curled yellowing leaves, ant activity",damage:"Suck plant sap, transmit viruses, stunt growth",organic:"Neem oil spray, soapy water, lady beetles, chili water spray",chemical:"Imidacloprid, Dimethoate",prevention:"Avoid excess nitrogen. Encourage ladybirds. Yellow sticky traps." },
  { name:"Whitefly",emoji:"🦟",crops:"Tomato, chili, cucumber, papaya",signs:"White cloud when plant disturbed, yellow leaves, sooty mould",damage:"Sap sucker, papaya ringspot virus vector",organic:"Yellow sticky traps, neem oil, reflective mulch, insecticidal soap",chemical:"Imidacloprid, Thiamethoxam",prevention:"Remove infected leaves. Avoid overcrowding. Introduce Encarsia wasps." },
  { name:"Mealybug",emoji:"🐛",crops:"Orchid, papaya, banana, chili",signs:"White cottony masses on stems and leaf joints",damage:"Sap sucker, weakens plant, secretes honeydew → sooty mould",organic:"70% isopropyl alcohol swab, neem oil, predatory beetles",chemical:"Malathion, Buprofezin",prevention:"Inspect plants before buying. Avoid overwatering. Good ventilation." },
  { name:"Fruit Fly (Bactrocera)",emoji:"🦟",crops:"Mango, guava, star fruit, papaya, chili",signs:"Puncture marks, premature fruit drop, maggots inside fruit",damage:"Ruins fruit internally — huge economic losses",organic:"Methyl eugenol traps, protein bait traps, bag fruits",chemical:"Malathion bait spray (GF-120)",prevention:"Bag fruits at marble size. Remove fallen fruit. Use protein bait." },
  { name:"Leaf Miner",emoji:"🐛",crops:"Chili, tomato, beans, sweet potato",signs:"Squiggly white lines/tunnels in leaves",damage:"Larvae mine inside leaf tissue, reduces photosynthesis",organic:"Remove affected leaves, neem oil, yellow sticky traps",chemical:"Abamectin, Spinosad",prevention:"Cover crops with netting. Remove fallen leaves." },
  { name:"Spider Mite",emoji:"🕷️",crops:"Chili, cucumber, beans, eggplant",signs:"Fine webbing under leaves, stippled bronze/silver leaves",damage:"Sap sucker — thrives in hot dry conditions",organic:"Increase humidity, neem oil, miticide soap, predatory mites",chemical:"Abamectin, Propargite",prevention:"Water plants regularly. Avoid dusty conditions. Sulphur dust." },
  { name:"Thrips",emoji:"🐛",crops:"Chili, onion, cucumber, mango",signs:"Silver streaks on leaves, deformed fruit, black faeces dots",damage:"Sap sucker and virus vector — causes chili mosaic",organic:"Blue/yellow sticky traps, neem oil, predatory mites, spinosad",chemical:"Fipronil, Imidacloprid",prevention:"Reflective mulch. Remove old plant material. Cover with netting." },
  { name:"Scale Insect",emoji:"🐚",crops:"Citrus, mango, rambutan, coffee",signs:"Brown/grey bumps on stems and bark, sticky residue",damage:"Sap sucker under armoured shell — hard to kill",organic:"Neem oil, horticultural oil, rubbing alcohol, scrape off by hand",chemical:"Malathion, white oil",prevention:"Prune to improve airflow. Introduce scale parasitoids." },
  { name:"Caterpillar / Ulat",emoji:"🐛",crops:"Kangkung, cabbage, papaya, banana",signs:"Holes in leaves, frass (droppings), defoliation",damage:"Chews leaves and fruit — can strip plant overnight",organic:"BT (Bacillus thuringiensis) spray, hand-pick at night, neem",chemical:"Chlorpyrifos, Lambda-cyhalothrin",prevention:"Row covers, inspect undersides of leaves for egg masses." },
  { name:"Stem Borer",emoji:"🐛",crops:"Rice, corn, sugarcane, banana",signs:"Dead heart in young shoots, frass at stem base",damage:"Larvae bore into stem — kills growing point",organic:"Remove and destroy infected stems, BT spray, light traps",chemical:"Cartap, Chlorpyrifos",prevention:"Plant resistant varieties. Use pheromone traps. Early planting." },
  { name:"Root Knot Nematode",emoji:"🪱",crops:"Tomato, chili, carrot, cucumber",signs:"Yellowing, wilting, bumpy galls on roots",damage:"Root system destroyed — severe stunting",organic:"Marigold intercrop, organic matter, soil solarisation",chemical:"Carbofuran, Fenamiphos (apply carefully — toxic)",prevention:"Rotate with non-host crops. Add compost. Use marigold as border." },
  { name:"Snail & Slug",emoji:"🐌",crops:"Seedlings, lettuce, kangkung, strawberry",signs:"Ragged holes, slime trails, damage near ground level",damage:"Chews young seedlings — can wipe out seedling trays overnight",organic:"Beer traps, copper tape, diatomaceous earth, hand-pick at night",chemical:"Metaldehyde bait",prevention:"Avoid overwatering. Remove leaf litter. Encourage ducks and frogs." },
  { name:"Aphid / Green Peach Aphid",emoji:"🐜",crops:"Chili, tomato, potato, brassicas",signs:"Dense colonies on shoot tips, sticky leaves",damage:"Transmits potato virus Y and cucumber mosaic virus",organic:"Strong water jet, neem oil, soap spray, lacewings",chemical:"Deltamethrin, Cypermethrin",prevention:"Yellow sticky traps. Plant reflective mulch." },
  { name:"Brown Planthopper",emoji:"🦗",crops:"Padi / Rice",signs:"Hopperburn — circular browning patches in rice field",damage:"Sap sucker, transmits grassy stunt virus — major rice pest in Sarawak",organic:"Drain and dry field, natural enemies, light traps",chemical:"Buprofezin, Fipronil",prevention:"Resistant varieties. Avoid excess nitrogen. Balanced water management." },
];

export default function PestGuide() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(PESTS[0]);

  const filtered = PESTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.crops.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <Bug className="w-6 h-6 text-amber-400" />
          <div>
            <h1 className="text-xl font-bold">Pest Guide</h1>
            <p className="text-xs text-muted-foreground">Malaysia crop pests — organic & chemical control</p>
          </div>
        </div>
        <div className="container pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search pest or crop..."
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
        </div>
      </div>

      <div className="container py-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
            {filtered.map(p => (
              <button type="button" key={p.name} onClick={() => setSelected(p)}
                className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${
                  selected.name === p.name ? "border-amber-500/60 bg-amber-500/5" : "border-border/40 hover:border-amber-500/30"
                }`}>
                <span className="text-xl">{p.emoji}</span>
                <div>
                  <p className="font-semibold text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.crops}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-xl p-5 border border-amber-500/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{selected.emoji}</span>
                <div>
                  <h2 className="text-xl font-bold">{selected.name}</h2>
                  <p className="text-xs text-muted-foreground">Affects: {selected.crops}</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  ["🔍 Signs of Infestation", selected.signs, "border-yellow-500/30"],
                  ["💀 Damage Caused", selected.damage, "border-red-500/30"],
                  ["🌱 Organic Control", selected.organic, "border-green-500/30"],
                  ["⚗️ Chemical Control (last resort)", selected.chemical, "border-orange-500/30"],
                  ["🛡️ Prevention", selected.prevention, "border-blue-500/30"],
                ].map(([label, val, border]) => (
                  <div key={String(label)} className={`glass rounded-lg p-3 border ${border}`}>
                    <p className="text-xs font-bold text-muted-foreground mb-1">{label}</p>
                    <p className="text-sm">{val}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selected.name + " control Malaysia")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-red-400">YouTube</a>
                <a href={`https://gd.eppo.int/search?k=${encodeURIComponent(selected.name)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-purple-400">EPPO</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
