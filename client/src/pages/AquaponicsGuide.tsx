import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const SYSTEMS = [
  { id:"media", name:"Media Bed (Flood & Drain)", emoji:"🪨", scale:"Home to small farm", cost:"RM 500-3000", difficulty:"Easy", fish:["Tilapia","Catfish (keli)","Carp"], plants:["Tomato","Chili","Cucumber","Herbs","Kangkung","Lettuce"], how:"Fish tank → pump → grow bed filled with gravel/clay balls → water floods, then drains back → cycle repeats.", pros:["Most forgiving for beginners","Good for heavy feeders like tomato","No clogging issues","Easy to manage"], cons:["Uses most water of all systems","Heavy grow bed — structural support needed","Harder to scale up"] },
  { id:"nft", name:"NFT (Nutrient Film Technique)", emoji:"💧", scale:"Medium to large", cost:"RM 1000-5000", difficulty:"Medium", fish:["Tilapia","Catfish"], plants:["Lettuce","Herbs","Kangkung","Spinach"], how:"Thin film of nutrient water flows through angled channels continuously. Roots hang in channels.", pros:["Very water efficient","Clean and easy to harvest","Easy to scale","Good for leafy greens"], cons:["No buffer — pump failure = crop death in hours","Not for fruiting plants","Roots can clog channels"] },
  { id:"raft", name:"Deep Water Culture (Raft)", emoji:"🛶", scale:"Commercial", cost:"RM 2000-10000+", difficulty:"Medium", fish:["Tilapia","Catfish","Carp"], plants:["Lettuce","Kangkung","Herbs","Watercress"], how:"Plants float on foam rafts in deep nutrient-rich water. Roots dangle in water.", pros:["Very high yield for leafy greens","Low maintenance","Stable water chemistry","Used in commercial operations"], cons:["Disease spreads fast (connected water)","Not suitable for fruiting plants","Needs good aeration"] },
];

const FISH = [
  { name:"Tilapia (Nile)", malay:"Tilapia", emoji:"🐟", grow:"6-8 months to harvest", stocking:"20-30 fish per 1000L", feed:"Pellet. Omnivore — easy.", temp:"25-32°C ideal — perfect for Malaysia", note:"#1 aquaponics fish in Malaysia. Very hardy, fast growing, eats almost anything. Red tilapia more marketable." },
  { name:"Catfish (Keli)", malay:"Ikan Keli", emoji:"🐟", grow:"4-6 months", stocking:"50-100 fish per 1000L (high density tolerant)", feed:"Pellet or organic waste. Very easy.", temp:"24-32°C", note:"Extremely hardy. Tolerates low oxygen. Popular in Malaysia. Can be high density farmed." },
  { name:"Carp / Kap", malay:"Ikan Kap", emoji:"🐟", grow:"8-12 months", stocking:"15-20 fish per 1000L", feed:"Pellet and plants. Bottom feeder.", temp:"20-30°C", note:"Good bottom cleaner. Better in bigger systems. Bighead carp very efficient filter feeder." },
  { name:"Jade Perch", malay:"NA", emoji:"🐟", grow:"9-12 months", stocking:"10-15 fish per 1000L", feed:"Omnivore pellet", temp:"20-35°C", note:"Australian native. Very high omega-3. Gaining popularity in Malaysia. More expensive fingerlings." },
];

const PLANTS_AQUA = [
  { name:"Kangkung", grow:"21 days harvest", note:"Best aquaponics plant in Malaysia. Extremely fast, grows in NFT or raft perfectly." },
  { name:"Lettuce", grow:"28-35 days", note:"Very high value crop. Multiple harvests. Use NFT or raft system." },
  { name:"Basil & Herbs", grow:"30-45 days", note:"High value. Herbs love aquaponics. Very aromatic — better than soil grown." },
  { name:"Tomato", grow:"60-80 days", note:"Needs media bed. High nutrient demand. Very productive once established." },
  { name:"Chili", grow:"75-90 days", note:"Media bed only. Long production. Very profitable." },
  { name:"Okra", grow:"55 days", note:"Very productive in media bed. Harvest daily." },
];

export default function AquaponicsGuide() {
  const [tab, setTab] = useState<"systems"|"fish"|"plants"|"start">("start");
  const [selectedSystem, setSelectedSystem] = useState(SYSTEMS[0]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🐟</span>
          <div><h1 className="text-xl font-bold">Aquaponics Guide</h1><p className="text-xs text-muted-foreground">Fish + plants — sustainable food system for Malaysia</p></div>
        </div>
        <div className="container pb-3 flex gap-2 overflow-x-auto">
          {[["start","🚀 Start"],["systems","⚙️ Systems"],["fish","🐟 Fish"],["plants","🌿 Plants"]].map(([v,l]) => <button type="button" key={v} onClick={() => setTab(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${tab === v ? "bg-cyan-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{l}</button>)}
        </div>
      </div>
      <div className="container py-6 max-w-4xl space-y-5">
        {tab === "start" && <>
          <div className="glass rounded-xl p-5 border border-cyan-500/30">
            <h3 className="font-bold text-lg mb-3">What is Aquaponics?</h3>
            <p className="text-sm text-muted-foreground mb-4">Fish produce waste → bacteria convert to nutrients → plants absorb nutrients and clean water → clean water returns to fish. A closed loop system that grows BOTH fish and vegetables simultaneously.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[["🐟","Fish excrete waste"],["🦠","Bacteria convert to nitrate"],["🌿","Plants absorb nutrients"],["💧","Clean water returns"]].map(([e,t]) => <div key={t} className="glass rounded-lg p-3 border border-border/40"><p className="text-2xl mb-1">{e}</p><p className="text-xs text-muted-foreground">{t}</p></div>)}
            </div>
          </div>
          <div className="glass rounded-xl p-5 border border-emerald-500/20">
            <h3 className="font-bold mb-4">Beginner Starter System (RM 500-800)</h3>
            {[{n:1,t:"500L IBC tote tank or drum",d:"Second-hand IBC tank (RM 100-200) or plastic barrel. Fish live here."},
              {n:2,t:"Grow bed (same size)",d:"Half of IBC cut off, or separate container. Fill with expanded clay (LECA) or gravel."},
              {n:3,t:"Water pump (RM 50-100)",d:"500-1000L/hr submersible pump. Run 24/7 or on timer."},
              {n:4,t:"Air pump + airstones",d:"Oxygenate fish water. Critical — fish die without oxygen."},
              {n:5,t:"Test kits (ammonia, nitrite, nitrate, pH)",d:"Monitor water chemistry especially in first 4-6 weeks (cycling period)."},
              {n:6,t:"20-30 tilapia fingerlings",d:"Source from: Jabatan Perikanan Sarawak or fish farms. RM 1-3 each."}].map(s => (
              <div key={s.n} className="flex gap-3 mb-3"><div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center flex-shrink-0 text-sm">{s.n}</div><div><p className="font-semibold text-sm">{s.t}</p><p className="text-xs text-muted-foreground">{s.d}</p></div></div>
            ))}
          </div>
          <div className="glass rounded-xl p-5 border border-amber-500/20">
            <h3 className="font-bold mb-3">⚠️ The Cycling Period (4-6 weeks)</h3>
            <p className="text-sm text-muted-foreground">Before adding fish and plants in full, the system needs to "cycle" — beneficial bacteria must establish in the grow bed. Ammonia spikes then drops as bacteria colonize. Test weekly. Don't add all fish at once.</p>
          </div>
        </>}
        {tab === "systems" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              {SYSTEMS.map(s => <button type="button" key={s.id} onClick={() => setSelectedSystem(s)} className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selectedSystem.id === s.id ? "border-cyan-500/60 bg-cyan-500/5" : "border-border/40 hover:border-cyan-500/30"}`}><span className="text-xl">{s.emoji}</span><div><p className="font-semibold text-sm">{s.name}</p><p className="text-xs text-muted-foreground">{s.cost} · {s.difficulty}</p></div></button>)}
            </div>
            <div className="lg:col-span-2">
              <div className="glass rounded-xl p-5 border border-cyan-500/30 space-y-3">
                <div className="flex items-center gap-3"><span className="text-3xl">{selectedSystem.emoji}</span><div><h2 className="text-xl font-bold">{selectedSystem.name}</h2><p className="text-xs text-muted-foreground">{selectedSystem.cost} · {selectedSystem.scale}</p></div></div>
                <div className="glass rounded-lg p-3 border border-border/40"><p className="text-xs font-bold text-muted-foreground mb-1">⚙️ How it works</p><p className="text-sm">{selectedSystem.how}</p></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass rounded-lg p-3 border border-green-500/20"><p className="text-xs font-bold text-green-400 mb-2">✅ Pros</p><ul>{selectedSystem.pros.map(p => <li key={p} className="text-xs text-muted-foreground">• {p}</li>)}</ul></div>
                  <div className="glass rounded-lg p-3 border border-red-500/20"><p className="text-xs font-bold text-red-400 mb-2">❌ Cons</p><ul>{selectedSystem.cons.map(c => <li key={c} className="text-xs text-muted-foreground">• {c}</li>)}</ul></div>
                </div>
                <div><p className="text-xs font-bold text-muted-foreground mb-2">🐟 Best fish</p><div className="flex gap-2">{selectedSystem.fish.map(f => <span key={f} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{f}</span>)}</div></div>
                <div><p className="text-xs font-bold text-muted-foreground mb-2">🌿 Best plants</p><div className="flex flex-wrap gap-2">{selectedSystem.plants.map(p => <span key={p} className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">{p}</span>)}</div></div>
              </div>
            </div>
          </div>
        )}
        {tab === "fish" && <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{FISH.map(f => <div key={f.name} className="glass rounded-xl p-5 border border-blue-500/20"><div className="flex items-center gap-3 mb-3"><span className="text-3xl">{f.emoji}</span><div><p className="font-bold">{f.name}</p><p className="text-xs text-muted-foreground">{f.malay}</p></div></div><div className="space-y-2">{[["📅 Grow time",f.grow],["🐟 Stocking",f.stocking],["🌡️ Temperature",f.temp]].map(([l,v]) => <div key={String(l)} className="flex justify-between text-xs border-b border-border/20 py-1"><span className="text-muted-foreground">{l}</span><span>{v}</span></div>)}<p className="text-xs text-blue-300 mt-2">💡 {f.note}</p></div></div>)}</div>}
        {tab === "plants" && <div className="space-y-3">{PLANTS_AQUA.map(p => <div key={p.name} className="glass rounded-xl p-4 border border-emerald-500/20"><div className="flex justify-between items-center mb-1"><p className="font-bold">{p.name}</p><span className="text-xs text-emerald-400">{p.grow}</span></div><p className="text-sm text-muted-foreground">{p.note}</p></div>)}</div>}
      </div>
    </div>
  );
}
