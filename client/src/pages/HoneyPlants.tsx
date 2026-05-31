import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const PLANTS = [
  { name:"Kelengkeng / Longan", scientific:"Dimocarpus longan", emoji:"🌸", season:"Mar-May", nectar:"High", pollen:"High", bees:["Apis dorsata (giant bee)","Trigona (stingless bee)"], honey:"Prized longan honey — light colour, mild sweet flavour. Commands premium price.", grow:"Plant for commercial honey production. Sarawak highlands." },
  { name:"Rambutan", scientific:"Nephelium lappaceum", emoji:"🌸", season:"Jun-Aug", nectar:"Very High", pollen:"Moderate", bees:["Apis cerana","Apis dorsata","Trigona spp."], honey:"Excellent rambutan honey. Light amber, floral aroma. Very popular in Malaysia.", grow:"Highly recommended for beekeepers. Plant near hives or near rambutan orchards." },
  { name:"Durian", scientific:"Durio zibethinus", emoji:"🌸", season:"Apr-Jun", nectar:"Very High", pollen:"Low", bees:["Apis dorsata mainly","Some Trigona"], honey:"Durian honey — unusual pungent flavour. Rare and expensive.", grow:"Giant bees are main pollinator. Bees essential for durian production — keep hives in orchard." },
  { name:"Rubber Tree", scientific:"Hevea brasiliensis", emoji:"🌳", season:"Jan-Mar", nectar:"Moderate", pollen:"High", bees:["Apis cerana","Trigona"], honey:"Rubber honey — golden, mild. Good quantity. Common in Sarawak.", grow:"Abundant in Malaysia. Bees visiting rubber add value. Good for stingless bee keeping." },
  { name:"Coconut", scientific:"Cocos nucifera", emoji:"🥥", season:"Year-round", nectar:"Moderate", pollen:"High", bees:["Apis cerana","Trigona"], honey:"Coconut flower honey — mild, slightly coconutty. Good in coastal areas.", grow:"Year-round flowering = continuous source. Excellent for stingless bees especially." },
  { name:"Gelam / Cajuput", scientific:"Melaleuca cajuputi", emoji:"🌿", season:"Aug-Oct", nectar:"High", pollen:"High", bees:["Apis dorsata","Apis mellifera","Apis cerana"], honey:"Gelam honey is among Malaysia's most prized — medicinal, high antioxidant, dark amber.", grow:"Swampy land, coastal. Important honey source for Sarawak giant bees. Grow for premium honey." },
  { name:"Acacia", scientific:"Acacia mangium", emoji:"🌳", season:"Year-round (varies)", nectar:"High", pollen:"High", bees:["Apis mellifera","Apis cerana","Trigona"], honey:"Acacia honey — light, mild, slow to crystallize. Most popular honey type.", grow:"Fast growing plantation tree. Excellent commercial honey crop. Very common in Sarawak." },
  { name:"Sunflower", scientific:"Helianthus annuus", emoji:"🌻", season:"All year in Malaysia", nectar:"Moderate", pollen:"Very High", bees:["All species"], honey:"Good pollen source for comb building. Limited nectar.", grow:"Easy annual. Provides pollen during gaps in tree flowering." },
  { name:"Tualang", scientific:"Koompassia excelsa", emoji:"🌳", season:"Irregular", nectar:"High", pollen:"Moderate", bees:["Apis dorsata — giant honeycombs on branches"], honey:"Wild Tualang honey — most valuable Malaysian forest honey. Anti-cancer studies.", grow:"Cannot cultivate — giant forest tree. Protect existing trees. Sacred to bees." },
  { name:"Multiflora / Wildflower Mix", scientific:"Various", emoji:"🌼", season:"Year-round", nectar:"Variable", pollen:"High", bees:["All species"], honey:"Multiflora honey — complex flavour, high antioxidant, dark colour.", grow:"Plant diverse wildflower beds. Mix: Cosmos, Zinnia, Marigold, Pentas, Lantana, Ixora." },
  { name:"Sesame", scientific:"Sesamum indicum", emoji:"🌸", season:"60 days crop", nectar:"Moderate", pollen:"High", bees:["Apis cerana","Trigona","Wild bees"], honey:"Sesame honey — nutty undertone.", grow:"Easy annual cash crop. Bees increase yield 30-40%. Win-win for farmers and beekeepers." },
  { name:"Pineapple", scientific:"Ananas comosus", emoji:"🍍", season:"Variable", nectar:"Low", pollen:"Moderate", bees:["Trigona mainly"], honey:"Rarely used for honey. Bees visiting don't produce distinct pineapple honey.", grow:"Stingless bees are excellent pollinators that increase pineapple yield." },
];

const BEE_TYPES = [
  { name:"Trigona (Stingless Bee)", malay:"Kelulut", emoji:"🐝", honey:"Liquid honey with unique sour-sweet taste. High medicinal value. Sold RM 80-200/bottle.", keep:"Easy to keep in log hive or box. No sting — safe for children.", income:"1 hive: 500ml-2L honey per year. Sustainable income at home scale.", start:"Buy starter colony RM 100-300. Box hive setup RM 50-100. Total RM 200-400 to start." },
  { name:"Apis cerana (Asian Honey Bee)", malay:"Lebah Asia", emoji:"🐝", honey:"Conventional honey. Good quality. Less than European bee.", keep:"Medium difficulty. Can sting but mild. Traditional log hives common in Sarawak.", income:"1-5kg honey per hive per year. Good for small farm.", start:"Need proper equipment. Join beekeeping course at MARA or Sarawak Agriculture." },
  { name:"Apis dorsata (Giant Bee)", malay:"Lebah tualang / Lebah hutan", emoji:"🐝", honey:"Wild forest honey — highest value. Cannot be domesticated.", keep:"Cannot be kept — wild only. Harvest from trees is traditional practice.", income:"Traditional honey hunters. Dangerous but premium price RM 60-150/bottle.", start:"Not applicable — observe in nature, support forest conservation." },
];

export default function HoneyPlants() {
  const [tab, setTab] = useState<"plants"|"bees"|"start">("plants");
  const [selected, setSelected] = useState(PLANTS[0]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🍯</span>
          <div><h1 className="text-xl font-bold">Honey Plants Guide</h1><p className="text-xs text-muted-foreground">Best plants for bees — Malaysia beekeeping</p></div>
        </div>
        <div className="container pb-3 flex gap-2">
          {[["plants","🌸 Plants"],["bees","🐝 Bee Types"],["start","🏁 Start Beekeeping"]].map(([v,l]) => (
            <button type="button" key={v} onClick={() => setTab(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${tab === v ? "bg-amber-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        {tab === "plants" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
              {PLANTS.map(p => (
                <button type="button" key={p.name} onClick={() => setSelected(p)}
                  className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.name === p.name ? "border-amber-500/60 bg-amber-500/5" : "border-border/40 hover:border-amber-500/30"}`}>
                  <span className="text-xl">{p.emoji}</span>
                  <div><p className="font-semibold text-sm">{p.name}</p><p className="text-xs text-muted-foreground">{p.season}</p></div>
                </button>
              ))}
            </div>
            <div className="lg:col-span-2">
              <div className="glass rounded-xl p-5 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-3"><span className="text-3xl">{selected.emoji}</span><div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-xs italic text-muted-foreground">{selected.scientific}</p></div></div>
                <div className="grid grid-cols-3 gap-2">
                  {[["🌸 Season", selected.season],["🍯 Nectar", selected.nectar],["🌼 Pollen", selected.pollen]].map(([l,v]) => (
                    <div key={String(l)} className="glass rounded-lg p-2 text-center border border-border/40"><p className="text-xs text-muted-foreground">{l}</p><p className="font-bold text-sm">{v}</p></div>
                  ))}
                </div>
                <div className="glass rounded-lg p-3 border border-amber-500/20"><p className="text-xs font-bold text-amber-400 mb-1">🐝 Bees attracted</p><p className="text-sm">{selected.bees.join(", ")}</p></div>
                <div className="glass rounded-lg p-3 border border-border/40"><p className="text-xs font-bold text-muted-foreground mb-1">🍯 Honey type</p><p className="text-sm">{selected.honey}</p></div>
                <div className="glass rounded-lg p-3 border border-blue-500/20"><p className="text-xs text-blue-300">💡 {selected.grow}</p></div>
              </div>
            </div>
          </div>
        )}
        {tab === "bees" && (
          <div className="space-y-4">
            {BEE_TYPES.map(b => (
              <div key={b.name} className="glass rounded-xl p-5 border border-amber-500/20">
                <div className="flex items-center gap-3 mb-3"><span className="text-3xl">{b.emoji}</span><div><h3 className="font-bold">{b.name}</h3><p className="text-sm text-muted-foreground">{b.malay}</p></div></div>
                <div className="grid grid-cols-2 gap-3">
                  {[["🍯 Honey", b.honey],["🏠 How to keep", b.keep],["💰 Income", b.income],["🚀 Getting started", b.start]].map(([l,v]) => (
                    <div key={String(l)} className="glass rounded-lg p-3 border border-border/40"><p className="text-xs font-bold text-amber-400 mb-1">{l}</p><p className="text-xs text-muted-foreground">{v}</p></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === "start" && (
          <div className="space-y-4">
            <div className="glass rounded-xl p-5 border border-amber-500/30">
              <h3 className="font-bold mb-4">Start Stingless Beekeeping (Kelulut) — Easiest for Beginners</h3>
              {[{n:1,title:"Get equipment",detail:"Log hive or wooden box hive (RM 50-100). Harvesting tools: syringe or squeeze bottle. Observation window optional."},{n:2,title:"Buy starter colony",detail:"Source from: Sarawak Agriculture Dept, local beekeepers, Facebook groups 'Kelulut Sarawak'. RM 100-300 for established colony."},{n:3,title:"Place hive correctly",detail:"Shade location — avoid direct afternoon sun. Elevate on stand 50-100cm from ground. Away from spray drift."},{n:4,title:"Plant bee plants",detail:"Coconut, Rambutan, Longan nearby ideal. Wildflowers: Pentas, Cosmos, Asystasia, Chromolaena as close as possible."},{n:5,title:"Harvest honey",detail:"Harvest every 3-6 months. Open honey pot with syringe carefully. Leave 30% for bees. 500ml-2L per year per hive."},{n:6,title:"Sell your honey",detail:"Price: RM 80-200 per 250ml bottle. Sell at: farmers market, Facebook, direct. Certificate adds value."}].map(s => (
                <div key={s.n} className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0">{s.n}</div>
                  <div><p className="font-semibold text-sm">{s.title}</p><p className="text-xs text-muted-foreground">{s.detail}</p></div>
                </div>
              ))}
            </div>
            <div className="glass rounded-xl p-5 border border-border/50">
              <h3 className="font-bold mb-3">Resources in Sarawak</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• <span className="text-white">Sarawak Agriculture Dept</span> — free training courses</p>
                <p>• <span className="text-white">MARA Sarawak</span> — loan scheme for beekeeping equipment</p>
                <p>• <span className="text-white">Sarawak Beekeepers Association</span> — community support</p>
                <p>• <span className="text-white">FAMA</span> — marketing support for honey products</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
