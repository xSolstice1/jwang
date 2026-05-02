"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "./SoundEngine";

const SECTIONS = [
  { id: "about", label: "The Archives" },
  { id: "experience", label: "Battle Log" },
  { id: "education", label: "Training Grounds" },
  { id: "projects", label: "The Forge" },
  { id: "contact", label: "Signal Beacon" },
];

function XPDisplay({ xp, level, maxXp, progress, totalXp, milestones, discovered, sectionsTotal }: {
  xp: number; level: number; maxXp: number; progress: number; totalXp: number;
  milestones: Set<string>; discovered: Set<string>; sectionsTotal: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Thin XP bar */}
      <div className="fixed top-16 left-0 right-0 z-40 pointer-events-none">
        <div className="h-[2px] w-full" style={{ background: "rgba(255,255,255,0.02)" }}>
          <motion.div
            className="h-full"
            style={{ background: "linear-gradient(90deg, var(--accent), var(--purple))" }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Level pill — tap/hover to expand */}
      <div className="fixed top-[72px] right-2 sm:right-4 z-40">
        <motion.button
          onClick={() => setExpanded(e => !e)}
          className="font-mono text-[10px] sm:text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-pointer"
          style={{
            background: "rgba(5,5,7,0.7)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(124,58,237,0.1)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          whileHover={{ borderColor: "rgba(124,58,237,0.3)" }}
          whileTap={{ scale: 0.95 }}
        >
          <span style={{ color: "var(--text-muted)" }}>LV</span>
          <motion.span
            key={level}
            initial={{ scale: 1.4, color: "#ec4899" }}
            animate={{ scale: 1, color: "var(--accent)" }}
            transition={{ duration: 0.4 }}
            className="font-bold"
          >
            {level}
          </motion.span>
          <span className="hidden sm:inline" style={{ color: "var(--text-muted)" }}>
            {xp}/{maxXp}
          </span>
        </motion.button>

        {/* Expanded stats panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-1.5 p-3.5 rounded-lg font-mono text-xs w-52"
              style={{
                background: "rgba(5,5,7,0.95)",
                border: "1px solid rgba(124,58,237,0.15)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* XP bar */}
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <span style={{ color: "var(--text-muted)" }}>Level {level}</span>
                  <span style={{ color: "var(--text-muted)" }}>{xp}/{maxXp} XP</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, var(--accent), var(--purple))" }}
                    animate={{ width: `${progress * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1" style={{ color: "var(--text-secondary)" }}>
                <div className="flex justify-between">
                  <span>Total XP</span>
                  <span style={{ color: "var(--accent)" }}>{totalXp}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sections</span>
                  <span style={{ color: "var(--accent)" }}>{discovered.size}/{sectionsTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Achievements</span>
                  <span style={{ color: "var(--accent)" }}>{milestones.size}</span>
                </div>
              </div>

              <div className="mt-2 pt-2 text-[10px]" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>
                open terminal &rarr; type &apos;xp&apos;
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

const COMBO_WINDOW_MS = 8000;
const COMBO_MULTIPLIERS = [1, 1.5, 2, 3];
const TOAST_DURATION = 2500;
const TOAST_GAP = 600;
const SOUND_THRESHOLD = 10;

interface Toast {
  label: string;
  xp: number;
  combo: number;
  id: number;
}

interface XPContextValue {
  xp: number;
  level: number;
  maxXp: number;
  combo: number;
  totalXp: number;
  discovered: Set<string>;
  milestones: Set<string>;
  addXP: (amount: number, label: string) => void;
  addMilestone: (id: string, label: string, xp: number) => void;
}

const XPContext = createContext<XPContextValue | null>(null);

export function useXP(): XPContextValue {
  const ctx = useContext(XPContext);
  if (!ctx) throw new Error("useXP must be within XPProvider");
  return ctx;
}

let toastId = 0;

export function XPProvider({ children }: { children: ReactNode }) {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [totalXp, setTotalXp] = useState(0);
  const [discovered, setDiscovered] = useState<Set<string>>(new Set());
  const [milestones, setMilestones] = useState<Set<string>>(new Set());
  const [currentToast, setCurrentToast] = useState<Toast | null>(null);
  const [levelUpAnim, setLevelUpAnim] = useState(false);
  const [combo, setCombo] = useState(0);
  const toastQueue = useRef<Toast[]>([]);
  const toastBusy = useRef(false);
  const comboTimer = useRef<NodeJS.Timeout>(undefined);
  const lastGain = useRef(0);
  const sound = useSound();

  const maxXp = level * 100;
  const progress = Math.min(xp / maxXp, 1);

  const processQueue = useCallback(() => {
    if (toastBusy.current || toastQueue.current.length === 0) return;
    toastBusy.current = true;
    const next = toastQueue.current.shift()!;
    setCurrentToast(next);
    setTimeout(() => {
      setCurrentToast(null);
      setTimeout(() => {
        toastBusy.current = false;
        processQueue();
      }, TOAST_GAP);
    }, TOAST_DURATION);
  }, []);

  const enqueueToast = useCallback((t: Toast) => {
    toastQueue.current.push(t);
    processQueue();
  }, [processQueue]);

  const getComboMultiplier = useCallback(() => {
    const now = Date.now();
    const timeSinceLast = now - lastGain.current;
    lastGain.current = now;

    let newCombo = 0;
    if (timeSinceLast < COMBO_WINDOW_MS && totalXp > 0) {
      newCombo = Math.min(combo + 1, COMBO_MULTIPLIERS.length - 1);
    }
    setCombo(newCombo);
    if (comboTimer.current) clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => setCombo(0), COMBO_WINDOW_MS);
    return COMBO_MULTIPLIERS[newCombo];
  }, [combo, totalXp]);

  const addXP = useCallback((amount: number, label: string) => {
    const mult = getComboMultiplier();
    const earned = Math.round(amount * mult);
    setXp(x => x + earned);
    setTotalXp(t => t + earned);
    if (earned >= SOUND_THRESHOLD) {
      sound.achievement();
    }
    enqueueToast({ label, xp: earned, combo: mult > 1 ? COMBO_MULTIPLIERS.indexOf(mult) : 0, id: ++toastId });
  }, [getComboMultiplier, sound, enqueueToast]);

  const addMilestone = useCallback((id: string, label: string, xpAmount: number) => {
    if (milestones.has(id)) return;
    setMilestones(prev => new Set(prev).add(id));
    addXP(xpAmount, label);
  }, [milestones, addXP]);

  // Level up
  useEffect(() => {
    if (xp >= maxXp) {
      setLevel(l => l + 1);
      setXp(x => x - maxXp);
      setLevelUpAnim(true);
      sound.levelUp();
      setTimeout(() => setLevelUpAnim(false), 1500);
    }
  }, [xp, maxXp, sound]);

  // Section discovery
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (!discovered.has(id)) {
              const section = SECTIONS.find(s => s.id === id);
              if (section) {
                setDiscovered(prev => new Set(prev).add(id));
                addXP(20, section.label);
              }
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [discovered, addXP]);

  // Persist
  useEffect(() => {
    try {
      sessionStorage.setItem("portfolio_stats", JSON.stringify({
        xp, level, totalXp, discovered: [...discovered], milestones: [...milestones],
      }));
    } catch {}
  }, [xp, level, totalXp, discovered, milestones]);

  // Passive XP every 30s (silent, no toast)
  useEffect(() => {
    const interval = setInterval(() => {
      setXp(x => x + 5);
      setTotalXp(t => t + 5);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Bottom-of-page milestone (single, not spammy)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          addMilestone("scroll-bottom", "The Completionist", 20);
        }
      },
      { threshold: 0.5 }
    );
    const footer = document.querySelector("footer");
    if (footer) observer.observe(footer);
    return () => observer.disconnect();
  }, [addMilestone]);

  return (
    <XPContext value={{ xp, level, maxXp, combo, totalXp, discovered, milestones, addXP, addMilestone }}>
      {children}

      <XPDisplay xp={xp} level={level} maxXp={maxXp} progress={progress} totalXp={totalXp} milestones={milestones} discovered={discovered} sectionsTotal={SECTIONS.length} />

      {/* Level up flash */}
      <AnimatePresence>
        {levelUpAnim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%)",
              }}
            />
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute font-mono text-2xl sm:text-4xl font-bold"
              style={{ color: "var(--accent)" }}
            >
              LEVEL {level}!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast — queued, one at a time */}
      <AnimatePresence>
        {currentToast && (
          <motion.div
            key={currentToast.id}
            initial={{ y: 80, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-auto z-[100] flex items-center gap-3 px-4 sm:px-5 py-3 rounded-lg"
            style={{
              background: "rgba(5,5,7,0.95)",
              border: "1px solid rgba(124,58,237,0.3)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 0 30px rgba(124,58,237,0.15)",
            }}
          >
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
              style={{ background: "rgba(124,58,237,0.2)", color: "var(--accent)" }}
            >
              ★
            </motion.div>
            <div className="min-w-0">
              <div className="font-mono text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-2" style={{ color: "var(--purple)" }}>
                Unlocked
                {currentToast.combo > 0 && (
                  <span className="font-bold" style={{ color: "#ec4899" }}>
                    x{COMBO_MULTIPLIERS[currentToast.combo]}
                  </span>
                )}
              </div>
              <div className="text-sm font-bold text-white truncate">
                {currentToast.label}
              </div>
              <div className="font-mono text-xs" style={{ color: "var(--accent)" }}>
                +{currentToast.xp} XP
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </XPContext>
  );
}
