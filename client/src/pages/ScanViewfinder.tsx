/**
 * ScanViewfinder — Route: /scan
 *
 * Owns ONLY the camera hardware layer.
 * Captures a single JPEG Blob, stores it in WorkstationContext,
 * then immediately routes to /scan/processing.
 *
 * No API calls. No state conditionals. One job.
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useWorkstation } from "@/context/WorkstationContext";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import {
  Leaf, Bug, Bird, Fish, Skull, Sprout, Waves, AlertTriangle,
  Upload, ArrowLeft,
} from "lucide-react";

// On a real phone (Capacitor) we use the native camera for a reliable, premium
// capture; in the browser we fall back to the in-page getUserMedia viewfinder.
const IS_NATIVE = Capacitor.isNativePlatform();

const MODES = [
  { id: "plant",    label: "Plant",    Icon: Leaf,          grad: "from-emerald-500 to-green-700"  },
  { id: "insect",   label: "Insect",   Icon: Bug,           grad: "from-amber-500 to-orange-700"   },
  { id: "bird",     label: "Bird",     Icon: Bird,          grad: "from-blue-500 to-indigo-700"    },
  { id: "mushroom", label: "Fungi",    Icon: Sprout,        grad: "from-purple-500 to-violet-700"  },
  { id: "marine",   label: "Marine",   Icon: Fish,          grad: "from-cyan-500 to-teal-700"      },
  { id: "toxic",    label: "Toxic",    Icon: Skull,         grad: "from-red-500 to-rose-700"       },
  { id: "survival", label: "Survive",  Icon: AlertTriangle, grad: "from-orange-500 to-red-700"     },
];

export default function ScanViewfinder() {
  const [, setLocation]    = useLocation();
  const videoRef           = useRef<HTMLVideoElement>(null);
  const streamRef          = useRef<MediaStream | null>(null);
  const fileRef            = useRef<HTMLInputElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [camError,     setCamError]     = useState("");
  const [selectedMode, setSelectedMode] = useState("plant");

  const { setActiveScanBlob, setActiveScanMode } = useWorkstation();
  const sound = useSoundEffect();

  // ── Init camera (web only — native uses the OS camera on demand) ────────────
  useEffect(() => {
    if (IS_NATIVE) return;
    let mounted = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (!mounted) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } catch {
        if (mounted) setCamError("Camera access denied. Use upload instead.");
      }
    }

    startCamera();

    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // ── Capture frame → context → navigate ─────────────────────────────────────
  const captureFrame = useCallback(() => {
    if (!videoRef.current || !streamActive) return;
    sound("capture");

    const canvas      = document.createElement("canvas");
    canvas.width      = videoRef.current.videoWidth  || 1280;
    canvas.height     = videoRef.current.videoHeight || 720;
    canvas.getContext("2d")!.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(blob => {
      if (!blob) return;
      setActiveScanMode(selectedMode);
      setActiveScanBlob(blob);
      // Stop stream before leaving — prevents device lock
      streamRef.current?.getTracks().forEach(t => t.stop());
      setLocation("/scan/processing");
    }, "image/jpeg", 0.85);
  }, [streamActive, selectedMode, setActiveScanBlob, setActiveScanMode, setLocation]);

  // ── Native capture (Capacitor) — opens the OS camera, returns a JPEG ────────
  const captureNative = useCallback(async () => {
    try {
      sound("capture");
      const photo = await Camera.getPhoto({
        quality: 85,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        correctOrientation: true,
      });
      if (!photo.webPath) return;
      const blob = await (await fetch(photo.webPath)).blob();
      setActiveScanMode(selectedMode);
      setActiveScanBlob(blob);
      setLocation("/scan/processing");
    } catch {
      // user cancelled the camera or permission denied — stay on this screen
    }
  }, [selectedMode, setActiveScanBlob, setActiveScanMode, setLocation, sound]);

  // ── Upload fallback ─────────────────────────────────────────────────────────
  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setActiveScanMode(selectedMode);
    setActiveScanBlob(file);
    streamRef.current?.getTracks().forEach(t => t.stop());
    setLocation("/scan/processing");
  }, [selectedMode, setActiveScanBlob, setActiveScanMode, setLocation]);

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col"
      style={{ background: "#050c08" }}>

      {/* ── CAMERA FEED ─────────────────────────────────────────────────────── */}
      {streamActive && (
        <video
          ref={videoRef}
          autoPlay playsInline muted
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.9 }}
        />
      )}

      {/* ── DARK GRADIENT OVERLAYS ──────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

      {/* ── SCAN RETICLE ────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Corner brackets */}
        {(["tl","tr","bl","br"] as const).map(c => {
          const cls = {
            tl: "top-[20%] left-[10%]",
            tr: "top-[20%] right-[10%]",
            bl: "bottom-[25%] left-[10%]",
            br: "bottom-[25%] right-[10%]",
          }[c];
          const path = {
            tl: "M24,0 L0,0 L0,24",
            tr: "M0,0 L24,0 L24,24",
            bl: "M24,24 L0,24 L0,0",
            br: "M0,24 L24,24 L24,0",
          }[c];
          return (
            <svg key={c} width={28} height={28} className={`absolute ${cls}`}>
              <path d={path} fill="none" stroke="#34d399" strokeWidth={2.5} strokeLinecap="round" />
            </svg>
          );
        })}

        {/* Animated scan line */}
        {streamActive && (
          <motion.div
            initial={{ top: "22%" }} animate={{ top: ["22%", "72%", "22%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[10%] right-[10%] h-0.5 rounded-full"
            style={{
              background: "linear-gradient(90deg,transparent,#34d399,#10b981,#34d399,transparent)",
              boxShadow: "0 0 8px #34d399",
            }}
          />
        )}
      </div>

      {/* ── TOP BAR ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-safe pt-4 pb-3">
        <button
          type="button"
          onClick={() => { streamRef.current?.getTracks().forEach(t => t.stop()); setLocation("/"); }}
          className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur flex items-center justify-center border border-white/10">
          <ArrowLeft size={18} color="white" />
        </button>
        <span
          className="text-sm font-black tracking-widest uppercase px-3 py-1.5 rounded-full"
          style={{ background: "rgba(16,185,129,0.2)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" }}>
          {MODES.find(m => m.id === selectedMode)?.label ?? "Plant"}
        </span>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur flex items-center justify-center border border-white/10">
          <Upload size={16} color="rgba(255,255,255,0.7)" />
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>

      {/* ── MODE SELECTOR ───────────────────────────────────────────────────── */}
      <div className="relative z-10 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-none mt-1">
        {MODES.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => { sound("tap"); setSelectedMode(id); }}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
              selectedMode === id
                ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-300"
                : "border-white/10 bg-black/30 text-white/50"
            }`}>
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* ── ERROR ───────────────────────────────────────────────────────────── */}
      {camError && (
        <div className="relative z-10 mx-4 mt-4 px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm text-center">
          {camError}
        </div>
      )}

      {/* ── CAPTURE BUTTON ──────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center pb-safe pb-12 mt-auto px-6">
        <p className="text-white/40 text-xs mb-6 text-center">
          {IS_NATIVE
            ? "Tap the shutter to open your camera."
            : "Centre the subject inside the guide. Tap to identify."}
        </p>
        <motion.button
          type="button"
          onClick={IS_NATIVE ? captureNative : captureFrame}
          disabled={!IS_NATIVE && !streamActive}
          whileTap={{ scale: 0.92 }}
          className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-emerald-950/60 disabled:opacity-40"
          style={{
            background: "linear-gradient(135deg,#059669,#10b981)",
            boxShadow: (IS_NATIVE || streamActive) ? "0 0 28px rgba(16,185,129,0.6), 0 0 56px rgba(16,185,129,0.3)" : "none",
          }}>
          <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/20" />
          </div>
        </motion.button>
      </div>
    </div>
  );
}
