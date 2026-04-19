"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const roles = [
  "Data Engineer",
  "AI Systems Builder",
  "Software Engineer",
  "Pipeline Architect",
  "Cloud Infrastructure Engineer",
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayed === current) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayed === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    } else if (isDeleting) {
      timeout = setTimeout(() => setDisplayed((prev) => prev.slice(0, -1)), 30);
    } else {
      timeout = setTimeout(
        () => setDisplayed(current.slice(0, displayed.length + 1)),
        60
      );
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, roleIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="terminal-text text-sm text-gray-500 mb-6">
            <span className="text-[var(--neon-green)]">$</span> whoami
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">
            <span className="text-white">Ang</span>{" "}
            <span className="gradient-text">Jin Wei</span>
          </h1>

          <div className="h-10 flex items-center justify-center mb-8">
            <span className="terminal-text text-base sm:text-xl md:text-2xl text-[var(--neon-blue)]">
              {displayed}
              <span className="animate-blink text-[var(--neon-blue)]">|</span>
            </span>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed"
          >
            I build scalable data systems, AI pipelines, and software that power
            intelligent applications.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#projects"
            className="px-8 py-3 rounded-lg bg-[var(--neon-blue)]/10 border border-[var(--neon-blue)]/30 text-[var(--neon-blue)] hover:bg-[var(--neon-blue)]/20 transition-all text-sm font-medium"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-8 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:border-white/20 hover:text-white transition-all text-sm font-medium"
          >
            Get in Touch
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-10 sm:mt-16 flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8 text-xs terminal-text text-gray-600"
        >
          <span>Python</span>
          <span className="text-gray-700">•</span>
          <span>TypeScript</span>
          <span className="text-gray-700">•</span>
          <span>React</span>
          <span className="text-gray-700">•</span>
          <span>Neo4j</span>
          <span className="text-gray-700">•</span>
          <span>AWS</span>
          <span className="text-gray-700">•</span>
          <span>GraphRAG</span>
          <span className="text-gray-700">•</span>
          <span>Go</span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#about" className="animate-float block">
          <svg
            className="w-5 h-5 text-gray-600 hover:text-[var(--neon-blue)] transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
