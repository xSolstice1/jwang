"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { motion, useScroll, useSpring, useTransform, useMotionValue } from "framer-motion";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const velocity = useMotionValue(0);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const touch = window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(touch);
    if (touch) return;

    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 0.8,
    });
    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      velocity.set(lenis.velocity);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [velocity]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const skewY = useSpring(
    useTransform(velocity, [-5, 0, 5], [-1.2, 0, 1.2]),
    { stiffness: 200, damping: 25 }
  );

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

      <motion.div style={isTouch ? undefined : { skewY }}>
        {children}
      </motion.div>
    </>
  );
}
