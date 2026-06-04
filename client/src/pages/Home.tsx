import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlass, Bell, Plus, ArrowRight, Leaf, Bug, Bird, Fish,
  Skull, Flower, Tree, Butterfly, Camera, Compass, Drop,
  FirstAidKit, MapTrifold, Flask,
} from "@phosphor-icons/react";

// ─── hooks ────────────────────────────────────────────────────────────────────
function useScans() {
  const [scans, setScans] = useState<any[]>([]);
  useEffect(() => {
    try { const s = localStorage.getItem("floraiq_scan_history"); if (s) setScans(JSON.parse(s)); } catch {}
  }, []);
  return scans;
}

// ─── static data ──────────────────────────────────────────────────────────────
const TRENDING = [
  { name: "Monstera",         scientific: "Monstera deliciosa",     tag: "Trending",    tagColor: "#10b981", href: "/scan",      img: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=80" },
  { name: "Bird of Paradise", scientific: "Strelitzia reginae",     tag: "Popular",     tagColor: "#f43f5e", href: "/scan",      img: "https://images.unsplash.com/photo-1598335108814-1d0f8ce33e5d?w=400&q=80" },
  { name: "Aloe Vera",        scientific: "Aloe barbadensis",       tag: "Medicinal",   tagColor: "#84cc16", href: "/medicinal", img: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400&q=80" },
  { name: "Lavender",         scientific: "Lavandula angustifolia", tag: "Calming",     tagColor: "#a855f7", href: "/herbs",     img: "https://images.unsplash.com/photo-1499578124509-1611b77778c4?w=400&q=80" },
  { name: "Pitcher Plant",    scientific: "Nepenthes spp.",         tag: "Carnivorous", tagColor: "#ec4899", href: "/scan",      img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80" },
  { name: "Wild Mushroom",    scientific: "Various species",        tag: "Forage",      tagColor: "#f59e0b", href: "/mushroom",  img: "https://images.unsplash.com/photo-1504256934049-1f21d97aba3e?w=400&q=80" },
];

const ARTICLES = [
  { title: "How to tell if a mushroom is safe to eat",         tag: "Safety",     tagColor: "#f59e0b", href: "/mushroom", img: "https://images.unsplash.com/photo-1504256934049-1f21d97aba3e?w=400&q=80" },
  { title: "10 wild plants you can eat anywhere in the world", tag: "Foraging",   tagColor: "#10b981", href: "/edible",   img: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=400&q=80" },
  { title: "Why your plant has yellow leaves — 6 real causes", tag: "Care",       tagColor: "#38bdf8", href: "/disease",  img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },
  { title: "Kelulut honey — the superfood from Borneo bees",   tag: "Beekeeping", tagColor: "#fbbf24", href: "/wildbees", img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80" },
];

const CATEGORIES = [
  { Icon: Leaf,      label: "Plants",   href: "/scan",      grad: "linear-gradient(135deg,#059669,#052e16)", glow: "rgba(16,185,129,0.65)" },
  { Icon: Bug,       label: "Insects",  href: "/pest",      grad: "linear-gradient(135deg,#d97706,#78350f)", glow: "rgba(245,158,11,0.65)" },
  { Icon: Bird,      label: "Birds",    href: "/birds",     grad: "linear-gradient(135deg,#2563eb,#1e3a8a)", glow: "rgba(59,130,246,0.65)" },
  { Icon: Fish,      label: "Marine",   href: "/marine",    grad: "linear-gradient(135deg,#0891b2,#164e63)", glow: "rgba(6,182,212,0.65)"  },
  { Icon: Skull,     label: "Toxic",    href: "/toxic",     grad: "linear-gradient(135deg,#dc2626,#7f1d1d)", glow: "rgba(239,68,68,0.65)"  },
  { Icon: Flower,    label: "Flowers",  href: "/flower",    grad: "linear-gradient(135deg,#db2777,#701a75)", glow: "rgba(236,72,153,0.65)" },
  { Icon: Tree,      label: "Trees",    href: "/bark",      grad: "linear-gradient(135deg,#16a34a,#052e16)", glow: "rgba(22,163,74,0.65)"  },
  { Icon: Butterfly, label: "Insects",  href: "/butterfly", grad: "linear-gradient(135deg,#7c3aed,#3b0764)", glow: "rgba(139,92,246,0.65)" },
];

const FEATURES = [
  { Icon: Flask,       label: "Disease Diagnosis", desc: "AI detects 38 plant diseases",     href: "/disease",  img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=75", accent: "#10b981" },
  { Icon: MapTrifold,  label: "Forage Map",         desc: "Wild edible plants near you",       href: "/forage",   img: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=600&q=75", accent: "#34d399" },
  { Icon: Leaf,        label: "Farm Assistant",     desc: "13-tab AI toolkit for farmers",     href: "/farm",     img: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&q=75", accent: "#86efac" },
  { Icon: Compass,     label: "Survival Toolkit",   desc: "Wilderness: edible, toxic, useful", href: "/survival", img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=75", accent: "#fbbf24" },
  { Icon: FirstAidKit, label: "Species Map",        desc: "Live GBIF sightings worldwide",     href: "/map",      img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=75", accent: "#38bdf8" },
  { Icon: Drop,        label: "Water Tracker",      desc: "Smart watering + overdue alerts",   href: "/water",    img: "https://images.unsplash.com/photo-1544785349-c4a5301826fd?w=600&q=75", accent: "#7dd3fc" },
];

const CARE_TIPS = [
  { q: "Yellow leaves?",          a: "Usually too much water or not enough light. Touch the soil — if wet, stop watering for 7 days.",          emoji: "🟡" },
  { q: "Not flowering?",          a: "Needs more sun or a short cool rest period. Most tropicals flower in strong morning light.",               emoji: "🌸" },
  { q: "Wilting fast?",           a: "Check roots. Mushy = root rot from overwatering. Dry = needs water. Repot if roots are brown.",           emoji: "🥀" },
  { q: "White powder on leaves?", a: "Powdery mildew. Mix 1 tsp baking soda in 1L water, spray on leaves every 3 days.",                       emoji: "⚪" },
];

const TYPE_ICON: Record<string, string> = { plant: "🌿", insect: "🐛", bird: "🐦", mushroom: "🍄", reptile: "🦎", marine: "🐠" };

// ─── Leaf SVG path (used for floating particles) ──────────────────────────────
const LEAF_PATH = "M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.71,19.7A4.49,4.49 0 0 0 8,20C19,20 22,3 22,3C21,5 14,5.33 10.06,7.64L8.73,5.73C10.16,5.27 11.68,5 13,5A8,8 0 0 1 17,8Z";

// ─── Floating leaf particles (Disney / Disneyland style) ──────────────────────
function FloatingLeaves() {
  const leaves = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x:        5 + (i * 5.5) % 90,           // spread left-to-right
    delay:    (i * 0.7) % 9,                  // stagger start
    duration: 9 + (i * 1.3) % 8,             // different speeds
    size:     10 + (i * 2.1) % 14,           // different sizes
    drift:    -30 + (i * 7) % 60,            // sideways drift px
    spin:     -180 + (i * 43) % 360,         // rotation
    opacity:  0.18 + (i * 0.04) % 0.28,      // subtle, not distracting
    color:    i % 3 === 0 ? "#34d399" : i % 3 === 1 ? "#10b981" : "#6ee7b7",
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {leaves.map(l => (
        <div key={l.id} style={{
          position: "absolute",
          left: `${l.x}%`,
          bottom: "-20px",
          width: l.size,
          height: l.size,
          animationName: "leafRise",
          animationDuration: `${l.duration}s`,
          animationDelay: `${l.delay}s`,
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
          animationFillMode: "both",
          "--drift": `${l.drift}px`,
          "--spin": `${l.spin}deg`,
        } as React.CSSProperties}>
          <svg viewBox="0 0 24 24" fill={l.color} style={{ opacity: l.opacity, width: "100%", height: "100%" }}>
            <path d={LEAF_PATH} />
          </svg>
        </div>
      ))}
    </div>
  );
}

// ─── Animated scan ring ───────────────────────────────────────────────────────
function ScanRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          position: "absolute",
          width: 120 + i * 80,
          height: 120 + i * 80,
          borderRadius: "50%",
          border: "1px solid rgba(16,185,129,0.12)",
          animationName: "ringPulse",
          animationDuration: "3s",
          animationDelay: `${i * 0.9}s`,
          animationTimingFunction: "ease-out",
          animationIterationCount: "infinite",
        }} />
      ))}
    </div>
  );
}

// ─── motion presets ───────────────────────────────────────────────────────────
const stagger = { show: { transition: { staggerChildren: 0.08 } } };
const fadeUp  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const scans = useScans();
  const [tip,  setTip]  = useState(0);
  const [hovCat, setHovCat] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setTip(i => (i + 1) % CARE_TIPS.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {/* ─────────────── GLOBAL KEYFRAMES ─────────────────────────────────── */}
      <style>{`
        @keyframes leafRise {
          0%   { transform: translateY(0) translateX(0) rotate(0deg) scale(0.8); opacity: 0; }
          8%   { opacity: 1; }
          85%  { opacity: 0.6; }
          100% { transform: translateY(-420px) translateX(var(--drift)) rotate(var(--spin)) scale(1.1); opacity: 0; }
        }
        @keyframes ringPulse {
          0%   { transform: scale(0.6); opacity: 0.5; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes blobA { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(55px,-75px) scale(1.2)} 70%{transform:translate(-30px,30px) scale(0.85)} }
        @keyframes blobB { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(-55px,50px) scale(1.15)} 70%{transform:translate(40px,-40px) scale(0.9)} }
        @keyframes blobC { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-45px) scale(1.25)} }
        @keyframes logoPulse { 0%,100%{box-shadow:0 0 6px rgba(16,185,129,0.3)} 50%{box-shadow:0 0 18px rgba(16,185,129,0.65)} }
        @keyframes btnGlow { 0%,100%{box-shadow:0 0 20px rgba(16,185,129,0.5),0 6px 40px rgba(16,185,129,0.25)} 50%{box-shadow:0 0 40px rgba(16,185,129,0.8),0 8px 60px rgba(16,185,129,0.4)} }
        @keyframes sweep  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes shimmer { 0%{background-position:-300% center} 100%{background-position:300% center} }
        .no-scroll { -ms-overflow-style:none; scrollbar-width:none; }
        .no-scroll::-webkit-scrollbar { display:none; }
      `}</style>

      <div className="min-h-screen text-white pb-28" style={{ background: "#07100c" }}>

        {/* ── NAV ───────────────────────────────────────────────────────────── */}
        <motion.nav
          initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "sticky", top: 0, zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 16px",
            background: "rgba(7,16,12,0.92)",
            backdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(16,185,129,0.1)",
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 12,
              background: "linear-gradient(135deg,#34d399,#059669)",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "logoPulse 2.8s ease-in-out infinite",
            }}>
              <Leaf weight="fill" size={15} color="white" />
            </div>
            <span style={{ fontWeight: 900, fontSize: 17, letterSpacing: "-0.02em" }}>FloraIQ</span>
            <span style={{
              fontSize: 8, fontWeight: 900, letterSpacing: "0.25em",
              padding: "2px 6px", borderRadius: 4,
              background: "rgba(16,185,129,0.15)", color: "#34d399",
              border: "1px solid rgba(16,185,129,0.25)",
            }}>BETA</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ href: "/tools", Icon: MagnifyingGlass }, { href: "/profile", Icon: Bell }].map(({ href, Icon }) => (
              <Link key={href} href={href}>
                <button type="button" style={{
                  width: 36, height: 36, borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "transparent", cursor: "pointer",
                }}>
                  <Icon size={15} color="rgba(255,255,255,0.45)" />
                </button>
              </Link>
            ))}
          </div>
        </motion.nav>

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <div style={{ position: "relative", overflow: "hidden", minHeight: 400 }}>

          {/* base gradient */}
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 0%,#0d2218 0%,#07100c 65%)" }} />

          {/* nature photo */}
          <img
            src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&q=60"
            alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.08 }}
          />

          {/* aurora orbs */}
          <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
            <div style={{ position:"absolute",width:700,height:700,borderRadius:"50%",top:-240,left:-130, background:"radial-gradient(circle,rgba(16,185,129,0.2) 0%,transparent 65%)", animation:"blobA 14s ease-in-out infinite" }} />
            <div style={{ position:"absolute",width:550,height:550,borderRadius:"50%",top:-80,right:-170,  background:"radial-gradient(circle,rgba(5,150,105,0.15) 0%,transparent 65%)", animation:"blobB 18s ease-in-out infinite" }} />
            <div style={{ position:"absolute",width:400,height:400,borderRadius:"50%",bottom:-80,left:"42%",background:"radial-gradient(circle,rgba(52,211,153,0.1) 0%,transparent 65%)",  animation:"blobC 22s ease-in-out infinite" }} />
          </div>

          {/* dot grid */}
          <div style={{ position:"absolute", inset:0, pointerEvents:"none",
            backgroundImage:"radial-gradient(rgba(16,185,129,0.1) 1px,transparent 1px)",
            backgroundSize:"34px 34px" }} />

          {/* ✨ DANCING LEAVES ✨ */}
          <FloatingLeaves />

          {/* scan rings (behind content) */}
          <ScanRings />

          {/* bottom vignette */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:80, background:"linear-gradient(to bottom,transparent,#07100c)", pointerEvents:"none" }} />

          {/* hero content */}
          <motion.div initial="hidden" animate="show" variants={stagger} style={{ position:"relative", padding:"40px 16px 44px" }}>

            <motion.div variants={fadeUp} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <div style={{ height:1, width:32, background:"linear-gradient(to right,transparent,#10b981)" }} />
              <span style={{ fontSize:10, fontWeight:900, letterSpacing:"0.3em", textTransform:"uppercase", color:"#34d399" }}>
                Nature Intelligence
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} style={{
              fontWeight:900, lineHeight:1.05, marginBottom:12,
              fontSize:"clamp(2.2rem,9vw,3rem)",
              textShadow:"0 2px 30px rgba(0,0,0,0.9)",
            }}>
              Identify Any<br />
              <span style={{
                background:"linear-gradient(135deg,#4ade80 0%,#34d399 50%,#10b981 100%)",
                backgroundSize:"200% auto",
                WebkitBackgroundClip:"text",
                WebkitTextFillColor:"transparent",
                animation:"shimmer 5s linear infinite",
              }}>
                Living Thing.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} style={{ fontSize:13, lineHeight:1.65, marginBottom:28, maxWidth:290, color:"rgba(255,255,255,0.52)" }}>
              Plant, insect, bird, or fungus — point your camera and know the answer in 3 seconds.
            </motion.p>

            {/* CTA button */}
            <motion.div variants={fadeUp}>
              <Link href="/scan">
                <motion.div
                  whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.96 }}
                  style={{
                    display:"flex", alignItems:"center", gap:16,
                    borderRadius:18, padding:16, cursor:"pointer",
                    position:"relative", overflow:"hidden",
                    background:"linear-gradient(135deg,#059669 0%,#10b981 60%,#34d399 100%)",
                    animation:"btnGlow 3s ease-in-out infinite",
                  }}>
                  {/* shimmer sweep */}
                  <div style={{
                    position:"absolute", inset:0, pointerEvents:"none",
                    background:"linear-gradient(110deg,transparent 30%,rgba(255,255,255,0.18) 50%,transparent 70%)",
                    backgroundSize:"200% 100%",
                    animation:"sweep 3s linear infinite",
                  }} />
                  <div style={{
                    width:56, height:56, borderRadius:14,
                    background:"rgba(255,255,255,0.2)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    flexShrink:0, animation:"floatY 3s ease-in-out infinite",
                  }}>
                    <Camera weight="duotone" size={28} color="white" />
                  </div>
                  <div style={{ flex:1, position:"relative" }}>
                    <p style={{ fontWeight:900, fontSize:18, color:"white", lineHeight:1.2 }}>Identify Now</p>
                    <p style={{ fontSize:11, marginTop:2, color:"rgba(255,255,255,0.72)" }}>Free · 400,000+ species · Works offline</p>
                  </div>
                  <ArrowRight size={20} color="rgba(255,255,255,0.8)" style={{ flexShrink:0, position:"relative" }} />
                </motion.div>
              </Link>
            </motion.div>

            {/* stats */}
            <motion.div variants={fadeUp} style={{ display:"flex", gap:24, marginTop:20, paddingLeft:4 }}>
              {[["400K+","Species"],["1B+","Records"],["196","Countries"],["Free","Forever"]].map(([v, l]) => (
                <div key={l}>
                  <p style={{ fontWeight:900, fontSize:13, color:"#4ade80" }}>{v}</p>
                  <p style={{ fontSize:9, textTransform:"uppercase", letterSpacing:"0.08em", marginTop:2, color:"rgba(255,255,255,0.28)" }}>{l}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── BODY CONTENT ──────────────────────────────────────────────────── */}
        <div style={{ padding:"0 16px" }}>

          {/* ── SEARCH ──────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
            style={{ marginTop:20, marginBottom:32 }}>
            <Link href="/tools">
              <motion.div whileHover={{ scale:1.01 }} style={{
                display:"flex", alignItems:"center", gap:12,
                borderRadius:16, padding:"12px 16px", cursor:"pointer",
                background:"rgba(16,185,129,0.05)",
                border:"1px solid rgba(16,185,129,0.12)",
              }}>
                <MagnifyingGlass size={14} color="rgba(52,211,153,0.5)" />
                <span style={{ flex:1, fontSize:13, color:"rgba(255,255,255,0.28)" }}>Search 100 tools, plants, animals…</span>
                <div style={{ display:"flex", gap:4 }}>
                  {["⌘","K"].map(k => (
                    <span key={k} style={{ fontSize:9, padding:"2px 5px", borderRadius:4, fontFamily:"monospace", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.2)" }}>{k}</span>
                  ))}
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* ── CATEGORIES ──────────────────────────────────────────────────── */}
          <motion.section
            initial="hidden" whileInView="show" viewport={{ once:true }} variants={stagger}
            style={{ marginBottom:36 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <h2 style={{ fontWeight:900, fontSize:15, margin:0 }}>What to Identify</h2>
              <span style={{ fontSize:10, fontWeight:900, letterSpacing:"0.15em", textTransform:"uppercase", padding:"3px 8px", borderRadius:6, background:"rgba(16,185,129,0.1)", color:"rgba(52,211,153,0.7)", border:"1px solid rgba(16,185,129,0.15)" }}>8 Modes</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
              {CATEGORIES.map(({ Icon, label, href, grad, glow }) => (
                <motion.div key={href+label} variants={fadeUp}>
                  <Link href={href}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, cursor:"pointer" }}>
                      <motion.div
                        whileHover={{ scale:1.14, y:-3 }} whileTap={{ scale:0.91 }}
                        onHoverStart={() => setHovCat(href+label)}
                        onHoverEnd={() => setHovCat(null)}
                        style={{
                          width:58, height:58, borderRadius:18,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          background:grad,
                          boxShadow: hovCat === href+label ? `0 0 22px ${glow},0 0 44px ${glow.replace("0.65","0.25")}` : "none",
                          transition:"box-shadow 0.25s ease",
                        }}>
                        <Icon size={24} weight="duotone" color="rgba(255,255,255,0.92)" />
                      </motion.div>
                      <span style={{ fontSize:11, fontWeight:500, color:"rgba(255,255,255,0.48)" }}>{label}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ── MY GARDEN ───────────────────────────────────────────────────── */}
          <section style={{ marginBottom:36 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <h2 style={{ fontWeight:900, fontSize:15, margin:0 }}>My Garden</h2>
              <Link href="/journal">
                <span style={{ fontSize:12, fontWeight:600, color:"#34d399", display:"flex", alignItems:"center", gap:4 }}>See all <ArrowRight size={11} /></span>
              </Link>
            </div>
            <div className="no-scroll" style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:4, margin:"0 -16px", padding:"0 16px 4px" }}>
              <Link href="/scan">
                <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:8, cursor:"pointer" }}>
                  <div style={{ width:64, height:64, borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", border:"2px dashed rgba(255,255,255,0.1)" }}>
                    <Plus size={20} color="rgba(255,255,255,0.2)" />
                  </div>
                  <span style={{ fontSize:10, width:64, textAlign:"center", color:"rgba(255,255,255,0.28)" }}>Add plant</span>
                </div>
              </Link>
              {scans.slice(0,8).map(scan => (
                <Link key={scan.id} href="/journal">
                  <motion.div whileTap={{ scale:0.93 }} style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:8, cursor:"pointer" }}>
                    <div style={{ width:64, height:64, borderRadius:16, overflow:"hidden", border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.04)" }}>
                      {scan.photoUrl
                        ? <img src={scan.photoUrl} alt={scan.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{TYPE_ICON[scan.type?.toLowerCase()]||"🌿"}</div>}
                    </div>
                    <span style={{ fontSize:10, width:64, textAlign:"center", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:"rgba(255,255,255,0.38)" }}>{scan.name?.split(" ")[0]}</span>
                  </motion.div>
                </Link>
              ))}
              {scans.length === 0 && (
                <p style={{ fontSize:12, alignSelf:"center", marginLeft:8, paddingTop:16, paddingBottom:16, color:"rgba(255,255,255,0.2)" }}>Scan a plant to add it here</p>
              )}
            </div>
          </section>

          {/* ── RECENT SCANS ────────────────────────────────────────────────── */}
          {scans.length > 0 && (
            <section style={{ marginBottom:36 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                <h2 style={{ fontWeight:900, fontSize:15, margin:0 }}>Recent Identifications</h2>
                <Link href="/journal"><span style={{ fontSize:12, fontWeight:600, color:"#34d399", display:"flex", alignItems:"center", gap:4 }}>All <ArrowRight size={11} /></span></Link>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {scans.slice(0,4).map((scan, i) => (
                  <motion.div key={scan.id} initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.06 }}>
                    <Link href="/journal">
                      <motion.div whileHover={{ x:3 }} style={{
                        display:"flex", alignItems:"center", gap:12,
                        borderRadius:16, padding:12, cursor:"pointer",
                        background:"rgba(16,185,129,0.04)", border:"1px solid rgba(16,185,129,0.1)",
                      }}>
                        <div style={{ width:48, height:48, borderRadius:12, overflow:"hidden", flexShrink:0, border:"1px solid rgba(255,255,255,0.07)", background:"rgba(255,255,255,0.05)" }}>
                          {scan.photoUrl
                            ? <img src={scan.photoUrl} alt={scan.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                            : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{TYPE_ICON[scan.type?.toLowerCase()]||"🌿"}</div>}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontWeight:700, fontSize:14, margin:0 }}>{scan.name}</p>
                          <p style={{ fontSize:12, fontStyle:"italic", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginTop:2, color:"rgba(255,255,255,0.3)" }}>{scan.scientific}</p>
                        </div>
                        {scan.confidence && (
                          <div style={{ textAlign:"right", flexShrink:0 }}>
                            <p style={{ fontSize:14, fontWeight:900, color:"#4ade80", margin:0 }}>{scan.confidence}%</p>
                            <p style={{ fontSize:9, textTransform:"uppercase", color:"rgba(255,255,255,0.22)" }}>match</p>
                          </div>
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ── POPULAR PLANTS ──────────────────────────────────────────────── */}
          <section style={{ marginBottom:36 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <h2 style={{ fontWeight:900, fontSize:15, margin:0 }}>Popular Plants</h2>
              <Link href="/history"><span style={{ fontSize:12, fontWeight:600, color:"#34d399", display:"flex", alignItems:"center", gap:4 }}>Encyclopedia <ArrowRight size={11} /></span></Link>
            </div>
            <div className="no-scroll" style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:8, margin:"0 -16px", padding:"0 16px 8px" }}>
              {TRENDING.map((p, i) => (
                <motion.div key={p.name}
                  initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                  transition={{ delay:i*0.06, duration:0.4, ease:[0.22,1,0.36,1] }}
                  viewport={{ once:true }}>
                  <Link href={p.href}>
                    <motion.div
                      whileHover={{ y:-5 }}
                      style={{
                        flexShrink:0, width:176, borderRadius:18, overflow:"hidden", cursor:"pointer",
                        background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)",
                        transition:"border-color 0.25s, box-shadow 0.25s",
                      }}
                      onHoverStart={e => {
                        const el = (e.target as HTMLElement).closest("[data-card]") as HTMLElement;
                        if (el) { el.style.borderColor = "rgba(16,185,129,0.4)"; el.style.boxShadow = "0 12px 40px rgba(16,185,129,0.15)"; }
                      }}>
                      <div style={{ position:"relative", height:128, overflow:"hidden" }}>
                        <motion.img whileHover={{ scale:1.08 }} transition={{ duration:0.5 }}
                          src={p.img} alt={p.name}
                          style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                          onError={e => { (e.target as HTMLImageElement).style.background = "#1a2e1e"; }}
                        />
                        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(7,16,12,0.9) 0%,transparent 55%)" }} />
                        <span style={{
                          position:"absolute", bottom:8, left:8, fontSize:9, fontWeight:900,
                          padding:"2px 7px", borderRadius:20,
                          background:`${p.tagColor}22`, color:p.tagColor, border:`1px solid ${p.tagColor}44`,
                        }}>{p.tag}</span>
                      </div>
                      <div style={{ padding:"10px 12px 12px" }}>
                        <p style={{ fontWeight:900, fontSize:14, margin:0, lineHeight:1.2 }}>{p.name}</p>
                        <p style={{ fontSize:10, fontStyle:"italic", marginTop:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:"rgba(255,255,255,0.3)" }}>{p.scientific}</p>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── EXPLORE FLORAIQ — photo cards ───────────────────────────────── */}
          <motion.section
            initial="hidden" whileInView="show" viewport={{ once:true }} variants={stagger}
            style={{ marginBottom:36 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <h2 style={{ fontWeight:900, fontSize:15, margin:0 }}>Explore FloraIQ</h2>
              <Link href="/tools"><span style={{ fontSize:12, fontWeight:600, color:"#34d399", display:"flex", alignItems:"center", gap:4 }}>All tools <ArrowRight size={11} /></span></Link>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {FEATURES.map(({ Icon, label, desc, href, img, accent }) => (
                <motion.div key={href} variants={fadeUp}>
                  <Link href={href}>
                    <motion.div
                      whileHover={{ y:-3 }}
                      style={{
                        position:"relative", borderRadius:18, overflow:"hidden",
                        height:148, cursor:"pointer",
                        transition:"box-shadow 0.3s",
                      }}
                      onHoverStart={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 14px 40px ${accent}35`; }}
                      onHoverEnd={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                      {/* photo */}
                      <img src={img} alt={label} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}
                        onError={e => { (e.target as HTMLImageElement).style.background = "#1a2e1e"; }} />
                      {/* dark overlay */}
                      <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(7,16,12,0.9) 0%,rgba(7,16,12,0.65) 100%)" }} />
                      {/* border */}
                      <div style={{ position:"absolute", inset:0, borderRadius:18, border:"1px solid rgba(255,255,255,0.09)" }} />
                      {/* content */}
                      <div style={{ position:"relative", height:"100%", padding:14, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                        <div style={{
                          width:36, height:36, borderRadius:10,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          background:`${accent}22`, border:`1px solid ${accent}40`,
                        }}>
                          <Icon size={18} color={accent} weight="duotone" />
                        </div>
                        <div>
                          <p style={{ fontWeight:900, fontSize:13, lineHeight:1.2, color:"white", margin:0 }}>{label}</p>
                          <p style={{ fontSize:10, marginTop:4, lineHeight:1.4, color:"rgba(255,255,255,0.42)" }}>{desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ── PLANT KNOWLEDGE ─────────────────────────────────────────────── */}
          <section style={{ marginBottom:36 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <h2 style={{ fontWeight:900, fontSize:15, margin:0 }}>Plant Knowledge</h2>
              <Link href="/tools"><span style={{ fontSize:12, fontWeight:600, color:"#34d399", display:"flex", alignItems:"center", gap:4 }}>More <ArrowRight size={11} /></span></Link>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {ARTICLES.map((a, i) => (
                <motion.div key={a.title}
                  initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }}
                  transition={{ delay:i*0.07, duration:0.4 }} viewport={{ once:true }}>
                  <Link href={a.href}>
                    <motion.div whileHover={{ x:3 }} style={{
                      display:"flex", borderRadius:18, overflow:"hidden", cursor:"pointer",
                      background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)",
                    }}>
                      <div style={{ width:88, height:76, flexShrink:0, overflow:"hidden", position:"relative" }}>
                        <motion.img whileHover={{ scale:1.08 }} transition={{ duration:0.4 }}
                          src={a.img} alt={a.title} style={{ width:"100%", height:"100%", objectFit:"cover" }}
                          onError={e => { (e.target as HTMLImageElement).style.background = "#1a2e1e"; }} />
                        <div style={{ position:"absolute", inset:0, background:"rgba(7,16,12,0.2)" }} />
                      </div>
                      <div style={{ flex:1, padding:"10px 12px", minWidth:0, display:"flex", flexDirection:"column", justifyContent:"center" }}>
                        <span style={{ fontSize:9, fontWeight:900, textTransform:"uppercase", letterSpacing:"0.18em", color:a.tagColor }}>{a.tag}</span>
                        <p style={{ fontSize:13, fontWeight:700, marginTop:3, lineHeight:1.35, color:"rgba(255,255,255,0.88)", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{a.title}</p>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", paddingRight:12 }}>
                        <ArrowRight size={13} color="rgba(255,255,255,0.18)" />
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── CARE TIPS ───────────────────────────────────────────────────── */}
          <section style={{ marginBottom:36 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <h2 style={{ fontWeight:900, fontSize:15, margin:0 }}>Care Tips</h2>
              <button type="button" onClick={() => setTip(i => (i+1) % CARE_TIPS.length)}
                style={{ fontSize:12, fontWeight:700, color:"#34d399", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
                Next <ArrowRight size={11} />
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={tip}
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
                transition={{ duration:0.25 }}
                style={{
                  borderRadius:18, padding:20, position:"relative", overflow:"hidden",
                  background:"linear-gradient(135deg,rgba(16,185,129,0.1),rgba(5,150,105,0.04))",
                  border:"1px solid rgba(16,185,129,0.18)",
                }}>
                <div style={{ position:"absolute", top:0, right:0, width:192, height:192, background:"radial-gradient(circle,rgba(16,185,129,0.16) 0%,transparent 70%)", transform:"translate(35%,-35%)", pointerEvents:"none" }} />
                <p style={{ fontSize:32, marginBottom:12 }}>{CARE_TIPS[tip].emoji}</p>
                <p style={{ fontWeight:900, fontSize:15, marginBottom:8 }}>{CARE_TIPS[tip].q}</p>
                <p style={{ fontSize:13, lineHeight:1.65, color:"rgba(255,255,255,0.52)" }}>{CARE_TIPS[tip].a}</p>
                <div style={{ display:"flex", gap:6, marginTop:16 }}>
                  {CARE_TIPS.map((_, idx) => (
                    <button key={idx} type="button" onClick={() => setTip(idx)}
                      style={{ borderRadius:99, border:"none", cursor:"pointer", transition:"all 0.3s", width:idx===tip?20:6, height:6, background:idx===tip?"#10b981":"rgba(255,255,255,0.14)" }} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </section>

          {/* ── GET STARTED ─────────────────────────────────────────────────── */}
          {scans.length === 0 && (
            <motion.section
              initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
              transition={{ duration:0.5 }} viewport={{ once:true }}
              style={{ marginBottom:36, borderRadius:18, padding:20, background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)" }}>
              <h3 style={{ fontWeight:900, fontSize:15, marginBottom:16, marginTop:0 }}>Get started in 3 steps</h3>
              {[
                { n:"01", t:"Take a photo",     d:"Point at any plant, bug, bird, or mushroom — indoors or outdoors" },
                { n:"02", t:"Get the answer",   d:"Name, safety, where it grows, and everything about it in seconds" },
                { n:"03", t:"Learn what to do", d:"Grow it, cook it, avoid it, or just know what you're looking at" },
              ].map((s, i) => (
                <motion.div key={s.n}
                  initial={{ opacity:0, x:-10 }} whileInView={{ opacity:1, x:0 }}
                  transition={{ delay:i*0.1 }} viewport={{ once:true }}
                  style={{ display:"flex", gap:12, marginBottom:16 }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontWeight:900, fontSize:11, background:"rgba(16,185,129,0.15)", color:"#34d399" }}>{s.n}</div>
                  <div>
                    <p style={{ fontWeight:700, fontSize:13, margin:0 }}>{s.t}</p>
                    <p style={{ fontSize:12, marginTop:3, color:"rgba(255,255,255,0.32)" }}>{s.d}</p>
                  </div>
                </motion.div>
              ))}
              <Link href="/scan">
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} type="button"
                  style={{ width:"100%", marginTop:8, padding:"15px 0", borderRadius:12, fontWeight:900, fontSize:13, color:"white", border:"none", cursor:"pointer", background:"linear-gradient(135deg,#059669,#10b981)", boxShadow:"0 4px 28px rgba(16,185,129,0.38)" }}>
                  📷 Start for Free — No Account Needed
                </motion.button>
              </Link>
            </motion.section>
          )}

          {/* ── GLOBAL BANNER ───────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
            transition={{ duration:0.5 }} viewport={{ once:true }}
            style={{ position:"relative", borderRadius:18, overflow:"hidden", marginBottom:24 }}>
            <img src="https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=700&q=60" alt=""
              style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.12 }} />
            <div style={{ position:"relative", padding:20, background:"linear-gradient(135deg,rgba(4,47,46,0.96),rgba(6,78,59,0.92))", border:"1px solid rgba(16,185,129,0.2)" }}>
              <p style={{ fontWeight:900, fontSize:15, margin:"0 0 4px" }}>Built for the whole world</p>
              <p style={{ fontSize:13, lineHeight:1.6, color:"rgba(255,255,255,0.48)", margin:"0 0 12px" }}>196 countries. Every climate. Every species.</p>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", fontSize:16 }}>
                {"🇲🇾🇰🇪🇧🇷🇳🇴🇮🇳🇺🇸🇬🇧🇯🇵🇦🇺🇨🇳🇮🇩🇵🇭".match(/\p{Regional_Indicator}{2}/gu)?.map(f => <span key={f}>{f}</span>)}
                <span style={{ fontSize:10, alignSelf:"center", marginLeft:4, color:"rgba(255,255,255,0.3)" }}>+181 more</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
}
