"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/portfolio";
import SectionReveal from "./SectionReveal";
import TextReveal from "./TextReveal";
import ScrollParallax from "./ScrollParallax";
import StrokeText from "./StrokeText";

export default function About() {
  return (
    <section id="about" className="py-24 sm:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionReveal>
          <div className="flex items-center gap-4 mb-16">
            <ScrollParallax speed={-0.15}>
              <span
                className="font-mono text-xs tracking-widest"
                style={{ color: "var(--accent)" }}
              >
                01
              </span>
            </ScrollParallax>
            <StrokeText text="About" className="text-2xl sm:text-3xl font-bold" />
            <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
          </div>
        </SectionReveal>

        <div className="grid md:grid-cols-[3fr_2fr] gap-16">
          <div className="space-y-6">
            {profile.about.map((paragraph, i) => (
              <TextReveal
                key={i}
                text={paragraph}
                className="text-base leading-[1.8]"
              />
            ))}
          </div>

          <SectionReveal delay={0.2} clip>
            <ScrollParallax speed={-0.2}>
              <motion.div
                className="card rounded-xl p-6 h-fit"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className="font-mono text-xs space-y-3">
                  <div style={{ color: "var(--text-muted)" }}>// config.ts</div>
                  <div>
                    <span style={{ color: "var(--purple)" }}>const</span>{" "}
                    <span className="text-white">engineer</span>{" "}
                    <span style={{ color: "var(--text-muted)" }}>=</span>{" "}
                    <span style={{ color: "var(--text-muted)" }}>{"{"}</span>
                  </div>
                  {[
                    { key: "name", val: '"Ang Jin Wei"' },
                    { key: "focus", val: '"Data + AI"' },
                    { key: "location", val: '"Singapore"' },
                    { key: "thinks_in", val: '"Systems"' },
                  ].map((item) => (
                    <div key={item.key} className="pl-4">
                      <span style={{ color: "var(--blue)" }}>{item.key}</span>
                      <span style={{ color: "var(--text-muted)" }}>: </span>
                      <span style={{ color: "var(--green)" }}>{item.val}</span>
                      <span style={{ color: "var(--text-muted)" }}>,</span>
                    </div>
                  ))}
                  <div style={{ color: "var(--text-muted)" }}>{"}"}</div>
                </div>
              </motion.div>
            </ScrollParallax>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
