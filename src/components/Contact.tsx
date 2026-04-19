"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/portfolio";

export default function Contact() {
  return (
    <section id="contact" className="py-12 sm:py-16 md:py-24 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="flex-1 h-px bg-white/10 max-w-[80px]" />
            <span className="terminal-text text-sm text-[var(--neon-blue)]">06.</span>
            <h2 className="text-2xl font-bold text-white">Contact</h2>
            <div className="flex-1 h-px bg-white/10 max-w-[80px]" />
          </div>

          <p className="text-gray-400 mb-8 leading-relaxed">
            Open to opportunities in Data Engineering, AI Infrastructure, Software Engineering, and Platform Engineering.
            If you&apos;re building something interesting, let&apos;s talk.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href={`mailto:${profile.email}`}
              className="px-8 py-3 rounded-lg bg-[var(--neon-blue)]/10 border border-[var(--neon-blue)]/30 text-[var(--neon-blue)] hover:bg-[var(--neon-blue)]/20 transition-all text-sm font-medium terminal-text"
            >
              {profile.email}
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:border-white/20 hover:text-white transition-all text-sm font-medium"
            >
              LinkedIn
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:border-white/20 hover:text-white transition-all text-sm font-medium"
            >
              GitHub
            </a>
          </div>

          <div className="glass-card rounded-lg p-6 terminal-text text-xs text-left max-w-md mx-auto">
            <div className="text-gray-600 mb-2">// open to</div>
            <div className="space-y-1">
              <div>
                <span className="text-[var(--neon-purple)]">roles</span>
                <span className="text-gray-600">: [</span>
              </div>
              <div className="pl-4 text-[var(--neon-green)]">&quot;Data Engineer&quot;,</div>
              <div className="pl-4 text-[var(--neon-green)]">&quot;AI/ML Engineer&quot;,</div>
              <div className="pl-4 text-[var(--neon-green)]">&quot;Software Engineer&quot;,</div>
              <div className="pl-4 text-[var(--neon-green)]">&quot;Platform Engineer&quot;,</div>
              <div>
                <span className="text-gray-600">]</span>
              </div>
              <div>
                <span className="text-[var(--neon-purple)]">location</span>
                <span className="text-gray-600">: </span>
                <span className="text-[var(--neon-green)]">&quot;Singapore&quot;</span>
              </div>
              <div>
                <span className="text-[var(--neon-purple)]">status</span>
                <span className="text-gray-600">: </span>
                <span className="text-[var(--neon-blue)]">&quot;Available&quot;</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
