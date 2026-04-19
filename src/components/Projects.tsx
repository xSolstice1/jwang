"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { projects } from "@/data/portfolio";
import PipelineFlow from "./PipelineFlow";

export default function Projects() {
  const [activeProject, setActiveProject] = useState(projects[0].id);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);

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

  return (
    <section id="projects" className="py-12 sm:py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-12">
            <span className="terminal-text text-sm text-[var(--neon-blue)]">03.</span>
            <h2 className="text-2xl font-bold text-white">Projects</h2>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setActiveProject(project.id)}
                className={`px-4 py-2 rounded-lg text-sm terminal-text transition-all ${
                  activeProject === project.id
                    ? "bg-[var(--neon-blue)]/10 border border-[var(--neon-blue)]/30 text-[var(--neon-blue)]"
                    : "bg-white/5 border border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/10"
                }`}
              >
                {project.title}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {projects
              .filter((p) => p.id === activeProject)
              .map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card rounded-xl overflow-hidden"
                >
                  <div className="p-4 sm:p-6 md:p-8 border-b border-white/5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">{project.title}</h3>
                      <span className="terminal-text text-xs text-gray-500 mt-1 sm:mt-0">
                        {project.company}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                          Problem
                        </h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {project.problem}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                          Architecture
                        </h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {project.architecture}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 md:p-8 border-b border-white/5">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
                      Pipeline Architecture
                    </h4>
                    <PipelineFlow nodes={project.pipeline} />
                  </div>

                  {project.screenshots && project.screenshots.length > 0 && (
                    <div className="p-4 sm:p-6 md:p-8 border-b border-white/5">
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
                        Screenshots
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {project.screenshots.map((src, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setLightbox({ src, alt: `${project.title} screenshot ${i + 1}` })}
                            className="relative aspect-video rounded-lg overflow-hidden border border-white/5 bg-white/[0.02] cursor-zoom-in group"
                          >
                            <Image
                              src={src}
                              alt={`${project.title} screenshot ${i + 1}`}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 640px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                              </svg>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4 sm:p-6 md:p-8 grid md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                        Impact
                      </h4>
                      <ul className="space-y-2">
                        {project.impact.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-400"
                          >
                            <span className="text-[var(--neon-green)] mt-0.5 shrink-0">▸</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                        Tech Stack
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 text-xs terminal-text rounded bg-white/5 text-gray-400 border border-white/5"
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
        </motion.div>
      </div>
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
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
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
