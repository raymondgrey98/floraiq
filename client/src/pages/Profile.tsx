import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft, Globe, Edit3, Camera } from "lucide-react";
import { SUPPORTED_LANGUAGES, useI18n } from "@/i18n";

const REGIONS = ["Global 🌍","North America","South America","Europe","Africa","Middle East","South Asia","East Asia","Southeast Asia","Australia & Oceania","Malaysia","Indonesia","Philippines","India","China","Japan","Kenya","Nigeria","South Africa","Brazil","United Kingdom","United States","Other"];

const BADGES = [
  { id:"first_scan",   emoji:"📷", name:"First Scan",        desc:"You scanned your first organism",            earned:true  },
  { id:"plant_lover",  emoji:"🌿", name:"Plant Lover",        desc:"Scanned 10 different plants",               earned:false },
  { id:"bug_hunter",   emoji:"🐛", name:"Bug Hunter",         desc:"Identified 5 insects",                      earned:false },
  { id:"mushroomer",   emoji:"🍄", name:"Mushroom Hunter",    desc:"Found 3 edible mushrooms",                  earned:false },
  { id:"bird_watcher", emoji:"🐦", name:"Bird Watcher",       desc:"Identified 5 bird species",                 earned:false },
  { id:"survivor",     emoji:"🏕️", name:"Jungle Survivor",    desc:"Used the survival toolkit",                 earned:false },
  { id:"farmer",       emoji:"🌾", name:"Smart Farmer",       desc:"Used the farm planner",                     earned:false },
  { id:"healer",       emoji:"💊", name:"Plant Healer",       desc:"Found 3 medicinal plants",                  earned:false },
  { id:"global",       emoji:"🌍", name:"Global Explorer",    desc:"Found species from 3 different countries",  earned:false },
  { id:"chef",         emoji:"🍳", name:"Wild Chef",          desc:"Cooked with 3 wild plants",                 earned:false },
];

const TYPE_EMOJI: Record<string, string> = { plant:"🌿", insect:"🐛", bird:"🐦", mushroom:"🍄", reptile:"🦎", marine:"🐠", animal:"🐾", fungus:"🍄" };

export default function Profile() {
  const [scans, setScans]       = useState<any[]>([]);
  const [name, setName]         = useState("Nature Explorer");
  const [editName, setEditName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [region, setRegion]     = useState("Global 🌍");
  const { lang, setLang }       = useI18n();
  const [tab, setTab]           = useState<"overview"|"badges"|"settings">("overview");

  useEffect(() => {
    try {
      const s = localStorage.getItem("floraiq_scan_history");
      if (s) setScans(JSON.parse(s));
      const savedName = localStorage.getItem("floraiq_name");
      if (savedName) setName(savedName);
      const savedRegion = localStorage.getItem("floraiq_region");
      if (savedRegion) setRegion(savedRegion);
    } catch {}
  }, []);

  function saveName() {
    const n = tempName.trim() || name;
    setName(n);
    localStorage.setItem("floraiq_name", n);
    setEditName(false);
  }

  function saveRegion(r: string) {
    setRegion(r);
    localStorage.setItem("floraiq_region", r);
  }

  // Language changes flow through the i18n provider (persisted + applied
  // app-wide, including RTL layout for Arabic) — no local handling needed.

  // Stats from real scan history
  const typeBreakdown = Object.entries(
    scans.reduce((acc: Record<string, number>, s) => { const t = s.type?.toLowerCase() || "plant"; acc[t] = (acc[t] || 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1]);

  const avgConfidence = scans.length ? Math.round(scans.reduce((a, s) => a + (s.confidence || 80), 0) / scans.length) : 0;
  const safeCount = scans.filter(s => s.riskLevel === "safe" || !s.riskLevel).length;
  const earnedBadges = BADGES.filter(b => b.earned || (b.id === "first_scan" && scans.length > 0));

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-14">
          <Link href="/"><button type="button" aria-label="Home" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-xl">👤</span>
          <h1 className="text-base font-bold">My Profile</h1>
        </div>
      </div>

      <div className="container py-5 max-w-2xl">
        {/* Profile card */}
        <div className="glass rounded-2xl p-5 border border-emerald-500/20 mb-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-2xl shadow-lg">
                🌿
              </div>
              <button type="button" className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <Camera className="w-3 h-3 text-white" />
              </button>
            </div>
            <div className="flex-1">
              {editName ? (
                <div className="flex gap-2">
                  <input autoFocus value={tempName} onChange={e => setTempName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && saveName()}
                    placeholder={name}
                    className="flex-1 bg-background border border-emerald-500/50 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
                  <button type="button" onClick={saveName} className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Save</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">{name}</h2>
                  <button type="button" onClick={() => { setTempName(name); setEditName(true); }} className="text-muted-foreground hover:text-emerald-400">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Globe className="w-3 h-3" />{region}</p>
              <p className="text-xs text-muted-foreground mt-0.5">🌍 FloraIQ Explorer · {scans.length} discoveries</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(["overview","badges","settings"] as const).map(t => (
            <button type="button" key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${tab === t ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>
              {t === "overview" ? "📊 Overview" : t === "badges" ? "🏆 Badges" : "⚙️ Settings"}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && <>
          {scans.length === 0 ? (
            <div className="text-center py-12 glass rounded-2xl border border-border/40">
              <p className="text-5xl mb-3">📷</p>
              <h3 className="font-bold mb-2">No discoveries yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Start scanning plants, animals, and insects to build your profile</p>
              <Link href="/scan">
                <button type="button" className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm">
                  Take My First Photo
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Big stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { val:scans.length, label:"Things found", emoji:"🔍", color:"text-emerald-400" },
                  { val:`${avgConfidence}%`, label:"AI accuracy", emoji:"🤖", color:"text-blue-400" },
                  { val:safeCount, label:"Safe species", emoji:"✅", color:"text-green-400" },
                  { val:typeBreakdown.length, label:"Different types", emoji:"🌍", color:"text-purple-400" },
                ].map(s => (
                  <div key={s.label} className="glass rounded-2xl p-4 border border-border/40 text-center">
                    <p className="text-2xl mb-1">{s.emoji}</p>
                    <p className={`text-xl font-bold ${s.color}`}>{s.val}</p>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* What I've found breakdown */}
              <div className="glass rounded-2xl p-5 border border-border/40">
                <h3 className="font-bold mb-3">What I've Found</h3>
                <div className="space-y-2.5">
                  {typeBreakdown.map(([type, count]) => (
                    <div key={type} className="flex items-center gap-3">
                      <span className="text-lg w-7">{TYPE_EMOJI[type] || "🔍"}</span>
                      <span className="text-sm capitalize w-16">{type === "insect" ? "Bug" : type === "marine" ? "Fish" : type}</span>
                      <div className="flex-1 h-2.5 bg-border/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                          style={{ width:`${(count / scans.length) * 100}%` }} />
                      </div>
                      <span className="text-sm font-bold text-emerald-400 w-6 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent scans */}
              <div className="glass rounded-2xl p-5 border border-border/40">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold">Recent Discoveries</h3>
                  <Link href="/journal"><span className="text-xs text-emerald-400">See all →</span></Link>
                </div>
                <div className="space-y-2">
                  {scans.slice(0, 5).map(scan => (
                    <div key={scan.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-border/20 flex items-center justify-center flex-shrink-0">
                        {scan.photoUrl
                          ? <img src={scan.photoUrl} alt={scan.name} className="w-full h-full object-cover" />
                          : <span className="text-xl">{TYPE_EMOJI[scan.type?.toLowerCase()] || "🔍"}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{scan.name}</p>
                        <p className="text-[11px] text-muted-foreground">{scan.date || "Recently scanned"}</p>
                      </div>
                      {scan.confidence && <span className="text-xs text-emerald-400 font-bold">{scan.confidence}%</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>}

        {/* BADGES */}
        {tab === "badges" && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">Earn badges by using FloraIQ and discovering new species</p>
            <div className="grid grid-cols-2 gap-3">
              {BADGES.map(b => {
                const isEarned = b.earned || (b.id === "first_scan" && scans.length > 0);
                return (
                  <div key={b.id} className={`glass rounded-2xl p-4 border transition-all ${isEarned ? "border-emerald-500/40 bg-emerald-500/5" : "border-border/30 opacity-50"}`}>
                    <p className={`text-3xl mb-2 ${isEarned ? "" : "grayscale"}`}>{b.emoji}</p>
                    <p className="font-bold text-sm">{b.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{b.desc}</p>
                    {isEarned && <span className="inline-block mt-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Earned ✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {tab === "settings" && (
          <div className="space-y-4">
            {/* Name */}
            <div className="glass rounded-2xl p-5 border border-border/40">
              <h3 className="font-bold mb-3">Your Name</h3>
              <div className="flex gap-2">
                <input value={editName ? tempName : name}
                  onChange={e => { setEditName(true); setTempName(e.target.value); }}
                  onBlur={saveName}
                  className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">This shows up in your journal and profile</p>
            </div>

            {/* Region */}
            <div className="glass rounded-2xl p-5 border border-border/40">
              <h3 className="font-bold mb-1">Where Are You? 🌍</h3>
              <p className="text-xs text-muted-foreground mb-3">Sets your local climate, market prices, and plant recommendations</p>
              <select value={region} onChange={e => saveRegion(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Language */}
            <div className="glass rounded-2xl p-5 border border-border/40">
              <h3 className="font-bold mb-1">Language 🗣️</h3>
              <p className="text-xs text-muted-foreground mb-3">FloraIQ will show plant names and info in your language</p>
              <select value={lang} onChange={e => setLang(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {SUPPORTED_LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.native} — {l.name}</option>
                ))}
              </select>
            </div>

            {/* Clear data */}
            <div className="glass rounded-2xl p-5 border border-red-500/20">
              <h3 className="font-bold mb-1 text-red-400">⚠️ Clear All My Data</h3>
              <p className="text-xs text-muted-foreground mb-3">This deletes all your scans, journal, and settings. Cannot be undone.</p>
              <button type="button" onClick={() => {
                if (window.confirm("Are you sure? This will delete ALL your scans and history.")) {
                  localStorage.clear();
                  setScans([]);
                  setName("Nature Explorer");
                }
              }} className="text-xs text-red-400 border border-red-500/30 px-4 py-2 rounded-xl hover:bg-red-500/10 transition">
                Delete all my data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
