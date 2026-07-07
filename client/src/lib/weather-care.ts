// Weather-aware plant care — connects Open-Meteo (free, no key) to the Water Tracker.
// Cached in localStorage for 3 hours so advice still shows offline.

export interface WeatherCare {
  fetchedAt: number;
  locationLabel: string;
  todayMaxC: number;
  todayRainMm: number;
  tomorrowRainMm: number;
  tomorrowRainProb: number; // 0–100
  condition: string;
  /** Rain coming → outdoor plants can skip today's watering */
  rainExpected: boolean;
  /** ≥35°C today → water more, water early */
  heatwave: boolean;
  /** ≤2°C overnight → frost protection */
  frostRisk: boolean;
  advice: string[];
}

const CACHE_KEY = "floraiq_weather_care";
const CACHE_TTL_MS = 3 * 60 * 60 * 1000; // 3 hours

function conditionLabel(code: number): string {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 49) return "Foggy";
  if (code <= 59) return "Drizzle";
  if (code <= 69) return "Rain";
  if (code <= 79) return "Snow";
  if (code <= 82) return "Rain showers";
  if (code <= 84) return "Snow showers";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
}

function buildAdvice(w: Omit<WeatherCare, "advice">): string[] {
  const advice: string[] = [];
  if (w.rainExpected) {
    advice.push(
      `Rain expected tomorrow (${w.tomorrowRainMm.toFixed(1)}mm, ${w.tomorrowRainProb}% chance) — outdoor plants can skip today's watering.`
    );
  }
  if (w.todayRainMm >= 5) {
    advice.push(`It already rained ${w.todayRainMm.toFixed(1)}mm today — check soil before watering outdoor plants.`);
  }
  if (w.heatwave) {
    advice.push(`Heat alert: ${Math.round(w.todayMaxC)}°C today — water extra, before 8 AM, and shade young plants.`);
  }
  if (w.frostRisk) {
    advice.push("Frost risk tonight — move sensitive pots indoors and skip evening watering.");
  }
  if (advice.length === 0) {
    advice.push(`${w.condition}, ${Math.round(w.todayMaxC)}°C — normal watering schedule applies.`);
  }
  return advice;
}

/** Last cached forecast — used when geolocation is denied or device is offline. */
export function getCachedWeatherCare(): WeatherCare | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw) as WeatherCare;
  } catch {}
  return null;
}

export async function getWeatherCare(lat: number, lon: number): Promise<WeatherCare | null> {
  // Serve from cache when fresh (also the offline path)
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const cached = JSON.parse(raw) as WeatherCare;
      if (Date.now() - cached.fetchedAt < CACHE_TTL_MS) return cached;
    }
  } catch {}

  try {
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}` +
      "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weathercode" +
      "&timezone=auto&forecast_days=2";

    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
    const data = (await res.json()) as any;
    const d = data.daily;

    const todayMaxC = d.temperature_2m_max[0] ?? 0;
    const todayMinC = d.temperature_2m_min[0] ?? 0;
    const todayRainMm = d.precipitation_sum[0] ?? 0;
    const tomorrowRainMm = d.precipitation_sum[1] ?? 0;
    const tomorrowRainProb = d.precipitation_probability_max?.[1] ?? 0;

    const base = {
      fetchedAt: Date.now(),
      locationLabel: data.timezone || "",
      todayMaxC,
      todayRainMm,
      tomorrowRainMm,
      tomorrowRainProb,
      condition: conditionLabel(d.weathercode?.[0] ?? -1),
      rainExpected: tomorrowRainMm >= 5 && tomorrowRainProb >= 50,
      heatwave: todayMaxC >= 35,
      frostRisk: todayMinC <= 2,
    };

    const result: WeatherCare = { ...base, advice: buildAdvice(base) };
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(result));
    } catch {}
    return result;
  } catch {
    // Offline / API down → fall back to stale cache if any
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) return JSON.parse(raw) as WeatherCare;
    } catch {}
    return null;
  }
}

/** Get device position once, low accuracy is fine for weather. */
export function getPosition(): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 30 * 60 * 1000 }
    );
  });
}
