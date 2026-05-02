"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skillCategories } from "@/data/portfolio";
import SectionReveal from "./SectionReveal";

const proficiencyBase = {
  core: { label: "CORE", color: "var(--gold)" },
  proficient: { label: "PRO", color: "var(--accent)" },
  familiar: { label: "FAM", color: "var(--purple)" },
} as const;

const skillOverrides: Record<string, number> = {
  "Python": 95,
  "TypeScript": 90,
  "SQL": 92,
  "Go": 62,
  "C#": 65,
  "C++": 55,
  "Java": 40,
  "JavaScript": 88,
  "Neo4j": 72,
  "Snowflake": 85,
  "MongoDB": 68,
  "GraphRAG": 88,
  "AWS Bedrock": 70,
  "dbt": 65,
  "Vector Search": 72,
  "React": 90,
  "Next.js": 88,
  "Tailwind CSS": 92,
  "Chakra UI": 60,
  "FastAPI": 85,
  ".NET": 58,
  "Electron": 42,
  "AWS": 90,
  "Terraform": 82,
  "Docker": 88,
  "ECR": 80,
  "S3": 92,
  "RDS": 78,
  "AWS Batch": 75,
  "Firebase": 60,
  "Git": 92,
  "Tableau": 58,
  "Airflow": 65,
  "Zustand": 70,
  "Linux": 72,
  "CI/CD": 75,
};

function getSkillPct(name: string, proficiency: string): number {
  if (skillOverrides[name] != null) return skillOverrides[name];
  if (proficiency === "core") return 90;
  if (proficiency === "proficient") return 65;
  return 40;
}

const categoryIcons: Record<string, string> = {
  "Languages & Frameworks": "⚔",
  "Data & AI": "🧠",
  "Frontend & Web": "🛡",
  "Cloud & Infra": "☁",
  "Tools & Platforms": "⚙",
};

export default function SkillTree() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section id="skills" className="p-6 sm:p-8">
      <SectionReveal>
        <div className="flex items-center gap-3 mb-6">
          <span
            className="font-pixel text-[7px] tracking-widest"
            style={{ color: "var(--gold)" }}
          >
            ◆
          </span>
          <h2 className="font-pixel text-[10px] sm:text-xs text-white tracking-wider">SKILL TREE</h2>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, var(--border-color), transparent)" }} />
        </div>
      </SectionReveal>

      <SectionReveal delay={0.1}>
        <div className="flex flex-wrap gap-2 mb-6">
          {skillCategories.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(i)}
              className="px-3 py-1.5 font-pixel text-[6px] uppercase tracking-wider transition-all duration-300"
              style={{
                color: activeCategory === i ? "var(--bg)" : "var(--text-muted)",
                background: activeCategory === i ? "var(--accent)" : "transparent",
                border: `1px solid ${activeCategory === i ? "var(--accent)" : "var(--border-color)"}`,
              }}
            >
              {categoryIcons[cat.name] || "◆"} {cat.name}
            </button>
          ))}
        </div>
      </SectionReveal>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-2.5"
        >
          {skillCategories[activeCategory].skills.map((skill, i) => {
            const base = proficiencyBase[skill.proficiency];
            const pct = getSkillPct(skill.name, skill.proficiency);
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3"
              >
                <span
                  className="font-mono text-[11px] w-28 shrink-0 text-right"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {skill.name}
                </span>

                <div
                  className="flex-1 h-4 relative overflow-hidden"
                  style={{
                    background: "rgba(124, 58, 237, 0.06)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: i * 0.04 + 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full relative"
                    style={{ background: base.color }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(10,0,21,0.3) 6px, rgba(10,0,21,0.3) 8px)",
                      }}
                    />
                  </motion.div>
                </div>

                <span
                  className="font-pixel text-[5px] w-10 shrink-0"
                  style={{ color: base.color }}
                >
                  {base.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <SectionReveal delay={0.3}>
        <div className="mt-6 flex items-center gap-4">
          {Object.entries(proficiencyBase).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-3 h-3" style={{ background: val.color }} />
              <span className="font-pixel text-[5px]" style={{ color: "var(--text-muted)" }}>{val.label}</span>
            </div>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
