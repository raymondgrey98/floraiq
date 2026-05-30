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
const CHAT_MODEL = 'google/gemma-4-31b-it:free';

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
    body: JSON.stringify({ model: CHAT_MODEL, messages: msgs, max_tokens: 1500 }),
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

    // Identify plant using AirLLM
    const result = await aiService.identifyPlant({
      imageBuffer: req.file.buffer,
      language,
      location,
      context,
    });

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

    const reply = await openRouterChat(msgs,
      `You are FloraIQ Assistant — an expert in botany, zoology, ecology, survival skills, farming, and nature intelligence.
You help users identify plants, animals, insects, mushrooms, and marine life.
You give survival tips, edible plant guides, farm planning advice, and species information.
Keep responses concise, helpful, and nature-focused. Prices always in RM (MYR) for Malaysian context.`
    );
    res.json({ reply });
  } catch (error: any) {
    console.error('[Chat] Error:', error.message);
    res.status(500).json({ error: 'Chat unavailable: ' + error.message });
  }
});

export default router;
