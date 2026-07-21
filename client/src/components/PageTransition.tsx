/**
 * PageTransition — smooth route-change animation.
 *
 * Wraps the router so navigating fades/slides the new screen in instead of a
 * hard cut. Keyed on pathname so every route change re-triggers. Camera and
 * processing screens are excluded (they're full-bleed and animate themselves).
 * Fully disabled for users who prefer reduced motion.
 */
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

// Routes that own their own full-screen animation — don't double-animate them.
const EXCLUDED = ["/scan", "/scan/processing"];

export default function PageTransition({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  if (reduce || EXCLUDED.includes(location)) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
