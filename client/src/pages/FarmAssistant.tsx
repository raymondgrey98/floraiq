import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Sprout, Send, Loader2, AlertCircle, Upload, Camera, Droplets, Sun, Thermometer, Bug, Calendar, Leaf, FlaskConical, Users, ShoppingCart, Globe, CloudRain, DollarSign } from "lucide-react";
import { Link } from "wouter";

// ── Open Meteo Weather (FREE, no key, global) ─────────────────────────────────
const CITY_COORDS: Record<string, { lat: number; lon: number; tz: string }> = {
  "Kuching": { lat: 1.55, lon: 110.34, tz: "Asia/Singapore" },
  "Kuala Lumpur": { lat: 3.14, lon: 101.69, tz: "Asia/Singapore" },
  "Jakarta": { lat: -6.21, lon: 106.85, tz: "Asia/Jakarta" },
  "Bangkok": { lat: 13.75, lon: 100.52, tz: "Asia/Bangkok" },
  "Manila": { lat: 14.60, lon: 120.98, tz: "Asia/Manila" },
  "Dhaka": { lat: 23.81, lon: 90.41, tz: "Asia/Dhaka" },
  "Mumbai": { lat: 19.08, lon: 72.88, tz: "Asia/Kolkata" },
  "Nairobi": { lat: -1.29, lon: 36.82, tz: "Africa/Nairobi" },
  "Lagos": { lat: 6.52, lon: 3.38, tz: "Africa/Lagos" },
  "São Paulo": { lat: -23.55, lon: -46.63, tz: "America/Sao_Paulo" },
  "Mexico City": { lat: 19.43, lon: -99.13, tz: "America/Mexico_City" },
  "Cairo": { lat: 30.04, lon: 31.24, tz: "Africa/Cairo" },
  "Accra": { lat: 5.56, lon: -0.20, tz: "Africa/Accra" },
  "Hanoi": { lat: 21.03, lon: 105.85, tz: "Asia/Bangkok" },
  "Colombo": { lat: 6.93, lon: 79.85, tz: "Asia/Colombo" },
  "Karachi": { lat: 24.86, lon: 67.01, tz: "Asia/Karachi" },
  "Lagos": { lat: 6.52, lon: 3.38, tz: "Africa/Lagos" },
  "London": { lat: 51.51, lon: -0.13, tz: "Europe/London" },
  "New York": { lat: 40.71, lon: -74.01, tz: "America/New_York" },
  "Sydney": { lat: -33.87, lon: 151.21, tz: "Australia/Sydney" },
};

function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("Kuching");
  const [customCity, setCustomCity] = useState("");

  const WMO: Record<number, string> = {
    0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️", 45: "🌫️", 48: "🌫️",
    51: "🌦️", 53: "🌦️", 55: "🌧️", 61: "🌧️", 63: "🌧️", 65: "⛈️",
    71: "🌨️", 73: "🌨️", 75: "❄️", 80: "🌦️", 81: "🌧️", 82: "⛈️",
    95: "⛈️", 96: "⛈️", 99: "⛈️",
  };

  async function load(cityName: string) {
    const coords = CITY_COORDS[cityName];
    if (!coords) return;
    setLoading(true);
    try {
      const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&forecast_days=7&timezone=${encodeURIComponent(coords.tz)}`);
      setWeather(await r.json());
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load("Kuching"); }, []);

  return (
    <div className="glass rounded-xl p-4 border border-blue-500/20">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-blue-400 uppercase tracking-wide flex items-center gap-1">
          <CloudRain className="w-3 h-3" />7-Day Farm Weather
        </p>
        <select value={city} onChange={e => { setCity(e.target.value); load(e.target.value); }}
          aria-label="Select city" title="Select city"
          className="bg-background border border-border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
          {Object.keys(CITY_COORDS).map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      {loading && <div className="h-16 animate-pulse bg-border/20 rounded-lg" />}
      {!loading && weather?.daily && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {weather.daily.time.map((t: string, i: number) => {
            const code = weather.daily.weathercode[i];
            const icon = WMO[code] || WMO[Math.floor(code / 10) * 10] || "🌤️";
            return (
              <div key={i} className={`flex-shrink-0 text-center rounded-lg p-2 min-w-[58px] ${i === 0 ? "bg-blue-500/20 border border-blue-500/30" : "bg-background/30"}`}>
                <p className="text-[10px] text-muted-foreground">{new Date(t).toLocaleDateString("en", { weekday: "short", day: "numeric" })}</p>
                <p className="text-lg my-0.5">{icon}</p>
                <p className="text-xs font-bold">{Math.round(weather.daily.temperature_2m_max[i])}°</p>
                <p className="text-[10px] text-muted-foreground">{Math.round(weather.daily.temperature_2m_min[i])}°</p>
                {weather.daily.precipitation_sum[i] > 0 && <p className="text-[10px] text-blue-400">{weather.daily.precipitation_sum[i]}mm</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── OpenFarm Crop Data (FREE, no key) ─────────────────────────────────────────
async function fetchOpenFarm(cropName: string) {
  const res = await fetch(`https://openfarm.cc/api/v1/crops/?q=${encodeURIComponent(cropName)}`);
  const data = await res.json();
  return data.data?.[0]?.attributes || null;
}

// ── 25 Languages ─────────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: "en",    label: "English" },
  { code: "ms",    label: "Bahasa Malaysia" },
  { code: "zh",    label: "中文 (Chinese)" },
  { code: "iban",  label: "Iban (Sarawak)" },
  { code: "ta",    label: "Tamil தமிழ்" },
  { code: "ar",    label: "العربية Arabic" },
  { code: "hi",    label: "हिंदी Hindi" },
  { code: "id",    label: "Bahasa Indonesia" },
  { code: "tl",    label: "Filipino/Tagalog" },
  { code: "th",    label: "ภาษาไทย Thai" },
  { code: "vi",    label: "Tiếng Việt" },
  { code: "km",    label: "ខ្មែរ Khmer" },
  { code: "my",    label: "မြန်မာ Burmese" },
  { code: "ja",    label: "日本語 Japanese" },
  { code: "ko",    label: "한국어 Korean" },
  { code: "fr",    label: "Français French" },
  { code: "es",    label: "Español Spanish" },
  { code: "pt",    label: "Português" },
  { code: "de",    label: "Deutsch German" },
  { code: "ru",    label: "Русский Russian" },
  { code: "bn",    label: "বাংলা Bengali" },
  { code: "ur",    label: "اردو Urdu" },
  { code: "sw",    label: "Kiswahili Swahili" },
  { code: "ha",    label: "Hausa" },
  { code: "nl",    label: "Nederlands Dutch" },
];

async function askAI(message: string): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history: [] }),
  });
  if (!res.ok) throw new Error("API failed");
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.reply;
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="glass rounded-xl p-4 border border-red-500/30 flex items-center gap-3 text-red-400">
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm">{msg}</p>
    </div>
  );
}

function ResultBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="glass rounded-xl p-5 border border-emerald-500/20">
      <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-3">{title}</p>
      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  );
}

function LangSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <select value={value} onChange={e => onChange(e.target.value)} aria-label="Select language" title="Select language"
        className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
        {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
      </select>
    </div>
  );
}

// ── 1. Farm Plan ──────────────────────────────────────────────────────────────
function FarmPlanTab() {
  const [lang, setLang] = useState("en");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function generate() {
    if (!input.trim()) return;
    setLoading(true); setError(""); setResult("");
    try {
      const langName = LANGUAGES.find(l => l.code === lang)?.label || "English";
      const reply = await askAI(`You are an expert agricultural advisor for tropical regions (Malaysia/Sarawak focus).
IMPORTANT: Respond entirely in ${langName}. ALL prices must be in Malaysian Ringgit (RM / MYR).

Farm description: "${input}"

Give a complete farm plan:
1. Best 6-8 crops suited to this climate and conditions
2. Planting schedule (when to plant each crop)
3. Expected harvest timeline
4. Estimated startup cost in RM (MYR) — itemized
5. Monthly running costs in RM (MYR)
6. Estimated monthly income potential in RM (MYR)
7. Key tips for success in tropical climate
8. Common problems and how to solve them
9. Where to buy seeds and supplies (Malaysia sources)`);
      setResult(reply);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-5">
      <div className="glass rounded-xl p-5 border border-border/50">
        <LangSelect value={lang} onChange={setLang} />
        <label className="block text-sm font-medium mb-3">Describe your farm</label>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          placeholder="e.g., I have a 1000 sq ft plot, full sun, sandy soil, Kuching Sarawak, tropical climate, near river, beginner farmer..."
          className="w-full h-28 bg-background border border-border rounded-lg px-4 py-3 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
        <Button type="button" onClick={generate} disabled={loading || !input.trim()}
          className="mt-3 bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
          {loading ? "Generating..." : "Generate Plan"}
        </Button>
      </div>
      {error && <ErrorBox msg={error} />}
      {result && <ResultBox title="Your Farm Plan" text={result} />}
    </div>
  );
}

// ── 2. Disease & Pest Scan ────────────────────────────────────────────────────
function DiseaseScanTab() {
  const [lang, setLang] = useState("en");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function analyze(file: File) {
    setLoading(true); setError(""); setResult(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("location", JSON.stringify({ latitude: 1.5, longitude: 110.3 }));
      const res = await fetch(`/api/identify?lang=${lang}`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to analyze. Check API key.");
      const data = await res.json();
      setResult(data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    analyze(file);
  }

  return (
    <div className="space-y-5">
      <div className="glass rounded-xl p-5 border border-border/50">
        <LangSelect value={lang} onChange={setLang} />
        <p className="text-sm font-medium mb-4 flex items-center gap-2">
          <Bug className="w-4 h-4 text-red-400" />
          Upload a photo — Gemini AI diagnoses disease, pests, deficiencies
        </p>
        <input ref={fileRef} type="file" accept="image/*" aria-label="Upload plant photo" title="Upload plant photo" className="hidden" onChange={handleFile} />
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => fileRef.current?.click()}
            className="glass border border-border/50 hover:border-emerald-500/50 rounded-xl p-4 flex flex-col items-center gap-2 transition">
            <Upload className="w-6 h-6 text-emerald-400" />
            <span className="text-sm font-medium">Upload Photo</span>
          </button>
          <button type="button" onClick={() => { if (fileRef.current) { fileRef.current.capture = "environment"; fileRef.current.click(); }}}
            className="glass border border-border/50 hover:border-emerald-500/50 rounded-xl p-4 flex flex-col items-center gap-2 transition">
            <Camera className="w-6 h-6 text-blue-400" />
            <span className="text-sm font-medium">Take Photo</span>
          </button>
        </div>
      </div>

      {preview && <div className="glass rounded-xl overflow-hidden border border-border/50"><img src={preview} alt="Plant" className="w-full h-48 object-cover" /></div>}

      {loading && (
        <div className="glass rounded-xl p-6 border border-border/50 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
          <p className="text-sm text-muted-foreground">Analyzing with Gemini Vision AI...</p>
        </div>
      )}

      {error && <ErrorBox msg={error} />}

      {result && (
        <div className="space-y-3">
          <div className="glass rounded-xl p-5 border border-emerald-500/20">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">{result.commonNames?.[lang] || result.commonNames?.en || result.scientificName}</h3>
                <p className="text-sm text-muted-foreground italic">{result.scientificName}</p>
                <p className="text-xs text-emerald-400 mt-1">{Math.round((result.confidence || 0.5) * 100)}% confidence</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${result.riskLevel === "dangerous" ? "bg-red-500/20 text-red-400" : result.riskLevel === "caution" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                {result.riskLevel?.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{result.description}</p>
          </div>

          {result.disease && result.disease !== "none visible" && (
            <div className="glass rounded-xl p-4 border border-red-500/20">
              <p className="text-xs font-bold text-red-400 uppercase tracking-wide mb-2 flex items-center gap-1"><Bug className="w-3 h-3" />Disease / Pest Detected</p>
              <p className="text-sm text-muted-foreground">{result.disease}</p>
            </div>
          )}
          {result.fertilizer && (
            <div className="glass rounded-xl p-4 border border-amber-500/20">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-2 flex items-center gap-1"><FlaskConical className="w-3 h-3" />Fertilizer (price in RM)</p>
              <p className="text-sm text-muted-foreground">{result.fertilizer}</p>
            </div>
          )}
          {result.soilAdvice && (
            <div className="glass rounded-xl p-4 border border-blue-500/20">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-wide mb-2">Soil & Watering</p>
              <p className="text-sm text-muted-foreground">{result.soilAdvice}</p>
            </div>
          )}
          {result.careInstructions && (
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(result.careInstructions).filter(([k]) => ["watering","sunlight","soil","temperature"].includes(k)).map(([key, val]) => (
                <div key={key} className="glass rounded-xl p-3 border border-border/50">
                  <p className="text-xs text-muted-foreground capitalize mb-1 flex items-center gap-1">
                    {key === "watering" && <Droplets className="w-3 h-3 text-blue-400" />}
                    {key === "sunlight" && <Sun className="w-3 h-3 text-yellow-400" />}
                    {key === "temperature" && <Thermometer className="w-3 h-3 text-red-400" />}
                    {key === "soil" && <Leaf className="w-3 h-3 text-emerald-400" />}
                    {key}
                  </p>
                  <p className="text-xs font-medium">{String(val)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── 3. Care Schedule ──────────────────────────────────────────────────────────
function CareScheduleTab() {
  const [lang, setLang] = useState("en");
  const [plant, setPlant] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [ofData, setOfData] = useState<any>(null);

  const quickPlants = ["Tomato","Chili","Padi / Rice","Durian","Banana","Kangkung","Lettuce","Cucumber","Papaya","Coconut","Rambutan","Pineapple","Sweet Potato","Tapioca"];

  async function generate(name: string) {
    setLoading(true); setError(""); setResult(""); setPlant(name); setOfData(null);
    try {
      const langName = LANGUAGES.find(l => l.code === lang)?.label || "English";
      // AI care schedule + OpenFarm data in parallel
      const [reply, ofRes] = await Promise.all([
        askAI(`You are an expert tropical plant care advisor (Malaysia/Sarawak context).
IMPORTANT: Respond in ${langName}. All prices in RM (MYR).
Create a detailed weekly care schedule for: ${name}
🌊 Watering: frequency, amount, signs of over/under watering
☀️ Sunlight: hours needed, shade tolerance
🧪 Fertilizer: type, frequency, NPK ratio, organic options, price in RM
✂️ Pruning: when and how
🐛 Pest & Disease: common pests in Malaysia, prevention, treatment cost in RM
🌡️ Temperature & Humidity: ideal for Malaysia climate
📅 Growth Timeline: weeks to harvest
💡 Pro Tips: 5 expert tips for tropical Malaysia`),
        fetch(`https://openfarm.cc/api/v1/crops/?q=${encodeURIComponent(name)}`).then(r => r.ok ? r.json() : null).catch(() => null),
      ]);
      setResult(reply);
      if (ofRes?.data?.[0]) setOfData(ofRes.data[0].attributes);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-5">
      <div className="glass rounded-xl p-5 border border-border/50">
        <LangSelect value={lang} onChange={setLang} />
        <p className="text-sm font-medium mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-400" />Select or type a plant</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {quickPlants.map(p => (
            <button type="button" key={p} onClick={() => generate(p)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold glass border border-border/50 hover:border-emerald-500/50 hover:text-emerald-400 transition">{p}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={plant} onChange={e => setPlant(e.target.value)} onKeyDown={e => e.key === "Enter" && generate(plant)}
            placeholder="Or type any plant..."
            className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <Button type="button" onClick={() => generate(plant)} disabled={loading || !plant.trim()} className="bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      {error && <ErrorBox msg={error} />}

      {/* OpenFarm data (real database) */}
      {ofData && (
        <div className="glass rounded-xl p-5 border border-blue-500/20">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-wide mb-3">OpenFarm Database — {ofData.name}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {ofData.sun_requirements && <div className="glass rounded-lg p-3 border border-border/50"><p className="text-xs text-muted-foreground mb-1">☀️ Sunlight</p><p className="text-xs font-medium">{ofData.sun_requirements}</p></div>}
            {ofData.sowing_method && <div className="glass rounded-lg p-3 border border-border/50"><p className="text-xs text-muted-foreground mb-1">🌱 Sowing</p><p className="text-xs font-medium">{ofData.sowing_method}</p></div>}
            {ofData.spread && <div className="glass rounded-lg p-3 border border-border/50"><p className="text-xs text-muted-foreground mb-1">📐 Spread</p><p className="text-xs font-medium">{ofData.spread} cm</p></div>}
            {ofData.row_spacing && <div className="glass rounded-lg p-3 border border-border/50"><p className="text-xs text-muted-foreground mb-1">↔️ Row Spacing</p><p className="text-xs font-medium">{ofData.row_spacing} cm</p></div>}
            {ofData.height && <div className="glass rounded-lg p-3 border border-border/50"><p className="text-xs text-muted-foreground mb-1">📏 Height</p><p className="text-xs font-medium">{ofData.height} cm</p></div>}
            {ofData.guides_count !== undefined && <div className="glass rounded-lg p-3 border border-border/50"><p className="text-xs text-muted-foreground mb-1">📋 Guides</p><p className="text-xs font-medium">{ofData.guides_count} available</p></div>}
          </div>
          {ofData.description && <p className="text-xs text-muted-foreground leading-relaxed mb-2">{ofData.description.slice(0, 300)}</p>}
          <a href={`https://openfarm.cc/en/crops/${plant.toLowerCase().replace(/\s+/g, "-")}`} target="_blank" rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300">View full guide on OpenFarm →</a>
        </div>
      )}

      {result && <ResultBox title={`AI Care Schedule — ${plant}`} text={result} />}
    </div>
  );
}

// ── 4. Companion Planting ─────────────────────────────────────────────────────
function CompanionTab() {
  const [lang, setLang] = useState("en");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function generate() {
    if (!input.trim()) return;
    setLoading(true); setError(""); setResult("");
    try {
      const langName = LANGUAGES.find(l => l.code === lang)?.label || "English";
      const reply = await askAI(`You are a companion planting and permaculture expert (Malaysia/tropical focus).
Respond in ${langName}. Prices in RM (MYR).

Main plant(s): "${input}"

✅ Best companions (with reasons)
❌ Bad neighbors (with reasons)
🌿 Pest-repelling companions
🌱 Nitrogen fixers
📐 Layout suggestion for small Malaysian garden
🌺 Pollinator attractors available in Malaysia
💰 Cost estimate in RM to setup companion bed
🛒 Where to buy companion plants in Malaysia (Shopee, Lazada, nurseries)`);
      setResult(reply);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-5">
      <div className="glass rounded-xl p-5 border border-border/50">
        <LangSelect value={lang} onChange={setLang} />
        <p className="text-sm font-medium mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-emerald-400" />Find best companion plants</p>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && generate()}
          placeholder="e.g., Tomato, Chili, Cucumber..."
          className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-3" />
        <Button type="button" onClick={generate} disabled={loading || !input.trim()} className="bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Users className="w-4 h-4 mr-2" />}
          {loading ? "Finding..." : "Find Companions"}
        </Button>
      </div>
      {error && <ErrorBox msg={error} />}
      {result && <ResultBox title="Companion Planting Guide" text={result} />}
    </div>
  );
}

// ── 5. Hydroponics ────────────────────────────────────────────────────────────
function HydroponicsTab() {
  const [lang, setLang] = useState("en");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function generate() {
    if (!input.trim()) return;
    setLoading(true); setError(""); setResult("");
    try {
      const langName = LANGUAGES.find(l => l.code === lang)?.label || "English";
      const reply = await askAI(`You are a hydroponics expert specializing in tropical/indoor setups in Malaysia.
Respond in ${langName}. ALL prices in RM (MYR). Include Shopee/Lazada Malaysia links for equipment.

Setup request: "${input}"

🏗️ Recommended System (NFT, DWC, Kratky, etc.) with reasons
📋 Step-by-step setup instructions
💧 Nutrient solution: specific products available in Malaysia, EC/PPM, price in RM
🔬 pH management: target range, adjustment products, cost in RM
💡 Lighting: type, wattage, hours — Malaysian brands/prices in RM
🌡️ Temperature & Humidity for Malaysian climate
🐛 Common problems & solutions
💰 Itemized budget in RM (MYR) — startup and monthly running cost
🛒 Where to buy in Malaysia: Shopee, Lazada, local hydroponics shops
⏱️ Time to first harvest`);
      setResult(reply);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-5">
      <div className="glass rounded-xl p-5 border border-border/50">
        <LangSelect value={lang} onChange={setLang} />
        <label className="block text-sm font-medium mb-3">Describe your setup</label>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          placeholder="e.g., Grow lettuce indoors with LED, small apartment, beginner, budget RM500..."
          className="w-full h-24 bg-background border border-border rounded-lg px-4 py-3 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
        <Button type="button" onClick={generate} disabled={loading || !input.trim()} className="mt-3 bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
          {loading ? "Generating..." : "Generate Guide"}
        </Button>
      </div>
      {error && <ErrorBox msg={error} />}
      {result && <ResultBox title="Hydroponics Guide" text={result} />}
    </div>
  );
}

// ── 6. Calendar ────────────────────────────────────────────────────────────────
function CalendarTab() {
  const [lang, setLang] = useState("en");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true); setError(""); setResult("");
    const loc = location.trim() || "Kuching, Sarawak, Malaysia — tropical equatorial";
    try {
      const langName = LANGUAGES.find(l => l.code === lang)?.label || "English";
      const reply = await askAI(`You are an expert agricultural calendar planner for tropical Malaysia.
Respond in ${langName}. Prices in RM (MYR).

Location: ${loc}

12-month planting calendar. For each month:
📅 Month
🌱 What to PLANT (specific crops for this region)
🌾 What to HARVEST
🌧️ Weather/rainfall notes for Malaysia
🐛 Pest/disease threats
✅ Key farm tasks
💰 Estimated monthly input cost in RM`);
      setResult(reply);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-5">
      <div className="glass rounded-xl p-5 border border-border/50">
        <LangSelect value={lang} onChange={setLang} />
        <label className="flex text-sm font-medium mb-3 items-center gap-2"><Calendar className="w-4 h-4 text-emerald-400" />Your location</label>
        <input value={location} onChange={e => setLocation(e.target.value)}
          placeholder="e.g., Kuching Sarawak / Penang / Cameron Highlands / KL..."
          className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-3" />
        <Button type="button" onClick={generate} disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Calendar className="w-4 h-4 mr-2" />}
          {loading ? "Generating..." : "Generate 12-Month Calendar"}
        </Button>
      </div>
      {error && <ErrorBox msg={error} />}
      {result && <ResultBox title="Planting Calendar" text={result} />}
    </div>
  );
}

// ── 7. Soil Analysis ──────────────────────────────────────────────────────────
function SoilTab() {
  const [lang, setLang] = useState("en");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function generate() {
    if (!input.trim()) return;
    setLoading(true); setError(""); setResult("");
    try {
      const langName = LANGUAGES.find(l => l.code === lang)?.label || "English";
      const reply = await askAI(`You are a soil science expert for tropical agriculture in Malaysia/Sarawak.
Respond in ${langName}. ALL prices in RM (MYR).

Soil description: "${input}"

🔬 Soil type assessment
📊 Estimated pH & what it means
🌱 Best crops for this soil (Malaysia context)
🧪 Amendments needed — products available in Malaysia, price in RM
💧 Drainage: assessment & fixes
🪱 Organic matter: how to build it (compost, mulch)
🌿 Green manure/cover crops for Malaysia
⏱️ Timeline to improve
💰 Total improvement cost in RM
🛒 Where to buy soil amendments in Malaysia (Shopee, Lazada, Baja Maju, etc.)`);
      setResult(reply);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-5">
      <div className="glass rounded-xl p-5 border border-border/50">
        <LangSelect value={lang} onChange={setLang} />
        <label className="flex text-sm font-medium mb-3 items-center gap-2"><FlaskConical className="w-4 h-4 text-amber-400" />Describe your soil</label>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          placeholder="e.g., Red clay soil, drains poorly, near river, Sarawak, slightly acidic..."
          className="w-full h-24 bg-background border border-border rounded-lg px-4 py-3 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
        <Button type="button" onClick={generate} disabled={loading || !input.trim()} className="mt-3 bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FlaskConical className="w-4 h-4 mr-2" />}
          {loading ? "Analyzing..." : "Analyze Soil"}
        </Button>
      </div>
      {error && <ErrorBox msg={error} />}
      {result && <ResultBox title="Soil Analysis & Plan" text={result} />}
    </div>
  );
}

// ── 8. Marketplace ────────────────────────────────────────────────────────────
const MARKETS = [
  {
    category: "🛒 Online Marketplaces",
    stores: [
      { name: "Shopee Malaysia — Seeds & Plants", url: "https://shopee.com.my/search?keyword=benih+sayur+seeds", desc: "Cheapest prices, wide selection", badge: "Best Price" },
      { name: "Lazada Malaysia — Agriculture", url: "https://www.lazada.com.my/catalog/?q=benih+seeds+baja", desc: "Fast delivery, trusted sellers", badge: "Fast Delivery" },
      { name: "Temu Malaysia — Farm Supplies", url: "https://www.temu.com/search_result.html?search_key=garden+seeds", desc: "Ultra cheap bulk supplies", badge: "Cheap" },
      { name: "Mudah.my — Used Farm Equipment", url: "https://www.mudah.my/malaysia/farming-w40", desc: "Second-hand tools & equipment", badge: "Used/Cheap" },
    ],
  },
  {
    category: "🌱 Seeds & Seedlings",
    stores: [
      { name: "East-West Seed Malaysia", url: "https://www.eastwestseed.com/", desc: "World's top tropical vegetable seeds", badge: "Professional" },
      { name: "Known-You Seed Malaysia", url: "https://www.known-you.com/en/", desc: "Premium hybrid vegetable seeds", badge: "Hybrid Seeds" },
      { name: "Yates Malaysia — Seeds", url: "https://www.shopee.com.my/search?keyword=yates+seeds", desc: "Yates brand seeds on Shopee", badge: "Trusted Brand" },
      { name: "Kejora Herbs — Herb Seeds", url: "https://www.shopee.com.my/search?keyword=benih+herba+malaysia", desc: "Malaysian herb & medicinal seeds", badge: "Local Herbs" },
      { name: "Biji-Biji — Heirloom Seeds", url: "https://shopee.com.my/search?keyword=biji+biji+seeds+heirloom", desc: "Organic heirloom & rare seeds", badge: "Organic" },
    ],
  },
  {
    category: "🧪 Fertilizers (Baja)",
    stores: [
      { name: "Shopee — Baja NPK Malaysia", url: "https://shopee.com.my/search?keyword=baja+NPK+pertanian", desc: "NPK fertilizers, all types", badge: "Best Seller" },
      { name: "Agrosaiz — Baja Organik", url: "https://shopee.com.my/search?keyword=baja+organik+agrosaiz", desc: "Organic fertilizer, Malaysian brand", badge: "Organic" },
      { name: "Baja Maju — Soil Amendments", url: "https://shopee.com.my/search?keyword=baja+maju+tanah", desc: "Soil conditioners & amendments", badge: "Local Brand" },
      { name: "FELDA Agriculture Store", url: "https://shopee.com.my/search?keyword=baja+felda+pertanian", desc: "FELDA certified fertilizers", badge: "FELDA" },
      { name: "Yara Malaysia — Premium Baja", url: "https://shopee.com.my/search?keyword=yara+fertilizer+malaysia", desc: "Premium international fertilizer brand", badge: "Premium" },
    ],
  },
  {
    category: "🚿 Hydroponics Equipment",
    stores: [
      { name: "Shopee — Hydroponics Malaysia", url: "https://shopee.com.my/search?keyword=hydroponics+kit+malaysia", desc: "Full hydro kits, nutrients, pumps", badge: "Complete Kits" },
      { name: "Lazada — LED Grow Light", url: "https://www.lazada.com.my/catalog/?q=led+grow+light+plant", desc: "LED grow lights for indoor farming", badge: "Grow Lights" },
      { name: "Shopee — Nutrient Solution", url: "https://shopee.com.my/search?keyword=nutrient+solution+hydroponics", desc: "AB nutrient solutions for hydroponics", badge: "Nutrients" },
      { name: "Greenhouses & Netting", url: "https://shopee.com.my/search?keyword=greenhouse+net+pertanian", desc: "Greenhouse frames, shade nets", badge: "Infrastructure" },
    ],
  },
  {
    category: "🔧 Tools & Equipment",
    stores: [
      { name: "Mr. DIY Malaysia", url: "https://www.mrdiy.com/", desc: "Affordable garden tools nationwide", badge: "Nationwide" },
      { name: "Shopee — Garden Tools", url: "https://shopee.com.my/search?keyword=garden+tools+cangkul", desc: "Cangkul, parang, sprayers & more", badge: "Cheap Tools" },
      { name: "ACE Hardware Malaysia", url: "https://www.acehardware.com.my/", desc: "Premium garden & farm tools", badge: "Premium" },
      { name: "Lazada — Water Pump & Irrigation", url: "https://www.lazada.com.my/catalog/?q=water+pump+irrigation+farm", desc: "Irrigation systems, pumps, drip kits", badge: "Irrigation" },
    ],
  },
  {
    category: "🌿 Sarawak Local Sources",
    stores: [
      { name: "Pasar Tani Sarawak", url: "https://www.facebook.com/search/top?q=pasar%20tani%20sarawak", desc: "Local farmers market — fresh seedlings", badge: "Local" },
      { name: "Nurseri Pokok Sarawak", url: "https://www.shopee.com.my/search?keyword=nurseri+pokok+sarawak", desc: "Local Sarawak plant nurseries", badge: "Sarawak" },
      { name: "SarawakYou — Agriculture", url: "https://www.sarawakyou.com/", desc: "Sarawak local agriculture info & suppliers", badge: "Sarawak" },
      { name: "SEDC Sarawak Agriculture", url: "https://www.sedc.com.my/", desc: "State-backed agriculture development", badge: "Government" },
    ],
  },
  {
    category: "📚 Learn & Reference",
    stores: [
      { name: "YouTube — Pertanian Malaysia", url: "https://www.youtube.com/results?search_query=pertanian+malaysia+organik", desc: "Malaysian farming videos & tutorials", badge: "Free" },
      { name: "MARDI Malaysia", url: "https://www.mardi.gov.my/", desc: "Malaysian Agri Research & Dev Institute", badge: "Official" },
      { name: "DOA Malaysia — Crop Info", url: "https://www.doa.gov.my/", desc: "Dept of Agriculture Malaysia guides", badge: "Official" },
      { name: "Facebook — Petani Malaysia", url: "https://www.facebook.com/search/top?q=petani%20malaysia%20group", desc: "Malaysian farmer community groups", badge: "Community" },
    ],
  },
];

function MarketplaceTab() {
  const [search, setSearch] = useState("");
  const filtered = MARKETS.map(cat => ({
    ...cat,
    stores: cat.stores.filter(s =>
      !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.stores.length > 0);

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-4 border border-border/50">
        <p className="text-sm font-medium mb-3 flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-emerald-400" />
          All places to buy farm supplies in Malaysia — online & local
        </p>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search marketplace..."
          className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>

      {filtered.map(cat => (
        <div key={cat.category}>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">{cat.category}</p>
          <div className="space-y-2">
            {cat.stores.map(store => (
              <a key={store.name} href={store.url} target="_blank" rel="noopener noreferrer"
                className="glass rounded-xl p-4 border border-border/50 hover:border-emerald-500/40 transition-all flex items-center justify-between gap-3 group">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm group-hover:text-emerald-400 transition truncate">{store.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{store.desc}</p>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">{store.badge}</span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 9. Fertilizer Calculator ─────────────────────────────────────────────────
function FertilizerCalcTab() {
  const [area, setArea] = useState("");
  const [crop, setCrop] = useState("");
  const [unit, setUnit] = useState("hectare");
  const [result, setResult] = useState<any>(null);

  const FERT_DATA: Record<string, { n: number; p: number; k: number; notes: string }> = {
    "Padi": { n: 90, p: 60, k: 60, notes: "Apply in 3 splits: basal, tillering, panicle initiation" },
    "Kelapa Sawit": { n: 1500, p: 500, k: 2000, notes: "Annual application, split into 2x per year" },
    "Getah (Rubber)": { n: 60, p: 30, k: 60, notes: "Apply during dry season for best uptake" },
    "Durian": { n: 200, p: 100, k: 300, notes: "Increase K before flowering for better fruit quality" },
    "Pisang": { n: 200, p: 60, k: 300, notes: "High K demand — use MOP (Muriate of Potash)" },
    "Tomato": { n: 150, p: 80, k: 200, notes: "Side-dress with N after first fruit set" },
    "Cili": { n: 120, p: 60, k: 150, notes: "Foliar spray with Ca/Mg to prevent blossom end rot" },
    "Sayur-sayuran": { n: 100, p: 50, k: 100, notes: "Leafy veg need more N; fruiting veg need more K" },
    "Nenas": { n: 300, p: 60, k: 400, notes: "Apply in 3–4 splits throughout growing season" },
    "Betik": { n: 120, p: 60, k: 180, notes: "Balanced NPK critical during fruit development" },
  };

  // NPK fertilizer prices per kg in RM (approximate)
  const PRICES = { urea: 2.5, tsp: 3.2, mop: 2.8, compound: 3.5 };

  function calculate() {
    const a = parseFloat(area);
    if (!a || !crop || !FERT_DATA[crop]) return;
    const data = FERT_DATA[crop];
    const areaHa = unit === "hectare" ? a : unit === "acre" ? a * 0.405 : a / 10000;

    const nKg = data.n * areaHa;
    const pKg = data.p * areaHa;
    const kKg = data.k * areaHa;

    // Calculate actual fertilizer amounts
    const ureaKg = nKg / 0.46;       // Urea = 46% N
    const tspKg  = pKg / 0.46;       // TSP = 46% P2O5
    const mopKg  = kKg / 0.60;       // MOP = 60% K2O

    setResult({
      crop, area: a, unit, areaHa: areaHa.toFixed(2),
      npk: { n: nKg.toFixed(0), p: pKg.toFixed(0), k: kKg.toFixed(0) },
      fert: { urea: ureaKg.toFixed(0), tsp: tspKg.toFixed(0), mop: mopKg.toFixed(0) },
      cost: {
        urea: (ureaKg * PRICES.urea).toFixed(2),
        tsp:  (tspKg  * PRICES.tsp).toFixed(2),
        mop:  (mopKg  * PRICES.mop).toFixed(2),
        total: (ureaKg * PRICES.urea + tspKg * PRICES.tsp + mopKg * PRICES.mop).toFixed(2),
      },
      notes: data.notes,
    });
  }

  return (
    <div className="space-y-5">
      <div className="glass rounded-xl p-5 border border-border/50">
        <p className="text-sm font-medium mb-4 flex items-center gap-2"><FlaskConical className="w-4 h-4 text-amber-400" />Calculate exact fertilizer needed + cost in RM</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <select value={crop} onChange={e => setCrop(e.target.value)} aria-label="Crop" title="Crop"
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">Select Crop...</option>
            {Object.keys(FERT_DATA).map(c => <option key={c}>{c}</option>)}
          </select>
          <div className="flex gap-2">
            <input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="Area"
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <select value={unit} onChange={e => setUnit(e.target.value)} aria-label="Unit" title="Unit"
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="hectare">ha</option>
              <option value="acre">acre</option>
              <option value="sqm">m²</option>
            </select>
          </div>
        </div>
        <Button type="button" onClick={calculate} disabled={!crop || !area}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50">
          <FlaskConical className="w-4 h-4 mr-2" />Calculate
        </Button>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="glass rounded-xl p-5 border border-amber-500/20">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-3">NPK Requirements for {result.crop} ({result.area} {result.unit} = {result.areaHa} ha)</p>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[{ label: "Nitrogen (N)", val: result.npk.n, color: "text-green-400" },
                { label: "Phosphorus (P)", val: result.npk.p, color: "text-blue-400" },
                { label: "Potassium (K)", val: result.npk.k, color: "text-orange-400" }].map(x => (
                <div key={x.label} className="glass rounded-lg p-3 text-center">
                  <p className={`text-lg font-bold ${x.color}`}>{x.val} kg</p>
                  <p className="text-xs text-muted-foreground">{x.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass rounded-xl p-5 border border-border/50">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Fertilizer to Buy</p>
            {[{ name: "Urea (46% N)", kg: result.fert.urea, cost: result.cost.urea, color: "text-green-400" },
              { name: "TSP (46% P₂O₅)", kg: result.fert.tsp, cost: result.cost.tsp, color: "text-blue-400" },
              { name: "MOP (60% K₂O)", kg: result.fert.mop, cost: result.cost.mop, color: "text-orange-400" }].map(f => (
              <div key={f.name} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                <span className="text-sm text-muted-foreground">{f.name}</span>
                <div className="text-right">
                  <span className={`text-sm font-bold ${f.color}`}>{f.kg} kg</span>
                  <span className="text-xs text-muted-foreground ml-2">≈ RM {f.cost}</span>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center pt-3 font-bold">
              <span>Total Fertilizer Cost</span>
              <span className="text-emerald-400 text-lg">RM {result.cost.total}</span>
            </div>
          </div>
          <div className="glass rounded-xl p-4 border border-border/50">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Application Notes</p>
            <p className="text-sm text-muted-foreground">{result.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 10. Yield Estimator ───────────────────────────────────────────────────────
function YieldTab() {
  const [lang, setLang] = useState("en");
  const [crop, setCrop] = useState("");
  const [area, setArea] = useState("");
  const [unit, setUnit] = useState("hectare");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const YIELDS: Record<string, { min: number; max: number; unit: string; priceMin: number; priceMax: number; priceUnit: string }> = {
    "Padi": { min: 3, max: 6, unit: "mt/ha", priceMin: 1200, priceMax: 1400, priceUnit: "RM/mt" },
    "Kelapa Sawit": { min: 15, max: 25, unit: "mt FFB/ha/yr", priceMin: 600, priceMax: 900, priceUnit: "RM/mt" },
    "Durian": { min: 10, max: 30, unit: "mt/ha/yr", priceMin: 8000, priceMax: 30000, priceUnit: "RM/mt" },
    "Pisang": { min: 20, max: 40, unit: "mt/ha/cycle", priceMin: 800, priceMax: 1500, priceUnit: "RM/mt" },
    "Getah (Rubber)": { min: 1.2, max: 2.0, unit: "mt dry rubber/ha/yr", priceMin: 5000, priceMax: 8000, priceUnit: "RM/mt" },
    "Tomato": { min: 20, max: 50, unit: "mt/ha/season", priceMin: 1500, priceMax: 3000, priceUnit: "RM/mt" },
    "Cili": { min: 8, max: 15, unit: "mt/ha/season", priceMin: 3000, priceMax: 8000, priceUnit: "RM/mt" },
    "Timun": { min: 25, max: 50, unit: "mt/ha/season", priceMin: 700, priceMax: 1200, priceUnit: "RM/mt" },
    "Nenas": { min: 40, max: 80, unit: "mt/ha/cycle", priceMin: 400, priceMax: 700, priceUnit: "RM/mt" },
    "Betik": { min: 30, max: 60, unit: "mt/ha/yr", priceMin: 800, priceMax: 1500, priceUnit: "RM/mt" },
  };

  async function estimate() {
    if (!crop || !area) return;
    const areaHa = unit === "hectare" ? parseFloat(area) : unit === "acre" ? parseFloat(area) * 0.405 : parseFloat(area) / 10000;
    const y = YIELDS[crop];
    if (!y) return;
    const minYield = (y.min * areaHa).toFixed(1);
    const maxYield = (y.max * areaHa).toFixed(1);
    const minRev = (y.min * areaHa * y.priceMin).toLocaleString("en-MY");
    const maxRev = (y.max * areaHa * y.priceMax).toLocaleString("en-MY");

    setLoading(true); setError(""); setResult("");
    try {
      const langName = LANGUAGES.find(l => l.code === lang)?.label || "English";
      const reply = await askAI(`Farm yield analysis. Respond in ${langName}. All prices in RM (MYR).

Crop: ${crop}
Area: ${areaHa.toFixed(2)} hectares

Based on Malaysian average yields:
- Estimated yield: ${minYield}–${maxYield} ${y.unit}
- Estimated revenue: RM ${minRev} – RM ${maxRev} per season

Provide:
1. Factors that affect yield in Malaysian climate
2. How to achieve maximum yield (top 5 practices)
3. Current market price range in Malaysia (RM)
4. Best buyers/markets in Malaysia to sell this crop
5. Government subsidies or schemes available (FAMA, FELDA, DOA)
6. ROI calculation: cost vs expected profit in RM`);
      setResult(reply);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  const y = YIELDS[crop];
  const areaHa = unit === "hectare" ? parseFloat(area || "0") : unit === "acre" ? parseFloat(area || "0") * 0.405 : parseFloat(area || "0") / 10000;

  return (
    <div className="space-y-5">
      <div className="glass rounded-xl p-5 border border-border/50">
        <LangSelect value={lang} onChange={setLang} />
        <p className="text-sm font-medium mb-4 flex items-center gap-2"><TrendingUpIcon className="w-4 h-4 text-emerald-400" />Estimate yield & income in RM</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <select value={crop} onChange={e => setCrop(e.target.value)} aria-label="Crop" title="Crop"
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">Select Crop...</option>
            {Object.keys(YIELDS).map(c => <option key={c}>{c}</option>)}
          </select>
          <div className="flex gap-2">
            <input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="Area"
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <select value={unit} onChange={e => setUnit(e.target.value)} aria-label="Unit" title="Unit"
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="hectare">ha</option>
              <option value="acre">acre</option>
              <option value="sqm">m²</option>
            </select>
          </div>
        </div>

        {y && area && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="glass rounded-lg p-3 border border-emerald-500/20 text-center">
              <p className="text-xs text-muted-foreground mb-1">Estimated Yield</p>
              <p className="font-bold text-emerald-400">{(y.min * areaHa).toFixed(1)}–{(y.max * areaHa).toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">{y.unit}</p>
            </div>
            <div className="glass rounded-lg p-3 border border-amber-500/20 text-center">
              <p className="text-xs text-muted-foreground mb-1">Estimated Revenue</p>
              <p className="font-bold text-amber-400">RM {(y.min * areaHa * y.priceMin).toLocaleString()}–{(y.max * areaHa * y.priceMax).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{y.priceUnit}</p>
            </div>
          </div>
        )}

        <Button type="button" onClick={estimate} disabled={loading || !crop || !area}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
          {loading ? "Analyzing..." : "Get Full Analysis"}
        </Button>
      </div>
      {error && <ErrorBox msg={error} />}
      {result && <ResultBox title="Yield & Income Analysis" text={result} />}
    </div>
  );
}

// ── 11. Pest Control Guide ────────────────────────────────────────────────────
function PestGuideTab() {
  const [lang, setLang] = useState("en");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const COMMON_PESTS = ["Aphids (Kutu Daun)","Whitefly (Lalat Putih)","Thrips","Spider Mites","Mealybugs","Scale Insects","Leaf Miners","Fruit Borers","Stem Borers","Root Knot Nematodes","Fusarium Wilt","Anthracnose","Powdery Mildew","Downy Mildew","Bacterial Wilt","Leaf Spot","Mosaic Virus","Blight","Rats / Tikus","Wild Boar / Babi Hutan"];

  async function search(pest: string) {
    setLoading(true); setError(""); setResult(""); setQuery(pest);
    try {
      const langName = LANGUAGES.find(l => l.code === lang)?.label || "English";
      const reply = await askAI(`You are a plant pathologist and pest control expert for Malaysian/tropical agriculture.
Respond in ${langName}. Prices in RM (MYR).

Pest/Disease: "${pest}"

Provide complete control guide:
🔍 Identification: how to recognize it (symptoms, appearance)
🌱 Crops affected: which Malaysian crops are most vulnerable
⚠️ Damage level: economic threshold in Malaysian context
🌿 Organic/Biological control: safe methods, products available in Malaysia
💊 Chemical control: approved pesticides in Malaysia, dosage, safety intervals
⏰ Prevention: cultural practices to prevent infestation
💰 Treatment cost estimate in RM per hectare
🛒 Where to buy pesticides/biocontrol in Malaysia
⚠️ Safety precautions: PPE required, re-entry intervals
📞 Emergency contacts: Jabatan Pertanian Malaysia hotline`);
      setResult(reply);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-5">
      <div className="glass rounded-xl p-5 border border-border/50">
        <LangSelect value={lang} onChange={setLang} />
        <p className="text-sm font-medium mb-3 flex items-center gap-2"><Bug className="w-4 h-4 text-red-400" />Pest & Disease Control Guide</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {COMMON_PESTS.map(p => (
            <button type="button" key={p} onClick={() => search(p)}
              className="px-2.5 py-1 rounded-full text-xs glass border border-border/50 hover:border-red-500/50 hover:text-red-400 transition">{p}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && search(query)}
            placeholder="Or type any pest or disease..."
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <Button type="button" onClick={() => search(query)} disabled={loading || !query.trim()} className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      {error && <ErrorBox msg={error} />}
      {result && <ResultBox title={`Pest Control: ${query}`} text={result} />}
    </div>
  );
}

// ── 12. Plant Growth Log ──────────────────────────────────────────────────────
interface GrowthEntry { id: string; plant: string; date: string; height: string; notes: string; health: "good"|"fair"|"poor"; }

function GrowthLogTab() {
  const [entries, setEntries] = useState<GrowthEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ plant: "", date: new Date().toISOString().split("T")[0], height: "", notes: "", health: "good" as const });

  useEffect(() => {
    try { const s = localStorage.getItem("floraiq_growth"); if (s) setEntries(JSON.parse(s)); } catch {}
  }, []);

  function save(e: GrowthEntry[]) { setEntries(e); localStorage.setItem("floraiq_growth", JSON.stringify(e)); }

  function add() {
    if (!form.plant || !form.date) return;
    save([{ id: Date.now().toString(), ...form }, ...entries]);
    setForm({ plant: "", date: new Date().toISOString().split("T")[0], height: "", notes: "", health: "good" });
    setShowForm(false);
  }

  const healthColor = { good: "text-emerald-400 bg-emerald-500/20", fair: "text-amber-400 bg-amber-500/20", poor: "text-red-400 bg-red-500/20" };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium flex items-center gap-2"><Leaf className="w-4 h-4 text-emerald-400" />Track individual plant growth & health</p>
        <Button type="button" onClick={() => setShowForm(true)} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-1" />Add Entry
        </Button>
      </div>

      {showForm && (
        <div className="glass rounded-xl p-5 border border-emerald-500/30 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={form.plant} onChange={e => setForm(f => ({ ...f, plant: e.target.value }))} placeholder="Plant name"
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              aria-label="Date" title="Date"
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.height} onChange={e => setForm(f => ({ ...f, height: e.target.value }))} placeholder="Height (e.g. 30cm)"
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <select value={form.health} onChange={e => setForm(f => ({ ...f, health: e.target.value as any }))} aria-label="Health status" title="Health status"
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="good">✅ Good Health</option>
              <option value="fair">⚠️ Fair Health</option>
              <option value="poor">❌ Poor Health</option>
            </select>
          </div>
          <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Observations, issues, treatments..."
            className="w-full h-20 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
          <div className="flex gap-2">
            <Button type="button" onClick={add} disabled={!form.plant} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">Save</Button>
            <Button type="button" onClick={() => setShowForm(false)} variant="outline" className="border-border/50">Cancel</Button>
          </div>
        </div>
      )}

      {entries.length === 0 && !showForm && (
        <div className="text-center py-12 text-muted-foreground text-sm">No growth entries yet. Add your first plant log.</div>
      )}

      <div className="space-y-2">
        {entries.map(e => (
          <div key={e.id} className="glass rounded-xl p-4 border border-border/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{e.plant}</p>
                <p className="text-xs text-muted-foreground">{e.date}{e.height ? ` · ${e.height}` : ""}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${healthColor[e.health]}`}>{e.health}</span>
                <button type="button" aria-label="Delete entry" title="Delete entry" onClick={() => save(entries.filter(x => x.id !== e.id))} className="text-muted-foreground hover:text-red-400 transition">
                  <Trash2Icon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            {e.notes && <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{e.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 13. Global Market Prices (196 countries) ─────────────────────────────────
const GLOBAL_MARKETS = [
  {
    region: "🌍 Global Commodity Prices",
    links: [
      { name: "FAO Food Price Index", url: "https://www.fao.org/worldfoodsituation/foodpricesindex/en/", desc: "UN global food commodity price index — all crops, 196 countries", badge: "UN Official" },
      { name: "World Bank Commodity Prices", url: "https://www.worldbank.org/en/research/commodity-markets", desc: "Real-time global commodity prices (agriculture, metals, energy)", badge: "Live" },
      { name: "Trading Economics — Agriculture", url: "https://tradingeconomics.com/commodities/agricultural", desc: "Live prices: rice, corn, wheat, soybean, coffee, cocoa — all countries", badge: "Live" },
      { name: "IndexMundi — Crop Prices", url: "https://www.indexmundi.com/commodities/", desc: "Historical & current global crop prices by country", badge: "Historical" },
      { name: "USDA FAS — Global Agriculture", url: "https://fas.usda.gov/data", desc: "US Dept of Agriculture global production & trade data", badge: "Official" },
      { name: "CME Group — Futures", url: "https://www.cmegroup.com/markets/agriculture.html", desc: "Live futures: corn, wheat, soybeans, cotton, sugar, coffee", badge: "Futures" },
      { name: "Reuters Commodity Prices", url: "https://www.reuters.com/markets/commodities/", desc: "Breaking news + live prices for all global commodities", badge: "Live News" },
      { name: "FAOSTAT — Country Data", url: "https://www.fao.org/faostat/en/#data", desc: "FAO production, trade, prices for every country since 1961", badge: "Database" },
    ],
  },
  {
    region: "🌾 Crop-Specific Global Prices",
    links: [
      { name: "Rice — IRRI Global Market", url: "https://www.irri.org/news-and-events/news/rice-price-watch", desc: "International Rice Research Institute — global rice prices", badge: "Rice" },
      { name: "Wheat — IGC Price Report", url: "https://www.igc.int/en/gmr/gmrsummary.aspx", desc: "International Grains Council — wheat & grain prices", badge: "Grains" },
      { name: "Palm Oil — MPOC Global", url: "https://bepi.mpob.gov.my/index.php/en/", desc: "Global palm oil prices — Malaysia reference benchmark", badge: "Palm Oil" },
      { name: "Rubber — ANRPC Prices", url: "https://www.anrpc.org/html/market-data.aspx", desc: "Association of Natural Rubber Producing Countries prices", badge: "Rubber" },
      { name: "Coffee — ICO Prices", url: "https://ico.org/prices/new-consumption-table.pdf", desc: "International Coffee Organization — global coffee prices", badge: "Coffee" },
      { name: "Cocoa — ICCO Prices", url: "https://www.icco.org/statistics/", desc: "International Cocoa Organization — global cocoa prices", badge: "Cocoa" },
      { name: "Sugar — ISO Prices", url: "https://www.isosugar.org/sugarsector/sugar", desc: "International Sugar Organization — global sugar prices", badge: "Sugar" },
      { name: "Spices — IPC Global", url: "https://www.ipcnet.org/market-reports/", desc: "International Pepper Community — pepper & spice prices", badge: "Spices" },
    ],
  },
  {
    region: "🗺️ Regional Market Data",
    links: [
      { name: "ASEAN Agricultural Markets", url: "https://asean.org/our-communities/asean-economic-community/agriculture-natural-resources/", desc: "10 ASEAN countries agriculture prices & trade", badge: "ASEAN" },
      { name: "EU — AGRI Market Dashboard", url: "https://agridata.ec.europa.eu/extensions/DashboardCereals/CerealsDashboard.html", desc: "European Union agricultural market prices & outlook", badge: "EU" },
      { name: "Africa — AMIS Prices", url: "http://www.amis-outlook.org/amis-monitoring/food-price-monitoring/en/", desc: "Agricultural Market Information System — Africa food prices", badge: "Africa" },
      { name: "India — Agmarknet", url: "https://agmarknet.gov.in/", desc: "India daily mandi prices for 300+ crops across all states", badge: "India" },
      { name: "China — MARA Prices", url: "https://www.moa.gov.cn/", desc: "China Ministry of Agriculture — crop price monitoring", badge: "China" },
      { name: "Brazil — CEPEA Prices", url: "https://www.cepea.esalq.usp.br/en/", desc: "Brazil agricultural commodity prices — sugar, coffee, soy, corn", badge: "Brazil" },
      { name: "USA — USDA AMS Prices", url: "https://www.ams.usda.gov/market-news/fruits-vegetables", desc: "USDA Agricultural Marketing Service — USA produce prices", badge: "USA" },
      { name: "Australia — ABARES", url: "https://www.agriculture.gov.au/abares/research-topics/agricultural-outlook", desc: "Australian Bureau of Agricultural & Resource Economics", badge: "Australia" },
    ],
  },
  {
    region: "💰 Farm Finance & Subsidies (Global)",
    links: [
      { name: "World Bank — AgriFinance", url: "https://www.worldbank.org/en/topic/agriculture/brief/agricultural-finance", desc: "Agricultural financing programs for developing countries", badge: "World Bank" },
      { name: "IFAD — Farm Loans", url: "https://www.ifad.org/", desc: "International Fund for Agricultural Development — global farm funding", badge: "UN Fund" },
      { name: "FAO — Subsidy Database", url: "https://www.fao.org/investment-in-agriculture/en/", desc: "Government subsidy schemes by country from FAO", badge: "Subsidies" },
      { name: "Open Data — Farm Subsidies", url: "https://farmsubsidy.org/", desc: "EU & global farm subsidy transparency database", badge: "Transparency" },
    ],
  },
  {
    region: "🇲🇾 Malaysia Local Prices",
    links: [
      { name: "FAMA — Harga Komoditi", url: "https://www.fama.gov.my/web/guest/harga-pasaran", desc: "Official vegetable & fruit prices, updated daily", badge: "Official" },
      { name: "MPOC — Palm Oil (RM)", url: "https://bepi.mpob.gov.my/index.php/en/", desc: "CPO & palm oil prices in RM", badge: "Live" },
      { name: "MRB — Rubber Price (RM)", url: "https://www.mrb.com.my/market-information/rubber-price", desc: "Daily SMR rubber prices in RM/kg", badge: "Live" },
      { name: "DOA Malaysia — Subsidies", url: "https://www.doa.gov.my/index.php/subsidi-dan-bantuan", desc: "Government subsidies for Malaysian farmers", badge: "Subsidy" },
      { name: "FELDA — Schemes", url: "https://www.felda.net.my/", desc: "FELDA settlement & smallholder programs", badge: "FELDA" },
    ],
  },
];

function MarketPricesTab() {
  const [search, setSearch] = useState("");
  const filtered = GLOBAL_MARKETS.map(r => ({
    ...r,
    links: r.links.filter(l => !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.desc.toLowerCase().includes(search.toLowerCase())),
  })).filter(r => r.links.length > 0);

  return (
    <div className="space-y-5">
      <div className="glass rounded-xl p-4 border border-border/50">
        <p className="text-sm text-muted-foreground mb-3">Global agricultural market prices — data from FAO, World Bank, USDA, and local agencies across 196 countries.</p>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search market or country..."
          className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>
      {filtered.map(region => (
        <div key={region.region}>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">{region.region}</p>
          <div className="space-y-2">
            {region.links.map(m => (
              <a key={m.name} href={m.url} target="_blank" rel="noopener noreferrer"
                className="glass rounded-xl p-4 border border-border/50 hover:border-emerald-500/40 transition flex items-center justify-between gap-3 group">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm group-hover:text-emerald-400 transition truncate">{m.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                  m.badge === "Live" || m.badge === "Live News" ? "bg-green-500/20 text-green-400" :
                  m.badge.includes("Official") || m.badge.includes("UN") ? "bg-blue-500/20 text-blue-400" :
                  m.badge === "Futures" ? "bg-purple-500/20 text-purple-400" :
                  m.badge === "Subsidy" || m.badge === "Subsidies" ? "bg-amber-500/20 text-amber-400" :
                  "bg-zinc-500/20 text-zinc-400"
                }`}>{m.badge}</span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Needed icons not in original import
function TrendingUpIcon({ className }: { className?: string }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>; }
function Plus({ className }: { className?: string }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function Trash2Icon({ className }: { className?: string }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>; }

// ── Main Page ──────────────────────────────────────────────────────────────────
const TABS = [
  { id: "plan",        label: "Farm Plan",     icon: "🌾" },
  { id: "disease",     label: "Disease Scan",  icon: "🔬" },
  { id: "care",        label: "Care Guide",    icon: "📅" },
  { id: "companion",   label: "Companions",    icon: "🌿" },
  { id: "hydro",       label: "Hydroponics",   icon: "💧" },
  { id: "calendar",    label: "Calendar",      icon: "🗓️" },
  { id: "soil",        label: "Soil Analysis", icon: "🧪" },
  { id: "fertilizer",  label: "Fertilizer Calc", icon: "🧪" },
  { id: "yield",       label: "Yield Estimator", icon: "📊" },
  { id: "pest",        label: "Pest Guide",    icon: "🐛" },
  { id: "growthlog",   label: "Growth Log",    icon: "📝" },
  { id: "prices",      label: "Market Prices", icon: "💹" },
  { id: "marketplace", label: "Buy Supplies",  icon: "🛒" },
];

export default function FarmAssistant() {
  const [activeTab, setActiveTab] = useState("plan");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Farm Assistant</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/finance">
              <Button type="button" variant="outline" size="sm" className="border-border/50 hidden sm:flex">
                <DollarSign className="w-4 h-4 mr-1" />Finance
              </Button>
            </Link>
            <Link href="/"><Button type="button" variant="ghost" size="sm">Back</Button></Link>
          </div>
        </div>
      </div>

      <div className="sticky top-16 z-30 glass border-b border-border">
        <div className="container overflow-x-auto">
          <div className="flex gap-1 py-2 min-w-max">
            {TABS.map(tab => (
              <button type="button" key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id ? "bg-emerald-500 text-white" : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-6 max-w-3xl space-y-5">
        <WeatherWidget />
        {activeTab === "plan"        && <FarmPlanTab />}
        {activeTab === "disease"     && <DiseaseScanTab />}
        {activeTab === "care"        && <CareScheduleTab />}
        {activeTab === "companion"   && <CompanionTab />}
        {activeTab === "hydro"       && <HydroponicsTab />}
        {activeTab === "calendar"    && <CalendarTab />}
        {activeTab === "soil"        && <SoilTab />}
        {activeTab === "fertilizer"  && <FertilizerCalcTab />}
        {activeTab === "yield"       && <YieldTab />}
        {activeTab === "pest"        && <PestGuideTab />}
        {activeTab === "growthlog"   && <GrowthLogTab />}
        {activeTab === "prices"      && <MarketPricesTab />}
        {activeTab === "marketplace" && <MarketplaceTab />}
      </div>
    </div>
  );
}
