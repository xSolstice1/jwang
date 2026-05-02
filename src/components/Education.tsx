"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionReveal from "./SectionReveal";

const education = [
  {
    degree:
      "Bachelor's Degree in Computer Science & Business Information Systems",
    detail: "Bachelor's Degree",
    school: "Murdoch University",
    location: "Singapore",
    year: "2024",
    gpa: "",
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
    detail: "Diploma",
    school: "Republic Polytechnic",
    location: "Singapore",
    year: "2019",
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
    <section id="education" className="p-6 sm:p-8">
      <SectionReveal>
        <div className="flex items-center gap-3 mb-6">
          <span
            className="font-pixel text-[7px] tracking-widest"
            style={{ color: "var(--gold)" }}
          >
            ◆
          </span>
          <h2 className="font-pixel text-[10px] sm:text-xs text-white tracking-wider">TRAINING GROUNDS</h2>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, var(--border-color), transparent)" }} />
        </div>
      </SectionReveal>

      <div className="space-y-4">
        {education.map((edu, i) => {
          const isExpanded = expanded === i;
          return (
            <SectionReveal key={edu.school} delay={i * 0.1}>
              <div className="card p-5">
                <button
                  onClick={() => setExpanded(isExpanded ? null : i)}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-2">
                      <h3 className="text-white font-semibold text-xs leading-snug mb-1">
                        {edu.degree}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        {edu.detail && (
                          <span
                            className="font-pixel text-[6px] uppercase tracking-widest"
                            style={{ color: "var(--purple)" }}
                          >
                            {edu.detail}
                          </span>
                        )}
                        {edu.gpa && (
                          <span
                            className="font-pixel text-[6px]"
                            style={{ color: "var(--green)" }}
                          >
                            GPA: {edu.gpa}
                          </span>
                        )}
                      </div>
                    </div>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-300 shrink-0 mt-0.5 ${
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
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {edu.school}
                    </span>
                    <span
                      className="font-pixel text-[6px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {edu.year}
                    </span>
                  </div>
                  <span
                    className="text-[10px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {edu.location}
                  </span>
                </button>

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
                        className="mt-4 pt-4 space-y-3"
                        style={{
                          borderTop: "1px solid var(--border-color)",
                        }}
                      >
                        {Object.entries(edu.achievements).map(
                          ([category, items]) => (
                            <div key={category}>
                              <h4
                                className="font-pixel text-[6px] uppercase tracking-[0.2em] mb-2"
                                style={{ color: "var(--gold)" }}
                              >
                                {category}
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {items.map((item: string) => (
                                  <span
                                    key={item}
                                    className="px-2 py-0.5 text-[9px] font-mono"
                                    style={{
                                      color: "var(--text-secondary)",
                                      background: "rgba(124, 58, 237, 0.06)",
                                      border:
                                        "1px solid var(--border-color)",
                                    }}
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SectionReveal>
          );
        })}
      </div>
    </section>
  );
}
