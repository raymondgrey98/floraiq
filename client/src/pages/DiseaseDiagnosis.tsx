import { useState, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Bug, Upload, Camera, X, Loader2, ChevronLeft, AlertTriangle, CheckCircle, Leaf, ExternalLink, FlaskConical } from "lucide-react";

interface DiseaseResult {
  plant: string;
  disease: string;
  healthy: boolean;
  score: number;
  raw: string;
}

const COMMON_DISEASES: { name: string; plant: string; emoji: string; tip: string }[] = [
  { name: "Late Blight",        plant: "Tomato",    emoji: "🍅", tip: "Remove infected leaves, apply copper fungicide" },
  { name: "Powdery Mildew",     plant: "Cucumber",  emoji: "🥒", tip: "Improve air circulation, neem oil spray" },
  { name: "Leaf Spot",          plant: "Chili",     emoji: "🌶️", tip: "Remove affected leaves, avoid overhead watering" },
  { name: "Root Rot",           plant: "Orchid",    emoji: "🌸", tip: "Repot with fresh bark, reduce watering" },
  { name: "Yellow Mosaic Virus",plant: "Papaya",    emoji: "🍈", tip: "Remove infected plants, control aphids" },
  { name: "Anthracnose",        plant: "Mango",     emoji: "🥭", tip: "Prune dead wood, apply mancozeb fungicide" },
];

export default function DiseaseDiagnosis() {
  const [preview, setPreview]   = useState<string | null>(null);
  const [file, setFile]         = useState<File | null>(null);
  const [loading, setLoading]   = useState(false);
  const [results, setResults]   = useState<DiseaseResult[]>([]);
  const [advice, setAdvice]     = useState("");
  const [error, setError]       = useState("");
  const [done, setDone]         = useState(false);
  const inputRef  = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setError(""); setDone(false); setResults([]); setAdvice("");
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  }

  async function diagnose() {
    if (!file) return;
    setLoading(true); setError(""); setResults([]); setAdvice(""); setDone(false);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/disease", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Detection failed");
      setResults(data.results || []);
      setAdvice(data.advice || "");
      setDone(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setPreview(null); setFile(null); setResults([]); setAdvice(""); setError(""); setDone(false);
  }

  const top = results[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/"><button type="button" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <Bug className="w-6 h-6 text-red-400" />
          <div>
            <h1 className="text-xl font-bold leading-tight">Disease Diagnosis</h1>
            <p className="text-xs text-muted-foreground">AI-powered plant disease detection</p>
          </div>
        </div>
      </div>

      <div className="container py-6 max-w-3xl space-y-6">
        {/* Upload zone */}
        <input ref={inputRef}  type="file" accept="image/*"                className="hidden" onChange={handleFile} />
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />

        {!preview ? (
          <div className="glass rounded-xl border-2 border-dashed border-red-500/30 p-12 text-center hover:border-red-500/60 transition-colors">
            <Bug className="w-14 h-14 text-red-500/30 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Photo your sick plant</h2>
            <p className="text-sm text-muted-foreground mb-6">Clear photo of affected leaves, stems, or fruit for best results</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button type="button" onClick={() => inputRef.current?.click()}
                className="bg-red-500 hover:bg-red-600 text-white">
                <Upload className="w-4 h-4 mr-2" />Upload Photo
              </Button>
              <Button type="button" variant="outline" onClick={() => cameraRef.current?.click()}
                className="border-red-500/30 text-red-400">
                <Camera className="w-4 h-4 mr-2" />Take Photo
              </Button>
            </div>
          </div>
        ) : (
          <div className="glass rounded-xl border border-red-500/30 overflow-hidden">
            <div className="relative">
              <img src={preview} alt="Plant" className="w-full max-h-72 object-cover" />
              <button type="button" onClick={reset}
                className="absolute top-3 right-3 bg-black/60 rounded-full p-2 hover:bg-black/80 transition">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="p-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm mb-3">
                  {error}
                </div>
              )}
              <Button type="button" onClick={diagnose} disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 text-white h-12 font-semibold disabled:opacity-60">
                {loading
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analysing with AI...</>
                  : <><Bug className="w-4 h-4 mr-2" />Diagnose Disease</>}
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        {done && results.length > 0 && (
          <div className="space-y-4">
            {/* Top result */}
            <div className={`glass rounded-xl border p-5 ${
              top.healthy ? "border-green-500/40" : "border-red-500/40"
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  top.healthy ? "bg-green-500/20" : "bg-red-500/20"
                }`}>
                  {top.healthy
                    ? <CheckCircle className="w-7 h-7 text-green-400" />
                    : <AlertTriangle className="w-7 h-7 text-red-400" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="text-xl font-bold">{top.plant}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      top.healthy ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}>
                      {top.healthy ? "HEALTHY" : "DISEASE DETECTED"}
                    </span>
                    <span className="text-xs text-muted-foreground">{top.score}% confidence</span>
                  </div>
                  <p className="text-base font-semibold text-muted-foreground capitalize">{top.disease}</p>
                </div>
              </div>
            </div>

            {/* AI treatment advice */}
            {advice && !top.healthy && (
              <div className="glass rounded-xl border border-amber-500/30 p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                  <FlaskConical className="w-4 h-4 text-amber-400" />Treatment & Prevention
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{advice}</p>
              </div>
            )}

            {/* All results */}
            {results.length > 1 && (
              <div className="glass rounded-xl border border-border/50 p-5">
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground">Other Possibilities</h3>
                <div className="space-y-2">
                  {results.slice(1).map((r, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm capitalize">{r.plant}</span>
                        <span className="text-xs text-muted-foreground ml-2 capitalize">{r.disease}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-border/40 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500/60 rounded-full" style={{ width: `${r.score}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground w-10 text-right">{r.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* External links */}
            <div className="glass rounded-xl border border-border/50 p-5">
              <h3 className="font-semibold mb-3 text-sm">Learn More</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "EPPO Global", url: `https://gd.eppo.int/search?k=${encodeURIComponent(top.disease)}` },
                  { label: "Wikipedia", url: `https://en.wikipedia.org/wiki/${encodeURIComponent(top.disease)}` },
                  { label: "PlantVillage", url: `https://plantvillage.psu.edu/search?query=${encodeURIComponent(top.disease)}` },
                  { label: "YouTube Fix", url: `https://www.youtube.com/results?search_query=${encodeURIComponent(top.plant + " " + top.disease + " treatment")}` },
                ].map(link => (
                  <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition">
                    <ExternalLink className="w-3 h-3" />{link.label}
                  </a>
                ))}
              </div>
            </div>

            <Button type="button" onClick={reset} variant="outline" className="w-full border-border/50">
              <Camera className="w-4 h-4 mr-2" />Diagnose Another Plant
            </Button>
          </div>
        )}

        {/* Common diseases reference */}
        {!done && (
          <div className="glass rounded-xl border border-border/50 p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm">
              <Leaf className="w-4 h-4 text-emerald-400" />Common Diseases in Malaysia
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMMON_DISEASES.map(d => (
                <div key={d.name} className="glass rounded-lg p-3 border border-border/30">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{d.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold">{d.plant} — {d.name}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{d.tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="glass rounded-xl border border-border/50 p-5">
          <h3 className="font-semibold mb-3 text-sm">Photo Tips for Best Results</h3>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li>• Show the affected area clearly — zoom in on spots, lesions, or discolouration</li>
            <li>• Use natural daylight — avoid flash shadows</li>
            <li>• Include both healthy and diseased parts for comparison</li>
            <li>• For root rot — photograph roots after removing from pot</li>
            <li>• AI trained on 38 disease classes across 14 crop types</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
