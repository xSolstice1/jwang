"use client";

import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouse = (e: MouseEvent) => {
      el.style.setProperty("--mx", `${e.clientX}px`);
      el.style.setProperty("--my", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
      style={
        {
          "--mx": "50vw",
          "--my": "50vh",
          background:
            "radial-gradient(ellipse 60% 60% at var(--mx) var(--my), rgba(124,58,237,0.03) 0%, rgba(236,72,153,0.015) 40%, transparent 70%)",
        } as React.CSSProperties
      }
    />
  );
}
