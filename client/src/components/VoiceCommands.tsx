import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Mic } from "lucide-react";
import { toast } from "sonner";

// Voice navigation via the Web Speech API (free, on-device in Chrome/Android).
// Say "scan", "water tracker", "species map", "my stats", "sound", etc.
// The button renders nothing on browsers without SpeechRecognition support.

const SpeechRecognitionImpl: any =
  typeof window !== "undefined" &&
  ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

interface Command {
  keywords: string[];
  href: string;
  label: string;
}

const COMMANDS: Command[] = [
  { keywords: ["scan", "identify", "photo", "camera"],          href: "/scan",     label: "Scan" },
  { keywords: ["water", "watering", "reminder"],                href: "/water",    label: "Water Tracker" },
  { keywords: ["disease", "sick", "diagnose"],                  href: "/disease",  label: "Disease Diagnosis" },
  { keywords: ["map", "species map", "world map"],              href: "/map",      label: "Species Map" },
  { keywords: ["forage", "wild plants"],                        href: "/forage",   label: "Forage Map" },
  { keywords: ["journal", "diary"],                             href: "/journal",  label: "Plant Journal" },
  { keywords: ["stats", "statistics", "analytics", "history"],  href: "/stats",    label: "Scan Stats" },
  { keywords: ["sound", "bird call", "audio", "listen"],        href: "/soundid",  label: "Sound ID" },
  { keywords: ["farm", "crops"],                                href: "/farm",     label: "Farm Planner" },
  { keywords: ["tools", "all tools", "hub"],                    href: "/tools",    label: "Tools Hub" },
  { keywords: ["toxic", "poison", "dangerous"],                 href: "/toxic",    label: "Toxic Plants" },
  { keywords: ["survival", "survive"],                          href: "/survival", label: "Survival Toolkit" },
  { keywords: ["store", "shop", "supplies"],                    href: "/agristore",label: "Agri Store Finder" },
  { keywords: ["home", "start", "main"],                        href: "/",         label: "Home" },
];

function matchCommand(transcript: string): Command | null {
  const t = transcript.toLowerCase();
  let best: Command | null = null;
  let bestLen = 0;
  for (const cmd of COMMANDS) {
    for (const kw of cmd.keywords) {
      if (t.includes(kw) && kw.length > bestLen) {
        best = cmd;
        bestLen = kw.length;
      }
    }
  }
  return best;
}

export default function VoiceCommands() {
  const [, navigate] = useLocation();
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);

  useEffect(() => () => recRef.current?.abort?.(), []);

  if (!SpeechRecognitionImpl) return null;

  function start() {
    if (listening) {
      recRef.current?.stop?.();
      return;
    }
    const rec = new SpeechRecognitionImpl();
    recRef.current = rec;
    rec.lang = navigator.language || "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 3;

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = (e: any) => {
      setListening(false);
      if (e.error === "not-allowed") {
        toast.error("Microphone permission needed for voice commands");
      }
    };
    rec.onresult = (e: any) => {
      const transcript: string = e.results?.[0]?.[0]?.transcript ?? "";
      const cmd = matchCommand(transcript);
      if (cmd) {
        toast.success(`Opening ${cmd.label}…`, { duration: 1500 });
        navigate(cmd.href);
      } else if (transcript.trim()) {
        // Unknown phrase → let SmartGuide answer it as a topic
        const slug = transcript.trim().toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-").slice(0, 60);
        toast(`Searching guide: "${transcript.trim()}"`, { duration: 1500 });
        navigate(`/guide/${slug}`);
      }
    };

    try {
      rec.start();
    } catch {
      setListening(false);
    }
  }

  return (
    <button
      type="button"
      onClick={start}
      title="Voice commands — say 'scan', 'water tracker', 'species map'…"
      aria-label="Voice commands"
      className={`fixed bottom-24 left-4 z-50 w-12 h-12 rounded-full border flex items-center justify-center transition-all shadow-lg ${
        listening
          ? "bg-red-500 border-red-400 text-white animate-pulse scale-110"
          : "glass border-emerald-500/40 text-emerald-400 hover:scale-105"
      }`}
    >
      <Mic className="w-5 h-5" />
    </button>
  );
}
