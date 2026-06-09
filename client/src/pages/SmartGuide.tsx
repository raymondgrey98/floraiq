import { useState, useEffect, useRef } from "react";
import { Link, useRoute } from "wouter";
import { ChevronLeft, Loader2, Send, BookOpen, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// Topic config — every guide topic gets a tailored header + quick questions
const TOPICS: Record<string, {
  emoji: string; title: string; desc: string;
  color: string; questions: string[]; wiki?: string;
}> = {
  bark:        { emoji:"🌲", title:"Tree Bark ID",          color:"#92400e", desc:"Identify trees from bark texture, colour, and pattern", questions:["How do I identify a tree by its bark?","What trees have smooth bark?","What causes rough or furrowed bark?","Medicinal uses of tree bark?"] },
  orchid:      { emoji:"🌺", title:"Orchid Care",           color:"#9333ea", desc:"Grow and care for tropical orchids — light, water, repotting", questions:["How often should I water my orchid?","Why are orchid leaves turning yellow?","How to get an orchid to rebloom?","Best fertilizer for orchids?"] },
  hydro:       { emoji:"💧", title:"Hydroponics",           color:"#0891b2", desc:"Grow plants without soil — NFT, DWC, and beginner systems", questions:["What's the easiest hydroponic system for beginners?","Best plants to grow hydroponically?","What nutrients does hydroponic lettuce need?","How to prevent root rot in DWC?"] },
  grafting:    { emoji:"🔪", title:"Tree Grafting",         color:"#65a30d", desc:"Join two plants to grow better fruit — whip, cleft, and bud grafting", questions:["What is the best time to graft fruit trees?","How do I graft mango trees?","What rootstock should I use for durian?","Why does grafting fail?"] },
  agroforest:  { emoji:"🌲", title:"Agroforestry",         color:"#166534", desc:"Grow trees, crops, and animals on the same land profitably", questions:["What is agroforestry and how does it work?","Best tree species for agroforestry?","How does agroforestry improve soil?","Can I do agroforestry on 1 acre?"] },
  drip:        { emoji:"💦", title:"Drip Irrigation",      color:"#1d4ed8", desc:"Design efficient drip watering for any farm size", questions:["How do I set up drip irrigation cheaply?","What pressure do drip systems need?","How many drippers per plant?","Solar-powered drip irrigation?"] },
  bamboo:      { emoji:"🎋", title:"Bamboo Guide",          color:"#15803d", desc:"Grow and use bamboo — food, building, craft, and income", questions:["How fast does bamboo grow?","Which bamboo is edible?","How do I stop bamboo from spreading?","Uses of bamboo in construction?"] },
  insurance:   { emoji:"📋", title:"Crop Insurance",       color:"#7c3aed", desc:"Protect your harvest — government schemes and how to claim", questions:["How does crop insurance work?","What disasters does crop insurance cover?","How do I file a crop insurance claim?","Free crop insurance for small farmers?"] },
  flood:       { emoji:"🌊", title:"Flood Risk for Farms", color:"#1e40af", desc:"Assess flood risk and protect your crops and livestock", questions:["How do I know if my farm is at flood risk?","Best flood-resistant crops?","How to protect crops from flooding?","Drainage systems for waterlogged fields?"] },
  mushadv:     { emoji:"🍄", title:"Advanced Mushroom ID", color:"#92400e", desc:"Rare edible mushrooms — spore prints, gill patterns, expert field guide", questions:["How do I use a spore print to ID a mushroom?","What's the difference between Amanita species?","Edible look-alikes for chanterelles?","What is the deadly Galerina marginata?"] },
  dragonfly:   { emoji:"🪲", title:"Dragonfly & Damselfly",color:"#0e7490", desc:"Identify dragonflies — they indicate clean water quality nearby", questions:["How do I tell a dragonfly from a damselfly?","What do dragonflies eat?","Dragonflies as water quality indicators?","Do dragonflies bite?"] },
  hornbill:    { emoji:"🦜", title:"Hornbill Spotter",     color:"#b45309", desc:"ID the 8 hornbill species — range, habits, best spots to find them", questions:["How many hornbill species are in Borneo?","What do hornbills eat?","Why are hornbills endangered?","Best time to spot a rhinoceros hornbill?"] },
  endemic:     { emoji:"🌏", title:"Rare Endemic Species", color:"#be185d", desc:"Species found nowhere else — why they matter and how to protect them", questions:["What makes a species endemic?","Most endangered endemic plants?","How can I help protect endemic species?","Examples of endemic species in Borneo?"] },
  coastal:     { emoji:"🏖️", title:"Coastal Plants",       color:"#0369a1", desc:"Plants that grow at beaches, estuaries, and mangrove edges", questions:["What plants grow in salty coastal soil?","How do mangrove plants survive saltwater?","Edible coastal plants?","How to plant a coastal garden?"] },
  rattans:     { emoji:"🌴", title:"Palms & Rattans",      color:"#166534", desc:"Wild palms and rattans — identification, uses, and sustainable harvest", questions:["How do I identify wild rattan?","Is rattan harvest sustainable?","What palm species produce edible fruit?","How is rattan furniture made?"] },
  naturaldyes: { emoji:"🎨", title:"Natural Plant Dyes",   color:"#7c2d12", desc:"Extract colour from plants to dye fabric, thread, and craft materials", questions:["Which plants make the best natural dyes?","How do I mordant fabric for natural dyeing?","How to make turmeric fabric dye?","Natural dyes that won't fade?"] },
  "iban-plants":{ emoji:"🏹",title:"Indigenous Plant Wisdom",color:"#92400e",desc:"Traditional plant knowledge from indigenous communities of Borneo and beyond", questions:["What plants do indigenous people use for medicine?","Traditional plants used in Iban culture?","How to make traditional jungle medicine?","Plants used in traditional rituals?"] },
  mangrove:    { emoji:"🌿", title:"Mangrove Ecosystem",   color:"#065f46", desc:"Mangrove plants, wildlife, and how to restore degraded coastal areas", questions:["Why are mangroves important?","What animals live in mangroves?","How to grow mangrove trees?","Edible plants from mangrove areas?"] },
  forestwalk:  { emoji:"🥾", title:"Safe Forest Hiking",   color:"#166534", desc:"Plan a safe jungle trek — gear, risks, trails, wildlife awareness", questions:["What gear do I need for jungle hiking?","How do I avoid getting lost in a forest?","What to do if I encounter a wild animal?","Best jungle hiking safety tips?"] },
  challenges:  { emoji:"🏆", title:"Weekly Challenges",    color:"#ca8a04", desc:"Nature identification challenges — earn badges by scanning rare species", questions:["How do I join weekly challenges?","What badges can I earn?","How are species rarity scores calculated?","Best rare species to find?"] },
  expertchat:  { emoji:"💬", title:"Expert Plant Q&A",     color:"#0891b2", desc:"Get answers about botany, farming, and ecology from AI-trained on expert knowledge", questions:["How do I become a botanist?","What are the 5 most important plant families?","Difference between monocot and dicot?","Best books on tropical plants?"] },
  fieldguide:  { emoji:"📖", title:"My Field Guide",       color:"#16a34a", desc:"Build a personal species guide from your own FloraIQ scans and notes", questions:["How do I create a personal field guide?","What should I record when identifying a plant?","How do naturalists keep field notes?","Best apps for field notes?"] },
  alerts:      { emoji:"🔔", title:"Species Alerts",       color:"#dc2626", desc:"Get notified when rare or invasive species are spotted near you", questions:["What are invasive species in my area?","How do I report a rare species sighting?","Invasive plants to watch out for?","How to alert others about dangerous species?"] },
  pitcher:     { emoji:"🪣", title:"Pitcher Plants",       color:"#be185d", desc:"Carnivorous pitcher plants — identification, growing, and conservation status", questions:["How do pitcher plants catch insects?","What species of Nepenthes are found in Borneo?","How to grow a pitcher plant at home?","Are pitcher plants endangered?"] },
  fruit:       { emoji:"🍈", title:"ID by Fruit or Seed",  color:"#ca8a04", desc:"Identify plants by examining the shape, colour, and texture of their fruit or seeds", questions:["How do I identify a plant by its fruit?","What are the most distinctive seed shapes?","Edible wild fruits and how to ID them?","How to tell if a wild fruit is safe to eat?"] },
  "farm-tasks":{ emoji:"📋", title:"Farm Task Manager",    color:"#15803d", desc:"Organise and schedule daily farm tasks, harvests, and maintenance", questions:["How do I plan a weekly farm schedule?","Best practices for farm record keeping?","How to manage seasonal farm tasks?","Digital tools for farm management?"] },
  "land-map":  { emoji:"🗺️", title:"Land Mapper",         color:"#0369a1", desc:"Map your land, mark zones, and plan your farm or garden layout", questions:["How do I map my farm land?","What is a land use map?","How to use GPS to measure farm area?","Best free tools for farm mapping?"] },
  "drone-view":{ emoji:"🚁", title:"Drone Farm View",      color:"#4f46e5", desc:"Use drone imagery to monitor crops, spot problems, and plan irrigation", questions:["How do drones help in farming?","What is NDVI and how does it help crops?","Best drones for small farm monitoring?","How to spot crop disease from a drone?"] },
};

function getTopic(slug: string) {
  return TOPICS[slug] || {
    emoji: "🌿", title: slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    color: "#16a34a", desc: "Nature and agriculture guide powered by FloraIQ AI",
    questions: ["Tell me about this topic", "Common species to know?", "How do beginners get started?", "Conservation importance?"],
  };
}

interface Message { role: "user" | "ai"; text: string; }

export default function SmartGuide() {
  const [, params] = useRoute("/guide/:slug");
  const slug = params?.slug || "plants";
  const topic = getTopic(slug);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [intro, setIntro]       = useState("");
  const [introLoading, setIntroLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function askGemini(question: string, isIntro = false) {
    const key = (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
    const systemPrompt = `You are FloraIQ, a world-class ${topic.title} expert.
Give practical, accurate answers about "${topic.title}" (${topic.desc}).
Be concise but complete — 3-5 short paragraphs max. Use plain language, no jargon.
If relevant, mention specific species names, practical tips, safety warnings.
Format with short paragraphs. No markdown headers. No bullet lists unless asked.`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: "user", parts: [{ text: question }] }],
            generationConfig: { temperature: 0.5, maxOutputTokens: 600 },
          }),
        }
      );
      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't load a response. Please try again.";
    } catch {
      return "Could not connect. Check your internet connection.";
    }
  }

  // Load topic intro on mount
  useEffect(() => {
    setIntroLoading(true);
    setIntro("");
    setMessages([]);
    askGemini(`Give me a 2-paragraph expert introduction to "${topic.title}" for someone who is curious but new to it. Include one surprising or interesting fact.`, true)
      .then(text => { setIntro(text); setIntroLoading(false); });
  }, [slug]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(question?: string) {
    const q = (question ?? input).trim();
    if (!q || loading) return;
    setInput("");
    setMessages(m => [...m, { role: "user", text: q }]);
    setLoading(true);
    const answer = await askGemini(q);
    setMessages(m => [...m, { role: "ai", text: answer }]);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-14">
          <Link href="/tools">
            <button type="button" className="text-muted-foreground hover:text-white shrink-0">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <div className="text-2xl shrink-0">{topic.emoji}</div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold leading-tight truncate">{topic.title}</h1>
            <p className="text-[11px] text-muted-foreground truncate">{topic.desc}</p>
          </div>
          <div className="text-[10px] font-bold px-2 py-1 rounded-full shrink-0"
            style={{ background: `${topic.color}22`, color: topic.color, border: `1px solid ${topic.color}44` }}>
            AI GUIDE
          </div>
        </div>
      </div>

      <div className="flex-1 container max-w-2xl py-5 space-y-5">

        {/* Intro card */}
        <div className="glass rounded-2xl border p-5 space-y-3" style={{ borderColor: `${topic.color}33` }}>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" style={{ color: topic.color }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: topic.color }}>Overview</span>
          </div>
          {introLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />Loading expert introduction…
            </div>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{intro}</p>
          )}
        </div>

        {/* Quick questions */}
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Quick questions</p>
          <div className="flex flex-wrap gap-2">
            {topic.questions.map(q => (
              <button key={q} type="button" onClick={() => send(q)} disabled={loading}
                className="glass border border-border/50 hover:border-emerald-500/50 text-xs px-3 py-2 rounded-full text-left transition-all hover:text-emerald-400 disabled:opacity-50">
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat messages */}
        {messages.length > 0 && (
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-emerald-500 text-white rounded-br-sm"
                    : "glass border border-border/50 text-foreground rounded-bl-sm"
                }`}>
                  {m.role === "ai" && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">FloraIQ AI</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="glass border border-border/50 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />Thinking…
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Wikipedia / external links */}
        <div className="glass rounded-xl border border-border/30 p-4 space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Learn more</p>
          <div className="flex flex-wrap gap-2">
            <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(topic.title)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-2 glass border border-border/50 rounded-full hover:border-emerald-500/50 hover:text-emerald-400 transition-all">
              <ExternalLink className="w-3 h-3" />Wikipedia
            </a>
            <a href={`https://www.gbif.org/search?q=${encodeURIComponent(topic.title)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-2 glass border border-border/50 rounded-full hover:border-emerald-500/50 hover:text-emerald-400 transition-all">
              <ExternalLink className="w-3 h-3" />GBIF Species
            </a>
            <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(topic.title + " guide")}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-2 glass border border-border/50 rounded-full hover:border-emerald-500/50 hover:text-emerald-400 transition-all">
              <ExternalLink className="w-3 h-3" />YouTube
            </a>
          </div>
        </div>

        {/* Spacer for input bar */}
        <div className="h-20" />
      </div>

      {/* Fixed input bar */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-border z-40 p-3">
        <div className="container max-w-2xl">
          <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`Ask anything about ${topic.title}…`}
              disabled={loading}
              className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
            />
            <Button type="submit" disabled={loading || !input.trim()}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 disabled:opacity-50 shrink-0">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
