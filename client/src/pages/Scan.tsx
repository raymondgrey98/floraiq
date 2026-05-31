import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useCallback } from "react";
import { Leaf, Bug, Bird, Waves, AlertTriangle, Upload, Camera, X, Sprout, Snail, Loader2, Video, VideoOff } from "lucide-react";
import { Link, useLocation } from "wouter";

const MODES = [
  { id: "plant",    label: "Plant / Herb",         icon: Leaf,          color: "from-green-500 to-emerald-600" },
  { id: "insect",   label: "Insect / Bug",          icon: Bug,           color: "from-yellow-500 to-orange-600" },
  { id: "bird",     label: "Bird",                  icon: Bird,          color: "from-blue-500 to-cyan-600" },
  { id: "mushroom", label: "Mushroom / Fungi",       icon: Sprout,        color: "from-purple-500 to-pink-600" },
  { id: "reptile",  label: "Reptile / Amphibian",   icon: Snail,         color: "from-lime-500 to-green-600" },
  { id: "marine",   label: "Marine Life",           icon: Waves,         color: "from-blue-600 to-teal-600" },
  { id: "survival", label: "Survival Scan",         icon: AlertTriangle, color: "from-red-500 to-orange-600" },
];

export default function Scan() {
  const [, navigate]     = useLocation();
  const [mode, setMode]  = useState("plant");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile]  = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [liveMode, setLiveMode] = useState(false);
  const [streamError, setStreamError] = useState("");
  const inputRef  = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const videoRef  = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => () => stopStream(), [stopStream]);

  async function startLive() {
    setStreamError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setLiveMode(true);
    } catch {
      setStreamError("Camera access denied. Please allow camera permission.");
    }
  }

  function stopLive() {
    stopStream();
    setLiveMode(false);
  }

  function captureFrame() {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width  = videoRef.current.videoWidth  || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    canvas.getContext("2d")!.drawImage(videoRef.current, 0, 0);
    canvas.toBlob(blob => {
      if (!blob) return;
      const f = new File([blob], "capture.jpg", { type: "image/jpeg" });
      setFile(f);
      setPreview(canvas.toDataURL("image/jpeg", 0.85));
      stopLive();
    }, "image/jpeg", 0.85);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setError("");
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  }

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError("");

    try {
      // Get user location for better identification
      let location: { latitude: number; longitude: number } | undefined;
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3000 })
        );
        location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      } catch {}

      const formData = new FormData();
      formData.append("image", file);
      formData.append("context", `Scan mode: ${mode}. Identify what this is.`);
      if (location) formData.append("location", JSON.stringify(location));

      const res = await fetch(`/api/identify?lang=en`, { method: "POST", body: formData });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).error || `Server error ${res.status}`);
      }

      const result = await res.json();

      // Attach scan metadata
      const scanEntry = {
        ...result,
        id: Date.now(),
        scanMode: mode,
        photoUrl: preview,
        date: new Date().toLocaleDateString(),
        timestamp: Date.now(),
      };

      // Save as last scan
      localStorage.setItem("floraiq_last_scan", JSON.stringify(scanEntry));

      // Append to history
      try {
        const history = JSON.parse(localStorage.getItem("floraiq_scan_history") || "[]");
        history.unshift({
          id: scanEntry.id,
          name: scanEntry.commonNames?.en || scanEntry.scientificName,
          scientific: scanEntry.scientificName,
          type: mode.charAt(0).toUpperCase() + mode.slice(1),
          confidence: Math.round((scanEntry.confidence || 0.5) * 100),
          photoUrl: preview,
          date: scanEntry.date,
        });
        localStorage.setItem("floraiq_scan_history", JSON.stringify(history.slice(0, 100)));
      } catch {}

      navigate("/scan-results");
    } catch (e: any) {
      setError(e.message || "Identification failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/"><Button variant="ghost" size="icon"><X className="w-5 h-5" /></Button></Link>
            <h1 className="text-2xl font-bold">Identify Organism</h1>
          </div>
        </div>
      </div>

      <div className="container py-10 max-w-4xl">
        {/* Mode selector */}
        <div className="mb-10">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Scan Mode</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {MODES.map(m => {
              const Icon = m.icon;
              const sel = mode === m.id;
              return (
                <button key={m.id} type="button" onClick={() => setMode(m.id)}
                  className={`glass rounded-xl p-4 border-2 transition-all flex flex-col items-center gap-2 ${
                    sel ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
                        : "border-border/50 hover:border-emerald-500/40"
                  }`}>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-center leading-tight">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hidden file inputs */}
        <input ref={inputRef}  type="file" accept="image/*" title="Upload image" aria-label="Upload image" className="hidden" onChange={handleFile} />
        <input ref={cameraRef} type="file" accept="image/*" title="Take photo" aria-label="Take photo" className="hidden" onChange={handleFile} />

        {/* Upload zone */}
        <div className="max-w-2xl mx-auto mb-8">
          {liveMode ? (
            /* ── Live camera viewfinder ── */
            <div className="glass rounded-xl border border-emerald-500/40 overflow-hidden">
              <div className="relative bg-black">
                <video ref={videoRef} autoPlay playsInline muted
                  className="w-full max-h-80 object-cover" />
                {/* Scan reticle overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-emerald-400/60 rounded-xl" />
                </div>
                <div className="absolute top-3 left-3 bg-black/60 text-emerald-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />LIVE
                </div>
              </div>
              <div className="flex gap-3 p-4">
                <Button type="button" onClick={captureFrame}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white h-12 font-semibold">
                  <Camera className="w-5 h-5 mr-2" />Capture & Identify
                </Button>
                <Button type="button" variant="outline" onClick={stopLive}
                  className="border-border/50 text-muted-foreground">
                  <VideoOff className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ) : !preview ? (
            <div className="glass rounded-xl border-2 border-dashed border-emerald-500/30 p-12 text-center hover:border-emerald-500/60 transition-colors">
              <Camera className="w-16 h-16 text-emerald-500/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Upload or Capture</h3>
              <p className="text-muted-foreground mb-6">Take a photo or use live camera to identify instantly</p>
              {streamError && <p className="text-red-400 text-sm mb-4">{streamError}</p>}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button type="button" onClick={startLive}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white hover-glow">
                  <Video className="w-5 h-5 mr-2" />Live Camera
                </Button>
                <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}
                  className="border-emerald-500/30 text-emerald-400">
                  <Upload className="w-5 h-5 mr-2" />Upload Photo
                </Button>
                <Button type="button" variant="outline" onClick={() => cameraRef.current?.click()}
                  className="border-border/50 text-muted-foreground">
                  <Camera className="w-5 h-5 mr-2" />Take Photo
                </Button>
              </div>
            </div>
          ) : (
            <div className="glass rounded-xl p-5 border border-emerald-500/30 space-y-4">
              <div className="relative rounded-lg overflow-hidden">
                <img src={preview} alt="Preview" className="w-full h-80 object-cover" />
                <button type="button" aria-label="Remove image" title="Remove image" onClick={() => { setPreview(null); setFile(null); setError(""); }}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 rounded-full p-2 transition">
                  <X className="w-4 h-4 text-white" />
                </button>
                <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  Mode: {MODES.find(m => m.id === mode)?.label}
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">{error}</div>
              )}

              <Button type="button" onClick={handleAnalyze} disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-12 text-base font-semibold disabled:opacity-60">
                {loading
                  ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Identifying with FloraIQ AI...</>
                  : "Identify Now"}
              </Button>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="max-w-2xl mx-auto glass rounded-xl p-5 border border-border/50">
          <h3 className="font-semibold mb-3 text-sm">Tips for Best Results</h3>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>• Good lighting — natural daylight works best</li>
            <li>• Include distinctive features: leaves, flowers, markings, patterns</li>
            <li>• Get close — fill the frame with the subject</li>
            <li>• Multiple angles improve accuracy</li>
            <li>• Select the correct scan mode above</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
