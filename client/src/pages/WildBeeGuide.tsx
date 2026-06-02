import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const BEES = [
  { name:"Giant Honey Bee", scientific:"Apis dorsata", malay:"Lebah hutan / Lebah tualang", emoji:"🐝", honey:"High — 10-30kg per comb", nest:"Exposed combs on Tualang tree (tallest tree) 20-50m high. Single large open comb.", sting:"Very defensive. Mass stinging = dangerous. Deaths recorded.", status:"Wild only — cannot be hived", note:"Beeswax from dorsata is finest quality. Honey harvesting by Iban/Kenyah communities using traditional ladder methods at night. Stingless bee farmers don't compete." },
  { name:"Asian Honey Bee", scientific:"Apis cerana", malay:"Lebah Melifera Asia", emoji:"🐝", honey:"5-25kg per colony", nest:"Tree cavities, wall gaps, beehive boxes. Small enclosed comb.", sting:"Defensive but much milder than dorsata. Manageable.", status:"Commercial beekeeping possible", note:"Can be kept in modified Langstroth hives. Very common in Sarawak. Varroa mite problem. Local beeswax products." },
  { name:"Kelulut / Stingless Bee (Meliponine)", scientific:"Trigona/Geniotrigona spp.", malay:"Kelulut / Lebah kelulut", emoji:"🐝", honey:"0.5-3kg per year", nest:"Small hole in tree or wood. Elaborate entrance tube of wax/resin.", sting:"No sting — bite only (harmless)", status:"Malaysia's fastest growing beekeeping industry", note:"Kelulut honey (tualang madu) fetches RM 80-200+/kg. High antimicrobial properties. Supports with small-scale farmers. Sarawak govt actively promoting kelulut." },
  { name:"Kelulut Itam", scientific:"Heterotrigona itama", malay:"Kelulut itam", emoji:"🐝", honey:"1-4kg per year — excellent flavour", nest:"Tree cavities, boxes. Most commonly farmed species.", sting:"No sting", status:"Top farmed species in Malaysia", note:"Sweet-sour taste. High in phenolic content. Nest in standard kelulut boxes (30x15x10cm). Very easy to farm for beginners." },
  { name:"Lebah Tujuh (Seven Bee)", scientific:"Apis andreniformis", malay:"Lebah tujuh / Lebah kecil", emoji:"🐝", honey:"Minimal — not commercial", nest:"Small single open comb in bush/shrub 1-5m high", sting:"Mildly defensive. Small bee.", status:"Wild only", note:"Smallest Apis species in Malaysia. Beautiful metallic-banded abdomen. Important pollinator for understorey plants." },
  { name:"Carpenter Bee", scientific:"Xylocopa latipes", malay:"Lebah tukang kayu", emoji:"🐝", honey:"None commercial", nest:"Bores circular tunnels in wood (logs, bamboo, timber)", sting:"Females can sting but rarely do. Very docile.", status:"Wild only", note:"Large metallic purple-black bee. Major pollinator for passion fruit and many tropical crops. Looks scary but extremely gentle. Important to protect." },
  { name:"Orchid Bee", scientific:"Eulaema/Eufriesea spp.", malay:"NA (rare exotic species)", emoji:"🐝", honey:"None", nest:"Small nests in soil or cavities", sting:"Very docile", status:"Wild pollinator only", note:"Males collect orchid fragrance compounds for mating displays. Rare but stunning metallic green/blue coloring. Found in primary forest Sarawak." },
];

const KELULUT_FARMING = [
  { step:1, title:"Get your colony", desc:"Source from certified kelulut farmers or Jabatan Pertanian Sarawak. Cost: RM 150-400 per colony. Never take from wild — protect natural populations." },
  { step:2, title:"Set up box", desc:"Standard kelulut box 30x15x10cm with 10-12mm entrance hole. Smooth wood, no gaps (ants will invade)." },
  { step:3, title:"Location", desc:"1-1.5m off ground. Partial shade — not full sun (overheats honey). Near flowering plants within 300m radius." },
  { step:4, title:"Pest management", desc:"Biggest threat: Phorid fly (parasites), weaver ants (raid honey pots), gecko (eats bees at night). Petroleum jelly on pole legs repels ants." },
  { step:5, title:"Expanding colony", desc:"After 3-6 months established: split colony. Cut brood chamber in half, add bees from original. New colony needs queen cell." },
  { step:6, title:"Harvest honey", desc:"Harvest every 4-6 months. Use syringe to extract from propolis pots. Never take brood section. Leave 30% honey for bees." },
];

export default function WildBeeGuide() {
  const [selected, setSelected] = useState(BEES[0]);
  const [tab, setTab] = useState<"bees"|"kelulut"|"plants">("bees");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🐝</span>
          <div><h1 className="text-xl font-bold">Wild Bee Guide</h1><p className="text-xs text-muted-foreground">Bees of Malaysia — ID, honey, kelulut farming</p></div>
        </div>
        <div className="container pb-3 flex gap-2">
          {[["bees","🐝 Species"],["kelulut","🍯 Kelulut Farm"],["plants","🌸 Plants for Bees"]].map(([v,l]) => (
            <button type="button" key={v} onClick={() => setTab(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${tab === v ? "bg-amber-400 text-black" : "glass border border-border/50 text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        {tab === "bees" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
              {BEES.map(b => (
                <button type="button" key={b.scientific} onClick={() => setSelected(b)} className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-2 ${selected.scientific === b.scientific ? "border-amber-400/60 bg-amber-400/5" : "border-border/40 hover:border-amber-400/30"}`}>
                  <span className="text-lg">{b.emoji}</span>
                  <div><p className="font-semibold text-sm">{b.name}</p><p className="text-xs text-muted-foreground">{b.malay}</p></div>
                </button>
              ))}
            </div>
            <div className="lg:col-span-2 glass rounded-xl p-5 border border-amber-400/30 space-y-3">
              <div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-xs italic text-muted-foreground">{selected.scientific}</p><p className="text-xs text-amber-400 mt-1">{selected.malay}</p></div>
              {[["🍯 Honey Yield",selected.honey,"border-amber-400/20"],["🏠 Nest Type",selected.nest,"border-border/40"],["⚠️ Sting Risk",selected.sting,"border-red-500/20"],["📋 Status",selected.status,"border-green-500/20"]].map(([l,v,b]) => (
                <div key={String(l)} className={`glass rounded-lg p-3 border ${b}`}><p className="text-xs font-bold text-muted-foreground mb-1">{l}</p><p className="text-sm">{v}</p></div>
              ))}
              <div className="glass rounded-lg p-3 border border-blue-500/20"><p className="text-xs text-blue-300">💡 {selected.note}</p></div>
            </div>
          </div>
        )}
        {tab === "kelulut" && <>
          <div className="glass rounded-xl p-4 border border-amber-400/20 mb-4">
            <h3 className="font-bold mb-1">Kelulut Honey — Malaysia's Superfood Industry</h3>
            <p className="text-xs text-muted-foreground">Kelulut honey (stingless bee honey) fetches RM 80-200+/kg retail vs RM 15-20/kg for regular honey. Low capital investment. Growing market. Sarawak government subsidies available.</p>
          </div>
          <div className="space-y-3">
            {KELULUT_FARMING.map(s => (
              <div key={s.step} className="glass rounded-xl p-4 border border-border/40 flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0">{s.step}</div>
                <div><p className="font-semibold text-sm mb-1">{s.title}</p><p className="text-xs text-muted-foreground">{s.desc}</p></div>
              </div>
            ))}
          </div>
          <div className="glass rounded-xl p-4 border border-green-500/20 mt-4"><p className="text-xs text-green-300">📞 Resources: Jabatan Pertanian Sarawak: 082-441991. Kelulut Malaysia Facebook group. Sarawak Kelulut Beekeeping Association. Grant info: TERAS (Sarawak agro-entrepreneur program).</p></div>
        </>}
        {tab === "plants" && (
          <div className="space-y-2">
            {[["Coconut Palm","Cocos nucifera","Pollen + nectar year-round. Most important bee plant in Malaysia.","🌴"],["Banana","Musa spp.","Enormous pollen source. All bee species attracted.","🍌"],["Rambutan","Nephelium lappaceum","Produces excellent honey. Seasonal — June-August.","🔴"],["Gelam (Paperbark)","Melaleuca cajuputi","Tualang madu/Gelam honey from this tree. Very popular with Apis dorsata.","🌿"],["Durian","Durio zibethinus","Night-blooming — bats pollinate, but bees take nectar next morning.","🟡"],["Tongkat Ali","Eurycoma longifolia","Forest medicinal plant. Important bee forage in logged areas.","🌿"],["Kelapa Sawit (Oil Palm)","Elaeis guineensis","Despite monoculture concerns, oil palm pollen is major food source for kelulut bees in Sarawak.","🌴"],["Touch-Me-Not (Mimosa)","Mimosa pudica","Common roadside weed. Excellent early morning nectar for small bees.","🌸"],["Sunflower","Helianthus annuus","Best ornamental for bees. Very high pollen. Easy to grow.","🌻"],["Pokok Serai (Lemongrass)","Cymbopogon citratus","Bees love the flowers. Also repels some predatory insects.","🌿"]].map(([name,sci,note,emoji]) => (
              <div key={String(name)} className="glass rounded-xl p-3 border border-border/40 flex items-center gap-3">
                <span className="text-2xl">{emoji}</span>
                <div className="flex-1"><p className="font-semibold text-sm">{name}</p><p className="text-[10px] text-muted-foreground italic">{sci}</p><p className="text-xs text-amber-300 mt-0.5">{note}</p></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
