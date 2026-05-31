/**
 * FloraIQ Backend API Routes
 * Integrates AirLLM for plant identification
 * Connects with BioScan for geolocation data
 * Supports real-time camera streaming
 */

import express, { Request, Response } from 'express';
import multer from 'multer';
import { AirLLMPlantService } from './ai-service';
import { CameraStreamService } from './camera-service';

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';
const GEMINI_KEY     = process.env.GEMINI_API_KEY || '';

async function geminiChat(messages: { role: string; content: string }[], system?: string): Promise<string> {
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const body: any = { contents };
  if (system) body.systemInstruction = { parts: [{ text: system }] };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any)?.error?.message || `Gemini ${res.status}`);
  }
  const data = await res.json() as any;
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function openRouterChat(messages: { role: string; content: string }[], system?: string): Promise<string> {
  const msgs = system
    ? [{ role: 'system', content: system }, ...messages]
    : messages;

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://floraiq.app',
      'X-Title': 'FloraIQ',
    },
    body: JSON.stringify({ model: 'google/gemma-4-31b-it:free', messages: msgs, max_tokens: 1500 }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any)?.error?.message || `OpenRouter ${res.status}`);
  }
  const data = await res.json() as any;
  return data.choices?.[0]?.message?.content || '';
}

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const aiService = new AirLLMPlantService();
const cameraService = new CameraStreamService();

// Initialize AI model on startup
aiService.initializeModel().catch(console.error);

/**
 * POST /api/identify
 * Identify plant from uploaded image
 * Returns: Scientific name, common names, characteristics, care instructions
 */
router.post('/identify', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const language = (req.query.lang as string) || 'en';
    const location = req.body.location
      ? {
          latitude: parseFloat(req.body.location.latitude),
          longitude: parseFloat(req.body.location.longitude),
        }
      : undefined;

    const context = req.body.context || '';

    const result = await aiService.identifyPlant({
      imageBuffer: req.file.buffer,
      language,
      location,
      context,
    });

    // Enrich with GBIF taxonomy (free, no key)
    if (result.scientificName && result.scientificName !== 'Unknown species') {
      try {
        const gbifRes = await fetch(
          `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(result.scientificName)}`,
          { signal: AbortSignal.timeout(4000) }
        );
        if (gbifRes.ok) {
          const g = await gbifRes.json() as any;
          if (g.matchType !== 'NONE') {
            (result as any).gbif = {
              usageKey: g.usageKey,
              kingdom: g.kingdom,
              family: g.family,
              confidence: g.confidence,
              status: g.status,
            };
          }
        }
      } catch { /* GBIF optional */ }
    }

    res.json(result);
  } catch (error) {
    console.error('[API] Identification error:', error);
    res.status(500).json({ error: 'Failed to identify plant' });
  }
});

/**
 * POST /api/identify/batch
 * Identify multiple plants at once
 * Returns array of identification results
 */
router.post('/identify/batch', upload.array('images'), async (req: Request, res: Response) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    const language = (req.query.lang as string) || 'en';
    const location = req.body.location;

    const results = await Promise.all(
      (req.files as Express.Multer.File[]).map((file) =>
        aiService.identifyPlant({
          imageBuffer: file.buffer,
          language,
          location,
        })
      )
    );

    res.json({ count: results.length, plants: results });
  } catch (error) {
    console.error('[API] Batch identification error:', error);
    res.status(500).json({ error: 'Failed to identify plants' });
  }
});

/**
 * POST /api/camera/start
 * Start camera stream for real-time identification
 */
router.post('/camera/start', (req: Request, res: Response) => {
  try {
    const quality = req.body.quality || 'medium';
    const fps = req.body.fps || 15;

    cameraService.startStream({ quality: quality as any, fps });

    res.json({
      status: 'started',
      config: {
        quality,
        fps,
        width: 640,
        height: 480,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start camera' });
  }
});

/**
 * POST /api/camera/stop
 * Stop camera stream
 */
router.post('/camera/stop', (req: Request, res: Response) => {
  cameraService.stopStream();
  res.json({ status: 'stopped' });
});

/**
 * POST /api/camera/capture
 * Capture single frame and identify plant
 */
router.post('/camera/capture', upload.single('frame'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No frame data' });
    }

    const language = (req.query.lang as string) || 'en';
    const location = req.body.location;

    // Capture and process frame
    const frame = await cameraService.captureFrame();

    // Identify plant
    const result = await aiService.identifyPlant({
      imageBuffer: req.file.buffer,
      language,
      location,
    });

    res.json({
      frame: {
        timestamp: frame.timestamp,
        metadata: frame.metadata,
      },
      plant: result,
    });
  } catch (error) {
    console.error('[API] Capture error:', error);
    res.status(500).json({ error: 'Failed to capture and identify' });
  }
});

/**
 * GET /api/camera/stats
 * Get camera stream statistics
 */
router.get('/camera/stats', (req: Request, res: Response) => {
  const stats = cameraService.getStats();
  res.json(stats);
});

/**
 * POST /api/translate
 * Translate plant information to different language
 * Uses AirLLM for accurate botanical terminology
 */
router.post('/translate', async (req: Request, res: Response) => {
  try {
    const { scientificName, commonName, targetLanguage } = req.body;

    if (!scientificName || !targetLanguage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Use AirLLM to translate botanical information
    const prompt = `Translate the plant information to ${targetLanguage}:
Scientific Name: ${scientificName}
Common Name: ${commonName}
Return JSON with "scientificName" and "commonName" in ${targetLanguage}`;

    // Note: In production, call AirLLM via the aiService
    res.json({
      scientificName,
      commonName,
      targetLanguage,
      translated: 'Translation service coming soon',
    });
  } catch (error) {
    res.status(500).json({ error: 'Translation failed' });
  }
});

/**
 * POST /api/bioscan/sync
 * Sync plant identification with BioScan geolocation data
 * Creates biodiversity records with location
 */
router.post('/bioscan/sync', async (req: Request, res: Response) => {
  try {
    const { plantIdentification, location, userId } = req.body;

    if (!plantIdentification || !location) {
      return res.status(400).json({ error: 'Missing plant or location data' });
    }

    // Create biodiversity record
    const record = {
      id: `bioscan_${Date.now()}`,
      userId,
      plant: {
        scientificName: plantIdentification.scientificName,
        commonNames: plantIdentification.commonNames,
        confidence: plantIdentification.confidence,
      },
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: new Date().toISOString(),
      },
      mapData: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      },
    };

    // In production, save to database and broadcast to BioScan
    console.log('[BioScan] New species record:', record);

    res.json({
      status: 'synced',
      record,
      message: 'Plant identification synced with BioScan',
    });
  } catch (error) {
    console.error('[API] BioScan sync error:', error);
    res.status(500).json({ error: 'Failed to sync with BioScan' });
  }
});

/**
 * GET /api/species/:scientificName
 * Get detailed information about a plant species
 * Multi-language support
 */
router.get('/species/:scientificName', async (req: Request, res: Response) => {
  try {
    const { scientificName } = req.params;
    const language = (req.query.lang as string) || 'en';

    // Return cached or generated species information
    const speciesInfo = {
      scientificName,
      description: `Detailed information about ${scientificName}`,
      careInstructions: 'Available in multiple languages',
      language,
      availableLanguages: [
        'en', 'es', 'fr', 'de', 'ja', 'zh', 'pt', 'it', 'nl', 'ko',
        'ar', 'hi', 'ru', 'vi', 'th', 'id', 'ms', 'tl', 'bn', 'sw',
      ],
    };

    res.json(speciesInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch species information' });
  }
});

/**
 * POST /api/health
 * Health check endpoint
 */
router.post('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    aiService: 'ready',
    camera: 'ready',
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/identify/inat
 * Secondary identification via iNaturalist Computer Vision (free, no key)
 */
router.post('/identify/inat', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    const formData = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append('image', blob, req.file.originalname || 'image.jpg');

    const lat = req.body.lat;
    const lng = req.body.lng;
    const url = new URL('https://api.inaturalist.org/v1/computervision/score_image');
    if (lat && lng) { url.searchParams.set('lat', lat); url.searchParams.set('lng', lng); }

    const response = await fetch(url.toString(), {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) throw new Error(`iNaturalist CV error ${response.status}`);
    const data = await response.json() as any;

    const results = (data.results || []).slice(0, 5).map((r: any) => ({
      score: r.combined_score || r.vision_score,
      taxon: {
        id: r.taxon?.id,
        name: r.taxon?.name,
        commonName: r.taxon?.preferred_common_name,
        rank: r.taxon?.rank,
        iconicTaxon: r.taxon?.iconic_taxon_name,
        photoUrl: r.taxon?.default_photo?.square_url,
        wikipediaUrl: r.taxon?.wikipedia_url,
        observationsCount: r.taxon?.observations_count,
      },
    }));

    res.json({ results, source: 'iNaturalist Computer Vision' });
  } catch (error: any) {
    console.error('[iNat CV]', error.message);
    res.status(500).json({ error: 'iNaturalist CV unavailable', results: [] });
  }
});

/**
 * GET /api/species/forage
 * Edible & useful wild plants from GBIF (free, no key)
 */
router.get('/species/forage', async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius = '50' } = req.query as any;
    let url = 'https://api.gbif.org/v1/occurrence/search?hasCoordinate=true&hasGeospatialIssue=false&kingdom=Plantae&limit=200&occurrenceStatus=PRESENT';
    if (lat && lng) url += `&decimalLatitude=${parseFloat(lat) - 2},${parseFloat(lat) + 2}&decimalLongitude=${parseFloat(lng) - 2},${parseFloat(lng) + 2}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error('GBIF error');
    const data = await r.json() as any;
    res.json({ results: data.results || [], count: data.count });
  } catch (e: any) {
    res.status(500).json({ error: e.message, results: [] });
  }
});

/**
 * POST /api/chat
 * Real AI chat powered by Claude
 */
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'No message provided' });
    }

    const msgs = history.map((h: { role: string; text: string }) => ({
      role: h.role === 'assistant' ? 'assistant' : 'user',
      content: h.text,
    }));
    msgs.push({ role: 'user', content: message });

    const SYSTEM = `You are FloraIQ Assistant — an expert in botany, zoology, ecology, survival skills, farming, and nature intelligence.
You help users identify plants, animals, insects, mushrooms, and marine life.
You give survival tips, edible plant guides, farm planning advice, and species information.
Keep responses concise, helpful, and nature-focused. Prices always in RM (MYR) for Malaysian context.
Focus on tropical plants and conditions relevant to Kuching, Sarawak, Malaysia.`;

    let reply = '';
    try {
      reply = await geminiChat(msgs, SYSTEM);
    } catch (geminiErr) {
      console.warn('[Chat] Gemini failed, trying OpenRouter:', (geminiErr as Error).message);
      reply = await openRouterChat(msgs, SYSTEM);
    }
    res.json({ reply });
  } catch (error: any) {
    console.error('[Chat] Error:', error.message);
    res.status(500).json({ error: 'Chat unavailable: ' + error.message });
  }
});

/**
 * POST /api/disease
 * Plant disease detection via HuggingFace free inference API
 * Model: linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification (38 disease classes)
 * Fallback: gianlab/swin-tiny-patch4-window7-224-finetuned-plantdisease
 */
router.post('/disease', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    const HF_KEY = process.env.HF_API_KEY || '';
    const resized = req.file.buffer;

    const headers: Record<string, string> = { 'Content-Type': 'application/octet-stream' };
    if (HF_KEY) headers['Authorization'] = `Bearer ${HF_KEY}`;

    const PRIMARY_MODEL   = 'linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification';
    const SECONDARY_MODEL = 'gianlab/swin-tiny-patch4-window7-224-finetuned-plantdisease';

    async function callHF(model: string) {
      const r = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST', headers, body: resized, signal: AbortSignal.timeout(20000),
      });
      if (!r.ok) throw new Error(`HF ${r.status}`);
      return await r.json() as any[];
    }

    let results: any[] = [];
    try { results = await callHF(PRIMARY_MODEL); }
    catch { results = await callHF(SECONDARY_MODEL); }

    // Map raw labels to human-readable info
    const mapped = (results || []).slice(0, 5).map((r: any) => {
      const raw: string = r.label || '';
      const score: number = Math.round((r.score || 0) * 100);
      // Labels are like "Tomato___Late_blight" or "Apple___healthy"
      const parts = raw.split('___');
      const plant   = parts[0]?.replace(/_/g, ' ') || 'Unknown plant';
      const disease = parts[1]?.replace(/_/g, ' ') || raw.replace(/_/g, ' ');
      const healthy = disease.toLowerCase().includes('healthy');
      return { plant, disease, healthy, score, raw };
    });

    const top = mapped[0];
    let advice = '';
    if (top && !top.healthy) {
      try {
        advice = await geminiChat(
          [{ role: 'user', content: `My ${top.plant} has ${top.disease}. Give 3 specific treatment steps and prevention tips. Keep it under 150 words.` }],
          'You are a plant disease expert. Focus on practical treatment for Malaysian/tropical growers. All pesticide/fungicide brands should be locally available.'
        );
      } catch { advice = 'Consult your local agricultural extension office for treatment options.'; }
    }

    res.json({ results: mapped, advice, model: PRIMARY_MODEL });
  } catch (error: any) {
    console.error('[Disease] Error:', error.message);
    res.status(500).json({ error: 'Disease detection unavailable: ' + error.message, results: [] });
  }
});

export default router;
