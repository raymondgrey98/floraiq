/**
 * AmbientParticles — a lightweight canvas particle field for the home hero.
 * Drifting pollen motes by day, glowing fireflies at dusk/night. Colour and
 * behaviour come from the current time of day. Purely decorative + cheap.
 */
import { useEffect, useRef } from "react";
import { getDaytime } from "@/lib/daytime";

interface Particle { x: number; y: number; r: number; vx: number; vy: number; ph: number; sp: number; }

export default function AmbientParticles({ count = 22 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;

    const info = getDaytime();
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, t = 0;

    const resize = () => {
      w = parent.clientWidth; h = parent.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const parts: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(0.12 + Math.random() * 0.38),
      ph: Math.random() * Math.PI * 2,
      sp: 0.6 + Math.random() * 1.3,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        const twinkle = info.glow
          ? 0.30 + 0.45 * (0.5 + 0.5 * Math.sin(t * p.sp + p.ph))
          : 0.26;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${info.particleColor},${twinkle})`;
        ctx.shadowBlur = info.glow ? 8 : 0;
        ctx.shadowColor = info.glow ? `rgba(${info.particleColor},0.85)` : "transparent";
        ctx.fill();
      }
    };

    if (reduce) {
      draw(); // one static frame, no animation
    } else {
      const frame = () => {
        t += 0.016;
        for (const p of parts) {
          p.x += p.vx + Math.sin(t * 0.5 + p.ph) * 0.15;
          p.y += p.vy;
          if (p.y < -6) { p.y = h + 6; p.x = Math.random() * w; }
          if (p.x < -6) p.x = w + 6;
          if (p.x > w + 6) p.x = -6;
        }
        draw();
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}
