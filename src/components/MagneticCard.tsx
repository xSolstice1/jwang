"use client";

import { useRef, useCallback, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useSound } from "./SoundEngine";

interface MagneticCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export default function MagneticCard({
  children,
  className = "",
  intensity = 8,
}: MagneticCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [tapped, setTapped] = useState(false);
  const sound = useSound();

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      const glow = glowRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(1.01,1.01,1.01)`;
      if (glow) {
        glow.style.opacity = "1";
        glow.style.background = `radial-gradient(600px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(124,58,237,0.1), transparent 40%)`;
      }
    },
    [intensity]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    const glow = glowRef.current;
    if (el) el.style.transform = "perspective(800px) rotateY(0) rotateX(0) scale3d(1,1,1)";
    if (glow) glow.style.opacity = "0";
  }, []);

  const onEnter = useCallback(() => {
    sound.hover();
  }, [sound]);

  const onTouchStart = useCallback(() => {
    setTapped(true);
    setTimeout(() => setTapped(false), 200);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={onEnter}
      onTouchStart={onTouchStart}
      style={{
        transition: "transform 0.15s ease-out",
        willChange: "transform",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      animate={tapped ? { scale: [1, 0.98, 1.01, 1] } : {}}
    >
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
        style={{ opacity: 0 }}
      />
      {tapped && (
        <motion.div
          initial={{ opacity: 0.3, scale: 0 }}
          animate={{ opacity: 0, scale: 2.5 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center"
        >
          <div
            className="w-20 h-20 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(124,58,237,0.4), transparent 70%)" }}
          />
        </motion.div>
      )}
      {children}
    </motion.div>
  );
}
