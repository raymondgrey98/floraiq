import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

function getMoonPhase(date: Date): { phase: string; emoji: string; illumination: number; dayOfCycle: number } {
  // Accurate lunar cycle calculation (29.53059 days)
  const knownNewMoon = new Date("2000-01-06T18:14:00Z").getTime();
  const LUNAR_CYCLE = 29.53059 * 24 * 60 * 60 * 1000;
  const elapsed = date.getTime() - knownNewMoon;
  const dayOfCycle = ((elapsed % LUNAR_CYCLE) / LUNAR_CYCLE) * 29.53059;
  const norm = dayOfCycle < 0 ? dayOfCycle + 29.53059 : dayOfCycle;
  const illumination = Math.round((1 - Math.cos((norm / 29.53059) * 2 * Math.PI)) / 2 * 100);

  let phase: string; let emoji: string;
  if (norm < 1.85)       { phase = "New Moon";        emoji = "🌑" }
  else if (norm < 7.38)  { phase = "Waxing Crescent"; emoji = "🌒" }
  else if (norm < 9.22)  { phase = "First Quarter";   emoji = "🌓" }
  else if (norm < 14.77) { phase = "Waxing Gibbous";  emoji = "🌔" }
  else if (norm < 16.61) { phase = "Full Moon";        emoji = "🌕" }
  else if (norm < 22.15) { phase = "Waning Gibbous";  emoji = "🌖" }
  else if (norm < 23.99) { phase = "Last Quarter";     emoji = "🌗" }
  else                   { phase = "Waning Crescent";  emoji = "🌘" }

  return { phase, emoji, illumination, dayOfCycle: Math.round(norm) };
}

const PHASE_ADVICE: Record<string, { plant: string[]; avoid: string[]; tip: string; color: string }> = {
  "New Moon": {
    plant: ["Start seeds indoors","Plant leafy greens","Plant annual flowers"],
    avoid: ["Transplanting","Root division","Pruning"],
    tip: "Energy is drawing upward. Best for leafy crops and above-ground vegetables.",
    color: "from-gray-800 to-gray-900",
  },
  "Waxing Crescent": {
    plant: ["Sow vegetables","Plant cereals like corn","Plant annuals"],
    avoid: ["Harvesting root crops","Heavy pruning"],
    tip: "Moisture rising in the plant. Good for all sowing and planting.",
    color: "from-blue-900 to-gray-900",
  },
  "First Quarter": {
    plant: ["Plant fruiting vegetables","Transplant seedlings","Sow fast-growing crops"],
    avoid: ["Harvesting","Root work"],
    tip: "Strong upward energy. Excellent for transplanting and fruiting crops.",
    color: "from-indigo-900 to-gray-900",
  },
  "Waxing Gibbous": {
    plant: ["Plant fruiting crops","Apply foliar fertilizer","Plant climbing plants"],
    avoid: ["Pruning","Root disturbance"],
    tip: "Plant vitality is highest. Best time to apply fertilizer and plant.",
    color: "from-purple-900 to-gray-900",
  },
  "Full Moon": {
    plant: ["Harvest crops","Collect seeds","Divide perennials","Plant root crops"],
    avoid: ["Pruning fruit trees","Starting new seeds immediately"],
    tip: "Maximum moisture and energy in plant. Best harvest time. Sap rises fully.",
    color: "from-yellow-900 to-amber-900",
  },
  "Waning Gibbous": {
    plant: ["Plant root crops (carrots, ginger)","Apply compost","Plant perennials"],
    avoid: ["Planting annuals","Sowing seeds"],
    tip: "Energy moving downward into roots. Ideal for root crops and soil work.",
    color: "from-orange-900 to-gray-900",
  },
  "Last Quarter": {
    plant: ["Plant garlic, onion, potatoes","Soil amendment","Composting"],
    avoid: ["Planting above-ground crops","Transplanting"],
    tip: "Rest period. Best for soil preparation, composting and weeding.",
    color: "from-red-900 to-gray-900",
  },
  "Waning Crescent": {
    plant: ["Rest the garden","Plan","Prepare beds","Clear weeds"],
    avoid: ["Planting anything","Transplanting","Fertilising"],
    tip: "Lowest energy phase. Use for planning, tool maintenance and bed preparation.",
    color: "from-gray-900 to-black",
  },
};

export default function MoonCalendar() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(today);
  const moon = getMoonPhase(viewDate);
  const advice = PHASE_ADVICE[moon.phase];

  // Generate 29 days from today
  const days = Array.from({ length: 29 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i - 4);
    return d;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🌙</span>
          <div>
            <h1 className="text-xl font-bold">Moon Phase Calendar</h1>
            <p className="text-xs text-muted-foreground">Plant by lunar cycle — traditional farming guide</p>
          </div>
        </div>
      </div>

      <div className="container py-6 max-w-3xl space-y-6">
        {/* Today's moon */}
        <div className={`glass rounded-2xl border border-border/50 p-6 bg-gradient-to-br ${advice.color} text-center`}>
          <p className="text-6xl mb-3">{moon.emoji}</p>
          <h2 className="text-2xl font-bold mb-1">{moon.phase}</h2>
          <p className="text-muted-foreground text-sm mb-3">
            {viewDate.toDateString()} · Day {moon.dayOfCycle} of 29 · {moon.illumination}% illuminated
          </p>
          <p className="text-sm text-muted-foreground italic">{advice.tip}</p>
        </div>

        {/* 29-day strip */}
        <div className="glass rounded-xl p-4 border border-border/50">
          <h3 className="font-semibold mb-3 text-sm">29-Day Lunar Cycle</h3>
          <div className="flex gap-1 overflow-x-auto pb-2">
            {days.map((d, i) => {
              const m = getMoonPhase(d);
              const isToday = d.toDateString() === today.toDateString();
              const isSelected = d.toDateString() === viewDate.toDateString();
              return (
                <button type="button" key={i} onClick={() => setViewDate(d)}
                  className={`flex flex-col items-center gap-0.5 min-w-[36px] rounded-lg p-1.5 transition-all ${
                    isSelected ? "bg-emerald-500/30 ring-1 ring-emerald-500" :
                    isToday ? "bg-blue-500/20 ring-1 ring-blue-400" : "hover:bg-white/10"
                  }`}>
                  <span className="text-[10px] text-muted-foreground">{["S","M","T","W","T","F","S"][d.getDay()]}</span>
                  <span className="text-lg leading-none">{m.emoji}</span>
                  <span className="text-[10px] font-bold">{d.getDate()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Planting advice */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass rounded-xl p-5 border border-emerald-500/30">
            <h3 className="font-bold text-sm text-emerald-400 mb-3">✅ Good to do now</h3>
            <ul className="space-y-2">
              {advice.plant.map(a => (
                <li key={a} className="flex items-start gap-2 text-sm">
                  <span className="text-emerald-400 mt-0.5">•</span>{a}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-xl p-5 border border-red-500/20">
            <h3 className="font-bold text-sm text-red-400 mb-3">❌ Avoid now</h3>
            <ul className="space-y-2">
              {advice.avoid.map(a => (
                <li key={a} className="flex items-start gap-2 text-sm">
                  <span className="text-red-400 mt-0.5">•</span>{a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Phase guide */}
        <div className="glass rounded-xl p-5 border border-border/50">
          <h3 className="font-bold mb-4 text-sm">All Lunar Phases Guide</h3>
          <div className="space-y-2">
            {Object.entries(PHASE_ADVICE).map(([phase, info]) => (
              <div key={phase} className="flex items-start gap-3 py-2 border-b border-border/20 last:border-0">
                <span className="text-xl w-8 flex-shrink-0">
                  {Object.entries(PHASE_ADVICE).indexOf([phase, info] as any) < 4 ?
                    ["🌑","🌒","🌓","🌔"][Object.entries(PHASE_ADVICE).indexOf([phase, info] as any)] :
                    ["🌕","🌖","🌗","🌘"][Object.entries(PHASE_ADVICE).indexOf([phase, info] as any) - 4]}
                </span>
                <div>
                  <p className="font-semibold text-sm">{phase}</p>
                  <p className="text-xs text-muted-foreground">{info.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
