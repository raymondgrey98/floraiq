import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const STYLES = [
  { name:"Chokkan (Formal Upright)", emoji:"🌲", desc:"Perfectly straight trunk. Classic formal style. Good for beginners.", trees:["Juniper","Pine","Ficus"] },
  { name:"Moyogi (Informal Upright)", emoji:"🌿", desc:"Natural curved trunk. Most popular style. Mimics wild trees.", trees:["Ficus","Bougainvillea","Fukien Tea"] },
  { name:"Shakan (Slanting)", emoji:"⬅️", desc:"Trunk leans at angle as if blown by wind.", trees:["Juniper","Ficus retusa","Serissa"] },
  { name:"Kengai (Cascade)", emoji:"⬇️", desc:"Branches drape below pot level. Mimics cliff-side trees.", trees:["Juniper","Cotoneaster","Maple"] },
  { name:"Literati (Bunjin)", emoji:"✍️", desc:"Thin tall trunk, sparse branches. Artistic, poetic style.", trees:["Pine","Ficus","Casuarina"] },
  { name:"Hokidachi (Broom)", emoji:"🧹", desc:"Fan-shaped crown like an upturned broom. Excellent for deciduous trees.", trees:["Ulmus (Elm)","Zelkova","Chinese Elm"] },
];

const TROPICAL: { name: string; malay: string; difficulty: string; sun: string; water: string; notes: string }[] = [
  { name:"Ficus (Rubber Tree Group)", malay:"Pokok getah / Ara", difficulty:"Easy", sun:"Full to partial", water:"Moderate", notes:"BEST beginner tropical bonsai. Very forgiving. Aerial roots make stunning specimens. Ficus microcarpa most popular." },
  { name:"Fukien Tea (Carmona retusa)", malay:"Teh Fukien", difficulty:"Medium", sun:"Full sun", water:"Regular", notes:"Tiny white flowers year-round. Red berries. Great for Malaysia — loves tropical heat. Popular in Chinese bonsai tradition." },
  { name:"Bougainvillea", malay:"Bunga kertas", difficulty:"Easy", sun:"Full sun", water:"Let dry between watering", notes:"Drought stress triggers spectacular flowering. Very easy to shape. Fast growing. Thorns need careful handling." },
  { name:"Serissa (Tree of a Thousand Stars)", malay:"Serissa", difficulty:"Medium", sun:"Bright indirect to full", water:"Consistent — hates drying out", notes:"Tiny white flowers. Very sensitive to root disturbance. Don't move or rotate when flowering." },
  { name:"Wrightia religiosa (Water Jasmine)", malay:"Pokok mentega", difficulty:"Easy", sun:"Full sun", water:"Regular", notes:"Malaysia native. White fragrant flowers. Very popular in Southeast Asian bonsai. Easy to find locally." },
  { name:"Casuarina (She-Oak)", malay:"Ru laut / Aru", difficulty:"Medium", sun:"Full sun", water:"Moderate", notes:"Pine-like appearance with needle foliage. Coastal species — salt tolerant. Fine texture excellent for literati style." },
  { name:"Tamarind (Asam Jawa)", malay:"Asam jawa", difficulty:"Medium", sun:"Full sun", water:"Let dry between", notes:"Gnarly thick trunk develops fast. Fine pinnate leaves. Pods edible. Excellent aged-look trunk character." },
  { name:"Averrhoa (Star Fruit)", malay:"Belimbing", difficulty:"Easy", sun:"Full sun", water:"Regular", notes:"Produces tiny edible star fruit on bonsai. Attractive compound leaves. Good for edible bonsai display." },
];

const CARE = [
  { task:"Watering", freq:"Daily in Malaysia", tip:"Tropical heat = fast drying. Water when top 1cm is dry. Never let bonsai pot sit in standing water — root rot." },
  { task:"Fertilizing", freq:"Every 2 weeks (growing)", tip:"Balanced NPK during growing season. Low nitrogen before and after flowering. Organic liquid best for bonsai." },
  { task:"Repotting", freq:"Every 1-2 years", tip:"Tropical bonsai grow faster — may need annual repot. Prune roots by 30%. Always repot in spring before growth flush." },
  { task:"Pruning", freq:"Monthly maintenance", tip:"Pinch new shoots when 3-4 leaves appear to maintain shape. Major structural pruning once yearly (end of fruiting/flowering)." },
  { task:"Wiring", freq:"As needed", tip:"Wrap wire at 45°. Aluminum wire for thin, copper for thick branches. Remove before wire cuts into bark (usually 3-4 months)." },
  { task:"Sunlight", freq:"Daily", tip:"Most tropical bonsai need 4-6 hrs direct morning sun. Protect from harsh 12-3pm sun in Sarawak's extreme heat. Move indoors is fine short-term." },
];

const TOOLS: { tool: string; cost: string; use: string }[] = [
  { tool:"Concave branch cutters", cost:"RM 30-80", use:"Cleanest cut for removing branches — creates concave wound that heals flush" },
  { tool:"Wire cutters", cost:"RM 15-30", use:"Cut wire without damaging branches" },
  { tool:"Bonsai scissors", cost:"RM 20-50", use:"Precision leaf and shoot pruning" },
  { tool:"Root hook/rake", cost:"RM 15-30", use:"Untangle and spread roots during repotting" },
  { tool:"Aluminum wire (1-3mm)", cost:"RM 15-25/roll", use:"Shaping branches — use smallest gauge that holds" },
  { tool:"Bonsai soil (akadama or DIY)", cost:"RM 30-80/bag", use:"Drains fast but retains enough moisture. In Malaysia: 50% perlite + 50% coarse sand works well" },
];

export default function BonsaiGuide() {
  const [tab, setTab] = useState<"trees"|"styles"|"care"|"tools">("trees");
  const [selected, setSelected] = useState(TROPICAL[0]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🌳</span>
          <div><h1 className="text-xl font-bold">Bonsai Guide</h1><p className="text-xs text-muted-foreground">Tropical bonsai for Malaysia — styles, care, tools</p></div>
        </div>
        <div className="container pb-3 flex gap-2 overflow-x-auto">
          {[["trees","🌱 Trees"],["styles","🎨 Styles"],["care","🪴 Care"],["tools","🔧 Tools"]].map(([v,l]) => (
            <button type="button" key={v} onClick={() => setTab(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${tab === v ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="container py-4 max-w-5xl space-y-4">
        {tab === "trees" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              {TROPICAL.map(t => (
                <button type="button" key={t.name} onClick={() => setSelected(t)} className={`w-full text-left glass rounded-xl p-3 border transition-all ${selected.name === t.name ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/40 hover:border-emerald-500/30"}`}>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.malay} · {t.difficulty}</p>
                </button>
              ))}
            </div>
            <div className="lg:col-span-2 glass rounded-xl p-5 border border-emerald-500/30 space-y-3">
              <div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-sm text-muted-foreground italic">{selected.malay}</p></div>
              <div className="grid grid-cols-3 gap-2">
                {[["Difficulty",selected.difficulty],["Sun",selected.sun],["Water",selected.water]].map(([l,v]) => (
                  <div key={String(l)} className="glass rounded-lg p-2 border border-border/30 text-center"><p className="text-[10px] text-muted-foreground">{l}</p><p className="text-xs font-bold">{v}</p></div>
                ))}
              </div>
              <div className="glass rounded-lg p-3 border border-blue-500/20"><p className="text-xs text-blue-300">💡 {selected.notes}</p></div>
            </div>
          </div>
        )}
        {tab === "styles" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {STYLES.map(s => (
              <div key={s.name} className="glass rounded-xl p-4 border border-border/40">
                <div className="flex items-center gap-2 mb-2"><span className="text-2xl">{s.emoji}</span><p className="font-bold text-sm">{s.name}</p></div>
                <p className="text-xs text-muted-foreground mb-2">{s.desc}</p>
                <div className="flex gap-1 flex-wrap">{s.trees.map(t => <span key={t} className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">{t}</span>)}</div>
              </div>
            ))}
          </div>
        )}
        {tab === "care" && (
          <div className="space-y-3">
            {CARE.map(c => (
              <div key={c.task} className="glass rounded-xl p-4 border border-border/40">
                <div className="flex justify-between items-center mb-1"><p className="font-bold">{c.task}</p><span className="text-xs text-emerald-400">{c.freq}</span></div>
                <p className="text-sm text-muted-foreground">{c.tip}</p>
              </div>
            ))}
            <div className="glass rounded-xl p-4 border border-amber-500/20"><p className="text-xs text-amber-300">⚠️ Kuching bonsai tip: Our high humidity is a double-edged sword. Great for tropical species, but fungal disease risk is high. Ensure good air circulation. Water in morning, not evening.</p></div>
          </div>
        )}
        {tab === "tools" && (
          <div className="space-y-3">
            <div className="glass rounded-xl p-4 border border-blue-500/20"><p className="text-xs text-blue-300">💡 Where to buy in Sarawak: BM Nursery (Kuching), Metrocity garden shops, Shoppe/Lazada for tools and wire. Japan/Taiwan tools are best quality — worth the investment.</p></div>
            {TOOLS.map(t => (
              <div key={t.tool} className="glass rounded-xl p-4 border border-border/40">
                <div className="flex justify-between items-center mb-1"><p className="font-bold text-sm">{t.tool}</p><span className="text-xs font-bold text-emerald-400">{t.cost}</span></div>
                <p className="text-xs text-muted-foreground">{t.use}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
