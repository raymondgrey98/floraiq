import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, CheckCircle } from "lucide-react";

const STEPS = [
  { n:1, title:"Choose a spot", icon:"📍", detail:"Shaded area, near water source. Min 1m × 1m. Can use bin, cage, or open pile. Drainage important — don't let it get waterlogged." },
  { n:2, title:"Layer Browns (Carbon)", icon:"🍂", detail:"Dry leaves, cardboard, paper, rice straw, wood chips, sawdust. Browns = carbon. Aim for 3 parts browns to 1 part greens. Always start with a brown layer." },
  { n:3, title:"Layer Greens (Nitrogen)", icon:"🥬", detail:"Vegetable scraps, fruit peels, grass clippings, coffee grounds, eggshells, fresh leaves. Greens = nitrogen. Add in thin layers between browns." },
  { n:4, title:"Activate with soil", icon:"🪱", detail:"Sprinkle a shovel of garden soil between layers — introduces beneficial bacteria and worms. Used compost works even better." },
  { n:5, title:"Keep moist", icon:"💧", detail:"Should feel like a damp sponge — not dripping, not dry. If too dry, add water. If too wet, add more browns. In Sarawak rainy season, cover with plastic." },
  { n:6, title:"Turn regularly", icon:"🔄", detail:"Turn with a fork every 1-2 weeks. Moves oxygen into pile, speeds decomposition. More turning = faster compost. Cold piles haven't been turned enough." },
  { n:7, title:"Wait", icon:"⏳", detail:"3-6 months for finished compost in Malaysian tropical climate. Signs of readiness: dark brown, earthy smell, crumbly texture, can't recognise original materials." },
  { n:8, title:"Use it!", icon:"🌱", detail:"Apply 5-10cm to garden beds. Mix into potting soil 30%. Use as mulch around plants. Top dress container plants monthly. Store in sealed bags up to 1 year." },
];

const GREEN_LIST = ["Fruit peels & scraps","Vegetable cuttings","Grass clippings","Coffee grounds + filters","Tea bags","Eggshells","Fresh garden weeds (no seeds)","Hair and nail clippings","Seaweed","Fresh manure (chicken, cow, goat)"];
const BROWN_LIST = ["Dry leaves","Cardboard (no glossy)","Newspaper","Straw","Wood chips","Sawdust (untreated)","Paper bags","Rice husks","Coconut shells","Dried plants"];
const AVOID_LIST = ["Meat, fish, bones","Dairy products","Oily/fatty foods","Dog or cat poo","Diseased plants","Plants treated with pesticides","Coal ash","Glossy paper","Weeds with seed heads","Citrus in large amounts (slows worms)"];

const TROUBLESHOOT = [
  { problem:"Smells like rotten eggs", cause:"Too wet or not enough air", fix:"Add browns, turn pile, uncover partially" },
  { problem:"Smells like ammonia", cause:"Too much nitrogen (greens)", fix:"Add more browns, turn pile" },
  { problem:"Not heating up", cause:"Too dry, too small, or too much carbon", fix:"Add water, add greens, turn it" },
  { problem:"Pests / rats", cause:"Food scraps exposed", fix:"Bury food scraps, use sealed bin, no meat" },
  { problem:"Too slow", cause:"Not turned, not moist, too much carbon", fix:"Turn weekly, check moisture, add greens" },
];

export default function CompostGuide() {
  const [done, setDone] = useState<number[]>([]);
  const toggle = (n: number) => setDone(d => d.includes(n) ? d.filter(x => x !== n) : [...d, n]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">♻️</span>
          <div>
            <h1 className="text-xl font-bold">Composting Guide</h1>
            <p className="text-xs text-muted-foreground">Turn kitchen waste into fertilizer — free</p>
          </div>
        </div>
      </div>

      <div className="container py-6 max-w-3xl space-y-6">
        {/* Steps with checklist */}
        <div className="glass rounded-xl p-5 border border-emerald-500/30">
          <h3 className="font-bold mb-1">8 Steps to Compost</h3>
          <p className="text-xs text-muted-foreground mb-4">Tap steps to mark as done</p>
          <div className="space-y-3">
            {STEPS.map(s => (
              <button type="button" key={s.n} onClick={() => toggle(s.n)}
                className={`w-full text-left glass rounded-xl p-4 border transition-all ${
                  done.includes(s.n) ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/50"
                }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                    done.includes(s.n) ? "bg-emerald-500 text-white" : "bg-border/50 text-muted-foreground"
                  }`}>
                    {done.includes(s.n) ? "✓" : s.n}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{s.icon} {s.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.detail}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {done.length === STEPS.length && (
            <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-center">
              <p className="text-emerald-400 font-bold">🎉 You know how to compost! Start your pile today.</p>
            </div>
          )}
        </div>

        {/* What to add */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass rounded-xl p-4 border border-green-500/30">
            <h3 className="font-bold text-sm text-green-400 mb-3">✅ Greens (Add)</h3>
            <ul className="space-y-1">{GREEN_LIST.map(i => <li key={i} className="text-xs text-muted-foreground">• {i}</li>)}</ul>
          </div>
          <div className="glass rounded-xl p-4 border border-amber-500/30">
            <h3 className="font-bold text-sm text-amber-400 mb-3">🍂 Browns (Add)</h3>
            <ul className="space-y-1">{BROWN_LIST.map(i => <li key={i} className="text-xs text-muted-foreground">• {i}</li>)}</ul>
          </div>
          <div className="glass rounded-xl p-4 border border-red-500/30">
            <h3 className="font-bold text-sm text-red-400 mb-3">❌ Never Add</h3>
            <ul className="space-y-1">{AVOID_LIST.map(i => <li key={i} className="text-xs text-muted-foreground">• {i}</li>)}</ul>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="glass rounded-xl p-5 border border-border/50">
          <h3 className="font-bold mb-3">🔧 Troubleshooting</h3>
          <div className="space-y-3">
            {TROUBLESHOOT.map(t => (
              <div key={t.problem} className="glass rounded-lg p-3 border border-border/30">
                <p className="font-semibold text-sm text-red-300">❗ {t.problem}</p>
                <p className="text-xs text-muted-foreground">Cause: {t.cause}</p>
                <p className="text-xs text-emerald-400">Fix: {t.fix}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-4 border border-blue-500/20">
          <p className="text-sm text-blue-300">🌏 Sarawak tip: Tropical heat speeds up composting — you can get finished compost in as little as 6-8 weeks if you turn it every 3 days. The humidity helps too.</p>
        </div>
      </div>
    </div>
  );
}
