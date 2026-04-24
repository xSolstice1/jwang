"use client";

import { useEffect, useRef } from "react";

export default function HelixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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

    const POINTS = 120;
    const ROTATION_SPEED = 0.0015;
    const SCROLL_FACTOR = 0.003;
    const RUNG_SKIP = 5;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
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

      // Generate strand points
      const getStrand = (phaseOffset: number) => {
        const pts = [];
        for (let i = 0; i < POINTS; i++) {
          const t = i / (POINTS - 1);
          const angle = t * Math.PI * 5 + phase + phaseOffset;
          const yPos = cy - totalH / 2 + t * totalH;
          const cosA = Math.cos(angle);
          const sinA = Math.sin(angle);
          // Breathing radius — pulses gently
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

      // Draw rungs first (behind strands)
      for (let i = 0; i < POINTS; i += RUNG_SKIP) {
        const a = s1[i], b = s2[i];
        const avgZ = (a.z + b.z) / 2;
        const depth = (avgZ + 1) / 2;
        const alpha = 0.02 + depth * 0.06;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(100, 255, 218, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw each strand as smooth curve with depth
      const drawStrand = (pts: typeof s1, r: number, g: number, b: number) => {
        // Back pass (behind)
        for (let i = 1; i < pts.length; i++) {
          const p = pts[i - 1], c = pts[i];
          const depth = (c.z + 1) / 2;
          if (depth > 0.5) continue;
          const alpha = 0.05 + depth * 0.15;
          const lw = 0.3 + depth * 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(c.x, c.y);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.lineWidth = lw;
          ctx.stroke();
        }
        // Front pass (in front)
        for (let i = 1; i < pts.length; i++) {
          const p = pts[i - 1], c = pts[i];
          const depth = (c.z + 1) / 2;
          if (depth <= 0.5) continue;
          const alpha = 0.08 + depth * 0.3;
          const lw = 0.5 + depth * 1.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(c.x, c.y);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.lineWidth = lw;
          ctx.stroke();
        }
      };

      drawStrand(s1, 100, 255, 218);
      drawStrand(s2, 199, 146, 234);

      // Glow nodes at rung intersections
      const allPts = [
        ...s1.filter((_, i) => i % RUNG_SKIP === 0).map(p => ({ ...p, strand: 1 })),
        ...s2.filter((_, i) => i % RUNG_SKIP === 0).map(p => ({ ...p, strand: 2 })),
      ].sort((a, b) => a.z - b.z);

      for (const p of allPts) {
        const depth = (p.z + 1) / 2;
        if (depth < 0.4) continue;
        const r = 0.8 + depth * 2;
        const alpha = (depth - 0.4) * 0.5;
        const [cr, cg, cb] = p.strand === 1 ? [100, 255, 218] : [199, 146, 234];

        // Soft glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
        grad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${alpha * 0.4})`);
        grad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(p.x - r * 4, p.y - r * 4, r * 8, r * 8);

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse);

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
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.5 }}
    />
  );
}
