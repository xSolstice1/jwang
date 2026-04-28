"use client";

import { profile } from "@/data/portfolio";
import SectionReveal from "./SectionReveal";

export default function Contact() {
  return (
    <section id="contact" className="p-6 sm:p-8">
      <div className="max-w-2xl mx-auto text-center">
        <SectionReveal>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span
              className="font-mono text-[10px] tracking-widest"
              style={{ color: "var(--accent)" }}
            >
              05
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">Contact</h2>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            Open to opportunities in Data Engineering, AI Infrastructure,
            Software Engineering, and Platform Engineering. If you&apos;re
            building something interesting, let&apos;s talk.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <a
              href={`mailto:${profile.email}`}
              className="group relative px-6 py-3 text-sm font-mono tracking-wide overflow-hidden"
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
              className="px-6 py-3 text-sm font-medium tracking-wide uppercase border transition-all duration-300"
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
              className="px-6 py-3 text-sm font-medium tracking-wide uppercase border transition-all duration-300"
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
          <div className="card rounded-lg p-5 font-mono text-xs text-left max-w-sm mx-auto">
            <div className="mb-2" style={{ color: "var(--text-muted)" }}>
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
