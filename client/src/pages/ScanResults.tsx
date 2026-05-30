import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { X, Share2, Download, MapPin, Leaf, AlertTriangle, ExternalLink, Loader2, BookOpen, Youtube, Globe } from "lucide-react";
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
  safe:      { bg: "bg-green-500/20",  text: "text-green-400",  label: "SAFE" },
  caution:   { bg: "bg-amber-500/20",  text: "text-amber-400",  label: "CAUTION" },
  dangerous: { bg: "bg-red-500/20",    text: "text-red-400",    label: "DANGEROUS" },
};

function SourceLinks({ name, scientific }: { name: string; scientific: string }) {
  const q  = encodeURIComponent(scientific);
  const qn = encodeURIComponent(name);
  const sources = [
    { label: "Wikipedia",    url: `https://en.wikipedia.org/wiki/${q}`,                                    color: "border-gray-500/40 text-gray-300" },
    { label: "iNaturalist",  url: `https://www.inaturalist.org/search?q=${q}`,                             color: "border-blue-500/40 text-blue-400" },
    { label: "GBIF",         url: `https://www.gbif.org/species/search?q=${q}`,                            color: "border-purple-500/40 text-purple-400" },
    { label: "Pl@ntNet",     url: `https://identify.plantnet.org/k-world-flora/species/${q}/data`,         color: "border-green-500/40 text-green-400" },
    { label: "Kew Gardens",  url: `https://powo.science.kew.org/results?q=${q}`,                           color: "border-lime-500/40 text-lime-400" },
    { label: "EOL",          url: `https://eol.org/search?q=${q}`,                                         color: "border-indigo-500/40 text-indigo-400" },
    { label: "IUCN",         url: `https://www.iucnredlist.org/search?query=${q}`,                         color: "border-red-500/40 text-red-400" },
    { label: "YouTube",      url: `https://www.youtube.com/results?search_query=${qn}+${q}+species`,       color: "border-rose-500/40 text-rose-400" },
    { label: "Nat Geo",      url: `https://www.nationalgeographic.com/search?q=${qn}`,                     color: "border-yellow-500/40 text-yellow-400" },
    { label: "Britannica",   url: `https://www.britannica.com/search?query=${qn}`,                         color: "border-amber-500/40 text-amber-400" },
    { label: "Google Scholar", url: `https://scholar.google.com/scholar?q=${q}`,                           color: "border-sky-500/40 text-sky-400" },
    { label: "BHL Library",  url: `https://www.biodiversitylibrary.org/search?SearchTerm=${q}`,            color: "border-teal-500/40 text-teal-400" },
  ];
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {sources.map(s => (
        <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
          className={`glass border rounded-lg p-2 text-center text-xs font-semibold transition hover:opacity-80 ${s.color}`}>
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

    // Fetch Wikipedia summary
    if (r.scientificName && r.scientificName !== "Unknown species") {
      setLoadingWiki(true);
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(r.scientificName)}`,
        { headers: { "Api-User-Agent": "FloraIQ/2.0" } })
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data?.extract) setWikiText(data.extract.slice(0, 500)); })
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

  const tabs = [
    { id: "overview",  label: "Overview" },
    { id: "care",      label: "Care" },
    { id: "analysis",  label: "Analysis" },
    { id: "sources",   label: "Sources" },
  ];

  function downloadReport() {
    const text = `FloraIQ Scan Report
====================
Name: ${name}
Scientific: ${result.scientificName}
Confidence: ${confidence}%
Risk Level: ${result.riskLevel?.toUpperCase()}
Date: ${result.date || new Date().toLocaleDateString()}

Description:
${result.description}

Characteristics:
${result.characteristics?.join("\n") || "N/A"}

Habitat: ${result.habitat || "N/A"}

Care Instructions:
${Object.entries(result.careInstructions || {}).map(([k,v]) => `${k}: ${v}`).join("\n")}

Disease: ${result.disease || "None visible"}
Fertilizer: ${result.fertilizer || "N/A"}
Soil Advice: ${result.soilAdvice || "N/A"}

Wikipedia:
${wikiText || "N/A"}

Generated by FloraIQ — floraiq.app
`;
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `floraiq-${result.scientificName.replace(/\s+/g, "-")}.txt`;
    a.click();
  }

  function shareResult() {
    const text = `I identified a ${name} (${result.scientificName}) with FloraIQ! ${confidence}% confidence.`;
    if (navigator.share) {
      navigator.share({ title: "FloraIQ Scan", text });
    } else {
      navigator.clipboard?.writeText(text);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-xl font-bold">Scan Result</h1>
          <Link href="/scan"><Button type="button" variant="ghost" size="icon" aria-label="Close"><X className="w-5 h-5" /></Button></Link>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main card */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-2xl border border-emerald-500/30 overflow-hidden">
              {/* Image */}
              <div className="relative h-64 bg-gradient-to-br from-emerald-500/10 to-green-600/10 flex items-center justify-center">
                {result.photoUrl
                  ? <img src={result.photoUrl} alt={name} className="w-full h-full object-cover" />
                  : <Leaf className="w-20 h-20 text-emerald-500/30" />}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold">{name}</h2>
                  <p className="text-sm text-muted-foreground italic">{result.scientificName}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="px-6 py-4 flex flex-wrap gap-3 border-b border-border/50">
                <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-bold">
                  {confidence}% Confidence
                </span>
                <span className={`${risk.bg} ${risk.text} px-3 py-1 rounded-full text-sm font-bold`}>
                  {risk.label}
                </span>
                {result.scanMode && (
                  <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-bold capitalize">
                    {result.scanMode}
                  </span>
                )}
                {result.date && (
                  <span className="text-xs text-muted-foreground self-center">{result.date}</span>
                )}
              </div>

              {/* Description */}
              <div className="px-6 py-4">
                <p className="text-muted-foreground leading-relaxed">{result.description}</p>
                {loadingWiki && <p className="text-xs text-muted-foreground mt-2 animate-pulse">Loading Wikipedia...</p>}
                {wikiText && !loadingWiki && (
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed border-t border-border/30 pt-3">
                    <span className="text-xs font-bold text-blue-400 mr-2">Wikipedia:</span>
                    {wikiText}...
                  </p>
                )}
              </div>

              {/* Tabs */}
              <div className="border-b border-border/50 overflow-x-auto">
                <div className="flex px-4">
                  {tabs.map(tab => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                      className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? "border-emerald-500 text-emerald-400"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-4">
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
                    {result.imageAnalysis && (
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Visual Analysis</p>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(result.imageAnalysis).map(([k, v]) => (
                            <div key={k} className="glass rounded-lg p-3 border border-border/50">
                              <p className="text-xs text-muted-foreground capitalize">{k.replace(/([A-Z])/g, " $1")}</p>
                              <p className="text-sm font-medium">{v}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.disease && result.disease !== "none visible" && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <p className="text-xs font-bold text-red-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />Disease / Pest
                        </p>
                        <p className="text-sm text-muted-foreground">{result.disease}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "care" && (
                  <div className="space-y-4">
                    {result.careInstructions && Object.keys(result.careInstructions).length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(result.careInstructions).map(([k, v]) => (
                          <div key={k} className="glass rounded-lg p-4 border border-border/50">
                            <p className="text-xs text-muted-foreground capitalize mb-1">{k}</p>
                            <p className="text-sm font-medium">{String(v)}</p>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-muted-foreground text-sm">Care data not available for this organism.</p>}
                    {result.fertilizer && (
                      <div className="glass rounded-lg p-4 border border-amber-500/20">
                        <p className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-1">Fertilizer</p>
                        <p className="text-sm text-muted-foreground">{result.fertilizer}</p>
                      </div>
                    )}
                    {result.soilAdvice && (
                      <div className="glass rounded-lg p-4 border border-blue-500/20">
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-wide mb-1">Soil & Watering</p>
                        <p className="text-sm text-muted-foreground">{result.soilAdvice}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "analysis" && (
                  <div className="space-y-3">
                    <div className="glass rounded-lg p-4 border border-border/50">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">AI Identification Data</p>
                      {[
                        ["Scientific Name", result.scientificName],
                        ["Common Name (EN)", result.commonNames?.en || "—"],
                        ["Confidence Score", `${confidence}%`],
                        ["Risk Level", result.riskLevel?.toUpperCase() || "SAFE"],
                        ["Scan Mode", result.scanMode || "—"],
                        ["Scanned On", result.date || "—"],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between py-2 border-b border-border/30 last:border-0">
                          <span className="text-sm text-muted-foreground">{label}</span>
                          <span className="text-sm font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Powered by OpenRouter Vision AI (nvidia/nemotron-nano-12b-v2-vl)
                    </p>
                  </div>
                )}

                {activeTab === "sources" && (
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground">Open these in a new tab for verified information about this species.</p>
                    <SourceLinks name={name} scientific={result.scientificName} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Actions */}
            <div className="glass rounded-xl p-5 border border-border/50">
              <h3 className="font-semibold mb-3 text-sm">Actions</h3>
              <div className="space-y-2">
                <Button type="button" onClick={shareResult} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                  <Share2 className="w-4 h-4 mr-2" />Share Result
                </Button>
                <Button type="button" variant="outline" onClick={downloadReport} className="w-full border-border/50">
                  <Download className="w-4 h-4 mr-2" />Download Report
                </Button>
                <Link href="/history">
                  <Button type="button" variant="outline" className="w-full border-border/50">
                    <BookOpen className="w-4 h-4 mr-2" />View in Library
                  </Button>
                </Link>
                <Link href="/scan">
                  <Button type="button" variant="outline" className="w-full border-border/50">
                    <Leaf className="w-4 h-4 mr-2" />Scan Another
                  </Button>
                </Link>
              </div>
            </div>

            {/* Risk level */}
            <div className={`glass rounded-xl p-5 border ${
              result.riskLevel === "dangerous" ? "border-red-500/30" :
              result.riskLevel === "caution"   ? "border-amber-500/30" : "border-green-500/30"
            }`}>
              <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 ${risk.text}`} />Safety Status
              </h3>
              <span className={`${risk.bg} ${risk.text} px-3 py-1.5 rounded-full text-sm font-bold`}>{risk.label}</span>
              <p className="text-xs text-muted-foreground mt-2">
                {result.riskLevel === "dangerous" ? "Do not touch or consume. Seek expert advice." :
                 result.riskLevel === "caution"   ? "Handle with care. Some parts may be harmful." :
                 "Generally safe for humans and animals."}
              </p>
            </div>

            {/* Quick links */}
            <div className="glass rounded-xl p-5 border border-border/50">
              <h3 className="font-semibold mb-3 text-sm">Quick Links</h3>
              <div className="space-y-2">
                <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(name + " " + result.scientificName)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition">
                  <Youtube className="w-4 h-4" />Watch on YouTube
                </a>
                <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(result.scientificName)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition">
                  <Globe className="w-4 h-4" />Wikipedia Article
                </a>
                <a href={`https://www.inaturalist.org/search?q=${encodeURIComponent(result.scientificName)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition">
                  <ExternalLink className="w-4 h-4" />iNaturalist Sightings
                </a>
                <a href={`https://www.gbif.org/species/search?q=${encodeURIComponent(result.scientificName)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition">
                  <MapPin className="w-4 h-4" />GBIF Occurrences
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
