import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const METHODS = [
  { id:"sun", name:"Sun Method", emoji:"☀️", accuracy:"Medium", steps:["Morning: Sun rises roughly East","Noon: Sun is roughly North in Malaysia (we're in Northern hemisphere near equator)","Afternoon: Sun sets roughly West","Use shadow stick: place 30cm stick upright. Mark shadow tip. Wait 15 min. Mark again. Line between marks runs East-West."], plants:[], tip:"In Malaysia near equator, sun path varies. Trust shadow stick method over rough directions." },
  { id:"stars", name:"Star Navigation", emoji:"⭐", accuracy:"High (night only)", steps:["Find Southern Cross (4 stars in cross pattern) — only in Southern hemisphere / equatorial","Long axis of Southern Cross points South","Orion's Belt: rises due East, sets due West — valid in Malaysia","North Star (Polaris) is very low on horizon in Malaysia — hard to use"], plants:[], tip:"In Malaysia we are near equator so both Polaris (North) and Southern Cross (South) are both usable but low." },
  { id:"moss", name:"Moss & Plant Method", emoji:"🌿", accuracy:"Low-Medium", steps:["MYTH BUSTED: Moss on North side of trees is NOT reliable in Malaysia","In Malaysia humid tropics, moss grows on all sides","Better indicator: Lichen and moss slightly thicker on south-facing side due to more shade","Tree canopy gaps: trees lean toward light (South in Malaysia)"], plants:["Moss on rocks — south side usually denser in Malaysia","Lianas climb toward the light source","Tree leans away from prevailing wind (usually southwest)"], tip:"Don't rely on moss alone. Use with other methods. Moss in tropics less directional than in temperate regions." },
  { id:"water", name:"Follow Water", emoji:"💧", accuracy:"High (to settlement)", steps:["Follow streams DOWNHILL always","Small stream → bigger stream → river","Rivers lead to settlements in Sarawak — Iban longhouses always near rivers","Coastal Sarawak: rivers flow West into South China Sea generally","Walk downstream unless you know the area well"], plants:["Mangroves indicate coast is near","Nipah palm = tidal river (near coast)","Bamboo often near water and human settlement"], tip:"Best survival navigation in Sarawak: follow water downstream. Most longhouses and roads are near rivers." },
  { id:"wind", name:"Wind Direction", emoji:"🌬️", accuracy:"Low (seasonal)", steps:["Sarawak has two monsoons: Northeast Monsoon (Nov-Feb) from northeast","Southwest Monsoon (May-Sep) from southwest","Wind direction tells you rough orientation during monsoon season","During transition: unreliable"], plants:["Trees permanently bent away from prevailing wind","Exposed ridge trees: stunted side faces prevailing wind","Coconut palms lean away from coast wind"], tip:"Wind in jungle is often blocked by trees. Better to find an open ridge or clearing to feel true wind direction." },
  { id:"ant", name:"Ant Trails", emoji:"🐜", accuracy:"Low-Medium", steps:["Some ant species follow North-South magnetic field lines","Leaf cutter ant trails run consistently — often toward food source","Following ant trails in jungle often leads to water or fruiting trees","Not reliable for cardinal directions but useful for finding resources"], plants:["Termite mounds often oriented North-South in open areas","Fire ant mound opening faces specific direction (varies by species)"], tip:"More useful for finding resources than cardinal directions. Follow large ant trails to find water and fruit." },
];

export default function NatureNavigation() {
  const [selected, setSelected] = useState(METHODS[0]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🧭</span>
          <div><h1 className="text-xl font-bold">Nature Navigation</h1><p className="text-xs text-muted-foreground">Find direction without compass — Borneo jungle</p></div>
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        <div className="glass rounded-xl p-3 border border-amber-500/20 mb-4"><p className="text-xs text-amber-300">⚠️ Always carry a compass and phone with offline maps (Maps.me, OsmAnd). These nature methods are BACKUP only. Tell someone your route before entering jungle.</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            {METHODS.map(m => (
              <button type="button" key={m.id} onClick={() => setSelected(m)}
                className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.id === m.id ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/40 hover:border-emerald-500/30"}`}>
                <span className="text-2xl">{m.emoji}</span>
                <div><p className="font-semibold text-sm">{m.name}</p><p className="text-xs text-muted-foreground">Accuracy: {m.accuracy}</p></div>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2">
            <div className="glass rounded-xl p-5 border border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-3"><span className="text-3xl">{selected.emoji}</span><div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-xs text-muted-foreground">Accuracy: {selected.accuracy}</p></div></div>
              <div>
                <p className="text-xs font-bold text-emerald-400 mb-2">📋 How to use</p>
                <div className="space-y-2">{selected.steps.map((s,i) => <div key={i} className="flex gap-3"><span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center flex-shrink-0">{i+1}</span><p className="text-sm text-muted-foreground">{s}</p></div>)}</div>
              </div>
              {selected.plants.length > 0 && (
                <div className="glass rounded-lg p-3 border border-border/40">
                  <p className="text-xs font-bold text-muted-foreground mb-2">🌿 Plant indicators</p>
                  <ul className="space-y-1">{selected.plants.map(p => <li key={p} className="text-xs text-muted-foreground flex gap-2"><span>•</span>{p}</li>)}</ul>
                </div>
              )}
              <div className="glass rounded-lg p-3 border border-blue-500/20"><p className="text-xs text-blue-300">💡 Malaysia tip: {selected.tip}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
