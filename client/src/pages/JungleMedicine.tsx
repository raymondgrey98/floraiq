import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, AlertTriangle } from "lucide-react";

const HAZARDS = [
  { hazard:"Snake Bite", emoji:"🐍", severity:"Life-threatening",
    immediate:["Keep victim completely still — movement spreads venom","Remove rings/watches near bite (swelling comes fast)","Mark edge of swelling with pen every 15 min","Keep bitten limb BELOW heart level","Get to hospital FAST — antivenom only works there"],
    wrong:["DO NOT cut and suck — does NOT work, causes infection","DO NOT apply tourniquet — causes tissue death","DO NOT apply ice — worsens tissue damage","DO NOT give alcohol","DO NOT apply herbs to bite — causes infection"],
    plants:[], hospital:"ESSENTIAL. Photo the snake if safe. Never delay for treatment — go NOW. Hospital Umum Sarawak: 082-276666" },
  { hazard:"Bee/Wasp Sting", emoji:"🐝", severity:"Moderate–Severe",
    immediate:["Move away fast — more bees may attack","Scrape (not squeeze) stinger out with fingernail","Wash with soap and water","Cold compress for 10 min"],
    wrong:["DO NOT squeeze stinger — injects more venom","DO NOT apply raw onion — no evidence, may infect"],
    plants:["Aloe vera gel — cooling and anti-inflammatory","Bruised plantain leaf pressed on sting","Daun sireh (betel leaf) — mild antiseptic"],
    hospital:"Multiple stings (10+), throat swelling, difficulty breathing, dizziness — hospital immediately (anaphylaxis)." },
  { hazard:"Leech Bite", emoji:"🩸", severity:"Low",
    immediate:["Apply salt, alcohol, or hand sanitiser — leech detaches","Flick off with fingernail at head end","Wash wound with soap","Apply direct pressure with clean cloth"],
    wrong:["DO NOT burn leech — it vomits into wound","DO NOT pull off forcefully — mouth parts may remain"],
    plants:["Bruised daun sireh pressed on wound — antiseptic","Aloe vera gel — soothing","Banana sap from young stem — drying agent"],
    hospital:"Not needed unless wound infected (red, swollen, hot) after 2–3 days." },
  { hazard:"Caterpillar/Jellyfish Contact", emoji:"🐛", severity:"Painful",
    immediate:["Do NOT touch with bare hand — spreads irritant","Tape pressed and peeled removes sting hairs","Wash with soap — flow water one direction","Cold compress"],
    wrong:["DO NOT rub — spreads spines/nematocysts","DO NOT apply fresh water to jellyfish — activates nematocysts"],
    plants:["Aloe vera gel — cooling relief","Bruised papaya leaf — papain may help"],
    hospital:"Face or throat affected, difficulty breathing, systemic reaction — hospital." },
  { hazard:"Cut / Laceration", emoji:"🩹", severity:"Low–Moderate",
    immediate:["Apply direct pressure for 10+ min — don't lift to check","Elevate above heart level","Once stopped: clean with clean flowing water","Cover with cleanest cloth available"],
    wrong:["DO NOT use dirty leaves directly on open wound","DO NOT apply soil or animal dung","DO NOT close deep wounds with tape in field — needs stitches"],
    plants:["Aloe vera gel — antiseptic on clean wound","Pitcher plant water — sterile trapped rainwater for washing","Coconut oil — antimicrobial coating once wound is clean"],
    hospital:"Deep, gaping, or heavily contaminated wounds. Tetanus shot if not up to date." },
  { hazard:"Dehydration", emoji:"💧", severity:"Serious if untreated",
    immediate:["Shade and rest immediately","Drink clean water slowly — not gulping","ORS: 6 tsp sugar + 0.5 tsp salt in 1L water","Cool body with wet cloth on neck, armpits, groin"],
    wrong:["DO NOT gulp large amounts if severely dehydrated","DO NOT give fluids if unconscious","DO NOT drink seawater"],
    plants:["Young green coconut — best natural electrolyte","Bamboo internodes — trapped clean rainwater","Banana flower juice — mild electrolytes"],
    hospital:"Unconscious, cannot keep water down, no urination 6+ hours — hospital immediately." },
  { hazard:"Fever (Jungle)", emoji:"🤒", severity:"Monitor carefully",
    immediate:["Rest in shade","Drink fluids constantly","Cool wet cloth on forehead and armpits","Monitor for dengue: severe headache, eye pain, rash"],
    wrong:["DO NOT give aspirin to children (Reye syndrome risk)","DO NOT restrict fluids"],
    plants:["Pegaga tea — mild fever-reducing","Sambiloto (Andrographis) — strong traditional remedy, very bitter","Lemongrass tea — promotes sweating"],
    hospital:"Fever >39°C for 48h, or dengue signs (severe headache, eye pain, rash, bleeding) — hospital NOW." },
  { hazard:"Plant Contact Rash", emoji:"🌿", severity:"Mild–Severe",
    immediate:["Wash immediately with soap and water for 15+ min","Remove and bag contaminated clothing","Do NOT touch eyes or face"],
    wrong:["DO NOT rub skin — spreads irritants","DO NOT take hot shower — dilates pores"],
    plants:["Aloe vera gel — cooling for contact dermatitis","Cold compress — reduces inflammation"],
    hospital:"Eyes affected, blistering, or difficulty breathing after plant contact — hospital immediately." },
];

const SEV: Record<string, string> = {
  "Life-threatening":"bg-red-500/20 text-red-400 border-red-500/30",
  "Moderate–Severe":"bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Low":"bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Painful":"bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Low–Moderate":"bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Serious if untreated":"bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Monitor carefully":"bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Mild–Severe":"bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export default function JungleMedicine() {
  const [selected, setSelected] = useState(HAZARDS[0]);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🧪</span>
          <div><h1 className="text-xl font-bold">Jungle Medicine</h1><p className="text-xs text-muted-foreground">Emergency plant treatments — Borneo wilderness</p></div>
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        <div className="glass rounded-xl p-3 border border-red-500/20 mb-4 flex gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">Wilderness emergencies only. Always prioritise evacuation to hospital. Hospital Umum Sarawak Kuching: 082-276666</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
            {HAZARDS.map(h => (
              <button type="button" key={h.hazard} onClick={() => setSelected(h)} className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.hazard === h.hazard ? "border-red-500/60 bg-red-500/5" : "border-border/40 hover:border-red-500/30"}`}>
                <span className="text-xl">{h.emoji}</span>
                <div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{h.hazard}</p></div>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2 space-y-3">
            <div className="glass rounded-xl p-5 border border-red-500/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{selected.emoji}</span>
                <h2 className="text-xl font-bold flex-1">{selected.hazard}</h2>
                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${SEV[selected.severity] || "bg-border/30 text-muted-foreground"}`}>{selected.severity}</span>
              </div>
              <div className="glass rounded-lg p-3 border border-emerald-500/20 mb-3">
                <p className="text-xs font-bold text-emerald-400 mb-2">✅ Do This</p>
                {selected.immediate.map((s, i) => <div key={i} className="flex gap-2 text-xs text-muted-foreground mb-1"><span className="text-emerald-400 font-bold">{i+1}.</span><span>{s}</span></div>)}
              </div>
              <div className="glass rounded-lg p-3 border border-red-500/20 mb-3">
                <p className="text-xs font-bold text-red-400 mb-2">❌ Do NOT Do This</p>
                {selected.wrong.map(w => <p key={w} className="text-xs text-muted-foreground mb-0.5">• {w}</p>)}
              </div>
              {selected.plants.length > 0 && (
                <div className="glass rounded-lg p-3 border border-purple-500/20 mb-3">
                  <p className="text-xs font-bold text-purple-400 mb-2">🌿 Plant Remedies (wilderness only)</p>
                  {selected.plants.map(p => <p key={p} className="text-xs text-muted-foreground mb-0.5">• {p}</p>)}
                </div>
              )}
              <div className="glass rounded-lg p-3 border border-amber-500/20">
                <p className="text-xs font-bold text-amber-400 mb-1">🏥 When to go to hospital</p>
                <p className="text-xs text-amber-300">{selected.hospital}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
