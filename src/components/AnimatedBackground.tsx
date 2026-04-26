"use client";

import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const onMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const grd = ctx.createRadialGradient(
        mouseX, mouseY, 0,
        mouseX, mouseY, canvas.width * 0.6
      );
      grd.addColorStop(0, "rgba(100, 255, 218, 0.03)");
      grd.addColorStop(0.5, "rgba(199, 146, 234, 0.015)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const t = Date.now() * 0.0003;
      for (let i = 0; i < 3; i++) {
        const x = canvas.width * (0.3 + i * 0.2) + Math.sin(t + i * 2) * 100;
        const y = canvas.height * (0.3 + i * 0.15) + Math.cos(t + i * 1.5) * 80;
        const grd2 = ctx.createRadialGradient(x, y, 0, x, y, 300);
        grd2.addColorStop(0, `rgba(100, 255, 218, ${0.015 - i * 0.003})`);
        grd2.addColorStop(1, "transparent");
        ctx.fillStyle = grd2;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
