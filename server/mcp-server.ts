import express from "express";
import multer from "multer";
import { createRastermill } from "rastermill";
import { AirLLMPlantService } from "./ai-service";

const mcpRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });
const aiService = new AirLLMPlantService();
const rastermill = createRastermill({ execution: "auto", limits: { inputPixels: 25_000_000, outputPixels: 25_000_000 } });

// MCP tool manifest — mcporter reads this to build typed TypeScript clients
mcpRouter.get("/", (_req, res) => {
  res.json({
    name: "floraiq",
    version: "1.0.0",
    description: "FloraIQ nature intelligence platform. Identify any organism from a photo and get scientific data, care guides, toxicity warnings, and habitat info.",
    tools: [
      {
        name: "identify_organism",
        description: "Identify a plant, bird, insect, fungus, marine species, or reptile from a photo. Returns scientific name, common names, confidence, toxicity level, care instructions, and habitat.",
        inputSchema: {
          type: "object",
          properties: {
            imageBase64: { type: "string", description: "Base64-encoded image (JPEG, PNG, HEIC, WebP, AVIF supported)" },
            language:    { type: "string", description: "ISO 639-1 language code for common names (default: en)", default: "en" },
            context:     { type: "string", description: "Optional context e.g. 'mode:bird' or 'location:Borneo rainforest'" },
          },
          required: ["imageBase64"],
        },
      },
      {
        name: "get_species_info",
        description: "Look up species information from GBIF by scientific name. Returns taxonomy, occurrence count, kingdom, family, and conservation status.",
        inputSchema: {
          type: "object",
          properties: {
            scientificName: { type: "string", description: "Scientific name e.g. 'Rosa canina' or 'Apis mellifera'" },
          },
          required: ["scientificName"],
        },
      },
    ],
  });
});

// MCP tool execution endpoint
mcpRouter.post("/call/:tool", upload.none(), async (req, res) => {
  const { tool } = req.params;
  const args = req.body;

  try {
    if (tool === "identify_organism") {
      if (!args.imageBase64) {
        res.status(400).json({ error: "imageBase64 is required" });
        return;
      }

      const rawBuffer = Buffer.from(args.imageBase64, "base64");
      const encoded = await rastermill.encode(rawBuffer, { format: "jpeg", resize: { maxSide: 1600 }, quality: 85 });
      const imageBuffer = Buffer.from(encoded.data);

      const result = await aiService.identifyPlant({
        imageBuffer,
        language: args.language || "en",
        context:  args.context || "",
      });

      res.json({ tool: "identify_organism", result });
      return;
    }

    if (tool === "get_species_info") {
      if (!args.scientificName) {
        res.status(400).json({ error: "scientificName is required" });
        return;
      }

      const gbifRes = await fetch(
        `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(args.scientificName)}`,
        { signal: AbortSignal.timeout(6000) }
      );
      const gbif = await gbifRes.json();

      const occRes = await fetch(
        `https://api.gbif.org/v1/occurrence/search?scientificName=${encodeURIComponent(args.scientificName)}&limit=1`,
        { signal: AbortSignal.timeout(6000) }
      );
      const occ = await occRes.json();

      res.json({
        tool: "get_species_info",
        result: {
          scientificName: args.scientificName,
          matchType:      gbif.matchType,
          kingdom:        gbif.kingdom,
          phylum:         gbif.phylum,
          family:         gbif.family,
          genus:          gbif.genus,
          usageKey:       gbif.usageKey,
          confidence:     gbif.confidence,
          status:         gbif.status,
          occurrenceCount: occ.count || 0,
          gbifLink:       gbif.usageKey ? `https://www.gbif.org/species/${gbif.usageKey}` : null,
        },
      });
      return;
    }

    res.status(404).json({ error: `Unknown tool: ${tool}` });
  } catch (err: any) {
    res.status(500).json({ error: "Tool call failed", details: err.message });
  }
});

export { mcpRouter };
