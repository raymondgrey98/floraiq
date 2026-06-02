import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Search, ShoppingCart, Globe, ExternalLink } from "lucide-react";

const CATEGORIES = ["All", "🌱 Seeds", "🧪 Fertilizers", "🚿 Hydroponics", "🔧 Tools", "🌿 Live Plants", "📚 Books & Courses", "🦠 Biotech & Lab"];

const SUPPLIERS: {
  name: string; country: string; flag: string; category: string; specialty: string;
  url: string; price: string; ships: string; rating: number; note: string;
}[] = [
  // Seeds
  { name:"Baker Creek Heirloom Seeds", country:"USA", flag:"🇺🇸", category:"🌱 Seeds", specialty:"Heirloom & rare vegetable seeds, 1500+ varieties", url:"https://www.rareseeds.com", price:"USD 3-8/pack", ships:"Worldwide", rating:5, note:"Best for heirloom open-pollinated seeds. Huge collection. Ships to Malaysia." },
  { name:"Territorial Seed Company", country:"USA", flag:"🇺🇸", category:"🌱 Seeds", specialty:"Vegetables, herbs, flowers — organic certified", url:"https://www.territorialseed.com", price:"USD 3-6/pack", ships:"US + International", rating:4, note:"Excellent variety descriptions and growing guides." },
  { name:"Chiltern Seeds", country:"UK", flag:"🇬🇧", category:"🌱 Seeds", specialty:"Unusual plants, wildflowers, rare vegetables", url:"https://www.chilternseeds.co.uk", price:"GBP 2-5/pack", ships:"Worldwide", rating:5, note:"Most diverse UK seed catalogue. Good tropical species selection." },
  { name:"Johnsons Seeds (UK)", country:"UK", flag:"🇬🇧", category:"🌱 Seeds", specialty:"Vegetable and flower seeds, bulk packs", url:"https://www.johnsonsseedsdirect.co.uk", price:"GBP 1-4/pack", ships:"Europe + International", rating:4, note:"Good value bulk packs for farm-scale production." },
  { name:"Lazy Gardener (Malaysia)", country:"Malaysia", flag:"🇲🇾", category:"🌱 Seeds", specialty:"Tropical vegetable seeds — local varieties, Sarawak", url:"https://www.lazygardener.com.my", price:"RM 5-15/pack", ships:"Malaysia only", rating:5, note:"Best local Malaysian seed supplier. Kangkung, peria, bayam, ulam varieties." },
  { name:"Green Capsicum (Malaysia)", country:"Malaysia", flag:"🇲🇾", category:"🌱 Seeds", specialty:"Chili seeds, tropical herbs, vegetable seeds", url:"https://shopee.com.my/greencapsicum", price:"RM 3-12/pack", ships:"Malaysia", rating:4, note:"Excellent chili variety collection. Many Sarawak pepper varieties." },
  { name:"Tokopedia Seeds", country:"Indonesia", flag:"🇮🇩", category:"🌱 Seeds", specialty:"Tropical Asian vegetables and herbs", url:"https://www.tokopedia.com/bibit", price:"IDR 5000-25000", ships:"Indonesia + Regional", rating:4, note:"Huge variety of SE Asian tropical seeds at low cost." },
  { name:"IndiaMART Seeds", country:"India", flag:"🇮🇳", category:"🌱 Seeds", specialty:"Bulk agricultural seeds, all crops", url:"https://www.indiamart.com/impcat/seeds.html", price:"Wholesale pricing", ships:"Worldwide (bulk)", rating:4, note:"Best for bulk purchase. Minimum orders apply. Good for farm-scale." },
  { name:"Simlaw Seeds (Kenya)", country:"Kenya", flag:"🇰🇪", category:"🌱 Seeds", specialty:"African vegetable and crop seeds", url:"https://simlaw.co.ke", price:"KES 50-500/pack", ships:"Africa + International", rating:4, note:"Excellent tropical crops including varieties suited for hot humid climates." },
  { name:"Rijk Zwaan (Netherlands)", country:"Netherlands", flag:"🇳🇱", category:"🌱 Seeds", specialty:"Professional vegetable breeding, F1 hybrids", url:"https://www.rijkzwaan.com", price:"Commercial pricing", ships:"Worldwide", rating:5, note:"World-class commercial seed company. Used by professional growers globally." },

  // Fertilizers
  { name:"General Hydroponics (USA)", country:"USA", flag:"🇺🇸", category:"🧪 Fertilizers", specialty:"Flora Series nutrients, coco, hydro fertilizers", url:"https://generalhydroponics.com", price:"USD 20-60/set", ships:"Worldwide via Amazon", rating:5, note:"Industry standard for hydroponic nutrients. Available on Shopee MY." },
  { name:"Advanced Nutrients (Canada)", country:"Canada", flag:"🇨🇦", category:"🧪 Fertilizers", specialty:"pH-perfect grow/bloom/micro series", url:"https://www.advancednutrients.com", price:"USD 30-80", ships:"Worldwide", rating:5, note:"Premium nutrients. Available at hydro shops in KL/Johor." },
  { name:"Bio-Growth (Malaysia)", country:"Malaysia", flag:"🇲🇾", category:"🧪 Fertilizers", specialty:"Organic fertilizers — vermicast, seaweed, compost", url:"https://shopee.com.my/biogrowth", price:"RM 15-50", ships:"Malaysia", rating:4, note:"Best Malaysian organic fertilizer brand. Widely available at farm supply shops." },
  { name:"Haifa Group (Israel)", country:"Israel", flag:"🇮🇱", category:"🧪 Fertilizers", specialty:"Multi-K potassium nitrate, foliar nutrients", url:"https://www.haifa-group.com", price:"Commercial pricing", ships:"Worldwide", rating:5, note:"World-leading specialty fertilizer company. Used by commercial farms." },
  { name:"Compo Expert (Germany)", country:"Germany", flag:"🇩🇪", category:"🧪 Fertilizers", specialty:"Professional plant nutrition, controlled release", url:"https://www.compo-expert.com", price:"EUR 20-100", ships:"Worldwide via distributors", rating:5, note:"Premium German quality. Slow-release fertilizers excellent for tropical climate." },
  { name:"ICL Specialty Fertilizers (Israel)", country:"Israel", flag:"🇮🇱", category:"🧪 Fertilizers", specialty:"Osmocote slow-release, Peters professional", url:"https://www.icl-sf.com", price:"Commercial pricing", ships:"Worldwide", rating:5, note:"Osmocote brand — best slow-release fertilizer for container plants." },
  { name:"Yara International (Norway)", country:"Norway", flag:"🇳🇴", category:"🧪 Fertilizers", specialty:"Agricultural fertilizers — nitrogen, complex NPK", url:"https://www.yara.com", price:"Bulk/wholesale", ships:"196 countries", rating:5, note:"World's largest crop nutrition company. Local distributors in Malaysia." },

  // Hydroponics
  { name:"Nutriculture (UK)", country:"UK", flag:"🇬🇧", category:"🚿 Hydroponics", specialty:"NFT systems, DWC systems, grow tents", url:"https://www.nutriculture.com", price:"GBP 50-500+", ships:"Worldwide", rating:5, note:"Professional UK hydro systems. High quality for serious growers." },
  { name:"AutoPot (UK)", country:"UK", flag:"🇬🇧", category:"🚿 Hydroponics", specialty:"Self-watering pot systems, gravity-fed", url:"https://www.autopot.co.uk", price:"GBP 30-200", ships:"Worldwide", rating:5, note:"Game changer — no pumps or electricity. Perfect for Malaysia's climate." },
  { name:"Grodan (Netherlands)", country:"Netherlands", flag:"🇳🇱", category:"🚿 Hydroponics", specialty:"Rockwool grow cubes, slabs, loose fill", url:"https://www.grodan.com", price:"Commercial", ships:"Worldwide via distributors", rating:5, note:"Industry standard growing medium. Available via Lazada/Shopee." },
  { name:"Hydrofarm (USA)", country:"USA", flag:"🇺🇸", category:"🚿 Hydroponics", specialty:"Indoor grow lights, tents, complete systems", url:"https://www.hydrofarm.com", price:"USD 50-500", ships:"Worldwide", rating:4, note:"Complete indoor growing systems. LED lights excellent for Malaysia indoors." },
  { name:"Green Plants World (Malaysia)", country:"Malaysia", flag:"🇲🇾", category:"🚿 Hydroponics", specialty:"Local hydroponics systems, NFT channels, LECA", url:"https://shopee.com.my/hydroponics.my", price:"RM 50-500", ships:"Malaysia", rating:4, note:"Good local supplier. LECA balls, growing channels, starter kits." },
  { name:"Alibaba Hydro Suppliers (China)", country:"China", flag:"🇨🇳", category:"🚿 Hydroponics", specialty:"Bulk hydro equipment, grow tents, LED panels, pumps", url:"https://www.alibaba.com/showroom/hydroponic-system.html", price:"USD 10-200 (bulk)", ships:"Worldwide", rating:4, note:"Best prices for bulk equipment. Quality varies — check reviews. MOQ applies." },

  // Tools
  { name:"Felco (Switzerland)", country:"Switzerland", flag:"🇨🇭", category:"🔧 Tools", specialty:"Professional pruning shears, loppers, saws", url:"https://www.felco.com", price:"CHF 40-120", ships:"Worldwide", rating:5, note:"World's best pruning tools. Lifetime repair guarantee. Worth the investment." },
  { name:"Fiskars (Finland)", country:"Finland", flag:"🇫🇮", category:"🔧 Tools", specialty:"Garden tools — spades, forks, hoes, pruners", url:"https://www.fiskars.com", price:"EUR 15-80", ships:"Worldwide via Amazon", rating:5, note:"Excellent ergonomic garden tools. Available at Ace Hardware Malaysia." },
  { name:"Corona Tools (USA)", country:"USA", flag:"🇺🇸", category:"🔧 Tools", specialty:"Pruning, cutting tools for professional growers", url:"https://www.coronatoolsusa.com", price:"USD 15-60", ships:"Worldwide", rating:4, note:"Professional grade. Excellent value vs Felco. Available on Lazada." },
  { name:"Gardena (Germany)", country:"Germany", flag:"🇩🇪", category:"🔧 Tools", specialty:"Irrigation, soil care, lawn care tools", url:"https://www.gardena.com", price:"EUR 10-100+", ships:"Worldwide", rating:5, note:"Premium German tools. Excellent modular irrigation systems. Available in Malaysia." },
  { name:"Hiko (Malaysia)", country:"Malaysia", flag:"🇲🇾", category:"🔧 Tools", specialty:"Local garden tools, sprayers, watering cans", url:"https://www.ace.com.my", price:"RM 10-80", ships:"Malaysia", rating:4, note:"Available at all ACE Hardware stores in Malaysia. Good everyday tools." },

  // Live Plants
  { name:"Logee's (USA)", country:"USA", flag:"🇺🇸", category:"🌿 Live Plants", specialty:"Tropical houseplants, rare exotics, begonias, citrus", url:"https://www.logees.com", price:"USD 8-50", ships:"USA only", rating:5, note:"America's oldest tropical plant nursery. Excellent quality. CITES compliant." },
  { name:"Wisteria (UK)", country:"UK", flag:"🇬🇧", category:"🌿 Live Plants", specialty:"UK online plant delivery, houseplants, outdoor", url:"https://www.wisteria.co.uk", price:"GBP 10-80", ships:"UK only", rating:4, note:"Fast UK delivery. Good quality. Use for Europe-based buyers." },
  { name:"Forest to Farm (Malaysia)", country:"Malaysia", flag:"🇲🇾", category:"🌿 Live Plants", specialty:"Native tropical plants, Borneo species, jungle plants", url:"https://shopee.com.my/forest.to.farm", price:"RM 15-100", ships:"Malaysia", rating:5, note:"Specialist in Sarawak/Borneo native plants. Rare pitcher plants and orchids." },
  { name:"Lazada Plant Section (MY)", country:"Malaysia", flag:"🇲🇾", category:"🌿 Live Plants", specialty:"All types of live plants — thousands of sellers", url:"https://www.lazada.com.my/catalog/?q=plants+live", price:"RM 5-500", ships:"Malaysia", rating:4, note:"Massive selection. Check seller ratings carefully. Great for common tropical plants." },

  // Books & Courses
  { name:"Coursera (Agriculture)", country:"USA", flag:"🇺🇸", category:"📚 Books & Courses", specialty:"Online agriculture, sustainability, botany courses", url:"https://www.coursera.org/search?query=agriculture", price:"Free audit / USD 49+ certificate", ships:"Online — 196 countries", rating:5, note:"University-level courses. Free audit option. Great for professional development." },
  { name:"Udemy (Farming & Gardening)", country:"USA", flag:"🇺🇸", category:"📚 Books & Courses", specialty:"Practical courses — hydroponics, permaculture, beekeeping", url:"https://www.udemy.com/courses/search/?q=farming+gardening", price:"USD 10-30 (sale prices)", ships:"Online — 196 countries", rating:4, note:"Best value online courses. Hydroponics, aquaponics, kelulut beekeeping all available." },
  { name:"MARDI Publications (Malaysia)", country:"Malaysia", flag:"🇲🇾", category:"📚 Books & Courses", specialty:"Malaysian Agricultural Research books, bulletins", url:"https://www.mardi.gov.my/en/publications", price:"Free downloads / RM 10-50 physical", ships:"Malaysia", rating:5, note:"Official Malaysian agriculture research. Free PDF downloads. Irreplaceable local data." },

  // Biotech & Lab
  { name:"Sigma-Aldrich (Germany/USA)", country:"USA", flag:"🇺🇸", category:"🦠 Biotech & Lab", specialty:"Plant tissue culture media, reagents, lab equipment", url:"https://www.sigmaaldrich.com", price:"Professional pricing", ships:"Worldwide", rating:5, note:"World's leading lab supplier. Murashige & Skoog medium for tissue culture. Ships to Malaysia." },
  { name:"PhytoTech Labs (USA)", country:"USA", flag:"🇺🇸", category:"🦠 Biotech & Lab", specialty:"Plant tissue culture media — premixed, ready-to-use", url:"https://www.phytotechlab.com", price:"USD 30-80/pack", ships:"Worldwide", rating:5, note:"Best ready-to-use tissue culture media. Excellent for plant propagation lab." },
  { name:"Caisson Labs (USA)", country:"USA", flag:"🇺🇸", category:"🦠 Biotech & Lab", specialty:"Plant tissue culture media, agar, hormones", url:"https://www.caissonlabs.com", price:"USD 15-60", ships:"Worldwide", rating:4, note:"Good alternative to Sigma. Lower cost tissue culture supplies." },
];

const SARAWAK_LOCAL = [
  { name:"SJ Nursery", area:"Kuching (Jalan Satok)", what:"Live plants, seeds, garden tools, fertilizers", hours:"8am-6pm daily" },
  { name:"Ng Heng Nursery", area:"Kuching (Matang area)", what:"Fruit trees, ornamentals, soils, pots", hours:"7am-5pm daily" },
  { name:"Ace Hardware", area:"Kuching (AEON, Spring, Mydin)", what:"Tools, fertilizers, pots, irrigation equipment", hours:"Mall hours" },
  { name:"Pasar Tani (Saturday Market)", area:"Satok, Kuching", what:"Local seeds, traditional plants, produce", hours:"Friday night – Saturday morning" },
  { name:"Jabatan Pertanian Sarawak", area:"Petra Jaya, Kuching", what:"Subsidized seeds, fertilizers, free consultation", hours:"8am-5pm weekdays" },
  { name:"Bintulu Agriculture Suppliers", area:"Bintulu town centre", what:"Farm supplies, seeds, chemicals, tools", hours:"8am-6pm weekdays" },
  { name:"Shopee MY — Local Sellers", area:"Online (Malaysia-wide)", what:"Search: benih, baja, tanah hitam, perlite", hours:"24/7 delivery 1-3 days" },
  { name:"Lazada MY — Plant Section", area:"Online (Malaysia-wide)", what:"Complete garden supplies, fast delivery", hours:"24/7 delivery 2-5 days" },
];

export default function GlobalMarketplace() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"global"|"local">("global");

  const filtered = SUPPLIERS.filter(s =>
    (category === "All" || s.category === category) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) ||
     s.specialty.toLowerCase().includes(search.toLowerCase()) ||
     s.country.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <ShoppingCart className="w-5 h-5 text-emerald-400" />
          <div><h1 className="text-xl font-bold">Global Supply Marketplace</h1><p className="text-xs text-muted-foreground">Seeds, fertilizers, tools from 196 countries</p></div>
        </div>
        <div className="container pb-3 space-y-2">
          <div className="flex gap-2 mb-2">
            <button type="button" onClick={() => setTab("global")} className={`px-4 py-1.5 rounded-full text-xs font-bold ${tab === "global" ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}><Globe className="w-3 h-3 inline mr-1" />Global Suppliers</button>
            <button type="button" onClick={() => setTab("local")} className={`px-4 py-1.5 rounded-full text-xs font-bold ${tab === "local" ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>🇲🇾 Sarawak Local</button>
          </div>
          {tab === "global" && <>
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search suppliers, countries, products..." className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map(c => <button type="button" key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${category === c ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{c}</button>)}
            </div>
          </>}
        </div>
      </div>

      <div className="container py-6 max-w-5xl">
        {tab === "global" && <>
          <div className="glass rounded-xl p-3 border border-blue-500/20 mb-5 flex gap-2">
            <Globe className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-300">All links open the supplier's official website. Prices are approximate and may vary. Most suppliers ship internationally — check their shipping policy for Malaysia. Always verify import regulations for seeds and live plants.</p>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{filtered.length} suppliers found</p>
          <div className="space-y-3">
            {filtered.map(s => (
              <div key={s.name} className="glass rounded-xl p-4 border border-border/40 hover:border-emerald-500/30 transition-all">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{s.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-bold text-sm">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.country} · {s.category}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {"⭐".repeat(s.rating)}
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold flex items-center gap-1 hover:bg-emerald-500/30 transition">
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{s.specialty}</p>
                    <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="text-emerald-400">{s.price}</span>
                      <span>Ships: {s.ships}</span>
                    </div>
                    <p className="text-xs text-blue-300 mt-1">💡 {s.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>}

        {tab === "local" && (
          <div className="space-y-4">
            <div className="glass rounded-xl p-4 border border-emerald-500/20 mb-2">
              <h3 className="font-bold mb-1">🇲🇾 Sarawak Local Suppliers</h3>
              <p className="text-xs text-muted-foreground">Kuching area physical shops and online Malaysian suppliers. Best for same-day or 1-3 day delivery.</p>
            </div>
            {SARAWAK_LOCAL.map(s => (
              <div key={s.name} className="glass rounded-xl p-4 border border-border/40">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{s.name}</p>
                    <p className="text-xs text-emerald-400">{s.area}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{s.hours}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{s.what}</p>
              </div>
            ))}
            <div className="glass rounded-xl p-4 border border-amber-500/20">
              <p className="font-bold mb-2">🛒 Online Platforms — Malaysia</p>
              {[["Shopee MY","shopee.com.my","Best prices, local sellers, fast delivery. Search: benih sayur, baja organik, tanah hitam"],["Lazada MY","lazada.com.my","Wide selection, reliable delivery. Good for tools and equipment"],["Alibaba / AliExpress","alibaba.com","Bulk buying from China. Best for farm-scale purchasing. 2-4 week delivery"]].map(([name, url, note]) => (
                <div key={url} className="flex items-start gap-3 mb-3">
                  <a href={`https://www.${url}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold text-sm flex-shrink-0 hover:underline">{name}</a>
                  <p className="text-xs text-muted-foreground">{note}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
