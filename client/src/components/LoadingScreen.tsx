import { motion, AnimatePresence } from "framer-motion";
import WaveOrb from "./WaveOrb";

interface Props {
  show: boolean;
  message?: string;
}

/**
 * Full-screen loading overlay with animated wave orb.
 * Usage: <LoadingScreen show={isLoading} message="Analysing plant..." />
 */
export default function LoadingScreen({ show, message = "Loading…" }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: "rgba(7,16,12,0.97)",
            backdropFilter: "blur(12px)",
          }}>

          {/* background glow */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse at 50% 50%,rgba(16,185,129,0.1) 0%,transparent 70%)",
          }} />

          {/* orb */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <WaveOrb size={220} color="#10b981" speed={1.2} waveIntensity={0.3} />
          </motion.div>

          {/* FloraIQ logo */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{ textAlign: "center", marginTop: 8 }}>
            <p style={{
              fontWeight: 900, fontSize: 22, letterSpacing: "-0.02em",
              background: "linear-gradient(135deg,#4ade80,#10b981)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>FloraIQ</p>
            <p style={{ fontSize: 13, marginTop: 6, color: "rgba(255,255,255,0.45)" }}>{message}</p>
          </motion.div>

          {/* progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            style={{ marginTop: 28, width: 160, height: 2, borderRadius: 99, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ height: "100%", width: "60%", borderRadius: 99, background: "linear-gradient(90deg,transparent,#10b981,#34d399,transparent)" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
