import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const PLANTS = [
  { name:"Lemongrass", malay:"Serai", emoji:"🌾", repels:"Mosquitoes, flies, ants", how:"Plant around patio. Crush stem to release citronella oil. Burn dry stalks as incense.", diy:"Blend 10 stems with 500ml water, strain, spray around area. Add few drops dish soap.", effectiveness:"★★★★★", note:"Contains citronella — same active ingredient as commercial repellent. Most effective in Malaysia." },
  { name:"Pandan", malay:"Pandan", emoji:"🌿", repels:"Cockroaches, rats, insects", how:"Place fresh leaves in corners, cupboards, car. Hang dried leaves near doors.", diy:"Tie several leaves in knot, place in problem areas. Replace weekly.", effectiveness:"★★★★☆", note:"Proven to repel cockroaches in studies. Completely safe — can be eaten!" },
  { name:"Basil", malay:"Selasih", emoji:"🌿", repels:"Mosquitoes, flies, aphids, spider mites", how:"Plant near doors/windows. Crush leaves to release scent. Keep fresh plant on table.", diy:"Steep in olive oil overnight for topical repellent oil. Spray leaves in water.", effectiveness:"★★★☆☆", note:"Fresh plant more effective than dried. Limonene and eugenol are active repellents." },
  { name:"Citronella Grass", malay:"Serai wangi", emoji:"🌾", repels:"Mosquitoes primarily", how:"Plant in garden. Burn leaves as incense. Extract oil for skin application.", diy:"Commercial citronella oil available. Dilute 1:10 in coconut oil for skin use.", effectiveness:"★★★★☆", note:"Different from lemongrass — higher citronella concentration. Harder to find but more potent." },
  { name:"Marigold", malay:"Kenikir besar", emoji:"🌼", repels:"Mosquitoes, aphids, whitefly, nematodes (roots)", how:"Plant as border around vegetable garden. Place pots near entrance.", diy:"Boil flowers in water, strain, spray on plants for aphid control.", effectiveness:"★★★☆☆", note:"Pyrethrin in flowers repels insects. Used as companion plant worldwide. Roots kill nematodes." },
  { name:"Mint", malay:"Pudina", emoji:"🌿", repels:"Mosquitoes, ants, aphids, mice", how:"Plant in pots near doors. Crush leaves. Spray leaf extract in problem areas.", diy:"Boil handful leaves in 1 litre water, strain, use as spray around ants trails.", effectiveness:"★★★☆☆", note:"Menthol vapour repels many insects. Grow in pot — very invasive in ground." },
  { name:"Neem Tree", malay:"Mambu / Pokok Neem", emoji:"🌳", repels:"Most insects, mosquito larvae (in water)", how:"Neem oil spray on plants. Place leaves around grain storage.", diy:"Blend fresh leaves with water, add soap, strain. Spray as insecticide.", effectiveness:"★★★★☆", note:"Azadirachtin disrupts insect hormone system. Approved organic pesticide. Safe for humans." },
  { name:"Lavender", malay:"Lavender", emoji:"🌸", repels:"Mosquitoes, moths, fleas, flies", how:"Plant in sunny pot near window. Hang dried bunches indoors. Apply oil to skin.", diy:"Steep fresh flowers in vodka or witch hazel 2 weeks for spray.", effectiveness:"★★★☆☆", note:"Better in Malaysia highlands (Cameron Highlands). Struggles in lowland heat. Use oil as alternative." },
  { name:"Rosemary", malay:"Rosemeri", emoji:"🌿", repels:"Mosquitoes, flies, garden pests", how:"Plant near vegetables. Burn stems on BBQ — smoke repels mosquitoes.", diy:"Simmer in water, strain, spray on skin or plants.", effectiveness:"★★★☆☆", note:"Grows best in Cameron Highlands in Malaysia. Strong resinous scent is the active repellent." },
  { name:"Curry Leaf Tree", malay:"Daun kari", emoji:"🌿", repels:"Mosquitoes, certain beetles", how:"Plant in garden. Burn dried leaves. Keep tree near outdoor dining area.", diy:"Blend leaves with water for garden spray.", effectiveness:"★★☆☆☆", note:"Traditional use in South Indian communities. More for companion planting than direct repellent." },
  { name:"Catnip", malay:"Catnip", emoji:"🌿", repels:"Mosquitoes (nepetalactone is 10× more effective than DEET in lab!)", how:"Plant near patio. Rub crushed leaves on skin.", diy:"Steep in boiling water, strain, spray as repellent.", effectiveness:"★★★★☆", note:"Lab studies show nepetalactone more effective than DEET but doesn't last as long. Hard to find in Malaysia." },
  { name:"Garlic", malay:"Bawang putih", emoji:"🧄", repels:"Mosquitoes, aphids, Japanese beetles, deer, rabbits", how:"Plant among vegetables. Spray garlic extract on plants. Eat garlic to repel mosquitoes from skin.", diy:"Blend 10 cloves in 1 litre water, steep 24 hours, strain, spray on plants.", effectiveness:"★★★★☆", note:"Allicin repels insects. Traditional garden companion. Eating garlic makes your sweat repel mosquitoes." },
];

const DEET_COMPARISON = [
  { product:"DEET 20% (commercial)", effective:"6-8 hours", safe:"Moderate — some side effects", rating:5 },
  { product:"Citronella oil", effective:"2-3 hours", safe:"Very safe, gentle", rating:4 },
  { product:"Lemongrass spray (DIY)", effective:"1-2 hours", safe:"Completely safe", rating:3 },
  { product:"Catnip oil", effective:"1-2 hours", safe:"Very safe", rating:4 },
  { product:"Neem oil (diluted)", effective:"2-4 hours", safe:"Safe when diluted", rating:4 },
  { product:"Basil oil", effective:"30-60 min", safe:"Very safe", rating:2 },
];

export default function InsectRepellent() {
  const [selected, setSelected] = useState(PLANTS[0]);
  const [tab, setTab] = useState<"plants"|"compare"|"mosquito">("plants");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🦟</span>
          <div><h1 className="text-xl font-bold">Natural Insect Repellent</h1><p className="text-xs text-muted-foreground">Plants that repel mosquitoes & pests — Malaysia</p></div>
        </div>
        <div className="container pb-3 flex gap-2">
          {[["plants","Plants"],["compare","vs DEET"],["mosquito","Dengue Tips"]].map(([v,l]) => (
            <button type="button" key={v} onClick={() => setTab(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${tab === v ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        {tab === "plants" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
              {PLANTS.map(p => (
                <button type="button" key={p.name} onClick={() => setSelected(p)}
                  className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.name === p.name ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/40 hover:border-emerald-500/30"}`}>
                  <span className="text-xl">{p.emoji}</span>
                  <div className="flex-1 min-w-0"><p className="font-semibold text-sm">{p.name}</p><p className="text-xs text-muted-foreground truncate">{p.repels}</p></div>
                  <span className="text-xs">{p.effectiveness}</span>
                </button>
              ))}
            </div>
            <div className="lg:col-span-2">
              <div className="glass rounded-xl p-5 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-3"><span className="text-3xl">{selected.emoji}</span><div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-xs text-muted-foreground">{selected.malay}</p></div><span className="ml-auto text-xl">{selected.effectiveness}</span></div>
                {[["🦟 Repels", selected.repels,"border-red-500/20"],["🌿 How to Use", selected.how,"border-border/40"],["🧪 DIY Recipe", selected.diy,"border-blue-500/20"]].map(([l,v,b]) => (
                  <div key={String(l)} className={`glass rounded-lg p-3 border ${b}`}><p className="text-xs font-bold text-muted-foreground mb-1">{l}</p><p className="text-sm">{v}</p></div>
                ))}
                <div className="glass rounded-lg p-3 border border-amber-500/20"><p className="text-xs text-amber-300">💡 {selected.note}</p></div>
              </div>
            </div>
          </div>
        )}
        {tab === "compare" && (
          <div className="space-y-3">
            {DEET_COMPARISON.map(c => (
              <div key={c.product} className="glass rounded-xl p-4 border border-border/50">
                <div className="flex justify-between items-center mb-2"><p className="font-bold text-sm">{c.product}</p><div className="flex">{Array.from({length:5}).map((_,i) => <span key={i} className={i < c.rating ? "text-emerald-400" : "text-border"}>★</span>)}</div></div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <p>⏱️ Effective: <span className="text-white">{c.effective}</span></p>
                  <p>🛡️ Safety: <span className="text-white">{c.safe}</span></p>
                </div>
              </div>
            ))}
            <div className="glass rounded-xl p-4 border border-blue-500/20"><p className="text-sm text-blue-300">💡 Best strategy: Use plant-based repellents for low-risk situations. Use DEET for high-risk outdoor work, night activities, or dengue outbreak areas.</p></div>
          </div>
        )}
        {tab === "mosquito" && (
          <div className="space-y-4">
            <div className="glass rounded-xl p-5 border border-red-500/30">
              <h3 className="font-bold mb-3 text-red-400">🦟 Dengue Prevention — Malaysia Priority</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["Remove ALL standing water weekly — tyres, flower pots, drains, clogged gutters","Change water in flower vases every 3 days","Keep drains and gutters clear of debris","Cover water storage tanks completely","Plant Lemongrass or Citronella around house perimeter","Use mosquito net when sleeping in areas without screening","Wear long sleeves during peak mosquito hours (dawn and dusk)","Report clogged drains to local council — Aedes breed in any water","Check for Aedes: small black mosquito with white stripes on legs","If fever 3+ days: go to clinic for dengue test immediately"].map(t => <li key={t} className="flex gap-2"><span className="text-red-400 flex-shrink-0">•</span>{t}</li>)}
              </ul>
            </div>
            <div className="glass rounded-xl p-5 border border-emerald-500/20">
              <h3 className="font-bold mb-3">🌿 Plant-Based Mosquito Defence</h3>
              <div className="grid grid-cols-2 gap-3">
                {[["Plant near house","Lemongrass, Citronella, Marigold, Catnip"],["Burn as repellent","Lemongrass stalks, Neem leaves, Rosemary"],["On skin","Citronella oil, Neem oil, Lemon eucalyptus"],["In bedroom","Pandan leaves, Lavender dried bunches"]].map(([l,v]) => (
                  <div key={l} className="glass rounded-lg p-3 border border-border/40"><p className="text-xs font-bold text-emerald-400 mb-1">{l}</p><p className="text-xs text-muted-foreground">{v}</p></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
