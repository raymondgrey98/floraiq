import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const SPECIES = [
  { name:"African Nightcrawler", scientific:"Eudrilus eugeniae", emoji:"🪱", climate:"Tropical — BEST for Malaysia", temp:"22-30°C", moisture:"70-80%", casting:"Very high", note:"#1 choice for Malaysian vermicomposting. Thrives in our heat. Available from local suppliers. Large, productive, easy." },
  { name:"Red Wiggler", scientific:"Eisenia fetida", emoji:"🪱", climate:"Temperate — struggles in Malaysia heat", temp:"15-25°C", moisture:"70-80%", casting:"High", note:"Most popular globally but struggles in Kuching's 30-35°C. May die in summer. Use African Nightcrawler instead." },
  { name:"Indian Blue Worm", scientific:"Perionyx excavatus", emoji:"🪱", climate:"Tropical — good for Malaysia", temp:"20-30°C", moisture:"80-85%", casting:"High", note:"Native to Southeast Asia. Very good for Malaysia. Multiplies fast. Can be found in local garden shops." },
];

const FEED_GUIDE = [
  { item:"Fruit scraps (non-citrus)", rating:"⭐⭐⭐⭐⭐", note:"Best feed. Watermelon, papaya, banana, mango peels." },
  { item:"Vegetable peels", rating:"⭐⭐⭐⭐⭐", note:"Excellent. All veg peels except onion/garlic." },
  { item:"Coffee grounds", rating:"⭐⭐⭐⭐", note:"Worms love it. Improves castings. Add 1-2x per week." },
  { item:"Cardboard / paper (wet, torn small)", rating:"⭐⭐⭐⭐", note:"Essential carbon source to balance kitchen waste." },
  { item:"Fallen leaves (dry)", rating:"⭐⭐⭐⭐", note:"Excellent carbon. Shred first. Free from garden." },
  { item:"Rice (cooked or uncooked)", rating:"⭐⭐⭐", note:"OK in small amounts. Can attract ants and flies." },
  { item:"Citrus peels (lemon, orange)", rating:"⭐⭐", note:"OK in small amounts. Acidic — can lower pH." },
  { item:"Meat, fish, dairy", rating:"❌", note:"NEVER add. Attracts rats, maggots, horrible smell." },
  { item:"Onion, garlic", rating:"❌", note:"Repels worms. Avoid." },
  { item:"Chili (very spicy)", rating:"❌", note:"Kills or repels worms. Avoid." },
  { item:"Pet waste", rating:"❌", note:"Disease risk. Never add." },
  { item:"Oily/greasy food", rating:"❌", note:"Clogs bedding, repels worms, attracts pests." },
];

const PROBLEMS = [
  { problem:"Bin smells bad", cause:"Too wet, too much food, anaerobic", fix:"Add dry cardboard. Stop feeding 1 week. Stir to aerate." },
  { problem:"Worms escaping", cause:"Wrong conditions — too wet, too acidic, too hot", fix:"Check pH (add lime if acidic), reduce moisture, move bin to shade." },
  { problem:"Fruit flies", cause:"Exposed food on surface", fix:"Bury food under bedding. Lay wet newspaper on top. Add more cardboard." },
  { problem:"Ants invading", cause:"Too dry or sweet food exposed", fix:"Moisten bedding. Petroleum jelly around bin legs. Bury food deeper." },
  { problem:"Worms dying", cause:"Too hot (>35°C), too dry, pH wrong, toxic feed", fix:"Move to shade (critical in Malaysia). Check moisture. Remove citrus/onion/meat." },
  { problem:"Slow breakdown", cause:"Too cold, wrong species, not enough worms", fix:"Use African Nightcrawler for Malaysia. Add more worms (double population)." },
];

const SETUP = [
  { n:1, title:"Choose your bin", desc:"Start with a 60-100L plastic bin with holes drilled for drainage and ventilation. 6-8mm holes, 20-30 on sides and bottom. Put collection tray under for liquid (worm tea)." },
  { n:2, title:"Prepare bedding", desc:"Fill half bin with moistened cardboard (torn into pieces), coconut coir, or shredded newspaper. Must feel like wrung-out sponge — damp but not dripping." },
  { n:3, title:"Add worms", desc:"Start with 500g-1kg of African Nightcrawler. Source from Shopee (\"cacing tanah Malaysia\"), local garden shops, or Facebook groups. Cost: RM 15-40/kg." },
  { n:4, title:"Feed gradually", desc:"Week 1: Only a small handful of fruit peels. Worms need to settle in. Increase feeding over 2-3 weeks as population grows." },
  { n:5, title:"Maintain moisture", desc:"Keep bedding moist (70-80%). In dry season: spray water 2x weekly. In monsoon: ensure drainage holes clear. Critical." },
  { n:6, title:"Harvest castings", desc:"After 2-4 months: dark, earthy-smelling, granular material = vermicast. Move food to one side — worms migrate. Harvest other side." },
];

export default function VermiGuide() {
  const [tab, setTab] = useState<"start"|"feed"|"problems"|"species">("start");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🪱</span>
          <div><h1 className="text-xl font-bold">Vermicomposting Guide</h1><p className="text-xs text-muted-foreground">Worm composting for Malaysia — cacing tanah</p></div>
        </div>
        <div className="container pb-3 flex gap-2 overflow-x-auto">
          {[["start","🚀 Setup"],["feed","🍎 Feeding"],["problems","🔧 Problems"],["species","🪱 Worm Species"]].map(([v,l]) => (
            <button type="button" key={v} onClick={() => setTab(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${tab === v ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="container py-6 max-w-3xl space-y-4">
        {tab === "start" && <>
          <div className="glass rounded-xl p-4 border border-emerald-500/20 mb-2">
            <h3 className="font-bold mb-1">Why Vermicompost?</h3>
            <p className="text-sm text-muted-foreground">Worm castings (vermicast) are the highest quality organic fertilizer available. 5-7x more plant-available nutrients than regular compost. Liquid leachate (worm tea) = free liquid fertilizer. Zero cost from kitchen waste.</p>
          </div>
          <div className="space-y-3">
            {SETUP.map(s => (
              <div key={s.n} className="glass rounded-xl p-4 border border-border/40 flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0">{s.n}</div>
                <div><p className="font-semibold text-sm mb-1">{s.title}</p><p className="text-xs text-muted-foreground">{s.desc}</p></div>
              </div>
            ))}
          </div>
          <div className="glass rounded-xl p-4 border border-amber-500/20"><p className="text-xs text-amber-300">⚠️ Kuching tip: Put your worm bin in a shaded area — under roof, in shed, or covered area. Our heat (32-35°C) kills worms fast. Morning sun OK, afternoon sun = death for worms.</p></div>
        </>}
        {tab === "feed" && (
          <div className="space-y-2">
            {FEED_GUIDE.map(f => (
              <div key={f.item} className={`glass rounded-xl p-3 border ${f.rating.includes("❌") ? "border-red-500/20" : "border-border/40"} flex items-center gap-3`}>
                <span className="text-sm font-bold w-20 flex-shrink-0">{f.rating}</span>
                <div><p className="font-semibold text-sm">{f.item}</p><p className="text-xs text-muted-foreground">{f.note}</p></div>
              </div>
            ))}
          </div>
        )}
        {tab === "problems" && (
          <div className="space-y-3">
            {PROBLEMS.map(p => (
              <div key={p.problem} className="glass rounded-xl p-4 border border-border/40">
                <p className="font-bold text-red-400 text-sm mb-1">{p.problem}</p>
                <p className="text-xs text-muted-foreground mb-1">Cause: {p.cause}</p>
                <p className="text-xs text-emerald-400">Fix: {p.fix}</p>
              </div>
            ))}
          </div>
        )}
        {tab === "species" && (
          <div className="space-y-3">
            {SPECIES.map(s => (
              <div key={s.scientific} className="glass rounded-xl p-5 border border-border/40 space-y-2">
                <div><p className="font-bold text-lg">{s.name}</p><p className="text-xs italic text-muted-foreground">{s.scientific}</p></div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[["🌡️","Temp",s.temp],["💧","Moisture",s.moisture],["⭐","Castings",s.casting]].map(([e,l,v]) => (
                    <div key={String(l)} className="glass rounded-lg p-2 border border-border/30"><p className="text-base">{e}</p><p className="text-[10px] text-muted-foreground">{l}</p><p className="text-xs font-bold">{v}</p></div>
                  ))}
                </div>
                <p className={`text-xs px-2 py-0.5 rounded-full inline-block font-bold ${s.climate.includes("BEST") ? "bg-green-500/20 text-green-400" : s.climate.includes("good") ? "bg-blue-500/20 text-blue-400" : "bg-amber-500/20 text-amber-400"}`}>{s.climate}</p>
                <p className="text-xs text-muted-foreground">{s.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
