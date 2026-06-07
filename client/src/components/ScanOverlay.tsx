/**
 * ScanOverlay — scanning animation overlay.
 * States: idle (hidden) | scanning | success | error
 */
import type React from "react";
import { motion, AnimatePresence } from "framer-motion";

function Bracket({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  const s = 28;
  const paths = { tl: `M${s},0 L0,0 L0,${s}`, tr: `M0,0 L${s},0 L${s},${s}`, bl: `M${s},${s} L0,${s} L0,0`, br: `M0,${s} L${s},${s} L${s},0` };
  const pos: Record<string, React.CSSProperties> = { tl: { top:0, left:0 }, tr: { top:0, right:0 }, bl: { bottom:0, left:0 }, br: { bottom:0, right:0 } };
  return (
    <svg width={s} height={s} style={{ position:"absolute", ...pos[corner] }}>
      <path d={paths[corner]} fill="none" stroke="#34d399" strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
}

function PulseRing({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0.6 }}
      animate={{ scale: 1.6, opacity: 0 }}
      transition={{ duration: 2, delay, repeat: Infinity, ease: "easeOut" }}
      style={{ position:"absolute", inset:0, borderRadius:"50%", border:"1.5px solid rgba(52,211,153,0.5)", pointerEvents:"none" }}
    />
  );
}

export type ScanStatus = "idle" | "scanning" | "success" | "error";

export default function ScanOverlay({ status }: { status: ScanStatus }) {
  if (status === "idle") return null;

  return (
    <AnimatePresence>
      {(status === "scanning" || status === "success" || status === "error") && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ position:"absolute", inset:0, zIndex:10, backdropFilter:"blur(2px)", background:"rgba(7,16,12,0.35)", display:"flex", alignItems:"center", justifyContent:"center" }}>

          <div style={{ position:"relative", width:200, height:200 }}>
            {/* Neon border */}
            <motion.div
              animate={status === "scanning"
                ? { boxShadow: ["0 0 0px rgba(52,211,153,0.4)","0 0 20px rgba(52,211,153,0.8)","0 0 0px rgba(52,211,153,0.4)"] }
                : status === "success" ? { boxShadow:"0 0 30px rgba(52,211,153,1)" }
                : { boxShadow:"0 0 20px rgba(239,68,68,0.8)" }}
              transition={{ duration:1.4, repeat: status === "scanning" ? Infinity : 0 }}
              style={{ position:"absolute", inset:0, borderRadius:16, border:`2px solid ${status==="error"?"#ef4444":"#34d399"}` }}
            />

            {(["tl","tr","bl","br"] as const).map(c => <Bracket key={c} corner={c} />)}

            {status === "scanning" && (
              <motion.div
                initial={{ top:8 }} animate={{ top:[8,185,8] }}
                transition={{ duration:2.2, repeat:Infinity, ease:"easeInOut" }}
                style={{ position:"absolute", left:8, right:8, height:2, borderRadius:99, background:"linear-gradient(90deg,transparent,#34d399,#10b981,#34d399,transparent)", boxShadow:"0 0 8px #34d399" }}
              />
            )}

            {status === "scanning" && (
              <div style={{ position:"absolute", inset:"25%", borderRadius:"50%" }}>
                <PulseRing delay={0} /><PulseRing delay={0.7} /><PulseRing delay={1.4} />
              </div>
            )}

            {status === "success" && (
              <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring", stiffness:260, damping:20 }}
                style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width={64} height={64} viewBox="0 0 64 64">
                  <motion.circle cx={32} cy={32} r={28} fill="rgba(16,185,129,0.18)" stroke="#10b981" strokeWidth={2}
                    initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:0.4 }} />
                  <motion.path d="M18 32 L28 42 L46 22" fill="none" stroke="#4ade80" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:0.4, delay:0.1 }} />
                </svg>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div initial={{ scale:0 }} animate={{ scale:[1,1.15,1] }} transition={{ duration:0.3 }}
                style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width={56} height={56} viewBox="0 0 56 56">
                  <circle cx={28} cy={28} r={24} fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeWidth={2} />
                  <path d="M18 18 L38 38 M38 18 L18 38" stroke="#f87171" strokeWidth={3} strokeLinecap="round" />
                </svg>
              </motion.div>
            )}
          </div>

          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            style={{ position:"absolute", bottom:24, left:0, right:0, textAlign:"center" }}>
            {status === "scanning" && (
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.25em", textTransform:"uppercase", color:"#34d399" }}>
                Analysing<motion.span animate={{ opacity:[1,0,1] }} transition={{ duration:1, repeat:Infinity }}>{" ..."}</motion.span>
              </span>
            )}
            {status === "success" && <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#4ade80" }}>Identified ✓</span>}
            {status === "error"   && <span style={{ fontSize:11, fontWeight:700, color:"#f87171" }}>Could not identify — try again</span>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
