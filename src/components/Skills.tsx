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

export default function Skills() {
  return (
    <section id="skills" className="py-24 sm:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionReveal>
          <div className="flex items-center gap-4 mb-16">
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
        </SectionReveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {skillCategories.map((category, i) => {
            const colors = colorMap[category.color] || colorMap["neon-blue"];
            return (
              <SectionReveal key={category.name} delay={i * 0.08}>
                <motion.div
                  className="card rounded-xl p-7 group"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3
                    className="font-mono text-xs font-medium uppercase tracking-widest mb-5"
                    style={{ color: colors.text }}
                  >
                    {category.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, j) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 + j * 0.03 }}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1.5 text-[11px] font-mono rounded transition-all duration-300"
                        style={{
                          color: colors.text,
                          background: `color-mix(in srgb, ${colors.accent} 8%, transparent)`,
                          border: `1px solid color-mix(in srgb, ${colors.accent} 15%, transparent)`,
                        }}
                      >
                        {skill}
                      </motion.span>
                    ))}
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
