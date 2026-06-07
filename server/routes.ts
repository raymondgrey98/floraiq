import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import { AirLLMPlantService } from "./ai-service";
import {
  geminiService,
  GeminiServiceError,
  SessionNotFoundError,
} from "./services/gemini.service";
import {
  diseaseService,
  DiseaseServiceError,
  InvalidPayloadError,
} from "./services/disease.service";

// ── Infrastructure ────────────────────────────────────────────────────────────

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

const aiService = new AirLLMPlantService();
aiService.initializeModel().catch(console.error);

// Server-side Supabase client (service role — never sent to browser)
const supabaseAdmin = (() => {
  const url    = process.env.SUPABASE_URL       || process.env.VITE_SUPABASE_URL || "";
  const secret = process.env.SUPABASE_SECRET_KEY || "";
  if (!url || !secret) return null;
  return createClient(url, secret);
})();

// ── Utility ───────────────────────────────────────────────────────────────────

// Verifies the Supabase JWT server-side via getUser() — never trusts the raw payload.
// Falls back gracefully to null if Supabase admin client is not configured.
async function extractUserId(req: Request): Promise<string | null> {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  if (!supabaseAdmin) return null;
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(auth.slice(7));
    if (error || !data?.user) return null;
    return data.user.id;
  } catch {
    return null;
  }
}

// ── POST /api/identify ────────────────────────────────────────────────────────
// Identify plant/organism from uploaded image via OpenRouter vision model

router.post("/identify", upload.single("image"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No image file provided in the request body" });
      return;
    }

    const language = (req.query.lang as string) || "en";
    const context  = req.body.context || "";

    let location: { latitude: number; longitude: number } | undefined;
    if (req.body.location) {
      try {
        location = JSON.parse(req.body.location);
      } catch {
        // malformed location string — proceed without it
      }
    }

    const result = await aiService.identifyPlant({
      imageBuffer: req.file.buffer,
      language,
      context,
      location,
    });

    // Enrich with GBIF taxonomy (non-blocking)
    if (result.scientificName && result.scientificName !== "Unknown species") {
      fetch(
        `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(result.scientificName)}`,
        { signal: AbortSignal.timeout(4000) },
      )
        .then(r => r.json())
        .then((g: any) => {
          if (g.matchType !== "NONE") {
            (result as any).gbif = {
              usageKey: g.usageKey,
              kingdom:  g.kingdom,
              family:   g.family,
              confidence: g.confidence,
              status:   g.status,
            };
          }
        })
        .catch(() => {}); // GBIF enrichment is optional
    }

    // Persist observation to Supabase (non-blocking)
    const userId = await extractUserId(req);
    if (supabaseAdmin) {
      supabaseAdmin.from("observations").insert({
        user_id:        userId,
        scientific_name: result.scientificName,
        common_name:    result.commonNames?.en ?? null,
        scan_mode:      context.includes("mode:") ? context.split("mode:")[1]?.trim() : "plant",
        confidence:     Math.round((result.confidence ?? 0) * 100),
        risk_level:     result.riskLevel ?? "safe",
        latitude:       location?.latitude ?? null,
        longitude:      location?.longitude ?? null,
        raw_result:     result,
      }).then(({ error }) => {
        if (error) console.error("[routes] observation persist failed:", error.message);
      });
    }

    res.json(result);
  } catch (err: any) {
    console.error("[POST /identify]", err.message);
    res.status(500).json({ error: "Identification failed", details: err.message });
  }
});

// ── POST /api/identify/inat ───────────────────────────────────────────────────
// Secondary identification via iNaturalist Computer Vision (free, no key)

router.post("/identify/inat", upload.single("image"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No image file provided" });
      return;
    }

    const form = new FormData();
    form.append(
      "image",
      new Blob([req.file.buffer], { type: req.file.mimetype }),
      req.file.originalname || "image.jpg",
    );

    const url = new URL("https://api.inaturalist.org/v1/computervision/score_image");
    const lat  = req.body.lat as string | undefined;
    const lng  = req.body.lng as string | undefined;
    if (lat && lng) { url.searchParams.set("lat", lat); url.searchParams.set("lng", lng); }

    const response = await fetch(url.toString(), {
      method: "POST",
      body:   form,
      signal: AbortSignal.timeout(18_000),
    });

    if (!response.ok) {
      throw new Error(`iNaturalist CV returned HTTP ${response.status}`);
    }

    const data = await response.json() as any;
    const results = (data.results ?? []).slice(0, 5).map((r: any) => ({
      score:  r.combined_score ?? r.vision_score ?? 0,
      taxon: {
        id:              r.taxon?.id,
        name:            r.taxon?.name,
        commonName:      r.taxon?.preferred_common_name,
        rank:            r.taxon?.rank,
        iconicTaxon:     r.taxon?.iconic_taxon_name,
        photoUrl:        r.taxon?.default_photo?.square_url,
        wikipediaUrl:    r.taxon?.wikipedia_url,
        observationsCount: r.taxon?.observations_count,
      },
    }));

    res.json({ results, source: "iNaturalist Computer Vision" });
  } catch (err: any) {
    console.error("[POST /identify/inat]", err.message);
    res.status(500).json({ error: "iNaturalist CV unavailable", results: [] });
  }
});

// ── POST /api/chat ────────────────────────────────────────────────────────────
// Session-persistent AI chat via GeminiService (DB-backed history)

router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { message, sessionId = "new" } = req.body as {
      message?: string;
      sessionId?: string;
    };

    if (!message || typeof message !== "string" || message.trim() === "") {
      res.status(400).json({ error: "message field is required and must be a non-empty string" });
      return;
    }

    const userId = await extractUserId(req);

    const result = await geminiService.chat({
      sessionId,
      userId,
      message: message.trim(),
    });

    res.json(result); // { reply: string, sessionId: string }
  } catch (err) {
    if (err instanceof SessionNotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    if (err instanceof GeminiServiceError) {
      res.status(err.statusCode).json({ error: err.message, upstream: err.upstream });
      return;
    }
    console.error("[POST /chat]", (err as Error).message);
    res.status(500).json({ error: "Chat service unavailable" });
  }
});

// ── GET /api/chat/sessions ────────────────────────────────────────────────────
// List all chat sessions for the authenticated user

router.get("/chat/sessions", async (req: Request, res: Response) => {
  const userId = await extractUserId(req);
  if (!userId) { res.status(401).json({ error: "Authentication required" }); return; }
  if (!supabaseAdmin) { res.json({ sessions: [] }); return; }

  const { data, error } = await supabaseAdmin
    .from("chat_sessions")
    .select("id, title, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error) {
    res.status(500).json({ error: "Failed to fetch sessions", details: error.message });
    return;
  }

  res.json({ sessions: data ?? [] });
});

// ── GET /api/chat/sessions/:id/messages ──────────────────────────────────────
// Fetch all messages for a specific session

router.get("/chat/sessions/:id/messages", async (req: Request, res: Response) => {
  const userId    = await extractUserId(req);
  const sessionId = req.params.id;

  if (!supabaseAdmin) { res.json({ messages: [] }); return; }

  const { data, error } = await supabaseAdmin
    .from("chat_messages")
    .select("id, role, content, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    res.status(500).json({ error: "Failed to fetch messages", details: error.message });
    return;
  }

  res.json({ messages: data ?? [], sessionId });
});

// ── POST /api/disease ─────────────────────────────────────────────────────────
// Plant disease detection via DiseaseService → HuggingFace MobileNet

router.post("/disease", upload.single("image"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No image file provided" });
      return;
    }

    const result = await diseaseService.analyse(req.file.buffer);
    res.json(result);
  } catch (err) {
    if (err instanceof InvalidPayloadError) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (err instanceof DiseaseServiceError) {
      res.status(err.statusCode).json({ error: err.message, model: err.model });
      return;
    }
    console.error("[POST /disease]", (err as Error).message);
    res.status(500).json({ error: "Disease analysis unavailable" });
  }
});

// ── GET /api/species/forage ───────────────────────────────────────────────────
// Edible and medicinal wild plants from GBIF (free, no API key required)

router.get("/species/forage", async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.query as { lat?: string; lng?: string };

    let url = "https://api.gbif.org/v1/occurrence/search"
      + "?hasCoordinate=true&hasGeospatialIssue=false&kingdom=Plantae"
      + "&limit=200&occurrenceStatus=PRESENT";

    if (lat && lng) {
      const latF = parseFloat(lat);
      const lngF = parseFloat(lng);
      url += `&decimalLatitude=${latF - 2},${latF + 2}&decimalLongitude=${lngF - 2},${lngF + 2}`;
    }

    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!response.ok) throw new Error(`GBIF returned HTTP ${response.status}`);

    const data = await response.json() as any;
    res.json({ results: data.results ?? [], count: data.count ?? 0 });
  } catch (err: any) {
    console.error("[GET /species/forage]", err.message);
    res.status(500).json({ error: "GBIF data unavailable", results: [] });
  }
});

// ── POST /api/bioscan/sync ────────────────────────────────────────────────────
// Record a geolocated species observation from BioScan mobile

router.post("/bioscan/sync", async (req: Request, res: Response) => {
  try {
    const { plantIdentification, location } = req.body as {
      plantIdentification?: { scientificName: string; commonNames?: Record<string, string>; confidence?: number };
      location?: { latitude: number; longitude: number };
    };

    if (!plantIdentification?.scientificName) {
      res.status(400).json({ error: "plantIdentification.scientificName is required" });
      return;
    }
    if (!location?.latitude || !location?.longitude) {
      res.status(400).json({ error: "location.latitude and location.longitude are required" });
      return;
    }

    const userId = await extractUserId(req);
    const record = {
      id:         `bioscan_${Date.now()}`,
      userId,
      scientific: plantIdentification.scientificName,
      common:     plantIdentification.commonNames?.en ?? null,
      confidence: plantIdentification.confidence ?? null,
      latitude:   location.latitude,
      longitude:  location.longitude,
      syncedAt:   new Date().toISOString(),
    };

    if (supabaseAdmin) {
      await supabaseAdmin.from("observations").insert({
        user_id:        userId,
        scientific_name: record.scientific,
        common_name:    record.common,
        scan_mode:      "bioscan",
        confidence:     record.confidence ? Math.round(record.confidence * 100) : null,
        latitude:       record.latitude,
        longitude:      record.longitude,
      });
    }

    res.json({ status: "synced", record });
  } catch (err: any) {
    console.error("[POST /bioscan/sync]", err.message);
    res.status(500).json({ error: "BioScan sync failed", details: err.message });
  }
});

// ── Weather helpers (module-level — strict mode requires this) ────────────────

function weatherLabel(code: number): string {
  if (code === 0)  return "Clear sky";
  if (code <= 3)   return "Partly cloudy";
  if (code <= 49)  return "Foggy";
  if (code <= 59)  return "Drizzle";
  if (code <= 69)  return "Rain";
  if (code <= 79)  return "Snow";
  if (code <= 82)  return "Rain showers";
  if (code <= 84)  return "Snow showers";
  if (code <= 99)  return "Thunderstorm";
  return "Unknown";
}

function farmAdvice(maxC: number, rainMm: number, windKmh: number): string {
  if (maxC > 35)    return "Extreme heat — water at dawn, shade young seedlings";
  if (rainMm > 20)  return "Heavy rain — pause irrigation, monitor drainage";
  if (rainMm > 10)  return "Good moisture — reduce watering frequency";
  if (windKmh > 40) return "Strong winds — stake tall crops, delay foliar sprays";
  if (maxC < 10)    return "Cold conditions — protect frost-sensitive crops overnight";
  return "Conditions optimal — follow standard care schedule";
}

// ── GET /api/weather/forecast ─────────────────────────────────────────────────
// 7-day agronomic forecast via Open-Meteo (no API key required)

router.get("/weather/forecast", async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.query as { lat?: string; lon?: string };
    if (!lat || !lon) {
      res.status(400).json({ error: "lat and lon query parameters are required" });
      return;
    }

    const url = "https://api.open-meteo.com/v1/forecast"
      + `?latitude=${lat}&longitude=${lon}`
      + "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weathercode"
      + "&timezone=auto&forecast_days=7";

    const response = await fetch(url, { signal: AbortSignal.timeout(8_000) });
    if (!response.ok) throw new Error(`Open-Meteo returned HTTP ${response.status}`);

    const data = await response.json() as any;
    const d    = data.daily as {
      time: string[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      precipitation_sum: number[];
      windspeed_10m_max: number[];
      weathercode: number[];
    };

    const timeline = d.time.map((date, i) => ({
      date,
      maxTempC:        d.temperature_2m_max[i],
      minTempC:        d.temperature_2m_min[i],
      precipitationMm: d.precipitation_sum[i],
      windKmh:         d.windspeed_10m_max[i],
      condition:       weatherLabel(d.weathercode[i]),
      farmAdvice:      farmAdvice(d.temperature_2m_max[i], d.precipitation_sum[i], d.windspeed_10m_max[i]),
    }));

    res.json({
      meta:     { latitude: data.latitude, longitude: data.longitude, timezone: data.timezone },
      timeline,
    });
  } catch (err: any) {
    console.error("[GET /weather/forecast]", err.message);
    res.status(500).json({ error: "Weather forecast unavailable", details: err.message });
  }
});

// ── GET /api/health ───────────────────────────────────────────────────────────

router.get("/health", (_req: Request, res: Response) => {
  res.json({
    status:    "ok",
    services: {
      gemini:    !!process.env.GEMINI_API_KEY,
      openrouter: !!process.env.OPENROUTER_API_KEY,
      supabase:  !!supabaseAdmin,
      huggingface: !!process.env.HF_API_KEY,
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
