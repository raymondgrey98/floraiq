import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const METHODS = [
  {
    id:"seed", name:"Seed Propagation", emoji:"🌱", difficulty:"Easy",
    desc:"Growing plants from seeds — the most common method.",
    steps:["Soak seeds in water 8-24 hours for hard seeds","Fill tray with seed-raising mix or coco peat","Sow at depth = 2× seed diameter","Water gently with mister — don't wash seeds away","Cover with plastic to maintain humidity","Keep at 25-30°C — germination in 3-14 days","Transplant when 2 true leaves appear"],
    good:["Tomato","Chili","Cucumber","Corn","Pumpkin","Most annual vegetables"],
    tip:"In Malaysia, seeds germinate faster in wet season. Label everything — seeds look identical.",
  },
  {
    id:"cutting", name:"Stem Cuttings", emoji:"✂️", difficulty:"Easy-Medium",
    desc:"Cut a healthy stem and root it in water or soil.",
    steps:["Cut 10-15cm of healthy non-flowering stem","Remove lower leaves — keep 2-3 at top","Dip cut end in rooting hormone (optional)","Place in water jar or moist perlite/sand","Keep in bright indirect light","Roots appear in 2-4 weeks","Transplant when roots are 3-5cm long"],
    good:["Basil","Mint","Sweet Potato","Cassava","Chili","Kangkung","Orchid","Hibiscus"],
    tip:"Change water every 2 days to prevent rot. In Malaysian humidity, cuttings root fast.",
  },
  {
    id:"division", name:"Division / Splitting", emoji:"🔀", difficulty:"Easy",
    desc:"Split one large plant into multiple plants at the root.",
    steps:["Dig up mature plant carefully","Shake off excess soil to see root structure","Use clean knife or hands to separate clumps","Each division needs roots and shoots","Replant immediately — don't let roots dry","Water well and shade for 1-2 weeks"],
    good:["Lemongrass","Ginger","Turmeric","Banana suckers","Orchids","Pandan","Aloe vera"],
    tip:"Best done in morning in Malaysia. Avoid dividing in peak hot season.",
  },
  {
    id:"layering", name:"Air Layering", emoji:"🌿", difficulty:"Medium",
    desc:"Root a branch while still attached to mother plant.",
    steps:["Choose healthy branch 30-60cm from tip","Remove bark ring 3-4cm wide","Wound the exposed wood lightly","Apply moist sphagnum moss around wound","Wrap tightly with clear plastic","Tie both ends shut","Roots appear in 4-8 weeks","Cut below root ball and pot up"],
    good:["Durian","Rambutan","Citrus","Mango","Avocado","Guava","Rubber tree","Ficus"],
    tip:"Common method for durian in Sarawak — preserves variety. More reliable than seeds.",
  },
  {
    id:"budding", name:"Budding / Grafting", emoji:"🔗", difficulty:"Advanced",
    desc:"Join a bud or stem of one plant onto rootstock of another.",
    steps:["Select rootstock (vigorous, disease-resistant)","Choose scion from proven fruiting tree","Make T-cut on rootstock stem","Insert bud or wedge-cut scion","Wrap tightly with grafting tape","Keep in shade and high humidity","Remove tape when union healed (3-4 weeks)","Cut above graft to force new growth"],
    good:["Durian (Musang King, D24)","Rambutan","Mango","Citrus","Rubber","Cacao"],
    tip:"Standard practice in commercial durian farming in Sarawak. Ensures variety and earlier fruiting.",
  },
  {
    id:"runner", name:"Runners / Offsets", emoji:"↔️", difficulty:"Very Easy",
    desc:"Plant naturally produces babies — just separate and replant.",
    steps:["Wait until runner/offset has its own roots","Use clean scissors or knife to cut","Pot up in fresh potting mix","Water well and keep in shade for 1 week","Normal care after establishment"],
    good:["Strawberry","Banana suckers","Pineapple crown & ratoons","Spider plant","Bromeliad pups","Aloe vera pups","Orchid keikis"],
    tip:"Banana suckers (sword suckers) produce better fruit than water suckers. Choose carefully.",
  },
];

export default function PropagationGuide() {
  const [selected, setSelected] = useState(METHODS[0]);

  const DIFF_COLOR: Record<string, string> = {
    "Very Easy":"text-green-400","Easy":"text-emerald-400","Easy-Medium":"text-yellow-400","Medium":"text-amber-400","Advanced":"text-red-400"
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🌿</span>
          <div>
            <h1 className="text-xl font-bold">Propagation Guide</h1>
            <p className="text-xs text-muted-foreground">Grow new plants for free — 6 methods</p>
          </div>
        </div>
      </div>

      <div className="container py-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            {METHODS.map(m => (
              <button type="button" key={m.id} onClick={() => setSelected(m)}
                className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${
                  selected.id === m.id ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/40 hover:border-emerald-500/30"
                }`}>
                <span className="text-xl">{m.emoji}</span>
                <div>
                  <p className="font-semibold text-sm">{m.name}</p>
                  <p className={`text-xs font-bold ${DIFF_COLOR[m.difficulty]}`}>{m.difficulty}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-xl p-5 border border-emerald-500/30">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{selected.emoji}</span>
                <div>
                  <h2 className="text-xl font-bold">{selected.name}</h2>
                  <span className={`text-xs font-bold ${DIFF_COLOR[selected.difficulty]}`}>{selected.difficulty}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{selected.desc}</p>

              <h3 className="font-bold text-sm mb-3">Step-by-Step</h3>
              <div className="space-y-2 mb-4">
                {selected.steps.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                    <p className="text-sm text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>

              <div className="glass rounded-lg p-3 border border-emerald-500/20 mb-3">
                <p className="text-xs font-bold text-emerald-400 mb-2">Best for these plants:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.good.map(g => <span key={g} className="text-xs bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-full">{g}</span>)}
                </div>
              </div>

              <div className="glass rounded-lg p-3 border border-blue-500/20">
                <p className="text-xs text-blue-300">💡 Malaysia tip: {selected.tip}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
