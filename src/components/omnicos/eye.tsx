import { useEffect, useRef } from "react";

export type EyeMood =
  | "idle"
  | "perceive"
  | "connect"
  | "sync"
  | "verified"
  | "unknown"
  | "divergent";

const PUPIL: Record<EyeMood, number> = {
  idle: 0.2,
  perceive: 0.13,
  connect: 0.17,
  sync: 0.1,
  verified: 0.22,
  unknown: 0.08,
  divergent: 0.02,
};

const LID: Record<EyeMood, number> = {
  idle: 0,
  perceive: 0.08,
  connect: 0,
  sync: 0.05,
  verified: 0,
  unknown: 0.35,
  divergent: 1,
};

function token(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export function SingularityEye({ mood }: { mood: EyeMood }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const moodRef = useRef(mood);
  moodRef.current = mood;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const voidColor = token("--color-void", "#061014");
    const biolume = token("--color-biolume", "#2ee6c7");
    const iris = token("--color-iris", "#e8b86d");
    const foam = token("--color-foam", "#e7f6f2");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let running = true;
    const pupil = { v: PUPIL.idle };
    const lid = { v: 0 };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    const draw = (now: number) => {
      if (!running) return;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.36;
      const targetPupil = PUPIL[moodRef.current];
      const targetLid = LID[moodRef.current];
      pupil.v += (targetPupil - pupil.v) * (reduced ? 1 : 0.08);
      lid.v += (targetLid - lid.v) * (reduced ? 1 : 0.07);

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = voidColor;
      ctx.fillRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 1.35);
      glow.addColorStop(0, "rgba(46, 230, 199, 0.16)");
      glow.addColorStop(0.45, "rgba(46, 230, 199, 0.04)");
      glow.addColorStop(1, "rgba(6, 16, 20, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      ctx.lineWidth = Math.max(1, w * 0.0014);
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2 + now * 0.00008;
        const wobble = Math.sin(now * 0.00045 + i * 1.3) * 0.06;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * R * (0.96 + wobble), cy + Math.sin(a) * R * (0.9 + wobble));
        ctx.bezierCurveTo(
          cx + Math.cos(a + 0.55) * R * 0.66,
          cy + Math.sin(a + 0.45) * R * 0.58,
          cx + Math.cos(a - 0.4) * R * 0.4,
          cy + Math.sin(a - 0.35) * R * 0.36,
          cx + Math.cos(a) * R * 0.24,
          cy + Math.sin(a) * R * 0.24,
        );
        ctx.strokeStyle = `rgba(46, 230, 199, ${0.14 + 0.12 * Math.sin(now * 0.001 + i)})`;
        ctx.stroke();
      }

      ctx.lineWidth = Math.max(1, w * 0.001);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2 - now * 0.00005;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * R * 0.7, cy + Math.sin(a) * R * 0.62);
        ctx.quadraticCurveTo(
          cx + Math.cos(a + 1.2) * R * 0.48,
          cy + Math.sin(a + 0.8) * R * 0.42,
          cx + Math.cos(a + 0.3) * R * 0.3,
          cy + Math.sin(a + 0.2) * R * 0.28,
        );
        ctx.strokeStyle = "rgba(232, 184, 109, 0.28)";
        ctx.stroke();
      }

      for (let i = 0; i < 72; i++) {
        const a = (i / 72) * Math.PI * 2 + now * 0.00004;
        const long = i % 6 === 0;
        const inner = R * (long ? 0.74 : 0.8);
        const outer = R * 0.9;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
        ctx.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
        ctx.strokeStyle = long ? "rgba(231, 246, 242, 0.55)" : "rgba(142, 173, 166, 0.35)";
        ctx.lineWidth = long ? Math.max(1.4, w * 0.0016) : Math.max(1, w * 0.001);
        ctx.stroke();
      }

      for (let ring = 5; ring >= 1; ring--) {
        ctx.beginPath();
        ctx.arc(cx, cy, R * (0.22 + ring * 0.055), 0, Math.PI * 2);
        ctx.strokeStyle = ring % 2 === 0 ? "rgba(46, 230, 199, 0.55)" : "rgba(232, 184, 109, 0.4)";
        ctx.lineWidth = Math.max(1, w * 0.0015);
        ctx.stroke();
      }

      const pr = R * pupil.v;
      ctx.beginPath();
      ctx.arc(cx, cy, pr, 0, Math.PI * 2);
      ctx.fillStyle = voidColor;
      ctx.fill();
      ctx.lineWidth = Math.max(2, w * 0.004);
      ctx.strokeStyle = biolume;
      ctx.stroke();

      const glint = R * 0.045;
      ctx.beginPath();
      ctx.arc(cx - pr * 0.28, cy - pr * 0.3, glint, 0, Math.PI * 2);
      ctx.fillStyle = foam;
      ctx.fill();

      if (lid.v > 0.02) {
        const slit = (1 - lid.v) * R * 1.05;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R * 1.02, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = voidColor;
        ctx.fillRect(cx - R * 1.2, cy - R * 1.3, R * 2.4, R * 1.3 - slit);
        ctx.fillRect(cx - R * 1.2, cy + slit, R * 2.4, R * 1.3);
        ctx.restore();
      }

      if (lid.v > 0.82) {
        ctx.beginPath();
        ctx.moveTo(cx - R * 0.42, cy);
        ctx.lineTo(cx + R * 0.42, cy);
        ctx.strokeStyle = iris;
        ctx.lineWidth = Math.max(2, w * 0.004);
        ctx.stroke();
      }

      const specks = 36;
      for (let i = 0; i < specks; i++) {
        const a = (i / specks) * Math.PI * 2 + now * 0.00012;
        const rad = R * (1.05 + ((i * 37) % 20) / 40);
        const x = cx + Math.cos(a) * rad;
        const y = cy + Math.sin(a * 0.97) * rad * 0.72;
        const alpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(now * 0.002 + i));
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, w * 0.0014), 0, Math.PI * 2);
        ctx.fillStyle = i % 4 === 0 ? `rgba(232, 184, 109, ${alpha})` : `rgba(46, 230, 199, ${alpha})`;
        ctx.fill();
      }

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);
    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  const label =
    mood === "divergent"
      ? "Singularity eye closed. Shield halt."
      : mood === "unknown"
        ? "Singularity eye narrowed. Reality was not observed."
        : mood === "verified"
          ? "Singularity eye open. Expected matches observed."
          : "Singularity eye. Awaiting a comparison.";

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className="absolute inset-0 h-full w-full"
    />
  );
}
