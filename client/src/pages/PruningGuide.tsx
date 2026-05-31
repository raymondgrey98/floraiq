import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const PLANTS = [
  { name:"Chili",emoji:"🌶️",when:"After first harvest and monthly during production",how:"Cut back by 1/3 to encourage branching. Remove dead/diseased branches. Prune after fruiting season for regrowth.",tools:"Clean scissors",tip:"Hard prune after main season ends — leave 4 main stems. Regrows vigorously in Malaysia." },
  { name:"Tomato",emoji:"🍅",when:"Weekly — remove suckers (side shoots in V of main stem and branch)",how:"Pinch out suckers when small with clean fingers. Keep to 1-2 main stems on trellis. Remove yellowing leaves.",tools:"Fingers or scissors",tip:"More suckers = bushier but fewer large fruit. Fewer suckers = fewer but bigger fruit. Remove bottom leaves to improve airflow." },
  { name:"Banana",emoji:"🍌",when:"After harvesting bunch + remove dead leaves anytime",how:"Cut bunch stalk back to main stem. Remove dead dry leaves. Keep only 1 sucker (daughter plant) for next season.",tools:"Parang / machete",tip:"Remove excess suckers or you get weak thin bunches. Keep the strongest sword sucker for next crop." },
  { name:"Papaya",emoji:"🍈",when:"Remove dead leaves monthly. Rarely hard prune.",how:"Remove yellowing lower leaves regularly. Expose trunk for airflow. Don't cut the top — kills the tree.",tools:"Knife or scissors",tip:"Papaya can't be topped. If too tall, start new plant from seed. Keeps fruiting from same point on stem." },
  { name:"Rambutan",emoji:"🍒",when:"After harvest (Oct-Jan Sarawak)",how:"Remove dead/crossing branches. Open up canopy for light and airflow. Don't remove more than 30% at once.",tools:"Loppers, pruning saw",tip:"Open centre pruning works best. Stimulates new growth where next season's fruit will form." },
  { name:"Durian",emoji:"🌳",when:"After fruiting season (July-Sept Sarawak)",how:"Remove weak and crossing branches. Reduce height if needed. Open canopy for light. Burn prunings (disease control).",tools:"Saw, loppers",tip:"Young durian trees: shape first 3 years with a clear central leader and 3-5 scaffold branches." },
  { name:"Orchid",emoji:"🌸",when:"After flowering (cut spike). Dead leaves anytime.",how:"Cut flower spike 2cm above base after last flower drops. Remove dead/yellowing leaves. Repot every 2 years.",tools:"Sterile scissors or knife",tip:"Sterilise tools between plants — orchid viruses spread on tools. Use 70% alcohol or flame." },
  { name:"Hibiscus (Bunga Raya)",emoji:"🌺",when:"Every 2-3 months / after flowering flush",how:"Cut back by 1/3 to 1/2. Remove crossing branches. Encourages new growth where flowers form.",tools:"Scissors or loppers",tip:"Hard prune once a year in Malaysia — revitalises plant. Flowers form on new growth." },
  { name:"Curry Leaf Tree",emoji:"🌿",when:"Monthly light prune. Hard prune yearly.",how:"Harvest regularly — cut branch tips for cooking. This IS the pruning. Hard prune once a year to 30cm height.",tools:"Scissors",tip:"The more you harvest for cooking, the busher and healthier it gets. Don't let it get leggy." },
  { name:"Lime Tree (Limau)",emoji:"🍋",when:"After harvest (light prune). Hard prune every 2-3 years.",how:"Remove dead/crossing branches. Thin overcrowded canopy. Never remove more than 25% at once.",tools:"Loppers",tip:"Citrus bleeds sap when pruned. Avoid pruning in wet season — disease risk. Apply wound paste on large cuts." },
  { name:"Mango",emoji:"🥭",when:"After harvest (usually Aug-Oct in Peninsular Malaysia)",how:"Open up canopy. Remove dead wood. Tip prune young trees to encourage branching. Keep at manageable height.",tools:"Loppers, saw",tip:"Mango fruits on new growth. Tip pruning after harvest stimulates flowering flush. Don't over-prune." },
  { name:"Lemongrass",emoji:"🌾",when:"Every 3-6 months when clump becomes too large",how:"Cut entire clump to 15cm from ground. Divide outer stems for propagation. Remove dead dry stems.",tools:"Parang or strong scissors",tip:"Lemongrass regrows vigorously in Malaysia. Hard prune stimulates fresh aromatic new growth." },
];

const TOOLS = [
  { tool:"Hand Pruners/Scissors", use:"Small stems under 1cm", price:"RM 15-40", tip:"Must be sharp — blunt tools crush stems causing disease entry" },
  { tool:"Loppers", use:"Branches 1-5cm", price:"RM 40-100", tip:"Long handles for leverage. Bypass loppers better than anvil type" },
  { tool:"Pruning Saw", use:"Branches over 5cm", price:"RM 30-80", tip:"Curved Japanese saw cuts on pull stroke — easier and safer" },
  { tool:"Parang/Machete", use:"Banana, large stalks, clearing", price:"RM 25-60", tip:"Keep sharp. Essential tool for Malaysian garden work" },
  { tool:"Pole Pruner", use:"High branches without ladder", price:"RM 80-200", tip:"Extends to 3-5m. Good for tall durian/rambutan management" },
];

export default function PruningGuide() {
  const [selected, setSelected] = useState(PLANTS[0]);
  const [tab, setTab] = useState<"plants"|"tools"|"basics">("plants");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">✂️</span>
          <div><h1 className="text-xl font-bold">Pruning Guide</h1><p className="text-xs text-muted-foreground">When and how to prune — Malaysia climate</p></div>
        </div>
        <div className="container pb-3 flex gap-2">
          {[["plants","🌱 Plants"],["tools","🔧 Tools"],["basics","📚 Basics"]].map(([v,l]) => (
            <button type="button" key={v} onClick={() => setTab(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${tab === v ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        {tab === "plants" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
              {PLANTS.map(p => (
                <button type="button" key={p.name} onClick={() => setSelected(p)} className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.name === p.name ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/40 hover:border-emerald-500/30"}`}>
                  <span className="text-xl">{p.emoji}</span>
                  <p className="font-semibold text-sm">{p.name}</p>
                </button>
              ))}
            </div>
            <div className="lg:col-span-2">
              <div className="glass rounded-xl p-5 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-3"><span className="text-3xl">{selected.emoji}</span><h2 className="text-xl font-bold">{selected.name}</h2></div>
                {[["📅 When to prune", selected.when],["✂️ How to prune", selected.how],["🔧 Tools needed", selected.tools]].map(([l,v]) => (
                  <div key={String(l)} className="glass rounded-lg p-3 border border-border/40"><p className="text-xs font-bold text-emerald-400 mb-1">{l}</p><p className="text-sm text-muted-foreground">{v}</p></div>
                ))}
                <div className="glass rounded-lg p-3 border border-blue-500/20"><p className="text-xs text-blue-300">💡 Malaysia tip: {selected.tip}</p></div>
              </div>
            </div>
          </div>
        )}
        {tab === "tools" && (
          <div className="space-y-3">
            {TOOLS.map(t => (
              <div key={t.tool} className="glass rounded-xl p-5 border border-border/50">
                <div className="flex justify-between items-start mb-2"><p className="font-bold">{t.tool}</p><span className="text-emerald-400 font-bold text-sm">{t.price}</span></div>
                <p className="text-sm text-muted-foreground">{t.use}</p>
                <p className="text-xs text-blue-300 mt-1">💡 {t.tip}</p>
              </div>
            ))}
          </div>
        )}
        {tab === "basics" && (
          <div className="space-y-4">
            {[["When to NEVER prune",["Never prune in heavy rain season — disease risk","Don't prune when plant is stressed (drought, pest attack)","Avoid pruning fruiting trees during flowering — reduces yield","Never prune more than 30% at once"],"border-red-500/30"],["Golden pruning rules",["Always cut at 45° angle away from bud","Cut just above outward-facing bud","Sterilise tools between plants (70% alcohol)","Make clean cuts — don't leave stubs","Apply wound paste on cuts larger than 2cm diameter"],"border-emerald-500/30"],["Malaysia-specific tips",["Prune after rainy season not during — reduces fungal infection","Dry season (Feb-Mar, Jun-Jul) is best pruning time","Always remove pruned material from garden — burns or composts","Check for pests in pruned wounds — treat immediately","After pruning, fertilise lightly to support regrowth"],"border-blue-500/30"]].map(([title, items, border]) => (
              <div key={String(title)} className={`glass rounded-xl p-5 border ${border}`}>
                <h3 className="font-bold mb-3">{String(title)}</h3>
                <ul className="space-y-1.5">{(items as string[]).map(i => <li key={i} className="flex gap-2 text-sm text-muted-foreground"><span className="text-emerald-400">•</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
