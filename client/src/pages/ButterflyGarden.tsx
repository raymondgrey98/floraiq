import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const BUTTERFLIES = [
  { name:"Common Mormon",scientific:"Papilio polytes",emoji:"🦋",host:["Citrus (Limau)","Wild lime","Curry leaf"],nectar:["Lantana","Pentas","Ixora"],colour:"Black with red/white spots",size:"Large",common:"Very common in Malaysian gardens" },
  { name:"Lime Butterfly",scientific:"Papilio demoleus",emoji:"🦋",host:["Citrus","Lemon","Pomelo","Lime"],nectar:["Lantana","Bougainvillea","Stachytarpheta"],colour:"Yellow with black spots",size:"Large",common:"Most common butterfly in Malaysian cities" },
  { name:"Mottled Emigrant",scientific:"Catopsilia pomona",emoji:"🦋",host:["Senna (Pokok Gelenggang)","Cassia"],nectar:["Lantana","Chromolaena","Asystasia"],colour:"Pale yellow to white",size:"Medium",common:"Mass migrating butterfly — sometimes swarms" },
  { name:"Plain Tiger",scientific:"Danaus chrysippus",emoji:"🦋",host:["Calotropis (Pokok Sutera)","Asclepias (Milkweed)"],nectar:["Lantana","Vernonia","Chromolaena"],colour:"Orange with black borders and white spots",size:"Medium",common:"Beautiful orange — milkweed essential for breeding" },
  { name:"Blue Pansy",scientific:"Junonia orithya",emoji:"🦋",host:["Hygrophila","Asystasia","Striga"],nectar:["Chromolaena","Stachytarpheta","Lantana"],colour:"Brown with brilliant blue eyespots",size:"Medium",common:"Striking blue eyespots on hindwings" },
  { name:"Great Eggfly",scientific:"Hypolimnas bolina",emoji:"🦋",host:["Asystasia","Portulaca","Sweet potato leaves"],nectar:["Lantana","Stachytarpheta","Pokok bunga"],colour:"Male: Black with white spots. Female: Brown/orange",size:"Large",common:"Males aggressively territorial" },
  { name:"Psyche",scientific:"Leptosia nina",emoji:"🦋",host:["Capparaceae family plants"],nectar:["Small flowers","Wild weeds"],colour:"White with tiny black spots",size:"Small",common:"Tiny fluttering white butterfly in forest edge" },
  { name:"Common Grass Yellow",scientific:"Eurema hecabe",emoji:"🦋",host:["Cassia","Mimosa","Acacia"],nectar:["Chromolaena","Pokok rumpai"],colour:"Bright yellow with black borders",size:"Small",common:"Most abundant small butterfly in Malaysia" },
];

const HOST_PLANTS = [
  { name:"Citrus (Limau)", emoji:"🍋", attracts:["Common Mormon","Lime Butterfly","Banded Swallowtail"], how:"Any citrus species. Pot or ground. Full sun.", buy:"Available at all nurseries in Malaysia" },
  { name:"Milkweed / Calotropis", emoji:"🌸", attracts:["Plain Tiger","Monarch (visitor)","Other Danaus"], how:"Full sun, drought tolerant once established", buy:"Search for 'Pokok Sutera Besar' at nurseries" },
  { name:"Lantana", emoji:"🌼", attracts:["MOST butterfly species as nectar plant"], how:"Full sun, drought tolerant, invasive — keep contained", buy:"Common at all nurseries — many colours" },
  { name:"Asystasia", emoji:"🌿", attracts:["Great Eggfly","Blue Pansy","Many grass-feeding species"], how:"Shade tolerant ground cover, spreads easily", buy:"Common garden weed — often already in garden" },
  { name:"Cassia / Senna", emoji:"🌳", attracts:["Mottled Emigrant","Grass Yellows","Many pierids"], how:"Medium tree — good shade and butterfly magnet", buy:"Cassia alata ('pokok gelenggang') at nurseries" },
  { name:"Sweet Potato", emoji:"🍠", attracts:["Great Eggfly larvae — will eat the leaves"], how:"Accept leaf damage from caterpillars as trade-off for butterflies", buy:"Common vegetable — grow intentionally as host" },
  { name:"Pentas", emoji:"🌸", attracts:["Most nectar-feeding butterflies"], how:"Full sun, regular water, excellent container plant", buy:"Very common at nurseries — long blooming period" },
  { name:"Ixora", emoji:"🌺", attracts:["Swallowtails","Skippers","Many species"], how:"Sun to partial shade, regular water", buy:"Common ornamental at all nurseries in Malaysia" },
];

const TIPS = ["Plant host plants (for caterpillars) AND nectar plants (for adults) — need both","Leave some areas wild and unmowed — butterflies need weeds too","Avoid all pesticides — they kill caterpillars instantly","Provide shallow water dish with pebbles for butterflies to drink","Stop pulling 'weeds' — Asystasia and Chromolaena are important host plants","Broken or overripe fruit attracts many species — leave some on ground","Plant in sunny spots — butterflies are cold-blooded and need warmth","Accept leaf damage from caterpillars — that's the whole point!"];

export default function ButterflyGarden() {
  const [tab, setTab] = useState<"guide"|"butterflies"|"plants">("guide");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🦋</span>
          <div><h1 className="text-xl font-bold">Butterfly Garden</h1><p className="text-xs text-muted-foreground">Attract butterflies to your Malaysian garden</p></div>
        </div>
        <div className="container pb-3 flex gap-2">
          {[["guide","🌱 Guide"],["butterflies","🦋 Species"],["plants","🌿 Plants"]].map(([v,l]) => (
            <button type="button" key={v} onClick={() => setTab(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${tab === v ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="container py-4 max-w-4xl">
        {tab === "guide" && (
          <div className="space-y-4">
            <div className="glass rounded-xl p-5 border border-emerald-500/20"><h3 className="font-bold mb-4">🌸 How to attract butterflies in Malaysia</h3><ul className="space-y-2">{TIPS.map(t => <li key={t} className="flex gap-2 text-sm"><span className="text-emerald-400 flex-shrink-0">✓</span>{t}</li>)}</ul></div>
            <div className="glass rounded-xl p-5 border border-border/50"><h3 className="font-bold mb-3">What you need</h3><div className="grid grid-cols-2 gap-3">{[["🌿 Host plants","Where females lay eggs — caterpillars eat these"],["🌸 Nectar plants","Adult butterflies feed on flowers"],["☀️ Sunny spot","Butterflies need warmth — south-facing"],["💧 Water source","Shallow dish with pebbles or mud puddle"]].map(([e,d]) => <div key={e} className="glass rounded-lg p-3 border border-border/40"><p className="font-semibold text-sm">{e}</p><p className="text-xs text-muted-foreground">{d}</p></div>)}</div></div>
          </div>
        )}
        {tab === "butterflies" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BUTTERFLIES.map(b => (
              <div key={b.scientific} className="glass rounded-xl p-4 border border-border/40">
                <div className="flex items-start gap-3"><span className="text-3xl">{b.emoji}</span><div><p className="font-bold">{b.name}</p><p className="text-xs italic text-muted-foreground">{b.scientific}</p><p className="text-xs text-muted-foreground">{b.colour} · {b.size}</p></div></div>
                <div className="mt-3 space-y-1.5">
                  <div><p className="text-xs font-bold text-green-400">🌿 Host plants (for caterpillars)</p><p className="text-xs text-muted-foreground">{b.host.join(", ")}</p></div>
                  <div><p className="text-xs font-bold text-pink-400">🌸 Nectar plants (for adults)</p><p className="text-xs text-muted-foreground">{b.nectar.join(", ")}</p></div>
                  <p className="text-xs text-blue-300">💡 {b.common}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === "plants" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HOST_PLANTS.map(p => (
              <div key={p.name} className="glass rounded-xl p-4 border border-border/40">
                <div className="flex items-center gap-2 mb-2"><span className="text-2xl">{p.emoji}</span><p className="font-bold text-sm">{p.name}</p></div>
                <p className="text-xs font-bold text-emerald-400 mb-1">Attracts: {p.attracts.join(", ")}</p>
                <p className="text-xs text-muted-foreground">{p.how}</p>
                <p className="text-xs text-blue-300 mt-1">Buy: {p.buy}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
