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
import Skills from "@/components/Skills";
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

export default function Home() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const onLoadComplete = useCallback(() => setLoaded(true), []);

  return (
    <>
      <CustomCursor />
      <GrainOverlay />

      <AnimatePresence>
        {!loaded && <LoadingScreen onComplete={onLoadComplete} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative min-h-screen"
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
            <Divider />
            <About />
            <Divider />
            <Experience />
            <Divider />
            <Projects />
            <Divider />
            <SystemThinking />
            <Divider />
            <Education />
            <Divider />
            <Skills />
            <Divider />
            <Contact />
          </main>

          <Footer />
        </SmoothScroll>
      </motion.div>
    </>
  );
}

function Divider() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div
        className="h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--border-color), transparent)",
        }}
      />
    </div>
  );
}
