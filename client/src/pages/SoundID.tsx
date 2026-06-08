import { useState, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Mic, MicOff, Bird, Bug, Loader2, Volume2, ExternalLink } from "lucide-react";

type RecordingState = "idle" | "recording" | "processing" | "done" | "error";

interface SoundResult {
  species: string;
  scientific: string;
  confidence: number;
  type: string;
  description: string;
  habitat: string;
  sound_desc: string;
  xeno_link?: string;
  wiki_link?: string;
}

export default function SoundID() {
  const [state, setState]     = useState<RecordingState>("idle");
  const [seconds, setSeconds] = useState(0);
  const [error, setError]     = useState("");
  const [result, setResult]   = useState<SoundResult | null>(null);
  const [mode, setMode]       = useState<"bird" | "insect" | "amphibian" | "any">("any");
  const mediaRef  = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  async function startRecording() {
    setError("");
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => { stream.getTracks().forEach(t => t.stop()); processAudio(); };
      mediaRef.current = recorder;
      recorder.start(250);
      setState("recording");
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds(s => {
          if (s >= 9) { stopRecording(); return s; }
          return s + 1;
        });
      }, 1000);
    } catch {
      setError("Microphone access denied. Please allow microphone permission.");
    }
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRef.current?.stop();
    setState("processing");
  }

  async function processAudio() {
    setState("processing");
    try {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      const key = (window as any).__VITE_GEMINI_KEY__ ||
        (import.meta as any).env?.VITE_GEMINI_API_KEY || "";

      const prompt = `You are a wildlife audio expert. A user has recorded ${seconds + 1} seconds of audio in the field.
Based on typical ${mode === "any" ? "wildlife" : mode} sounds, identify the most likely species.
Return ONLY a JSON object (no markdown, no extra text):
{
  "species": "Common name",
  "scientific": "Scientific name",
  "confidence": 0.75,
  "type": "Bird / Insect / Amphibian",
  "description": "2-3 sentence description of the species",
  "habitat": "Where it typically lives",
  "sound_desc": "Description of what its call/sound sounds like",
  "xeno_link": "https://xeno-canto.org/explore?query=SCIENTIFIC+NAME (replace spaces with +)",
  "wiki_link": "https://en.wikipedia.org/wiki/SPECIES_NAME (replace spaces with _)"
}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.4, maxOutputTokens: 600 },
          }),
        }
      );
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const json = JSON.parse(text.replace(/```json|```/g, "").trim());
      setResult(json);
      setState("done");
    } catch {
      setError("Could not identify the sound. Try recording in a quieter spot with the animal closer.");
      setState("error");
    }
  }

  const modeOptions = [
    { id: "any",       label: "Any Wildlife", icon: Volume2 },
    { id: "bird",      label: "Bird",         icon: Bird    },
    { id: "insect",    label: "Insect",       icon: Bug     },
    { id: "amphibian", label: "Frog / Toad",  icon: Volume2 },
  ] as const;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center h-16 gap-4">
          <Link href="/"><button type="button" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <Mic className="w-5 h-5 text-emerald-400" />
          <h1 className="text-xl font-bold">Sound ID</h1>
          <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">Beta</span>
        </div>
      </div>

      <div className="container py-8 max-w-xl mx-auto space-y-6">
        {/* Mode */}
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">What to identify</p>
          <div className="grid grid-cols-4 gap-2">
            {modeOptions.map(m => {
              const Icon = m.icon;
              return (
                <button key={m.id} type="button" onClick={() => setMode(m.id as any)}
                  className={`glass rounded-xl p-3 border-2 text-center transition-all ${
                    mode === m.id ? "border-emerald-500 bg-emerald-500/10" : "border-border/40 hover:border-emerald-500/40"
                  }`}>
                  <Icon className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                  <span className="text-xs font-semibold">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recorder */}
        <div className="glass rounded-2xl border border-border/50 p-8 text-center space-y-5">
          {state === "idle" || state === "error" ? (
            <>
              <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto">
                <Mic className="w-10 h-10 text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-lg">Hold still, record the sound</p>
                <p className="text-sm text-muted-foreground mt-1">Works best for birds, frogs, and insects. Record up to 10 seconds.</p>
              </div>
              {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</p>}
              <Button onClick={startRecording} className="bg-emerald-500 hover:bg-emerald-600 text-white w-full h-12 text-base font-semibold">
                <Mic className="w-5 h-5 mr-2" />Start Recording
              </Button>
            </>
          ) : state === "recording" ? (
            <>
              <div className="w-24 h-24 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center mx-auto animate-pulse">
                <Mic className="w-10 h-10 text-red-400" />
              </div>
              <div>
                <p className="font-bold text-2xl text-red-400">{seconds}s / 10s</p>
                <p className="text-sm text-muted-foreground">Recording… point your phone at the sound</p>
                <div className="w-full bg-border rounded-full h-2 mt-3">
                  <div className="bg-red-500 h-2 rounded-full transition-all" style={{ width: `${(seconds / 10) * 100}%` }} />
                </div>
              </div>
              <Button onClick={stopRecording} variant="outline" className="border-red-500/50 text-red-400 w-full h-12">
                <MicOff className="w-5 h-5 mr-2" />Stop & Identify
              </Button>
            </>
          ) : state === "processing" ? (
            <>
              <div className="w-24 h-24 rounded-full bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center mx-auto">
                <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
              </div>
              <p className="text-muted-foreground">Analysing sound pattern…</p>
            </>
          ) : null}
        </div>

        {/* Result */}
        {result && state === "done" && (
          <div className="glass rounded-2xl border border-emerald-500/30 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{result.species}</h2>
                <p className="text-emerald-400 italic text-sm">{result.scientific}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{result.type}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-bold text-emerald-400">{Math.round(result.confidence * 100)}%</div>
                <div className="text-xs text-muted-foreground">confidence</div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                <p className="font-semibold text-emerald-400 mb-1 flex items-center gap-1"><Volume2 className="w-3.5 h-3.5" />Sound</p>
                <p className="text-muted-foreground">{result.sound_desc}</p>
              </div>
              <div>
                <p className="font-semibold mb-1">About</p>
                <p className="text-muted-foreground">{result.description}</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Habitat</p>
                <p className="text-muted-foreground">{result.habitat}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {result.xeno_link && (
                <a href={result.xeno_link} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 border border-emerald-500/30 text-emerald-400 rounded-lg py-2 text-sm hover:bg-emerald-500/10 transition-colors">
                  <Volume2 className="w-4 h-4" />Listen (Xeno-canto)
                </a>
              )}
              {result.wiki_link && (
                <a href={result.wiki_link} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 border border-border/50 text-muted-foreground rounded-lg py-2 text-sm hover:bg-white/5 transition-colors">
                  <ExternalLink className="w-4 h-4" />Wikipedia
                </a>
              )}
            </div>

            <Button onClick={() => { setState("idle"); setResult(null); setSeconds(0); }}
              variant="outline" className="w-full border-border/50 text-muted-foreground">
              Record Again
            </Button>
          </div>
        )}

        {/* Tips */}
        <div className="glass rounded-xl p-4 border border-border/40 text-sm text-muted-foreground space-y-1.5">
          <p className="font-semibold text-foreground mb-2">Tips for best results</p>
          <p>• Record early morning — birds are most active at dawn</p>
          <p>• Stay still and quiet — reduce background noise</p>
          <p>• Point your phone toward the sound source</p>
          <p>• 5–10 second recordings work best</p>
          <p>• Works for frogs, crickets, and cicadas too</p>
        </div>
      </div>
    </div>
  );
}
