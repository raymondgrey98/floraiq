import { useCallback, useRef } from "react";

type SoundType = "tap" | "capture" | "success" | "error" | "tab";

function buildContext(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return null;
  }
}

function playTap(ctx: AudioContext) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.06);
  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.06);
}

function playCapture(ctx: AudioContext) {
  // Shutter-like double-click
  [0, 0.04].forEach(offset => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(1200, ctx.currentTime + offset);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + offset + 0.08);
    gain.gain.setValueAtTime(0.12, ctx.currentTime + offset);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + offset + 0.08);
    osc.start(ctx.currentTime + offset);
    osc.stop(ctx.currentTime + offset + 0.08);
  });
}

function playSuccess(ctx: AudioContext) {
  // Rising two-note chime
  [[0, 660], [0.12, 880]].forEach(([offset, freq]) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq as number, ctx.currentTime + (offset as number));
    gain.gain.setValueAtTime(0.15, ctx.currentTime + (offset as number));
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (offset as number) + 0.18);
    osc.start(ctx.currentTime + (offset as number));
    osc.stop(ctx.currentTime + (offset as number) + 0.18);
  });
}

function playError(ctx: AudioContext) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
}

function playTab(ctx: AudioContext) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.04);
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.04);
}

export function useSoundEffect() {
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback((type: SoundType = "tap") => {
    if (!ctxRef.current) ctxRef.current = buildContext();
    const ctx = ctxRef.current;
    if (!ctx) return;

    // Resume context on first user gesture (browser autoplay policy)
    if (ctx.state === "suspended") ctx.resume();

    switch (type) {
      case "tap":     return playTap(ctx);
      case "capture": return playCapture(ctx);
      case "success": return playSuccess(ctx);
      case "error":   return playError(ctx);
      case "tab":     return playTab(ctx);
    }
  }, []);

  return play;
}
