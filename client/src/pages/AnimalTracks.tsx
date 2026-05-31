import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const TRACKS = [
  { animal:"Sambar Deer",malay:"Rusa",emoji:"🦌",track:"Two-toed hoofprint, 6-8cm long. Clear split in middle. Both toes roughly equal.",habitat:"Lowland forest, forest edge, near water",size:"Large animal — footprint size of human palm",gait:"Walk: alternating. Run: bounding with 4 prints grouped",signs:["Bark rubbing on trees (antler marking)","Droppings: small dark pellets in group","Trails: clear paths through undergrowth"],tip:"Very common in Sarawak forests and plantation edges. Active at dawn and dusk." },
  { animal:"Wild Boar",malay:"Babi hutan",emoji:"🐗",track:"Two large toes + two small side dewclaws (visible in soft mud). Oval shape, 5-7cm.",habitat:"Forest, plantation edges, agricultural areas — extremely common",size:"Larger and rounder than deer. Dewclaws almost always visible.",gait:"Heavy walking. Root marks and disturbed soil nearby.",signs:["Rooting damage to soil","Mud wallows","Rubbing posts on trees covered in dried mud","Droppings: cylindrical segments"],tip:"Most common large mammal tracked in Sarawak. Can be dangerous if encountered. Make noise to warn them." },
  { animal:"Bearded Pig",malay:"Babi jenggot",emoji:"🐗",track:"Similar to wild boar — rounder toes, often larger. Dewclaws common.",habitat:"Borneo rainforest, riverine forest — endemic to Borneo",size:"Footprint 5-8cm. Often found in large herds during migration.",gait:"Heavy bounding in herds during migration",signs:["Mass disturbance of forest floor","Large droppings","Distinctive beard-like facial hair if seen","Migratory routes follow ridgelines"],tip:"Iconic Borneo animal. Dayak communities track migrations. Follows fruiting season across Borneo." },
  { animal:"Sun Bear",malay:"Beruang madu",emoji:"🐻",track:"5 toes with large curved claw marks. Pigeon-toed (toes pointing inward). 10-15cm.",habitat:"Lowland dipterocarp forest, logged forest, near fruiting trees",size:"Distinctive claw marks ahead of toes — very characteristic",gait:"Shuffling pigeon-toed walk",signs:["Bee hive destruction","Log rolling to find insects","Tree climbing scratches","Droppings with insect remains"],tip:"Critically endangered. Protected. If encountered: back away slowly, don't run. Very rare to see." },
  { animal:"Clouded Leopard",malay:"Harimau dahan",emoji:"🐆",track:"Large round cat print. 5-8cm. No claw marks (retractable). Three lobes at back.",habitat:"Undisturbed forest — Borneo endemic. Extremely rare.",size:"Larger than domestic cat, smaller than leopard. Retractable claws = no marks.",gait:"Loose wandering pattern. Often uses fallen logs.",signs:["Scratch marks on tree trunks","Drag marks from prey","Dense vegetation resting spots"],tip:"Extremely rare. Protected. Main Borneo cat. Track is big news — report to Sarawak Forestry." },
  { animal:"Long-tailed Macaque",malay:"Monyet ekor panjang",emoji:"🐒",track:"Handlike footprint. Thumb at angle. 8-10cm palm. 5 digits clear.",habitat:"Forest edge, mangroves, near rivers, sometimes urban areas",size:"Hand-like with separated thumb. Knuckle prints sometimes visible.",gait:"Walks on all 4s. Bounding run.",signs:["Gnawed fruit husks","Broken branches in fruiting trees","Loud alarm calls","Droppings in clusters under sleeping trees"],tip:"Very common in Sarawak. Can be aggressive if fed. Don't feed monkeys — creates conflict." },
  { animal:"Giant Squirrel",malay:"Bajang besar",emoji:"🐿️",track:"4 front toes, 5 back toes. Small — 2-3cm. Often not visible on hard ground.",habitat:"Forest canopy, large trees — Borneo and Peninsular",size:"Tiny delicate prints. Bounding pattern — front feet land together.",signs:["Gnawed nut shells at base of trees","Gnawed bark on branches","Distinctive large bushy tail if seen"],tip:"Borneo giant squirrel is world's largest. Look for gnawed durian husks — they reach them before humans!" },
  { animal:"Porcupine",malay:"Landak",emoji:"🦔",track:"5-toed, pigeon-toed walk. 4-6cm. Claw marks visible. Heavy waddling.",habitat:"Forest, caves, plantation — common in Sarawak",size:"Rounded toes. Often drag quills leave line in soft ground.",signs:["Discarded quills (hollow, not sharp when old)","Soil disturbance from root foraging","Den holes in embankments","Strong ammonia smell near dens"],tip:"Nocturnal. Largest rodent in Malaysia. Quills detach easily — handle with care if found." },
  { animal:"Sambar Barking Deer",malay:"Kijang",emoji:"🦌",track:"Smaller two-toed hoof than sambar. 3-4cm. Slender pointed impression.",habitat:"Dense forest understorey — shyer than sambar",size:"Much smaller than sambar. Delicate prints.",signs:["Distinctive loud dog-like bark alarm call","Small rubbing posts","Tiny pellet droppings","Secretive trails in dense bush"],tip:"Famous for dog-like bark when alarmed. Common but rarely seen due to dense habitat preference." },
  { animal:"Otter (Smooth-coated)",malay:"Memerang",emoji:"🦦",track:"5 toes with webbing impression. 6-8cm. Star-shaped.",habitat:"Rivers, lakes, coastal areas — all major Sarawak rivers",size:"Large for otter — clear webbing between toes.",gait:"Bounding slides when wet. Mud slide trails visible.",signs:["Fish scale deposits at eating spots","Slide marks on riverbank","Spraints (droppings) on rocks at water edge","Family groups of 5-10 animals"],tip:"Very common in Sarawak rivers. Can see at Bako NP. Family groups very vocal — whistles and chirps." },
];

export default function AnimalTracks() {
  const [selected, setSelected] = useState(TRACKS[0]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🐾</span>
          <div><h1 className="text-xl font-bold">Animal Tracks</h1><p className="text-xs text-muted-foreground">Wildlife tracking guide — Sarawak & Borneo</p></div>
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
            {TRACKS.map(t => (
              <button type="button" key={t.animal} onClick={() => setSelected(t)}
                className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.animal === t.animal ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/40 hover:border-emerald-500/30"}`}>
                <span className="text-xl">{t.emoji}</span>
                <div><p className="font-semibold text-sm">{t.animal}</p><p className="text-xs text-muted-foreground">{t.malay}</p></div>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2">
            <div className="glass rounded-xl p-5 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-3"><span className="text-3xl">{selected.emoji}</span><div><h2 className="text-xl font-bold">{selected.animal}</h2><p className="text-muted-foreground text-sm">{selected.malay}</p></div></div>
              {[["👣 Track Description", selected.track, "border-border/40"],["📏 Track Size", selected.size, "border-blue-500/20"],["🏕️ Habitat", selected.habitat, "border-border/40"],["🚶 Gait Pattern", selected.gait, "border-border/40"]].map(([l,v,b]) => (
                <div key={String(l)} className={`glass rounded-lg p-3 border ${b}`}><p className="text-xs font-bold text-muted-foreground mb-1">{l}</p><p className="text-sm">{v}</p></div>
              ))}
              <div className="glass rounded-lg p-3 border border-emerald-500/20">
                <p className="text-xs font-bold text-emerald-400 mb-2">🔍 Other Signs to Look For</p>
                <ul className="space-y-1">{selected.signs.map(s => <li key={s} className="text-xs text-muted-foreground flex gap-2"><span>•</span>{s}</li>)}</ul>
              </div>
              <div className="glass rounded-lg p-3 border border-amber-500/20"><p className="text-xs text-amber-300">💡 {selected.tip}</p></div>
              <a href={`https://www.inaturalist.org/search?q=${encodeURIComponent(selected.animal)}&place_id=6901`} target="_blank" rel="noopener noreferrer" className="text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-green-400 inline-block">View Sarawak sightings on iNaturalist</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
