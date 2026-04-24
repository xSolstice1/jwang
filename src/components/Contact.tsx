"use client";

import { profile } from "@/data/portfolio";
import SectionReveal from "./SectionReveal";
import ScrollParallax from "./ScrollParallax";
import StrokeText from "./StrokeText";

export default function Contact() {
  return (
    <section id="contact" className="py-24 sm:py-32 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <SectionReveal>
          <div className="flex items-center justify-center gap-4 mb-16">
            <div
              className="flex-1 h-px max-w-[80px]"
              style={{ background: "var(--border-color)" }}
            />
            <ScrollParallax speed={-0.15}>
              <span
                className="font-mono text-xs tracking-widest"
                style={{ color: "var(--accent)" }}
              >
                06
              </span>
            </ScrollParallax>
            <StrokeText text="Contact" className="text-2xl sm:text-3xl font-bold" />
            <div
              className="flex-1 h-px max-w-[80px]"
              style={{ background: "var(--border-color)" }}
            />
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <p
            className="text-base leading-relaxed mb-10"
            style={{ color: "var(--text-secondary)" }}
          >
            Open to opportunities in Data Engineering, AI Infrastructure,
            Software Engineering, and Platform Engineering. If you&apos;re
            building something interesting, let&apos;s talk.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <a
              href={`mailto:${profile.email}`}
              className="group relative px-10 py-4 text-sm font-mono tracking-wide overflow-hidden"
              style={{
                color: "var(--bg)",
                background: "var(--accent)",
              }}
            >
              <span className="relative z-10">{profile.email}</span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 text-sm font-medium tracking-wide uppercase border transition-all duration-300"
              style={{
                color: "var(--text-secondary)",
                borderColor: "var(--border-color)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-color)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              LinkedIn
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 text-sm font-medium tracking-wide uppercase border transition-all duration-300"
              style={{
                color: "var(--text-secondary)",
                borderColor: "var(--border-color)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-color)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              GitHub
            </a>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.3}>
          <div className="card rounded-xl p-7 font-mono text-xs text-left max-w-md mx-auto">
            <div className="mb-3" style={{ color: "var(--text-muted)" }}>
              // open to
            </div>
            <div className="space-y-1">
              <div>
                <span style={{ color: "var(--purple)" }}>roles</span>
                <span style={{ color: "var(--text-muted)" }}>: [</span>
              </div>
              {[
                "Data Engineer",
                "AI/ML Engineer",
                "Software Engineer",
                "Platform Engineer",
              ].map((role) => (
                <div key={role} className="pl-4" style={{ color: "var(--green)" }}>
                  &quot;{role}&quot;,
                </div>
              ))}
              <div style={{ color: "var(--text-muted)" }}>]</div>
              <div>
                <span style={{ color: "var(--purple)" }}>location</span>
                <span style={{ color: "var(--text-muted)" }}>: </span>
                <span style={{ color: "var(--green)" }}>
                  &quot;Singapore&quot;
                </span>
              </div>
              <div>
                <span style={{ color: "var(--purple)" }}>status</span>
                <span style={{ color: "var(--text-muted)" }}>: </span>
                <span style={{ color: "var(--accent)" }}>
                  &quot;Available&quot;
                </span>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
