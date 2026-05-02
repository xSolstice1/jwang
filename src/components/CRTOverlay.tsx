"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function CRTOverlay({ active }: { active: boolean }) {
  const [flickerClass, setFlickerClass] = useState("");

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.15) {
        setFlickerClass("crt-hard-flicker");
        setTimeout(() => setFlickerClass(""), 80);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed inset-0 pointer-events-none z-[60] ${flickerClass}`}
          aria-hidden
        >
          {/* Thick scanlines */}
          <div
            className="absolute inset-0"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.35) 1px, rgba(0,0,0,0.35) 3px)",
              mixBlendMode: "multiply",
            }}
          />
          {/* Horizontal color bands — phosphor simulation */}
          <div
            className="absolute inset-0"
            style={{
              background: "repeating-linear-gradient(0deg, rgba(124,58,237,0.03) 0px, transparent 1px, transparent 3px)",
            }}
          />
          {/* RGB chromatic aberration on edges */}
          <div
            className="absolute inset-0"
            style={{
              boxShadow: "inset 3px 0 8px rgba(124,58,237,0.15), inset -3px 0 8px rgba(236,72,153,0.15), inset 0 3px 8px rgba(129,140,248,0.1), inset 0 -3px 8px rgba(129,140,248,0.1)",
            }}
          />
          {/* Heavy vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 70% 70% at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
            }}
          />
          {/* Rolling scanline bar */}
          <div className="absolute inset-0 crt-rolling-bar" />
          {/* Constant subtle flicker */}
          <div
            className="absolute inset-0 crt-flicker"
            style={{
              background: "rgba(124, 58, 237, 0.03)",
            }}
          />
          {/* Screen curvature via inner shadow */}
          <div
            className="absolute inset-0 rounded-[4px]"
            style={{
              boxShadow: "inset 0 0 150px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.3)",
            }}
          />
          {/* Phosphor glow on text — applied via CSS on body */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
