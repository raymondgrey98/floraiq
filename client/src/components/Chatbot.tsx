import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, Minimize2, Maximize2, Leaf, RotateCcw, Copy, Check,
  Sparkles, ServerCog, Globe, Trash2,
} from "lucide-react";
import { Streamdown } from "streamdown";
import WaveOrb from "./WaveOrb";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
  failed?: boolean;
}

type AiMode = "server" | "direct" | "offline";

const SUGGESTIONS = [
  "Diagnose yellowing leaves",
  "Design a small hydroponic system",
  "Edible plants in the wild",
  "Pest control without chemicals",
];

const SYSTEM_PROMPT =
  "You are FloraIQ Intelligence Core — a world-class expert in botany, zoology, ecology, agronomy, " +
  "aquaponics, hydroponics, farm machinery, foraging, and wilderness survival. You serve users in every " +
  "country and climate zone. Answer with accurate, practical, data-rich guidance. Always cover safety " +
  "implications for plants, fungi, and animals. Use short paragraphs and markdown lists where helpful.";

// Client-side Gemini fallback chain — gemini-2.0-flash lost its free tier,
// 2.5-flash is primary, lite absorbs rate-limit spikes.
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

async function callGeminiDirect(history: Message[], msg: string): Promise<string> {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error("No AI key configured");

  const contents = [
    ...history
      .filter(m => !m.failed)
      .slice(-12)
      .map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.text }] })),
    { role: "user", parts: [{ text: msg }] },
  ];

  let lastErr = "";
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
            generationConfig: { temperature: 0.6, maxOutputTokens: 1200 },
          }),
          signal: AbortSignal.timeout(25_000),
        },
      );
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (res.ok && typeof text === "string" && text.trim()) return text;
      lastErr = data?.error?.message || `${model} HTTP ${res.status}`;
    } catch (e: any) {
      lastErr = e?.message || "network error";
    }
  }
  throw new Error(lastErr || "All AI models failed");
}

export default function Chatbot() {
  const [open, setOpen]           = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [mode, setMode]           = useState<AiMode>("server");
  const [copiedId, setCopiedId]   = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("new");
  const [messages, setMessages]   = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem("floraiq_chat_messages");
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        if (parsed.length > 0) return parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
      }
    } catch {}
    return [{
      id: "welcome", role: "assistant", timestamp: new Date(),
      text: "FloraIQ Intelligence Core online. Ask about any plant, animal, disease, farm system, or survival situation — anywhere on Earth.",
    }];
  });

  const endRef = useRef<HTMLDivElement>(null);
  const lastUserMsg = useRef<string>("");

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    try {
      localStorage.setItem("floraiq_chat_messages", JSON.stringify(messages.slice(-50)));
    } catch {}
  }, [messages]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    lastUserMsg.current = msg;

    const history = messages;
    setMessages(p => [...p, { id: Date.now().toString(), role: "user", text: msg, timestamp: new Date() }]);
    setInput("");
    setLoading(true);

    try {
      let reply = "";

      // 1. Backend (session memory + server-side fallbacks)
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: msg, sessionId }),
          signal: AbortSignal.timeout(30_000),
        });
        if (res.ok) {
          const data = await res.json();
          reply = data.reply || "";
          if (data.sessionId) setSessionId(data.sessionId);
          if (reply) setMode("server");
        }
      } catch { /* backend unreachable — try direct */ }

      // 2. Direct Gemini from the browser (works in the APK with no backend)
      if (!reply) {
        reply = await callGeminiDirect(history, msg);
        setMode("direct");
      }

      setMessages(p => [...p, { id: `${Date.now()}a`, role: "assistant", text: reply, timestamp: new Date() }]);
    } catch (e: any) {
      setMode("offline");
      setMessages(p => [...p, {
        id: `${Date.now()}e`, role: "assistant", failed: true, timestamp: new Date(),
        text: "I couldn't reach any AI service. Check your internet connection, then tap Retry.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    if (!lastUserMsg.current || loading) return;
    // Drop the failed bubble + the user message (send() re-adds it)
    setMessages(p => {
      const trimmed = p.filter(m => !m.failed);
      return trimmed.slice(0, trimmed.length - 1);
    });
    void send(lastUserMsg.current);
  };

  const clearChat = () => {
    setSessionId("new");
    setMessages([{
      id: "welcome", role: "assistant", timestamp: new Date(),
      text: "Conversation cleared. What would you like to know?",
    }]);
    try { localStorage.removeItem("floraiq_chat_messages"); } catch {}
  };

  const copyMessage = (m: Message) => {
    navigator.clipboard?.writeText(m.text).then(() => {
      setCopiedId(m.id);
      setTimeout(() => setCopiedId(null), 1500);
    }).catch(() => {});
  };

  const modeBadge: Record<AiMode, { label: string; color: string; Icon: typeof Globe }> = {
    server:  { label: "Connected",  color: "#4ade80", Icon: ServerCog },
    direct:  { label: "Direct AI",  color: "#38bdf8", Icon: Globe },
    offline: { label: "No network", color: "#f87171", Icon: Globe },
  };
  const badge = modeBadge[mode];

  // ── Closed: floating button ───────────────────────────────────────────────
  if (!open) {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setOpen(true)}
        aria-label="Open FloraIQ Intelligence Core"
        style={{
          position: "fixed", bottom: 90, right: 16, zIndex: 40,
          width: 56, height: 56, borderRadius: "50%", border: "none",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg,#059669,#10b981)",
          boxShadow: "0 0 20px rgba(16,185,129,0.5), 0 4px 24px rgba(16,185,129,0.3)",
        }}>
        <Sparkles size={22} color="white" />
        <motion.div
          animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "2px solid rgba(16,185,129,0.6)",
          }}
        />
      </motion.button>
    );
  }

  // ── Open ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .chat-scroll { scrollbar-width:thin; scrollbar-color:rgba(16,185,129,0.2) transparent; }
        .chat-scroll::-webkit-scrollbar { width:3px; }
        .chat-scroll::-webkit-scrollbar-thumb { background:rgba(16,185,129,0.25); border-radius:99px; }
        .chat-md { font-size:13px; line-height:1.6; color:rgba(255,255,255,0.88); }
        .chat-md p { margin:0 0 8px; } .chat-md p:last-child { margin-bottom:0; }
        .chat-md ul, .chat-md ol { margin:4px 0 8px; padding-left:18px; }
        .chat-md li { margin-bottom:3px; }
        .chat-md h1,.chat-md h2,.chat-md h3 { font-size:13px; font-weight:700; margin:10px 0 4px; color:#6ee7b7; }
        .chat-md strong { color:#a7f3d0; font-weight:600; }
        .chat-md code { background:rgba(16,185,129,0.12); border-radius:4px; padding:1px 5px; font-size:12px; }
        .chat-md table { border-collapse:collapse; font-size:11px; margin:6px 0; }
        .chat-md th,.chat-md td { border:1px solid rgba(255,255,255,0.12); padding:3px 7px; }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed", bottom: 80, right: 12, zIndex: 50,
          width: "min(380px, calc(100vw - 24px))",
          height: minimized ? 60 : "min(620px, calc(100vh - 110px))",
          borderRadius: 22, overflow: "hidden",
          display: "flex", flexDirection: "column",
          background: "rgba(7,16,12,0.97)",
          border: "1px solid rgba(16,185,129,0.2)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(16,185,129,0.1)",
          backdropFilter: "blur(24px)",
          transition: "height 0.3s cubic-bezier(0.22,1,0.36,1)",
        }}>

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", flexShrink: 0,
          background: "linear-gradient(135deg,rgba(16,185,129,0.12),rgba(5,150,105,0.06))",
          borderBottom: "1px solid rgba(16,185,129,0.15)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <motion.div
              animate={{ boxShadow: ["0 0 6px rgba(16,185,129,0.4)","0 0 16px rgba(16,185,129,0.7)","0 0 6px rgba(16,185,129,0.4)"] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#34d399,#059669)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Leaf size={16} color="white" />
            </motion.div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.2, color: "white", margin: 0 }}>Intelligence Core</p>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <badge.Icon size={9} color={badge.color} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>{badge.label} · Botany · Farming · Survival</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <button type="button" aria-label="Clear conversation" onClick={clearChat} title="Clear conversation"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "rgba(255,255,255,0.4)", display: "flex" }}>
              <Trash2 size={14} />
            </button>
            <button type="button" aria-label={minimized ? "Expand chat" : "Minimize chat"} onClick={() => setMinimized(!minimized)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "rgba(255,255,255,0.4)", display: "flex" }}>
              {minimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
            </button>
            <button type="button" aria-label="Close chat" onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "rgba(255,255,255,0.4)", display: "flex" }}>
              <X size={14} />
            </button>
          </div>
        </div>

        {!minimized && (
          <>
            {/* ── MESSAGES ─────────────────────────────────────────────── */}
            <div className="chat-scroll" style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
              {messages.map(m => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "86%",
                    padding: "9px 13px",
                    borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: m.failed
                      ? "rgba(248,113,113,0.08)"
                      : m.role === "user"
                        ? "linear-gradient(135deg,rgba(16,185,129,0.25),rgba(5,150,105,0.18))"
                        : "rgba(255,255,255,0.05)",
                    border: m.failed
                      ? "1px solid rgba(248,113,113,0.3)"
                      : m.role === "user"
                        ? "1px solid rgba(16,185,129,0.3)"
                        : "1px solid rgba(255,255,255,0.07)",
                  }}>
                    {m.role === "assistant" ? (
                      <div className="chat-md"><Streamdown>{m.text}</Streamdown></div>
                    ) : (
                      <p style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.55, color: "rgba(255,255,255,0.88)" }}>{m.text}</p>
                    )}

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 5, gap: 8 }}>
                      <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>
                        {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <div style={{ display: "flex", gap: 8 }}>
                        {m.failed && (
                          <button type="button" onClick={retry}
                            style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#f87171", fontSize: 10, fontWeight: 700, padding: 0 }}>
                            <RotateCcw size={10} />Retry
                          </button>
                        )}
                        {m.role === "assistant" && !m.failed && m.id !== "welcome" && (
                          <button type="button" onClick={() => copyMessage(m)} aria-label="Copy reply"
                            style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", color: copiedId === m.id ? "#4ade80" : "rgba(255,255,255,0.3)", padding: 0 }}>
                            {copiedId === m.id ? <Check size={11} /> : <Copy size={11} />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 4px" }}>
                    <WaveOrb size={110} color="#10b981" speed={1.5} waveIntensity={0.4} particles={220} />
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", marginTop: 4 }}>Reasoning…</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={endRef} />
            </div>

            {/* ── SUGGESTIONS ──────────────────────────────────────────── */}
            {messages.length <= 1 && !loading && (
              <div style={{ padding: "0 14px 10px", display: "flex", gap: 6, flexWrap: "wrap" }}>
                {SUGGESTIONS.map(s => (
                  <button type="button" key={s} onClick={() => send(s)}
                    style={{
                      fontSize: 10, padding: "5px 10px", borderRadius: 20, cursor: "pointer",
                      background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)",
                      color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap",
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* ── INPUT ────────────────────────────────────────────────── */}
            <div style={{
              padding: "10px 14px 14px", flexShrink: 0,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(7,16,12,0.9)",
            }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder="Ask about plants, farms, wildlife, survival…"
                  style={{
                    flex: 1, background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(16,185,129,0.15)",
                    borderRadius: 14, padding: "10px 14px", fontSize: 13,
                    color: "white", outline: "none",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.08)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.15)"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <motion.button
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                  onClick={() => send()}
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  style={{
                    width: 40, height: 40, borderRadius: 12, border: "none", cursor: "pointer",
                    background: input.trim() && !loading ? "linear-gradient(135deg,#059669,#10b981)" : "rgba(255,255,255,0.07)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: input.trim() && !loading ? "0 4px 16px rgba(16,185,129,0.35)" : "none",
                    transition: "background 0.25s, box-shadow 0.25s",
                  }}>
                  <Send size={16} color={input.trim() && !loading ? "white" : "rgba(255,255,255,0.25)"} />
                </motion.button>
              </div>
              <p style={{ fontSize: 9, textAlign: "center", marginTop: 8, color: "rgba(255,255,255,0.2)" }}>
                FloraIQ Intelligence Core · Gemini 2.5 with automatic failover
              </p>
            </div>
          </>
        )}
      </motion.div>
    </>
  );
}
