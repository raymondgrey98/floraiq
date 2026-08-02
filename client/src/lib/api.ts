/**
 * FloraIQ API layer — makes the app work as a REAL APP with no localhost.
 *
 * Web (dev/prod server present): calls the Express backend at /api/*.
 * Android/iOS (installed app): there is no backend on the phone, so we call
 *   the AI + biodiversity APIs DIRECTLY from the device.
 *
 * Optional: set VITE_API_URL to a deployed backend to use it everywhere.
 */
import { Capacitor } from "@capacitor/core";

export const IS_NATIVE = Capacitor.isNativePlatform();

/** A deployed backend, if you have one (e.g. https://api.floraiq.app). */
const REMOTE_API = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

/** True when we must do everything on-device (installed app, no backend). */
export const STANDALONE = IS_NATIVE && !REMOTE_API;

/** Build a URL for a backend route. */
export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return REMOTE_API ? `${REMOTE_API}${p}` : p;
}

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(",")[1] ?? "");
    r.onerror = rej;
    r.readAsDataURL(blob);
  });
}

const IDENTIFY_PROMPT = `You are FloraIQ, an expert field biologist. Identify the organism in this photo.
Respond with ONLY valid JSON (no markdown fences) in exactly this shape:
{
 "scientificName": "Genus species",
 "commonNames": {"en": "Common name"},
 "confidence": 0.0-1.0,
 "description": "2-3 sentence description",
 "characteristics": ["trait", "trait", "trait"],
 "careInstructions": {"watering":"...","sunlight":"...","soil":"...","temperature":"...","fertilizer":"...","humidity":"..."},
 "habitat": "where it grows/lives globally",
 "riskLevel": "safe" | "caution" | "dangerous",
 "imageAnalysis": {"leafShape":"...","color":"...","texture":"...","estimatedHeight":"..."},
 "disease": "none visible" or the disease seen,
 "fertilizer": "recommendation",
 "soilAdvice": "recommendation"
}
If you cannot identify it, set scientificName to "Unknown species" and confidence to 0.2.`;

/** Identify directly against Gemini from the device (no backend). */
async function identifyOnDevice(image: Blob, scanMode: string): Promise<any> {
  if (!GEMINI_KEY) throw new Error("No AI key configured in this build");
  const b64 = await blobToBase64(image);

  let lastErr = "";
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              role: "user",
              parts: [
                { text: `${IDENTIFY_PROMPT}\n\nScan mode: ${scanMode}` },
                { inline_data: { mime_type: "image/jpeg", data: b64 } },
              ],
            }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 1400, responseMimeType: "application/json" },
          }),
          signal: AbortSignal.timeout(35_000),
        },
      );
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (res.ok && text) {
        const clean = String(text).replace(/^```json\s*|\s*```$/g, "").trim();
        const parsed = JSON.parse(clean);
        // Enrich with GBIF taxonomy, best-effort
        try {
          if (parsed.scientificName && parsed.scientificName !== "Unknown species") {
            const g = await fetch(
              `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(parsed.scientificName)}`,
              { signal: AbortSignal.timeout(6000) },
            ).then(r => r.json());
            if (g?.matchType !== "NONE") {
              parsed.gbif = { usageKey: g.usageKey, kingdom: g.kingdom, family: g.family, status: g.status };
            }
          }
        } catch { /* enrichment optional */ }
        return parsed;
      }
      lastErr = data?.error?.message || `${model} HTTP ${res.status}`;
    } catch (e: any) {
      lastErr = e?.message || "network error";
    }
  }
  throw new Error(lastErr || "Identification failed");
}

/** Identify an organism — backend when available, on-device when installed. */
export async function identify(
  image: Blob,
  opts: { scanMode?: string; lat?: number; lng?: number; signal?: AbortSignal } = {},
): Promise<any> {
  const scanMode = opts.scanMode ?? "plant";

  if (STANDALONE) return identifyOnDevice(image, scanMode);

  const fd = new FormData();
  fd.append("image", image, "capture.jpg");
  fd.append("context", `Scan mode: ${scanMode}`);
  if (opts.lat != null && opts.lng != null) {
    fd.append("location", JSON.stringify({ latitude: opts.lat, longitude: opts.lng }));
  }
  const res = await fetch(apiUrl("/api/identify?lang=en"), {
    method: "POST",
    body: fd,
    signal: opts.signal ?? AbortSignal.timeout(35_000),
  });
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  return res.json();
}

/** iNaturalist Computer Vision — top candidate matches. Works on-device too. */
export async function identifyCandidates(image: Blob): Promise<any> {
  if (STANDALONE) {
    const fd = new FormData();
    fd.append("image", image, "scan.jpg");
    const r = await fetch("https://api.inaturalist.org/v1/computervision/score_image", {
      method: "POST",
      body: fd,
      signal: AbortSignal.timeout(20_000),
    });
    if (!r.ok) throw new Error(`iNat HTTP ${r.status}`);
    const data = await r.json();
    return {
      results: (data.results ?? []).slice(0, 5).map((x: any) => ({
        score: x.combined_score ?? x.vision_score ?? 0,
        taxon: {
          id: x.taxon?.id,
          name: x.taxon?.name,
          commonName: x.taxon?.preferred_common_name,
          photoUrl: x.taxon?.default_photo?.medium_url || x.taxon?.default_photo?.square_url,
          wikipediaUrl: x.taxon?.wikipedia_url,
        },
      })),
    };
  }

  const fd = new FormData();
  fd.append("image", image, "scan.jpg");
  const res = await fetch(apiUrl("/api/identify/inat"), {
    method: "POST",
    body: fd,
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** AI chat — backend session memory when available, direct Gemini on-device. */
export async function chat(message: string, sessionId = "new"): Promise<{ reply: string; sessionId?: string }> {
  if (!STANDALONE) {
    const res = await fetch(apiUrl("/api/chat"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId }),
      signal: AbortSignal.timeout(30_000),
    });
    if (res.ok) return res.json();
  }
  if (!GEMINI_KEY) throw new Error("No AI key configured");
  for (const model of GEMINI_MODELS) {
    try {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: message }] }],
            generationConfig: { temperature: 0.6, maxOutputTokens: 1200 },
          }),
          signal: AbortSignal.timeout(25_000),
        },
      );
      const d = await r.json();
      const text = d?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (r.ok && text) return { reply: text };
    } catch { /* try next model */ }
  }
  throw new Error("All AI models failed");
}
