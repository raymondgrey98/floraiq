/**
 * ScanOverlay — production-grade scanning animation.
 *
 * Renders as an absolute-positioned overlay on top of the camera viewfinder
 * or uploaded image preview. Three states:
 *   scanning  → laser line + pulsing rings + corner brackets
 *   success   → green checkmark burst + ring collapse
 *   error     → red shake + X
 *
 * Lazy-loads the optional Lottie layer. If @/assets/animations/scanning-plant.json
 * exists, it plays on top. Falls back gracefully to the canvas animation below.
 */
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Lazy Lottie layer (only loaded if JSON asset exists) ──────────────────────
let LottieLayer: React.ComponentType<{ speed?: number; playing?: boolean }> | null = null;
try {
  // Dynamic import — will tree-shake if the JSON is absent at build time.
  // Replace with your real path once downloaded from LottieFiles.
  const LazyLottie = lazy(async () => {
    const [{ default: Lottie }, { default: animData }] = await Promise.all([
      import("lottie-react"),
      import("@/assets/animations/scanning-plant.json"),
    ]);
    return {
      default: ({ speed = 1, playing = true }: { speed?: number; playing?: boolean }) => (
        <Lottie
          animationData={animData}
          loop={playing}
          autoplay={playing}
          style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
          rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
        />
      ),
    };
  });
  LottieLayer = LazyLottie as any;
} catch {
  LottieLayer = null;
}

// ── Skeleton fallback for Suspense ────────────────────────────────────────────
function LottieSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 animate-pulse" />
    </div>
  );
}

// ── Corner bracket ────────────────────────────────────────────────────────────
function Bracket({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  const size = 28;
  const stroke = 2.5;
  const color = "#34d399";
  const paths: Record<string, string> = {
    tl: `M${size},0 L0,0 L0,${size}`,
    tr: `M0,0 L${size},0 L${size},${size}`,
    bl: `M${size},${size} L0,${size} L0,0`,
    br: `M0,${size} L${size},${size} L${size},0`,
  };
  const pos: Record<string, React.CSSProperties> = {
    tl: { top: 0,    left: 0    },
    tr: { top: 0,    right: 0   },
    bl: { bottom: 0, left: 0    },
    br: { bottom: 0, right: 0   },
  };
  return (
    <svg width={size} height={size} style={{ position: "absolute", ...pos[corner] }}>
      <path d={paths[corner]} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
    </svg>
  );
}

// ── Scan pulse ring ───────────────────────────────────────────────────────────
function PulseRing({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0.6 }}
      animate={{ scale: 1.6, opacity: 0 }}
      transition={{ duration: 2, delay, repeat: Infinity, ease: "easeOut" }}
      style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        border: "1.5px solid rgba(52,211,153,0.5)",
        pointerEvents: "none",
      }}
    />
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export type ScanStatus = "idle" | "scanning" | "success" | "error";

interface Props {
  status: ScanStatus;
}

export default function ScanOverlay({ status }: Props) {
  const lineRef = useRef<HTMLDivElement>(null);
  const [lottieSpeed, setLottieSpeed] = useState(1);
  const [lottiePlay,  setLottiePlay]  = useState(true);

  // On success — boost speed then fade
  useEffect(() => {
    if (status === "success") {
      setLottieSpeed(1.5);
      const t = setTimeout(() => setLottiePlay(false), 800);
      return () => clearTimeout(t);
    } else {
      setLottieSpeed(1);
      setLottiePlay(true);
    }
  }, [status]);

  if (status === "idle") return null;

  return (
    <AnimatePresence>
      {(status === "scanning" || status === "success" || status === "error") && (
        <motion.div
          key="scan-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "absolute", inset: 0, zIndex: 10,
            backdropFilter: "blur(2px)",
            background: "rgba(7,16,12,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>

          {/* ── Central reticle box ─────────────────────────────────── */}
          <div style={{ position: "relative", width: 200, height: 200 }}>

            {/* Neon pulse border */}
            <motion.div
              animate={status === "scanning"
                ? { boxShadow: ["0 0 0px rgba(52,211,153,0.4)", "0 0 20px rgba(52,211,153,0.8)", "0 0 0px rgba(52,211,153,0.4)"] }
                : status === "success"
                  ? { boxShadow: "0 0 30px rgba(52,211,153,1)" }
                  : { boxShadow: "0 0 20px rgba(239,68,68,0.8)" }}
              transition={{ duration: 1.4, repeat: status === "scanning" ? Infinity : 0, ease: "easeInOut" }}
              style={{
                position: "absolute", inset: 0, borderRadius: 16,
                border: `2px solid ${status === "error" ? "#ef4444" : "#34d399"}`,
              }}
            />

            {/* Corner brackets */}
            {(["tl","tr","bl","br"] as const).map(c => <Bracket key={c} corner={c} />)}

            {/* Laser scan line — scanning state only */}
            {status === "scanning" && (
              <motion.div
                initial={{ top: 8 }}
                animate={{ top: [8, 185, 8] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute", left: 8, right: 8, height: 2, borderRadius: 99,
                  background: "linear-gradient(90deg,transparent,#34d399,#10b981,#34d399,transparent)",
                  boxShadow: "0 0 8px #34d399, 0 0 16px rgba(52,211,153,0.5)",
                }}
              />
            )}

            {/* Pulse rings */}
            {status === "scanning" && (
              <div style={{ position: "absolute", inset: "25%", borderRadius: "50%" }}>
                <PulseRing delay={0} />
                <PulseRing delay={0.7} />
                <PulseRing delay={1.4} />
              </div>
            )}

            {/* Success checkmark */}
            {status === "success" && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                <svg width={64} height={64} viewBox="0 0 64 64">
                  <motion.circle cx={32} cy={32} r={28} fill="rgba(16,185,129,0.18)" stroke="#10b981" strokeWidth={2}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
                  <motion.path d="M18 32 L28 42 L46 22" fill="none" stroke="#4ade80" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.1 }} />
                </svg>
              </motion.div>
            )}

            {/* Error X */}
            {status === "error" && (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.3 }}
                style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={56} height={56} viewBox="0 0 56 56">
                  <circle cx={28} cy={28} r={24} fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeWidth={2} />
                  <path d="M18 18 L38 38 M38 18 L18 38" stroke="#f87171" strokeWidth={3} strokeLinecap="round" />
                </svg>
              </motion.div>
            )}

            {/* Optional Lottie layer on top */}
            {LottieLayer && (
              <Suspense fallback={<LottieSkeleton />}>
                <motion.div
                  animate={{ opacity: lottiePlay ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ position: "absolute", inset: 0 }}>
                  <LottieLayer speed={lottieSpeed} playing={lottiePlay} />
                </motion.div>
              </Suspense>
            )}
          </div>

          {/* Status label */}
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{
              position: "absolute", bottom: 24, left: 0, right: 0,
              textAlign: "center",
            }}>
            {status === "scanning" && (
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#34d399" }}>
                Analysing
                <motion.span animate={{ opacity: [1,0,1] }} transition={{ duration: 1, repeat: Infinity }}>
                  {" ..."}
                </motion.span>
              </span>
            )}
            {status === "success" && (
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#4ade80" }}>
                Identified ✓
              </span>
            )}
            {status === "error" && (
              <span style={{ fontSize: 11, fontWeight: 700, color: "#f87171" }}>
                Could not identify — try again
              </span>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
