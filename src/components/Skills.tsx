"use client";

import { motion } from "framer-motion";
import { skillCategories } from "@/data/portfolio";

const colorMap: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  "neon-blue": {
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    glow: "group-hover:shadow-cyan-500/10",
  },
  "neon-purple": {
    text: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    glow: "group-hover:shadow-purple-500/10",
  },
  "neon-green": {
    text: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    glow: "group-hover:shadow-green-500/10",
  },
};

export default function Skills() {
  return (
    <section id="skills" className="py-12 sm:py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-12">
            <span className="terminal-text text-sm text-[var(--neon-blue)]">05.</span>
            <h2 className="text-2xl font-bold text-white">Skills</h2>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {skillCategories.map((category, i) => {
              const colors = colorMap[category.color] || colorMap["neon-blue"];
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="glass-card rounded-xl p-6 group"
                >
                  <h3 className={`terminal-text text-sm font-medium ${colors.text} mb-4`}>
                    {category.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, j) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + j * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        className={`px-3 py-1.5 text-xs terminal-text rounded-lg ${colors.bg} ${colors.text} border ${colors.border} transition-shadow ${colors.glow}`}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
