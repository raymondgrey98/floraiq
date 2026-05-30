import { Link, useLocation } from "wouter";
import { Leaf, BookOpen, Droplets, Map, Sprout } from "lucide-react";

const NAV_ITEMS = [
  { href: "/",        icon: Leaf,      label: "Home"    },
  { href: "/scan",    icon: "📷",      label: "Scan",   highlight: true },
  { href: "/history", icon: BookOpen,  label: "Library" },
  { href: "/map",     icon: Map,       label: "Map"     },
  { href: "/farm",    icon: Sprout,    label: "Farm"    },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border sm:hidden">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {NAV_ITEMS.map(item => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          const Icon = typeof item.icon !== "string" ? item.icon : null;

          if (item.highlight) {
            return (
              <Link key={item.href} href={item.href}>
                <button type="button"
                  className="flex flex-col items-center gap-0.5 -mt-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    isActive
                      ? "bg-emerald-400 scale-110"
                      : "bg-emerald-500 hover:bg-emerald-400"
                  }`}>
                    <span className="text-2xl">📷</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1">{item.label}</span>
                </button>
              </Link>
            );
          }

          return (
            <Link key={item.href} href={item.href}>
              <button type="button"
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  isActive ? "text-emerald-400" : "text-muted-foreground hover:text-foreground"
                }`}>
                {Icon && <Icon className={`w-5 h-5 ${isActive ? "text-emerald-400" : ""}`} />}
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && <div className="w-1 h-1 rounded-full bg-emerald-400" />}
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
