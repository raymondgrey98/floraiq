/**
 * ConfidenceRing — animated identification-confidence indicator.
 *
 * Design rules (DESIGN.md): confidence is always shown as a number AND a
 * word, never a bare percentage; color grades wilt → sunlight → leaf; the
 * ring sweep animates on mount with a spring and the number counts up.
 * Both collapse instantly under prefers-reduced-motion.
 */
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

function grade(confidence: number) {
  if (confidence >= 75) return { color: "#55c877", word: "Very confident" };
  if (confidence >= 50) return { color: "#e9b95c", word: "Fairly confident" };
  return { color: "#e05648", word: "Worth a second photo" };
}

interface Props {
  /** 0–100 */
  confidence: number;
  /** outer diameter in px (default 72) */
  size?: number;
  /** show the word rating under the ring */
  showWord?: boolean;
}

export default function ConfidenceRing({ confidence, size = 72, showWord = true }: Props) {
  const reduced = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, Math.round(confidence)));
  const { color, word } = grade(clamped);

  const stroke = Math.max(4, size / 14);
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  // Count-up number synced roughly to the ring sweep
  const [display, setDisplay] = useState(reduced ? clamped : 0);
  useEffect(() => {
    if (reduced) { setDisplay(clamped); return; }
    const duration = 900;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setDisplay(Math.round(eased * clamped));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [clamped, reduced]);

  return (
    <div className="flex flex-col items-center gap-1" role="meter"
      aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}
      aria-label={`Identification confidence ${clamped}% — ${word}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke="currentColor" strokeWidth={stroke} className="text-muted/60" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: reduced ? circumference * (1 - clamped / 100) : circumference }}
            animate={{ strokeDashoffset: circumference * (1 - clamped / 100) }}
            transition={{ duration: reduced ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: `drop-shadow(0 0 ${stroke}px ${color}55)` }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center font-bold tabular-nums"
          style={{ color, fontSize: size / 3.4 }}>
          {display}%
        </span>
      </div>
      {showWord && (
        <p className="text-[10px] font-semibold" style={{ color }}>{word}</p>
      )}
    </div>
  );
}
