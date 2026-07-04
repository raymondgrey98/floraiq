import { Link } from "wouter";
import { useState } from "react";
import { Zap, Search } from "lucide-react";

interface Tool { id:string; emoji:string; title:string; desc:string; href:string; cat:string; live:boolean; }

const TOOLS: Tool[] = [
  // ── IDENTIFY ──────────────────────────────────────────────────────
  { id:"scan",      emoji:"📷", title:"Scan Anything",        desc:"Photo → instant name + info for any plant, bug, bird, or fungus",   href:"/scan",          cat:"Identify", live:true  },
  { id:"disease",   emoji:"🔬", title:"Is My Plant Sick?",    desc:"Take a leaf photo — AI spots the disease and tells you the fix",     href:"/disease",       cat:"Identify", live:true  },
  { id:"toxic",     emoji:"☠️", title:"Dangerous or Safe?",   desc:"Check if a plant is poisonous — what to do if touched or eaten",     href:"/toxic",         cat:"Identify", live:true  },
  { id:"mushroom",  emoji:"🍄", title:"Safe to Eat? Mushroom",desc:"Edible vs deadly fungi — field guide with photos",                   href:"/mushroom",      cat:"Identify", live:true  },
  { id:"pest",      emoji:"🐛", title:"What Bug Is This?",    desc:"ID crop pests — organic and chemical ways to stop them",             href:"/pest",          cat:"Identify", live:true  },
  { id:"leaf",      emoji:"🍃", title:"ID by Leaf Shape",     desc:"Identify plants from the shape, edge, and veins of the leaf",        href:"/leaf",          cat:"Identify", live:true  },
  { id:"flower",    emoji:"🌸", title:"ID by Flower",         desc:"Name a plant from its flower colour, shape, and petal count",        href:"/flower",        cat:"Identify", live:true  },
  { id:"anatomy",   emoji:"📐", title:"Label Plant Parts",    desc:"Tap any part of a plant photo — learn what it is and what it does",  href:"/anatomy",       cat:"Identify", live:true  },
  { id:"inat",      emoji:"🌍", title:"Double-Check with AI", desc:"Second AI opinion using iNaturalist computer vision",                href:"/scan",          cat:"Identify", live:true  },
  { id:"bark",      emoji:"🌲", title:"ID by Tree Bark",      desc:"Recognise trees from bark texture and pattern",                      href:"/bark",          cat:"Identify", live:false },
  { id:"fruit",     emoji:"🍈", title:"ID by Fruit or Seed",  desc:"Name a plant from the fruit, seed pod, or nut",                     href:"/fruit",         cat:"Identify", live:false },
  { id:"audio",     emoji:"🎙️", title:"What's That Sound?",   desc:"Record a bird or insect call — AI names the species",               href:"/soundid",       cat:"Identify", live:false },
  { id:"pitcher",   emoji:"🪣", title:"Pitcher Plants",       desc:"Carnivorous plants — ID, growing guide, conservation",               href:"/pitcher",       cat:"Identify", live:false },

  // ── GROW ──────────────────────────────────────────────────────────
  { id:"water",     emoji:"💧", title:"Watering Reminder",    desc:"Set schedules so you never forget to water your plants",             href:"/water",         cat:"Grow",     live:true  },
  { id:"care",      emoji:"🌱", title:"How Do I Grow This?",  desc:"AI gives you a personal care plan for any plant",                    href:"/farm",          cat:"Grow",     live:true  },
  { id:"companion", emoji:"🤝", title:"Best Plant Neighbours",desc:"Which plants help each other grow — natural pest protection",        href:"/companion",     cat:"Grow",     live:true  },
  { id:"calendar",  emoji:"📅", title:"When to Plant?",       desc:"Monthly planting guide — know exactly what to sow each month",       href:"/calendar",      cat:"Grow",     live:true  },
  { id:"fertilizer",emoji:"⚗️", title:"What Fertilizer?",    desc:"Calculate the right dose and type of fertilizer for your soil",      href:"/fertilizer",    cat:"Grow",     live:true  },
  { id:"soil",      emoji:"🪱", title:"Soil Check",           desc:"Match any plant to the right soil type and acidity (pH)",            href:"/soil",          cat:"Grow",     live:true  },
  { id:"propagation",emoji:"🌿",title:"Grow More for Free",   desc:"Copy any plant from cuttings, seeds, layering, or grafting",        href:"/propagation",   cat:"Grow",     live:true  },
  { id:"pruning",   emoji:"✂️", title:"When to Cut?",        desc:"Pruning guide — when, how much, and which branches to remove",       href:"/pruning",       cat:"Grow",     live:true  },
  { id:"repot",     emoji:"🪴", title:"Time to Repot?",       desc:"Signs your plant needs a bigger pot + soil mix recipes",             href:"/repot",         cat:"Grow",     live:true  },
  { id:"growth",    emoji:"📈", title:"Track Plant Growth",   desc:"Log your plant's height, health, and changes over time",             href:"/growth",        cat:"Grow",     live:true  },
  { id:"bonsai",    emoji:"🌳", title:"Bonsai — Tiny Trees",  desc:"Shape and grow miniature tropical trees",                           href:"/bonsai",        cat:"Grow",     live:true  },
  { id:"seeds",     emoji:"🌾", title:"Save Your Seeds",      desc:"How to collect, dry, and store seeds for next season",               href:"/seeds",         cat:"Grow",     live:true  },
  { id:"vertical",  emoji:"🏗️", title:"Small Space Garden",   desc:"Grow food on a wall, balcony, or fence using vertical systems",      href:"/vertical",      cat:"Grow",     live:true  },
  { id:"compost",   emoji:"♻️", title:"Make Free Fertilizer", desc:"Turn kitchen scraps into rich compost — step by step",              href:"/compost",       cat:"Grow",     live:true  },
  { id:"vermi",     emoji:"🪱", title:"Worm Composting",      desc:"Use worms to make the richest fertilizer possible",                  href:"/vermi",         cat:"Grow",     live:true  },
  { id:"orchid",    emoji:"🌺", title:"Grow Orchids",         desc:"Care guide for tropical orchids — light, water, repotting",          href:"/orchid",        cat:"Grow",     live:false },
  { id:"hydro",     emoji:"💧", title:"Grow Without Soil",    desc:"Hydroponics for beginners — NFT, DWC, and simple systems",          href:"/hydro",         cat:"Grow",     live:false },
  { id:"grafting",  emoji:"🔪", title:"Fruit Tree Grafting",  desc:"Join two plants together to grow better fruit — photo guide",        href:"/grafting",      cat:"Grow",     live:false },

  // ── FARM ──────────────────────────────────────────────────────────
  { id:"farm",      emoji:"🌾", title:"Full Farm Planner",    desc:"Plan crops, manage pests, track costs — all in one place",           href:"/farm",          cat:"Farm",     live:true  },
  { id:"finance",   emoji:"💰", title:"Farm Money Tracker",   desc:"Track what you earn and spend on your farm",                         href:"/finance",       cat:"Farm",     live:true  },
  { id:"irrigation",emoji:"💦", title:"How Much Water?",      desc:"Calculate water needs for any crop, field size, or season",          href:"/irrigation",    cat:"Farm",     live:true  },
  { id:"rotation",  emoji:"🔄", title:"What to Plant Next?",  desc:"Rotate your crops to keep soil healthy and avoid pests",             href:"/rotation",      cat:"Farm",     live:true  },
  { id:"harvest",   emoji:"🌽", title:"When Can I Harvest?",  desc:"Predict harvest date from planting date and crop type",              href:"/harvest",       cat:"Farm",     live:true  },
  { id:"market",    emoji:"🏪", title:"Market Prices",        desc:"Current vegetable and fruit prices at local markets",                href:"/market",        cat:"Farm",     live:true  },
  { id:"organic",   emoji:"🌱", title:"Natural Pest Control", desc:"Make your own sprays — neem oil, chili, soap — no chemicals",        href:"/organic",       cat:"Farm",     live:true  },
  { id:"aqua",      emoji:"🐟", title:"Fish + Plants Together",desc:"Aquaponics — grow fish and vegetables in one system",               href:"/aquaponics",    cat:"Farm",     live:true  },
  { id:"beekeeping",emoji:"🐝", title:"Beekeeping Guide",     desc:"Start a beehive — kelulut stingless bees or honeybees",              href:"/beekeeping",    cat:"Farm",     live:true  },
  { id:"wildbees",  emoji:"🍯", title:"Wild Bees Around You", desc:"ID wild bee species — which make honey, which to leave alone",       href:"/wildbees",      cat:"Farm",     live:true  },
  { id:"agristore", emoji:"📍", title:"Find Supplies Near Me",desc:"GPS locates the nearest garden shop, farm supply, or nursery",       href:"/agristore",     cat:"Farm",     live:true  },
  { id:"marketplace",emoji:"🛒",title:"Global Supply Shop",   desc:"Buy seeds, fertilizers, tools from suppliers in 196 countries",      href:"/marketplace",   cat:"Farm",     live:true  },
  { id:"agroforest",emoji:"🌲", title:"Farm + Forest Together",desc:"Grow trees, crops, and animals on the same land",                   href:"/agroforest",    cat:"Farm",     live:false },
  { id:"drip",      emoji:"💦", title:"Drip Irrigation Plan", desc:"Design an efficient drip watering system for your farm",             href:"/drip",          cat:"Farm",     live:false },
  { id:"bamboo",    emoji:"🎋", title:"Bamboo Guide",         desc:"Grow and use bamboo — building, food, craft, and income",            href:"/bamboo",        cat:"Farm",     live:false },
  { id:"insurance", emoji:"📋", title:"Crop Insurance Help",  desc:"Protect your harvest — government schemes explained simply",         href:"/insurance",     cat:"Farm",     live:false },

  // ── WEATHER ──────────────────────────────────────────────────────
  { id:"weathermap",emoji:"🛰️", title:"Weather Intelligence",  desc:"Live rain radar, cloud satellite, heat + wind map layers — tap anywhere on Earth for a forecast", href:"/weathermap", cat:"Farm", live:true },
  { id:"weather",   emoji:"🌦️", title:"Live Weather",         desc:"Today's weather + 7-day forecast for planting decisions",            href:"/farm",          cat:"Farm",     live:true  },
  { id:"moon",      emoji:"🌙", title:"Moon Planting Guide",  desc:"Best days to plant, prune, and harvest using the moon cycle",        href:"/moon",          cat:"Farm",     live:true  },
  { id:"uv",        emoji:"☀️", title:"Sun & UV Tracker",     desc:"UV levels by month — which plants need shade vs full sun",           href:"/uv",            cat:"Farm",     live:true  },
  { id:"rain",      emoji:"🌧️", title:"Rainfall Planner",     desc:"Historical rainfall by region — when do you need to irrigate?",      href:"/rainfall",      cat:"Farm",     live:true  },
  { id:"flood",     emoji:"🌊", title:"Flood Risk Check",     desc:"Is your farm at risk of flooding? Map-based risk guide",             href:"/flood",         cat:"Farm",     live:false },

  // ── EXPLORE ───────────────────────────────────────────────────────
  { id:"forage",    emoji:"🗺️", title:"Wild Plants Near Me",  desc:"Live map of edible and medicinal plants around your location",       href:"/forage",        cat:"Explore",  live:true  },
  { id:"map",       emoji:"🌐", title:"Species World Map",    desc:"See where any species has been spotted — 1 billion records",         href:"/map",           cat:"Explore",  live:true  },
  { id:"library",   emoji:"📚", title:"Species Encyclopedia", desc:"Browse 400,000+ species — animals, plants, insects, birds",          href:"/history",       cat:"Explore",  live:true  },
  { id:"bird",      emoji:"🐦", title:"Bird Guide",           desc:"ID any bird — listen to its call, see its habitat and range",        href:"/birds",         cat:"Explore",  live:true  },
  { id:"butterfly", emoji:"🦋", title:"Butterfly Guide",      desc:"Which plants attract butterflies? Host plants and nectar sources",    href:"/butterfly",     cat:"Explore",  live:true  },
  { id:"reptile",   emoji:"🦎", title:"Reptiles — Safe?",     desc:"Snakes, lizards, frogs — which are dangerous, what to do if bitten", href:"/reptiles",      cat:"Explore",  live:true  },
  { id:"spider",    emoji:"🕷️", title:"Spider — Safe?",       desc:"Venomous vs harmless spiders — what to do if bitten",               href:"/spiders",       cat:"Explore",  live:true  },
  { id:"marine",    emoji:"🐠", title:"Fish & River Life",    desc:"Edible fish, dangerous creatures — know before you swim or fish",    href:"/marine",        cat:"Explore",  live:true  },
  { id:"tracks",    emoji:"🐾", title:"Animal Footprints",    desc:"Find a footprint? Identify the animal that made it",                 href:"/tracks",        cat:"Explore",  live:true  },
  { id:"nocturnal", emoji:"🦉", title:"Night Animals",        desc:"What's making that noise at night? Nocturnal wildlife guide",        href:"/nocturnal",     cat:"Explore",  live:true  },
  { id:"forgcal",   emoji:"📆", title:"Foraging Calendar",    desc:"What wild plants are ready to eat this month in your region?",       href:"/foragecal",     cat:"Explore",  live:true  },
  { id:"edible",    emoji:"🫚", title:"Safe to Eat? Wild",    desc:"Which wild plants are edible — safe ID guide for the outdoors",      href:"/edible",        cat:"Explore",  live:true  },
  { id:"mushguide", emoji:"🍄", title:"Advanced Mushroom ID", desc:"Rare edible mushrooms — expert field guide with spore charts",       href:"/mushadv",       cat:"Explore",  live:false },
  { id:"dragonfly", emoji:"🪲", title:"Dragonfly Guide",      desc:"Dragonflies and damselflies — ID and water quality indicators",      href:"/dragonfly",     cat:"Explore",  live:false },
  { id:"hornbill",  emoji:"🦜", title:"Hornbill Spotter",     desc:"ID the 8 hornbill species — range, habits, best places to see",     href:"/hornbill",      cat:"Explore",  live:false },
  { id:"endemic",   emoji:"🌏", title:"Rare Endemic Species", desc:"Species found nowhere else on Earth — conservation guide",           href:"/endemic",       cat:"Explore",  live:false },
  { id:"coastal",   emoji:"🏖️", title:"Coastal Plants",       desc:"Plants that grow at the beach and in mangroves",                    href:"/coastal",       cat:"Explore",  live:false },
  { id:"rattans",   emoji:"🌴", title:"Palms & Rattans",      desc:"Wild palms and rattans — ID, uses, how to harvest",                 href:"/rattans",       cat:"Explore",  live:false },

  // ── FOOD & MEDICINE ───────────────────────────────────────────────
  { id:"herb",      emoji:"🌿", title:"Herb & Spice Guide",   desc:"60+ herbs — how to grow, what to cook, what to substitute",         href:"/herbs",         cat:"Explore",  live:true  },
  { id:"medicinal", emoji:"💊", title:"Plant Medicine Guide", desc:"Traditional healing plants — what they treat and how to use them",  href:"/medicinal",     cat:"Explore",  live:true  },
  { id:"nutrition", emoji:"🥗", title:"Plant Nutrition Data", desc:"How healthy is this plant? Vitamins, protein, minerals explained",  href:"/nutrition",     cat:"Explore",  live:true  },
  { id:"tea",       emoji:"🍵", title:"Make Wild Tea",        desc:"Wild plants you can brew into healthy teas",                        href:"/tea",           cat:"Explore",  live:true  },
  { id:"honey",     emoji:"🍯", title:"Best Plants for Bees", desc:"Which plants produce the most nectar and the best honey?",          href:"/honey",         cat:"Explore",  live:true  },
  { id:"fruitguide",emoji:"🥭", title:"Tropical Fruits",      desc:"40+ fruits — season, nutrition, how to grow, how to eat",           href:"/fruits",        cat:"Explore",  live:true  },
  { id:"cooking",   emoji:"🍳", title:"Cook Wild Plants",     desc:"Recipes, YouTube videos, allergy warnings for edible plants",       href:"/cooking",       cat:"Explore",  live:true  },
  { id:"naturaldyes",emoji:"🎨",title:"Natural Dye Plants",   desc:"Make fabric dye from plants — colours, techniques",                 href:"/naturaldyes",   cat:"Explore",  live:false },

  // ── SURVIVE ───────────────────────────────────────────────────────
  { id:"survival",  emoji:"🏕️", title:"Survival Guide",       desc:"Lost? Injured? Find food, water, shelter using plants around you",  href:"/survival",      cat:"Survive",  live:true  },
  { id:"landscape", emoji:"🛰️", title:"See Land From Satellite",desc:"Read any terrain from above — water, shelter, paths",             href:"/landscape",     cat:"Survive",  live:true  },
  { id:"firstaid",  emoji:"🩹", title:"Plant First Aid",       desc:"Which plants heal cuts, stings, fever, and bites",                  href:"/firstaid",      cat:"Survive",  live:true  },
  { id:"shelter",   emoji:"🏕️", title:"Build a Shelter",       desc:"Step-by-step jungle shelter from leaves and branches",             href:"/shelter",       cat:"Survive",  live:true  },
  { id:"survivalplants",emoji:"🌿",title:"Wild Survival Plants",desc:"Water, food, rope, fire, medicine — all from nature",              href:"/survivalplants",cat:"Survive",  live:true  },
  { id:"navigate",  emoji:"🧭", title:"Find Direction — No Phone",desc:"Use the sun, stars, and plants as a compass",                  href:"/navigate",      cat:"Survive",  live:true  },
  { id:"repellent", emoji:"🦟", title:"No Mosquito Spray?",    desc:"Plants that keep mosquitoes, leeches, and ants away",              href:"/repellent",     cat:"Survive",  live:true  },
  { id:"waterpure", emoji:"🚿", title:"Drink Wild Water Safely",desc:"How to clean and purify water using natural methods",              href:"/waterpure",     cat:"Survive",  live:true  },
  { id:"medicine",  emoji:"🧪", title:"Jungle Medicine",       desc:"Emergency plant treatments + hotlines if you're hurt outdoors",    href:"/medicine",      cat:"Survive",  live:true  },
  { id:"ibanplants",emoji:"🏹", title:"Indigenous Plant Wisdom",desc:"Traditional knowledge — plants that local communities use",        href:"/iban-plants",   cat:"Survive",  live:false },
  { id:"mangrove",  emoji:"🌿", title:"Mangrove Guide",        desc:"Coastal ecosystems — plants, wildlife, and how to restore them",   href:"/mangrove",      cat:"Survive",  live:false },
  { id:"forestwalk",emoji:"🥾", title:"Plan a Forest Walk",    desc:"Safe hiking — gear, risks, trails, what to watch out for",         href:"/forestwalk",    cat:"Survive",  live:false },

  // ── MY SPACE ──────────────────────────────────────────────────────
  { id:"journal",   emoji:"📓", title:"My Discoveries",        desc:"Everything you've ever scanned — your personal nature journal",     href:"/journal",       cat:"My Space", live:true  },
  { id:"profile",   emoji:"👤", title:"My Profile",            desc:"Your stats, badges, and settings — language and location",          href:"/profile",       cat:"My Space", live:true  },
  { id:"bioscan",   emoji:"📡", title:"Community Sightings",   desc:"See what other people are finding near you on the map",             href:"/map",           cat:"My Space", live:true  },
  { id:"share",     emoji:"📤", title:"Share What You Found",  desc:"Send your scan to friends via WhatsApp, Telegram, or link",        href:"/scan-results",  cat:"My Space", live:true  },
  { id:"about",     emoji:"🌍", title:"About FloraIQ",         desc:"Our story, mission, and how it all works",                          href:"/about",         cat:"My Space", live:true  },
  { id:"challenge", emoji:"🏆", title:"Weekly Challenges",     desc:"Earn badges by scanning rare species and completing tasks",         href:"/challenges",    cat:"My Space", live:false },
  { id:"expertchat",emoji:"💬", title:"Ask an Expert",         desc:"Chat with botanists, farmers, and ecologists — live Q&A",          href:"/expertchat",    cat:"My Space", live:false },
  { id:"fieldguide",emoji:"📖", title:"My Field Guide",        desc:"Build a personal guide from your own scans and notes",              href:"/fieldguide",    cat:"My Space", live:false },
  { id:"alerts",    emoji:"🔔", title:"Species Alerts",        desc:"Get notified when rare species are spotted near you",               href:"/alerts",        cat:"My Space", live:false },
];

const CATS = ["All","Identify","Grow","Farm","Explore","Survive","My Space"];
const CAT_EMOJI: Record<string, string> = { All:"✨", Identify:"🔍", Grow:"🌱", Farm:"🌾", Explore:"🌍", Survive:"🏕️", "My Space":"👤" };

export default function ToolsHub() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = TOOLS.filter(t =>
    (cat === "All" || t.cat === cat) &&
    (!search || t.title.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const liveCount = TOOLS.filter(t => t.live).length;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-14">
          <Link href="/"><button type="button" aria-label="Home" className="text-muted-foreground hover:text-white">🏠</button></Link>
          <Zap className="w-5 h-5 text-emerald-400" />
          <div className="flex-1">
            <h1 className="text-base font-bold leading-none">All Tools</h1>
            <p className="text-[11px] text-muted-foreground">{liveCount} working now · {TOOLS.length - liveCount} coming soon</p>
          </div>
        </div>

        {/* Search */}
        <div className="container pb-2">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search all tools…"
              className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          {/* 6 categories only */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {CATS.map(c => (
              <button type="button" key={c} onClick={() => setCat(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${cat === c ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>
                {CAT_EMOJI[c]} {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-4 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { val:TOOLS.length, label:"Total tools", color:"text-emerald-400", border:"border-emerald-500/20" },
            { val:liveCount, label:"Working now", color:"text-blue-400", border:"border-blue-500/20" },
            { val:TOOLS.length - liveCount, label:"Coming soon", color:"text-amber-400", border:"border-amber-500/20" },
          ].map(s => (
            <div key={s.label} className={`glass rounded-2xl p-3 border ${s.border} text-center`}>
              <p className={`text-xl font-bold ${s.color}`}>{s.val}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
          {filtered.map(tool => (
            tool.live ? (
              <Link key={tool.id} href={tool.href}>
                <div className="glass rounded-2xl p-3.5 border border-emerald-500/15 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer group h-full active:scale-95">
                  <div className="text-2xl mb-2">{tool.emoji}</div>
                  <p className="font-bold text-sm leading-tight mb-1 group-hover:text-emerald-400 transition-colors">{tool.title}</p>
                  <p className="text-[11px] text-muted-foreground leading-snug">{tool.desc}</p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">LIVE</span>
                </div>
              </Link>
            ) : (
              <div key={tool.id} className="glass rounded-2xl p-3.5 border border-border/20 opacity-50 cursor-not-allowed h-full">
                <div className="text-2xl mb-2 grayscale">{tool.emoji}</div>
                <p className="font-bold text-sm leading-tight mb-1">{tool.title}</p>
                <p className="text-[11px] text-muted-foreground leading-snug">{tool.desc}</p>
                <span className="inline-block mt-2 text-[10px] font-bold text-muted-foreground bg-border/20 px-2 py-0.5 rounded-full">SOON</span>
              </div>
            )
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-muted-foreground">No tools match "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
