"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (!dot.current || !ring.current) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId: number;
    let moved = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!moved) {
        moved = true;
        setActive(true);
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest("a, button, [role='button'], input, textarea, select");
      dot.current?.classList.toggle("hovering", !!interactive);
      ring.current?.classList.toggle("hovering", !!interactive);
    };

    const onLeave = () => {
      mouseX = -100;
      mouseY = -100;
      ringX = -100;
      ringY = -100;
    };

    const loop = () => {
      if (dot.current) {
        dot.current.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      }
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (ring.current) {
        const w = ring.current.classList.contains("hovering") ? 32 : 20;
        ring.current.style.transform = `translate(${ringX - w}px, ${ringY - w}px)`;
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    rafId = requestAnimationFrame(loop);

    return () => {
      setActive(false);
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    if (active) {
      document.documentElement.classList.add("has-custom-cursor");
    }
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [active]);

  return (
    <>
      <div
        ref={dot}
        className="cursor-dot"
        style={{ visibility: active ? "visible" : "hidden" }}
      />
      <div
        ref={ring}
        className="cursor-ring"
        style={{ visibility: active ? "visible" : "hidden" }}
      />
      {active && (
        <style>{`html.has-custom-cursor, html.has-custom-cursor * { cursor: none !important; }`}</style>
      )}
    </>
  );
}
