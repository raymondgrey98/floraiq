import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Droplets } from "lucide-react";

const CROP_WATER: Record<string, { daily: number; season: string; method: string; tip: string }> = {
  "Tomato":          { daily:4,  season:"Reduce in fruit stage",     method:"Drip at base",       tip:"Inconsistent watering causes blossom end rot. Mulch heavily." },
  "Chili":           { daily:3,  season:"More in flowering",         method:"Drip or furrow",     tip:"Chili tolerates dry spells but wilts fast. Water at roots only." },
  "Cucumber":        { daily:5,  season:"Heavy in fruiting",         method:"Drip or flood",      tip:"Never let soil dry out. Needs consistent moisture for straight fruit." },
  "Kangkung":        { daily:6,  season:"All year high",             method:"Flood or sprinkler", tip:"Water spinach loves water. Can float in ponds." },
  "Lettuce":         { daily:3,  season:"More in hot weather",       method:"Sprinkler or drip",  tip:"Shallow roots — water frequently but lightly. Avoid waterlogging." },
  "Padi / Rice":     { daily:10, season:"Dry out before harvest",    method:"Flood irrigation",   tip:"Flood to 5cm depth. Drain 1 week before harvest for easier cutting." },
  "Banana":          { daily:8,  season:"Reduce after bunch formed", method:"Drip or furrow",     tip:"Needs 25-40mm water per week. Drought causes thin, poor fruit." },
  "Papaya":          { daily:5,  season:"Less in fruiting",          method:"Drip at base",       tip:"Papaya hates waterlogged soil — plant on raised beds in Sarawak." },
  "Corn":            { daily:5,  season:"Critical at silking",       method:"Furrow or drip",     tip:"Most critical period is silking/tasseling. Water stress then = poor yield." },
  "Sweet Potato":    { daily:3,  season:"Reduce at harvest",         method:"Drip or furrow",     tip:"Too much water near harvest reduces sugar content." },
  "Longbean":        { daily:3,  season:"More in flowering",         method:"Drip at base",       tip:"Avoid wetting leaves — increases fungal disease risk." },
  "Pumpkin":         { daily:4,  season:"Reduce when fruit matures", method:"Furrow at base",     tip:"Water deeply but infrequently. Wet leaves cause powdery mildew." },
  "Durian":          { daily:15, season:"Stress to induce flowering",method:"Basin irrigation",   tip:"Deliberate water stress (4-6 weeks) triggers flowering. Time carefully." },
  "Rambutan":        { daily:10, season:"More before harvest",       method:"Basin or drip",      tip:"Irregular water causes fruit cracking. Mulch tree basin." },
  "Oil Palm":        { daily:20, season:"All year, no dry season",   method:"Drip or flood",      tip:"1800-2500mm rainfall per year ideal. Irrigation needed in dry spells." },
  "Okra":            { daily:4,  season:"More in flowering/fruiting",method:"Drip or furrow",     tip:"Water stress causes stunted, tough okra. Harvest every 2 days." },
  "Brinjal":         { daily:4,  season:"Consistent needed",         method:"Drip at base",       tip:"Loves consistent moisture. Mulch to prevent soil splash on fruit." },
  "Ginger":          { daily:4,  season:"Reduce before harvest",     method:"Sprinkler or drip",  tip:"Never waterlog. Raised beds essential in wet Sarawak conditions." },
};

export default function IrrigationCalc() {
  const [crop, setCrop] = useState("Tomato");
  const [area, setArea] = useState(100);
  const [unit, setUnit] = useState<"sqm"|"acre"|"hectare">("sqm");
  const [season, setSeason] = useState<"dry"|"wet"|"normal">("normal");

  const areaSqm = unit === "sqm" ? area : unit === "acre" ? area * 4047 : area * 10000;
  const info = CROP_WATER[crop];
  const seasonMult = season === "dry" ? 1.3 : season === "wet" ? 0.5 : 1.0;
  const dailyLitres = info.daily * areaSqm * seasonMult;
  const weeklyLitres = dailyLitres * 7;
  const monthlyLitres = dailyLitres * 30;
  const monthlyM3 = monthlyLitres / 1000;
  // Rough water cost — RM 0.57/m3 first 20m3, RM 1.10 after (Sarawak tariff)
  const cost = monthlyM3 <= 20 ? monthlyM3 * 0.57 : 20 * 0.57 + (monthlyM3 - 20) * 1.10;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <Droplets className="w-6 h-6 text-blue-400" />
          <div>
            <h1 className="text-xl font-bold">Irrigation Calculator</h1>
            <p className="text-xs text-muted-foreground">Water needs by crop, area, season</p>
          </div>
        </div>
      </div>

      <div className="container py-6 max-w-2xl space-y-5">
        <div className="glass rounded-xl p-5 border border-border/50 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Crop</label>
            <select value={crop} onChange={e => setCrop(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {Object.keys(CROP_WATER).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Area</label>
            <div className="flex gap-2">
              <input type="number" min="1" value={area} onChange={e => setArea(Number(e.target.value))}
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <select value={unit} onChange={e => setUnit(e.target.value as any)}
                className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="sqm">m²</option>
                <option value="acre">acres</option>
                <option value="hectare">ha</option>
              </select>
            </div>
            <p className="text-xs text-muted-foreground mt-1">= {areaSqm.toLocaleString()} m²</p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Season</label>
            <div className="flex gap-2">
              {[["dry","☀️ Dry (+30%)"],["normal","🌤️ Normal"],["wet","🌧️ Wet (-50%)"]].map(([v,l]) => (
                <button type="button" key={v} onClick={() => setSeason(v as any)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                    season === v ? "bg-blue-500 text-white border-blue-500" : "glass border-border/50 text-muted-foreground"
                  }`}>{l}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="glass rounded-xl p-6 border border-blue-500/40 bg-blue-500/5">
          <h3 className="font-bold mb-4 text-blue-400">Water Requirements</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              ["Daily", `${dailyLitres.toFixed(0)} L`],
              ["Weekly", `${weeklyLitres.toFixed(0)} L`],
              ["Monthly", `${monthlyM3.toFixed(1)} m³`],
            ].map(([l,v]) => (
              <div key={l} className="glass rounded-xl p-4 border border-blue-500/20 text-center">
                <p className="text-xs text-muted-foreground">{l}</p>
                <p className="text-lg font-bold text-blue-400">{v}</p>
              </div>
            ))}
          </div>
          <div className="glass rounded-lg p-4 border border-amber-500/20">
            <div className="flex justify-between items-center">
              <span className="text-sm">Estimated water cost (Sarawak)</span>
              <span className="font-bold text-amber-400 text-lg">RM {cost.toFixed(2)}/month</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-xs text-muted-foreground">📅 Season tip: <span className="text-foreground">{info.season}</span></p>
            <p className="text-xs text-muted-foreground">💧 Method: <span className="text-foreground">{info.method}</span></p>
            <p className="text-xs text-muted-foreground">💡 Tip: <span className="text-foreground">{info.tip}</span></p>
          </div>
        </div>

        <div className="glass rounded-xl p-5 border border-border/50">
          <h3 className="font-semibold text-sm mb-3">💡 Irrigation Methods Comparison</h3>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between py-1 border-b border-border/20"><span>Drip irrigation</span><span className="text-emerald-400">90% efficient — best</span></div>
            <div className="flex justify-between py-1 border-b border-border/20"><span>Sprinkler</span><span className="text-blue-400">75% efficient</span></div>
            <div className="flex justify-between py-1 border-b border-border/20"><span>Furrow/flood</span><span className="text-amber-400">50% efficient</span></div>
            <div className="flex justify-between py-1"><span>Manual watering can</span><span className="text-orange-400">Variable — depends on skill</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
