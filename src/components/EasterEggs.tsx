"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "./SoundEngine";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

function MatrixRain({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 1.5);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = window.innerWidth;
    const h = window.innerHeight;
    const fontSize = 14;
    const cols = Math.floor(w / fontSize);
    const drops: number[] = Array(cols).fill(1);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;':\",./<>?~`";

    let frameCount = 0;
    let animId: number;

    const draw = () => {
      ctx.fillStyle = "rgba(5, 5, 7, 0.08)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const brightness = Math.random();
        if (brightness > 0.95) {
          ctx.fillStyle = "#fff";
        } else if (brightness > 0.7) {
          ctx.fillStyle = "#ec4899";
        } else {
          ctx.fillStyle = `rgba(124, 58, 237, ${0.5 + Math.random() * 0.5})`;
        }

        ctx.fillText(char, x, y);

        if (y > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      frameCount++;
      if (frameCount < 300) {
        animId = requestAnimationFrame(draw);
      } else {
        onDone();
      }
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [onDone]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[300]"
      style={{ width: "100%", height: "100%" }}
      onClick={onDone}
    />
  );
}

const HINTS = [
  { id: "scroll-half", text: "psst... try the old cheat code", trigger: "scroll" },
  { id: "interact-3", text: "tap the logo. again. and again...", trigger: "interactions" },
  { id: "mobile", text: "three fingers hold secrets", trigger: "mobile" },
  { id: "terminal", text: "the terminal knows things", trigger: "terminal" },
];

function EasterEggHints() {
  const [hint, setHint] = useState<string | null>(null);
  const shown = useRef<Set<string>>(new Set());
  const interactionCount = useRef(0);
  const hintTimer = useRef<NodeJS.Timeout>(undefined);

  const showHint = useCallback((id: string, text: string) => {
    if (shown.current.has(id)) return;
    if (hint) return;
    shown.current.add(id);
    setHint(text);
    if (hintTimer.current) clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHint(null), 5000);
  }, [hint]);

  // Trigger hints based on section visibility (works with Lenis)
  useEffect(() => {
    const experienceEl = document.getElementById("experience");
    const contactEl = document.getElementById("contact");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target.id === "experience") {
            showHint("scroll-half", "psst... try the old cheat code");
          }
          if (entry.target.id === "contact") {
            showHint("terminal", "the terminal knows things");
          }
        });
      },
      { threshold: 0.2 }
    );

    if (experienceEl) observer.observe(experienceEl);
    if (contactEl) observer.observe(contactEl);

    return () => observer.disconnect();
  }, [showHint]);

  // Trigger logo hint after enough clicks
  useEffect(() => {
    const onClick = () => {
      interactionCount.current++;
      if (interactionCount.current >= 8) {
        showHint("interact-3", "tap the logo. again. and again...");
      }
    };

    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [showHint]);

  // Mobile hint after delay
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouch) return;
    const timer = setTimeout(() => showHint("mobile", "three fingers hold secrets"), 20000);
    return () => clearTimeout(timer);
  }, [showHint]);

  return (
    <AnimatePresence>
      {hint && (
        <motion.div
          key={hint}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-[68px] left-0 right-0 z-[45] flex items-center justify-center"
        >
          <div
            className="w-full py-2.5 px-4 text-center font-mono text-xs sm:text-sm tracking-wide"
            style={{
              background: "linear-gradient(90deg, rgba(124,58,237,0.08), rgba(236,72,153,0.08), rgba(124,58,237,0.08))",
              borderBottom: "1px solid rgba(124,58,237,0.12)",
              color: "var(--text-secondary)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span style={{ color: "var(--purple)" }}>?</span>
            {" "}
            {hint}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function EasterEggs() {
  const [matrixActive, setMatrixActive] = useState(false);
  const konamiPos = useRef(0);
  const logoClicks = useRef(0);
  const logoTimer = useRef<NodeJS.Timeout>(undefined);
  const sound = useSound();

  const endMatrix = useCallback(() => setMatrixActive(false), []);

  // Konami code (desktop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === KONAMI[konamiPos.current]) {
        konamiPos.current++;
        if (konamiPos.current === KONAMI.length) {
          konamiPos.current = 0;
          setMatrixActive(true);
          sound.glitch();
        }
      } else {
        konamiPos.current = 0;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sound]);

  // Logo click easter egg (desktop + mobile)
  useEffect(() => {
    const onClick = (e: MouseEvent | TouchEvent) => {
      const target = (e instanceof TouchEvent ? e.target : e.target) as HTMLElement;
      const logo = target.closest("[data-logo]");
      if (logo) {
        logoClicks.current++;
        if (logoTimer.current) clearTimeout(logoTimer.current);
        logoTimer.current = setTimeout(() => {
          logoClicks.current = 0;
        }, 2000);

        if (logoClicks.current >= 5) {
          logoClicks.current = 0;
          sound.glitch();
          document.documentElement.classList.add("glitch-mode");
          setTimeout(() => {
            document.documentElement.classList.remove("glitch-mode");
          }, 3000);
        }
      }
    };

    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [sound]);

  // 3-finger tap (mobile) — triggers matrix rain
  useEffect(() => {
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length >= 3) {
        setMatrixActive(true);
        sound.glitch();
      }
    };

    window.addEventListener("touchstart", onTouch);
    return () => window.removeEventListener("touchstart", onTouch);
  }, [sound]);

  return (
    <>
      <EasterEggHints />
      <AnimatePresence>
        {matrixActive && <MatrixRain onDone={endMatrix} />}
      </AnimatePresence>
    </>
  );
}
