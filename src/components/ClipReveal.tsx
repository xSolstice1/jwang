"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ClipReveal({
  children,
  className = "",
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.55"],
  });

  const clipMap = {
    up: (p: number) => `inset(${100 - p * 100}% 0 0 0)`,
    down: (p: number) => `inset(0 0 ${100 - p * 100}% 0)`,
    left: (p: number) => `inset(0 ${100 - p * 100}% 0 0)`,
    right: (p: number) => `inset(0 0 0 ${100 - p * 100}%)`,
  };

  const clipPath = useTransform(scrollYProgress, [0, 1], [0, 1], {
    mixer: () => (p: number) => clipMap[direction](p),
  });

  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ clipPath: clipPath as unknown as string, y }}>
        {children}
      </motion.div>
    </div>
  );
}
