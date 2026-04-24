"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const bootLines = [
  { text: "> initializing system...", delay: 0 },
  { text: "> loading modules: react, next, framer-motion", delay: 300 },
  { text: "> compiling portfolio.ts", delay: 600 },
  { text: "> connecting to experience.db... OK", delay: 900 },
  { text: "> mounting components", delay: 1200 },
  { text: "> render pipeline ready", delay: 1500 },
  { text: "", delay: 1700 },
  { text: "> ANG JIN WEI — DATA ENGINEER & AI SYSTEMS BUILDER", delay: 1800 },
  { text: "> system online.", delay: 2200 },
];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    bootLines.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines(i + 1);
          setProgress(Math.round(((i + 1) / bootLines.length) * 100));
        }, line.delay)
      );
    });

    timers.push(
      setTimeout(() => setExiting(true), 2800),
      setTimeout(onComplete, 3400)
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "#050505" }}
        >
          <div className="w-full max-w-lg px-8">
            <div className="font-mono text-xs leading-relaxed mb-8 space-y-1">
              {bootLines.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className={
                    line.text.includes("ANG JIN WEI")
                      ? "text-[var(--accent)] font-bold"
                      : line.text.includes("online")
                      ? "text-[var(--green)]"
                      : "text-[var(--text-muted)]"
                  }
                >
                  {line.text}
                </motion.div>
              ))}
            </div>

            <div className="relative w-full h-px bg-white/5 overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: "var(--accent)" }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <div className="mt-2 font-mono text-[10px] text-[var(--text-muted)] text-right">
              {progress}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
