"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/portfolio";

export default function About() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-12">
            <span className="terminal-text text-sm text-[var(--neon-blue)]">01.</span>
            <h2 className="text-2xl font-bold text-white">About</h2>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid md:grid-cols-[2fr_1fr] gap-6 sm:gap-8 md:gap-12">
            <div className="space-y-4">
              {profile.about.map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="text-gray-400 leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="glass-card rounded-lg p-4 sm:p-6 h-fit"
            >
              <div className="terminal-text text-xs space-y-3">
                <div className="text-gray-500">// config.ts</div>
                <div>
                  <span className="text-[var(--neon-purple)]">const</span>{" "}
                  <span className="text-white">engineer</span>{" "}
                  <span className="text-gray-500">=</span>{" "}
                  <span className="text-gray-500">{"{"}</span>
                </div>
                <div className="pl-4">
                  <span className="text-[var(--neon-blue)]">name</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-[var(--neon-green)]">&quot;Ang Jin Wei&quot;</span>
                  <span className="text-gray-500">,</span>
                </div>
                <div className="pl-4">
                  <span className="text-[var(--neon-blue)]">focus</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-[var(--neon-green)]">&quot;Data + AI&quot;</span>
                  <span className="text-gray-500">,</span>
                </div>
                <div className="pl-4">
                  <span className="text-[var(--neon-blue)]">location</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-[var(--neon-green)]">&quot;Singapore&quot;</span>
                  <span className="text-gray-500">,</span>
                </div>
                <div className="pl-4">
                  <span className="text-[var(--neon-blue)]">thinks_in</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-[var(--neon-green)]">&quot;Systems&quot;</span>
                  <span className="text-gray-500">,</span>
                </div>
                <div>
                  <span className="text-gray-500">{"}"}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
