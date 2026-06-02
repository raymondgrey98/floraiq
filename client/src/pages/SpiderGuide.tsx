import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Search } from "lucide-react";

type Danger = "venomous" | "caution" | "harmless";
const D: Record<Danger, string> = { venomous:"bg-red-500/20 text-red-400 border-red-500/30", caution:"bg-amber-500/20 text-amber-400 border-amber-500/30", harmless:"bg-green-500/20 text-green-400 border-green-500/30" };

const SPIDERS = [
  { name:"Black Widow (Redback)", scientific:"Latrodectus hasselti", emoji:"🕷️", danger:"venomous" as Danger, found:"Dark sheltered spots, toilets, outdoor furniture, garden — rare in Sarawak", id:"Shiny black, red hourglass marking on underside. Female larger than male.", bite:"Painful. Muscle cramps, sweating, nausea within 30 min. Rarely fatal in healthy adults.", action:"Hospital immediately. Antivenom available. Keep calm, immobilise.", note:"Very rare in Malaysian Borneo. More common in Australia. Identify carefully — many harmless spiders are similar." },
  { name:"Brown Widow", scientific:"Latrodectus geometricus", emoji:"🕷️", danger:"venomous" as Danger, found:"Outdoor furniture, dark corners, plantation areas", id:"Brown/grey with orange hourglass. Less contrasting than black widow. Spiky egg sac.", bite:"Less dangerous than black widow. Local pain, muscle cramps.", action:"Hospital if significant pain. Wash bite with soap. Elevate limb.", note:"More common in Malaysia than black widow. Check outdoor chairs before sitting in plantation areas." },
  { name:"Huntsman Spider", scientific:"Sparassidae family", emoji:"🕷️", danger:"caution" as Danger, found:"Houses, under bark, in cars — extremely common everywhere in Malaysia", id:"Large, flat, hairy. Legs spread sideways not downward. Many species, various colours.", bite:"Defensive bite painful but rarely serious. Localised pain and swelling.", action:"Wash bite with soap. Ice pack. Hospital if severe reaction or with children.", note:"Very common in Malaysian homes. Looks scary but generally harmless. Eats cockroaches — beneficial." },
  { name:"Golden Silk Spider", scientific:"Nephila pilipes", emoji:"🕷️", danger:"caution" as Danger, found:"Forest edges, gardens, along jungle trails — very common Sarawak", id:"Large bright yellow/black female. Silver-grey body. Makes giant golden silk web.", bite:"Mild venom. Localised pain. Not considered medically significant.", action:"Clean bite area. Monitor for reaction.", note:"Makes some of the strongest silk of any spider. Web can trap small birds. Males tiny — often unseen on web." },
  { name:"Jumping Spider", scientific:"Salticidae family", emoji:"🕷️", danger:"harmless" as Danger, found:"Gardens, walls, leaves — everywhere in Malaysia", id:"Small, compact, large forward-facing eyes. Moves in short jumps. Many colourful species.", bite:"Harmless. May nip if squeezed. No venom of concern.", action:"No action needed.", note:"Among the most intelligent spiders. Can recognise human faces. Beautiful up close. Totally harmless." },
  { name:"Orb Weaver", scientific:"Araneidae family", emoji:"🕷️", danger:"harmless" as Danger, found:"Gardens, forest edges, near lights — very common", id:"Circular symmetric web. Round abdomen, often with patterns. Many species.", bite:"Harmless. Will not bite unless handled roughly.", action:"No action needed. Admire the web.", note:"Builds new web nightly. Eats web and rebuilds. Excellent pest control — catches hundreds of mosquitoes." },
  { name:"Trapdoor Spider", scientific:"Idiopidae family", emoji:"🕷️", danger:"caution" as Danger, found:"Forest soil, garden soil — underground burrows with hinged door", id:"Large, stocky, shiny. Brown-black. Found by disturbing soil.", bite:"Defensive bite. Significant pain. Not dangerous to healthy adults.", action:"Clean wound. Hospital if in remote area or child/elderly victim.", note:"Master builder. Silk-lined burrow with hinged trapdoor. Patient ambush predator — sits at door entrance." },
  { name:"Sac Spider", scientific:"Cheiracanthium spp.", emoji:"🕷️", danger:"caution" as Danger, found:"Plants, under bark, inside houses — common", id:"Small, pale yellow/green. No web — hides in silk sac on plant.", bite:"Moderately painful. Can cause skin necrosis in sensitive individuals.", action:"Clean and monitor bite. Hospital if significant swelling or skin changes.", note:"Responsible for many Malaysian spider bites. Often bites when rolled up in bedding or clothing." },
  { name:"Wolf Spider", scientific:"Lycosidae family", emoji:"🕷️", danger:"caution" as Danger, found:"Ground level — grass, leaf litter, soil everywhere", id:"Brown/grey, hairy. Carries egg sac attached to abdomen. Fast running.", bite:"Localised pain and swelling. Not medically significant in healthy adults.", action:"Clean bite. Cold compress. Monitor.", note:"Carries babies on her back after hatching — unique. Active hunter, no web. Bite only when trapped." },
  { name:"Tarantula (Malaysian Earth Tiger)", scientific:"Selenocosmia sp.", emoji:"🕷️", danger:"caution" as Danger, found:"Soil burrows in forest and plantation — Borneo endemic species", id:"Large hairy, brown/black. Burrows in soil. Mostly nocturnal.", bite:"Very painful. Localised swelling. Urticating hairs can cause eye irritation.", action:"Remove any hairs. Wash well. Hospital if respiratory reaction. Not fatal.", note:"Old World tarantulas cannot flick hairs but have stronger venom than New World species. Impressive animal." },
  { name:"Cellar Spider (Daddy Longlegs)", scientific:"Pholcus phalangioides", emoji:"🕷️", danger:"harmless" as Danger, found:"Dark corners of houses, ceilings — every home in Malaysia", id:"Very long thin legs, tiny body. Vibrates in web when disturbed.", bite:"Fangs too small to penetrate human skin. Harmless.", action:"No action needed. Leave them be.", note:"MYTH BUSTED: Not the most venomous spider. Venom is weak and they can't bite humans. Eats other spiders including dangerous ones." },
  { name:"Crab Spider", scientific:"Thomisidae family", emoji:"🕷️", danger:"harmless" as Danger, found:"Flowers and leaves — ambush predator. Common in gardens.", id:"Crab-like sideways walking. Often matches flower colour. No web.", bite:"Harmless. Tiny fangs for insects only.", action:"No action needed.", note:"Colour-changes to match flowers. Ambushes bees and butterflies larger than itself. No web needed." },
];

export default function SpiderGuide() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Danger|"all">("all");
  const [selected, setSelected] = useState(SPIDERS[0]);

  const filtered = SPIDERS.filter(s =>
    (filter === "all" || s.danger === filter) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.found.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🕷️</span>
          <div><h1 className="text-xl font-bold">Spider Guide</h1><p className="text-xs text-muted-foreground">Malaysian spiders — venomous vs harmless</p></div>
        </div>
        <div className="container pb-3 space-y-2">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
          <div className="flex gap-2">
            {(["all","venomous","caution","harmless"] as const).map(f => <button type="button" key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all capitalize ${filter === f ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>{f === "all" ? "All" : f === "venomous" ? "☠️ Venomous" : f === "caution" ? "⚠️ Caution" : "✅ Harmless"}</button>)}
          </div>
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        <div className="glass rounded-xl p-3 border border-amber-500/20 mb-4"><p className="text-xs text-amber-300">Most Malaysian spiders are harmless. If bitten: wash with soap, ice pack. Hospital for venomous species or children. Spider ID hotline: Hospital Kuching 082-276666</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
            {filtered.map(s => <button type="button" key={s.scientific} onClick={() => setSelected(s)} className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.scientific === s.scientific ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/40 hover:border-emerald-500/30"}`}><span className="text-xl">{s.emoji}</span><div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{s.name}</p><p className="text-xs text-muted-foreground italic truncate">{s.scientific}</p></div><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 capitalize ${D[s.danger]}`}>{s.danger}</span></button>)}
          </div>
          <div className="lg:col-span-2">
            <div className="glass rounded-xl p-5 border border-border/50 space-y-3">
              <div className="flex items-center gap-3"><span className="text-3xl">{selected.emoji}</span><div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-xs italic text-muted-foreground">{selected.scientific}</p></div><span className={`ml-auto text-xs font-bold px-2 py-1 rounded-full border capitalize ${D[selected.danger]}`}>{selected.danger}</span></div>
              {[["📍 Where Found", selected.found, "border-border/40"],["🔍 Identification", selected.id, "border-blue-500/20"],["🩺 If Bitten", selected.bite, "border-amber-500/30"],["✅ What to Do", selected.action, "border-emerald-500/30"]].map(([l,v,b]) => <div key={String(l)} className={`glass rounded-lg p-3 border ${b}`}><p className="text-xs font-bold text-muted-foreground mb-1">{l}</p><p className="text-sm">{v}</p></div>)}
              <div className="glass rounded-lg p-3 border border-purple-500/20"><p className="text-xs text-purple-300">💡 {selected.note}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
