"use client";

import { useEffect, useRef } from "react";

interface Strand {
  x: number;
  y: number;
  z: number;
  opacity: number;
}

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

    const POINTS = 80;
    const RADIUS = 120;
    const VERTICAL_SPACING = 8;
    const ROTATION_SPEED = 0.003;
    const SCROLL_ROTATION_FACTOR = 0.002;
    const RUNG_SKIP = 4;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    const onMouse = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = e.clientY / window.innerHeight;
    };

    const getStrandPoints = (
      phase: number,
      tiltX: number,
      tiltY: number
    ): Strand[] => {
      const points: Strand[] = [];
      const cx = canvas.offsetWidth / 2;
      const cy = canvas.offsetHeight / 2;
      const totalHeight = POINTS * VERTICAL_SPACING;

      for (let i = 0; i < POINTS; i++) {
        const t = i / POINTS;
        const angle = t * Math.PI * 4 + phase;
        const y = cy - totalHeight / 2 + i * VERTICAL_SPACING;

        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        const x = cx + cosA * RADIUS + tiltX * (t - 0.5) * 60;
        const z = sinA;

        const depth = (z + 1) / 2;
        const opacity = 0.15 + depth * 0.7;

        points.push({
          x: x + tiltY * (t - 0.5) * 30,
          y,
          z,
          opacity,
        });
      }
      return points;
    };

    const draw = () => {
      time += ROTATION_SPEED;
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const scrollRotation = scrollY * SCROLL_ROTATION_FACTOR;
      const phase = time + scrollRotation;
      const tiltX = (mouseX - 0.5) * 2;
      const tiltY = (mouseY - 0.5) * 2;

      const strand1 = getStrandPoints(phase, tiltX, tiltY);
      const strand2 = getStrandPoints(phase + Math.PI, tiltX, tiltY);

      // Rungs (connecting lines between strands)
      for (let i = 0; i < POINTS; i += RUNG_SKIP) {
        const p1 = strand1[i];
        const p2 = strand2[i];
        const avgZ = (p1.z + p2.z) / 2;
        const rungOpacity = 0.06 + (avgZ + 1) / 2 * 0.12;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(100, 255, 218, ${rungOpacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Sort all points by z for correct draw order
      const allPoints = [
        ...strand1.map((p, i) => ({ ...p, strand: 1, idx: i })),
        ...strand2.map((p, i) => ({ ...p, strand: 2, idx: i })),
      ].sort((a, b) => a.z - b.z);

      // Draw strand curves with varying thickness
      const drawStrand = (points: Strand[], color: string) => {
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const depth = (curr.z + 1) / 2;
          const lineWidth = 0.5 + depth * 1.5;
          const alpha = curr.opacity * 0.6;

          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(curr.x, curr.y);
          ctx.strokeStyle = color.replace("ALPHA", String(alpha));
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }
      };

      drawStrand(strand1, "rgba(100, 255, 218, ALPHA)");
      drawStrand(strand2, "rgba(199, 146, 234, ALPHA)");

      // Draw nodes at intersections
      for (const point of allPoints) {
        if (point.idx % RUNG_SKIP !== 0) continue;
        const depth = (point.z + 1) / 2;
        const radius = 1 + depth * 2.5;
        const alpha = 0.2 + depth * 0.6;

        const color =
          point.strand === 1
            ? `rgba(100, 255, 218, ${alpha})`
            : `rgba(199, 146, 234, ${alpha})`;

        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Glow on front-facing nodes
        if (depth > 0.7) {
          const glowColor =
            point.strand === 1
              ? `rgba(100, 255, 218, ${alpha * 0.2})`
              : `rgba(199, 146, 234, ${alpha * 0.2})`;
          ctx.beginPath();
          ctx.arc(point.x, point.y, radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = glowColor;
          ctx.fill();
        }
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
      style={{ opacity: 0.7 }}
    />
  );
}
