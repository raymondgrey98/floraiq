import { useEffect, useRef } from "react";

interface Props {
  size?: number;
  color?: string;      // hex e.g. "#10b981"
  speed?: number;      // 1 = normal
  particles?: number;
  waveIntensity?: number;
}

/**
 * Animated 3D particle sphere — like Echo Mind's voice orb.
 * Pure canvas, zero dependencies.
 */
export default function WaveOrb({
  size = 220,
  color = "#10b981",
  speed = 1,
  particles = 380,
  waveIntensity = 0.22,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    const R = size * 0.34;
    const cx = size / 2;
    const cy = size / 2;

    // Generate points on sphere using Fibonacci lattice (even distribution)
    const pts = Array.from({ length: particles }, (_, i) => {
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / particles);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      return { phi, theta, baseR: R * (0.9 + Math.random() * 0.2) };
    });

    let angle = 0;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      const t = Date.now() * 0.001;
      const wave = Math.sin(t * 1.4) * waveIntensity;

      // Project all points
      const projected = pts.map(p => {
        const waveMod = 1 + Math.sin(p.phi * 4 + t * 2) * wave
                          + Math.cos(p.theta * 2 + t * 1.5) * wave * 0.5;
        const rr = p.baseR * waveMod;

        const rx = angle * speed;
        // Rotate around Y axis
        const x0 = rr * Math.sin(p.phi) * Math.cos(p.theta);
        const z0 = rr * Math.sin(p.phi) * Math.sin(p.theta);
        const y0 = rr * Math.cos(p.phi);

        const cosA = Math.cos(rx), sinA = Math.sin(rx);
        const x1 = x0 * cosA - z0 * sinA;
        const z1 = x0 * sinA + z0 * cosA;

        const fov  = 520;
        const sc   = fov / (fov + z1 + R);
        return { px: cx + x1 * sc, py: cy + y0 * sc, z: z1, sc };
      });

      // Sort by z depth
      projected.sort((a, b) => a.z - b.z);

      // Draw glow background
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.3);
      grd.addColorStop(0,   `rgba(${r},${g},${b},0.06)`);
      grd.addColorStop(0.6, `rgba(${r},${g},${b},0.03)`);
      grd.addColorStop(1,   "transparent");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Draw particles
      projected.forEach(p => {
        const depth  = (p.z + R) / (R * 2);          // 0 = back, 1 = front
        const alpha  = 0.08 + depth * 0.72;
        const dotR   = Math.max(0.5, (0.7 + depth * 1.4) * p.sc);

        ctx.beginPath();
        ctx.arc(p.px, p.py, dotR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      });

      // Outer ring glow
      const ring = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.25);
      ring.addColorStop(0,   "transparent");
      ring.addColorStop(0.5, `rgba(${r},${g},${b},0.08)`);
      ring.addColorStop(1,   "transparent");
      ctx.fillStyle = ring;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.25, 0, Math.PI * 2);
      ctx.fill();

      angle += 0.006 * speed;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [size, color, speed, particles, waveIntensity]);

  return (
    <canvas
      ref={ref}
      style={{ width: size, height: size, display: "block" }}
      aria-hidden="true"
    />
  );
}
