import { Link, useLocation } from "wouter";

const NAV = [
  { href:"/",        emoji:"🏠", label:"Home"        },
  { href:"/history", emoji:"📚", label:"Encyclopedia" },
  { href:"/scan",    emoji:"📷", label:"Identify",    main:true },
  { href:"/journal", emoji:"🌱", label:"My Garden"    },
  { href:"/profile", emoji:"👤", label:"Me"           },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#111111]/95 backdrop-blur-lg border-t border-white/8 sm:hidden">
      <div className="flex items-center justify-around px-2 pt-2 pb-safe pb-3">
        {NAV.map(item => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));

          if (item.main) {
            return (
              <Link key={item.href} href={item.href}>
                <button type="button" className="flex flex-col items-center gap-1 -mt-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all ${
                    isActive ? "bg-emerald-400 scale-110" : "bg-emerald-500 hover:bg-emerald-400"
                  }`}>
                    <span className="text-2xl">📷</span>
                  </div>
                  <span className="text-[10px] text-white/50">{item.label}</span>
                </button>
              </Link>
            );
          }

          return (
            <Link key={item.href} href={item.href}>
              <button type="button" className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all">
                <span className={`text-xl transition-all ${isActive ? "scale-110" : "opacity-50 hover:opacity-80"}`}>
                  {item.emoji}
                </span>
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
