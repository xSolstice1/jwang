"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionReveal from "./SectionReveal";
import ScrollParallax from "./ScrollParallax";
import StrokeText from "./StrokeText";

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
    <section id="education" className="py-24 sm:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionReveal>
          <div className="flex items-center gap-4 mb-16">
            <ScrollParallax speed={-0.15}>
              <span
                className="font-mono text-xs tracking-widest"
                style={{ color: "var(--accent)" }}
              >
                04
              </span>
            </ScrollParallax>
            <StrokeText text="Education" className="text-2xl sm:text-3xl font-bold" />
            <div
              className="flex-1 h-px"
              style={{ background: "var(--border-color)" }}
            />
          </div>
        </SectionReveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {education.map((edu, i) => {
            const isExpanded = expanded === i;
            return (
              <SectionReveal key={edu.school} delay={i * 0.1}>
                <div className="card rounded-xl p-7">
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
                            <span
                              className="text-[10px] font-mono uppercase tracking-widest"
                              style={{ color: "var(--purple)" }}
                            >
                              {edu.detail}
                            </span>
                          )}
                          {edu.gpa && (
                            <span
                              className="text-[10px] font-mono"
                              style={{ color: "var(--green)" }}
                            >
                              GPA: {edu.gpa}
                            </span>
                          )}
                        </div>
                      </div>
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 shrink-0 mt-1 ${
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
                    <div className="mt-4 flex items-center justify-between">
                      <span
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {edu.school}
                      </span>
                      <span
                        className="font-mono text-[11px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {edu.year}
                      </span>
                    </div>
                    <span
                      className="text-xs"
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
                          className="mt-5 pt-5 space-y-4"
                          style={{
                            borderTop: "1px solid var(--border-color)",
                          }}
                        >
                          {Object.entries(edu.achievements).map(
                            ([category, items]) => (
                              <div key={category}>
                                <h4
                                  className="text-[10px] font-medium uppercase tracking-[0.2em] mb-3"
                                  style={{ color: "var(--text-muted)" }}
                                >
                                  {category}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {items.map((item: string) => (
                                    <span
                                      key={item}
                                      className="px-2.5 py-1 text-[10px] font-mono rounded"
                                      style={{
                                        color: "var(--text-secondary)",
                                        background: "var(--surface)",
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
      </div>
    </section>
  );
}
