import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Calendar, Sun, Droplets, Wind } from "lucide-react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// 1=good, 0=ok, -1=avoid
interface CropCalendar {
  name: string; emoji: string; category: string;
  months: number[]; // 12 values
  days: number;     // days to harvest
  tip: string;
}

const CROPS: CropCalendar[] = [
  // Vegetables
  { name:"Kangkung",        emoji:"🥬", category:"Vegetable", months:[1,1,1,0,0,0,1,1,1,1,0,0],  days:21,  tip:"Harvest young shoots. Regrows after cutting. Best in wet season." },
  { name:"Bayam / Spinach", emoji:"🌿", category:"Vegetable", months:[1,1,0,0,-1,-1,0,1,1,1,1,1], days:28,  tip:"Avoid hottest months. Needs regular watering." },
  { name:"Lettuce",         emoji:"🥗", category:"Vegetable", months:[1,1,1,0,-1,-1,-1,0,1,1,1,1], days:45, tip:"Grow in shade. Bolts quickly in heat over 32°C." },
  { name:"Cucumber",        emoji:"🥒", category:"Vegetable", months:[0,1,1,1,0,0,0,0,1,1,1,0],   days:50,  tip:"Trellis upward. Needs consistent watering. Harvest daily." },
  { name:"Long Bean",       emoji:"🫘", category:"Vegetable", months:[1,1,1,1,0,0,1,1,1,1,0,0],   days:55,  tip:"Trellis essential. Fix nitrogen in soil." },
  { name:"Okra / Bendi",    emoji:"🌿", category:"Vegetable", months:[1,1,1,1,1,0,0,1,1,1,1,1],   days:55,  tip:"Loves heat. Harvest every 2 days when young." },
  { name:"Chili",           emoji:"🌶️", category:"Vegetable", months:[1,1,1,0,0,-1,-1,0,1,1,1,1], days:75,  tip:"Needs full sun. Water consistently. Watch for leaf curl." },
  { name:"Tomato",          emoji:"🍅", category:"Vegetable", months:[1,1,0,-1,-1,-1,-1,-1,0,1,1,1],days:80, tip:"Best in cooler months. Stake plants. Avoid waterlogging." },
  { name:"Brinjal",         emoji:"🍆", category:"Vegetable", months:[1,1,1,0,0,-1,0,1,1,1,1,1],  days:65,  tip:"Needs pruning for airflow. Mulch to retain moisture." },
  { name:"Pumpkin",         emoji:"🎃", category:"Vegetable", months:[0,0,1,1,1,0,0,0,1,1,1,0],   days:90,  tip:"Sprawling — needs space or vertical trellis." },
  { name:"Sweet Potato",    emoji:"🍠", category:"Vegetable", months:[1,1,1,1,0,0,1,1,1,1,1,1],   days:90,  tip:"Easy in Sarawak. Plant slips. Harvest before heavy rain." },
  { name:"Tapioca / Cassava",emoji:"🌿",category:"Vegetable", months:[1,1,1,0,0,0,0,1,1,1,1,1],  days:270, tip:"Plant stems. Very drought-tolerant once established." },
  { name:"Corn",            emoji:"🌽", category:"Vegetable", months:[1,1,0,0,-1,-1,0,0,1,1,1,1], days:75,  tip:"Plant in blocks of 4+ rows for wind pollination." },
  // Herbs
  { name:"Basil",           emoji:"🌿", category:"Herb",     months:[1,1,1,0,-1,-1,-1,0,1,1,1,1], days:30,  tip:"Pinch flowers to extend harvest. Don't overwater." },
  { name:"Lemongrass",      emoji:"🌾", category:"Herb",     months:[1,1,1,1,1,1,1,1,1,1,1,1],   days:90,  tip:"Plant year-round in Malaysia. Divide clumps yearly." },
  { name:"Pandan",          emoji:"🌿", category:"Herb",     months:[1,1,1,1,1,1,1,1,1,1,1,1],   days:60,  tip:"Grows anywhere with water. Repels cockroaches naturally." },
  { name:"Turmeric / Kunyit",emoji:"🌿",category:"Herb",     months:[0,1,1,1,1,0,0,0,0,1,1,0],   days:240, tip:"Plant rhizomes. Needs 8 months. Harvest after leaves yellow." },
  { name:"Ginger / Halia",  emoji:"🌿", category:"Herb",     months:[0,1,1,1,1,0,0,0,0,1,1,0],   days:210, tip:"Plant young rhizomes. Mulch heavily. Partial shade." },
  { name:"Chives",          emoji:"🌿", category:"Herb",     months:[1,1,1,0,0,-1,-1,0,1,1,1,1],  days:60,  tip:"Cut 2-3cm from base. Regrows continuously." },
  // Fruits
  { name:"Papaya",          emoji:"🍈", category:"Fruit",    months:[0,1,1,1,0,0,0,1,1,1,0,0],   days:270, tip:"Plant male + female. Flowers 5-6 months, fruits 9 months." },
  { name:"Banana",          emoji:"🍌", category:"Fruit",    months:[1,1,1,1,0,0,1,1,1,1,1,1],   days:365, tip:"Harvest entire bunch when first finger turns yellow." },
  { name:"Pineapple",       emoji:"🍍", category:"Fruit",    months:[1,1,0,0,0,-1,0,0,1,1,1,1],  days:540, tip:"Plant crown or suckers. Takes 18 months first harvest." },
  { name:"Starfruit / Belimbing",emoji:"⭐",category:"Fruit",months:[1,1,1,0,0,-1,0,1,1,1,1,1], days:365, tip:"Flowers twice a year. Net fruits to prevent pest damage." },
  { name:"Watermelon",      emoji:"🍉", category:"Fruit",    months:[1,1,1,1,0,-1,-1,0,0,1,1,1], days:80,  tip:"Full sun, well-drained soil. Elevate fruits on boards." },
  // Cash crops
  { name:"Padi / Rice",     emoji:"🌾", category:"Cash Crop",months:[1,0,0,0,0,1,1,0,0,0,0,1],  days:120, tip:"Two seasons: Musim Rendeng (Jan) + Musim Gadu (Jun). Check MUDA schedule." },
  { name:"Rambutan",        emoji:"🍒", category:"Cash Crop",months:[0,0,1,1,1,1,0,0,0,1,1,0],  days:365, tip:"Fruits Jun-Aug in Sarawak. Budding from proven trees recommended." },
  { name:"Durian",          emoji:"🍈", category:"Cash Crop",months:[0,0,0,1,1,1,1,0,0,0,0,0],  days:365*4,tip:"Fruits May-Aug. Long term 4-6 year investment. Test for musang king variety." },
  { name:"Oil Palm",        emoji:"🌴", category:"Cash Crop",months:[1,1,1,1,1,1,1,1,1,1,1,1],  days:365*3,tip:"3 years to first harvest. Monthly yield. Major Sarawak industry." },
];

const CATEGORIES = ["All", "Vegetable", "Herb", "Fruit", "Cash Crop"];
const CURRENT_MONTH = new Date().getMonth(); // 0-indexed

const CELL_STYLE: Record<number, string> = {
  1:  "bg-emerald-500/80 text-white",
  0:  "bg-yellow-500/40 text-yellow-200",
  [-1]: "bg-red-900/40 text-red-300",
};
const CELL_LABEL: Record<number, string> = { 1:"✓", 0:"~", [-1]:"✗" };

export default function PlantingCalendar() {
  const [cat, setCat]     = useState("All");
  const [search, setSearch] = useState("");

  const filtered = CROPS.filter(c => {
    const matchCat = cat === "All" || c.category === cat;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <Calendar className="w-6 h-6 text-emerald-400" />
          <div>
            <h1 className="text-xl font-bold">Planting Calendar</h1>
            <p className="text-xs text-muted-foreground">Malaysia / Sarawak — {CROPS.length} crops</p>
          </div>
        </div>
        <div className="container pb-3 space-y-2">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search crop..."
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <div className="flex gap-1.5 overflow-x-auto">
            {CATEGORIES.map(c => (
              <button type="button" key={c} onClick={() => setCat(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  cat === c ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"
                }`}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-4 max-w-6xl overflow-x-auto">
        {/* Legend */}
        <div className="flex gap-4 mb-4 text-xs">
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-emerald-500/80 inline-block" /> Best time</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-yellow-500/40 inline-block" /> Possible</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-red-900/40 inline-block" /> Avoid</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-blue-500/60 inline-block" /> Current month</span>
        </div>

        <table className="w-full text-xs border-collapse min-w-[640px]">
          <thead>
            <tr className="text-muted-foreground">
              <th className="text-left py-2 pr-4 font-semibold w-40">Crop</th>
              <th className="text-left py-2 pr-2 font-semibold">Days</th>
              {MONTHS.map((m, i) => (
                <th key={m} className={`py-2 px-1 text-center font-semibold w-10 ${i === CURRENT_MONTH ? "text-blue-400" : ""}`}>{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(crop => (
              <tr key={crop.name} className="group border-b border-border/20 hover:bg-white/5 transition-colors">
                <td className="py-2 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{crop.emoji}</span>
                    <div>
                      <p className="font-semibold">{crop.name}</p>
                      <p className="text-[10px] text-muted-foreground">{crop.category}</p>
                    </div>
                  </div>
                </td>
                <td className="py-2 pr-2 text-muted-foreground whitespace-nowrap">
                  {crop.days >= 365 ? `${Math.round(crop.days/365)}yr` : `${crop.days}d`}
                </td>
                {crop.months.map((val, i) => (
                  <td key={i} className="py-1 px-0.5">
                    <div className={`w-8 h-7 rounded flex items-center justify-center font-bold text-[10px] ${
                      i === CURRENT_MONTH ? "ring-2 ring-blue-400" : ""
                    } ${CELL_STYLE[val] || ""}`}>
                      {CELL_LABEL[val]}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tips for current month */}
        <div className="mt-6 glass rounded-xl p-5 border border-emerald-500/20">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Sun className="w-4 h-4 text-yellow-400" />
            What to plant this month ({MONTHS[CURRENT_MONTH]})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CROPS.filter(c => c.months[CURRENT_MONTH] === 1).map(c => (
              <div key={c.name} className="glass rounded-lg p-3 border border-emerald-500/20">
                <p className="font-semibold text-sm">{c.emoji} {c.name}</p>
                <p className="text-xs text-muted-foreground">{c.days >= 365 ? `${Math.round(c.days/365)}yr to harvest` : `${c.days} days to harvest`}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
