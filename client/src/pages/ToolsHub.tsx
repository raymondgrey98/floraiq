import { Link } from "wouter";
import { ChevronLeft, Zap } from "lucide-react";

interface Tool {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  href: string;
  category: string;
  live: boolean;
}

const TOOLS: Tool[] = [
  // ── PLANT ID ──
  { id:"scan",         emoji:"📷", title:"Organism Scanner",        desc:"AI identifies plants, insects, birds, fungi from photo",         href:"/scan",        category:"Identify",    live:true  },
  { id:"disease",      emoji:"🔬", title:"Disease Diagnosis",        desc:"HuggingFace AI detects 38 plant diseases from photo",           href:"/disease",     category:"Identify",    live:true  },
  { id:"toxic",        emoji:"☠️", title:"Toxic Plants",             desc:"19 poisonous plants in Malaysia with first aid",                href:"/toxic",       category:"Safety",      live:true  },
  { id:"inat",         emoji:"🌍", title:"iNaturalist CV",           desc:"Secondary plant ID using iNaturalist computer vision",          href:"/scan",        category:"Identify",    live:true  },
  { id:"mushroom",     emoji:"🍄", title:"Mushroom Guide",           desc:"Malaysia fungi — edible, medicinal, deadly + iNaturalist",     href:"/mushroom",    category:"Identify",    live:true  },
  { id:"pest",         emoji:"🐛", title:"Pest Guide",               desc:"14 Malaysia crop pests — organic & chemical control",           href:"/pest",        category:"Identify",    live:true  },
  { id:"leaf",         emoji:"🍃", title:"Leaf Shape Analyzer",      desc:"Identify plants by leaf shape, margin, venation pattern",      href:"/leaf",        category:"Identify",    live:false },
  { id:"bark",         emoji:"🌲", title:"Tree Bark ID",             desc:"Identify trees from bark patterns and texture",                href:"/bark",        category:"Identify",    live:false },
  { id:"flower",       emoji:"🌸", title:"Flower ID",                desc:"Identify plants by flower colour, shape, petal count",         href:"/flower",      category:"Identify",    live:false },
  { id:"fruit",        emoji:"🍈", title:"Fruit & Seed ID",          desc:"Identify plants from fruit, seed, or pod photos",              href:"/fruit",       category:"Identify",    live:false },
  // ── CARE ──
  { id:"water",        emoji:"💧", title:"Water Tracker",            desc:"Schedule and track watering for all your plants",              href:"/water",       category:"Care",        live:true  },
  { id:"care",         emoji:"🌱", title:"Care Guide AI",            desc:"Personalised care plan — watering, sun, soil for any plant",   href:"/farm",        category:"Care",        live:true  },
  { id:"companion",    emoji:"🤝", title:"Companion Planting",       desc:"Which plants grow better together — natural pest control",     href:"/companion",   category:"Care",        live:true  },
  { id:"calendar",     emoji:"📅", title:"Planting Calendar",        desc:"Malaysia monthly planting schedule for 40+ crops",             href:"/calendar",    category:"Care",        live:true  },
  { id:"fertilizer",   emoji:"⚗️", title:"Fertilizer Calculator",   desc:"Calculate NPK ratio and dose for your soil type",             href:"/fertilizer",  category:"Care",        live:true  },
  { id:"soil",         emoji:"🪱", title:"Soil pH Guide",            desc:"Match plants to soil pH — test and adjust guide",              href:"/soil",        category:"Care",        live:true  },
  { id:"propagation",  emoji:"🌿", title:"Propagation Guide",        desc:"Grow new plants from cuttings, seeds, layering, grafting",    href:"/propagation", category:"Care",        live:true  },
  { id:"pruning",      emoji:"✂️", title:"Pruning Guide",            desc:"When and how to prune — by plant type and season",            href:"/pruning",     category:"Care",        live:true  },
  { id:"repot",        emoji:"🪴", title:"Repotting Guide",          desc:"When to repot, what soil to use, pot size guide",              href:"/repot",       category:"Care",        live:false },
  { id:"growthlog",    emoji:"📈", title:"Plant Growth Log",         desc:"Track height, health, photos of your plants over time",       href:"/growth",      category:"Care",        live:true  },
  // ── FOOD & FORAGE ──
  { id:"forage",       emoji:"🗺️", title:"Forage Map",               desc:"Edible & medicinal wild plants near you from GBIF",           href:"/forage",      category:"Food",        live:true  },
  { id:"herb",         emoji:"🌿", title:"Herb & Spice Guide",       desc:"60+ culinary herbs — uses, growing tips, substitutes",        href:"/herbs",       category:"Food",        live:true  },
  { id:"edible",       emoji:"🫚", title:"Edible Wild Plants",       desc:"Safe wild plants to eat in Malaysian jungle — ID guide",      href:"/edible",      category:"Food",        live:true  },
  { id:"medicinal",    emoji:"💊", title:"Medicinal Plants",         desc:"Traditional Malay & Iban plant medicine database",            href:"/medicinal",   category:"Food",        live:true  },
  { id:"nutrition",    emoji:"🥗", title:"Plant Nutrition",          desc:"Nutritional value of plants — USDA FoodData database",       href:"/nutrition",   category:"Food",        live:false },
  { id:"tea",          emoji:"🍵", title:"Wild Tea Plants",          desc:"Plants you can brew into tea — Malaysia jungle guide",        href:"/tea",         category:"Food",        live:true  },
  { id:"honey",        emoji:"🍯", title:"Honey Plants Guide",       desc:"Best plants for bees — attract pollinators to your garden",  href:"/honey",       category:"Food",        live:false },
  { id:"mushguide",    emoji:"🍄", title:"Mushroom Foraging",        desc:"Safe edible mushrooms in Malaysia — MycoPortal data",        href:"/mushforaging",category:"Food",        live:false },
  { id:"fruitguide",   emoji:"🥭", title:"Tropical Fruit Guide",     desc:"40+ Malaysian fruits — season, growing, nutrition",          href:"/fruits",      category:"Food",        live:false },
  { id:"forgcal",      emoji:"📆", title:"Foraging Calendar",        desc:"What's edible and in season each month in Malaysia",         href:"/foragecal",   category:"Food",        live:false },
  // ── FARM ──
  { id:"farm",         emoji:"🌾", title:"Farm Assistant",           desc:"13-tab farm planner — crops, pest, finance, market",          href:"/farm",        category:"Farm",        live:true  },
  { id:"finance",      emoji:"💰", title:"Farm Finance",             desc:"Track farm income, expenses, profit in RM",                  href:"/finance",     category:"Farm",        live:true  },
  { id:"irrigation",   emoji:"💦", title:"Irrigation Calculator",    desc:"Water needs per crop type, area, season",                    href:"/irrigation",  category:"Farm",        live:true  },
  { id:"rotation",     emoji:"🔄", title:"Crop Rotation Planner",   desc:"Rotate crops to avoid soil depletion and pests",             href:"/rotation",    category:"Farm",        live:true  },
  { id:"harvest",      emoji:"🌽", title:"Harvest Predictor",        desc:"Predict harvest date based on planting date and crop type",  href:"/harvest",     category:"Farm",        live:true  },
  { id:"market",       emoji:"🏪", title:"Market Price Tracker",     desc:"Live veg & fruit prices — Sabah/Sarawak markets in RM",      href:"/market",      category:"Farm",        live:false },
  { id:"organic",      emoji:"🌱", title:"Organic Pest Control",     desc:"Natural recipes — neem oil, chilli spray, soap spray",       href:"/organic",     category:"Farm",        live:true  },
  { id:"compost",      emoji:"♻️", title:"Composting Guide",         desc:"Turn kitchen waste into fertilizer — step by step",          href:"/compost",     category:"Farm",        live:true  },
  { id:"vertical",     emoji:"🏗️", title:"Vertical Garden Planner",  desc:"Design vertical gardens for small spaces and balconies",     href:"/vertical",    category:"Farm",        live:false },
  { id:"aqua",         emoji:"🐟", title:"Aquaponics Guide",         desc:"Fish + plants symbiosis — setup, stocking, crops",           href:"/aquaponics",  category:"Farm",        live:false },
  // ── WEATHER ──
  { id:"weather",      emoji:"🌦️", title:"Weather Dashboard",        desc:"Live weather + 7-day forecast for farming decisions",        href:"/farm",        category:"Weather",     live:true  },
  { id:"moon",         emoji:"🌙", title:"Moon Phase Calendar",      desc:"Plant by lunar cycle — full moon planting guide",            href:"/moon",        category:"Weather",     live:true  },
  { id:"uv",           emoji:"☀️", title:"UV & Sun Tracker",         desc:"UV index and sun hours — plan sun-loving plants",            href:"/uv",          category:"Weather",     live:false },
  { id:"rain",         emoji:"🌧️", title:"Rainfall Planner",         desc:"Historical rainfall data for irrigation planning",           href:"/rainfall",    category:"Weather",     live:false },
  { id:"flood",        emoji:"🌊", title:"Flood Risk Map",           desc:"Farm flood risk based on location and rainfall",             href:"/flood",       category:"Weather",     live:false },
  // ── WILDLIFE ──
  { id:"map",          emoji:"🗺️", title:"Species Map",              desc:"Live GBIF species occurrence dots — 300 records at once",    href:"/map",         category:"Wildlife",    live:true  },
  { id:"library",      emoji:"📚", title:"Species Library",          desc:"Browse 400K+ species by category — iNaturalist data",       href:"/history",     category:"Wildlife",    live:true  },
  { id:"bird",         emoji:"🐦", title:"Bird Guide",               desc:"Malaysian birds — calls, habitat, migration from eBird",    href:"/birds",       category:"Wildlife",    live:true  },
  { id:"audio",        emoji:"🎙️", title:"Sound ID",                 desc:"Record bird/insect sounds → AI identifies species",         href:"/soundid",     category:"Wildlife",    live:false },
  { id:"butterfly",    emoji:"🦋", title:"Butterfly Garden",         desc:"Attract butterflies — host plants and nectar sources",       href:"/butterfly",   category:"Wildlife",    live:true  },
  { id:"reptile",      emoji:"🦎", title:"Reptile Guide",            desc:"Snakes, lizards, frogs of Malaysia — safe vs dangerous",    href:"/reptiles",    category:"Wildlife",    live:false },
  { id:"spider",       emoji:"🕷️", title:"Spider ID",                desc:"Common Malaysian spiders — venomous vs harmless",           href:"/spiders",     category:"Wildlife",    live:false },
  { id:"marine",       emoji:"🐠", title:"Marine Life Guide",        desc:"Sarawak coastal & river species — FishBase + OBIS data",    href:"/marine",      category:"Wildlife",    live:false },
  { id:"tracks",       emoji:"🐾", title:"Animal Tracks",            desc:"Identify wildlife from footprints and signs",               href:"/tracks",      category:"Wildlife",    live:false },
  { id:"nocturnal",    emoji:"🦉", title:"Nocturnal Wildlife",       desc:"Night creatures of Borneo — proboscis monkey, tarsier...",  href:"/nocturnal",   category:"Wildlife",    live:false },
  // ── SURVIVAL ──
  { id:"survival",     emoji:"🏕️", title:"Survival Toolkit",         desc:"Edible, shelter, fire-starting, water-finding plants",      href:"/survival",    category:"Survival",    live:true  },
  { id:"landscape",    emoji:"🛰️", title:"Landscape Intel",          desc:"Satellite OSINT — terrain, vegetation, water sources",      href:"/landscape",   category:"Survival",    live:true  },
  { id:"firstaid",     emoji:"🩹", title:"Plant First Aid",          desc:"Jungle plants that treat cuts, stings, bites, fever",       href:"/firstaid",    category:"Survival",    live:true  },
  { id:"water2",       emoji:"🚿", title:"Water Purification Plants",desc:"Natural water filters — charcoal, roots, plants",           href:"/waterpure",   category:"Survival",    live:false },
  { id:"shelter",      emoji:"🏡", title:"Natural Shelter Builder",  desc:"Build emergency shelter using jungle plants and materials",  href:"/shelter",     category:"Survival",    live:false },
  { id:"rope",         emoji:"🪢", title:"Cordage Plants",           desc:"Plants you can use as rope, lashing, weaving material",    href:"/cordage",     category:"Survival",    live:false },
  { id:"fire",         emoji:"🔥", title:"Fire-Starting Plants",     desc:"Tinder, kindling, resin-rich plants for fire making",      href:"/fire",        category:"Survival",    live:false },
  { id:"navigate",     emoji:"🧭", title:"Nature Navigation",        desc:"Use sun, stars, moss, and plants for direction finding",   href:"/navigate",    category:"Survival",    live:false },
  { id:"repellent",    emoji:"🦟", title:"Natural Insect Repellent", desc:"Plants that repel mosquitoes, leeches, and ants",         href:"/repellent",   category:"Survival",    live:false },
  { id:"antidote",     emoji:"🧪", title:"Jungle Medicine",          desc:"Emergency plant treatments for common jungle hazards",     href:"/medicine",    category:"Survival",    live:false },
  // ── COMMUNITY ──
  { id:"journal",      emoji:"📓", title:"Plant Journal",            desc:"Your discovery log — all scans with photos and stats",      href:"/journal",     category:"Community",   live:true  },
  { id:"bioscan",      emoji:"📡", title:"BioScan Network",          desc:"Community species sightings synced to global map",          href:"/map",         category:"Community",   live:true  },
  { id:"profile",      emoji:"👤", title:"My Profile",              desc:"Your stats, achievements, and plant collection",            href:"/profile",     category:"Community",   live:true  },
  { id:"share",        emoji:"📤", title:"Share Discovery",          desc:"Share scan results via WhatsApp, Telegram, social media",   href:"/scan-results",category:"Community",   live:true  },
];

const CATEGORIES = ["All", "Identify", "Care", "Food", "Farm", "Weather", "Wildlife", "Survival", "Community"];

import { useState } from "react";

export default function ToolsHub() {
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = TOOLS.filter(t => {
    const matchCat = activeCat === "All" || t.category === activeCat;
    const matchSearch = !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const liveCount = TOOLS.filter(t => t.live).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/"><button type="button" aria-label="Go home" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <Zap className="w-6 h-6 text-emerald-400" />
          <div>
            <h1 className="text-xl font-bold">FloraIQ Tools</h1>
            <p className="text-xs text-muted-foreground">{liveCount} live · {TOOLS.length - liveCount} coming soon</p>
          </div>
        </div>

        {/* Search */}
        <div className="container pb-2">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-2" />
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {CATEGORIES.map(c => (
              <button type="button" key={c} onClick={() => setActiveCat(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeCat === c ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground hover:text-foreground"
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-6 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass rounded-xl p-4 border border-emerald-500/20 text-center">
            <p className="text-2xl font-bold text-emerald-400">{TOOLS.length}</p>
            <p className="text-xs text-muted-foreground">Total Tools</p>
          </div>
          <div className="glass rounded-xl p-4 border border-blue-500/20 text-center">
            <p className="text-2xl font-bold text-blue-400">{liveCount}</p>
            <p className="text-xs text-muted-foreground">Live Now</p>
          </div>
          <div className="glass rounded-xl p-4 border border-amber-500/20 text-center">
            <p className="text-2xl font-bold text-amber-400">{TOOLS.length - liveCount}</p>
            <p className="text-xs text-muted-foreground">Coming Soon</p>
          </div>
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(tool => (
            tool.live ? (
              <Link key={tool.id} href={tool.href}>
                <div className="glass rounded-xl p-4 border border-emerald-500/20 hover:border-emerald-500/50 transition-all cursor-pointer group h-full">
                  <div className="text-2xl mb-2">{tool.emoji}</div>
                  <p className="font-bold text-sm mb-1 group-hover:text-emerald-400 transition-colors">{tool.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">LIVE</span>
                </div>
              </Link>
            ) : (
              <div key={tool.id} className="glass rounded-xl p-4 border border-border/30 opacity-60 cursor-not-allowed h-full">
                <div className="text-2xl mb-2 grayscale">{tool.emoji}</div>
                <p className="font-bold text-sm mb-1">{tool.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
                <span className="inline-block mt-2 text-[10px] font-bold text-muted-foreground bg-border/30 px-2 py-0.5 rounded-full">SOON</span>
              </div>
            )
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-16">No tools match "{search}"</p>
        )}
      </div>
    </div>
  );
}
