import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const SARAWAK_RAIN: Record<string, number[]> = {
  "Kuching": [590,390,330,290,240,200,190,210,280,380,440,530],
  "Miri": [310,190,220,210,190,170,150,180,230,290,360,390],
  "Sibu": [360,260,270,250,200,190,170,190,240,300,380,410],
  "Bintulu": [350,250,250,230,210,180,160,190,240,320,390,420],
  "Sri Aman": [480,350,320,290,250,210,190,220,290,380,450,510],
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const CROP_WATER: Record<string, { mmPerWeek: number; season: string; notes: string }> = {
  "Padi (Rice)": { mmPerWeek:40, season:"Oct–Mar (Rendeng), Apr–Sep (Gadu)", notes:"Needs standing water. Rainfall during Rendeng usually sufficient in Kuching." },
  "Corn": { mmPerWeek:30, season:"Any — 90 day crop", notes:"Sensitive to drought at pollination stage. Supplement if <25mm/week." },
  "Tomato": { mmPerWeek:25, season:"Mar–Aug (drier period)", notes:"Too much rain = blossom drop, fungal disease. Best in drier months with drip irrigation." },
  "Chili": { mmPerWeek:25, season:"All year", notes:"Waterlogged roots = death. Raised beds essential during monsoon." },
  "Kangkung": { mmPerWeek:35, season:"All year", notes:"Loves water. Grows fastest during heavy monsoon. Very low effort." },
  "Cassava": { mmPerWeek:20, season:"All year — 8-12 months", notes:"Drought tolerant. Does well in dry season once established." },
  "Sweet Potato": { mmPerWeek:25, season:"Jun–Oct", notes:"Tuber quality better in drier conditions. Good transition season crop." },
  "Ginger/Turmeric": { mmPerWeek:30, season:"Mar–Dec", notes:"Waterlogging = rhizome rot. Well-drained soil essential. Under canopy best." },
  "Durian": { mmPerWeek:30, season:"Fruit: May–Aug", notes:"Dry spell before flowering triggers blooming (Oct–Jan). Then needs rain." },
  "Rambutan": { mmPerWeek:25, season:"Fruit: Jun–Aug", notes:"Uniform rainfall preferred. Stress can trigger off-season fruiting." },
};

export default function RainfallPlanner() {
  const [location, setLocation] = useState("Kuching");
  const [crop, setCrop] = useState(Object.keys(CROP_WATER)[0]);
  const [tab, setTab] = useState<"chart"|"crops"|"tips">("chart");
  const currentMonth = new Date().getMonth();

  const rain = SARAWAK_RAIN[location];
  const cropData = CROP_WATER[crop];
  const cropMonthlyNeed = cropData.mmPerWeek * 4.33;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🌧️</span>
          <div><h1 className="text-xl font-bold">Rainfall Planner</h1><p className="text-xs text-muted-foreground">Plan irrigation around Sarawak rainfall patterns</p></div>
        </div>
        <div className="container pb-3 flex gap-2 overflow-x-auto">
          {[["chart","📊 Chart"],["crops","🌱 Crops"],["tips","💡 Tips"]].map(([v,l]) => (
            <button type="button" key={v} onClick={() => setTab(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${tab === v ? "bg-blue-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="container py-6 max-w-3xl space-y-5">
        {tab === "chart" && <>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(SARAWAK_RAIN).map(loc => (
              <button type="button" key={loc} onClick={() => setLocation(loc)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${location === loc ? "bg-blue-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{loc}</button>
            ))}
          </div>
          <div className="glass rounded-xl p-5 border border-blue-500/30">
            <h3 className="font-bold mb-1">{location} — Monthly Rainfall (mm)</h3>
            <p className="text-xs text-muted-foreground mb-4">Average historical. Source: Malaysian Meteorological Dept (est.)</p>
            <div className="flex items-end gap-1 h-32">
              {rain.map((mm, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className={`w-full rounded-t-sm ${i === currentMonth ? "bg-blue-400" : "bg-blue-400/50"}`} style={{height:`${(mm / Math.max(...rain)) * 112}px`}} />
                  <span className={`text-[8px] ${i === currentMonth ? "text-blue-400 font-bold" : "text-muted-foreground"}`}>{MONTHS[i]}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Driest: {MONTHS[rain.indexOf(Math.min(...rain))]} ({Math.min(...rain)}mm)</span>
              <span>Wettest: {MONTHS[rain.indexOf(Math.max(...rain))]} ({Math.max(...rain)}mm)</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {MONTHS.map((m,i) => (
              <div key={m} className={`glass rounded-lg p-3 border ${i === currentMonth ? "border-blue-500/50" : "border-border/30"} flex justify-between items-center`}>
                <span className={`text-sm ${i === currentMonth ? "font-bold text-blue-400" : "text-muted-foreground"}`}>{m}</span>
                <span className={`font-bold ${rain[i] > 350 ? "text-blue-400" : rain[i] > 200 ? "text-cyan-400" : "text-amber-400"}`}>{rain[i]}mm</span>
              </div>
            ))}
          </div>
        </>}
        {tab === "crops" && <>
          <div><label className="text-sm font-bold block mb-2">Select Crop</label>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(CROP_WATER).map(c => (
                <button type="button" key={c} onClick={() => setCrop(c)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${crop === c ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="glass rounded-xl p-5 border border-emerald-500/30 space-y-3">
            <h3 className="font-bold text-lg">{crop}</h3>
            {[["💧 Weekly Water Need",`${cropData.mmPerWeek} mm/week (${cropMonthlyNeed.toFixed(0)} mm/month)`],["📅 Best Season",cropData.season]].map(([l,v]) => (
              <div key={String(l)} className="glass rounded-lg p-3 border border-border/40"><p className="text-xs text-muted-foreground mb-1">{l}</p><p className="font-bold text-sm">{v}</p></div>
            ))}
            <div className="glass rounded-lg p-3 border border-blue-500/20"><p className="text-xs text-blue-300">💡 {cropData.notes}</p></div>
          </div>
          <div className="glass rounded-xl p-5 border border-border/40">
            <div className="flex gap-2 flex-wrap mb-3">
              {Object.keys(SARAWAK_RAIN).map(loc => (
                <button type="button" key={loc} onClick={() => setLocation(loc)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${location === loc ? "bg-blue-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{loc}</button>
              ))}
            </div>
            <p className="font-bold text-sm mb-3">Monthly Irrigation Need — {location}</p>
            <div className="space-y-2">
              {MONTHS.map((m, i) => {
                const surplus = rain[i] - cropMonthlyNeed;
                return (
                  <div key={m}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className={i === currentMonth ? "text-blue-400 font-bold" : "text-muted-foreground"}>{m}</span>
                      <span className={surplus >= 0 ? "text-green-400" : "text-red-400"}>{surplus >= 0 ? `+${surplus.toFixed(0)}mm surplus` : `${Math.abs(surplus).toFixed(0)}mm deficit`}</span>
                    </div>
                    <div className="h-1.5 bg-border/30 rounded-full"><div className={`h-full rounded-full ${surplus >= 0 ? "bg-blue-400" : "bg-red-400"}`} style={{width:`${Math.min((rain[i]/Math.max(...rain))*100,100)}%`}} /></div>
                  </div>
                );
              })}
            </div>
          </div>
        </>}
        {tab === "tips" && (
          <div className="space-y-3">
            {[["Monsoon Irrigation Rule","Nov–Mar in Kuching = Northeast Monsoon. Most vegetables need NO irrigation. Focus on drainage instead."],["Dry Spell Planning","Jun–Aug = driest months. Install drip irrigation OR plant drought-tolerant crops (cassava, corn, chili)."],["Rainwater Harvesting","A 10m² roof area collects ~6,000L in a 600mm rain month. Free irrigation for small gardens."],["Mulching (Top Tip)","10cm of mulch (rice straw, dry leaves) reduces water evaporation by 70%. Less irrigation needed."],["Raised Beds in Monsoon","Never plant vegetables in flat ground during heavy rain season. Raised beds 30-45cm high prevent root rot."],["Sarawak Timing Strategy","Plant fast-growing vegetables (kangkung, mustard, lettuce) in September for harvest before peak monsoon."],["Check Real Rainfall","Visit www.met.gov.my for actual rainfall data. Kuching gets 4,500mm/year — among highest in Malaysia."]].map(([title, tip]) => (
              <div key={String(title)} className="glass rounded-xl p-4 border border-blue-500/20">
                <p className="font-bold text-sm mb-1">{title}</p>
                <p className="text-sm text-muted-foreground">{tip}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
