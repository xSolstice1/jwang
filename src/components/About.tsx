"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/portfolio";
import SectionReveal from "./SectionReveal";
import TextReveal from "./TextReveal";

export default function About() {
  return (
    <section id="about" className="p-6 sm:p-8">
      <SectionReveal>
        <div className="flex items-center gap-3 mb-6">
          <span
            className="font-pixel text-[7px] tracking-widest"
            style={{ color: "var(--gold)" }}
          >
            ◆
          </span>
          <h2 className="font-pixel text-[10px] sm:text-xs text-white tracking-wider">ORIGIN STORY</h2>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, var(--border-color), transparent)" }} />
        </div>
      </SectionReveal>

      <div className="grid md:grid-cols-[3fr_2fr] gap-8">
        <div className="space-y-4">
          {profile.about.map((paragraph, i) => (
            <TextReveal
              key={i}
              text={paragraph}
              className="text-sm leading-[1.7]"
            />
          ))}
        </div>

        <SectionReveal delay={0.2} clip>
          <motion.div
            className="card rounded-sm p-5 h-fit"
            whileHover={{ y: -3 }}
            transition={{ duration: 0.3 }}
            style={{ border: "1px solid rgba(124, 58, 237, 0.15)" }}
          >
            <div className="font-mono text-xs space-y-2.5">
              <div style={{ color: "var(--text-muted)" }}>
                <span className="font-pixel text-[6px]" style={{ color: "var(--gold)" }}>{"// "}</span>
                <span className="font-pixel text-[6px]" style={{ color: "var(--text-muted)" }}>config.ts</span>
              </div>
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
        </SectionReveal>
      </div>
    </section>
  );
}
