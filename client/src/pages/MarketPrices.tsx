import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, TrendingUp, TrendingDown } from "lucide-react";

const PRICES = [
  // Vegetables
  { name:"Kangkung",cat:"Vegetable",emoji:"🥬",farm:"0.80-1.20",market:"1.50-2.50",retail:"2.00-3.50",unit:"kg",tip:"Sell early morning at pasar tani. Bundle 200g for RM 0.50 each.",trend:"stable" as const },
  { name:"Bayam",cat:"Vegetable",emoji:"🌿",farm:"0.80-1.20",market:"1.50-2.50",retail:"2.00-3.50",unit:"kg",tip:"High turnover. Consistent demand.",trend:"stable" as const },
  { name:"Lettuce",cat:"Vegetable",emoji:"🥗",farm:"1.50-2.00",market:"3.00-5.00",retail:"4.00-7.00",unit:"kg",tip:"Premium vegetable — good margins. Focus on Cameron/hydroponic varieties.",trend:"up" as const },
  { name:"Chili (Cili Api)",cat:"Vegetable",emoji:"🌶️",farm:"3.00-8.00",market:"6.00-15.00",retail:"8.00-20.00",unit:"kg",tip:"Very volatile price — can spike to RM 50/kg during shortage. Dry season = higher price.",trend:"up" as const },
  { name:"Tomato",cat:"Vegetable",emoji:"🍅",farm:"1.50-3.00",market:"3.00-6.00",retail:"4.00-8.00",unit:"kg",tip:"Price drops in peak season. Avoid flooding market.",trend:"stable" as const },
  { name:"Cucumber",cat:"Vegetable",emoji:"🥒",farm:"0.80-1.50",market:"1.50-3.00",retail:"2.00-4.00",unit:"kg",tip:"Low margin crop. Grow only in high volume.",trend:"stable" as const },
  { name:"Long Bean",cat:"Vegetable",emoji:"🫘",farm:"1.00-1.80",market:"2.00-3.50",retail:"2.50-4.00",unit:"kg",tip:"Consistent demand. Good for small plots.",trend:"stable" as const },
  { name:"Brinjal",cat:"Vegetable",emoji:"🍆",farm:"1.00-2.00",market:"2.00-4.00",retail:"2.50-5.00",unit:"kg",tip:"Easy to grow, reliable market.",trend:"stable" as const },
  { name:"Okra/Bendi",cat:"Vegetable",emoji:"🌿",farm:"1.50-2.50",market:"3.00-5.00",retail:"4.00-6.00",unit:"kg",tip:"Easy crop. Harvest daily. Consistent buyers.",trend:"stable" as const },
  // Fruits
  { name:"Rambutan",cat:"Fruit",emoji:"🍒",farm:"1.50-3.00",market:"3.00-6.00",retail:"4.00-8.00",unit:"kg",tip:"Seasonal peak Jun-Aug. Sell whole bunch — better presentation.",trend:"up" as const },
  { name:"Papaya",cat:"Fruit",emoji:"🍈",farm:"0.80-1.50",market:"1.50-3.00",retail:"2.00-4.00",unit:"kg",tip:"Year-round supply = stable price. Large volume needed for profit.",trend:"stable" as const },
  { name:"Banana (Pisang Berangan)",cat:"Fruit",emoji:"🍌",farm:"1.00-1.80",market:"2.00-3.50",retail:"2.50-5.00",unit:"kg",tip:"High volume low margin. Sell locally — reduces transport loss.",trend:"stable" as const },
  { name:"Pineapple (Sarawak)",cat:"Fruit",emoji:"🍍",farm:"1.50-3.00",market:"3.00-6.00",retail:"4.00-8.00",unit:"kg",tip:"Sarawak sweet pineapple commands premium. Market as Sarawak special.",trend:"up" as const },
  { name:"Durian (Ordinary)",cat:"Fruit",emoji:"🌳",farm:"5.00-10.00",market:"10.00-20.00",retail:"15.00-30.00",unit:"kg",tip:"Highest margin fruit. Peak May-Aug. Good investment long-term.",trend:"up" as const },
  { name:"Starfruit",cat:"Fruit",emoji:"⭐",farm:"1.50-2.50",market:"3.00-5.00",retail:"4.00-7.00",unit:"kg",tip:"Year-round, two seasons. Good home garden extra income.",trend:"stable" as const },
  // Herbs
  { name:"Lemongrass",cat:"Herb",emoji:"🌾",farm:"1.00-1.50",market:"2.00-4.00",retail:"3.00-5.00",unit:"kg",tip:"Bundle 5-6 stalks. Very consistent demand for cooking.",trend:"stable" as const },
  { name:"Pandan",cat:"Herb",emoji:"🌿",farm:"2.00-4.00",market:"4.00-8.00",retail:"5.00-10.00",unit:"kg",tip:"Bundle fresh leaves. Very high demand for kuih and cooking.",trend:"up" as const },
  { name:"Ginger",cat:"Herb",emoji:"🌿",farm:"2.00-4.00",market:"4.00-8.00",retail:"5.00-12.00",unit:"kg",tip:"Price spikes often. High demand year-round.",trend:"up" as const },
  { name:"Turmeric",cat:"Herb",emoji:"🌿",farm:"2.50-4.00",market:"5.00-8.00",retail:"6.00-12.00",unit:"kg",tip:"Organic turmeric can sell for 2-3× conventional.",trend:"up" as const },
  // Cash crops
  { name:"Padi (Paddy)",cat:"Cash Crop",emoji:"🌾",farm:"0.80-1.20",market:"—",retail:"(gov subsidized)",unit:"kg",tip:"Subsidized by government. Register with BERNAS/MADA for price support.",trend:"stable" as const },
  { name:"Oil Palm (FFB)",cat:"Cash Crop",emoji:"🌴",farm:"500-900",market:"—",retail:"(market price)",unit:"tonne",tip:"Price linked to global CPO price. Check MPOB monthly price announcement.",trend:"up" as const },
];

const CATS = ["All","Vegetable","Fruit","Herb","Cash Crop"];

export default function MarketPrices() {
  const [cat, setCat] = useState("All");
  const filtered = PRICES.filter(p => cat === "All" || p.cat === cat);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🏪</span>
          <div><h1 className="text-xl font-bold">Market Price Guide</h1><p className="text-xs text-muted-foreground">Sarawak/Malaysia farm gate & retail prices in RM</p></div>
        </div>
        <div className="container pb-3 flex gap-1.5 overflow-x-auto">
          {CATS.map(c => <button type="button" key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${cat === c ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{c}</button>)}
        </div>
      </div>
      <div className="container py-4 max-w-4xl">
        <div className="glass rounded-xl p-3 border border-amber-500/20 mb-4"><p className="text-xs text-amber-300">⚠️ Prices are approximate guides (May 2026). Check FAMA, Pasar Borong Kuching, or your local agent for current prices. Prices vary by quality and season.</p></div>
        <div className="glass rounded-xl overflow-hidden border border-border/50">
          <table className="w-full text-sm">
            <thead className="bg-border/20">
              <tr className="text-xs text-muted-foreground">
                <th className="text-left p-3">Crop</th>
                <th className="text-right p-3">Farm Gate</th>
                <th className="text-right p-3">Wholesale</th>
                <th className="text-right p-3">Retail</th>
                <th className="text-right p-3">Trend</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.name} className={`border-t border-border/20 ${i%2===0?"":"bg-white/2"}`}>
                  <td className="p-3"><div className="flex items-center gap-2"><span>{p.emoji}</span><div><p className="font-semibold">{p.name}</p><p className="text-xs text-muted-foreground">{p.cat} · /{p.unit}</p></div></div></td>
                  <td className="p-3 text-right text-emerald-400 font-bold">RM {p.farm}</td>
                  <td className="p-3 text-right text-blue-400">RM {p.market}</td>
                  <td className="p-3 text-right text-muted-foreground">RM {p.retail}</td>
                  <td className="p-3 text-right">{p.trend === "up" ? <TrendingUp className="w-4 h-4 text-emerald-400 ml-auto" /> : <span className="text-muted-foreground text-xs">→</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="glass rounded-xl p-5 border border-border/50 mt-4">
          <h3 className="font-bold mb-3 text-sm">📱 Check Live Prices</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            {[["FAMA Malaysia","fama.gov.my — official price monitoring"],["MPOB","mpob.gov.my — oil palm price"],["Pasar Borong Kuching","Call 082-440033 for daily prices"],["e-Pasar FAMA","Whatsapp price alerts available"]].map(([n,d]) => <p key={n}><span className="text-white font-semibold">{n}</span> — {d}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}
