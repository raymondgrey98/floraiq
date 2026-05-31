import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, AlertTriangle } from "lucide-react";

const CATEGORIES = [
  {
    id:"water", label:"Find Water", emoji:"💧",
    plants:[
      { name:"Banana plant", use:"Cut stem close to ground at 45°. Hollow fills with water in 30 min. Repeat cuts renew supply.", safe:true },
      { name:"Bamboo sections", use:"Young bamboo — cut between nodes. Contains water in hollow sections. Shake to find full ones.", safe:true },
      { name:"Large leaves (taro, elephant ear)", use:"Collect rainwater by directing drips onto large leaves into container.", safe:true },
      { name:"Tree root sap", use:"Cut woody vine close to ground. Tilt upward — water flows from cut end. Test: 1 small sip first.", safe:false },
      { name:"Coconut (green)", use:"Drink water from young green coconut. Electrolytes. Do NOT drink from old brown coconut water excessively.", safe:true },
    ],
    tip:"In Sarawak jungle, water is abundant. Follow birds/animals downhill. Clear flowing water is safer than still water.",
  },
  {
    id:"food", label:"Find Food", emoji:"🍽️",
    plants:[
      { name:"Paku pakis (fern shoots)", use:"Harvest young curled fronds. Boil or roast. Common across Sarawak.", safe:true },
      { name:"Wild banana flower", use:"Boil banana flower bud. Eat petals and core. Bitter but edible.", safe:true },
      { name:"Young bamboo shoots", use:"BOIL first — removes cyanide. Then eat as vegetable.", safe:false },
      { name:"Sago palm pith", use:"Mature tree — cut down, extract pith from trunk. Wash repeatedly. Roast sago cakes on hot stone.", safe:true },
      { name:"Palm hearts", use:"Cut tops of certain palm species. Inner white heart is edible raw or cooked.", safe:true },
      { name:"Wild ginger rhizome", use:"Dig rhizome. Chew for energy and anti-nausea. Mild flavour.", safe:true },
    ],
    tip:"Rule of thumb: If insects eat it, you can eat it (fruit). White milky sap = avoid. Bitter = suspect. Always boil if unsure.",
  },
  {
    id:"shelter", label:"Build Shelter", emoji:"🏕️",
    plants:[
      { name:"Bamboo", use:"Frame, poles, floor, walls. Split lengthwise for flat sections. Lash with rattan.", safe:true },
      { name:"Large leaves (palms, banana)", use:"Thatching material. Overlap like roof tiles from bottom up. Angle down for rainwater runoff.", safe:true },
      { name:"Rattan", use:"Flexible vine — ideal lashing material. Wet it first for easier bending.", safe:true },
      { name:"Attap Palm (Nypa fruticans)", use:"Traditional roof thatching material in Sarawak. Split into fans. Very durable if woven correctly.", safe:true },
      { name:"Bark strips", use:"From fallen logs. Inner bark soft enough to use as rope. Test: pull to check strength.", safe:true },
    ],
    tip:"Priority: Location first. High ground, near water but not flood zone. Southwest facing if possible (prevailing wind). Build elevated sleeping platform — insects and snakes on ground.",
  },
  {
    id:"fire", label:"Start Fire", emoji:"🔥",
    plants:[
      { name:"Dry bamboo (inner)", use:"Inner shaving make excellent tinder. Dry bamboo rubbed together with friction board method.", safe:true },
      { name:"Dead palm frond base", use:"The fuzzy dry material at base of palm fronds. Excellent tinder — ignites very easily.", safe:true },
      { name:"Resin-soaked wood", use:"Kayu dammar — heartwood of certain dead trees. Burns very hot. Good in wet conditions.", safe:true },
      { name:"Dry fungus (bracket fungus)", use:"Dead bracket fungi from fallen trees. Excellent slow-burning tinder when dried.", safe:true },
      { name:"Dipterocarp resin (damar)", use:"Sticky resin from dipterocarp trees. Highly flammable. Excellent fire starter.", safe:true },
    ],
    tip:"In Sarawak humidity: finding DRY tinder is your biggest challenge. Carry lighter always. Inner bark of dead wood stays drier. Build fire on platform off wet ground.",
  },
  {
    id:"rope", label:"Natural Rope", emoji:"🪢",
    plants:[
      { name:"Rattan vine", use:"Strongest natural rope material in Borneo. Soak in water for flexibility. Lash joints for shelter and traps.", safe:true },
      { name:"Banana stem fibre", use:"Strip outer skin, pull inner fibres. Twist multiple strands together. For lashing not heavy loads.", safe:true },
      { name:"Coconut husk fibre (coir)", use:"Strip dry coconut husks. Twist fibre into rope. Used for centuries — very durable.", safe:true },
      { name:"Inner bark of hibiscus (bunga raya)", use:"Pound outer bark, soak inner bark. Strong flexible fibres for rope.", safe:true },
      { name:"Liana vines", use:"Test each one — pull hard before trusting weight. Woody lianas stronger than leafy ones.", safe:false },
    ],
    tip:"Test every rope material before relying on it for weight. Twist two strands in opposite directions for strongest rope. Wet natural rope is weaker — dry it if time allows.",
  },
  {
    id:"medicine", label:"Jungle Medicine", emoji:"🩹",
    plants:[
      { name:"Turmeric rhizome", use:"Pound and apply to wounds — powerful antiseptic. Also anti-inflammatory for sprains.", safe:true },
      { name:"Betel leaf (daun sirih)", use:"Press on bleeding wound. Strong antiseptic. Widely available in kampungs.", safe:true },
      { name:"Plantain leaf (Musa)", use:"Large clean leaf as emergency bandage/wrap. Keep wound clean.", safe:true },
      { name:"Aloe vera", use:"If found — split leaf and apply gel to burns, cuts, rashes.", safe:true },
      { name:"Young coconut water", use:"Sterile hydration if severely dehydrated. Safe to drink directly from young coconut.", safe:true },
      { name:"Ginger rhizome", use:"Chew raw for nausea and stomach upset. Crush and apply to swelling.", safe:true },
    ],
    tip:"In Sarawak: most jungle injuries are from falls, leeches, and infected small cuts. Keep wounds clean above all else. Evacuate to medical help as priority.",
  },
];

export default function SurvivalPlants() {
  const [cat, setCat] = useState(CATEGORIES[0]);
  const [selected, setSelected] = useState<any>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🏕️</span>
          <div><h1 className="text-xl font-bold">Survival Plants</h1><p className="text-xs text-muted-foreground">Borneo jungle survival — water, food, shelter, fire</p></div>
        </div>
        <div className="container pb-3 flex gap-2 overflow-x-auto">
          {CATEGORIES.map(c => (
            <button type="button" key={c.id} onClick={() => { setCat(c); setSelected(null); }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${cat.id === c.id ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>
      <div className="container py-4 max-w-4xl">
        <div className="glass rounded-xl p-4 border border-amber-500/30 mb-4 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300">This is educational information. In real emergency: signal for help first. Always tell someone your jungle route. Carry emergency kit. Sarawak SAR: 082-441555</p>
        </div>
        <div className="glass rounded-xl p-5 border border-emerald-500/30 mb-4">
          <h2 className="font-bold text-lg flex items-center gap-2 mb-1">{cat.emoji} {cat.label}</h2>
          <p className="text-xs text-emerald-300">💡 {cat.tip}</p>
        </div>
        <div className="space-y-3">
          {cat.plants.map(p => (
            <div key={p.name} onClick={() => setSelected(selected?.name === p.name ? null : p)}
              className={`glass rounded-xl p-4 border cursor-pointer transition-all ${selected?.name === p.name ? "border-emerald-500/60" : "border-border/50 hover:border-emerald-500/30"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-sm">{p.name}</p>
                    {!p.safe && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full font-bold">⚠️ CAUTION</span>}
                    {p.safe && <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full font-bold">✅ SAFE</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{p.use}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
