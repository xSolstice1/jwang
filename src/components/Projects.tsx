"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { projects } from "@/data/portfolio";
import PipelineFlow from "./PipelineFlow";
import SectionReveal from "./SectionReveal";
import ScrollParallax from "./ScrollParallax";
import StrokeText from "./StrokeText";

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const gyroActive = useRef(false);
  const baseOrientation = useRef<{ beta: number; gamma: number } | null>(null);

  const applyTransform = useCallback((rotY: number, rotX: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `perspective(800px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale3d(1.01,1.01,1.01)`;
  }, []);

  const resetTransform = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(800px) rotateY(0) rotateX(0) scale3d(1,1,1)";
    gyroActive.current = false;
    baseOrientation.current = null;
  }, []);

  // Desktop: mouse
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    applyTransform(x * 6, -y * 6);
  }, [applyTransform]);

  // iOS: touch position
  const onTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isIOS()) return;
    const el = ref.current;
    if (!el) return;
    const touch = e.touches[0];
    const rect = el.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width - 0.5;
    const y = (touch.clientY - rect.top) / rect.height - 0.5;
    applyTransform(x * 8, -y * 8);
  }, [applyTransform]);

  // Android: gyro on touch start
  const onGyro = useCallback((e: DeviceOrientationEvent) => {
    if (!gyroActive.current || e.beta == null || e.gamma == null) return;
    if (!baseOrientation.current) {
      baseOrientation.current = { beta: e.beta, gamma: e.gamma };
      return;
    }
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
    const gamma = clamp(e.gamma - baseOrientation.current.gamma, -30, 30);
    const beta = clamp(e.beta - baseOrientation.current.beta, -30, 30);
    applyTransform((gamma / 30) * 8, -(beta / 30) * 8);
  }, [applyTransform]);

  const onTouchStart = useCallback(() => {
    if (isIOS()) return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouch) return;
    gyroActive.current = true;
    baseOrientation.current = null;
    window.addEventListener("deviceorientation", onGyro);
  }, [onGyro]);

  const onTouchEnd = useCallback(() => {
    if (!isIOS()) {
      window.removeEventListener("deviceorientation", onGyro);
    }
    resetTransform();
  }, [onGyro, resetTransform]);

  useEffect(() => {
    return () => {
      window.removeEventListener("deviceorientation", onGyro);
    };
  }, [onGyro]);

  return { ref, onMove, onLeave: resetTransform, onTouchStart, onTouchMove, onTouchEnd };
}

const projectCategories = [
  { label: "All", filter: null },
  { label: "Data & AI", filter: (p: typeof projects[0]) => ["Neo4j", "Snowflake", "GraphRAG", "AWS Bedrock", "dbt"].some((t) => p.techStack.includes(t)) },
  { label: "Cloud & Infra", filter: (p: typeof projects[0]) => ["AWS", "Terraform", "Docker", "AWS Batch", "ECR", "S3", "Firebase"].some((t) => p.techStack.includes(t)) },
  { label: "Full-Stack", filter: (p: typeof projects[0]) => ["React", "Next.js", "FastAPI", ".NET", "Go", "Electron"].some((t) => p.techStack.includes(t)) },
];

export default function Projects() {
  const [activeProject, setActiveProject] = useState(projects[0].id);
  const [lightbox, setLightbox] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const tilt = useTilt();

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const filteredProjects = useMemo(() => {
    const cat = projectCategories[activeCategory];
    return cat.filter ? projects.filter(cat.filter) : projects;
  }, [activeCategory]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, closeLightbox]);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section id="projects" className="py-16 sm:py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionReveal>
          <div className="flex items-center gap-4 mb-16">
            <ScrollParallax speed={-0.15}>
              <span
                className="font-mono text-xs tracking-widest"
                style={{ color: "var(--accent)" }}
              >
                03
              </span>
            </ScrollParallax>
            <StrokeText text="Projects" className="text-2xl sm:text-3xl font-bold" />
            <div
              className="flex-1 h-px"
              style={{ background: "var(--border-color)" }}
            />
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-4">
            {projectCategories.map((cat, i) => (
              <button
                key={cat.label}
                onClick={() => {
                  setActiveCategory(i);
                  const available = cat.filter ? projects.filter(cat.filter) : projects;
                  if (available.length > 0 && !available.find((p) => p.id === activeProject)) {
                    setActiveProject(available[0].id);
                  }
                }}
                className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded-full transition-all duration-300"
                style={{
                  color: activeCategory === i ? "var(--bg)" : "var(--text-muted)",
                  background: activeCategory === i ? "var(--purple)" : "transparent",
                  border: `1px solid ${activeCategory === i ? "var(--purple)" : "var(--border-color)"}`,
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-10">
            {filteredProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => setActiveProject(project.id)}
                className="px-5 py-2.5 text-xs font-mono uppercase tracking-wider transition-all duration-300"
                style={{
                  color:
                    activeProject === project.id
                      ? "var(--bg)"
                      : "var(--text-muted)",
                  background:
                    activeProject === project.id
                      ? "var(--accent)"
                      : "var(--surface)",
                  border: `1px solid ${
                    activeProject === project.id
                      ? "var(--accent)"
                      : "var(--border-color)"
                  }`,
                }}
              >
                {project.title}
              </button>
            ))}
          </div>
        </SectionReveal>

        <AnimatePresence mode="wait">
          {filteredProjects
            .filter((p) => p.id === activeProject)
            .map((project) => (
              <motion.div
                key={project.id}
                ref={tilt.ref}
                onMouseMove={tilt.onMove}
                onMouseLeave={tilt.onLeave}
                onTouchStart={tilt.onTouchStart}
                onTouchMove={tilt.onTouchMove}
                onTouchEnd={tilt.onTouchEnd}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease }}
                className="rounded-xl overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  transition: "transform 0.15s ease-out, border-color 0.4s ease",
                  willChange: "transform",
                }}
              >
                <div className="p-6 sm:p-8 md:p-10" style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {project.title}
                    </h3>
                    <span
                      className="font-mono text-[11px] uppercase tracking-widest mt-1 sm:mt-0"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {project.company}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4
                        className="text-[10px] font-medium uppercase tracking-[0.2em] mb-3"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Problem
                      </h4>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {project.problem}
                      </p>
                    </div>
                    <div>
                      <h4
                        className="text-[10px] font-medium uppercase tracking-[0.2em] mb-3"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Architecture
                      </h4>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {project.architecture}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 md:p-10" style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <h4
                    className="text-[10px] font-medium uppercase tracking-[0.2em] mb-6"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Pipeline Architecture
                  </h4>
                  <PipelineFlow nodes={project.pipeline} />
                </div>

                {project.screenshots && project.screenshots.length > 0 && (
                  <div className="p-6 sm:p-8 md:p-10" style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <h4
                      className="text-[10px] font-medium uppercase tracking-[0.2em] mb-6"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Screenshots
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {project.screenshots.map((src, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() =>
                            setLightbox({
                              src,
                              alt: `${project.title} screenshot ${i + 1}`,
                            })
                          }
                          className="relative aspect-video rounded-lg overflow-hidden group"
                          style={{
                            border: "1px solid var(--border-color)",
                            background: "var(--surface)",
                          }}
                        >
                          <Image
                            src={src}
                            alt={`${project.title} screenshot ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                              />
                            </svg>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-6 sm:p-8 md:p-10 grid md:grid-cols-2 gap-8">
                  <div>
                    <h4
                      className="text-[10px] font-medium uppercase tracking-[0.2em] mb-4"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Impact
                    </h4>
                    <ul className="space-y-2.5">
                      {project.impact.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <span
                            className="mt-1.5 shrink-0 w-1 h-1 rounded-full"
                            style={{ background: "var(--accent)" }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4
                      className="text-[10px] font-medium uppercase tracking-[0.2em] mb-4"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded"
                          style={{
                            color: "var(--text-secondary)",
                            background: "var(--surface)",
                            border: "1px solid var(--border-color)",
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(10px)" }}
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease }}
              className="relative max-w-[90vw] max-h-[90vh] w-auto h-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="max-w-full max-h-[90vh] rounded-lg object-contain"
              />
              <button
                type="button"
                onClick={closeLightbox}
                className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors duration-300"
                style={{
                  background: "rgba(0,0,0,0.6)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
