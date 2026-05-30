import sharp from 'sharp';

interface PlantIdentificationResult {
  scientificName: string;
  commonNames: Record<string, string>;
  confidence: number;
  description: string;
  characteristics: string[];
  careInstructions: Record<string, string>;
  habitat: string;
  riskLevel: 'safe' | 'caution' | 'dangerous';
  imageAnalysis: { leafShape: string; color: string; texture: string; estimatedHeight: string };
  disease?: string;
  fertilizer?: string;
  soilAdvice?: string;
}

interface IdentificationRequest {
  imageBuffer: Buffer;
  language?: string;
  location?: { latitude: number; longitude: number };
  context?: string;
}

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';
const VISION_MODEL = 'nvidia/nemotron-nano-12b-v2-vl:free';
const FALLBACK_MODEL = 'google/gemma-4-31b-it:free';

class AirLLMPlantService {
  modelLoaded = true;

  async initializeModel(): Promise<void> {
    console.log('[FloraIQ] OpenRouter Vision ready for organism identification');
  }

  async identifyPlant(request: IdentificationRequest): Promise<PlantIdentificationResult> {
    const { imageBuffer, language = 'en', location, context } = request;

    const resized = await sharp(imageBuffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    const base64Image = resized.toString('base64');

    let locationContext = '';
    if (location) locationContext = `\nPhoto taken at lat ${location.latitude}, lon ${location.longitude}.`;
    if (context) locationContext += `\nContext: ${context}`;

    const prompt = `You are an expert field naturalist and botanist. Identify the organism in this image.${locationContext}

Reply ONLY with valid JSON, no markdown:
{
  "scientificName": "Genus species",
  "commonNames": { "en": "Common name", "${language}": "Name in ${language}" },
  "confidence": 0.92,
  "description": "2-3 sentence description",
  "characteristics": ["feature 1", "feature 2", "feature 3", "feature 4"],
  "careInstructions": { "watering": "needs", "sunlight": "requirements", "soil": "type", "temperature": "range" },
  "habitat": "Where this organism lives",
  "riskLevel": "safe",
  "imageAnalysis": { "leafShape": "shape", "color": "colors", "texture": "texture", "estimatedHeight": "size" },
  "disease": "any visible disease or none visible",
  "fertilizer": "recommended fertilizer",
  "soilAdvice": "soil pH and watering"
}
riskLevel must be "safe", "caution", or "dangerous".`;

    // Try vision model first, fallback to text-only with description
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://floraiq.app',
          'X-Title': 'FloraIQ',
        },
        body: JSON.stringify({
          model: VISION_MODEL,
          max_tokens: 1200,
          messages: [{
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
              { type: 'text', text: prompt },
            ],
          }],
        }),
      });

      if (!res.ok) throw new Error(`Vision model ${res.status}`);
      const data = await res.json() as any;
      const text = data.choices?.[0]?.message?.content || '';
      return this.parseResult(text);
    } catch (err) {
      console.error('[Vision] Primary model failed, using fallback:', (err as Error).message);
      // Fallback: text-only model with a descriptive prompt
      const fallbackRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://floraiq.app',
        },
        body: JSON.stringify({
          model: FALLBACK_MODEL,
          max_tokens: 1200,
          messages: [{
            role: 'user',
            content: `You are a botanist. An image was uploaded for plant identification but the vision model is unavailable.${locationContext}

Please provide a generic tropical plant identification response in JSON format:
{
  "scientificName": "Unknown species",
  "commonNames": { "en": "Unable to identify from image", "${language}": "Image scan required" },
  "confidence": 0.0,
  "description": "Vision AI temporarily unavailable. Please try again in a few minutes.",
  "characteristics": ["Upload a clear photo", "Good lighting helps", "Show leaves clearly"],
  "careInstructions": { "watering": "Varies by species", "sunlight": "Varies by species", "soil": "Varies by species", "temperature": "Varies by species" },
  "habitat": "Unknown",
  "riskLevel": "safe",
  "imageAnalysis": { "leafShape": "N/A", "color": "N/A", "texture": "N/A", "estimatedHeight": "N/A" },
  "disease": "none visible",
  "fertilizer": "Consult local nursery",
  "soilAdvice": "Varies by plant type"
}`,
          }],
        }),
      });
      const fallbackData = await fallbackRes.json() as any;
      const text = fallbackData.choices?.[0]?.message?.content || '{}';
      return this.parseResult(text);
    }
  }

  private parseResult(text: string): PlantIdentificationResult {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON');
      const p = JSON.parse(jsonMatch[0]);
      return {
        scientificName: p.scientificName || 'Unknown species',
        commonNames: p.commonNames || { en: 'Unknown' },
        confidence: p.confidence || 0.5,
        description: p.description || '',
        characteristics: p.characteristics || [],
        careInstructions: p.careInstructions || {},
        habitat: p.habitat || 'Unknown',
        riskLevel: p.riskLevel || 'safe',
        imageAnalysis: p.imageAnalysis || { leafShape: 'N/A', color: 'N/A', texture: 'N/A', estimatedHeight: 'N/A' },
        disease: p.disease,
        fertilizer: p.fertilizer,
        soilAdvice: p.soilAdvice,
      };
    } catch {
      throw new Error('Failed to parse identification response');
    }
  }

  async generateCareInstructions(scientificName: string, language: string): Promise<Record<string, string>> {
    return { en: 'See identification result', [language]: 'See identification result' };
  }

  async assessPlantSafety(_: string): Promise<'safe' | 'caution' | 'dangerous'> {
    return 'safe';
  }
}

export { AirLLMPlantService, PlantIdentificationResult, IdentificationRequest };
