import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft, Sun } from "lucide-react";

const UV_LEVELS = [
  { range:"0–2", label:"Low", color:"bg-green-500", text:"text-green-400", desc:"No protection needed. Good for shade plants.", plants:"Shade-loving: ferns, calathea, peace lily, philodendron" },
  { range:"3–5", label:"Moderate", color:"bg-yellow-500", text:"text-yellow-400", desc:"Some protection advised. Most plants thrive.", plants:"Most vegetables, herbs, leafy greens, orchids" },
  { range:"6–7", label:"High", color:"bg-orange-500", text:"text-orange-400", desc:"Protection needed for humans outdoors. Full-sun plants love it.", plants:"Chili, tomato, corn, sunflower, most fruits" },
  { range:"8–10", label:"Very High", color:"bg-red-500", text:"text-red-400", desc:"Intense. Water plants early morning only. Avoid outdoor work 10am–3pm.", plants:"Only drought-tolerant: cactus, aloe, agave, certain palms" },
  { range:"11+", label:"Extreme", color:"bg-purple-500", text:"text-purple-400", desc:"Dangerous UV. Shade or mulch sensitive crops. Stay indoors.", plants:"Mulch everything. Only native tropical plants survive unshaded." },
];

const PLANTS_BY_SUN = [
  { name:"Full Sun (6+ hrs)", emoji:"☀️", plants:["Chili / Cili","Tomato","Corn / Jagung","Sunflower","Eggplant / Terung","Watermelon","Most fruit trees","Pineapple","Sugarcane"] },
  { name:"Partial Sun (3–6 hrs)", emoji:"⛅", plants:["Kangkung","Long beans","Capsicum","Cucumber","Most herbs (basil, mint, pandan)","Lemongrass","Spring onion","Lettuce (morning sun only)"] },
  { name:"Shade (< 3 hrs)", emoji:"🌥️", plants:["Ginger / Halia","Turmeric / Kunyit","Galangal / Lengkuas","Ferns (paku)","Calathea","Peace lily","Philodendron","Kailan (indirect light)"] },
];

const MALAYSIA_UV = {
  peak: "11:00 AM – 3:00 PM",
  typical: "8–12 (tropical year-round)",
  season: "UV slightly higher March–September (drier season in Sarawak)",
  tip: "Sarawak receives very high UV year-round due to equatorial position. UV Index regularly hits 10–13 even on partly cloudy days.",
};

export default function UVTracker() {
  const [hour, setHour] = useState(new Date().getHours());
  const [uvIndex, setUvIndex] = useState(0);
  const [tab, setTab] = useState<"tracker"|"plants"|"tips">("tracker");

  useEffect(() => {
    // Simulate UV curve for Malaysia (peaks at noon)
    const h = hour;
    let uv = 0;
    if (h >= 6 && h <= 18) {
      const angle = ((h - 12) / 6) * Math.PI;
      uv = Math.round(Math.max(0, 12 * Math.cos(angle)));
    }
    setUvIndex(uv);
  }, [hour]);

  const currentLevel = UV_LEVELS.find(l => {
    const [min, max] = l.range.split("–").map(s => parseInt(s));
    return uvIndex >= min && (isNaN(max) ? true : uvIndex <= max);
  }) || UV_LEVELS[0];

  const uvBarWidth = Math.min(100, (uvIndex / 13) * 100);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <Sun className="w-6 h-6 text-yellow-400" />
          <div><h1 className="text-xl font-bold">UV & Sun Tracker</h1><p className="text-xs text-muted-foreground">UV index · Plant sunlight guide · Kuching, Sarawak</p></div>
        </div>
        <div className="container pb-3 flex gap-2">
          {[["tracker","☀️ UV Tracker"],["plants","🌿 Plants by Sun"],["tips","💡 Tips"]].map(([v,l]) => (
            <button type="button" key={v} onClick={() => setTab(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${tab === v ? "bg-yellow-500 text-black" : "glass border border-border/50 text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="container py-6 max-w-3xl space-y-5">
        {tab === "tracker" && <>
          <div className="glass rounded-xl p-6 border border-yellow-500/30 text-center">
            <div className={`text-7xl font-black mb-2 ${currentLevel.text}`}>{uvIndex}</div>
            <div className={`text-xl font-bold mb-1 ${currentLevel.text}`}>{currentLevel.label}</div>
            <p className="text-sm text-muted-foreground mb-4">{currentLevel.desc}</p>
            <div className="w-full bg-border/30 rounded-full h-3 mb-4">
              <div className={`h-3 rounded-full transition-all duration-500 ${currentLevel.color}`} style={{ width: `${uvBarWidth}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">UV scale: 0 (none) → 13+ (extreme) · Malaysia typical: 8–12</p>
          </div>

          <div className="glass rounded-xl p-5 border border-border/40">
            <h3 className="font-bold mb-4 text-sm">Simulate time of day</h3>
            <input type="range" min={0} max={23} value={hour} onChange={e => setHour(Number(e.target.value))} className="w-full accent-yellow-400 mb-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>11 PM</span>
            </div>
            <p className="text-center text-sm mt-3 font-bold">{hour}:00 — UV Index: <span className={currentLevel.text}>{uvIndex}</span></p>
          </div>

          <div className="glass rounded-xl p-5 border border-amber-500/20">
            <h3 className="font-bold mb-3 text-sm">🌍 Malaysia UV Facts</h3>
            {[["Peak hours", MALAYSIA_UV.peak],["Typical index", MALAYSIA_UV.typical],["Seasonal variation", MALAYSIA_UV.season]].map(([k,v]) => (
              <div key={k} className="flex justify-between text-xs border-b border-border/20 py-2"><span className="text-muted-foreground">{k}</span><span className="text-right max-w-[60%]">{v}</span></div>
            ))}
            <p className="text-xs text-amber-300 mt-3">💡 {MALAYSIA_UV.tip}</p>
          </div>

          <div className="glass rounded-xl p-5 border border-emerald-500/20">
            <h3 className="font-bold mb-2 text-sm">🌿 Best plants for current UV level</h3>
            <p className="text-sm text-muted-foreground">{currentLevel.plants}</p>
          </div>
        </>}

        {tab === "plants" && (
          <div className="space-y-4">
            {PLANTS_BY_SUN.map(group => (
              <div key={group.name} className="glass rounded-xl p-5 border border-border/40">
                <h3 className="font-bold mb-3 flex items-center gap-2"><span className="text-xl">{group.emoji}</span>{group.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.plants.map(p => <span key={p} className="text-xs bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded-full border border-emerald-500/20">{p}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "tips" && (
          <div className="space-y-3">
            {[["Water timing","Water plants at 6–8 AM or after 5 PM. Midday watering evaporates instantly and can scorch leaves."],
              ["Shade cloth","Use 30–50% shade cloth for leafy greens during dry season. Use 70% for orchids and shade plants."],
              ["Mulching","Thick mulch (5–8cm) reduces soil temperature by 5–8°C. Essential in Malaysian heat. Use dried leaves, rice husks, or wood chips."],
              ["Sunburn signs","White or bleached patches on leaves = sunburn. Move plant or add shade. Do not cut burned leaves — they protect the plant."],
              ["Seedling protection","New seedlings need shade for 1–2 weeks before full sun exposure. Harden off gradually."],
              ["Sun tracking","Most vegetables need east-facing plots — morning sun, afternoon shade. Ideal for Malaysian climate."],
              ["UV for pest control","Very high UV can naturally reduce some fungal diseases. Avoid dense planting that blocks airflow in humid weather."],
            ].map(([t,d]) => (
              <div key={t} className="glass rounded-xl p-4 border border-border/40">
                <p className="font-bold text-sm mb-1">☀️ {t}</p>
                <p className="text-xs text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
