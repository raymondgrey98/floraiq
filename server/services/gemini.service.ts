import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ── Typed interfaces ──────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface GeminiChatPayload {
  sessionId: string;
  userId: string | null;
  message: string;
}

export interface GeminiChatResult {
  reply: string;
  sessionId: string;
}

export interface GeminiVisionPayload {
  base64Image: string;
  mimeType: string;
  prompt: string;
  systemInstruction?: string;
}

export interface GeminiVisionResult {
  text: string;
  model: string;
  finishReason: string;
}

export class GeminiServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly upstream: string,
  ) {
    super(message);
    this.name = "GeminiServiceError";
  }
}

export class SessionNotFoundError extends Error {
  constructor(sessionId: string) {
    super(`Chat session '${sessionId}' does not exist or belongs to a different user`);
    this.name = "SessionNotFoundError";
  }
}

// ── Constants ─────────────────────────────────────────────────────────────────

const GEMINI_FLASH_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;
const GEMINI_PRO_URL   = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent`;
const OPENROUTER_URL   = "https://openrouter.ai/api/v1/chat/completions";

const FLORAIQ_SYSTEM = `You are FloraIQ Assistant — a world-class expert in botany, zoology, ecology, agronomy, foraging, and wilderness survival. You serve users from every country and climate zone on Earth. Provide accurate, concise, practical information. When discussing plants, animals, fungi, or environmental conditions, always cover safety implications. Responses must be direct and data-rich, never generic.`;

const HISTORY_WINDOW = 20; // messages to fetch from DB per session

// ── Service class ─────────────────────────────────────────────────────────────

export class GeminiService {
  private readonly apiKey: string;
  private readonly openRouterKey: string;
  private readonly supabase: SupabaseClient<any> | null;

  constructor() {
    this.apiKey       = process.env.GEMINI_API_KEY      || "";
    this.openRouterKey = process.env.OPENROUTER_API_KEY || "";

    const url     = process.env.SUPABASE_URL      || process.env.VITE_SUPABASE_URL      || "";
    const secret  = process.env.SUPABASE_SECRET_KEY || "";

    this.supabase = url && secret ? createClient<any>(url, secret) : null;
  }

  // ── Public: session-aware chat ──────────────────────────────────────────────

  async chat(payload: GeminiChatPayload): Promise<GeminiChatResult> {
    const { sessionId, userId, message } = payload;

    // 1. Resolve or create session
    const resolvedSessionId = await this.resolveSession(sessionId, userId);

    // 2. Fetch history from DB
    const history = await this.fetchHistory(resolvedSessionId, userId);

    // 3. Build message array for Gemini
    const messages: ChatMessage[] = [
      ...history,
      { role: "user", content: message },
    ];

    // 4. Call Gemini (with OpenRouter fallback)
    const reply = await this.callGeminiChat(messages);

    // 5. Persist both the user message and assistant reply
    await this.persistMessages(resolvedSessionId, userId, message, reply);

    return { reply, sessionId: resolvedSessionId };
  }

  // ── Public: vision (plant identification) ──────────────────────────────────

  async vision(payload: GeminiVisionPayload): Promise<GeminiVisionResult> {
    if (!this.apiKey) {
      throw new GeminiServiceError(
        "GEMINI_API_KEY is not configured on this server",
        500,
        "configuration",
      );
    }

    const body = {
      contents: [{
        parts: [
          { inline_data: { mime_type: payload.mimeType, data: payload.base64Image } },
          { text: payload.prompt },
        ],
      }],
      ...(payload.systemInstruction
        ? { systemInstruction: { parts: [{ text: payload.systemInstruction }] } }
        : {}),
    };

    const response = await fetch(`${GEMINI_PRO_URL}?key=${this.apiKey}`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
      signal:  AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({})) as any;
      throw new GeminiServiceError(
        errBody?.error?.message || `Gemini Vision returned HTTP ${response.status}`,
        response.status,
        "gemini-vision",
      );
    }

    const data = await response.json() as any;
    const candidate = data.candidates?.[0];

    if (!candidate) {
      throw new GeminiServiceError(
        "Gemini Vision returned no candidates in response",
        502,
        "gemini-vision",
      );
    }

    return {
      text:         candidate.content?.parts?.[0]?.text ?? "",
      model:        data.modelVersion ?? "gemini-1.5-pro",
      finishReason: candidate.finishReason ?? "STOP",
    };
  }

  // ── Private: Gemini chat call with OpenRouter fallback ──────────────────────

  private async callGeminiChat(messages: ChatMessage[]): Promise<string> {
    if (this.apiKey) {
      try {
        return await this.callGeminiFlash(messages);
      } catch (err) {
        console.warn("[GeminiService] Flash failed, switching to OpenRouter:", (err as Error).message);
      }
    }

    if (this.openRouterKey) {
      return await this.callOpenRouter(messages);
    }

    throw new GeminiServiceError(
      "No AI backend is configured — set GEMINI_API_KEY or OPENROUTER_API_KEY",
      503,
      "configuration",
    );
  }

  private async callGeminiFlash(messages: ChatMessage[]): Promise<string> {
    const contents = messages.map(m => ({
      role:  m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const body = {
      contents,
      systemInstruction: { parts: [{ text: FLORAIQ_SYSTEM }] },
    };

    const response = await fetch(`${GEMINI_FLASH_URL}?key=${this.apiKey}`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
      signal:  AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({})) as any;
      throw new GeminiServiceError(
        errBody?.error?.message || `Gemini Flash returned HTTP ${response.status}`,
        response.status,
        "gemini-flash",
      );
    }

    const data = await response.json() as any;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (typeof text !== "string" || text.trim() === "") {
      throw new GeminiServiceError("Gemini Flash returned an empty response body", 502, "gemini-flash");
    }

    return text;
  }

  private async callOpenRouter(messages: ChatMessage[]): Promise<string> {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.openRouterKey}`,
        "Content-Type":  "application/json",
        "HTTP-Referer":  "https://floraiq.app",
        "X-Title":       "FloraIQ",
      },
      body: JSON.stringify({
        model:    "google/gemma-4-31b-it:free",
        messages: [{ role: "system", content: FLORAIQ_SYSTEM }, ...messages],
        max_tokens: 1500,
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({})) as any;
      throw new GeminiServiceError(
        errBody?.error?.message || `OpenRouter returned HTTP ${response.status}`,
        response.status,
        "openrouter",
      );
    }

    const data = await response.json() as any;
    const text = data.choices?.[0]?.message?.content;

    if (typeof text !== "string" || text.trim() === "") {
      throw new GeminiServiceError("OpenRouter returned an empty response body", 502, "openrouter");
    }

    return text;
  }

  // ── Private: session management ─────────────────────────────────────────────

  private async resolveSession(sessionId: string, userId: string | null): Promise<string> {
    if (!this.supabase) return sessionId; // graceful degradation when DB is not configured

    if (sessionId === "new") {
      // Create a new session row and return its id
      const { data, error } = await this.supabase
        .from("chat_sessions")
        .insert({ user_id: userId, title: "FloraIQ Chat" })
        .select("id")
        .single();

      if (error) {
        console.error("[GeminiService] Failed to create chat session:", error.message);
        return `ephemeral_${Date.now()}`; // degrade to in-memory if DB write fails
      }
      return data.id as string;
    }

    // Verify session exists and belongs to this user
    const { data, error } = await this.supabase
      .from("chat_sessions")
      .select("id")
      .eq("id", sessionId)
      .maybeSingle();

    if (error || !data) throw new SessionNotFoundError(sessionId);

    return sessionId;
  }

  private async fetchHistory(sessionId: string, _userId: string | null): Promise<ChatMessage[]> {
    if (!this.supabase || sessionId.startsWith("ephemeral_")) return [];

    const { data, error } = await this.supabase
      .from("chat_messages")
      .select("role, content")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .limit(HISTORY_WINDOW);

    if (error) {
      console.error("[GeminiService] Failed to fetch chat history:", error.message);
      return [];
    }

    return (data ?? []) as ChatMessage[];
  }

  private async persistMessages(
    sessionId: string,
    userId: string | null,
    userMessage: string,
    assistantReply: string,
  ): Promise<void> {
    if (!this.supabase || sessionId.startsWith("ephemeral_")) return;

    const rows = [
      { session_id: sessionId, user_id: userId, role: "user",      content: userMessage    },
      { session_id: sessionId, user_id: userId, role: "assistant",  content: assistantReply },
    ];

    const { error } = await this.supabase.from("chat_messages").insert(rows);

    if (error) {
      console.error("[GeminiService] Failed to persist chat messages:", error.message);
      // Non-fatal: the user still receives the reply even if persistence fails
    }

    // Bump updated_at on the session
    await this.supabase
      .from("chat_sessions")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", sessionId);
  }
}

// Singleton exported for use in routes.ts
export const geminiService = new GeminiService();
