import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass, Bell, Plus, ArrowRight, Leaf, Bug, Bird, Fish, Skull, Flower, Tree, Butterfly } from "@phosphor-icons/react";

function useScans() {
  const [scans, setScans] = useState<any[]>([]);
  useEffect(() => {
    try { const s = localStorage.getItem("floraiq_scan_history"); if (s) setScans(JSON.parse(s)); } catch {}
  }, []);
  return scans;
}

// Real Unsplash photos — nature/plants
const TRENDING = [
  { name:"Monstera",         scientific:"Monstera deliciosa",     tag:"Trending",     href:"/scan", img:"https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=280&q=80", tagCls:"bg-emerald-500/20 text-emerald-400" },
  { name:"Bird of Paradise", scientific:"Strelitzia reginae",     tag:"Popular",      href:"/scan", img:"https://images.unsplash.com/photo-1598335108814-1d0f8ce33e5d?w=280&q=80", tagCls:"bg-red-500/20 text-red-400" },
  { name:"Aloe Vera",        scientific:"Aloe barbadensis",       tag:"Medicinal",    href:"/medicinal", img:"https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=280&q=80", tagCls:"bg-lime-500/20 text-lime-400" },
  { name:"Lavender",         scientific:"Lavandula angustifolia", tag:"Calming",      href:"/herbs", img:"https://images.unsplash.com/photo-1499578124509-1611b77778c4?w=280&q=80", tagCls:"bg-purple-500/20 text-purple-400" },
  { name:"Pitcher Plant",    scientific:"Nepenthes spp.",         tag:"Carnivorous",  href:"/scan", img:"https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=280&q=80", tagCls:"bg-pink-500/20 text-pink-400" },
  { name:"Wild Mushroom",    scientific:"Various species",        tag:"Forage",       href:"/mushroom", img:"https://images.unsplash.com/photo-1504256934049-1f21d97aba3e?w=280&q=80", tagCls:"bg-amber-500/20 text-amber-400" },
];

const ARTICLES = [
  { title:"How to tell if a mushroom is safe to eat", img:"https://images.unsplash.com/photo-1504256934049-1f21d97aba3e?w=400&q=80", tag:"Safety", href:"/mushroom" },
  { title:"10 wild plants you can eat anywhere in the world", img:"https://images.unsplash.com/photo-1542621334-a254cf47733d?w=400&q=80", tag:"Foraging", href:"/edible" },
  { title:"Why your plant has yellow leaves — 6 real causes", img:"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80", tag:"Care", href:"/disease" },
  { title:"Kelulut honey — the superfood from Borneo bees", img:"https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80", tag:"Beekeeping", href:"/wildbees" },
];

const QUICK_ACTIONS = [
  { Icon:Leaf,      label:"Plants",   href:"/scan",      bg:"bg-emerald-500/15 border-emerald-500/25 text-emerald-400" },
  { Icon:Bug,       label:"Insects",  href:"/pest",      bg:"bg-amber-500/15 border-amber-500/25 text-amber-400" },
  { Icon:Bird,      label:"Birds",    href:"/birds",     bg:"bg-blue-500/15 border-blue-500/25 text-blue-400" },
  { Icon:Fish,      label:"Marine",   href:"/marine",    bg:"bg-cyan-500/15 border-cyan-500/25 text-cyan-400" },
  { Icon:Skull,     label:"Toxic",    href:"/toxic",     bg:"bg-red-500/15 border-red-500/25 text-red-400" },
  { Icon:Flower,    label:"Flowers",  href:"/flower",    bg:"bg-pink-500/15 border-pink-500/25 text-pink-400" },
  { Icon:Tree,      label:"Trees",    href:"/bark",      bg:"bg-green-700/20 border-green-700/30 text-green-400" },
  { Icon:Butterfly, label:"Insects",  href:"/butterfly", bg:"bg-violet-500/15 border-violet-500/25 text-violet-400" },
];

const CARE_TIPS = [
  { q:"Yellow leaves?",     a:"Usually too much water or not enough light. Touch the soil — if wet, stop watering for 7 days.", emoji:"🟡" },
  { q:"Not flowering?",     a:"Needs more sun or a short cool rest period. Move to a window. Most tropical plants flower in strong morning light.", emoji:"🌸" },
  { q:"Wilting fast?",      a:"Check the roots. Mushy = root rot from overwatering. Dry = needs water. Repot if roots are brown and soft.", emoji:"🥀" },
  { q:"White powder on leaves?", a:"That's powdery mildew — a fungus. Mix 1 tsp baking soda in 1L water, spray on leaves every 3 days.", emoji:"⚪" },
];

const TYPE_ICON: Record<string, string> = { plant:"🌿", insect:"🐛", bird:"🐦", mushroom:"🍄", reptile:"🦎", marine:"🐠" };

const fade = { hidden:{ opacity:0, y:16 }, show:{ opacity:1, y:0 } };

export default function Home() {
  const scans = useScans();
  const [tipIdx, setTipIdx] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Auto-rotate tips
  useEffect(() => {
    const t = setInterval(() => setTipIdx(i => (i + 1) % CARE_TIPS.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen text-white pb-28" style={{ background:"#0c0c0c" }}>

      {/* ─── TOP BAR ─────────────────────────────────── */}
      <motion.div initial={{ y:-20, opacity:0 }} animate={{ y:0, opacity:1 }}
        className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 border-b border-white/6"
        style={{ background:"rgba(12,12,12,0.92)", backdropFilter:"blur(20px)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Leaf weight="fill" size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">FloraIQ</span>
        </div>
        <div className="flex gap-2">
          <Link href="/tools">
            <button type="button" aria-label="Search tools" className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/8 transition">
              <MagnifyingGlass size={16} className="text-white/50" />
            </button>
          </Link>
          <Link href="/profile">
            <button type="button" aria-label="Profile and notifications" className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/8 transition">
              <Bell size={16} className="text-white/50" />
            </button>
          </Link>
        </div>
      </motion.div>

      {/* ─── HERO ────────────────────────────────────── */}
      <div ref={heroRef} className="relative overflow-hidden">
        {/* Nature photo background */}
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=70" alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-[#0c0c0c]/60 to-[#0c0c0c]" />
        </div>

        <div className="relative px-4 pt-8 pb-6">
          <motion.div initial="hidden" animate="show" variants={{ show:{ transition:{ staggerChildren:0.08 } } }}>
            <motion.p variants={fade} className="text-emerald-400 text-xs font-bold tracking-widest uppercase mb-1">Nature Intelligence</motion.p>
            <motion.h1 variants={fade} className="text-3xl font-black mb-2 leading-tight">
              What is this<br />plant?
            </motion.h1>
            <motion.p variants={fade} className="text-white/60 text-sm mb-6">
              Point your camera at any living thing — plant, insect, bird, or fungus — and know in 3 seconds.
            </motion.p>
          </motion.div>

          {/* Scan CTA */}
          <Link href="/scan">
            <motion.div whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
              className="flex items-center gap-4 rounded-2xl p-4 cursor-pointer"
              style={{ background:"linear-gradient(135deg,#10b981,#059669)", boxShadow:"0 8px 32px rgba(16,185,129,0.35)" }}>
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">📷</span>
              </div>
              <div className="flex-1">
                <p className="font-black text-lg text-white">Identify Now</p>
                <p className="text-white/70 text-xs">Free · Works offline · 400,000+ species</p>
              </div>
              <ArrowRight size={20} className="text-white/80" />
            </motion.div>
          </Link>

          {/* Stats row */}
          <div className="flex gap-6 mt-5 px-1">
            {[["400K+","Species"],["1B+","Records"],["196","Countries"],["Free","Forever"]].map(([v,l]) => (
              <div key={l} className="text-center">
                <p className="font-black text-emerald-400 text-sm">{v}</p>
                <p className="text-white/35 text-[9px] uppercase tracking-wide">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 space-y-7 mt-2">

        {/* ─── SEARCH ─────────────────────────────────── */}
        <Link href="/tools">
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 border border-white/10 cursor-pointer hover:bg-white/5 transition"
            style={{ background:"rgba(255,255,255,0.04)" }}>
            <MagnifyingGlass size={16} className="text-white/35" />
            <span className="text-white/35 text-sm">Search 100 tools, plants, animals...</span>
          </div>
        </Link>

        {/* ─── CATEGORY QUICK-ACCESS ──────────────────── */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once:true }} variants={{ show:{ transition:{ staggerChildren:0.05 } } }}>
          <h2 className="font-bold text-base mb-3">What do you want to identify?</h2>
          <div className="grid grid-cols-4 gap-2.5">
            {QUICK_ACTIONS.map(({ Icon, label, href, bg }) => (
              <motion.div key={href+label} variants={fade}>
                <Link href={href}>
                  <div className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-105 active:scale-95 ${bg}`}>
                      <Icon size={26} weight="duotone" />
                    </div>
                    <span className="text-[11px] text-white/55 font-medium">{label}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ─── MY GARDEN ──────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base">My Garden</h2>
            <Link href="/journal"><span className="text-xs text-emerald-400 flex items-center gap-1">See all <ArrowRight size={12} /></span></Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
            {/* Add new */}
            <Link href="/scan">
              <div className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer">
                <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-white/15 flex items-center justify-center hover:border-emerald-500/50 transition">
                  <Plus size={20} className="text-white/25" />
                </div>
                <span className="text-[10px] text-white/35 w-16 text-center">Add plant</span>
              </div>
            </Link>
            {scans.slice(0, 8).map(scan => (
              <Link key={scan.id} href="/journal">
                <motion.div whileTap={{ scale:0.95 }} className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center hover:border-emerald-500/40 transition">
                    {scan.photoUrl
                      ? <img src={scan.photoUrl} alt={scan.name} className="w-full h-full object-cover" />
                      : <span className="text-2xl">{TYPE_ICON[scan.type?.toLowerCase()] || "🌿"}</span>}
                  </div>
                  <span className="text-[10px] text-white/50 w-16 text-center truncate">{scan.name?.split(" ")[0]}</span>
                </motion.div>
              </Link>
            ))}
            {scans.length === 0 && (
              <p className="text-xs text-white/25 self-center ml-2 py-4">Scan a plant to add it here</p>
            )}
          </div>
        </div>

        {/* ─── RECENT SCANS ───────────────────────────── */}
        {scans.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-base">Recent Identifications</h2>
              <Link href="/journal"><span className="text-xs text-emerald-400 flex items-center gap-1">All <ArrowRight size={12} /></span></Link>
            </div>
            <div className="space-y-2">
              {scans.slice(0, 4).map((scan, i) => (
                <motion.div key={scan.id} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.05 }}>
                  <Link href="/journal">
                    <div className="flex items-center gap-3 rounded-2xl p-3 border border-white/8 hover:bg-white/5 transition cursor-pointer"
                      style={{ background:"rgba(255,255,255,0.04)" }}>
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/8 flex items-center justify-center flex-shrink-0 border border-white/8">
                        {scan.photoUrl
                          ? <img src={scan.photoUrl} alt={scan.name} className="w-full h-full object-cover" />
                          : <span className="text-2xl">{TYPE_ICON[scan.type?.toLowerCase()] || "🌿"}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{scan.name}</p>
                        <p className="text-xs text-white/35 italic truncate">{scan.scientific}</p>
                        <p className="text-[10px] text-white/25 mt-0.5">{scan.date || "Recently identified"}</p>
                      </div>
                      {scan.confidence && (
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-emerald-400">{scan.confidence}%</p>
                          <p className="text-[9px] text-white/25">match</p>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TRENDING — real Unsplash photos ────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base">Popular Plants</h2>
            <Link href="/history"><span className="text-xs text-emerald-400 flex items-center gap-1">Encyclopedia <ArrowRight size={12} /></span></Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
            {TRENDING.map((p, i) => (
              <motion.div key={p.name} initial={{ opacity:0, scale:0.9 }} whileInView={{ opacity:1, scale:1 }}
                transition={{ delay:i*0.05 }} viewport={{ once:true }}>
                <Link href={p.href}>
                  <div className="flex-shrink-0 w-40 rounded-2xl overflow-hidden border border-white/10 cursor-pointer hover:border-emerald-500/40 transition-all hover:scale-[1.02] active:scale-95"
                    style={{ background:"rgba(255,255,255,0.04)" }}>
                    <div className="h-28 overflow-hidden">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        onError={e => { (e.target as HTMLImageElement).style.display="none"; }} />
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-sm leading-tight">{p.name}</p>
                      <p className="text-[10px] text-white/35 italic mt-0.5 truncate">{p.scientific}</p>
                      <span className={`inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${p.tagCls}`}>{p.tag}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── ARTICLE CARDS — like PictureThis blog ─── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base">Plant Knowledge</h2>
            <Link href="/tools"><span className="text-xs text-emerald-400 flex items-center gap-1">More <ArrowRight size={12} /></span></Link>
          </div>
          <div className="space-y-3">
            {ARTICLES.map((a, i) => (
              <motion.div key={a.title} initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }}
                transition={{ delay:i*0.06 }} viewport={{ once:true }}>
                <Link href={a.href}>
                  <div className="flex gap-3 rounded-2xl overflow-hidden border border-white/8 cursor-pointer hover:bg-white/5 transition"
                    style={{ background:"rgba(255,255,255,0.04)" }}>
                    <div className="w-24 h-20 flex-shrink-0 overflow-hidden">
                      <img src={a.img} alt={a.title} className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display="none"; }} />
                    </div>
                    <div className="flex-1 py-3 pr-3 min-w-0">
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wide">{a.tag}</span>
                      <p className="text-sm font-semibold mt-0.5 leading-snug line-clamp-2">{a.title}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── CARE TIP ────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base">Care Tips</h2>
            <button type="button" onClick={() => setTipIdx(i => (i+1)%CARE_TIPS.length)} className="text-xs text-emerald-400">Next →</button>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tipIdx} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
              className="rounded-2xl p-5 border border-emerald-500/20"
              style={{ background:"linear-gradient(135deg,rgba(16,185,129,0.08),rgba(5,150,105,0.04))" }}>
              <p className="text-2xl mb-2">{CARE_TIPS[tipIdx].emoji}</p>
              <p className="font-bold mb-1">{CARE_TIPS[tipIdx].q}</p>
              <p className="text-sm text-white/55 leading-relaxed">{CARE_TIPS[tipIdx].a}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── GETTING STARTED (first-time) ─────────── */}
        {scans.length === 0 && (
          <div className="rounded-2xl p-5 border border-white/8" style={{ background:"rgba(255,255,255,0.04)" }}>
            <h3 className="font-bold mb-4">Get started in 3 steps</h3>
            {[
              { n:"01", t:"Take a photo", d:"Point at any plant, bug, bird, or mushroom — indoors or outdoors" },
              { n:"02", t:"Get the answer", d:"Name, safety, where it grows, and everything about it in seconds" },
              { n:"03", t:"Learn what to do", d:"Grow it, cook it, avoid it, or just know what you're looking at" },
            ].map(s => (
              <div key={s.n} className="flex gap-3 mb-4 last:mb-0">
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 font-black text-xs flex items-center justify-center flex-shrink-0">{s.n}</div>
                <div><p className="font-semibold text-sm">{s.t}</p><p className="text-xs text-white/40 mt-0.5">{s.d}</p></div>
              </div>
            ))}
            <Link href="/scan">
              <motion.button whileTap={{ scale:0.97 }} type="button"
                className="w-full mt-2 py-3.5 rounded-xl font-bold text-sm text-white transition"
                style={{ background:"linear-gradient(135deg,#10b981,#059669)", boxShadow:"0 4px 20px rgba(16,185,129,0.3)" }}>
                📷 Start for Free — No Account Needed
              </motion.button>
            </Link>
          </div>
        )}

        {/* ─── GLOBAL BANNER ──────────────────────────── */}
        <div className="relative rounded-2xl overflow-hidden">
          <img src="https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=70" alt="Plants global" className="absolute inset-0 w-full h-full object-cover opacity-20" />
          <div className="relative p-5 rounded-2xl border border-emerald-500/25"
            style={{ background:"linear-gradient(135deg,rgba(6,78,59,0.85),rgba(4,47,46,0.9))" }}>
            <p className="font-black text-lg mb-1">Works in every country</p>
            <p className="text-sm text-white/60 mb-3">Whether you're a farmer in Sarawak, a student in Kenya, a botanist in Brazil, or a hiker in Norway — FloraIQ works for you.</p>
            <div className="flex gap-2 flex-wrap text-lg">{"🇲🇾🇰🇪🇧🇷🇳🇴🇮🇳🇺🇸🇬🇧🇯🇵🇦🇺🇨🇳🇮🇩🇵🇭".match(/\p{Regional_Indicator}{2}/gu)?.map(f => <span key={f}>{f}</span>)}</div>
            <p className="text-[10px] text-white/30 mt-2">+180 more countries</p>
          </div>
        </div>

      </div>
    </div>
  );
}
