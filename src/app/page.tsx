"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import SystemThinking from "@/components/SystemThinking";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const AnimatedBackground = dynamic(
  () => import("@/components/AnimatedBackground"),
  { ssr: false }
);
const Terminal = dynamic(() => import("@/components/Terminal"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});
const LoadingScreen = dynamic(() => import("@/components/LoadingScreen"), {
  ssr: false,
});
const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), {
  ssr: false,
});
const GrainOverlay = dynamic(() => import("@/components/GrainOverlay"), {
  ssr: false,
});
const LightSpears = dynamic(() => import("@/components/LightSpears"), {
  ssr: false,
});

export default function Home() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const onLoadComplete = useCallback(() => setLoaded(true), []);

  return (
    <>
      <CustomCursor />
      <GrainOverlay />
      <LightSpears />

      <AnimatePresence>
        {!loaded && <LoadingScreen onComplete={onLoadComplete} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative min-h-screen overflow-x-clip"
      >
        <AnimatedBackground />

        <Navbar
          terminalOpen={terminalOpen}
          onToggleTerminal={() => setTerminalOpen(!terminalOpen)}
        />

        <AnimatePresence>
          {terminalOpen && <Terminal onClose={() => setTerminalOpen(false)} />}
        </AnimatePresence>

        <SmoothScroll>
          <main className="relative z-10">
            <Hero />
            <div
              className="relative h-32 -mt-16 pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, transparent, var(--bg) 70%)",
              }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                <div className="md:col-span-2 lg:col-span-2 bento-card">
                  <About />
                </div>
                <div className="md:col-span-1 bento-card">
                  <SystemThinking />
                </div>
                <div className="md:col-span-1 lg:col-span-2 bento-card">
                  <Experience />
                </div>
                <div className="md:col-span-1 lg:col-span-1 bento-card">
                  <Education />
                </div>
                <div className="md:col-span-2 lg:col-span-3 bento-card">
                  <Projects />
                </div>
                <div className="md:col-span-2 lg:col-span-3 bento-card">
                  <Contact />
                </div>
              </div>
            </div>
          </main>

          <Footer />
        </SmoothScroll>
      </motion.div>
    </>
  );
}
