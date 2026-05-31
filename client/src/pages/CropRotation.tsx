import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const FAMILIES: Record<string, { emoji: string; crops: string[]; depletes: string; fixes: boolean; disease: string }> = {
  "Solanaceae (Nightshades)": { emoji:"🍅", crops:["Tomato","Chili","Brinjal","Potato","Capsicum"], depletes:"Calcium, Magnesium", fixes:false, disease:"Bacterial wilt, Fusarium, Blight" },
  "Cucurbitaceae (Gourds)": { emoji:"🥒", crops:["Cucumber","Pumpkin","Watermelon","Bitter Gourd","Luffa"], depletes:"Potassium, Phosphorus", fixes:false, disease:"Powdery mildew, Mosaic virus" },
  "Leguminosae (Beans)": { emoji:"🫘", crops:["Long Bean","French Bean","Groundnut","Soybean","Cowpea"], depletes:"Nothing — ADDS nitrogen", fixes:true, disease:"Root rot, Bean mosaic virus" },
  "Brassicaceae (Cabbages)": { emoji:"🥦", crops:["Kangkung (loose)","Kailan","Cabbage","Cauliflower","Radish"], depletes:"Sulphur, Calcium", fixes:false, disease:"Clubroot, Downy mildew" },
  "Amaranthaceae (Leafy)": { emoji:"🥬", crops:["Bayam","Amaranth","Spinach"], depletes:"Nitrogen, Iron", fixes:false, disease:"Damping off, leaf spot" },
  "Poaceae (Grasses)": { emoji:"🌾", crops:["Corn","Padi","Sugarcane","Sorghum"], depletes:"Nitrogen heavily", fixes:false, disease:"Corn smut, Rice blast" },
  "Apiaceae (Umbellifers)": { emoji:"🥕", crops:["Carrot","Celery","Coriander"], depletes:"Moderate NPK", fixes:false, disease:"Carrot fly, Alternaria" },
  "Allium (Onion family)": { emoji:"🧅", crops:["Onion","Garlic","Chives","Spring Onion","Leek"], depletes:"Sulphur, Potassium", fixes:false, disease:"Thrips, White rot" },
};

const ROTATION_PLAN = [
  { season:"Season 1", family:"Leguminosae", reason:"Fix nitrogen into soil — free fertiliser for next crop" },
  { season:"Season 2", family:"Solanaceae", reason:"Use the nitrogen left by beans. High feeder." },
  { season:"Season 3", family:"Cucurbitaceae", reason:"Different root depth, different diseases" },
  { season:"Season 4", family:"Brassicaceae", reason:"Different family, helps break disease cycle" },
];

export default function CropRotation() {
  const [selected, setSelected] = useState(Object.keys(FAMILIES)[0]);
  const [beds, setBeds] = useState(["Solanaceae (Nightshades)","Leguminosae (Beans)","Cucurbitaceae (Gourds)","Brassicaceae (Cabbages)"]);

  function rotate() {
    const families = Object.keys(FAMILIES);
    setBeds(prev => prev.map(b => {
      const idx = families.indexOf(b);
      return families[(idx + 1) % families.length];
    }));
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🔄</span>
          <div><h1 className="text-xl font-bold">Crop Rotation Planner</h1><p className="text-xs text-muted-foreground">Rotate crops to prevent soil depletion and disease</p></div>
        </div>
      </div>
      <div className="container py-6 max-w-4xl space-y-6">
        {/* Why rotate */}
        <div className="glass rounded-xl p-5 border border-emerald-500/20">
          <h3 className="font-bold mb-3">Why rotate crops?</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm">
            {[["🦠","Break disease cycle"],["🪱","Prevent soil depletion"],["🌿","Beans add free nitrogen"],["🐛","Reduce pest buildup"]].map(([e,t]) => (
              <div key={t} className="glass rounded-lg p-3 border border-border/40"><p className="text-2xl mb-1">{e}</p><p className="text-xs text-muted-foreground">{t}</p></div>
            ))}
          </div>
        </div>

        {/* Recommended 4-season rotation */}
        <div className="glass rounded-xl p-5 border border-blue-500/20">
          <h3 className="font-bold mb-4">Recommended 4-Season Rotation</h3>
          <div className="space-y-2">
            {ROTATION_PLAN.map((r, i) => (
              <div key={r.season} className="flex items-center gap-4 glass rounded-lg p-3 border border-border/40">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0">{i+1}</div>
                <div>
                  <p className="font-semibold text-sm">{r.season}: <span className="text-emerald-400">{r.family}</span></p>
                  <p className="text-xs text-muted-foreground">{r.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bed simulator */}
        <div className="glass rounded-xl p-5 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Bed Rotation Simulator</h3>
            <button type="button" onClick={rotate} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-lg transition-all">🔄 Rotate Season</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {beds.map((b, i) => {
              const f = FAMILIES[b];
              return (
                <div key={i} className="glass rounded-xl p-4 border border-emerald-500/20">
                  <p className="text-xs text-muted-foreground mb-1">Bed {i+1}</p>
                  <p className="text-2xl mb-1">{f?.emoji}</p>
                  <p className="font-bold text-sm">{b.split(" ")[0]}</p>
                  <p className="text-xs text-muted-foreground">{f?.crops.slice(0,3).join(", ")}</p>
                  {f?.fixes && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full mt-1 inline-block">N-Fixer</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Family reference */}
        <div className="glass rounded-xl p-5 border border-border/50">
          <h3 className="font-bold mb-4">Plant Family Reference</h3>
          <div className="space-y-2">
            {Object.entries(FAMILIES).map(([family, info]) => (
              <div key={family} className="glass rounded-lg p-3 border border-border/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{info.emoji}</span>
                  <p className="font-semibold text-sm">{family}</p>
                  {info.fixes && <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">Fixes N</span>}
                </div>
                <p className="text-xs text-muted-foreground">Crops: {info.crops.join(", ")}</p>
                <p className="text-xs text-amber-400 mt-0.5">Disease: {info.disease}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
