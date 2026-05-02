"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { SoundProvider } from "@/components/SoundEngine";
import { XPProvider } from "@/components/XPEngine";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import SystemThinking from "@/components/SystemThinking";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MagneticCard from "@/components/MagneticCard";

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
const CRTOverlay = dynamic(() => import("@/components/CRTOverlay"), {
  ssr: false,
});
const EasterEggs = dynamic(() => import("@/components/EasterEggs"), {
  ssr: false,
});

export default function Home() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [crtMode, setCrtMode] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const onLoadComplete = useCallback(() => setLoaded(true), []);
  const replayGame = useCallback(() => {
    setLoaded(false);
    setGameKey(k => k + 1);
  }, []);

  return (
    <SoundProvider>
      <XPProvider>
        <CustomCursor />
        <GrainOverlay />
        <LightSpears />
        <CRTOverlay active={crtMode} />
        <EasterEggs />

        <AnimatePresence>
          {!loaded && <LoadingScreen key={gameKey} onComplete={onLoadComplete} />}
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
            crtMode={crtMode}
            onToggleCRT={() => setCrtMode(!crtMode)}
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
                  background:
                    "linear-gradient(to bottom, transparent, var(--bg) 70%)",
                }}
              />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
                  <MagneticCard className="bento-card" intensity={4}>
                    <About />
                  </MagneticCard>
                  <MagneticCard className="bento-card" intensity={6}>
                    <SystemThinking />
                  </MagneticCard>
                </div>

                <MagneticCard className="bento-card" intensity={3}>
                  <Experience />
                </MagneticCard>

                <MagneticCard className="bento-card" intensity={4}>
                  <Education />
                </MagneticCard>

                <MagneticCard className="bento-card" intensity={2}>
                  <Projects />
                </MagneticCard>

                <MagneticCard className="bento-card" intensity={4}>
                  <Contact />
                </MagneticCard>
              </div>
            </main>

            <Footer />
          </SmoothScroll>

          {/* Floating replay button — fixed top-left under navbar */}
          <button
            onClick={replayGame}
            className="fixed top-[72px] left-3 z-30 font-mono text-[10px] px-3 py-1.5 rounded cursor-pointer tracking-wider uppercase transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(5,5,7,0.7)",
              border: "1px solid rgba(124,58,237,0.15)",
              color: "var(--text-muted)",
              backdropFilter: "blur(8px)",
            }}
          >
            ⚔ Replay Gatekeeper
          </button>
        </motion.div>
      </XPProvider>
    </SoundProvider>
  );
}
