"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { experiences } from "@/data/portfolio";
import SectionReveal from "./SectionReveal";
import ScrollParallax from "./ScrollParallax";
import StrokeText from "./StrokeText";

export default function Experience() {
  const [expanded, setExpanded] = useState<number>(0);

  return (
    <section id="experience" className="py-24 sm:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionReveal>
          <div className="flex items-center gap-4 mb-16">
            <ScrollParallax speed={-0.15}>
              <span
                className="font-mono text-xs tracking-widest"
                style={{ color: "var(--accent)" }}
              >
                02
              </span>
            </ScrollParallax>
            <StrokeText text="Experience" className="text-2xl sm:text-3xl font-bold" />
            <div
              className="flex-1 h-px"
              style={{ background: "var(--border-color)" }}
            />
          </div>
        </SectionReveal>

        <div className="relative">
          <div
            className="absolute left-0 md:left-3 top-0 bottom-0 w-px"
            style={{
              background:
                "linear-gradient(to bottom, var(--accent), var(--purple), transparent)",
              opacity: 0.2,
            }}
          />

          {experiences.map((exp, i) => (
            <SectionReveal key={exp.company} delay={i * 0.1}>
              <div className="relative pl-8 md:pl-12 pb-14 last:pb-0">
                <div
                  className="absolute left-0 md:left-3 top-2 w-[7px] h-[7px] rounded-full -translate-x-[3px] transition-all duration-500"
                  style={{
                    background:
                      expanded === i ? "var(--accent)" : "var(--text-muted)",
                    boxShadow:
                      expanded === i
                        ? "0 0 12px var(--accent)"
                        : "none",
                  }}
                />

                <button
                  onClick={() => setExpanded(expanded === i ? -1 : i)}
                  className="w-full text-left group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                    <h3 className="text-base font-semibold text-white group-hover:text-[var(--accent)] transition-colors duration-300">
                      {exp.role}{" "}
                      <span style={{ color: "var(--accent)" }}>
                        @ {exp.company}
                      </span>
                    </h3>
                    <span
                      className="font-mono text-[11px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {exp.period}
                    </span>
                  </div>
                  {exp.description && (
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {exp.description}
                    </p>
                  )}
                </button>

                <AnimatePresence>
                  {expanded === i && exp.highlights.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5 space-y-3">
                        <ul className="space-y-2.5">
                          {exp.highlights.map((h, j) => (
                            <motion.li
                              key={j}
                              initial={{ opacity: 0, x: -15 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: j * 0.05 }}
                              className="flex items-start gap-3 text-sm"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              <span
                                className="mt-1.5 shrink-0 w-1 h-1 rounded-full"
                                style={{ background: "var(--accent)" }}
                              />
                              {h}
                            </motion.li>
                          ))}
                        </ul>
                        {exp.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {exp.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded"
                                style={{
                                  color: "var(--text-muted)",
                                  background: "var(--surface)",
                                  border: "1px solid var(--border-color)",
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
