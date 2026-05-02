"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { experiences } from "@/data/portfolio";
import SectionReveal from "./SectionReveal";
import { useXP } from "./XPEngine";

export default function Experience() {
  const [expanded, setExpanded] = useState<number>(0);
  const { addMilestone } = useXP();
  const viewed = useRef<Set<number>>(new Set([0]));

  return (
    <section id="experience" className="p-6 sm:p-8">
      <SectionReveal>
        <div className="flex items-center gap-3 mb-6">
          <span
            className="font-pixel text-[7px] tracking-widest"
            style={{ color: "var(--gold)" }}
          >
            ◆
          </span>
          <h2 className="font-pixel text-[10px] sm:text-xs text-white tracking-wider">BATTLE LOG</h2>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, var(--border-color), transparent)" }} />
        </div>
      </SectionReveal>

      <div className="relative">
        <div
          className="absolute left-0 md:left-3 top-0 bottom-0 w-px"
          style={{
            background:
              "linear-gradient(to bottom, var(--accent), var(--purple), transparent)",
            opacity: 0.3,
          }}
        />

        {experiences.map((exp, i) => (
          <SectionReveal key={exp.company} delay={i * 0.1}>
            <div className="relative pl-8 md:pl-12 pb-12 last:pb-0">
              <div
                className="absolute left-0 md:left-3 top-2 w-[7px] h-[7px] -translate-x-[3px] transition-all duration-500"
                style={{
                  background:
                    expanded === i ? "var(--gold)" : "var(--text-muted)",
                  boxShadow:
                    expanded === i
                      ? "0 0 12px var(--gold)"
                      : "none",
                }}
              />

              <button
                onClick={() => {
                  setExpanded(expanded === i ? -1 : i);
                  if (!viewed.current.has(i)) {
                    viewed.current.add(i);
                    addMilestone(`exp-${i}`, `Read: ${exp.company}`, 8);
                  }
                  if (viewed.current.size === experiences.length) {
                    addMilestone("exp-all", "Read All Experience", 15);
                  }
                }}
                className="w-full text-left group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-white group-hover:text-[var(--gold)] transition-colors duration-300">
                    {exp.role}{" "}
                    <span style={{ color: "var(--accent)" }}>
                      @ {exp.company}
                    </span>
                  </h3>
                  <span
                    className="font-pixel text-[6px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {exp.period}
                  </span>
                </div>
                {exp.description && (
                  <p
                    className="text-xs"
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
                    <div className="mt-4 space-y-2.5 pb-4">
                      <ul className="space-y-2">
                        {exp.highlights.map((h, j) => (
                          <motion.li
                            key={j}
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: j * 0.05 }}
                            className="flex items-start gap-2.5 text-xs"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            <span
                              className="mt-1.5 shrink-0 font-pixel text-[5px]"
                              style={{ color: "var(--gold)" }}
                            >
                              ▸
                            </span>
                            {h}
                          </motion.li>
                        ))}
                      </ul>
                      {exp.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {exp.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider"
                              style={{
                                color: "var(--text-muted)",
                                background: "rgba(124, 58, 237, 0.06)",
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
    </section>
  );
}
