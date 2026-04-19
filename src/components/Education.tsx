"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const education = [
  {
    degree: "Bachelor's Degree in Computer Science & Business Information Systems",
    detail: "Double Major",
    school: "Murdoch University",
    location: "Singapore",
    year: "2023 — 2024",
    gpa: "3.28 / 4.0",
    achievements: {
      "High Distinctions": [
        "Databases",
        "Information Systems Management",
        "IT Professional Practice Project",
        "Advanced Machine Learning and Artificial Intelligence",
        "Business Intelligence Application Development",
        "Principles of Computer Science",
      ],
      Distinctions: [
        "Introduction to ICT Research Methods",
        "Systems Analysis and Design",
        "Data Structures and Abstractions",
        "Enterprise Architectures",
        "Advanced Business Analysis and Design",
        "Operating Systems and Systems Programming",
        "Information Technology Project Management",
      ],
    },
  },
  {
    degree: "Diploma in Interactive & Digital Media",
    detail: "",
    school: "Republic Polytechnic",
    location: "Singapore",
    year: "2016 — 2019",
    gpa: "",
    achievements: {
      "Module Prizes": [
        "2D Game Design & Development",
        "Multimedia Programming",
      ],
    },
  },
];

export default function Education() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="education" className="py-12 sm:py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-12">
            <span className="terminal-text text-sm text-[var(--neon-blue)]">04.</span>
            <h2 className="text-2xl font-bold text-white">Education</h2>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {education.map((edu, i) => {
              const isExpanded = expanded === i;
              return (
                <motion.div
                  key={edu.school}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="glass-card rounded-xl p-6"
                >
                  <button
                    onClick={() => setExpanded(isExpanded ? null : i)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-sm leading-snug mb-1">
                          {edu.degree}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          {edu.detail && (
                            <span className="text-xs text-[var(--neon-purple)] terminal-text">
                              {edu.detail}
                            </span>
                          )}
                          {edu.gpa && (
                            <span className="text-xs text-[var(--neon-green)] terminal-text">
                              GPA: {edu.gpa}
                            </span>
                          )}
                        </div>
                      </div>
                      <svg
                        className={`w-4 h-4 text-gray-600 transition-transform shrink-0 mt-1 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-gray-400">{edu.school}</span>
                      <span className="terminal-text text-xs text-gray-600">{edu.year}</span>
                    </div>
                    <span className="text-xs text-gray-600">{edu.location}</span>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                          {Object.entries(edu.achievements).map(([category, items]) => (
                            <div key={category}>
                              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                {category}
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {items.map((item: string) => (
                                  <span
                                    key={item}
                                    className="px-2 py-0.5 text-xs terminal-text rounded bg-white/5 text-gray-400 border border-white/5"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
