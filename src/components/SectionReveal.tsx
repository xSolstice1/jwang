"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function SectionReveal({
  children,
  className = "",
  delay = 0,
  clip = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  clip?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.55"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const clipProgress = useTransform(scrollYProgress, [0, 1], [100, 0]);

  if (clip) {
    const clipPath = useTransform(clipProgress, (v) => `inset(${v}% 0 0 0)`);
    return (
      <div ref={ref} className={className}>
        <motion.div
          style={{
            clipPath: clipPath as unknown as string,
            opacity,
            y,
          }}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{
          duration: 1,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
