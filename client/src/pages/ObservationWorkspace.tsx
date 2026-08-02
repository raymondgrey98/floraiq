/**
 * ObservationWorkspace — Route: /scan/results/active
 *
 * Hybrid PictureThis + iNaturalist result view.
 * Left 40%  — full-bleed image, confidence badge, species name.
 * Right 60% — tabbed: Analysis | Taxonomy | Environment
 *
 * Reads PlantIdentificationResult from WorkstationContext.
 * Redirects to /scan if context is empty.
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Share2, Droplets, Sun, Thermometer, Wind,
  MapPin, ExternalLink, AlertTriangle, CheckCircle, AlertCircle,
  Leaf, FlaskConical, Globe, Sprout, Check, SearchX,
} from "lucide-react";
import { toast } from "sonner";
import { useWorkstation, type PlantIdentificationResult } from "@/context/WorkstationContext";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { requestNotificationPermission, scheduleWaterReminder } from "@/lib/notifications";
import SimilarSpecies from "@/components/SimilarSpecies";
import IdCandidates from "@/components/IdCandidates";

// ── Risk config ───────────────────────────────────────────────────────────────
const RISK: Record<string, { label: string; color: string; bg: string; Icon: typeof CheckCircle }> = {
  safe:      { label: "SAFE",      color: "#4ade80", bg: "rgba(74,222,128,0.12)",  Icon: CheckCircle   },
  caution:   { label: "CAUTION",   color: "#fbbf24", bg: "rgba(251,191,36,0.12)",  Icon: AlertCircle   },
  dangerous: { label: "DANGEROUS", color: "#f87171", bg: "rgba(248,113,113,0.12)", Icon: AlertTriangle },
};

const TABS = ["Analysis", "Taxonomy", "Environment"] as const;
type Tab = typeof TABS[number];

// ── Care icon map ─────────────────────────────────────────────────────────────
const CARE_ICONS: Record<string, typeof Droplets> = {
  watering:    Droplets,
  sunlight:    Sun,
  temperature: Thermometer,
  soil:        Wind,
};

// ── Share helper ──────────────────────────────────────────────────────────────
async function shareResult(result: PlantIdentificationResult) {
  const text = `${result.commonNames?.en ?? result.scientificName} — identified with FloraIQ`;
  if (navigator.share) {
    await navigator.share({ title: "FloraIQ Identification", text, url: window.location.href });
  } else {
    await navigator.clipboard.writeText(text);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
// The vision model sometimes returns a long apology sentence in `scientificName`
// instead of a binomial when it can't identify. Detect that so we show a clean
// "no confident match" state rather than dumping the sentence as the title.
function isUnidentified(result: PlantIdentificationResult): boolean {
  const sci = (result.scientificName ?? "").trim();
  if (!sci || sci === "Unknown species") return true;
  if (sci.split(/\s+/).length > 4 || sci.length > 40) return true;
  return /cannot|unable|insufficient|no match|not be identif|unidentif/i.test(sci);
}

// Shrink a data URL to a small JPEG so saving to localStorage never overflows.
function resizeDataURL(dataURL: string, maxPx: number): Promise<string> {
  return new Promise(res => {
    if (!dataURL) { res(""); return; }
    const img = new Image();
    img.onload = () => {
      const scale  = Math.min(maxPx / img.width, maxPx / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      res(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = () => res("");
    img.src = dataURL;
  });
}

// ── Tab: Analysis ─────────────────────────────────────────────────────────────
function AnalysisTab({ result }: { result: PlantIdentificationResult }) {
  const care = result.careInstructions ?? {};

  return (
    <div className="space-y-5 py-4">
      {/* Description */}
      {result.description && (
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "rgba(52,211,153,0.6)" }}>
            Description
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
            {result.description}
          </p>
        </div>
      )}

      {/* Characteristics */}
      {result.characteristics && result.characteristics.length > 0 && (
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "rgba(52,211,153,0.6)" }}>
            Characteristics
          </p>
          <div className="flex flex-wrap gap-2">
            {result.characteristics.map((c, i) => (
              <span key={i}
                className="text-xs px-2.5 py-1 rounded-full"
                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "rgba(255,255,255,0.7)" }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Care matrix */}
      {Object.keys(care).length > 0 && (
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "rgba(52,211,153,0.6)" }}>
            Care
          </p>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(care).map(([key, value]) => {
              const Icon = CARE_ICONS[key.toLowerCase()] ?? Leaf;
              return (
                <div key={key}
                  className="flex items-start gap-3 rounded-xl p-3"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <Icon size={14} style={{ color: "#34d399", flexShrink: 0, marginTop: 2 }} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold capitalize mb-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {key}
                    </p>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.82)" }}>{value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Disease / fertilizer notes */}
      {result.disease && result.disease !== "none visible" && (
        <div className="rounded-xl p-3" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}>
          <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#fbbf24" }}>Disease Note</p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{result.disease}</p>
        </div>
      )}
      {result.fertilizer && (
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "rgba(52,211,153,0.6)" }}>Fertilizer</p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{result.fertilizer}</p>
        </div>
      )}
      {result.soilAdvice && (
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "rgba(52,211,153,0.6)" }}>Soil</p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{result.soilAdvice}</p>
        </div>
      )}

      {/* "Is it one of these?" — top alternative matches from iNaturalist CV */}
      <IdCandidates photoUrl={result.photoUrl} />

      {/* Similar & related species — real photos from iNaturalist */}
      <SimilarSpecies scientificName={result.scientificName} />
    </div>
  );
}

// ── Tab: Taxonomy ─────────────────────────────────────────────────────────────
function TaxonomyTab({ result }: { result: PlantIdentificationResult }) {
  const gbif = (result as any).gbif;

  const ranks: { label: string; value: string | undefined }[] = [
    { label: "Kingdom", value: gbif?.kingdom },
    { label: "Family",  value: gbif?.family  },
    { label: "Genus",   value: result.scientificName?.split(" ")[0] },
    { label: "Species", value: result.scientificName },
  ];

  return (
    <div className="space-y-5 py-4">
      {/* Scientific name */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "rgba(52,211,153,0.6)" }}>Scientific Name</p>
        <p className="text-lg font-bold italic" style={{ color: "white" }}>{result.scientificName}</p>
      </div>

      {/* Common names */}
      {Object.keys(result.commonNames ?? {}).length > 0 && (
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "rgba(52,211,153,0.6)" }}>Common Names</p>
          <div className="space-y-1">
            {Object.entries(result.commonNames).map(([lang, name]) => (
              <div key={lang} className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase w-8" style={{ color: "rgba(255,255,255,0.35)" }}>{lang}</span>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.82)" }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rank tree */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "rgba(52,211,153,0.6)" }}>Classification</p>
        <div className="space-y-1">
          {ranks.map(({ label, value }, i) => value && (
            <div key={label} className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "#10b981", opacity: 1 - i * 0.15 }}
              />
              <div
                className="flex-1 flex items-center justify-between py-2 px-3 rounded-lg"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderLeft: `2px solid rgba(16,185,129,${0.6 - i * 0.12})`,
                  marginLeft: i * 8,
                }}>
                <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
                <span className="text-sm font-medium italic" style={{ color: "rgba(255,255,255,0.85)" }}>{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GBIF link */}
      {gbif?.usageKey && (
        <a
          href={`https://www.gbif.org/species/${gbif.usageKey}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
          style={{ color: "#34d399" }}>
          <Globe size={14} />
          View on GBIF
          <ExternalLink size={11} />
        </a>
      )}
    </div>
  );
}

// ── Tab: Environment ──────────────────────────────────────────────────────────
function EnvironmentTab({ result }: { result: PlantIdentificationResult }) {
  const risk    = RISK[result.riskLevel ?? "safe"];
  const RiskIcon = risk.Icon;
  const imgAnalysis = result.imageAnalysis;

  return (
    <div className="space-y-5 py-4">
      {/* Risk badge */}
      <div
        className="flex items-center gap-3 rounded-xl p-4"
        style={{ background: risk.bg, border: `1px solid ${risk.color}30` }}>
        <RiskIcon size={20} color={risk.color} />
        <div>
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: risk.color }}>
            {risk.label}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
            {result.riskLevel === "safe"      && "Safe to handle. No known toxicity."}
            {result.riskLevel === "caution"   && "Handle with care. Some irritant properties."}
            {result.riskLevel === "dangerous" && "Toxic or dangerous. Do not ingest or handle without protection."}
          </p>
        </div>
      </div>

      {/* Habitat */}
      {result.habitat && (
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "rgba(52,211,153,0.6)" }}>Habitat</p>
          <div className="flex items-start gap-2">
            <MapPin size={14} style={{ color: "#34d399", flexShrink: 0, marginTop: 2 }} />
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>{result.habitat}</p>
          </div>
        </div>
      )}

      {/* Image analysis */}
      {imgAnalysis && (
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "rgba(52,211,153,0.6)" }}>Visual Analysis</p>
          <div className="grid grid-cols-2 gap-2">
            {([
              ["Leaf Shape",  imgAnalysis.leafShape],
              ["Color",       imgAnalysis.color],
              ["Texture",     imgAnalysis.texture],
              ["Est. Height", imgAnalysis.estimatedHeight],
            ] as [string, string][]).map(([label, value]) => value && value !== "N/A" && (
              <div key={label}
                className="rounded-xl p-3"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "rgba(255,255,255,0.38)" }}>{label}</p>
                <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.82)" }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* iNaturalist link */}
      <a
        href={`https://www.inaturalist.org/taxa/search?q=${encodeURIComponent(result.scientificName ?? "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
        style={{ color: "#34d399" }}>
        <FlaskConical size={14} />
        Search iNaturalist
        <ExternalLink size={11} />
      </a>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ObservationWorkspace() {
  const [, setLocation] = useLocation();
  const { activeScanResult, clearScan } = useWorkstation();
  const [activeTab, setActiveTab] = useState<Tab>("Analysis");
  const [added, setAdded] = useState(false);
  const sound = useSoundEffect();

  // Redirect if context is empty (direct URL access or state cleared)
  useEffect(() => {
    if (!activeScanResult) setLocation("/scan");
  }, [activeScanResult, setLocation]);

  if (!activeScanResult) return null;

  const result       = activeScanResult;
  const unidentified = isUnidentified(result);
  const confidence   = Math.round((result.confidence ?? 0) * 100);
  const risk         = RISK[result.riskLevel ?? "safe"];
  const commonName   = result.commonNames?.en ?? result.scientificName;
  const displayName  = unidentified ? "No confident match" : commonName;
  const displaySci   = unidentified ? "Try a closer, sharper photo of a single subject" : result.scientificName;

  function handleBack() {
    setLocation("/");
  }

  function handleRescan() {
    clearScan();
    setLocation("/scan");
  }

  // One-tap "Add to My Garden" — writes into the same store MyGarden/WaterTracker read,
  // with sensible care defaults and a scheduled watering reminder.
  async function saveToGarden() {
    if (added) return;
    try {
      const photo = result.photoUrl ? await resizeDataURL(result.photoUrl, 220) : undefined;
      const id    = Date.now().toString();
      const plant = {
        id,
        name:               commonName,
        species:            result.scientificName,
        photo,
        waterEveryDays:     3,
        lastWatered:        new Date().toISOString(),
        fertilizeEveryDays: 30,
        lastFertilized:     new Date().toISOString(),
        repotEveryMonths:   12,
        lastRepotted:       new Date().toISOString(),
        notes:              result.careInstructions?.watering ? `Watering: ${result.careInstructions.watering}` : undefined,
      };
      const raw  = localStorage.getItem("floraiq_water_tracker");
      const list = raw ? JSON.parse(raw) : [];
      list.push(plant);
      localStorage.setItem("floraiq_water_tracker", JSON.stringify(list));
      setAdded(true);
      sound("tab");
      toast.success(`${commonName} added to My Garden`, { description: "Watering reminder scheduled." });
      const granted = await requestNotificationPermission();
      if (granted) {
        await scheduleWaterReminder({ id: parseInt(id.slice(-6)), plantName: commonName, daysFromNow: 3 });
      }
    } catch {
      toast.error("Couldn't save to garden — storage may be full.");
    }
  }

  return (
    <div
      className="min-h-screen text-white flex flex-col md:flex-row overflow-hidden"
      style={{ background: "#07100c" }}>

      {/* ── LEFT PANEL — image + identity ──────────────────────────────────── */}
      <div
        className="relative w-full md:w-[40%] flex-shrink-0"
        style={{ minHeight: "55vw", maxHeight: "100vh" }}>

        {/* Full-bleed photo */}
        {result.photoUrl ? (
          <img
            src={result.photoUrl}
            alt={commonName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#0d2218,#07100c)" }}>
            <Leaf size={64} style={{ color: "rgba(52,211,153,0.2)" }} />
          </div>
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,16,12,0.96) 0%, rgba(7,16,12,0.3) 50%, transparent 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(7,16,12,0.6) 0%, transparent 30%)" }} />

        {/* Top controls */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
          <button type="button" onClick={handleBack}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(7,16,12,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <ArrowLeft size={18} color="white" />
          </button>
          <button type="button" onClick={() => shareResult(result)}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(7,16,12,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Share2 size={16} color="white" />
          </button>
        </div>

        {/* Confidence badge — absolute top-right of image area (hidden when no match) */}
        {!unidentified && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.15 }}
          className="absolute right-4 z-10"
          style={{ top: 72 }}>
          <div
            className="flex flex-col items-center justify-center rounded-2xl px-3 py-2"
            style={{
              background: "rgba(7,16,12,0.85)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(16,185,129,0.3)",
              boxShadow: `0 0 20px rgba(16,185,129,0.2)`,
              minWidth: 56,
            }}>
            <span className="font-black text-xl leading-none" style={{ color: "#4ade80" }}>
              {confidence}%
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
              Match
            </span>
          </div>
        </motion.div>
        )}

        {/* Species identity — bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          {/* Risk inline (or "no match" pill when unidentified) */}
          {unidentified ? (
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3"
              style={{ background: "rgba(148,163,184,0.12)", border: "1px solid rgba(148,163,184,0.35)" }}>
              <SearchX size={10} color="#94a3b8" />
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#94a3b8" }}>
                No Match
              </span>
            </div>
          ) : (
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3"
              style={{ background: risk.bg, border: `1px solid ${risk.color}40` }}>
              <risk.Icon size={10} color={risk.color} />
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: risk.color }}>
                {risk.label}
              </span>
            </div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-black leading-tight mb-1"
            style={{ fontSize: "clamp(1.4rem,5vw,2rem)" }}>
            {displayName}
          </motion.h1>

          <p className="text-sm italic mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>
            {displaySci}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {!unidentified && (
              <button
                type="button"
                onClick={saveToGarden}
                disabled={added}
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full transition-all disabled:cursor-default"
                style={
                  added
                    ? { background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", color: "#34d399" }
                    : { background: "linear-gradient(135deg,#059669,#10b981)", border: "1px solid rgba(16,185,129,0.5)", color: "white", boxShadow: "0 4px 16px rgba(16,185,129,0.35)" }
                }>
                {added ? <><Check size={13} />In My Garden</> : <><Sprout size={13} />Add to My Garden</>}
              </button>
            )}
            <button
              type="button"
              onClick={handleRescan}
              className="text-xs font-bold px-4 py-2 rounded-full transition-opacity hover:opacity-70"
              style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399" }}>
              Scan again
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — tabbed data ───────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ borderLeft: "1px solid rgba(16,185,129,0.1)" }}>

        {/* Tab bar */}
        <div
          className="flex-shrink-0 flex border-b"
          style={{ borderColor: "rgba(16,185,129,0.1)", background: "rgba(7,16,12,0.95)" }}>
          {TABS.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => { sound("tab"); setActiveTab(tab); }}
              className="relative flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors"
              style={{ color: activeTab === tab ? "#34d399" : "rgba(255,255,255,0.35)" }}>
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: "#10b981" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-5" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(16,185,129,0.2) transparent" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}>
              {activeTab === "Analysis"    && <AnalysisTab    result={result} />}
              {activeTab === "Taxonomy"    && <TaxonomyTab    result={result} />}
              {activeTab === "Environment" && <EnvironmentTab result={result} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
