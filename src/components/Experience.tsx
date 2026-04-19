"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { experiences } from "@/data/portfolio";

export default function Experience() {
  const [expanded, setExpanded] = useState<number>(0);

  return (
    <section id="experience" className="py-12 sm:py-16 md:py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-12">
            <span className="terminal-text text-sm text-[var(--neon-blue)]">02.</span>
            <h2 className="text-2xl font-bold text-white">Experience</h2>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="relative">
            <div className="absolute left-0 md:left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--neon-blue)]/50 via-[var(--neon-purple)]/30 to-transparent" />

            {experiences.map((exp, i) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative pl-8 md:pl-12 pb-12 last:pb-0"
              >
                <div
                  className={`absolute left-0 md:left-4 top-1 w-2.5 h-2.5 rounded-full -translate-x-1 transition-colors ${
                    expanded === i
                      ? "bg-[var(--neon-blue)] shadow-[0_0_10px_var(--neon-blue)]"
                      : "bg-gray-600"
                  }`}
                />

                <button
                  onClick={() => setExpanded(expanded === i ? -1 : i)}
                  className="w-full text-left group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-[var(--neon-blue)] transition-colors">
                      {exp.role}{" "}
                      <span className="text-[var(--neon-blue)]">@ {exp.company}</span>
                    </h3>
                    <span className="terminal-text text-xs text-gray-500">{exp.period}</span>
                  </div>
                  {exp.description && <p className="text-sm text-gray-500">{exp.description}</p>}
                </button>

                <AnimatePresence>
                  {expanded === i && exp.highlights.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-3">
                        <ul className="space-y-2">
                          {exp.highlights.map((h, j) => (
                            <motion.li
                              key={j}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: j * 0.1 }}
                              className="flex items-start gap-2 text-sm text-gray-400"
                            >
                              <span className="text-[var(--neon-blue)] mt-1 shrink-0">▸</span>
                              {h}
                            </motion.li>
                          ))}
                        </ul>
                        {exp.techStack.length > 0 && <div className="flex flex-wrap gap-2 mt-3">
                          {exp.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 text-xs terminal-text rounded bg-white/5 text-gray-500 border border-white/5"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
