"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ScrollParallax from "./ScrollParallax";
import dynamic from "next/dynamic";

const HelixCanvas = dynamic(() => import("./HelixCanvas"), { ssr: false });

const roles = [
  "Data Engineer",
  "AI Systems Builder",
  "Software Engineer",
  "Pipeline Architect",
  "Cloud Infrastructure Engineer",
];

const techStack = [
  "Python", "TypeScript", "React", "Neo4j", "AWS", "GraphRAG", "Go",
  "Snowflake", "Terraform", "Docker", "FastAPI", "Next.js",
];

const charVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -80 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      delay: 0.6 + i * 0.04,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const lineVariants = {
  hidden: {
    clipPath: "inset(0 0 100% 0)",
    opacity: 0,
    y: 30,
  },
  visible: (delay: number) => ({
    clipPath: "inset(0 0 0% 0)",
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92]);
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const taglineY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const ctaY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const marqueeY = useTransform(scrollYProgress, [0, 1], [0, 100]);

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

  const nameChars = "Ang Jin Wei".split("");

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] flex items-center justify-center px-4 sm:px-6">
      {/* DNA Helix — desktop only */}
      <div className="absolute inset-0 overflow-hidden">
        <HelixCanvas />
      </div>

      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="max-w-5xl mx-auto text-center w-full"
      >
        <motion.div
          variants={lineVariants}
          custom={0.3}
          initial="hidden"
          animate="visible"
          className="font-mono text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-6 sm:mb-8"
          style={{ color: "var(--accent)" }}
        >
          <span className="opacity-50">&gt;_</span> portfolio.render()
        </motion.div>

        <motion.div style={{ y: nameY }}>
          <h1
            className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 tracking-tight leading-[0.9]"
            style={{ perspective: "600px" }}
          >
            {nameChars.map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={charVariants}
                initial="hidden"
                animate="visible"
                className="inline-block"
                style={{
                  color: i > 3 ? "transparent" : "white",
                  background: i > 3 ? "linear-gradient(135deg, var(--accent), var(--purple))" : "none",
                  WebkitBackgroundClip: i > 3 ? "text" : undefined,
                  backgroundClip: i > 3 ? "text" : undefined,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        <motion.div style={{ y: taglineY }}>
          <motion.div
            variants={lineVariants}
            custom={1.0}
            initial="hidden"
            animate="visible"
          >
            <div className="h-8 sm:h-10 flex items-center justify-center mb-6 sm:mb-10">
              <span
                className="font-mono text-sm sm:text-xl md:text-2xl"
                style={{ color: "var(--text-secondary)" }}
              >
                {displayed}
                <span className="animate-blink" style={{ color: "var(--accent)" }}>
                  |
                </span>
              </span>
            </div>
          </motion.div>

          <motion.p
            variants={lineVariants}
            custom={1.2}
            initial="hidden"
            animate="visible"
            className="text-sm sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-14 leading-relaxed px-2"
            style={{ color: "var(--text-secondary)" }}
          >
            I build scalable data systems, AI pipelines, and software that power
            intelligent applications.
          </motion.p>
        </motion.div>

        <motion.div
          variants={lineVariants}
          custom={1.5}
          initial="hidden"
          animate="visible"
          style={{ y: ctaY }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
        >
          <a
            href="#projects"
            className="group relative px-8 sm:px-10 py-3.5 sm:py-4 text-sm font-medium tracking-wide uppercase overflow-hidden text-center"
            style={{ color: "var(--bg)", background: "var(--accent)" }}
          >
            <span className="relative z-10">View Projects</span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </a>
          <a
            href="#contact"
            className="px-8 sm:px-10 py-3.5 sm:py-4 text-sm font-medium tracking-wide uppercase border transition-colors duration-300 text-center"
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
            Get in Touch
          </a>
        </motion.div>

        <motion.div
          variants={lineVariants}
          custom={2.0}
          initial="hidden"
          animate="visible"
          style={{ y: marqueeY }}
          className="mt-10 sm:mt-20 overflow-hidden"
        >
          <div className="marquee-track">
            <div className="marquee-content">
              {[...techStack, ...techStack].map((t, i) => (
                <span
                  key={i}
                  className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.25em] mx-3 sm:mx-6 whitespace-nowrap"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <ScrollParallax speed={-0.3} className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden sm:block">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <a href="#about" className="animate-float block">
            <svg
              className="w-5 h-5 transition-colors duration-300"
              style={{ color: "var(--text-muted)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-muted)")
              }
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </a>
        </motion.div>
      </ScrollParallax>
    </section>
  );
}
