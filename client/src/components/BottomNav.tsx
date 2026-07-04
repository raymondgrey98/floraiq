/**
 * BottomNav — floating glass dock (mobile only).
 *
 * Design notes (see /DESIGN.md):
 *  - Detached pill inset from the screen edges: reads as a layered surface
 *    floating above content rather than a hard-edged bar.
 *  - Center "Identify" action is raised, gradient-filled, and glowing —
 *    the camera is the product's hero interaction.
 *  - Active tab is marked by a spring-animated pill (framer-motion layoutId)
 *    plus color + weight shift; never color alone (WCAG 1.4.1).
 *  - Haptic tick on tab change where the platform supports it.
 *  - Sits above the Android gesture bar via safe-area padding.
 */
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  House,
  BookOpenText,
  Camera,
  Plant,
  UserCircle,
  type Icon,
} from "@phosphor-icons/react";
import { useT } from "../i18n";

interface NavItem {
  href: string;
  icon: Icon;
  labelKey: "nav.home" | "nav.library" | "nav.identify" | "nav.garden" | "nav.me";
  main?: boolean;
}

const NAV: NavItem[] = [
  { href: "/",        icon: House,        labelKey: "nav.home"    },
  { href: "/history", icon: BookOpenText, labelKey: "nav.library" },
  { href: "/scan",    icon: Camera,       labelKey: "nav.identify", main: true },
  { href: "/journal", icon: Plant,        labelKey: "nav.garden"  },
  { href: "/profile", icon: UserCircle,   labelKey: "nav.me"      },
];

function haptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(8);
  }
}

export default function BottomNav() {
  const [location] = useLocation();
  const t = useT();

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-safe sm:hidden pointer-events-none"
    >
      <div className="glass-strong pointer-events-auto mb-3 flex items-end justify-around rounded-3xl px-2 pb-2 pt-2 shadow-[var(--shadow-float)]">
        {NAV.map(item => {
          const isActive =
            location === item.href ||
            (item.href !== "/" && location.startsWith(item.href));
          const IconGlyph = item.icon;

          if (item.main) {
            return (
              <Link key={item.href} href={item.href}>
                <button
                  type="button"
                  aria-label={t(item.labelKey)}
                  aria-current={isActive ? "page" : undefined}
                  onClick={haptic}
                  className="-mt-7 flex min-w-16 flex-col items-center gap-1"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    className={`flex h-15 w-15 items-center justify-center rounded-full bg-gradient-to-br from-leaf-bright via-leaf to-moss shadow-[var(--shadow-glow)] ring-4 transition-all duration-300 ${
                      isActive ? "ring-leaf/35" : "ring-background/80"
                    }`}
                  >
                    <IconGlyph size={26} weight="fill" className="text-primary-foreground" />
                  </motion.div>
                  <span className={`text-[10px] font-semibold tracking-wide transition-colors ${
                    isActive ? "text-leaf" : "text-muted-foreground"
                  }`}>
                    {t(item.labelKey)}
                  </span>
                </button>
              </Link>
            );
          }

          return (
            <Link key={item.href} href={item.href}>
              <button
                type="button"
                aria-label={t(item.labelKey)}
                aria-current={isActive ? "page" : undefined}
                onClick={haptic}
                className="relative flex min-h-11 min-w-14 flex-col items-center justify-end gap-0.5 rounded-2xl px-2 pb-1 pt-1.5"
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-2xl bg-accent"
                  />
                )}
                <IconGlyph
                  size={22}
                  weight={isActive ? "fill" : "regular"}
                  className={`relative transition-colors duration-200 ${
                    isActive ? "text-leaf" : "text-muted-foreground"
                  }`}
                />
                <span className={`relative text-[10px] transition-all duration-200 ${
                  isActive ? "font-semibold text-leaf" : "font-medium text-muted-foreground"
                }`}>
                  {t(item.labelKey)}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
