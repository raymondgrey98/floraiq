import { geminiService, GeminiServiceError } from "./gemini.service";

// ── Typed interfaces ──────────────────────────────────────────────────────────

export interface DiseaseClassification {
  plant:   string;  // e.g. "Tomato"
  disease: string;  // e.g. "Late blight"
  healthy: boolean;
  score:   number;  // 0–100
  raw:     string;  // original label from model
}

export interface DiseaseAnalysisResult {
  classifications: DiseaseClassification[];
  topDiagnosis:    DiseaseClassification | null;
  treatmentAdvice: string;
  model:           string;
  healthy:         boolean;
}

export class DiseaseServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly model: string,
  ) {
    super(message);
    this.name = "DiseaseServiceError";
  }
}

export class InvalidPayloadError extends DiseaseServiceError {
  constructor(detail: string) {
    super(`Invalid payload: ${detail}`, 400, "validation");
  }
}

// ── HuggingFace model configuration ──────────────────────────────────────────

const HF_MODELS = [
  "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification",
  "gianlab/swin-tiny-patch4-window7-224-finetuned-plantdisease",
] as const;

type HFModel = typeof HF_MODELS[number];

interface HFClassificationEntry {
  label: string;
  score: number;
}

// ── Service class ─────────────────────────────────────────────────────────────

export class DiseaseService {
  private readonly hfKey: string;

  constructor() {
    this.hfKey = process.env.HF_API_KEY || "";
  }

  async analyse(imageBuffer: Buffer): Promise<DiseaseAnalysisResult> {
    // Guard: reject empty or suspiciously small payloads
    if (!imageBuffer || imageBuffer.byteLength < 1024) {
      throw new InvalidPayloadError(
        "Image buffer is absent or too small to be a valid JPEG/PNG (< 1 KB)",
      );
    }

    // Attempt primary model then fallback
    let rawEntries: HFClassificationEntry[] = [];
    let usedModel: HFModel = HF_MODELS[0];

    for (const model of HF_MODELS) {
      try {
        rawEntries = await this.callHuggingFace(model, imageBuffer);
        usedModel  = model;
        break;
      } catch (err) {
        if (model === HF_MODELS[HF_MODELS.length - 1]) {
          // All models exhausted — surface a typed error
          throw new DiseaseServiceError(
            `All HuggingFace disease models are unavailable: ${(err as Error).message}`,
            503,
            model,
          );
        }
        console.warn(`[DiseaseService] ${model} failed, trying next model:`, (err as Error).message);
      }
    }

    const classifications = this.mapEntries(rawEntries);
    const topDiagnosis    = classifications[0] ?? null;
    const isHealthy       = topDiagnosis?.healthy ?? true;

    const treatmentAdvice = isHealthy
      ? "No disease detected. Continue current care routine."
      : await this.fetchTreatmentAdvice(topDiagnosis!);

    return {
      classifications,
      topDiagnosis,
      treatmentAdvice,
      model: usedModel,
      healthy: isHealthy,
    };
  }

  // ── Private: HuggingFace inference call ─────────────────────────────────────

  private async callHuggingFace(model: HFModel, buffer: Buffer): Promise<HFClassificationEntry[]> {
    const headers: Record<string, string> = {
      "Content-Type": "application/octet-stream",
    };
    if (this.hfKey) headers["Authorization"] = `Bearer ${this.hfKey}`;

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      { method: "POST", headers, body: buffer, signal: AbortSignal.timeout(25_000) },
    );

    if (response.status === 503) {
      // Model is loading — surface a specific error rather than silently swallowing it
      throw new DiseaseServiceError(
        `HuggingFace model '${model}' is currently loading. Retry in ~20 seconds.`,
        503,
        model,
      );
    }

    if (!response.ok) {
      const body = await response.text().catch(() => "(unreadable)");
      throw new DiseaseServiceError(
        `HuggingFace returned HTTP ${response.status}: ${body.slice(0, 200)}`,
        response.status,
        model,
      );
    }

    const data = await response.json() as unknown;

    if (!Array.isArray(data)) {
      throw new DiseaseServiceError(
        `HuggingFace response is not an array — model may be misconfigured: ${JSON.stringify(data).slice(0, 200)}`,
        502,
        model,
      );
    }

    return data as HFClassificationEntry[];
  }

  // ── Private: label mapping ───────────────────────────────────────────────────

  private mapEntries(raw: HFClassificationEntry[]): DiseaseClassification[] {
    return raw
      .slice(0, 5)
      .map(entry => {
        const label   = entry.label ?? "";
        const score   = Math.round((entry.score ?? 0) * 100);
        // Labels follow "Plant___Disease_Name" convention
        const parts   = label.split("___");
        const plant   = (parts[0] ?? "Unknown plant").replace(/_/g, " ");
        const disease = (parts[1] ?? label).replace(/_/g, " ");
        const healthy = disease.toLowerCase().includes("healthy");

        return { plant, disease, healthy, score, raw: label };
      })
      .filter(c => c.score > 0);
  }

  // ── Private: Gemini treatment advice ─────────────────────────────────────────

  private async fetchTreatmentAdvice(diagnosis: DiseaseClassification): Promise<string> {
    const prompt = [
      `A ${diagnosis.plant} plant shows signs of ${diagnosis.disease} (confidence: ${diagnosis.score}%).`,
      `Provide exactly 3 numbered treatment steps and 2 prevention tips.`,
      `Keep total response under 150 words. Be globally applicable — no region-specific brands.`,
    ].join(" ");

    try {
      const result = await geminiService.vision({
        base64Image: "", // text-only call
        mimeType:    "text/plain",
        prompt,
        systemInstruction:
          "You are a global plant pathologist. Provide concise, actionable treatment advice. Mention both organic and conventional options.",
      });
      return result.text;
    } catch (err) {
      if (err instanceof GeminiServiceError) {
        console.warn("[DiseaseService] Could not fetch treatment advice:", err.message);
        return `${diagnosis.plant} affected by ${diagnosis.disease}. Consult your local agricultural extension office for approved treatments.`;
      }
      throw err;
    }
  }
}

export const diseaseService = new DiseaseService();
