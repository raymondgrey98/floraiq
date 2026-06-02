import { useState } from "react";
import { Link } from "wouter";
import { AlertTriangle, ChevronLeft, Search, ExternalLink, Skull, ShieldAlert, Info, Phone } from "lucide-react";

type Risk = "deadly" | "dangerous" | "caution" | "irritant";

interface ToxicPlant {
  name: string;
  scientific: string;
  emoji: string;
  risk: Risk;
  found: string;
  toxic_part: string;
  symptoms: string;
  firstAid: string;
  wikiSlug?: string;
}

const RISK_CONFIG: Record<Risk, { label: string; bg: string; text: string; border: string; icon: string }> = {
  deadly:    { label: "DEADLY",    bg: "bg-red-950",    text: "text-red-400",    border: "border-red-500/40",    icon: "☠" },
  dangerous: { label: "DANGEROUS", bg: "bg-orange-950", text: "text-orange-400", border: "border-orange-500/40", icon: "!" },
  caution:   { label: "CAUTION",   bg: "bg-amber-950",  text: "text-amber-400",  border: "border-amber-500/40",  icon: "~" },
  irritant:  { label: "IRRITANT",  bg: "bg-yellow-950", text: "text-yellow-400", border: "border-yellow-500/40", icon: "?" },
};

const TOXIC_PLANTS: ToxicPlant[] = [
  // DEADLY
  {
    name: "Strychnine Tree", scientific: "Strychnos nux-vomica",
    emoji: "T", risk: "deadly",
    found: "Tropical forests — South Asia, Southeast Asia, Australia, Africa",
    toxic_part: "Seeds, bark, leaves",
    symptoms: "Violent muscle spasms, convulsions, respiratory failure — death within 2–3 hours",
    firstAid: "Call emergency services immediately. Do NOT induce vomiting. Keep patient still and calm.",
    wikiSlug: "Strychnos_nux-vomica",
  },
  {
    name: "Suicide Tree (Pong-Pong)", scientific: "Cerbera manghas",
    emoji: "P", risk: "deadly",
    found: "Coastal areas, mangroves — Indian Ocean, Pacific Islands, Southeast Asia",
    toxic_part: "Seeds, fruit pulp",
    symptoms: "Cardiac arrest, heart block, nausea, vomiting — can kill within hours",
    firstAid: "Emergency services immediately. Activated charcoal if within 1 hour. DO NOT eat the fruit.",
    wikiSlug: "Cerbera_manghas",
  },
  {
    name: "Oleander", scientific: "Nerium oleander",
    emoji: "O", risk: "deadly",
    found: "Worldwide — gardens, roadsides, parks across every continent",
    toxic_part: "All parts — even smoke from burning",
    symptoms: "Heart arrhythmia, vomiting, dizziness, death from cardiac failure",
    firstAid: "Call emergency services. Do not burn. Wash skin with soap and water. Hospital immediately.",
    wikiSlug: "Nerium",
  },
  {
    name: "Rosary Pea", scientific: "Abrus precatorius",
    emoji: "R", risk: "deadly",
    found: "Tropical and subtropical regions worldwide — common weed, used in jewellery",
    toxic_part: "Seeds (abrin — more toxic than ricin)",
    symptoms: "Nausea, organ failure, death 3–4 days after ingestion of 1 seed",
    firstAid: "Emergency immediately. Do NOT induce vomiting. Whole seeds less dangerous than broken.",
    wikiSlug: "Abrus_precatorius",
  },
  {
    name: "Yellow Oleander", scientific: "Cascabela thevetia",
    emoji: "Y", risk: "deadly",
    found: "Gardens worldwide — tropical and subtropical zones, yellow trumpet flowers",
    toxic_part: "All parts, especially seeds",
    symptoms: "Cardiac glycoside poisoning — heart failure, vomiting, seizures",
    firstAid: "Call emergency services. All parts toxic. Do not handle cut stems.",
    wikiSlug: "Cascabela_thevetia",
  },
  {
    name: "Water Hemlock", scientific: "Cicuta virosa",
    emoji: "W", risk: "deadly",
    found: "Wet areas, riverbanks — North America, Europe, northern Asia",
    toxic_part: "Roots, stems — considered most violently toxic plant in North America",
    symptoms: "Seizures, respiratory failure within minutes of ingestion",
    firstAid: "Emergency services immediately. Most deadly plant in temperate regions. No antidote.",
    wikiSlug: "Cicuta",
  },
  {
    name: "Deadly Nightshade", scientific: "Atropa belladonna",
    emoji: "D", risk: "deadly",
    found: "Europe, North Africa, West Asia — woodland areas and disturbed ground",
    toxic_part: "All parts, especially berries and roots",
    symptoms: "Dilated pupils, hallucinations, rapid heartbeat, coma, death",
    firstAid: "Emergency services immediately. Berries attractive to children — highly dangerous.",
    wikiSlug: "Atropa_belladonna",
  },
  {
    name: "White Snakeroot", scientific: "Ageratina altissima",
    emoji: "S", risk: "deadly",
    found: "Eastern North America — forests, roadsides, disturbed areas",
    toxic_part: "All parts — causes milk sickness through livestock",
    symptoms: "Muscle weakness, vomiting, coma, death — can pass through milk to humans",
    firstAid: "Emergency services. Historically killed Abraham Lincoln's mother through contaminated milk.",
    wikiSlug: "Ageratina_altissima",
  },
  // DANGEROUS
  {
    name: "Giant Taro / Elephant Ear", scientific: "Alocasia macrorrhizos",
    emoji: "G", risk: "dangerous",
    found: "Worldwide — extremely common garden plant in tropical and subtropical zones",
    toxic_part: "All parts (calcium oxalate crystals)",
    symptoms: "Severe burning of mouth/throat, swelling, difficulty swallowing, kidney damage if eaten",
    firstAid: "Rinse mouth with water. Do NOT swallow. Hospital if symptoms persist.",
    wikiSlug: "Alocasia_macrorrhizos",
  },
  {
    name: "Dumb Cane", scientific: "Dieffenbachia seguine",
    emoji: "D", risk: "dangerous",
    found: "Worldwide — extremely common indoor and office plant globally",
    toxic_part: "All parts (raphides — needle-like crystals)",
    symptoms: "Intense burning, temporary speechlessness, throat swelling",
    firstAid: "Wash mouth immediately. Seek medical attention. Can cause airway swelling.",
    wikiSlug: "Dieffenbachia",
  },
  {
    name: "Angel's Trumpet", scientific: "Brugmansia suaveolens",
    emoji: "A", risk: "dangerous",
    found: "Worldwide — gardens in tropical and temperate zones, South American origin",
    toxic_part: "All parts (tropane alkaloids)",
    symptoms: "Hallucinations, rapid heartbeat, fever, coma, death in high doses",
    firstAid: "Hospital immediately. Used in drug-facilitated crimes — keep away from children.",
    wikiSlug: "Brugmansia",
  },
  {
    name: "Manchineel Tree", scientific: "Hippomane mancinella",
    emoji: "M", risk: "dangerous",
    found: "Caribbean, Central America, Florida, Pacific coasts — coastal areas",
    toxic_part: "All parts — even standing under it in rain causes burns",
    symptoms: "Severe skin burns, blindness if sap touches eyes, internal damage if eaten",
    firstAid: "Flush eyes immediately with water. Wash skin. Hospital for any ingestion.",
    wikiSlug: "Hippomane_mancinella",
  },
  {
    name: "Castor Bean", scientific: "Ricinus communis",
    emoji: "C", risk: "dangerous",
    found: "Worldwide — common weed and ornamental in tropical and subtropical regions globally",
    toxic_part: "Seeds (ricin — listed as potential bioweapon)",
    symptoms: "Severe vomiting, organ failure, death within days. 4–8 seeds can kill a child.",
    firstAid: "Emergency services immediately. Do NOT induce vomiting.",
    wikiSlug: "Ricinus_communis",
  },
  {
    name: "Physic Nut", scientific: "Jatropha curcas",
    emoji: "P", risk: "dangerous",
    found: "Worldwide — very common hedge plant in tropical Africa, Asia, Americas",
    toxic_part: "Seeds, latex sap",
    symptoms: "Severe vomiting, abdominal pain, dizziness, heart failure",
    firstAid: "Seek medical attention. Common cause of poisoning in children worldwide.",
    wikiSlug: "Jatropha_curcas",
  },
  {
    name: "Monkshood / Wolfsbane", scientific: "Aconitum napellus",
    emoji: "M", risk: "dangerous",
    found: "Europe, Asia, North America — mountain meadows and gardens",
    toxic_part: "All parts — especially roots and seeds",
    symptoms: "Numbness, burning sensation, heart failure, death. Absorbed through skin.",
    firstAid: "Emergency services. Do not touch without gloves. No antidote.",
    wikiSlug: "Aconitum_napellus",
  },
  // CAUTION
  {
    name: "Bougainvillea", scientific: "Bougainvillea spectabilis",
    emoji: "B", risk: "caution",
    found: "Worldwide — extremely common in gardens and along roadsides globally",
    toxic_part: "Sap, thorns",
    symptoms: "Skin irritation, rash, mild stomach upset if eaten",
    firstAid: "Wash affected area. Seek help if rash spreads or breathing affected.",
    wikiSlug: "Bougainvillea",
  },
  {
    name: "Crown of Thorns", scientific: "Euphorbia milii",
    emoji: "C", risk: "caution",
    found: "Worldwide — very common ornamental plant in homes and gardens globally",
    toxic_part: "White milky latex sap",
    symptoms: "Skin and eye irritation, vomiting if ingested",
    firstAid: "Flush eyes. Wash skin. Wear gloves when pruning.",
    wikiSlug: "Euphorbia_milii",
  },
  {
    name: "Poinsettia", scientific: "Euphorbia pulcherrima",
    emoji: "P", risk: "caution",
    found: "Worldwide — extremely common holiday plant in homes, offices, and shops globally",
    toxic_part: "Leaves, sap",
    symptoms: "Skin rash, nausea, vomiting — rarely serious in adults",
    firstAid: "Rinse mouth, wash skin. Consult doctor if child ingested any.",
    wikiSlug: "Euphorbia_pulcherrima",
  },
  {
    name: "Lantana", scientific: "Lantana camara",
    emoji: "L", risk: "caution",
    found: "Worldwide — roadsides and gardens in tropical and subtropical regions globally",
    toxic_part: "Unripe berries, leaves",
    symptoms: "Liver damage (especially in livestock), vomiting, weakness",
    firstAid: "Seek medical advice. Dangerous to livestock — keep animals away.",
    wikiSlug: "Lantana_camara",
  },
  {
    name: "Black Nightshade", scientific: "Solanum nigrum",
    emoji: "B", risk: "caution",
    found: "Worldwide — common weed on every continent — small black berries",
    toxic_part: "Unripe berries, leaves",
    symptoms: "Nausea, vomiting — ripe berries less toxic but still inadvisable",
    firstAid: "Rinse mouth. Seek help if large amount ingested especially by children.",
    wikiSlug: "Solanum_nigrum",
  },
  {
    name: "Foxglove", scientific: "Digitalis purpurea",
    emoji: "F", risk: "caution",
    found: "Europe, North America, Australia — roadsides, gardens, woodland edges",
    toxic_part: "All parts — cardiac glycosides (source of digitalis medicine)",
    symptoms: "Heart rhythm disturbance, nausea, visual disturbances, can be fatal",
    firstAid: "Seek medical help. Source of medicinal heart drug — toxic in uncontrolled doses.",
    wikiSlug: "Digitalis_purpurea",
  },
  // IRRITANT
  {
    name: "Stinging Nettle", scientific: "Urtica dioica",
    emoji: "S", risk: "irritant",
    found: "Worldwide — temperate regions across North America, Europe, Asia, Africa",
    toxic_part: "Leaves and stems (tiny silica needle hairs)",
    symptoms: "Intense burning, stinging, rash — temporary but painful",
    firstAid: "Do NOT rub. Remove hairs with tape. Wash with cold water. Apply calamine.",
    wikiSlug: "Urtica_dioica",
  },
  {
    name: "Poison Ivy", scientific: "Toxicodendron radicans",
    emoji: "P", risk: "irritant",
    found: "North America, East Asia — forests, roadsides, gardens",
    toxic_part: "All parts — urushiol oil on leaves, stems, and roots",
    symptoms: "Severe allergic rash, blistering, intense itching — can spread to face",
    firstAid: "Wash with soap immediately. Do NOT scratch. Antihistamines. Doctor if severe.",
    wikiSlug: "Toxicodendron_radicans",
  },
  {
    name: "Wild Parsnip", scientific: "Pastinaca sativa",
    emoji: "W", risk: "irritant",
    found: "North America, Europe — roadsides, open fields, disturbed ground",
    toxic_part: "Sap + sunlight causes phototoxic burns",
    symptoms: "Severe burns and blisters when sap contacts skin in sunlight",
    firstAid: "Wash immediately, cover from sunlight. Hospital if burns are severe.",
    wikiSlug: "Pastinaca_sativa",
  },
];

const RISK_ORDER: Risk[] = ["deadly", "dangerous", "caution", "irritant"];

export default function ToxicPlants() {
  const [search, setSearch]         = useState("");
  const [riskFilter, setRiskFilter] = useState<Risk | "all">("all");
  const [selected, setSelected]     = useState<ToxicPlant | null>(null);

  const filtered = TOXIC_PLANTS.filter(p => {
    const matchRisk   = riskFilter === "all" || p.risk === riskFilter;
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.scientific.toLowerCase().includes(search.toLowerCase()) ||
      p.found.toLowerCase().includes(search.toLowerCase()) ||
      p.symptoms.toLowerCase().includes(search.toLowerCase());
    return matchRisk && matchSearch;
  }).sort((a, b) => RISK_ORDER.indexOf(a.risk) - RISK_ORDER.indexOf(b.risk));

  const counts = {
    deadly:    TOXIC_PLANTS.filter(p => p.risk === "deadly").length,
    dangerous: TOXIC_PLANTS.filter(p => p.risk === "dangerous").length,
    caution:   TOXIC_PLANTS.filter(p => p.risk === "caution").length,
    irritant:  TOXIC_PLANTS.filter(p => p.risk === "irritant").length,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-red-900/40">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/"><button type="button" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <Skull className="w-6 h-6 text-red-400" />
          <div>
            <h1 className="text-xl font-bold leading-tight">Toxic Plants</h1>
            <p className="text-xs text-muted-foreground">Global species database — {TOXIC_PLANTS.length} species from every continent</p>
          </div>
        </div>

        {/* Warning banner */}
        <div className="bg-red-950/60 border-b border-red-800/40 px-4 py-2">
          <p className="text-xs text-red-300 text-center font-semibold">
            If poisoning is suspected — call your local emergency number immediately. Do not wait.
          </p>
        </div>

        {/* Search + filter */}
        <div className="container py-3 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search plants, symptoms, regions..."
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {(["all", "deadly", "dangerous", "caution", "irritant"] as const).map(r => {
              const cfg   = r !== "all" ? RISK_CONFIG[r] : null;
              const count = r === "all" ? TOXIC_PLANTS.length : counts[r];
              return (
                <button type="button" key={r} onClick={() => setRiskFilter(r)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    riskFilter === r
                      ? r === "all" ? "bg-white text-black border-white" : `${cfg!.bg} ${cfg!.text} ${cfg!.border}`
                      : "glass border-border/50 text-muted-foreground hover:text-foreground"
                  }`}>
                  {r === "all" ? `All (${count})` : `${cfg!.label} (${count})`}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container py-6 max-w-4xl">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {(["deadly","dangerous","caution","irritant"] as Risk[]).map(r => {
            const cfg = RISK_CONFIG[r];
            return (
              <button key={r} type="button" onClick={() => setRiskFilter(riskFilter === r ? "all" : r)}
                className={`glass rounded-xl p-3 text-center border transition-all cursor-pointer ${cfg.border} hover:opacity-80`}>
                <p className={`text-lg font-black ${cfg.text}`}>{counts[r]}</p>
                <p className="text-[10px] text-muted-foreground capitalize font-bold">{r}</p>
              </button>
            );
          })}
        </div>

        {/* Plant grid */}
        <div className="space-y-3">
          {filtered.map(plant => {
            const cfg = RISK_CONFIG[plant.risk];
            return (
              <div key={plant.scientific}
                onClick={() => setSelected(selected?.scientific === plant.scientific ? null : plant)}
                className={`glass rounded-xl border cursor-pointer transition-all ${cfg.border} hover:opacity-90`}>
                <div className="flex items-start gap-4 p-4">
                  {/* Letter avatar instead of emoji */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-lg ${cfg.bg} ${cfg.text}`}>
                    {plant.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="font-bold">{plant.name}</h3>
                        <p className="text-xs text-muted-foreground italic">{plant.scientific}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Found: {plant.found}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Toxic: {plant.toxic_part}</p>
                  </div>
                </div>

                {/* Expanded detail */}
                {selected?.scientific === plant.scientific && (
                  <div className={`border-t ${cfg.border} px-4 pb-4 pt-3 space-y-3`}>
                    <div>
                      <p className="text-xs font-bold text-red-400 uppercase mb-1">Symptoms</p>
                      <p className="text-sm text-muted-foreground">{plant.symptoms}</p>
                    </div>
                    <div className={`${cfg.bg} rounded-lg p-3 border ${cfg.border}`}>
                      <p className="text-xs font-bold uppercase mb-1 flex items-center gap-1">
                        <ShieldAlert className={`w-3.5 h-3.5 ${cfg.text}`} />
                        <span className={cfg.text}>First Aid</span>
                      </p>
                      <p className="text-sm text-muted-foreground">{plant.firstAid}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {plant.wikiSlug && (
                        <a href={`https://en.wikipedia.org/wiki/${plant.wikiSlug}`}
                          target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-blue-400 hover:text-blue-300">
                          <ExternalLink className="w-3 h-3" />Wikipedia
                        </a>
                      )}
                      <a href={`https://www.inaturalist.org/search?q=${encodeURIComponent(plant.scientific)}`}
                        target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-green-400 hover:text-green-300">
                        <ExternalLink className="w-3 h-3" />iNaturalist
                      </a>
                      <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(plant.name + " poisonous plant")}`}
                        target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-red-400 hover:text-red-300">
                        <ExternalLink className="w-3 h-3" />YouTube
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No results for "{search}"</p>
          </div>
        )}

        {/* Global emergency info */}
        <div className="mt-8 glass rounded-xl border border-red-500/30 p-5 bg-red-950/20">
          <h3 className="font-bold mb-1 flex items-center gap-2 text-red-400">
            <Phone className="w-4 h-4" />Emergency Contacts — Worldwide
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Call your local emergency number. Common numbers below.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {[
              { label: "International", number: "112" },
              { label: "USA / Canada", number: "911" },
              { label: "UK", number: "999" },
              { label: "Australia", number: "000" },
              { label: "Europe (general)", number: "112" },
              { label: "Poison Control USA", number: "1-800-222-1222" },
            ].map(c => (
              <a key={c.label} href={`tel:${c.number}`}
                className="glass border border-red-500/20 rounded-lg p-3 hover:border-red-500/40 transition">
                <p className="text-xs text-muted-foreground">{c.label}</p>
                <p className="font-bold text-red-400">{c.number}</p>
              </a>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Search "poison control [your country]" for your local number.
          </p>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          FloraIQ global toxic plants database. Always verify with a medical professional. Not a substitute for medical advice.
        </p>
      </div>
    </div>
  );
}
