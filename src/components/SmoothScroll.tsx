"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { motion, useScroll, useSpring } from "framer-motion";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const touch = window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(touch);
    if (touch) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 0.8,
    });
    lenisRef.current = lenis;
    (window as unknown as Record<string, unknown>).__lenis = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      delete (window as unknown as Record<string, unknown>).__lenis;
      lenis.destroy();
    };
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1px] z-[60] origin-left"
        style={{
          scaleX,
          background: "var(--accent)",
          opacity: 0.6,
        }}
      />

      {children}
    </>
  );
}
