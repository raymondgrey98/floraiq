import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const SHELTERS = [
  {
    id:"lean-to", name:"Lean-To Shelter", emoji:"🏕️", time:"1-2 hours", difficulty:"Easy",
    materials:["Bamboo poles or straight branches (3-4m)", "Large banana/palm leaves (20-30)", "Rattan or split rattan for lashing", "Bamboo stakes for ground anchoring"],
    steps:["Find two trees 3m apart. Lash a horizontal ridgepole between them at chest height.","Lean angled rafters from ridgepole to ground (60° angle) every 30-40cm.","Start layering leaves from bottom up (like roof tiles) — overlap 50%.","Add more layers until rain runs off without dripping through.","Optional: build low walls on sides from weaved leaves or bamboo."],
    pros:["Fastest to build","Good airflow in Malaysia's heat","Stops rain well if layered correctly"],
    cons:["Open on one side — limited wind protection","Cold at night in highland areas"],
    tip:"In Sarawak, Nipah palm leaves make the best waterproof roof. One leaf can cover 1m². Use 3 layers minimum."
  },
  {
    id:"a-frame", name:"A-Frame (Bivouac)", emoji:"⛺", time:"2-3 hours", difficulty:"Medium",
    materials:["One long ridgepole (5m)", "12-15 angled poles", "Banana/Nipah leaves (40-50)", "Cordage — rattan or jungle vine", "Stakes"],
    steps:["Plant two forked sticks in ground 3m apart. Lay ridgepole across fork.","Lean poles on both sides at 45° to form the A shape.","Lash cross-pieces as ribs every 40cm along the frame.","Layer leaves tightly both sides from bottom up.","Seal ridge with extra leaves or folded palm frond."],
    pros:["Fully enclosed — rain protection all sides","Good for 2 people","Stable structure"],
    cons:["Takes more time","Uses more materials","Low headroom inside"],
    tip:"Make it just big enough to lie in — don't build a mansion. Smaller = easier to heat with body warmth and less rain penetrates."
  },
  {
    id:"tree-base", name:"Tree Base Platform", emoji:"🌲", time:"30 min", difficulty:"Easy",
    materials:["Large buttress roots (natural walls)", "Fallen logs or branches", "Leaves for bedding", "Tarpaulin if available"],
    steps:["Find a large Mengaris (Koompassia excelsa) or fig tree with buttress roots.","The spaces between roots form natural walls — amazing windbreaks.","Clear the ground inside, lay branches as a raised floor (off damp ground).","Lean poles across the top of buttress roots, cover with leaves for roof.","Line floor with dry leaves for insulation from cold ground."],
    pros:["Minimal building","Natural protection","Off-ground from insects and snakes","Very fast in emergency"],
    cons:["Depends on finding right tree","May be taken by wildlife","Not weatherproof without leaf roof"],
    tip:"Buttress root trees are found in lowland dipterocarp forest all over Sarawak. The Mengarris is Malaysia's tallest tree — buttresses often 3m high."
  },
  {
    id:"bamboo-platform", name:"Elevated Bamboo Platform", emoji:"🪵", time:"4-6 hours", difficulty:"Hard",
    materials:["Large bamboo poles (12-15, 3-4m long)", "Rattan for lashing", "Smaller bamboo for floor slats", "Forked posts for support"],
    steps:["Cut 4 forked posts, plant 50-60cm deep in pairs 2m apart.","Lay two main beams across the forks.","Lash cross-beams between the two main beams every 50cm.","Split bamboo half-sections for floor — lay flat side up.","Build lean-to roof from the posts upward."],
    pros:["Off ground — dry and away from snakes, leeches, flooding","Good for extended jungle stays","Most comfortable jungle sleep"],
    cons:["Takes hours to build","Requires bamboo nearby","Hard without proper cutting tools"],
    tip:"Sarawak's giant bamboo (Dendrocalamus giganteus) can be 30cm diameter — one section is a massive build material. Near rivers everywhere."
  },
];

const CORDAGE = [
  { plant:"Rattan (Calamus spp.)", where:"Lowland forest everywhere", how:"Peel outer skin off, split into strips. Very strong. Used for centuries in Dayak building.", strength:"Very High" },
  { plant:"Jungle Vine (Meranthis sp.)", where:"Forest canopy, climbing over trees", how:"Cut lengths, strip bark for flexibility. Good for lashing.", strength:"High" },
  { plant:"Banana fibre", where:"Any banana plant", how:"Tear long strips from trunk/leaf stalk. Braid for strength. Not waterproof.", strength:"Medium" },
  { plant:"Nipah palm fibre", where:"Coastal mangroves, riverbanks", how:"Long strong fibres in leaf base. Excellent natural rope when twisted.", strength:"High" },
  { plant:"Bamboo splits", where:"Any bamboo grove", how:"Split green bamboo into thin strips. Flexible when green, rigid when dry. Perfect lashing material.", strength:"High" },
];

const LEAVES: { plant: string; coverage: string; layers: string; note: string }[] = [
  { plant:"Nipah Palm (Nypa fruticans)", coverage:"1m² per large leaf", layers:"2-3 layers", note:"Best roofing material in Sarawak. Waterproof when overlapped. Used traditionally for Malay houses." },
  { plant:"Banana Leaf", coverage:"0.5-1m² per leaf", layers:"4-5 layers", note:"Very large but tears. Needs to be fresh. Dries and cracks quickly — replace within a week." },
  { plant:"Wild Ginger Leaf (Etlingera)", coverage:"0.3-0.5m² per leaf", layers:"5-6 layers", note:"Waxy surface — naturally waterproof. Found in forest understorey everywhere." },
  { plant:"Bertam Palm (Eugeissona tristis)", coverage:"1-1.5m² per frond", layers:"2 layers", note:"Traditional Dayak roofing. Hard midrib makes natural tiles. Extremely durable — lasts years." },
  { plant:"Sago Palm Leaf (Metroxylon sagu)", coverage:"1m² per frond", layers:"2-3 layers", note:"Traditional atap roofing. Commonly used in Sarawak longhouses. Very effective." },
];

export default function ShelterGuide() {
  const [tab, setTab] = useState<"shelters"|"cordage"|"leaves"|"rules">("shelters");
  const [selected, setSelected] = useState(SHELTERS[0]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🏕️</span>
          <div><h1 className="text-xl font-bold">Jungle Shelter Builder</h1><p className="text-xs text-muted-foreground">Build survival shelters from Borneo plants</p></div>
        </div>
        <div className="container pb-3 flex gap-2 overflow-x-auto">
          {[["shelters","🏕️ Shelters"],["cordage","🪢 Cordage"],["leaves","🍃 Roofing"],["rules","⚡ Rules"]].map(([v,l]) => (
            <button type="button" key={v} onClick={() => setTab(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${tab === v ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        {tab === "shelters" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              {SHELTERS.map(s => (
                <button type="button" key={s.id} onClick={() => setSelected(s)} className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.id === s.id ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/40 hover:border-emerald-500/30"}`}>
                  <span className="text-2xl">{s.emoji}</span>
                  <div><p className="font-semibold text-sm">{s.name}</p><p className="text-xs text-muted-foreground">{s.time} · {s.difficulty}</p></div>
                </button>
              ))}
            </div>
            <div className="lg:col-span-2 space-y-3">
              <div className="glass rounded-xl p-5 border border-emerald-500/30">
                <div className="flex items-center gap-3 mb-4"><span className="text-3xl">{selected.emoji}</span><div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-xs text-muted-foreground">{selected.time} build time · {selected.difficulty}</p></div></div>
                <div className="glass rounded-lg p-3 border border-blue-500/20 mb-3"><p className="text-xs font-bold text-blue-400 mb-2">🪵 Materials needed</p><ul className="space-y-1">{selected.materials.map(m => <li key={m} className="text-xs text-muted-foreground flex gap-2"><span>•</span>{m}</li>)}</ul></div>
                <div className="glass rounded-lg p-3 border border-border/40 mb-3"><p className="text-xs font-bold text-muted-foreground mb-2">📋 Build steps</p><ol className="space-y-2">{selected.steps.map((s,i) => <li key={i} className="text-xs text-muted-foreground flex gap-2"><span className="text-emerald-400 font-bold flex-shrink-0">{i+1}.</span>{s}</li>)}</ol></div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="glass rounded-lg p-2 border border-green-500/20"><p className="text-[10px] font-bold text-green-400 mb-1">✅ Pros</p><ul>{selected.pros.map(p => <li key={p} className="text-xs text-muted-foreground">• {p}</li>)}</ul></div>
                  <div className="glass rounded-lg p-2 border border-red-500/20"><p className="text-[10px] font-bold text-red-400 mb-1">❌ Cons</p><ul>{selected.cons.map(c => <li key={c} className="text-xs text-muted-foreground">• {c}</li>)}</ul></div>
                </div>
                <div className="glass rounded-lg p-3 border border-amber-500/20"><p className="text-xs text-amber-300">💡 {selected.tip}</p></div>
              </div>
            </div>
          </div>
        )}
        {tab === "cordage" && (
          <div className="space-y-3">
            {CORDAGE.map(c => (
              <div key={c.plant} className="glass rounded-xl p-4 border border-border/40">
                <div className="flex justify-between items-start mb-2"><p className="font-bold">{c.plant}</p><span className={`text-xs px-2 py-0.5 rounded-full ${c.strength === "Very High" ? "bg-green-500/20 text-green-400" : c.strength === "High" ? "bg-blue-500/20 text-blue-400" : "bg-amber-500/20 text-amber-400"}`}>{c.strength}</span></div>
                <p className="text-xs text-muted-foreground mb-1">📍 {c.where}</p>
                <p className="text-sm">{c.how}</p>
              </div>
            ))}
          </div>
        )}
        {tab === "leaves" && (
          <div className="space-y-3">
            {LEAVES.map(l => (
              <div key={l.plant} className="glass rounded-xl p-4 border border-border/40">
                <div className="flex justify-between items-center mb-2"><p className="font-bold">{l.plant}</p><span className="text-xs text-emerald-400">{l.layers}</span></div>
                <p className="text-xs text-muted-foreground mb-1">Coverage: {l.coverage}</p>
                <p className="text-sm text-muted-foreground">{l.note}</p>
              </div>
            ))}
          </div>
        )}
        {tab === "rules" && (
          <div className="space-y-3">
            {[["Location — Priority 1","Find shelter BEFORE dark. Rule of 3: 3 hours without shelter in bad weather = hypothermia risk (even in tropical Malaysia highlands)."],["Stay DRY","Wet clothes in Borneo highlands (Kelabit Highlands, Bario, 1000m+) = serious risk. Valley floors flood. Build on elevated ground."],["Ground Insulation","Direct ground contact steals body heat fast. Always build a raised bed or thick leaf mattress (20cm minimum). Bamboo platform best."],["Face Away from Wind","In Sarawak, prevailing winds are usually from SW in dry season, NE in monsoon. Orient shelter opening away from rain direction."],["Signal from Shelter","Clear a 10m² signal area near shelter. Reflective objects, brightly coloured items, smoke signal (3 fires = distress). GPS coordinates to remember: lat/long from phone."],["Insects","Check for ant nests and termite mounds before building. Smoke smoldering greenwood inside to drive insects out. Sleep with shirt and long trousers."],["Wildlife","Don't shelter near fruiting trees (Orangutan, sun bear, wild boar will come). Don't shelter near water at night (crocodile risk in Sarawak rivers). Check for snake holes near buttress roots."],["Rain Collection","In Sarawak you're rarely far from water. But collect rainwater from large leaves into bamboo sections — clean, drinkable. Filter through cloth if from stream."]].map(([title, desc]) => (
              <div key={String(title)} className="glass rounded-xl p-4 border border-border/40">
                <p className="font-bold text-sm mb-1 text-emerald-400">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
