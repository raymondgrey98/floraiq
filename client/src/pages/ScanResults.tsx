import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { X, Share2, Download, MapPin, Leaf, AlertTriangle, ExternalLink, Loader2, BookOpen, Youtube, Globe, Droplets, Sun, Thermometer, FlaskConical, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScanResult {
  id?: number;
  scientificName: string;
  commonNames: Record<string, string>;
  confidence: number;
  description: string;
  characteristics?: string[];
  careInstructions?: Record<string, string>;
  habitat?: string;
  riskLevel?: "safe" | "caution" | "dangerous";
  imageAnalysis?: { leafShape: string; color: string; texture: string; estimatedHeight: string };
  disease?: string;
  fertilizer?: string;
  soilAdvice?: string;
  photoUrl?: string;
  scanMode?: string;
  date?: string;
}

const RISK_COLORS = {
  safe:      { bg: "bg-green-500/20",  text: "text-green-400",  border: "border-green-500/30",  label: "SAFE" },
  caution:   { bg: "bg-amber-500/20",  text: "text-amber-400",  border: "border-amber-500/30",  label: "CAUTION" },
  dangerous: { bg: "bg-red-500/20",    text: "text-red-400",    border: "border-red-500/30",    label: "DANGEROUS" },
};

function CareCard({ icon, label, value, color, sublabel }: { icon: React.ReactNode; label: string; value: string; color: string; sublabel?: string }) {
  return (
    <div className={`glass rounded-2xl p-4 border ${color} flex flex-col items-center text-center gap-2`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color.replace("border-","bg-").replace("/30","/20")}`}>{icon}</div>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold leading-tight">{value}</p>
      {sublabel && <p className="text-[10px] text-muted-foreground">{sublabel}</p>}
    </div>
  );
}

function WaterIndicator({ level }: { level: "low" | "moderate" | "high" }) {
  const drops = level === "low" ? 1 : level === "moderate" ? 2 : 3;
  return (
    <div className="flex gap-1 justify-center">
      {[1,2,3].map(i => (
        <Droplets key={i} className={`w-4 h-4 ${i <= drops ? "text-blue-400" : "text-border"}`} />
      ))}
    </div>
  );
}

function SunIndicator({ level }: { level: number }) {
  return (
    <div className="w-full mt-1">
      <div className="h-1.5 bg-border/30 rounded-full">
        <div className="h-full rounded-full bg-yellow-400 transition-all" style={{ width: `${level}%` }} />
      </div>
      <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
        <span>Shade</span><span>Full Sun</span>
      </div>
    </div>
  );
}

function parseCareData(care: Record<string, string> | undefined) {
  const c = care || {};
  const find = (...keys: string[]) => {
    for (const k of keys) {
      const found = Object.entries(c).find(([key]) => key.toLowerCase().includes(k.toLowerCase()));
      if (found) return found[1];
    }
    return null;
  };
  return {
    water: find("water", "moisture", "irrigation") || "Moderate watering",
    sun: find("sun", "light", "sunlight") || "Partial to full sun",
    soil: find("soil", "earth", "substrate") || "Well-drained soil",
    temp: find("temp", "climate", "heat") || "18–30°C",
    fertilizer: find("fertil", "feed", "nutrient") || "Balanced NPK monthly",
    humidity: find("humid", "mist") || "Moderate humidity",
  };
}

function getWaterLevel(waterText: string): "low" | "moderate" | "high" {
  const t = waterText.toLowerCase();
  if (t.includes("drought") || t.includes("low") || t.includes("rarely") || t.includes("minimal") || t.includes("little")) return "low";
  if (t.includes("frequent") || t.includes("high") || t.includes("moist") || t.includes("regular") || t.includes("consistent")) return "high";
  return "moderate";
}

function getSunLevel(sunText: string): number {
  const t = sunText.toLowerCase();
  if (t.includes("full sun") || t.includes("direct")) return 90;
  if (t.includes("partial") || t.includes("indirect")) return 55;
  if (t.includes("shade") || t.includes("low light")) return 25;
  return 60;
}

function SourceLinks({ name, scientific }: { name: string; scientific: string }) {
  const q  = encodeURIComponent(scientific);
  const qn = encodeURIComponent(name);
  const sources = [
    { label: "Wikipedia",      url: `https://en.wikipedia.org/wiki/${q}`,                                        color: "border-gray-500/40 text-gray-300" },
    { label: "iNaturalist",    url: `https://www.inaturalist.org/search?q=${q}`,                                 color: "border-blue-500/40 text-blue-400" },
    { label: "GBIF",           url: `https://www.gbif.org/species/search?q=${q}`,                                color: "border-purple-500/40 text-purple-400" },
    { label: "Pl@ntNet",       url: `https://identify.plantnet.org/k-world-flora/species/${q}/data`,             color: "border-green-500/40 text-green-400" },
    { label: "Kew Gardens",    url: `https://powo.science.kew.org/results?q=${q}`,                               color: "border-lime-500/40 text-lime-400" },
    { label: "EOL",            url: `https://eol.org/search?q=${q}`,                                             color: "border-indigo-500/40 text-indigo-400" },
    { label: "IUCN Red List",  url: `https://www.iucnredlist.org/search?query=${q}`,                             color: "border-red-500/40 text-red-400" },
    { label: "YouTube",        url: `https://www.youtube.com/results?search_query=${qn}+${q}+species`,           color: "border-rose-500/40 text-rose-400" },
    { label: "Nat Geo",        url: `https://www.nationalgeographic.com/search?q=${qn}`,                         color: "border-yellow-500/40 text-yellow-400" },
    { label: "Britannica",     url: `https://www.britannica.com/search?query=${qn}`,                             color: "border-amber-500/40 text-amber-400" },
    { label: "Google Scholar", url: `https://scholar.google.com/scholar?q=${q}`,                                 color: "border-sky-500/40 text-sky-400" },
    { label: "BHL Library",    url: `https://www.biodiversitylibrary.org/search?SearchTerm=${q}`,                color: "border-teal-500/40 text-teal-400" },
  ];
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {sources.map(s => (
        <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
          className={`glass border rounded-lg p-2.5 text-center text-xs font-semibold transition hover:opacity-80 ${s.color}`}>
          {s.label}
        </a>
      ))}
    </div>
  );
}

export default function ScanResults() {
  const [, navigate] = useLocation();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [wikiText, setWikiText] = useState("");
  const [loadingWiki, setLoadingWiki] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("floraiq_last_scan");
    if (!stored) { navigate("/scan"); return; }
    const r = JSON.parse(stored) as ScanResult;
    setResult(r);
    if (r.scientificName && r.scientificName !== "Unknown species") {
      setLoadingWiki(true);
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(r.scientificName)}`,
        { headers: { "Api-User-Agent": "FloraIQ/2.0" } })
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data?.extract) setWikiText(data.extract.slice(0, 600)); })
        .catch(() => {})
        .finally(() => setLoadingWiki(false));
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  const name       = result.commonNames?.en || result.scientificName;
  const confidence = Math.round((result.confidence || 0.5) * 100);
  const risk       = RISK_COLORS[result.riskLevel || "safe"];
  const care       = parseCareData(result.careInstructions);
  const waterLevel = getWaterLevel(care.water);
  const sunLevel   = getSunLevel(care.sun);
  const aliases    = Object.values(result.commonNames || {}).filter(v => v && v !== name).slice(0, 5);

  const tabs = [
    { id: "overview",  label: "Overview" },
    { id: "care",      label: "Care" },
    { id: "analysis",  label: "Analysis" },
    { id: "sources",   label: "Sources" },
  ];

  function downloadReport() {
    const text = `FloraIQ Scan Report\n====================\nName: ${name}\nScientific: ${result!.scientificName}\nConfidence: ${confidence}%\nRisk: ${result!.riskLevel?.toUpperCase()}\nDate: ${result!.date || new Date().toLocaleDateString()}\n\nDescription:\n${result!.description}\n\nHabitat: ${result!.habitat || "N/A"}\n\nCare:\nWater: ${care.water}\nSunlight: ${care.sun}\nSoil: ${care.soil}\nTemperature: ${care.temp}\n\nWikipedia:\n${wikiText || "N/A"}\n\nGenerated by FloraIQ — floraiq.app\n`;
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `floraiq-${result!.scientificName.replace(/\s+/g, "-")}.txt`; a.click();
  }

  function shareResult() {
    const text = `I identified ${name} (${result!.scientificName}) with FloraIQ! ${confidence}% confidence. 🌿`;
    if (navigator.share) navigator.share({ title: "FloraIQ Scan", text });
    else navigator.clipboard?.writeText(text);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg font-bold">Identification Result</h1>
          </div>
          <Link href="/scan"><button type="button" aria-label="Close" className="text-muted-foreground hover:text-white p-2 rounded-lg hover:bg-border/30 transition"><X className="w-5 h-5" /></button></Link>
        </div>
      </div>

      <div className="container py-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── MAIN CONTENT ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Hero identification card — PictureThis style */}
            <div className="glass rounded-2xl border border-emerald-500/20 overflow-hidden">
              <div className="flex gap-4 p-5">
                {/* Photo */}
                <div className="w-28 h-28 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-500/10 to-green-600/10 flex-shrink-0 flex items-center justify-center">
                  {result.photoUrl
                    ? <img src={result.photoUrl} alt={name} className="w-full h-full object-cover" />
                    : <Leaf className="w-10 h-10 text-emerald-500/40" />}
                </div>
                {/* ID info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold leading-tight">{name}</h2>
                  <p className="text-sm italic text-muted-foreground mb-2">{result.scientificName}</p>
                  {aliases.length > 0 && (
                    <p className="text-xs text-muted-foreground mb-3">
                      <span className="font-semibold text-foreground/70">Also known as: </span>
                      {aliases.join(", ")}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="flex items-center gap-1.5">
                      <div className="relative w-8 h-8">
                        <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                          <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="3" className="text-border/30" />
                          <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-400" strokeDasharray={`${(confidence / 100) * 81.7} 81.7`} strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-emerald-400">{confidence}%</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Match</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${risk.bg} ${risk.text}`}>{risk.label}</span>
                    {result.scanMode && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full capitalize">{result.scanMode}</span>}
                  </div>
                </div>
              </div>

              {/* Learn More link row */}
              <div className="px-5 pb-4 flex gap-3">
                <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(result.scientificName)}`} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition">
                  Learn More <ExternalLink className="w-3 h-3" />
                </a>
                <a href={`https://www.inaturalist.org/search?q=${encodeURIComponent(result.scientificName)}`} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition">
                  iNaturalist <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* ── CARE SUMMARY CARDS — PictureThis style ── */}
            <div className="glass rounded-2xl border border-border/40 p-5">
              <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center">🌿</span>
                Care Summary
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="glass rounded-2xl p-4 border border-blue-500/20 text-center space-y-1">
                  <Droplets className="w-6 h-6 text-blue-400 mx-auto" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Watering</p>
                  <WaterIndicator level={waterLevel} />
                  <p className="text-xs text-muted-foreground capitalize">{waterLevel} moisture</p>
                </div>
                <div className="glass rounded-2xl p-4 border border-yellow-500/20 text-center space-y-1">
                  <Sun className="w-6 h-6 text-yellow-400 mx-auto" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Sunlight</p>
                  <SunIndicator level={sunLevel} />
                  <p className="text-xs text-muted-foreground">{care.sun.split(/[,.(]/)[0].trim()}</p>
                </div>
                <div className="glass rounded-2xl p-4 border border-amber-500/20 text-center space-y-1">
                  <span className="text-2xl block">🪱</span>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Soil</p>
                  <p className="text-xs text-muted-foreground">{care.soil.split(/[,.(]/)[0].trim()}</p>
                </div>
                <div className="glass rounded-2xl p-4 border border-red-500/20 text-center space-y-1">
                  <Thermometer className="w-6 h-6 text-red-400 mx-auto" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Temperature</p>
                  <p className="text-sm font-bold text-red-400">{care.temp.split(/[,.(]/)[0].trim()}</p>
                </div>
                <div className="glass rounded-2xl p-4 border border-green-500/20 text-center space-y-1">
                  <FlaskConical className="w-6 h-6 text-green-400 mx-auto" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Fertilizer</p>
                  <p className="text-xs text-muted-foreground">{care.fertilizer.split(/[,.(]/)[0].trim()}</p>
                </div>
                <div className="glass rounded-2xl p-4 border border-cyan-500/20 text-center space-y-1">
                  <Wind className="w-6 h-6 text-cyan-400 mx-auto" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Humidity</p>
                  <p className="text-xs text-muted-foreground">{care.humidity.split(/[,.(]/)[0].trim()}</p>
                </div>
              </div>
            </div>

            {/* ── TABS ── */}
            <div className="glass rounded-2xl border border-border/40 overflow-hidden">
              <div className="border-b border-border/50 overflow-x-auto">
                <div className="flex px-4">
                  {tabs.map(tab => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                      className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? "border-emerald-500 text-emerald-400"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{result.description}</p>
                      {loadingWiki && <p className="text-xs text-muted-foreground mt-2 animate-pulse">Loading Wikipedia summary...</p>}
                      {wikiText && !loadingWiki && (
                        <div className="mt-3 border-t border-border/30 pt-3">
                          <p className="text-xs font-bold text-blue-400 mb-1">Wikipedia</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{wikiText}…</p>
                        </div>
                      )}
                    </div>
                    {result.characteristics && result.characteristics.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Characteristics</p>
                        <div className="flex flex-wrap gap-2">
                          {result.characteristics.map((c, i) => (
                            <span key={i} className="bg-emerald-500/10 text-emerald-300 px-3 py-1 rounded-full text-xs">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.habitat && (
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">Habitat</p>
                        <p className="text-sm text-muted-foreground">{result.habitat}</p>
                      </div>
                    )}
                    {result.disease && result.disease !== "none visible" && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <p className="text-xs font-bold text-red-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />Disease / Pest Detected
                        </p>
                        <p className="text-sm text-muted-foreground">{result.disease}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "care" && (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">Full care guide for {name}</p>
                    {result.careInstructions && Object.keys(result.careInstructions).length > 0 ? (
                      <div className="space-y-2">
                        {Object.entries(result.careInstructions).map(([k, v]) => (
                          <div key={k} className="glass rounded-xl p-4 border border-border/40">
                            <p className="text-xs font-bold text-emerald-400 capitalize mb-1">{k}</p>
                            <p className="text-sm text-muted-foreground">{String(v)}</p>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-muted-foreground text-sm">Detailed care data not available for this organism.</p>}
                    {result.fertilizer && (
                      <div className="glass rounded-xl p-4 border border-amber-500/20">
                        <p className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-1">Fertilizer</p>
                        <p className="text-sm text-muted-foreground">{result.fertilizer}</p>
                      </div>
                    )}
                    {result.soilAdvice && (
                      <div className="glass rounded-xl p-4 border border-blue-500/20">
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-wide mb-1">Soil & Watering</p>
                        <p className="text-sm text-muted-foreground">{result.soilAdvice}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "analysis" && (
                  <div className="space-y-3">
                    <div className="glass rounded-xl p-4 border border-border/40">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">AI Identification Data</p>
                      {[
                        ["Scientific Name", result.scientificName],
                        ["Common Name", result.commonNames?.en || "—"],
                        ["Confidence Score", `${confidence}%`],
                        ["Risk Level", result.riskLevel?.toUpperCase() || "SAFE"],
                        ["Scan Mode", result.scanMode || "—"],
                        ["Scanned On", result.date || new Date().toLocaleDateString()],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between py-2 border-b border-border/30 last:border-0">
                          <span className="text-sm text-muted-foreground">{label}</span>
                          <span className="text-sm font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                    {result.imageAnalysis && (
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(result.imageAnalysis).map(([k, v]) => (
                          <div key={k} className="glass rounded-xl p-3 border border-border/40">
                            <p className="text-xs text-muted-foreground capitalize mb-0.5">{k.replace(/([A-Z])/g, " $1")}</p>
                            <p className="text-sm font-medium">{v}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground text-center">Powered by OpenRouter Vision AI (nvidia/nemotron-nano-12b-v2-vl)</p>
                  </div>
                )}

                {activeTab === "sources" && (
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground">12 verified global databases for {result.scientificName}</p>
                    <SourceLinks name={name} scientific={result.scientificName} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-4">
            {/* Actions */}
            <div className="glass rounded-2xl p-5 border border-border/40">
              <h3 className="font-semibold mb-3 text-sm">Actions</h3>
              <div className="space-y-2">
                <Button type="button" onClick={shareResult} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">
                  <Share2 className="w-4 h-4 mr-2" />Share Result
                </Button>
                <Button type="button" variant="outline" onClick={downloadReport} className="w-full border-border/50 rounded-xl">
                  <Download className="w-4 h-4 mr-2" />Download Report
                </Button>
                <Link href="/history">
                  <Button type="button" variant="outline" className="w-full border-border/50 rounded-xl">
                    <BookOpen className="w-4 h-4 mr-2" />Add to Library
                  </Button>
                </Link>
                <Link href="/scan">
                  <Button type="button" variant="outline" className="w-full border-border/50 rounded-xl">
                    <Leaf className="w-4 h-4 mr-2" />Scan Another
                  </Button>
                </Link>
              </div>
            </div>

            {/* Safety */}
            <div className={`glass rounded-2xl p-5 border ${risk.border}`}>
              <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 ${risk.text}`} />Safety Status
              </h3>
              <span className={`${risk.bg} ${risk.text} px-3 py-1.5 rounded-full text-sm font-bold inline-block`}>{risk.label}</span>
              <p className="text-xs text-muted-foreground mt-2">
                {result.riskLevel === "dangerous" ? "Do not touch or consume. Seek expert advice immediately." :
                 result.riskLevel === "caution"   ? "Handle with care. Some parts may be harmful if ingested." :
                 "Generally safe. Always wash hands after handling plants."}
              </p>
            </div>

            {/* On This Page */}
            <div className="glass rounded-2xl p-5 border border-border/40">
              <h3 className="font-semibold mb-3 text-sm">On This Page</h3>
              <div className="space-y-2">
                {tabs.map(tab => (
                  <button type="button" key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${activeTab === tab.id ? "bg-emerald-500/10 text-emerald-400 font-semibold" : "text-muted-foreground hover:text-foreground"}`}>
                    {tab.label === "overview" ? "📋" : tab.label === "care" ? "🌿" : tab.label === "analysis" ? "🔬" : "📚"} {tab.label.charAt(0).toUpperCase() + tab.label.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* External links */}
            <div className="glass rounded-2xl p-5 border border-border/40">
              <h3 className="font-semibold mb-3 text-sm">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { href: `https://www.youtube.com/results?search_query=${encodeURIComponent(name + " " + result.scientificName)}`, icon: <Youtube className="w-4 h-4" />, label: "YouTube", color: "text-red-400" },
                  { href: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.scientificName)}`, icon: <Globe className="w-4 h-4" />, label: "Wikipedia", color: "text-blue-400" },
                  { href: `https://www.inaturalist.org/search?q=${encodeURIComponent(result.scientificName)}`, icon: <ExternalLink className="w-4 h-4" />, label: "iNaturalist", color: "text-green-400" },
                  { href: `https://www.gbif.org/species/search?q=${encodeURIComponent(result.scientificName)}`, icon: <MapPin className="w-4 h-4" />, label: "GBIF Map", color: "text-purple-400" },
                ].map(l => (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-2 text-sm ${l.color} hover:opacity-70 transition`}>
                    {l.icon}{l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
