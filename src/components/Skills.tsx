"use client";

import { motion } from "framer-motion";
import { skillCategories } from "@/data/portfolio";
import SectionReveal from "./SectionReveal";
import ScrollParallax from "./ScrollParallax";
import StrokeText from "./StrokeText";

const colorMap: Record<string, { text: string; accent: string }> = {
  "neon-blue": { text: "var(--accent)", accent: "var(--accent)" },
  "neon-purple": { text: "var(--purple)", accent: "var(--purple)" },
  "neon-green": { text: "var(--green)", accent: "var(--green)" },
};

const proficiencyStyles = {
  core: { scale: 1, opacity: 1, borderMix: "20%", bgMix: "12%", fontSize: "12px", py: "py-2", px: "px-4" },
  proficient: { scale: 1, opacity: 0.85, borderMix: "12%", bgMix: "6%", fontSize: "11px", py: "py-1.5", px: "px-3" },
  familiar: { scale: 1, opacity: 0.6, borderMix: "8%", bgMix: "4%", fontSize: "10px", py: "py-1", px: "px-2.5" },
};

export default function Skills() {
  return (
    <section id="skills" className="py-16 sm:py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionReveal>
          <div className="flex items-center gap-4 mb-4">
            <ScrollParallax speed={-0.15}>
              <span
                className="font-mono text-xs tracking-widest"
                style={{ color: "var(--accent)" }}
              >
                05
              </span>
            </ScrollParallax>
            <StrokeText text="Skills" className="text-2xl sm:text-3xl font-bold" />
            <div
              className="flex-1 h-px"
              style={{ background: "var(--border-color)" }}
            />
          </div>
          <div className="flex items-center gap-4 mb-16 font-mono text-[10px] tracking-wider" style={{ color: "var(--text-muted)" }}>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: "var(--accent)", opacity: 1 }} />
              Core
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)", opacity: 0.6 }} />
              Proficient
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-1 h-1 rounded-full" style={{ background: "var(--accent)", opacity: 0.35 }} />
              Familiar
            </span>
          </div>
        </SectionReveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {skillCategories.map((category, i) => {
            const colors = colorMap[category.color] || colorMap["neon-blue"];
            const sorted = [...category.skills].sort((a, b) => {
              const order = { core: 0, proficient: 1, familiar: 2 };
              return order[a.proficiency] - order[b.proficiency];
            });
            return (
              <SectionReveal key={category.name} delay={i * 0.08}>
                <motion.div
                  className="card rounded-xl p-5 sm:p-7 group"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3
                    className="font-mono text-xs font-medium uppercase tracking-widest mb-5"
                    style={{ color: colors.text }}
                  >
                    {category.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 items-center">
                    {sorted.map((skill, j) => {
                      const ps = proficiencyStyles[skill.proficiency];
                      return (
                        <motion.span
                          key={skill.name}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: ps.opacity, scale: ps.scale }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 + j * 0.03 }}
                          whileHover={{ scale: 1.08, opacity: 1 }}
                          className={`${ps.px} ${ps.py} font-mono rounded transition-all duration-300`}
                          style={{
                            fontSize: ps.fontSize,
                            color: colors.text,
                            background: `color-mix(in srgb, ${colors.accent} ${ps.bgMix}, transparent)`,
                            border: `1px solid color-mix(in srgb, ${colors.accent} ${ps.borderMix}, transparent)`,
                          }}
                        >
                          {skill.name}
                        </motion.span>
                      );
                    })}
                  </div>
                </motion.div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
