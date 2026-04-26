"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { systemThinking } from "@/data/portfolio";
import SectionReveal from "./SectionReveal";
import ScrollParallax from "./ScrollParallax";
import StrokeText from "./StrokeText";

const icons: Record<string, React.ReactNode> = {
  scale: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  database: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  brain: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
};

export default function SystemThinking() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionReveal>
          <div className="flex items-center gap-4 mb-4">
            <ScrollParallax speed={-0.15}>
              <span
                className="font-mono text-xs tracking-widest"
                style={{ color: "var(--purple)" }}
              >
                sys
              </span>
            </ScrollParallax>
            <StrokeText text="System Thinking" className="text-2xl sm:text-3xl font-bold" />
            <div
              className="flex-1 h-px"
              style={{ background: "var(--border-color)" }}
            />
          </div>
          <p
            className="text-sm mb-16 max-w-xl"
            style={{ color: "var(--text-muted)" }}
          >
            How I approach building systems. Click each card to explore the
            principles I design around.
          </p>
        </SectionReveal>

        <div className="grid sm:grid-cols-2 gap-5">
          {systemThinking.map((item, i) => {
            const isExpanded = expanded === i;
            return (
              <SectionReveal key={item.title} delay={i * 0.08}>
                <button
                  onClick={() => setExpanded(isExpanded ? null : i)}
                  className="w-full text-left card rounded-xl p-7 transition-all duration-400"
                  style={{
                    borderColor: isExpanded
                      ? "rgba(199, 146, 234, 0.2)"
                      : undefined,
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div style={{ color: "var(--purple)" }}>
                      {icons[item.icon]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm">
                        {item.title}
                      </h3>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      style={{ color: "var(--text-muted)" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.description}
                  </p>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div
                          className="mt-5 pt-5 space-y-2.5"
                          style={{ borderTop: "1px solid var(--border-color)" }}
                        >
                          {item.principles.map((principle, j) => (
                            <motion.div
                              key={j}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: j * 0.08 }}
                              className="flex items-start gap-3 text-sm"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              <span
                                style={{ color: "var(--purple)" }}
                                className="shrink-0"
                              >
                                &rarr;
                              </span>
                              {principle}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
