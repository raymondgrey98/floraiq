import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const SEEDS = [
  { crop:"Chili / Cili", emoji:"🌶️", daysGerm:"7–14", tempC:"25–32", depth:"5mm", light:"Indirect after germination", time:"Plant year-round in Malaysia. Peak: Feb–Apr.", direct:false, method:"Sow in seedling tray. Transplant at 4 weeks.", tip:"Soak seeds 4 hours before sowing — speeds germination. Chili seeds are slow — be patient." },
  { crop:"Tomato", emoji:"🍅", daysGerm:"5–10", tempC:"22–30", depth:"5mm", light:"Full sun after germination", time:"Mar–Aug (drier period). Avoid heavy monsoon.", direct:false, method:"Sow in tray. Transplant at 3–4 weeks when 10cm tall.", tip:"Never let seedlings dry out. Don't overwater either — mould kills. Ventilate seedling trays." },
  { crop:"Kangkung", emoji:"🌿", daysGerm:"3–5", tempC:"25–35", depth:"1cm", light:"Full sun", time:"Year-round. Fastest crop in Malaysia.", direct:true, method:"Direct sow in moist soil or water. No transplanting needed.", tip:"Fastest germinator in Malaysia. Scatter seeds thickly. Harvest outer leaves weekly and it regrows indefinitely." },
  { crop:"Long Beans / Kacang Panjang", emoji:"🫘", daysGerm:"3–7", tempC:"25–35", depth:"2–3cm", light:"Full sun", time:"Year-round. Needs trellis.", direct:true, method:"Direct sow 3 seeds per hole at trellis base. Thin to 2 seedlings.", tip:"Don't soak — they rot. Plant directly. Germination is fast. Harvest pods before they go stringy." },
  { crop:"Cucumber / Timun", emoji:"🥒", daysGerm:"3–7", tempC:"25–35", depth:"1cm", light:"Full sun", time:"Year-round. Best Mar–Sep.", direct:true, method:"Sow 2–3 seeds per hill. Thin to 1 plant. Add trellis.", tip:"Germinate fast. Harvest early and often — cucumber left on vine stops plant producing more." },
  { crop:"Corn / Jagung", emoji:"🌽", daysGerm:"5–10", tempC:"25–32", depth:"3–4cm", light:"Full sun", time:"Year-round but best during dry months.", direct:true, method:"Plant in blocks (not rows) for wind pollination. 30cm apart.", tip:"Plant in blocks minimum 4x4 plants for good pollination. Single row = poor corn set." },
  { crop:"Lettuce", emoji:"🥬", daysGerm:"5–10", tempC:"18–25", depth:"Surface (light needed)", light:"Bright indirect or morning sun only", time:"Oct–Feb (cooler months) or highland areas only in Malaysia.", direct:false, method:"Scatter on surface — don't cover. Keep moist with misting.", tip:"Needs cool weather. Lowland Malaysia is too hot in dry season. Try mountain varieties or grow in shade." },
  { crop:"Kailan (Chinese Kale)", emoji:"🥬", daysGerm:"5–7", tempC:"20–30", depth:"5mm", light:"Full sun to partial", time:"Year-round. Best in cooler months.", direct:true, method:"Direct sow or tray. Harvest entire plant or cut and come again.", tip:"Very fast from seed to harvest — 45–60 days. Harvest outer leaves to extend production." },
  { crop:"Moringa / Kelor", emoji:"🌿", daysGerm:"7–14", tempC:"25–35", depth:"2cm", light:"Full sun", time:"Year-round. Very fast growing tree.", direct:true, method:"Plant in permanent spot — grows into tree. Or cuttings for faster results.", tip:"Seeds are large — visible germination. Or use stem cuttings (60cm cutting) — roots in 2 weeks." },
  { crop:"Ginger / Halia", emoji:"🫚", daysGerm:"14–21 (rhizome)", tempC:"22–30", depth:"5cm", light:"Partial shade", time:"Jan–Mar for harvest by Oct–Dec.", direct:false, method:"Plant rhizome (not seed). Each piece needs 1–2 eyes (buds). Pre-sprout in sawdust.", tip:"Not grown from seed — plant fresh rhizome sections. Needs shade and consistent moisture. Don't overwater before sprouting." },
  { crop:"Pumpkin / Labu", emoji:"🎃", daysGerm:"5–10", tempC:"25–35", depth:"2cm", light:"Full sun", time:"Year-round. Give it space — sprawls widely.", direct:true, method:"Sow 2 seeds per hill. Thin to 1. Give 2m between plants.", tip:"Very space hungry. Grows on trellis to save space. Hand-pollinate flowers for better fruit set." },
  { crop:"Basil / Selasih", emoji:"🌿", daysGerm:"5–10", tempC:"24–32", depth:"Surface", light:"Full sun to partial", time:"Year-round. Harvest constantly.", direct:false, method:"Scatter seeds on moist surface. Thin when 5cm tall. Pinch flowers to keep bushy.", tip:"Pinch flower buds immediately — once basil flowers, leaves go bitter. Keep pinching for continuous harvest." },
];

const TRAYS_GUIDE = [
  "Use any container with drainage holes — old egg cartons, yogurt tubs, plastic containers",
  "Use seedling mix OR: 50% compost + 50% perlite/sand (better drainage than garden soil)",
  "Label everything — all seedlings look the same at first",
  "Water from below (set tray in water) to avoid washing seeds to one side",
  "Cover with plastic wrap until germination — removes the need to water daily",
  "Remove cover immediately when seedlings emerge — they need light and airflow or they go 'leggy'",
  "Malaysian heat note: Seedling trays on concrete floors get too hot — raise on a rack or shade cloth",
  "Harden off before transplanting: move seedlings to dappled sun for 3 days, then full sun for 3 days",
];

export default function SeedStarting() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(SEEDS[0]);
  const [tab, setTab] = useState<"seeds"|"guide">("seeds");

  const filtered = SEEDS.filter(s =>
    s.crop.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🌱</span>
          <div><h1 className="text-xl font-bold">Seed Starting Guide</h1><p className="text-xs text-muted-foreground">Germinate & grow from seed — Malaysia tropical guide</p></div>
        </div>
        <div className="container pb-3 space-y-2">
          <div className="flex gap-2">
            {[["seeds","🌱 All Seeds"],["guide","📋 Seedling Tray Guide"]].map(([v,l]) => (
              <button type="button" key={v} onClick={() => setTab(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${tab === v ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{l}</button>
            ))}
          </div>
          {tab === "seeds" && (
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search crop..." className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          )}
        </div>
      </div>

      <div className="container py-4 max-w-5xl">
        {tab === "seeds" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
              {filtered.map(s => (
                <button type="button" key={s.crop} onClick={() => setSelected(s)} className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.crop === s.crop ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/40 hover:border-emerald-500/30"}`}>
                  <span className="text-xl">{s.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{s.crop}</p>
                    <p className="text-xs text-muted-foreground">{s.daysGerm} days germ · {s.direct ? "Direct sow" : "Tray start"}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="lg:col-span-2">
              <div className="glass rounded-xl p-5 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-3"><span className="text-4xl">{selected.emoji}</span><h2 className="text-xl font-bold">{selected.crop}</h2></div>
                <div className="grid grid-cols-2 gap-2">
                  {[["🌡️ Temp",`${selected.tempC}°C`],["⏱️ Germinates",`${selected.daysGerm} days`],["📏 Depth",selected.depth],["☀️ Light",selected.light],["📅 Best time",selected.time],["🌱 Method",selected.direct ? "Direct sow" : "Seedling tray"]].map(([l,v]) => (
                    <div key={String(l)} className="glass rounded-lg p-2 border border-border/40"><p className="text-[10px] text-muted-foreground">{l}</p><p className="text-xs font-bold">{v}</p></div>
                  ))}
                </div>
                <div className="glass rounded-lg p-3 border border-blue-500/20"><p className="text-xs font-bold text-blue-400 mb-1">📋 Method</p><p className="text-sm">{selected.method}</p></div>
                <div className="glass rounded-lg p-3 border border-amber-500/20"><p className="text-xs text-amber-300">💡 {selected.tip}</p></div>
              </div>
            </div>
          </div>
        )}

        {tab === "guide" && (
          <div className="space-y-3">
            <div className="glass rounded-xl p-4 border border-blue-500/20 mb-2"><p className="text-xs text-blue-300">Seedling trays let you start seeds in controlled conditions before transplanting to the garden. Critical for slow germinators (chili, tomato) and valuable seeds where waste is costly.</p></div>
            {TRAYS_GUIDE.map((tip, i) => (
              <div key={i} className="glass rounded-xl p-4 border border-border/40 flex gap-3">
                <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center flex-shrink-0">{i+1}</span>
                <p className="text-sm text-muted-foreground">{tip}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
