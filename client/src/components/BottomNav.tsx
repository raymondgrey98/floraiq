import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ScanLine, Sprout, Tractor, Globe2, Home, type LucideIcon } from "lucide-react";

// Premium floating dock — a glass pill lifted off the bottom edge with a raised,
// glowing central Scan button (PictureThis / Instagram style) and a smooth
// sliding active-indicator across the four side tabs.

interface NavItem { href: string; icon: LucideIcon; label: string; main?: boolean; }

const NAV: NavItem[] = [
  { href: "/",       icon: Home,     label: "Home"             },
  { href: "/garden", icon: Sprout,   label: "Grow"             },
  { href: "/scan",   icon: ScanLine, label: "Scan", main: true },
  { href: "/farm",   icon: Tractor,  label: "Farm"             },
  { href: "/map",    icon: Globe2,   label: "World"            },
];

/**
 * Routes that own the whole screen. The nav is hidden here because it sits on
 * top of the camera controls and swallows taps meant for the shutter.
 */
const FULLSCREEN_ROUTES = ["/scan", "/scan/processing", "/scan/results"];

export default function BottomNav() {
  const [location] = useLocation();
  const isActive = (href: string) => (href === "/" ? location === "/" : location.startsWith(href));

  if (FULLSCREEN_ROUTES.some(r => location === r || location.startsWith(`${r}/`))) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 sm:hidden pointer-events-none">
      <div
        className="pointer-events-auto mx-auto w-[calc(100%-24px)] max-w-md"
        style={{ marginBottom: "max(env(safe-area-inset-bottom), 12px)" }}>
        <div
          className="relative flex items-end justify-around rounded-[26px] px-3 pt-2.5 pb-2.5"
          style={{
            background: "rgba(9,17,13,0.86)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(16,185,129,0.18)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}>
          {NAV.map(item => {
            const active = isActive(item.href);
            const Icon = item.icon;

            // ── Raised central Scan button ──────────────────────────────────
            if (item.main) {
              return (
                <Link key={item.href} href={item.href}>
                  <motion.button type="button" whileTap={{ scale: 0.9 }} className="relative -mt-9 flex flex-col items-center">
                    <div
                      className="relative flex items-center justify-center rounded-full"
                      style={{
                        width: 62, height: 62,
                        background: "linear-gradient(135deg,#059669,#10b981 55%,#34d399)",
                        boxShadow: "0 8px 24px rgba(16,185,129,0.5), 0 0 0 6px rgba(9,17,13,0.86)",
                      }}>
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 rounded-full"
                        style={{ border: "2px solid rgba(52,211,153,0.6)" }}
                        animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      />
                      <Icon className="w-7 h-7 text-white" strokeWidth={2.3} />
                    </div>
                    <span className="mt-1 text-[10px] font-semibold" style={{ color: active ? "#34d399" : "rgba(255,255,255,0.5)" }}>
                      {item.label}
                    </span>
                  </motion.button>
                </Link>
              );
            }

            // ── Side tab with sliding active pill ───────────────────────────
            return (
              <Link key={item.href} href={item.href}>
                <motion.button type="button" whileTap={{ scale: 0.85 }} className="relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl">
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-2xl"
                      style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon className="relative w-[22px] h-[22px]" strokeWidth={2} style={{ color: active ? "#34d399" : "rgba(255,255,255,0.45)" }} />
                  <span className="relative text-[10px] font-medium" style={{ color: active ? "#34d399" : "rgba(255,255,255,0.4)" }}>
                    {item.label}
                  </span>
                </motion.button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
