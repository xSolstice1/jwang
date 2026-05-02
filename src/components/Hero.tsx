"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import GlitchText from "./GlitchText";
import dynamic from "next/dynamic";

const HelixCanvas = dynamic(() => import("./HelixCanvas"), { ssr: false });
const PipelineRunner = dynamic(() => import("./PipelineRunner"), { ssr: false });

const roles = [
  "Data Engineer",
  "AI Systems Builder",
  "Software Engineer",
  "Pipeline Architect",
];

const techStack = [
  "Python", "TypeScript", "React", "Neo4j", "AWS", "GraphRAG", "Go",
  "Snowflake", "Terraform", "Docker", "FastAPI", "Next.js",
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

function MagneticButton({ children, href, className, style, onMouseEnter, onMouseLeave }: {
  children: React.ReactNode;
  href: string;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  }, []);

  const onLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0, 0)";
    onMouseLeave?.(e);
  }, [onMouseLeave]);

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      style={{ ...style, transition: "transform 0.6s cubic-bezier(0.33, 1, 0.68, 1)" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </a>
  );
}

function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const COUNT = isTouch ? 20 : 35;
    let animId: number;

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      r: number; alpha: number; hue: number;
    }

    const particles: Particle[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: 1 + Math.random() * 2.5,
          alpha: 0.3 + Math.random() * 0.5,
          hue: Math.random() > 0.5 ? 0 : 1,
        });
      }
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      for (let hue = 0; hue < 2; hue++) {
        const [r, g, b] = hue === 0 ? [124, 58, 237] : [236, 72, 153];

        ctx.beginPath();
        for (const p of particles) {
          if (p.hue !== hue) continue;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;

          ctx.moveTo(p.x + p.r, p.y);
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        }
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.45)`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.85 }}
    />
  );
}

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92]);
  const leftY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const rightY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const marqueeY = useTransform(scrollYProgress, [0, 1], [0, 80]);

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

  useEffect(() => {
    const onPointer = (x: number, y: number) => {
      const el = glowRef.current;
      if (!el) return;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      el.style.left = `${x - rect.left}px`;
      el.style.top = `${y - rect.top}px`;
      el.style.opacity = "1";
    };

    const onMouse = (e: MouseEvent) => onPointer(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onPointer(t.clientX, t.clientY);
    };
    const onLeave = () => {
      const el = glowRef.current;
      if (el) el.style.opacity = "0";
    };

    const section = sectionRef.current;
    if (!section) return;

    section.addEventListener("mousemove", onMouse);
    section.addEventListener("touchmove", onTouch, { passive: true });
    section.addEventListener("mouseleave", onLeave);
    section.addEventListener("touchend", onLeave);

    return () => {
      section.removeEventListener("mousemove", onMouse);
      section.removeEventListener("touchmove", onTouch);
      section.removeEventListener("mouseleave", onLeave);
      section.removeEventListener("touchend", onLeave);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] flex items-center px-4 sm:px-6">
      <div className="absolute inset-0 overflow-hidden">
        <HelixCanvas />
      </div>
      <div className="absolute inset-0 overflow-hidden">
        <HeroParticles />
      </div>
      <div
        ref={glowRef}
        aria-hidden="true"
        className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "min(600px, 80vw)",
          height: "min(600px, 80vw)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(239,68,68,0.1) 0%, rgba(124,58,237,0.05) 40%, transparent 70%)",
          opacity: 0,
          transition: "opacity 0.4s ease",
          zIndex: 1,
        }}
      />

      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="max-w-7xl mx-auto w-full relative z-10 py-20 sm:py-0"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-16 items-center">
          <motion.div style={{ y: leftY }} className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
              className="font-mono text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-6 sm:mb-8"
              style={{ color: "var(--accent)" }}
            >
              <span className="opacity-50">&gt;_</span> portfolio.render()
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease }}
              className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-2"
            >
              <span className="text-white">Ang </span>
              <GlitchText text="Jin Wei" className="gradient-shimmer" autoGlitch />
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 1.0, ease }}
              className="origin-left lg:origin-left origin-center mx-auto lg:mx-0 mb-5 sm:mb-6"
              style={{
                height: "2px",
                width: "120px",
                background: "linear-gradient(90deg, var(--accent), var(--purple), transparent)",
                boxShadow: "0 0 12px rgba(124, 58, 237, 0.4)",
              }}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="h-8 sm:h-10 flex items-start justify-center lg:justify-start mb-5 sm:mb-8"
            >
              <span
                className="font-mono text-base sm:text-xl md:text-2xl"
                style={{ color: "var(--text-secondary)" }}
              >
                {displayed}
                <span className="animate-blink" style={{ color: "var(--accent)" }}>|</span>
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4, ease }}
              className="text-sm sm:text-base md:text-lg max-w-lg mx-auto lg:mx-0 mb-8 sm:mb-10 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              I build scalable data systems, AI pipelines, and software that power intelligent applications.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6, ease }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <MagneticButton
                href="#projects"
                className="group relative px-8 sm:px-10 py-3.5 sm:py-4 text-sm font-medium tracking-wide uppercase overflow-hidden text-center"
                style={{ color: "var(--bg)", background: "var(--accent)" }}
              >
                <span className="relative z-10">View Projects</span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </MagneticButton>
              <MagneticButton
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
              </MagneticButton>
            </motion.div>

            {/* Mobile game */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8, ease }}
              className="lg:hidden mt-6 h-[300px]"
            >
              <PipelineRunner />
            </motion.div>
          </motion.div>

          {/* Right: Pipeline Runner game */}
          <motion.div
            style={{ y: rightY }}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease }}
            className="hidden lg:block h-[480px]"
          >
            <PipelineRunner />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          style={{ y: marqueeY }}
          className="mt-12 sm:mt-20 overflow-hidden"
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span
          className="font-mono text-[9px] uppercase tracking-[0.2em] sm:hidden"
          style={{ color: "var(--text-muted)" }}
        >
          scroll
        </span>
        <a href="#about" className="animate-float block">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300"
            style={{ color: "var(--text-muted)" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
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
    </section>
  );
}
