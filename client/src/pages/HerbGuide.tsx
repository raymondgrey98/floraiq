import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Search } from "lucide-react";

const HERBS = [
  { name:"Basil",emoji:"🌿",malay:"Selasih",uses:"Pasta, pizza, pesto, Thai dishes",grow:"Full sun, moist soil, pinch flowers",pairs:"Tomato, mozzarella, lemon",medicinal:"Antibacterial, anti-inflammatory, stress relief",zone:"Tropical — grows year round in Malaysia" },
  { name:"Lemongrass",emoji:"🌾",malay:"Serai",uses:"Curries, soups, tea, laksa, rendang",grow:"Full sun, well-drained, drought tolerant once established",pairs:"Galangal, kaffir lime, chili",medicinal:"Antifungal, mosquito repellent, aids digestion",zone:"Native to Malaysia — thrives in all regions" },
  { name:"Pandan",emoji:"🌿",malay:"Pandan",uses:"Rice, kaya jam, kuih, desserts, colouring",grow:"Shade or partial sun, loves water, propagate by division",pairs:"Coconut milk, rice, desserts",medicinal:"Pain relief, cockroach repellent, aromatherapy",zone:"Native to SEA — extremely easy to grow in Malaysia" },
  { name:"Turmeric",emoji:"🌿",malay:"Kunyit",uses:"Curries, rice dishes, golden milk, natural dye",grow:"Partial shade, rich moist soil, plant rhizomes",pairs:"Ginger, galangal, coconut milk",medicinal:"Anti-inflammatory (curcumin), antioxidant, liver health",zone:"Grows well in Sarawak, harvest after 8-9 months" },
  { name:"Ginger",emoji:"🌿",malay:"Halia",uses:"Curries, tea, stir-fry, gingerbread, medicine",grow:"Partial shade, rich organic soil, keep moist",pairs:"Turmeric, garlic, lemon",medicinal:"Nausea relief, anti-inflammatory, digestion, cold remedy",zone:"Thrives in Malaysian humid climate" },
  { name:"Galangal",emoji:"🌿",malay:"Lengkuas",uses:"Rendang, curries, laksa, tom yum",grow:"Full sun or partial shade, well-drained, similar to ginger",pairs:"Lemongrass, turmeric, chili",medicinal:"Antibacterial, aids digestion, respiratory relief",zone:"Native to SEA — common in Sarawak markets" },
  { name:"Kaffir Lime Leaf",emoji:"🍋",malay:"Daun limau purut",uses:"Thai curries, rendang, stir-fries, tom kha",grow:"Full sun, well-drained, prune to shape",pairs:"Coconut milk, lemongrass, galangal",medicinal:"Antibacterial, dental health, insect repellent",zone:"Common ornamental in Malaysian gardens" },
  { name:"Ulam Raja",emoji:"🌸",malay:"Ulam raja / Cosmos caudatus",uses:"Fresh salad (ulam), eaten raw with sambal",grow:"Very easy — grows like a weed in Malaysia",pairs:"Sambal belacan, lime, fish",medicinal:"Antioxidant, anti-hypertensive, bone health",zone:"Native to South America, naturalized in Malaysia" },
  { name:"Pegaga / Gotu Kola",emoji:"🌿",malay:"Pegaga",uses:"Ulam, juice, herbal drink, salad",grow:"Wet soil, partial shade, spreads as ground cover",pairs:"Coconut milk, lime, honey",medicinal:"Memory enhancement, wound healing, anxiety relief",zone:"Very common in Malaysian kampung gardens" },
  { name:"Curry Leaf",emoji:"🌿",malay:"Daun kari",uses:"Indian curries, rice, dal, tempered dishes",grow:"Full sun, well-drained, grows into tree",pairs:"Mustard seeds, coconut, chili",medicinal:"Anti-diabetic, antioxidant, hair growth",zone:"Grows in tropical Malaysia, common in Indian gardens" },
  { name:"Torch Ginger",emoji:"🌸",malay:"Bunga kantan",uses:"Laksa Sarawak, assam fish, salads",grow:"Full sun, wet soil, large plant needs space",pairs:"Belacan, lemongrass, asam",medicinal:"Antioxidant, antibacterial, anti-inflammatory",zone:"Native to Borneo — iconic Sarawak ingredient" },
  { name:"Kesum / Vietnamese Mint",emoji:"🌿",malay:"Kesum / Daun laksa",uses:"Laksa Sarawak, Vietnamese pho, noodle soups",grow:"Wet soil, shade tolerant, spreads fast",pairs:"Noodles, fish, coconut milk",medicinal:"Antifungal, antibacterial, digestive aid",zone:"Essential in Sarawak laksa — grows everywhere" },
  { name:"Chives",emoji:"🌿",malay:"Kucai",uses:"Dumplings, stir-fry, garnish, soups",grow:"Full sun, regular watering, harvest outer leaves",pairs:"Eggs, tofu, noodles",medicinal:"Antifungal, vitamin C, digestive health",zone:"Grows year-round in Malaysian gardens" },
  { name:"Thai Basil",emoji:"🌿",malay:"Selasih Thai",uses:"Pad thai, curries, stir-fries, spring rolls",grow:"Full sun, less water than sweet basil, pinch flowers",pairs:"Chili, garlic, fish sauce",medicinal:"Adaptogenic, anti-stress, antifungal",zone:"Grows easily in Malaysia, more robust than sweet basil" },
  { name:"Rosemary",emoji:"🌿",malay:"Rosemeri",uses:"Roast meats, potatoes, bread, marinades",grow:"Full sun, dry soil, drought tolerant, poor drainage kills it",pairs:"Lamb, chicken, garlic, lemon",medicinal:"Memory improvement, circulation, hair growth",zone:"Grows in Cameron Highlands — struggles in lowland heat" },
  { name:"Mint",emoji:"🌿",malay:"Pudina",uses:"Tea, mojito, tabouleh, sauce, desserts",grow:"Partial shade, moist soil, keep in pot to prevent spreading",pairs:"Lamb, chocolate, lemon, yogurt",medicinal:"Headache relief, IBS treatment, nausea",zone:"Grows well in Malaysian highlands, needs more water in lowlands" },
  { name:"Coriander / Cilantro",emoji:"🌿",malay:"Daun ketumbar",uses:"Curries, salsa, garnish, chutneys",grow:"Full sun, cool weather, bolts in heat — grow in shade",pairs:"Lime, chili, tomato, avocado",medicinal:"Heavy metal detox, digestive, anti-diabetic",zone:"Difficult in Malaysian heat — grow in cool season or highlands" },
  { name:"Daun Sup",emoji:"🌿",malay:"Daun sup / Chinese celery",uses:"Soups, bak kut teh, stir-fry, garnish",grow:"Partial shade, moist soil, harvest outer stems",pairs:"Soups, stocks, meats",medicinal:"Antioxidant, diuretic, blood pressure",zone:"Common in Malaysian home gardens" },
  { name:"Spring Onion",emoji:"🌿",malay:"Daun bawang",uses:"Soups, stir-fry, noodles, garnish everywhere",grow:"Full sun, any soil, regrows after cutting — cut 2cm from base",pairs:"Almost everything in Malaysian cuisine",medicinal:"Antibacterial, vitamin K, cholesterol",zone:"Easiest herb to grow in Malaysia" },
  { name:"Moringa / Drumstick",emoji:"🌿",malay:"Kelor / Murungai",uses:"Leaves in soup, pods in curry, seeds as water purifier",grow:"Full sun, drought tolerant, fast growing tree",pairs:"Coconut milk, garlic, fish",medicinal:"Most nutrient-dense plant — protein, iron, vitamins A/C/K",zone:"Very common in rural Malaysia, easy to grow" },
];

export default function HerbGuide() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(HERBS[0]);

  const filtered = HERBS.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.malay.toLowerCase().includes(search.toLowerCase()) ||
    h.uses.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🌿</span>
          <div>
            <h1 className="text-xl font-bold">Herb & Spice Guide</h1>
            <p className="text-xs text-muted-foreground">Malaysia focus — {HERBS.length} herbs, growing tips, uses</p>
          </div>
        </div>
        <div className="container pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search herb, Malay name, or use..."
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>
      </div>

      <div className="container py-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5 max-h-[80vh] overflow-y-auto pr-1">
            {filtered.map(h => (
              <button type="button" key={h.name} onClick={() => setSelected(h)}
                className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${
                  selected.name === h.name ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/40 hover:border-emerald-500/30"
                }`}>
                <span className="text-xl">{h.emoji}</span>
                <div>
                  <p className="font-semibold text-sm">{h.name}</p>
                  <p className="text-xs text-muted-foreground">{h.malay}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-xl p-5 border border-emerald-500/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{selected.emoji}</span>
                <div>
                  <h2 className="text-2xl font-bold">{selected.name}</h2>
                  <p className="text-muted-foreground text-sm">{selected.malay}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  ["🍳 Culinary Uses", selected.uses],
                  ["🌱 How to Grow", selected.grow],
                  ["🤝 Pairs With", selected.pairs],
                  ["💊 Medicinal", selected.medicinal],
                  ["📍 Malaysia Zone", selected.zone],
                ].map(([label, val]) => (
                  <div key={String(label)} className="glass rounded-lg p-3 border border-border/40">
                    <p className="text-xs font-bold text-emerald-400 mb-1">{label}</p>
                    <p className="text-sm text-muted-foreground">{val}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(selected.name)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-blue-400 hover:text-blue-300">Wikipedia</a>
                <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent("how to grow " + selected.name + " Malaysia")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-red-400 hover:text-red-300">YouTube</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
