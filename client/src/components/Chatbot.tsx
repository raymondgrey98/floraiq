import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Minimize2, Maximize2, Leaf } from "lucide-react";
import WaveOrb from "./WaveOrb";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  "How do I identify a plant?",
  "Best plants for beginners?",
  "Signs of root rot?",
  "Edible plants in the wild?",
];

export default function Chatbot() {
  const [open,      setOpen]      = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input,     setInput]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [messages,  setMessages]  = useState<Message[]>([
    { id: "1", role: "assistant", timestamp: new Date(),
      text: "Hi! I'm FloraIQ — ask me anything about plants, animals, farming, or survival." },
  ]);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    setMessages(p => [...p, { id: Date.now().toString(), role: "user", text: msg, timestamp: new Date() }]);
    setInput("");
    setLoading(true);

    try {
      const res  = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history: messages.map(m => ({ role: m.role, text: m.text })) }),
      });
      const data = await res.json();
      setMessages(p => [...p, { id: (Date.now()+1).toString(), role: "assistant", text: data.reply || data.error || "Something went wrong.", timestamp: new Date() }]);
    } catch {
      setMessages(p => [...p, { id: (Date.now()+1).toString(), role: "assistant", text: "Could not reach server. Make sure the backend is running.", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  // ── Closed: floating button ───────────────────────────────────────────────
  if (!open) {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setOpen(true)}
        style={{
          position: "fixed", bottom: 90, right: 16, zIndex: 40,
          width: 56, height: 56, borderRadius: "50%", border: "none",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg,#059669,#10b981)",
          boxShadow: "0 0 20px rgba(16,185,129,0.5), 0 4px 24px rgba(16,185,129,0.3)",
        }}>
        <Leaf size={22} color="white" />
        {/* ping ring */}
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
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed", bottom: 80, right: 12, zIndex: 50,
          width: 340,
          height: minimized ? 60 : 580,
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
              <p style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.2, color: "white" }}>FloraIQ Assistant</p>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", animation: "pulse 2s ease-in-out infinite" }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>AI · Nature Expert</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button type="button" aria-label={minimized ? "Expand chat" : "Minimize chat"} onClick={() => setMinimized(!minimized)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "rgba(255,255,255,0.4)", display: "flex" }}>
              {minimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
            </button>
            <button type="button" aria-label="Close chat" onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "rgba(255,255,255,0.4)", display: "flex" }}>
              <X size={14} />
            </button>
          </div>
        </div>

        {!minimized && (
          <>
            {/* ── MESSAGES ─────────────────────────────────────────────── */}
            <div className="chat-scroll" style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>

              {/* Wave orb — shown only when AI is "thinking" */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0 4px" }}>
                    <WaveOrb size={140} color="#10b981" speed={1.5} waveIntensity={0.4} particles={280} />
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", marginTop: 6 }}>Thinking…</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {messages.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i === 0 ? 0 : 0, duration: 0.25 }}
                  style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "82%",
                    padding: "9px 13px",
                    borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    fontSize: 13, lineHeight: 1.55,
                    background: m.role === "user"
                      ? "linear-gradient(135deg,rgba(16,185,129,0.25),rgba(5,150,105,0.18))"
                      : "rgba(255,255,255,0.05)",
                    border: m.role === "user"
                      ? "1px solid rgba(16,185,129,0.3)"
                      : "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.88)",
                  }}>
                    <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{m.text}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 9, color: "rgba(255,255,255,0.25)" }}>
                      {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div ref={endRef} />
            </div>

            {/* ── SUGGESTIONS ──────────────────────────────────────────── */}
            {messages.length <= 1 && (
              <div style={{ padding: "0 14px 10px", display: "flex", gap: 6, flexWrap: "wrap" }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)}
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
                  placeholder="Ask about plants, animals, survival…"
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
                FloraIQ AI · Powered by OpenRouter
              </p>
            </div>
          </>
        )}
      </motion.div>
    </>
  );
}
