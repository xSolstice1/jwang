"use client";

import { useEffect, useRef } from "react";

export default function HelixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let scrollY = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let time = 0;

    const POINTS = 80;
    const ROTATION_SPEED = 0.0015;
    const SCROLL_FACTOR = 0.003;
    const RUNG_SKIP = 6;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onScroll = () => { scrollY = window.scrollY; };
    const onMouse = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = e.clientY / window.innerHeight;
    };

    const draw = () => {
      time += ROTATION_SPEED;
      mouseX += (targetMouseX - mouseX) * 0.03;
      mouseY += (targetMouseY - mouseY) * 0.03;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.28;
      const totalH = h * 0.85;
      const phase = time + scrollY * SCROLL_FACTOR;
      const tiltX = (mouseX - 0.5) * 1.8;
      const tiltY = (mouseY - 0.5) * 1.2;

      const getStrand = (phaseOffset: number) => {
        const pts = [];
        for (let i = 0; i < POINTS; i++) {
          const t = i / (POINTS - 1);
          const angle = t * Math.PI * 5 + phase + phaseOffset;
          const yPos = cy - totalH / 2 + t * totalH;
          const cosA = Math.cos(angle);
          const sinA = Math.sin(angle);
          const breathe = 1 + Math.sin(time * 0.5 + t * 3) * 0.06;
          const r = radius * breathe;
          const x = cx + cosA * r + tiltX * (t - 0.5) * r * 0.5;
          const y = yPos + tiltY * sinA * 15;
          const z = sinA;
          pts.push({ x, y, z, t });
        }
        return pts;
      };

      const s1 = getStrand(0);
      const s2 = getStrand(Math.PI);

      // Batch rungs into single path
      ctx.beginPath();
      for (let i = 0; i < POINTS; i += RUNG_SKIP) {
        const a = s1[i], b = s2[i];
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
      ctx.strokeStyle = "rgba(124, 58, 237, 0.04)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Batch strand segments by depth bucket
      const drawStrandBatched = (pts: typeof s1, r: number, g: number, b: number) => {
        // Back pass
        ctx.beginPath();
        for (let i = 1; i < pts.length; i++) {
          const p = pts[i - 1], c = pts[i];
          const depth = (c.z + 1) / 2;
          if (depth > 0.5) continue;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(c.x, c.y);
        }
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.1)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Front pass
        ctx.beginPath();
        for (let i = 1; i < pts.length; i++) {
          const p = pts[i - 1], c = pts[i];
          const depth = (c.z + 1) / 2;
          if (depth <= 0.5) continue;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(c.x, c.y);
        }
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.25)`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      };

      drawStrandBatched(s1, 124, 58, 237);
      drawStrandBatched(s2, 236, 72, 153);

      // Glow nodes — batch into single fill
      for (const pts of [s1, s2]) {
        const [cr, cg, cb] = pts === s1 ? [124, 58, 237] : [236, 72, 153];
        ctx.beginPath();
        for (let i = 0; i < POINTS; i += RUNG_SKIP) {
          const p = pts[i];
          const depth = (p.z + 1) / 2;
          if (depth < 0.4) continue;
          const r = 0.8 + depth * 2;
          ctx.moveTo(p.x + r, p.y);
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        }
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, 0.2)`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.5 }}
    />
  );
}
