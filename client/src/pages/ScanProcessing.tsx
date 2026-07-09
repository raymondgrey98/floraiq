/**
 * ScanProcessing — Route: /scan/processing
 *
 * Isolated async execution stage.
 * Pulls Blob from WorkstationContext, dispatches POST /api/identify
 * with exponential-backoff retry, then routes to /scan/results/active.
 *
 * AbortController cancels the in-flight request if the user navigates away.
 * ref guard prevents double-firing in React StrictMode.
 */
import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useWorkstation, type PlantIdentificationResult } from "@/context/WorkstationContext";
import WaveOrb from "@/components/WaveOrb";

export default function ScanProcessing() {
  const { activeScanBlob, activeScanMode, setActiveScanResult } = useWorkstation();
  const [, setLocation] = useLocation();

  const dispatched  = useRef(false);
  const abortRef    = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!activeScanBlob) {
      toast.error("No image found. Please capture a photo first.");
      setLocation("/scan");
      return;
    }

    // Prevent double dispatch (React StrictMode)
    if (dispatched.current) return;
    dispatched.current = true;

    async function identify(blob: Blob, attempt = 1, maxAttempts = 3): Promise<void> {
      abortRef.current = new AbortController();

      const formData = new FormData();
      formData.append("image",   blob,           "capture.jpg");
      formData.append("context", `Scan mode: ${activeScanMode}`);

      // Best-effort geolocation to improve accuracy
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 2500 })
        );
        formData.append("location", JSON.stringify({
          latitude:  pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
      } catch { /* optional — carry on without it */ }

      try {
        const response = await fetch("/api/identify?lang=en", {
          method: "POST",
          body:   formData,
          // Abort on unmount OR after 35s — a hung API triggers a retry (TimeoutError)
          // instead of freezing the user on "Identifying…" forever.
          signal: AbortSignal.any([abortRef.current.signal, AbortSignal.timeout(35_000)]),
        });

        if (!response.ok) throw new Error(`Server returned ${response.status}`);

        const payload = (await response.json()) as PlantIdentificationResult;

        // Attach metadata before storing
        const enriched: PlantIdentificationResult = {
          ...payload,
          id:       Date.now(),
          scanMode: activeScanMode,
          date:     new Date().toLocaleDateString(),
          photoUrl: await blobToDataURL(blob),
        };

        setActiveScanResult(enriched);

        // Persist to localStorage history (non-fatal)
        try {
          // Store a 120px thumbnail instead of the full data URL — prevents localStorage overflow
          const thumb = await resizeDataURL(enriched.photoUrl ?? "", 120);
          const history = JSON.parse(localStorage.getItem("floraiq_scan_history") || "[]");
          history.unshift({
            id:         enriched.id,
            name:       enriched.commonNames?.en || enriched.scientificName,
            scientific: enriched.scientificName,
            type:       activeScanMode,
            confidence: Math.round((enriched.confidence || 0.5) * 100),
            photoUrl:   thumb,
            date:       enriched.date,
          });
          localStorage.setItem("floraiq_scan_history", JSON.stringify(history.slice(0, 50)));
          // Full result kept in sessionStorage (cleared on tab close, no size spiral)
          sessionStorage.setItem("floraiq_last_scan", JSON.stringify(enriched));
        } catch { /* storage full — non-fatal */ }

        setLocation("/scan/results/active");
      } catch (err: any) {
        if (err.name === "AbortError") return; // navigated away cleanly

        if (attempt < maxAttempts) {
          toast.warning(`Retrying… (${attempt}/${maxAttempts - 1})`);
          await delay(1000 * 2 ** (attempt - 1)); // 1s → 2s → 4s
          return identify(blob, attempt + 1, maxAttempts);
        }

        toast.error("Identification failed after 3 attempts. Try a clearer photo.");
        setLocation("/scan");
      }
    }

    identify(activeScanBlob);

    return () => {
      abortRef.current?.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — runs once on mount

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center gap-6 px-6"
      style={{ background: "#07100c" }}>

      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%,rgba(16,185,129,0.08) 0%,transparent 65%)" }}
      />

      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <WaveOrb size={240} color="#10b981" speed={1.4} waveIntensity={0.32} particles={360} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="text-center">
        <h2
          className="text-2xl font-black mb-2"
          style={{
            background: "linear-gradient(135deg,#4ade80,#34d399,#10b981)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
          Identifying…
        </h2>
        <p className="text-sm font-mono" style={{ color: "rgba(52,211,153,0.45)" }}>
          Querying nature intelligence across 400K+ species
        </p>
      </motion.div>

      {/* Progress sweep bar */}
      <div
        className="w-48 h-1 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.07)" }}>
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="h-full w-3/5 rounded-full"
          style={{ background: "linear-gradient(90deg,transparent,#10b981,#34d399,transparent)" }}
        />
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function delay(ms: number) {
  return new Promise<void>(res => setTimeout(res, ms));
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload  = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(blob);
  });
}

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
      res(canvas.toDataURL("image/jpeg", 0.6));
    };
    img.onerror = () => res("");
    img.src = dataURL;
  });
}
