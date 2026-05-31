import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const CROPS: Record<string, { days: number; signs: string[]; tips: string }> = {
  "Tomato":          { days:60,  signs:["Fully red or intended colour","Slightly soft when pressed","Easy to pull from vine","Glossy skin"], tips:"Harvest when 80% coloured and let ripen off vine for better flavour" },
  "Chili":           { days:70,  signs:["Full size reached","Colour change to red/yellow (if desired)","Firm to touch"], tips:"Green chili harvest = mild. Wait for colour = hotter. Don't leave too long or will rot" },
  "Cucumber":        { days:45,  signs:["15-20cm length","Dark green, firm","Before seeds harden","Pick daily!"], tips:"Harvest every 1-2 days. Overripe cucumber = yellow and seedy. Keep picking = more fruit" },
  "Kangkung":        { days:21,  signs:["25-30cm tall","Harvest top 15cm","Stems still tender"], tips:"Cut 5cm from ground, regrows in 2 weeks. Continuous harvest for months" },
  "Long Bean":       { days:55,  signs:["40-60cm long","Firm and crisp","Before seeds bulge pod"], tips:"Harvest every 2 days or they become tough and fibrous. Check daily in peak season" },
  "Okra":            { days:55,  signs:["7-10cm length","Tender when tip snaps off cleanly","5-6 days after flowering"], tips:"Harvest DAILY — gets tough and woody in 1-2 days. Wear gloves, plant is itchy" },
  "Pumpkin":         { days:90,  signs:["Skin hard (can't scratch with nail)","Stem starts to dry and cork","Full colour developed","Hollow sound when tapped"], tips:"Leave stem on when harvesting. Cure in sun for 2 weeks before storage = longer shelf life" },
  "Corn":            { days:75,  signs:["Tassels brown and dry","Silks dark brown","Kernels full (peel back husk to check)","Milky juice when kernel pierced"], tips:"Has only 3-4 day harvest window. Check daily when tassels start browning" },
  "Papaya":          { days:270, signs:["Yellow or orange streaks appear on skin","Flesh gives slightly to pressure","Fruit turns from dark green to lighter green/yellow"], tips:"Pick slightly underripe and ripen at room temperature. Fully ripe on tree = overripe fast" },
  "Banana":          { days:365, signs:["Fruit roundness — ribs less angular","Light green with some yellow","Harvest entire bunch at once"], tips:"Hang bunch upside down after cutting to ripen evenly. Don't wait for yellow on tree — splits" },
  "Watermelon":      { days:80,  signs:["Tendril near fruit dries and withers","Thumping = hollow sound","Yellow ground spot","Skin becomes dull"], tips:"The dried tendril is the most reliable sign. Yellow belly patch = ripe" },
  "Sweet Potato":    { days:90,  signs:["Leaves start to yellow","Vines begin to die back","90-120 days after planting"], tips:"Harvest before heavy rain — wet soil causes tubers to crack. Cure in sun 1 week" },
  "Pineapple":       { days:540, signs:["Yellow colour at base of fruit","Sweet aroma","Eyes (scale) flatten and expand","18-24 months after planting crown"], tips:"Cut with leaf crown for table display. Ratoons (suckers) produce next crop faster" },
  "Rambutan":        { days:365, signs:["Red or yellow skin (depending on variety)","Spines start to soften","Bunch colour uniform"], tips:"Harvest whole bunch by cutting stalk. Don't individual pick — damages spines. Process within 2 weeks" },
  "Chilli Padi":     { days:65,  signs:["Full red colour","Full size (tiny)","Easy to pluck"], tips:"Pick red for maximum heat. Green is still very hot. Freeze excess harvest" },
  "Rice / Padi":     { days:120, signs:["Panicles turn golden yellow","Grains hard and full","Stems begin to bend with weight","85-90% of grains ripened"], tips:"Harvest 95% maturity for best quality. Wet rice lowers milling quality" },
};

export default function HarvestCalc() {
  const [crop, setCrop] = useState("Tomato");
  const [plantDate, setPlantDate] = useState(new Date().toISOString().split("T")[0]);

  const info = CROPS[crop];
  const planted = new Date(plantDate);
  const harvest = new Date(planted.getTime() + info.days * 86400000);
  const today = new Date();
  const daysLeft = Math.ceil((harvest.getTime() - today.getTime()) / 86400000);
  const progress = Math.min(Math.max(Math.floor((today.getTime() - planted.getTime()) / (info.days * 86400000) * 100), 0), 100);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🌽</span>
          <div><h1 className="text-xl font-bold">Harvest Predictor</h1><p className="text-xs text-muted-foreground">Predict harvest date from planting date</p></div>
        </div>
      </div>
      <div className="container py-6 max-w-2xl space-y-5">
        <div className="glass rounded-xl p-5 border border-border/50 space-y-4">
          <div><label className="block text-sm font-semibold mb-2">Crop</label>
            <select value={crop} onChange={e => setCrop(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {Object.keys(CROPS).map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label className="block text-sm font-semibold mb-2">Planting Date</label>
            <input type="date" value={plantDate} onChange={e => setPlantDate(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
        </div>

        <div className="glass rounded-xl p-6 border border-emerald-500/40 bg-emerald-500/5">
          <p className="text-xs text-muted-foreground mb-1">Expected harvest</p>
          <p className="text-3xl font-bold mb-1">{harvest.toLocaleDateString("en-MY", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}</p>
          <p className={`text-lg font-bold ${daysLeft > 0 ? "text-amber-400" : "text-emerald-400"}`}>
            {daysLeft > 0 ? `${daysLeft} days to go` : daysLeft === 0 ? "Harvest day!" : "Overdue — check your plants!"}
          </p>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Planted</span><span>{progress}% grown</span><span>Harvest</span></div>
            <div className="h-3 bg-border/30 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width:`${progress}%`, background: progress >= 100 ? "#10b981" : "#3b82f6" }} />
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-5 border border-border/50">
          <h3 className="font-bold mb-3">Signs of Readiness</h3>
          <ul className="space-y-1.5">{info.signs.map(s => <li key={s} className="flex gap-2 text-sm"><span className="text-emerald-400">✓</span>{s}</li>)}</ul>
          <div className="mt-3 glass rounded-lg p-3 border border-blue-500/20"><p className="text-xs text-blue-300">💡 {info.tips}</p></div>
        </div>
      </div>
    </div>
  );
}
