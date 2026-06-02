import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const SHELTERS = [
  { name:"Lean-to (Quick)", emoji:"🏕️", time:"1–2 hours", people:"1–2", difficulty:"Easy",
    materials:["4–5 straight poles 2–3m long (any dead wood)","Horizontal ridgepole (longest straight pole)","Large leaves — nipah palm, banana, dipterocarp (minimum 40+ leaves)","Rattan or bark strips for lashing"],
    steps:["Find 2 trees 2.5–3m apart. This is your back wall.","Lash ridgepole horizontally between trees at shoulder height.","Lean 4–5 poles from ridgepole to ground at 45° angle (front).","Weave or lay large leaves on the angled frame — shingled like roof tiles, bottom to top.","Lay bedding inside — dead leaves 15cm thick for insulation from ground cold.","Optional: add side walls with more poles and leaves."],
    tip:"Best for quick overnight in light rain. Not for storms. Works in an hour. Huge leaf shingles are key — overlap 50%." },
  { name:"A-Frame (Stronger)", emoji:"🏕️", time:"2–4 hours", people:"2–4", difficulty:"Medium",
    materials:["Central ridgepole 3–4m long","4–6 pairs of crossing poles for A-frame ribs","Many large leaves (100+)","Rattan or roots for lashing"],
    steps:["Lay ridgepole along ground. This is your centre spine.","Prop ridgepole up in middle using forked stick. Tie with rattan.","Lean crossing poles in pairs along ridgepole creating triangular ribs.","Lash all joints firmly.","Layer leaves from bottom up — shingle style — on both sides.","Leave ventilation gap at ridge peak."],
    tip:"More weatherproof than lean-to. Works in moderate rain. The heavier the leaf layering, the drier inside." },
  { name:"Elevated Platform Bed", emoji:"🛏️", time:"3–5 hours", people:"2", difficulty:"Medium-Hard",
    materials:["4–6 posts 1m tall (hardwood, hammered into ground)","Cross beams lashed between posts","Smaller poles layered for sleeping surface","Bark or split bamboo for smooth surface"],
    steps:["Cut 4 sturdy posts ~1.2m, sharpen one end.","Pound into ground 10cm deep at corners of sleeping area.","Lash horizontal beams to posts at sleeping height (60cm).","Lay smaller poles close together across beams.","Cover with bark or leaves for sleeping comfort.","Build lean-to shelter above the platform."],
    tip:"Essential in Borneo lowland jungle — keeps you off wet ground, away from ants, centipedes, and snakes." },
  { name:"Basha/Tarp-Style", emoji:"🌿", time:"30 min", people:"1–4", difficulty:"Very Easy",
    materials:["Large nipah/sago palm fronds (5–8)","Or large tarpaulin banana leaves stitched together","4 corner tie-points"],
    steps:["Find 4 anchor points — trees or poles","Tie large leaves together at edges with rattan to make one big sheet.","Attach each corner to anchor points.","Angle it to shed rain to one side — not flat.","Add walls if needed from extra leaves."],
    tip:"Fast, minimal tools needed. Nipah palm frond is natural tarpaulin — waterproof and durable. Very common in Sarawak coastal areas." },
];

const MATERIALS = [
  { material:"Nibong/Nipah Palm Leaf", emoji:"🌴", use:"Excellent roofing — traditional Sarawak roof (attap). Waterproof, durable 3–5 years if dried.", prep:"Fold frond over wooden stave and let dry 2 days for traditional attap shingle." },
  { material:"Banana Leaf", emoji:"🍌", use:"Quick waterproof cover — wide, waxy surface. Not durable but immediately effective.", prep:"Wilt briefly over fire — more flexible and less likely to split when used as shingle." },
  { material:"Bamboo", emoji:"🎍", use:"Poles, floors, walls, water containers, structural frame. Most useful jungle building material.", prep:"Split with parang. Dry for 2+ weeks before structural use — green bamboo shrinks and weakens." },
  { material:"Rattan (Rotan)", emoji:"🌿", use:"Lashing and binding — stronger than rope when fresh. Flexible.", prep:"Soak in water 30 min to increase flexibility. Split lengthwise for flat lashing strips." },
  { material:"Tree Bark", emoji:"🌲", use:"Flooring, wall cladding, water barrier. Dipterocarp bark strips well.", prep:"Cut tree and peel bark in large sheets. Flatten under weight while drying." },
  { material:"Dipterocarp Wood (Meranti etc.)", emoji:"🪵", use:"Heavy structural posts and beams. Very hard and rot-resistant.", prep:"Use dead/fallen wood first — easier and no live tree felling needed." },
];

const RULES = [
  "Build higher than the lowest point in the area — flash floods happen fast in Borneo",
  "Never sleep on the ground — ants, centipedes, leeches, snakes",
  "Insulate from ground — 15cm dry leaves = warm and dry",
  "Ventilation gap at ridge prevents condensation dripping on you",
  "Test shelter roof in daylight by pouring water — fix holes before night",
  "Keep fire away from leaf roof — fire risk. Use rock or mud hearth outside shelter",
  "Signal fire location — build where rescue aircraft can see smoke above canopy",
  "Secure food from rats and pigs — hang food 2m+ above ground",
];

export default function ShelterBuilder() {
  const [tab, setTab] = useState<"shelters"|"materials"|"rules">("shelters");
  const [selected, setSelected] = useState(SHELTERS[0]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🏕️</span>
          <div><h1 className="text-xl font-bold">Shelter Builder</h1><p className="text-xs text-muted-foreground">Build jungle shelter from natural materials — Borneo</p></div>
        </div>
        <div className="container pb-3 flex gap-2 overflow-x-auto">
          {[["shelters","🏕️ Shelter Types"],["materials","🪵 Materials"],["rules","📋 Survival Rules"]].map(([v,l]) => (
            <button type="button" key={v} onClick={() => setTab(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${tab === v ? "bg-amber-700 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="container py-4 max-w-5xl">
        {tab === "shelters" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              {SHELTERS.map(s => (
                <button type="button" key={s.name} onClick={() => setSelected(s)} className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.name === s.name ? "border-amber-700/60 bg-amber-700/5" : "border-border/40 hover:border-amber-700/30"}`}>
                  <span className="text-xl">{s.emoji}</span>
                  <div className="flex-1 min-w-0"><p className="font-semibold text-sm">{s.name}</p><p className="text-xs text-muted-foreground">{s.time} · {s.difficulty}</p></div>
                </button>
              ))}
            </div>
            <div className="lg:col-span-2">
              <div className="glass rounded-xl p-5 border border-amber-700/30 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selected.emoji}</span>
                  <div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-xs text-muted-foreground">{selected.time} · {selected.people} people · {selected.difficulty}</p></div>
                </div>
                <div className="glass rounded-lg p-3 border border-border/40">
                  <p className="text-xs font-bold text-muted-foreground mb-2">🪵 Materials needed</p>
                  {selected.materials.map(m => <p key={m} className="text-xs text-muted-foreground mb-0.5">• {m}</p>)}
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-400 mb-2">📋 Build steps</p>
                  {selected.steps.map((s, i) => (
                    <div key={i} className="flex gap-3 mb-2">
                      <span className="w-5 h-5 rounded-full bg-amber-700/20 text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
                      <p className="text-xs text-muted-foreground">{s}</p>
                    </div>
                  ))}
                </div>
                <div className="glass rounded-lg p-3 border border-amber-500/20">
                  <p className="text-xs text-amber-300">💡 {selected.tip}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "materials" && (
          <div className="space-y-3">
            {MATERIALS.map(m => (
              <div key={m.material} className="glass rounded-xl p-5 border border-border/40">
                <div className="flex items-center gap-2 mb-2"><span className="text-2xl">{m.emoji}</span><p className="font-bold">{m.material}</p></div>
                <p className="text-sm text-muted-foreground mb-2">{m.use}</p>
                <div className="glass rounded-lg p-2 border border-border/30"><p className="text-xs text-emerald-300">🔧 Preparation: {m.prep}</p></div>
              </div>
            ))}
          </div>
        )}

        {tab === "rules" && (
          <div className="space-y-3">
            <div className="glass rounded-xl p-4 border border-blue-500/20 mb-2"><p className="text-xs text-blue-300">Priority order in survival: Protection → Water → Fire → Food. Shelter is #1 priority — exposure kills faster than thirst in cold rain.</p></div>
            {RULES.map((r, i) => (
              <div key={i} className="glass rounded-xl p-4 border border-border/40 flex gap-3">
                <span className="w-7 h-7 rounded-full bg-amber-700/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-sm">{i+1}</span>
                <p className="text-sm text-muted-foreground">{r}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
