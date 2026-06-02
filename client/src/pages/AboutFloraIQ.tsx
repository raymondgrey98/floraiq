import { Link } from "wouter";
import { ChevronLeft, Globe, Leaf, Microscope, Users, TrendingUp, Zap } from "lucide-react";

const STATS = [
  { value:"196", label:"Countries Served", icon:"🌍", color:"border-blue-500/30 text-blue-400" },
  { value:"400K+", label:"Species in Database", icon:"🌿", color:"border-green-500/30 text-green-400" },
  { value:"100+", label:"Tools & Features", icon:"⚡", color:"border-emerald-500/30 text-emerald-400" },
  { value:"38", label:"Disease Classes Detected", icon:"🔬", color:"border-purple-500/30 text-purple-400" },
  { value:"70+", label:"Free Data APIs", icon:"🔗", color:"border-cyan-500/30 text-cyan-400" },
  { value:"Free", label:"No subscription required", icon:"🎁", color:"border-amber-500/30 text-amber-400" },
];

const FEATURES = [
  { icon:"📷", title:"AI Organism Scanner", desc:"Point your camera at any plant, insect, bird, or fungi. FloraIQ identifies it in seconds using vision AI — trained on millions of global species." },
  { icon:"🔬", title:"Disease Diagnosis", desc:"Diagnose 38 plant diseases from a leaf photo. AI trained by HuggingFace models detects infections before they kill your crop." },
  { icon:"🌿", title:"Care Intelligence", desc:"Every scan returns personalised care — watering schedule, soil type, sunlight needs, fertilizer dose. Tailored for Malaysia's tropical climate." },
  { icon:"🗺️", title:"Global Species Map", desc:"Live GBIF occurrence data. See where any species has been spotted worldwide — 1 billion+ occurrence records from 196 countries." },
  { icon:"🐝", title:"Biodiversity Intelligence", desc:"Wildlife guides covering spiders, reptiles, birds, marine life, nocturnal animals, insects — all with Borneo and Malaysian focus." },
  { icon:"🌾", title:"Farm Management Suite", desc:"13-tab farm planner with crop rotation, irrigation calculator, harvest predictor, market prices in RM, and pest control guides." },
  { icon:"🏕️", title:"Survival & Wilderness", desc:"Jungle shelter building, water purification, edible wild plants, nature navigation. Built for Borneo's rainforest — works anywhere." },
  { icon:"🐟", title:"Aquaponics & Sustainable Farming", desc:"Complete guides for aquaponics, vermicomposting, kelulut beekeeping, and integrated farming systems for small-scale producers." },
];

const ROADMAP = [
  { phase:"Phase 1 — Done ✅", items:["68 live tools", "AI plant & organism scan", "Disease diagnosis", "Farm planner (13 tabs)", "Species map (GBIF live)", "Survival toolkit", "Wildlife guides"] },
  { phase:"Phase 2 — Building 🔨", items:["AR plant vision overlay", "Sound ID (BirdNET API)", "Drone farm mapping", "Digital plant twin", "Global toxic plants (all 196 countries)", "Lab & research mode", "Marketplace integration"] },
  { phase:"Phase 3 — Planned 📋", items:["Multi-agent AI (Botanist AI, Agronomist AI, Pathologist AI)", "Predictive outbreak detection", "Satellite farm monitoring", "Soil sensor integration", "Carbon sequestration tracker", "Multi-language (25 languages)", "Android APK (Play Store)"] },
  { phase:"Phase 4 — Vision 🚀", items:["Biotech lab management system", "Entrepreneurship SaaS layer", "196-country farmer network", "Global seed bank integration", "University research partnership", "IUCN conservation data live"] },
];

const MISSION_PILLARS = [
  { icon:"🌍", title:"Global from Day 1", desc:"Built for Malaysia but designed for 196 countries. All species data is global — GBIF covers every nation on Earth." },
  { icon:"🔬", title:"Science-Grade Data", desc:"Every fact is sourced from peer-reviewed databases: GBIF, iNaturalist, Kew Gardens, IUCN, EOL, Wikipedia, and HuggingFace AI." },
  { icon:"💚", title:"Free Forever Core", desc:"The core tools — scan, identify, care guide, maps — remain free. We believe nature intelligence should be accessible to everyone." },
  { icon:"🏝️", title:"Tropical First", desc:"Most apps are built for temperate climate. FloraIQ is built for tropical biodiversity — Malaysia, Borneo, Southeast Asia, and beyond." },
];

export default function AboutFloraIQ() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <Leaf className="w-5 h-5 text-emerald-400" />
          <div><h1 className="text-xl font-bold">About FloraIQ</h1><p className="text-xs text-muted-foreground">The botanist in your pocket — for everyone, everywhere</p></div>
        </div>
      </div>

      <div className="container py-8 max-w-4xl space-y-12">

        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-4xl">🌿</div>
          <h2 className="text-3xl font-bold">FloraIQ</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A nature intelligence platform that puts a botanist, agronomist, ecologist, and survival expert in your pocket — for free. Built in Kuching, Sarawak. Designed for the world.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/scan"><button type="button" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all">Try the Scanner</button></Link>
            <Link href="/tools"><button type="button" className="px-6 py-3 glass border border-emerald-500/40 text-emerald-400 rounded-xl font-bold transition-all hover:bg-emerald-500/10">Browse 100 Tools</button></Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {STATS.map(s => (
            <div key={s.label} className={`glass rounded-2xl p-5 border ${s.color} text-center`}>
              <p className="text-3xl mb-1">{s.icon}</p>
              <p className={`text-2xl font-bold ${s.color.split(" ")[1]}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Our Story */}
        <div className="glass rounded-2xl p-6 border border-emerald-500/20 space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2"><span>📖</span>Our Story</h3>
          <div className="space-y-3 text-muted-foreground">
            <p>FloraIQ was born in Kuching, Sarawak — the heart of one of the world's oldest and most biodiverse rainforests. Walking through Borneo's jungle, the question is always the same: <em>"What is this plant? Can I eat it? Is it dangerous? How do I grow it?"</em></p>
            <p>We built FloraIQ to answer those questions instantly — for hikers, farmers, botanists, students, and curious minds everywhere. Not just in Malaysia. In every country on Earth.</p>
            <p>Today, FloraIQ has <strong className="text-foreground">100 tools</strong>, <strong className="text-foreground">68 live</strong>, covering plant identification, disease diagnosis, farm management, survival skills, wildlife guides, and global supply marketplaces. And we're just getting started.</p>
          </div>
        </div>

        {/* Mission pillars */}
        <div>
          <h3 className="text-xl font-bold mb-4">Our Mission</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MISSION_PILLARS.map(m => (
              <div key={m.title} className="glass rounded-2xl p-5 border border-border/40 space-y-2">
                <span className="text-3xl">{m.icon}</span>
                <h4 className="font-bold">{m.title}</h4>
                <p className="text-sm text-muted-foreground">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-emerald-400" />What FloraIQ Does</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURES.map(f => (
              <div key={f.title} className="glass rounded-xl p-4 border border-border/40 flex gap-3">
                <span className="text-2xl flex-shrink-0">{f.icon}</span>
                <div><p className="font-bold text-sm mb-1">{f.title}</p><p className="text-xs text-muted-foreground">{f.desc}</p></div>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-400" />Roadmap to 100 Tools & Beyond</h3>
          <div className="space-y-4">
            {ROADMAP.map(r => (
              <div key={r.phase} className={`glass rounded-xl p-5 border ${r.phase.includes("✅") ? "border-emerald-500/30" : r.phase.includes("🔨") ? "border-amber-500/30" : "border-border/40"}`}>
                <p className={`font-bold mb-3 ${r.phase.includes("✅") ? "text-emerald-400" : r.phase.includes("🔨") ? "text-amber-400" : "text-muted-foreground"}`}>{r.phase}</p>
                <div className="flex flex-wrap gap-2">
                  {r.items.map(item => (
                    <span key={item} className="text-xs glass border border-border/40 px-2.5 py-1 rounded-full text-muted-foreground">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data sources */}
        <div className="glass rounded-2xl p-6 border border-blue-500/20">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Microscope className="w-5 h-5 text-blue-400" />Powered by 70+ Global Databases</h3>
          <div className="flex flex-wrap gap-2">
            {["GBIF (1B+ records)","iNaturalist (150M+ observations)","Kew Gardens POWO","IUCN Red List","eBird","Xeno-canto","Wikipedia","HuggingFace AI","OpenRouter Vision AI","USDA FoodData","MycoPortal","BHL Digital Library","EOL (Encyclopedia of Life)","PlantNet","MARDI Malaysia","Biodiversity Heritage Library","Google Scholar","Britannica","National Geographic"].map(db => (
              <span key={db} className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full">{db}</span>
            ))}
          </div>
        </div>

        {/* Global reach */}
        <div className="glass rounded-2xl p-6 border border-purple-500/20 text-center">
          <Globe className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Built for 196 Countries</h3>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">FloraIQ's species data covers every country on Earth via GBIF and iNaturalist. The app works for a farmer in Sarawak, a botanist in Brazil, a student in Kenya, and a hiker in Norway — equally.</p>
          <div className="flex flex-wrap gap-2 justify-center mt-4 text-2xl">
            {"🇲🇾🇺🇸🇬🇧🇦🇺🇳🇿🇮🇳🇧🇷🇰🇪🇳🇬🇿🇦🇯🇵🇰🇷🇨🇳🇮🇩🇵🇭🇹🇭🇻🇳🇩🇪🇫🇷🇪🇸🇮🇹🇳🇱🇸🇪🇳🇴".match(/\p{Regional_Indicator}{2}/gu) || []}
          </div>
          <p className="text-xs text-muted-foreground mt-2">...and 170+ more countries</p>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 py-4">
          <h3 className="text-2xl font-bold">Start Exploring Nature</h3>
          <p className="text-muted-foreground">Free. No account required. Works anywhere.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/scan"><button type="button" className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-lg transition-all">Scan a Plant Now</button></Link>
            <Link href="/tools"><button type="button" className="px-8 py-3 glass border border-emerald-500/40 text-emerald-400 rounded-xl font-bold text-lg transition-all">All Tools →</button></Link>
          </div>
        </div>

      </div>
    </div>
  );
}
