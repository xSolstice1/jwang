"use client";

import { useEffect, useRef, useState } from "react";

interface Spear {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  phase: "out" | "home" | "free";
  length: number;
  hue: number;
  width: number;
  speed: number;
}

export default function LightSpears() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const MAX_SPEARS = isTouch ? 40 : 60;

    let animId: number;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let prevMouseX = mouseX;
    let prevMouseY = mouseY;
    let mouseSpeed = 0;
    let mouseActive = true;
    let touching = false;
    const EDGE_MARGIN = 40;
    const spears: Spear[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    function spawnAt(x: number, y: number, count: number, mode: "burst" | "trail") {
      for (let i = 0; i < count; i++) {
        if (spears.length >= MAX_SPEARS) break;

        const angle = Math.random() * Math.PI * 2;
        const spd = mode === "burst"
          ? 2.5 + Math.random() * 4
          : 1.5 + Math.random() * 3;
        const life = mode === "burst"
          ? 50 + Math.random() * 40
          : 35 + Math.random() * 30;

        spears.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          life,
          maxLife: life,
          phase: isTouch ? "free" : "out",
          length: 12 + Math.random() * 20,
          hue: Math.random() > 0.4 ? 0 : 1,
          width: 0.4 + Math.random() * 1,
          speed: spd,
        });
      }
    }

    // --- Desktop: mouse ---
    const onMouse = (e: MouseEvent) => {
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseActive =
        e.clientX > EDGE_MARGIN &&
        e.clientX < window.innerWidth - EDGE_MARGIN &&
        e.clientY > EDGE_MARGIN &&
        e.clientY < window.innerHeight - EDGE_MARGIN;
    };

    // --- Mobile: touch ---
    const onTouchStart = (e: TouchEvent) => {
      touching = true;
      const t = e.touches[0];
      mouseX = t.clientX;
      mouseY = t.clientY;
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      spawnAt(mouseX, mouseY, 6 + Math.floor(Math.random() * 4), "burst");
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = t.clientX;
      mouseY = t.clientY;

      const dx = mouseX - prevMouseX;
      const dy = mouseY - prevMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 8) {
        spawnAt(mouseX, mouseY, 1 + Math.floor(dist / 15), "trail");
      }
    };

    const onTouchEnd = () => {
      touching = false;
    };

    function spawnAmbient() {
      if (spears.length >= MAX_SPEARS) return;

      const edge = Math.floor(Math.random() * 4);
      const w = window.innerWidth;
      const h = window.innerHeight;
      let x: number, y: number;

      switch (edge) {
        case 0: x = Math.random() * w; y = -20; break;
        case 1: x = w + 20; y = Math.random() * h; break;
        case 2: x = Math.random() * w; y = h + 20; break;
        default: x = -20; y = Math.random() * h; break;
      }

      const targetX = isTouch ? w / 2 + (Math.random() - 0.5) * w * 0.6 : mouseX;
      const targetY = isTouch ? h / 2 + (Math.random() - 0.5) * h * 0.6 : mouseY;
      const dx = targetX - x;
      const dy = targetY - y;
      const speed = 1.5 + Math.random() * 2;
      const life = 120 + Math.random() * 80;
      const baseAngle = Math.atan2(dy, dx);
      const angle = baseAngle + (Math.random() - 0.5) * 0.8;

      spears.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        phase: isTouch ? "free" : "home",
        length: 20 + Math.random() * 30,
        hue: Math.random() > 0.5 ? 0 : 1,
        width: 0.3 + Math.random() * 0.8,
        speed,
      });
    }

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Mouse speed (desktop)
      if (!isTouch) {
        const mdx = mouseX - prevMouseX;
        const mdy = mouseY - prevMouseY;
        const currentSpeed = Math.sqrt(mdx * mdx + mdy * mdy);
        mouseSpeed += (currentSpeed - mouseSpeed) * 0.15;

        if (mouseActive && mouseSpeed > 3) {
          const count = Math.min(Math.floor(mouseSpeed / 4), 4);
          spawnAt(mouseX, mouseY, count, "burst");
        }
      }

      // Ambient spears — both desktop and mobile
      const ambientRate = isTouch ? 0.04 : 0.08;
      if (Math.random() < ambientRate) {
        if (!isTouch || !touching) {
          spawnAmbient();
        }
      }

      for (let i = spears.length - 1; i >= 0; i--) {
        const s = spears[i];
        s.life--;

        if (s.life <= 0) {
          spears.splice(i, 1);
          continue;
        }

        const lifeRatio = s.life / s.maxLife;

        if (s.phase === "out") {
          s.vx *= 0.97;
          s.vy *= 0.97;
          if (lifeRatio < 0.5) s.phase = "home";
        }

        if (s.phase === "home") {
          const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
          const safeX = clamp(mouseX, EDGE_MARGIN * 2, w - EDGE_MARGIN * 2);
          const safeY = clamp(mouseY, EDGE_MARGIN * 2, h - EDGE_MARGIN * 2);
          const targetX = mouseActive ? safeX : w / 2;
          const targetY = mouseActive ? safeY : h / 2;
          const dx = targetX - s.x;
          const dy = targetY - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 5) {
            const steer = 0.04 + (1 - lifeRatio) * 0.06;
            s.vx += (dx / dist) * steer;
            s.vy += (dy / dist) * steer;
          }

          const vel = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
          const maxV = s.speed * 1.5;
          if (vel > maxV) {
            s.vx = (s.vx / vel) * maxV;
            s.vy = (s.vy / vel) * maxV;
          }

          if (dist < 15) s.life = Math.min(s.life, 8);
        }

        if (s.phase === "free") {
          // Mobile: just decelerate and drift, no homing
          s.vx *= 0.98;
          s.vy *= 0.98;
        }

        s.x += s.vx;
        s.y += s.vy;

        if (s.x < -50 || s.x > w + 50 || s.y < -50 || s.y > h + 50) {
          spears.splice(i, 1);
          continue;
        }

        // Render
        const vel = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        if (vel < 0.01) continue;

        const nx = s.vx / vel;
        const ny = s.vy / vel;
        const tailX = s.x - nx * s.length * lifeRatio;
        const tailY = s.y - ny * s.length * lifeRatio;

        const fadeIn = Math.min(1, (s.maxLife - s.life) / 10);
        const fadeOut = Math.min(1, s.life / 15);
        const alpha = fadeIn * fadeOut * 0.7;

        const [r, g, b] = s.hue === 0
          ? [100, 255, 218]
          : [199, 146, 234];

        // Glow
        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        grad.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width * 3;
        ctx.lineCap = "round";
        ctx.stroke();

        // Core
        const coreGrad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        coreGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        coreGrad.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.4})`);
        coreGrad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.9})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = coreGrad;
        ctx.lineWidth = s.width;
        ctx.lineCap = "round";
        ctx.stroke();

        // Head
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.width * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        ctx.fill();
      }

      prevMouseX = mouseX;
      prevMouseY = mouseY;
      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);

    if (isTouch) {
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onTouchEnd);
    } else {
      window.addEventListener("mousemove", onMouse);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[45]"
      style={{ opacity: 0.6 }}
    />
  );
}
