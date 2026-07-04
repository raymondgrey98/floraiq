/**
 * Onboarding — shown once on first launch (flag: floraiq_onboarded).
 *
 * Three slides that teach the product's shape in under 15 seconds:
 *   1. Identify anything  →  the camera is the hero
 *   2. Care intelligence  →  weather-aware, personal
 *   3. Earth intelligence →  NASA satellite + global maps
 *
 * Swipe or tap through; Skip is always available. Spring transitions,
 * honors prefers-reduced-motion via the global CSS kill-switch.
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CloudSun, Globe2, ArrowRight } from "lucide-react";

export const ONBOARD_KEY = "floraiq_onboarded";

export function hasOnboarded(): boolean {
  try { return localStorage.getItem(ONBOARD_KEY) === "1"; } catch { return true; }
}

const SLIDES = [
  {
    Icon: Camera,
    accent: "#55c877",
    title: "Identify any living thing",
    body: "Plants, birds, insects, fungi — point your camera and know the answer in seconds, in your language.",
    art: "🌿🦋🍄",
  },
  {
    Icon: CloudSun,
    accent: "#e9b95c",
    title: "Care that thinks ahead",
    body: "Weather-aware watering, fertilizer timing, and disease alerts tuned to your exact location — anywhere on Earth.",
    art: "🌦️🌱💧",
  },
  {
    Icon: Globe2,
    accent: "#5aa7de",
    title: "See the whole planet",
    body: "NASA satellite imagery, live natural events, rain radar, and biodiversity maps for all 196 countries.",
    art: "🛰️🌍🔥",
  },
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const slide = SLIDES[step];
  const last = step === SLIDES.length - 1;

  function finish() {
    try { localStorage.setItem(ONBOARD_KEY, "1"); } catch { /* private mode */ }
    setLocation("/");
    // Landing route re-renders and now shows Home
    window.dispatchEvent(new Event("floraiq-onboarded"));
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-background pt-safe pb-safe">
      {/* Ambient glow following the slide accent */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 opacity-25 transition-colors duration-700"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${slide.accent}, transparent 70%)` }}
      />

      <div className="flex items-center justify-between p-5">
        <span className="font-display text-lg font-semibold">FloraIQ</span>
        <button type="button" onClick={finish} className="text-sm font-medium text-muted-foreground">
          Skip
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <div
              className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] shadow-[var(--shadow-float)]"
              style={{ background: `linear-gradient(135deg, ${slide.accent}33, ${slide.accent}11)`, border: `1px solid ${slide.accent}44` }}
            >
              <slide.Icon size={40} style={{ color: slide.accent }} />
            </div>
            <p className="mb-4 text-3xl tracking-wide">{slide.art}</p>
            <h1 className="font-display mb-3 text-3xl font-semibold leading-tight" style={{ letterSpacing: "-0.015em" }}>
              {slide.title}
            </h1>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{slide.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-6 p-8">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setStep(i)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === step ? 24 : 8,
                background: i === step ? slide.accent : "var(--muted)",
              }}
            />
          ))}
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={() => (last ? finish() : setStep(step + 1))}
          className="flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)]"
        >
          {last ? "Start exploring" : "Next"}
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </div>
  );
}
