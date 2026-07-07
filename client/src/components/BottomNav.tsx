import { Link, useLocation } from "wouter";
import { ScanLine, Sprout, Tractor, Globe2, BrainCircuit, type LucideIcon } from "lucide-react";

// Field OS navigation — the five core systems of the Nature Intelligence platform:
// Core (home dashboard + AI), Identify (perception), Grow (plant lifecycle),
// Farm (agricultural operations), World (ecological map).

interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  main?: boolean;
}

const NAV: NavItem[] = [
  { href: "/",       icon: BrainCircuit, label: "Core"               },
  { href: "/garden", icon: Sprout,       label: "Grow"               },
  { href: "/scan",   icon: ScanLine,     label: "Identify", main: true },
  { href: "/farm",   icon: Tractor,      label: "Farm"               },
  { href: "/map",    icon: Globe2,       label: "World"              },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#111111]/95 backdrop-blur-lg border-t border-white/8 sm:hidden">
      <div className="flex items-center justify-around px-2 pt-2 pb-safe pb-3">
        {NAV.map(item => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          const Icon = item.icon;

          if (item.main) {
            return (
              <Link key={item.href} href={item.href}>
                <button type="button" className="flex flex-col items-center gap-1 -mt-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all ${
                    isActive ? "bg-emerald-400 scale-110" : "bg-emerald-500 hover:bg-emerald-400"
                  }`}>
                    <Icon className="w-7 h-7 text-white" strokeWidth={2.2} />
                  </div>
                  <span className="text-[10px] text-white/50">{item.label}</span>
                </button>
              </Link>
            );
          }

          return (
            <Link key={item.href} href={item.href}>
              <button type="button" className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all">
                <Icon className={`w-5 h-5 transition-all ${isActive ? "text-emerald-400 scale-110" : "text-white/45 hover:text-white/75"}`} strokeWidth={2} />
                <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-emerald-400" : "text-white/40"}`}>
                  {item.label}
                </span>
                {isActive && <div className="w-1 h-1 rounded-full bg-emerald-400" />}
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
