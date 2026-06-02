import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const BEES = [
  { name:"Kelulut (Stingless Bee) — Trigona spp.", emoji:"🐝", sting:false, honey:"Kelulut honey — sour, liquid, runny", yield:"1–3 kg/year per colony", hive:"Log, bamboo, or commercial box (20x20x40cm). Small 3–5mm entrance hole.", start:"Purchase established colony RM 80–200 per log. Split colonies to expand.", harvest:"Squeeze honey from cerumen pots every 4–6 months. Don't take all — leave 30%.", notes:"Easiest to keep in Malaysia. No sting — safe near children. High medicinal value honey. Very high demand." },
  { name:"Giant Honey Bee — Apis dorsata", emoji:"🐝", sting:true, honey:"Wild Tualang honey — dark, strong flavour", yield:"10–30 kg per hive (wild harvest)", hive:"Wild only — nests under Tualang tree branches or cliff overhangs. Cannot domesticate.", start:"Wild harvest only. Traditional practice by Iban and Penan. Very dangerous.", harvest:"Night harvest using fire torches. Very risky — stings can be fatal. Professional only.", notes:"World's largest bee. Nests on Tualang trees (tallest trees in Borneo). Extremely aggressive — do not approach." },
  { name:"Asian Honey Bee — Apis cerana", emoji:"🐝", sting:true, honey:"Smaller quantity but excellent flavour", yield:"5–10 kg/year per colony", hive:"Traditional wooden box hive or Langstroth hive adapted. Can use cavity in wall.", start:"Purchase swarm or colony. Easier to manage than Apis mellifera. More tolerant of tropical climate.", harvest:"Harvest honey combs with smoker. Leave 2 frames minimum for colony.", notes:"Native to Asia. More resistant to varroa mite than European bee. Better adapted to Sarawak climate." },
  { name:"European Honey Bee — Apis mellifera", emoji:"🐝", sting:true, honey:"Highest yield — commercial honey", yield:"20–40+ kg/year per colony", hive:"Standard Langstroth hive. Very organised colony structure.", start:"Requires more experience. Available from Malaysian beekeeping suppliers.", harvest:"Honey extractor needed for highest efficiency. Capping removed with hot knife.", notes:"Commercial standard. Not native to Malaysia — higher management needed. More susceptible to varroa mite." },
];

const KELULUT_STEPS = [
  { n:1, t:"Get your hive", d:"Start with one established kelulut colony in a log or box. Buy from local kelulut farmers or Sarawak beekeeping associations. Expect to pay RM 80–200." },
  { n:2, t:"Location", d:"Hang or place hive 1.5–2m above ground. Shade is essential — kelulut hate direct afternoon sun. Near flowering plants is ideal. Away from pesticides." },
  { n:3, t:"Do nothing for 3 months", d:"Let the colony establish. Watch the entrance — bees flying in and out with yellow pollen means a healthy colony. Don't open the hive." },
  { n:4, t:"Split colony after 6 months", d:"A strong colony can be split to multiply. Divide resin pots, brood, and bees equally. Each half with queen cells becomes a new colony." },
  { n:5, t:"First harvest (4–6 months)", d:"Open carefully — no smoke needed (no sting). Gently remove cerumen honey pots using a syringe or squeezing into clean container. Leave 1/3 of pots." },
  { n:6, t:"Maintain year-round", d:"Check every 2 months. Ensure entrance is clear. Apply petroleum jelly around hive base (ant barrier). Replace damaged resin pots with food-grade wax." },
];

const PLANTS_FOR_BEES = [
  { name:"Bunga Raya (Hibiscus)", note:"Excellent pollen and nectar. Flowers daily. Essential." },
  { name:"Ixora", note:"Year-round flowering. High nectar. Very attractive to kelulut." },
  { name:"Serai Wangi (Citronella)", note:"Kelulut love aromatic herbs. Also repels pests." },
  { name:"Pandan", note:"Good pollen source. Easy to grow. Kelulut friendly." },
  { name:"Rambutan (flowering season)", note:"Major honey crop. Bees work rambutan flowers intensively." },
  { name:"Starfruit / Belimbing", note:"Almost year-round flowering. Good bee plant." },
  { name:"Morinda / Mengkudu", note:"Good nectar source. Very common and easy to grow." },
  { name:"Wild Sunflower (Tithonia)", note:"Easy to grow, very high pollen and nectar. Bees love it." },
  { name:"Cow Pea / Kacang Panjang", note:"Legume flowers = excellent nectar. Also fixes nitrogen." },
  { name:"Banana flower (when blooming)", note:"Attract bees strongly during flowering period." },
];

export default function BeekeepingGuide() {
  const [tab, setTab] = useState<"bees"|"start"|"plants">("bees");
  const [selectedBee, setSelectedBee] = useState(BEES[0]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🐝</span>
          <div><h1 className="text-xl font-bold">Beekeeping Guide</h1><p className="text-xs text-muted-foreground">Kelulut stingless bee farming — Sarawak</p></div>
        </div>
        <div className="container pb-3 flex gap-2 overflow-x-auto">
          {[["bees","🐝 Bee Species"],["start","🚀 Start Kelulut"],["plants","🌸 Plants for Bees"]].map(([v,l]) => (
            <button type="button" key={v} onClick={() => setTab(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${tab === v ? "bg-amber-500 text-black" : "glass border border-border/50 text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="container py-6 max-w-4xl space-y-4">
        {tab === "bees" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              {BEES.map(b => (
                <button type="button" key={b.name} onClick={() => setSelectedBee(b)} className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selectedBee.name === b.name ? "border-amber-500/60 bg-amber-500/5" : "border-border/40 hover:border-amber-500/30"}`}>
                  <span className="text-xl">{b.emoji}</span>
                  <div className="flex-1 min-w-0"><p className="font-semibold text-xs leading-tight">{b.name.split(" —")[0]}</p><span className={`text-[10px] px-1.5 py-0.5 rounded-full ${b.sting ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>{b.sting ? "Stings" : "No sting"}</span></div>
                </button>
              ))}
            </div>
            <div className="lg:col-span-2">
              <div className="glass rounded-xl p-5 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-3"><span className="text-3xl">{selectedBee.emoji}</span><div><h2 className="text-lg font-bold leading-tight">{selectedBee.name}</h2><span className={`text-xs px-2 py-0.5 rounded-full ${selectedBee.sting ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>{selectedBee.sting ? "⚠️ Can sting" : "✅ No sting"}</span></div></div>
                {[["🍯 Honey type", selectedBee.honey],["📦 Yield", selectedBee.yield],["🏠 Hive", selectedBee.hive],["🚀 How to start", selectedBee.start],["✂️ Harvest", selectedBee.harvest]].map(([l,v]) => (
                  <div key={String(l)} className="glass rounded-lg p-3 border border-border/40"><p className="text-xs font-bold text-muted-foreground mb-1">{l}</p><p className="text-sm">{v}</p></div>
                ))}
                <div className="glass rounded-lg p-3 border border-amber-500/20"><p className="text-xs text-amber-300">💡 {selectedBee.notes}</p></div>
              </div>
            </div>
          </div>
        )}

        {tab === "start" && <>
          <div className="glass rounded-xl p-4 border border-green-500/20 mb-2">
            <p className="text-xs text-green-300">💡 Kelulut (stingless bee) is the best bee to start with in Malaysia. No sting = safe for family. Honey has high medicinal value and sells for RM 80–150 per 500ml. Growing market in health food.</p>
          </div>
          <div className="space-y-3">
            {KELULUT_STEPS.map(s => (
              <div key={s.n} className="glass rounded-xl p-4 border border-amber-500/20 flex gap-4">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-lg">{s.n}</div>
                <div><p className="font-bold text-sm">{s.t}</p><p className="text-xs text-muted-foreground mt-1">{s.d}</p></div>
              </div>
            ))}
          </div>
          <div className="glass rounded-xl p-5 border border-border/40">
            <h3 className="font-bold mb-3">💰 Business Numbers (Kelulut)</h3>
            {[["Startup cost","RM 100–500 (1–3 colonies + basic equipment)"],["Honey price","RM 80–150 / 500ml bottle"],["Yield","1–3 kg honey per colony per year"],["Colonies to earn RM 1000/month","~20–30 colonies minimum"],["Scale-up time","12–18 months to meaningful income"]].map(([k,v]) => (
              <div key={k} className="flex justify-between text-xs border-b border-border/20 py-2"><span className="text-muted-foreground">{k}</span><span className="font-bold text-right max-w-[50%]">{v}</span></div>
            ))}
          </div>
        </>}

        {tab === "plants" && (
          <div className="space-y-3">
            <div className="glass rounded-xl p-4 border border-blue-500/20 mb-2"><p className="text-xs text-blue-300">Plant within 500m radius of hives. Kelulut forage radius is only 300–500m vs 3km for Apis mellifera. Dense plantings of bee-friendly plants near hives = more honey.</p></div>
            {PLANTS_FOR_BEES.map(p => (
              <div key={p.name} className="glass rounded-xl p-4 border border-emerald-500/20">
                <p className="font-bold text-sm mb-1">🌸 {p.name}</p>
                <p className="text-xs text-muted-foreground">{p.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
