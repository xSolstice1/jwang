"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSound } from "./SoundEngine";

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
  const [flashed, setFlashed] = useState(false);
  const sound = useSound();

  const isPrimary = delay === 0 && !clip;

  useEffect(() => {
    if (!isPrimary) return;
    const el = ref.current;
    if (!el) return;
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !flashed) {
            setFlashed(true);
            sound.whoosh();
            observer.disconnect();
          }
        },
        { threshold: 0.25 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, 1500);
    return () => clearTimeout(timer);
  }, [flashed, sound, isPrimary]);

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
    <div ref={ref} className={`${className} relative`}>
      {isPrimary && flashed && (
        <>
          <motion.div
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], opacity: { delay: 0.3, duration: 0.4 } }}
            className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none z-20 origin-left"
            style={{ background: "linear-gradient(90deg, var(--gold), var(--accent))" }}
          />
          <motion.div
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1], opacity: { delay: 0.35, duration: 0.4 } }}
            className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none z-20 origin-right"
            style={{ background: "linear-gradient(90deg, var(--accent), var(--gold))" }}
          />
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute inset-0 pointer-events-none z-20"
            style={{ background: "radial-gradient(ellipse at center, rgba(251,191,36,0.08) 0%, transparent 70%)" }}
          />
        </>
      )}
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
