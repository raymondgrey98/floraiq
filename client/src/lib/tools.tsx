// ─────────────────────────────────────────────────────────────────────────────
// Central tool registry — the single source of truth for every destination in
// FloraIQ. Consumed by ToolsHub (the grid) and CommandPalette (⌘K spotlight).
// ─────────────────────────────────────────────────────────────────────────────
import {
  Zap, ScanLine, Microscope, Skull, Bug, Leaf, Flower2, Ruler,
  AudioLines, Sprout, Droplets, CalendarDays, FlaskConical, Worm, Scissors,
  TreeDeciduous, Wheat, ClipboardList, Wallet, Waves, RefreshCw, ShoppingCart,
  MapPin, Map as MapIcon, Plane, CloudSun, Moon, Sun, CloudRain, Globe2,
  BookOpen, Bird, Squirrel, Fish, PawPrint, Mountain, UtensilsCrossed,
  HeartPulse, Tent, Compass, Droplet, Pill, ShieldAlert, Notebook, User,
  Share2, Info, Trophy, MessageCircle, Bell, BarChart3, Hexagon, Grape,
  TestTubes, Hammer, LandPlot, type LucideIcon,
} from "lucide-react";

// Professional icon system — category default + per-tool overrides (no emoji).
export const CAT_ICONS: Record<string, LucideIcon> = {
  All: Zap, Identify: ScanLine, Grow: Sprout, Farm: Wheat,
  Explore: Globe2, Survive: Tent, "My Space": User,
};

export const TOOL_ICONS: Record<string, LucideIcon> = {
  scan: ScanLine, disease: Microscope, toxic: Skull, mushroom: Hexagon,
  pest: Bug, leaf: Leaf, flower: Flower2, anatomy: Ruler, inat: Microscope,
  bark: TreeDeciduous, fruit: Grape, audio: AudioLines, pitcher: FlaskConical,
  water: Droplets, care: Sprout, companion: Leaf, calendar: CalendarDays,
  fertilizer: FlaskConical, soil: TestTubes, propagation: Sprout,
  pruning: Scissors, repot: Sprout, growth: BarChart3, bonsai: TreeDeciduous,
  seeds: Wheat, vertical: LandPlot, compost: RefreshCw, vermi: Worm,
  orchid: Flower2, hydro: Droplet, grafting: Scissors,
  farm: Wheat, farmtasks: ClipboardList, finance: Wallet, irrigation: Waves,
  rotation: RefreshCw, harvest: Wheat, market: ShoppingCart, organic: Bug,
  aqua: Fish, beekeeping: Hexagon, wildbees: Hexagon, agristore: MapPin,
  marketplace: ShoppingCart, landmap: MapIcon, droneview: Plane,
  agroforest: TreeDeciduous, drip: Droplet, bamboo: TreeDeciduous,
  insurance: ClipboardList, weather: CloudSun, moon: Moon, uv: Sun,
  rain: CloudRain, flood: Waves,
  forage: MapIcon, map: Globe2, library: BookOpen, bird: Bird,
  butterfly: Flower2, reptile: Squirrel, spider: Bug, marine: Fish,
  tracks: PawPrint, nocturnal: Moon, foragecal: CalendarDays,
  edible: UtensilsCrossed, advmushroom: Hexagon, dragonfly: Bug,
  hornbill: Bird, endemic: Globe2, coastal: Waves, palms: TreeDeciduous,
  herbs: Leaf, medicinal: Pill, nutrition: HeartPulse, tea: Leaf,
  honey: Hexagon, fruits: Grape, cooking: UtensilsCrossed, dyes: FlaskConical,
  survival: Tent, landscape: Mountain, firstaid: HeartPulse, shelter: Hammer,
  survivalplants: Leaf, navigate: Compass, repellent: ShieldAlert,
  waterpure: Droplet, medicine: Pill, indigenous: BookOpen, mangrove: Waves,
  forestwalk: Compass,
  journal: Notebook, stats: BarChart3, profile: User, bioscan: Globe2,
  share: Share2, about: Info, challenge: Trophy, expertchat: MessageCircle,
  fieldguide: BookOpen, alerts: Bell,
};

export interface Tool { id: string; emoji: string; title: string; desc: string; href: string; cat: string; live: boolean; }

/** Resolve the best icon component for a tool. */
export function iconForTool(tool: Tool): LucideIcon {
  return TOOL_ICONS[tool.id] ?? CAT_ICONS[tool.cat] ?? Leaf;
}

export function ToolIcon({ tool, dim }: { tool: Tool; dim?: boolean }) {
  const Icon = iconForTool(tool);
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${
      dim ? "bg-white/5" : "bg-emerald-500/10 group-hover:bg-emerald-500/20"
    } transition-colors`}>
      <Icon className={`w-[18px] h-[18px] ${dim ? "text-white/30" : "text-emerald-400"}`} strokeWidth={2} />
    </div>
  );
}

export const CATS = ["All", "Identify", "Grow", "Farm", "Explore", "Survive", "My Space"];

export const TOOLS: Tool[] = [
  // ── IDENTIFY ──────────────────────────────────────────────────────
  { id:"scan",       emoji:"📷", title:"Scan Anything",           desc:"Photo → instant name + info for any plant, bug, bird, or fungus",   href:"/scan",              cat:"Identify", live:true },
  { id:"disease",    emoji:"🔬", title:"Is My Plant Sick?",       desc:"Take a leaf photo — AI spots the disease and tells you the fix",     href:"/disease",           cat:"Identify", live:true },
  { id:"toxic",      emoji:"☠️", title:"Dangerous or Safe?",      desc:"Check if a plant is poisonous — what to do if touched or eaten",     href:"/toxic",             cat:"Identify", live:true },
  { id:"mushroom",   emoji:"🍄", title:"Safe to Eat? Mushroom",   desc:"Edible vs deadly fungi — field guide with photos",                   href:"/mushroom",          cat:"Identify", live:true },
  { id:"pest",       emoji:"🐛", title:"What Bug Is This?",       desc:"ID crop pests — organic and chemical ways to stop them",             href:"/pest",              cat:"Identify", live:true },
  { id:"leaf",       emoji:"🍃", title:"ID by Leaf Shape",        desc:"Identify plants from the shape, edge, and veins of the leaf",        href:"/leaf",              cat:"Identify", live:true },
  { id:"flower",     emoji:"🌸", title:"ID by Flower",            desc:"Name a plant from its flower colour, shape, and petal count",        href:"/flower",            cat:"Identify", live:true },
  { id:"anatomy",    emoji:"📐", title:"Label Plant Parts",       desc:"Tap any part of a plant photo — learn what it is and what it does",  href:"/anatomy",           cat:"Identify", live:true },
  { id:"inat",       emoji:"🌍", title:"Double-Check with AI",    desc:"Second AI opinion using iNaturalist computer vision",                href:"/scan",              cat:"Identify", live:true },
  { id:"bark",       emoji:"🌲", title:"ID by Tree Bark",         desc:"Recognise trees from bark texture and pattern",                      href:"/guide/bark",        cat:"Identify", live:true },
  { id:"fruit",      emoji:"🍈", title:"ID by Fruit or Seed",     desc:"Name a plant from the fruit, seed pod, or nut",                     href:"/guide/fruit",       cat:"Identify", live:true },
  { id:"audio",      emoji:"🎙️", title:"What's That Sound?",      desc:"Record a bird or insect call — AI names the species",               href:"/soundid",           cat:"Identify", live:true },
  { id:"pitcher",    emoji:"🪣", title:"Pitcher Plants",          desc:"Carnivorous plants — ID, growing guide, conservation",               href:"/guide/pitcher",     cat:"Identify", live:true },

  // ── GROW ──────────────────────────────────────────────────────────
  { id:"water",      emoji:"💧", title:"Watering Reminder",       desc:"Set schedules so you never forget to water your plants",             href:"/water",             cat:"Grow",     live:true },
  { id:"care",       emoji:"🌱", title:"How Do I Grow This?",     desc:"AI gives you a personal care plan for any plant",                    href:"/farm",              cat:"Grow",     live:true },
  { id:"companion",  emoji:"🤝", title:"Best Plant Neighbours",   desc:"Which plants help each other grow — natural pest protection",        href:"/companion",         cat:"Grow",     live:true },
  { id:"calendar",   emoji:"📅", title:"When to Plant?",          desc:"Monthly planting guide — know exactly what to sow each month",       href:"/calendar",          cat:"Grow",     live:true },
  { id:"fertilizer", emoji:"⚗️", title:"What Fertilizer?",        desc:"Calculate the right dose and type of fertilizer for your soil",      href:"/fertilizer",        cat:"Grow",     live:true },
  { id:"soil",       emoji:"🪱", title:"Soil Check",              desc:"Match any plant to the right soil type and acidity (pH)",            href:"/soil",              cat:"Grow",     live:true },
  { id:"propagation",emoji:"🌿", title:"Grow More for Free",      desc:"Copy any plant from cuttings, seeds, layering, or grafting",        href:"/propagation",       cat:"Grow",     live:true },
  { id:"pruning",    emoji:"✂️", title:"When to Cut?",            desc:"Pruning guide — when, how much, and which branches to remove",       href:"/pruning",           cat:"Grow",     live:true },
  { id:"repot",      emoji:"🪴", title:"Time to Repot?",          desc:"Signs your plant needs a bigger pot + soil mix recipes",             href:"/repot",             cat:"Grow",     live:true },
  { id:"growth",     emoji:"📈", title:"Track Plant Growth",      desc:"Log your plant's height, health, and changes over time",             href:"/growth",            cat:"Grow",     live:true },
  { id:"bonsai",     emoji:"🌳", title:"Bonsai — Tiny Trees",     desc:"Shape and grow miniature tropical trees",                           href:"/bonsai",            cat:"Grow",     live:true },
  { id:"seeds",      emoji:"🌾", title:"Save Your Seeds",         desc:"How to collect, dry, and store seeds for next season",               href:"/seeds",             cat:"Grow",     live:true },
  { id:"vertical",   emoji:"🏗️", title:"Small Space Garden",      desc:"Grow food on a wall, balcony, or fence using vertical systems",      href:"/vertical",          cat:"Grow",     live:true },
  { id:"compost",    emoji:"♻️", title:"Make Free Fertilizer",    desc:"Turn kitchen scraps into rich compost — step by step",              href:"/compost",           cat:"Grow",     live:true },
  { id:"vermi",      emoji:"🪱", title:"Worm Composting",         desc:"Use worms to make the richest fertilizer possible",                  href:"/vermi",             cat:"Grow",     live:true },
  { id:"orchid",     emoji:"🌺", title:"Grow Orchids",            desc:"Care guide for tropical orchids — light, water, repotting",          href:"/guide/orchid",      cat:"Grow",     live:true },
  { id:"hydro",      emoji:"💧", title:"Grow Without Soil",       desc:"Hydroponics for beginners — NFT, DWC, and simple systems",          href:"/guide/hydro",       cat:"Grow",     live:true },
  { id:"grafting",   emoji:"🔪", title:"Fruit Tree Grafting",     desc:"Join two plants together to grow better fruit — photo guide",        href:"/guide/grafting",    cat:"Grow",     live:true },

  // ── FARM ──────────────────────────────────────────────────────────
  { id:"farm",       emoji:"🌾", title:"Full Farm Planner",       desc:"Plan crops, manage pests, track costs — all in one place",           href:"/farm",              cat:"Farm",     live:true },
  { id:"farmtasks",  emoji:"📋", title:"Farm Task Manager",       desc:"Organise and schedule daily farm tasks and maintenance",             href:"/farmtasks",         cat:"Farm",     live:true },
  { id:"finance",    emoji:"💰", title:"Farm Money Tracker",      desc:"Track what you earn and spend on your farm",                         href:"/finance",           cat:"Farm",     live:true },
  { id:"irrigation", emoji:"💦", title:"How Much Water?",         desc:"Calculate water needs for any crop, field size, or season",          href:"/irrigation",        cat:"Farm",     live:true },
  { id:"rotation",   emoji:"🔄", title:"What to Plant Next?",     desc:"Rotate your crops to keep soil healthy and avoid pests",             href:"/rotation",          cat:"Farm",     live:true },
  { id:"harvest",    emoji:"🌽", title:"When Can I Harvest?",     desc:"Predict harvest date from planting date and crop type",              href:"/harvest",           cat:"Farm",     live:true },
  { id:"market",     emoji:"🏪", title:"Market Prices",           desc:"Current vegetable and fruit prices at local markets",                href:"/market",            cat:"Farm",     live:true },
  { id:"organic",    emoji:"🌱", title:"Natural Pest Control",    desc:"Make your own sprays — neem oil, chili, soap — no chemicals",        href:"/organic",           cat:"Farm",     live:true },
  { id:"aqua",       emoji:"🐟", title:"Fish + Plants Together",  desc:"Aquaponics — grow fish and vegetables in one system",               href:"/aquaponics",        cat:"Farm",     live:true },
  { id:"beekeeping", emoji:"🐝", title:"Beekeeping Guide",        desc:"Start a beehive — kelulut stingless bees or honeybees",              href:"/beekeeping",        cat:"Farm",     live:true },
  { id:"wildbees",   emoji:"🍯", title:"Wild Bees Around You",    desc:"ID wild bee species — which make honey, which to leave alone",       href:"/wildbees",          cat:"Farm",     live:true },
  { id:"agristore",  emoji:"📍", title:"Find Supplies Near Me",   desc:"GPS map finds nearest garden shop, farm supply, or nursery",         href:"/agristore",         cat:"Farm",     live:true },
  { id:"marketplace",emoji:"🛒", title:"Global Supply Shop",      desc:"Buy seeds, fertilizers, tools from suppliers worldwide",             href:"/marketplace",       cat:"Farm",     live:true },
  { id:"landmap",    emoji:"🗺️", title:"Land Mapper",             desc:"Map your land, mark zones, plan your farm layout with GPS",          href:"/landmap",           cat:"Farm",     live:true },
  { id:"droneview",  emoji:"🚁", title:"Drone Farm View",         desc:"Use drone imagery to monitor crops and spot problems",               href:"/droneview",         cat:"Farm",     live:true },
  { id:"agroforest", emoji:"🌲", title:"Farm + Forest Together",  desc:"Grow trees, crops, and animals on the same land",                   href:"/guide/agroforest",  cat:"Farm",     live:true },
  { id:"drip",       emoji:"💦", title:"Drip Irrigation Plan",    desc:"Design an efficient drip watering system for your farm",             href:"/guide/drip",        cat:"Farm",     live:true },
  { id:"bamboo",     emoji:"🎋", title:"Bamboo Guide",            desc:"Grow and use bamboo — building, food, craft, and income",            href:"/guide/bamboo",      cat:"Farm",     live:true },
  { id:"insurance",  emoji:"📋", title:"Crop Insurance Help",     desc:"Protect your harvest — government schemes explained simply",         href:"/guide/insurance",   cat:"Farm",     live:true },

  // ── WEATHER & ENVIRONMENT ─────────────────────────────────────────
  { id:"weather",    emoji:"🌦️", title:"Live Weather",            desc:"Today's weather + 7-day forecast for planting decisions",            href:"/farm",              cat:"Farm",     live:true },
  { id:"moon",       emoji:"🌙", title:"Moon Planting Guide",     desc:"Best days to plant, prune, and harvest using the moon cycle",        href:"/moon",              cat:"Farm",     live:true },
  { id:"uv",         emoji:"☀️", title:"Sun & UV Tracker",        desc:"UV levels by month — which plants need shade vs full sun",           href:"/uv",                cat:"Farm",     live:true },
  { id:"rain",       emoji:"🌧️", title:"Rainfall Planner",        desc:"Historical rainfall by region — when do you need to irrigate?",      href:"/rainfall",          cat:"Farm",     live:true },
  { id:"flood",      emoji:"🌊", title:"Flood Risk Check",        desc:"Is your farm at risk of flooding? Map-based risk guide",             href:"/guide/flood",       cat:"Farm",     live:true },

  // ── EXPLORE ───────────────────────────────────────────────────────
  { id:"forage",     emoji:"🗺️", title:"Wild Plants Near Me",     desc:"Live map of edible and medicinal plants around your location",       href:"/forage",            cat:"Explore",  live:true },
  { id:"map",        emoji:"🌐", title:"Species World Map",       desc:"See where any species has been spotted — 1 billion records",         href:"/map",               cat:"Explore",  live:true },
  { id:"library",    emoji:"📚", title:"Species Encyclopedia",    desc:"Browse 400,000+ species — animals, plants, insects, birds",          href:"/history",           cat:"Explore",  live:true },
  { id:"bird",       emoji:"🐦", title:"Bird Guide",              desc:"ID any bird — listen to its call, see its habitat and range",        href:"/birds",             cat:"Explore",  live:true },
  { id:"butterfly",  emoji:"🦋", title:"Butterfly Guide",         desc:"Which plants attract butterflies? Host plants and nectar sources",    href:"/butterfly",         cat:"Explore",  live:true },
  { id:"reptile",    emoji:"🦎", title:"Reptiles — Safe?",        desc:"Snakes, lizards, frogs — which are dangerous, what to do if bitten", href:"/reptiles",          cat:"Explore",  live:true },
  { id:"spider",     emoji:"🕷️", title:"Spider — Safe?",          desc:"Venomous vs harmless spiders — what to do if bitten",               href:"/spiders",           cat:"Explore",  live:true },
  { id:"marine",     emoji:"🐠", title:"Fish & River Life",       desc:"Edible fish, dangerous creatures — know before you swim or fish",    href:"/marine",            cat:"Explore",  live:true },
  { id:"tracks",     emoji:"🐾", title:"Animal Footprints",       desc:"Find a footprint? Identify the animal that made it",                 href:"/tracks",            cat:"Explore",  live:true },
  { id:"nocturnal",  emoji:"🦉", title:"Night Animals",           desc:"What's making that noise at night? Nocturnal wildlife guide",        href:"/nocturnal",         cat:"Explore",  live:true },
  { id:"forgcal",    emoji:"📆", title:"Foraging Calendar",       desc:"What wild plants are ready to eat this month in your region?",       href:"/foragecal",         cat:"Explore",  live:true },
  { id:"edible",     emoji:"🫚", title:"Safe to Eat? Wild",       desc:"Which wild plants are edible — safe ID guide for the outdoors",      href:"/edible",            cat:"Explore",  live:true },
  { id:"mushguide",  emoji:"🍄", title:"Advanced Mushroom ID",    desc:"Rare edible mushrooms — expert field guide with spore charts",       href:"/guide/mushadv",     cat:"Explore",  live:true },
  { id:"dragonfly",  emoji:"🪲", title:"Dragonfly Guide",         desc:"Dragonflies and damselflies — ID and water quality indicators",      href:"/guide/dragonfly",   cat:"Explore",  live:true },
  { id:"hornbill",   emoji:"🦜", title:"Hornbill Spotter",        desc:"ID the 8 hornbill species — range, habits, best places to see",     href:"/guide/hornbill",    cat:"Explore",  live:true },
  { id:"endemic",    emoji:"🌏", title:"Rare Endemic Species",    desc:"Species found nowhere else on Earth — conservation guide",           href:"/guide/endemic",     cat:"Explore",  live:true },
  { id:"coastal",    emoji:"🏖️", title:"Coastal Plants",          desc:"Plants that grow at the beach and in mangroves",                    href:"/guide/coastal",     cat:"Explore",  live:true },
  { id:"rattans",    emoji:"🌴", title:"Palms & Rattans",         desc:"Wild palms and rattans — ID, uses, how to harvest",                 href:"/guide/rattans",     cat:"Explore",  live:true },

  // ── FOOD & MEDICINE ───────────────────────────────────────────────
  { id:"herb",       emoji:"🌿", title:"Herb & Spice Guide",      desc:"60+ herbs — how to grow, what to cook, what to substitute",         href:"/herbs",             cat:"Explore",  live:true },
  { id:"medicinal",  emoji:"💊", title:"Plant Medicine Guide",    desc:"Traditional healing plants — what they treat and how to use them",  href:"/medicinal",         cat:"Explore",  live:true },
  { id:"nutrition",  emoji:"🥗", title:"Plant Nutrition Data",    desc:"How healthy is this plant? Vitamins, protein, minerals explained",  href:"/nutrition",         cat:"Explore",  live:true },
  { id:"tea",        emoji:"🍵", title:"Make Wild Tea",           desc:"Wild plants you can brew into healthy teas",                        href:"/tea",               cat:"Explore",  live:true },
  { id:"honey",      emoji:"🍯", title:"Best Plants for Bees",    desc:"Which plants produce the most nectar and the best honey?",          href:"/honey",             cat:"Explore",  live:true },
  { id:"fruitguide", emoji:"🥭", title:"Tropical Fruits",         desc:"40+ fruits — season, nutrition, how to grow, how to eat",           href:"/fruits",            cat:"Explore",  live:true },
  { id:"cooking",    emoji:"🍳", title:"Cook Wild Plants",        desc:"Recipes, YouTube videos, allergy warnings for edible plants",       href:"/cooking",           cat:"Explore",  live:true },
  { id:"naturaldyes",emoji:"🎨", title:"Natural Dye Plants",      desc:"Make fabric dye from plants — colours, techniques",                 href:"/guide/naturaldyes", cat:"Explore",  live:true },

  // ── SURVIVE ───────────────────────────────────────────────────────
  { id:"survival",       emoji:"🏕️", title:"Survival Guide",           desc:"Lost? Injured? Find food, water, shelter using plants around you",  href:"/survival",          cat:"Survive",  live:true },
  { id:"landscape",      emoji:"🛰️", title:"See Land From Satellite",   desc:"Read any terrain from above — water, shelter, paths",             href:"/landscape",         cat:"Survive",  live:true },
  { id:"firstaid",       emoji:"🩹", title:"Plant First Aid",           desc:"Which plants heal cuts, stings, fever, and bites",                  href:"/firstaid",          cat:"Survive",  live:true },
  { id:"shelter",        emoji:"🏕️", title:"Build a Shelter",           desc:"Step-by-step jungle shelter from leaves and branches",             href:"/shelter",           cat:"Survive",  live:true },
  { id:"survivalplants", emoji:"🌿", title:"Wild Survival Plants",      desc:"Water, food, rope, fire, medicine — all from nature",              href:"/survivalplants",    cat:"Survive",  live:true },
  { id:"navigate",       emoji:"🧭", title:"Find Direction — No Phone", desc:"Use the sun, stars, and plants as a compass",                      href:"/navigate",          cat:"Survive",  live:true },
  { id:"repellent",      emoji:"🦟", title:"No Mosquito Spray?",        desc:"Plants that keep mosquitoes, leeches, and ants away",              href:"/repellent",         cat:"Survive",  live:true },
  { id:"waterpure",      emoji:"🚿", title:"Drink Wild Water Safely",   desc:"How to clean and purify water using natural methods",              href:"/waterpure",         cat:"Survive",  live:true },
  { id:"medicine",       emoji:"🧪", title:"Jungle Medicine",           desc:"Emergency plant treatments + what to do if you're hurt outdoors",  href:"/medicine",          cat:"Survive",  live:true },
  { id:"ibanplants",     emoji:"🏹", title:"Indigenous Plant Wisdom",   desc:"Traditional knowledge — plants that local communities use",        href:"/guide/iban-plants", cat:"Survive",  live:true },
  { id:"mangrove",       emoji:"🌿", title:"Mangrove Guide",            desc:"Coastal ecosystems — plants, wildlife, and how to restore them",   href:"/guide/mangrove",    cat:"Survive",  live:true },
  { id:"forestwalk",     emoji:"🥾", title:"Plan a Forest Walk",        desc:"Safe hiking — gear, risks, trails, what to watch out for",         href:"/guide/forestwalk",  cat:"Survive",  live:true },

  // ── MY SPACE ──────────────────────────────────────────────────────
  { id:"journal",    emoji:"📓", title:"My Discoveries",          desc:"Everything you've ever scanned — your personal nature journal",     href:"/journal",           cat:"My Space", live:true },
  { id:"stats",      emoji:"📊", title:"My Scan Stats",           desc:"Scan streak, most-found species, activity chart — your numbers",    href:"/stats",             cat:"My Space", live:true },
  { id:"profile",    emoji:"👤", title:"My Profile",              desc:"Your stats, badges, and settings — language and location",          href:"/profile",           cat:"My Space", live:true },
  { id:"bioscan",    emoji:"📡", title:"Community Sightings",     desc:"See what other people are finding near you on the map",             href:"/map",               cat:"My Space", live:true },
  { id:"share",      emoji:"📤", title:"Share What You Found",    desc:"Send your scan to friends via WhatsApp, Telegram, or link",        href:"/scan-results",      cat:"My Space", live:true },
  { id:"about",      emoji:"🌍", title:"About FloraIQ",           desc:"Our story, mission, and how it all works",                          href:"/about",             cat:"My Space", live:true },
  { id:"challenge",  emoji:"🏆", title:"Weekly Challenges",       desc:"Earn badges by scanning rare species and completing tasks",         href:"/guide/challenges",  cat:"My Space", live:true },
  { id:"expertchat", emoji:"💬", title:"Ask an Expert",           desc:"Chat with botanists, farmers, and ecologists — AI-powered Q&A",    href:"/guide/expertchat",  cat:"My Space", live:true },
  { id:"fieldguide", emoji:"📖", title:"My Field Guide",          desc:"Build a personal guide from your own scans and notes",              href:"/guide/fieldguide",  cat:"My Space", live:true },
  { id:"alerts",     emoji:"🔔", title:"Species Alerts",          desc:"Get notified when rare species are spotted near you",               href:"/guide/alerts",      cat:"My Space", live:true },
];
