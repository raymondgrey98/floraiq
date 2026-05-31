import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CROP_NPK: Record<string, { N: number; P: number; K: number; note: string }> = {
  "Tomato":         { N:150, P:60,  K:200, note:"Potassium-hungry. Reduce N once flowering." },
  "Chili":          { N:120, P:60,  K:150, note:"Boost K during fruiting for bigger yield." },
  "Cucumber":       { N:100, P:50,  K:120, note:"Light feeder. Avoid excess N — soft fruit." },
  "Kangkung":       { N:80,  P:30,  K:60,  note:"Nitrogen-hungry leafy green. Light K." },
  "Lettuce":        { N:70,  P:30,  K:50,  note:"Light feeder. Too much N causes bitterness." },
  "Okra":           { N:100, P:60,  K:100, note:"Balanced NPK works well." },
  "Long Bean":      { N:40,  P:50,  K:80,  note:"Low N — fixes own. Boost P and K." },
  "Corn":           { N:180, P:80,  K:120, note:"Heaviest N feeder. Split-apply N." },
  "Pumpkin":        { N:100, P:60,  K:150, note:"High K for large fruits." },
  "Sweet Potato":   { N:60,  P:80,  K:120, note:"Avoid high N — causes leafy growth not tubers." },
  "Rice / Padi":    { N:120, P:50,  K:80,  note:"Split N: 30% basal, 50% tillering, 20% panicle." },
  "Banana":         { N:200, P:60,  K:300, note:"Highest K demand of any crop. Apply monthly." },
  "Papaya":         { N:100, P:50,  K:150, note:"Regular light applications better than heavy dose." },
  "Durian":         { N:150, P:80,  K:200, note:"NPK 15-15-15 base + extra K pre-flowering." },
  "Rambutan":       { N:120, P:60,  K:180, note:"Boost K 2 months before expected harvest." },
  "Oil Palm":       { N:120, P:60,  K:200, note:"Frond analysis recommended annually." },
  "Ginger":         { N:80,  P:60,  K:100, note:"Balanced. Compost is excellent base." },
  "Turmeric":       { N:80,  P:60,  K:100, note:"Organic matter essential. NPK supplement." },
  "Custom crop":    { N:100, P:60,  K:100, note:"Adjust based on soil test results." },
};

const FERTILIZERS: { name: string; N: number; P: number; K: number; pricePerKg: number }[] = [
  { name:"Urea (46-0-0)",          N:46, P:0,  K:0,  pricePerKg:2.80  },
  { name:"DAP (18-46-0)",          N:18, P:46, K:0,  pricePerKg:3.50  },
  { name:"MOP (0-0-60)",           N:0,  P:0,  K:60, pricePerKg:2.40  },
  { name:"NPK 15-15-15",           N:15, P:15, K:15, pricePerKg:2.20  },
  { name:"NPK 12-12-17+2MgO",      N:12, P:12, K:17, pricePerKg:2.30  },
  { name:"Ammonium Sulphate (21%)",N:21, P:0,  K:0,  pricePerKg:1.80  },
  { name:"TSP (0-46-0)",           N:0,  P:46, K:0,  pricePerKg:3.20  },
  { name:"Organic Compost",        N:2,  P:1,  K:2,  pricePerKg:0.50  },
];

export default function FertilizerCalc() {
  const [crop, setCrop]   = useState("Tomato");
  const [area, setArea]   = useState(100);   // sq metres
  const [unit, setUnit]   = useState<"sqm"|"acre"|"hectare">("sqm");
  const [fert, setFert]   = useState("NPK 15-15-15");

  const areaSqm = unit === "sqm" ? area : unit === "acre" ? area * 4047 : area * 10000;
  const npk = CROP_NPK[crop];
  const fertilizer = FERTILIZERS.find(f => f.name === fert) || FERTILIZERS[3];

  // kg of fertilizer needed to supply each nutrient
  const kgForN = npk.N * areaSqm / 10000 / (fertilizer.N / 100 || 0.001);
  const kgForP = npk.P * areaSqm / 10000 / (fertilizer.P / 100 || 0.001);
  const kgForK = npk.K * areaSqm / 10000 / (fertilizer.K / 100 || 0.001);
  const kgNeeded = Math.max(kgForN, kgForP, kgForK);
  const totalCost = kgNeeded * fertilizer.pricePerKg;

  // Individual nutrients supplied
  const nSupplied  = kgNeeded * fertilizer.N / 100;
  const pSupplied  = kgNeeded * fertilizer.P / 100;
  const kSupplied  = kgNeeded * fertilizer.K / 100;
  const nTarget    = npk.N * areaSqm / 10000;
  const pTarget    = npk.P * areaSqm / 10000;
  const kTarget    = npk.K * areaSqm / 10000;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">⚗️</span>
          <div>
            <h1 className="text-xl font-bold">Fertilizer Calculator</h1>
            <p className="text-xs text-muted-foreground">NPK dose by crop type and area</p>
          </div>
        </div>
      </div>

      <div className="container py-6 max-w-2xl space-y-5">
        {/* Crop */}
        <div className="glass rounded-xl p-5 border border-border/50">
          <label className="block text-sm font-semibold mb-2">Crop</label>
          <select value={crop} onChange={e => setCrop(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {Object.keys(CROP_NPK).map(c => <option key={c}>{c}</option>)}
          </select>
          <p className="text-xs text-muted-foreground mt-2">💡 {CROP_NPK[crop].note}</p>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[["N (Nitrogen)", npk.N, "bg-blue-500/20 text-blue-400"],
              ["P (Phosphorus)", npk.P, "bg-orange-500/20 text-orange-400"],
              ["K (Potassium)", npk.K, "bg-purple-500/20 text-purple-400"]].map(([label, val, cls]) => (
              <div key={String(label)} className={`rounded-lg p-2 text-center ${cls}`}>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-bold">{val} kg/ha</p>
              </div>
            ))}
          </div>
        </div>

        {/* Area */}
        <div className="glass rounded-xl p-5 border border-border/50">
          <label className="block text-sm font-semibold mb-2">Farm Area</label>
          <div className="flex gap-2">
            <input type="number" min="1" value={area} onChange={e => setArea(Number(e.target.value))}
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <select value={unit} onChange={e => setUnit(e.target.value as any)}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="sqm">m²</option>
              <option value="acre">acres</option>
              <option value="hectare">hectares</option>
            </select>
          </div>
          <p className="text-xs text-muted-foreground mt-1">= {areaSqm.toLocaleString()} m²</p>
        </div>

        {/* Fertilizer */}
        <div className="glass rounded-xl p-5 border border-border/50">
          <label className="block text-sm font-semibold mb-2">Fertilizer Type</label>
          <select value={fert} onChange={e => setFert(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {FERTILIZERS.map(f => <option key={f.name}>{f.name}</option>)}
          </select>
        </div>

        {/* Result */}
        <div className="glass rounded-xl p-6 border border-emerald-500/40 bg-emerald-500/5">
          <h3 className="font-bold text-lg mb-4 text-emerald-400">Recommendation</h3>

          <div className="text-center mb-4">
            <p className="text-4xl font-bold">{kgNeeded.toFixed(1)} <span className="text-lg text-muted-foreground">kg</span></p>
            <p className="text-sm text-muted-foreground">{fert} per application</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">RM {totalCost.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Estimated cost (prices may vary locally)</p>
          </div>

          <div className="space-y-2">
            {[
              { label: "N supplied", val: nSupplied, target: nTarget, color: "bg-blue-500" },
              { label: "P supplied", val: pSupplied, target: pTarget, color: "bg-orange-500" },
              { label: "K supplied", val: kSupplied, target: kTarget, color: "bg-purple-500" },
            ].map(row => (
              <div key={row.label}>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{row.label}</span>
                  <span>{row.val.toFixed(1)} / {row.target.toFixed(1)} kg</span>
                </div>
                <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${row.color}`}
                    style={{ width: `${Math.min(row.val / row.target * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-xs text-amber-300">⚠️ Split into 3 applications: planting, 30 days after, 60 days after. Always water before applying granular fertilizer.</p>
          </div>
        </div>

        {/* Fertilizer comparison */}
        <div className="glass rounded-xl p-5 border border-border/50">
          <h3 className="font-semibold text-sm mb-3">Common Fertilizers (Malaysia prices)</h3>
          <div className="space-y-1.5">
            {FERTILIZERS.map(f => (
              <div key={f.name} className="flex justify-between text-xs py-1.5 border-b border-border/20 last:border-0">
                <span className="font-medium">{f.name}</span>
                <span className="text-muted-foreground">RM {f.pricePerKg.toFixed(2)}/kg</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Prices approximate. Check BERNAS/FAMA for current rates.</p>
        </div>
      </div>
    </div>
  );
}
