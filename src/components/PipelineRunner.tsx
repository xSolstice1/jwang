"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useXP } from "./XPEngine";
import { useSound } from "./SoundEngine";

interface TechItem {
  label: string;
  icon: string;
  color: string;
  points: number;
  isBug?: boolean;
}

const TECH_ITEMS: TechItem[] = [
  { label: "PY", icon: "\u{1F40D}", color: "var(--accent)", points: 10 },
  { label: "TS", icon: "\u{2328}", color: "var(--blue)", points: 10 },
  { label: "AWS", icon: "\u{2601}", color: "#f59e0b", points: 15 },
  { label: "Neo4j", icon: "\u{25C9}", color: "var(--green)", points: 15 },
  { label: "Docker", icon: "\u{1F40B}", color: "#06b6d4", points: 10 },
  { label: "SQL", icon: "\u{229E}", color: "var(--purple)", points: 10 },
  { label: "React", icon: "\u{269B}", color: "#61dafb", points: 10 },
  { label: "Go", icon: "\u{25C6}", color: "#00add8", points: 15 },
];

const BUG_ITEMS: TechItem[] = [
  { label: "BUG", icon: "\u{1F41B}", color: "#ef4444", points: -20, isBug: true },
  { label: "404", icon: "\u{26A0}", color: "#ef4444", points: -15, isBug: true },
];

interface FallingItemData {
  id: number;
  tech: TechItem;
  x: number;
  spawnTime: number;
  caught: boolean;
}

type GameStatus = "idle" | "playing" | "over";

const BASE_SPAWN_MS = 1200;
const MIN_SPAWN_MS = 550;
const BASE_FALL_S = 3.8;
const MIN_FALL_S = 1.6;
const MAX_ITEMS = 8;
const MAX_LIVES = 3;
const BUG_CHANCE = 0.15;

let nextId = 0;

export default function PipelineRunner() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [combo, setCombo] = useState(0);
  const [items, setItems] = useState<FallingItemData[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const boardRef = useRef<HTMLDivElement>(null);
  const spawnTimer = useRef<NodeJS.Timeout>(undefined);
  const clockTimer = useRef<NodeJS.Timeout>(undefined);
  const { addXP, addMilestone } = useXP();
  const sound = useSound();

  const fallDuration = Math.max(MIN_FALL_S, BASE_FALL_S - elapsed * 0.06);
  const spawnInterval = Math.max(MIN_SPAWN_MS, BASE_SPAWN_MS - elapsed * 18);

  const startGame = useCallback(() => {
    nextId = 0;
    setStatus("playing");
    setScore(0);
    setLives(MAX_LIVES);
    setCombo(0);
    setItems([]);
    setElapsed(0);
  }, []);

  const endGame = useCallback((finalScore: number) => {
    setStatus("over");
    setItems([]);

    const earned = Math.max(5, Math.floor(finalScore / 10));
    addXP(earned, "Pipeline Processed");

    if (finalScore >= 100) addMilestone("pipeline-100", "Pipeline Rookie", 25);
    if (finalScore >= 300) addMilestone("pipeline-300", "Data Wrangler", 50);
    if (finalScore >= 500) addMilestone("pipeline-500", "Pipeline Master", 100);

    setBestScore(prev => Math.max(prev, finalScore));
  }, [addXP, addMilestone]);

  // Spawn items
  useEffect(() => {
    if (status !== "playing") return;

    const spawn = () => {
      setItems(prev => {
        if (prev.filter(i => !i.caught).length >= MAX_ITEMS) return prev;
        const isBug = Math.random() < BUG_CHANCE;
        const pool = isBug ? BUG_ITEMS : TECH_ITEMS;
        const tech = pool[Math.floor(Math.random() * pool.length)];
        const x = 10 + Math.random() * 75;
        return [...prev, { id: nextId++, tech, x, spawnTime: Date.now(), caught: false }];
      });

      spawnTimer.current = setTimeout(spawn, spawnInterval);
    };

    spawnTimer.current = setTimeout(spawn, 600);
    return () => { if (spawnTimer.current) clearTimeout(spawnTimer.current); };
  }, [status, spawnInterval]);

  // Game clock
  useEffect(() => {
    if (status !== "playing") return;
    clockTimer.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => { if (clockTimer.current) clearInterval(clockTimer.current); };
  }, [status]);

  // Check missed items
  useEffect(() => {
    if (status !== "playing") return;

    const check = setInterval(() => {
      const now = Date.now();
      setItems(prev => {
        let missed = 0;
        const remaining = prev.filter(item => {
          if (item.caught) return false;
          const age = (now - item.spawnTime) / 1000;
          if (age > fallDuration + 0.3) {
            if (!item.tech.isBug) missed++;
            return false;
          }
          return true;
        });

        if (missed > 0) {
          setLives(l => {
            const newLives = Math.max(0, l - missed);
            if (newLives <= 0) {
              setScore(s => { endGame(s); return s; });
            }
            return newLives;
          });
          setCombo(0);
          sound.whoosh();
        }

        return remaining;
      });
    }, 200);

    return () => clearInterval(check);
  }, [status, fallDuration, endGame, sound]);

  const catchItem = useCallback((itemId: number) => {
    setItems(prev => {
      const item = prev.find(i => i.id === itemId);
      if (!item || item.caught) return prev;

      if (item.tech.isBug) {
        sound.glitch();
        setScore(s => Math.max(0, s + item.tech.points));
        setCombo(0);
      } else {
        sound.click();
        const comboBonus = Math.floor(combo / 3) * 5;
        setScore(s => s + item.tech.points + comboBonus);
        setCombo(c => c + 1);
        if (combo + 1 >= 5) addMilestone("combo-5", "Batch Processing", 30);
      }

      return prev.map(i => i.id === itemId ? { ...i, caught: true } : i);
    });
  }, [combo, sound, addMilestone]);

  return (
    <div
      className="rounded-lg overflow-hidden flex flex-col select-none"
      style={{
        background: "rgba(5, 5, 7, 0.85)",
        border: "1px solid rgba(124, 58, 237, 0.1)",
        backdropFilter: "blur(10px)",
        height: "100%",
        minHeight: "300px",
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-2.5 flex items-center justify-between shrink-0"
        style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="font-mono text-xs font-bold tracking-widest" style={{ color: "var(--accent)" }}>
          PIPELINE RUNNER
        </span>
        {status === "playing" && (
          <div className="flex items-center gap-3 font-mono text-[10px]">
            <span style={{ color: "var(--text-secondary)" }}>{score}</span>
            <div className="flex gap-0.5">
              {Array.from({ length: MAX_LIVES }).map((_, i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                  style={{ background: i < lives ? "var(--purple)" : "rgba(255,255,255,0.1)" }}
                />
              ))}
            </div>
            {combo >= 3 && (
              <motion.span
                key={combo}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                style={{ color: "var(--purple)" }}
              >
                x{Math.floor(combo / 3) + 1}
              </motion.span>
            )}
          </div>
        )}
      </div>

      {/* Game board */}
      <div
        ref={boardRef}
        className="flex-1 relative overflow-hidden"
        style={{ minHeight: "250px" }}
      >
        {/* Pipeline lanes (decorative) */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {[20, 40, 60, 80].map(x => (
            <div
              key={x}
              className="absolute top-0 bottom-0 w-px"
              style={{ left: `${x}%`, background: "rgba(124,58,237,0.04)" }}
            />
          ))}
          <div
            className="absolute bottom-0 left-0 right-0 h-12"
            style={{ background: "linear-gradient(to top, rgba(124,58,237,0.05), transparent)" }}
          />
        </div>

        {/* Idle state */}
        {status === "idle" && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 cursor-pointer z-10"
            onClick={startGame}
            onTouchEnd={(e) => { e.preventDefault(); startGame(); }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex gap-3 text-2xl opacity-40"
            >
              {["\u{1F40D}", "\u{2601}", "\u{269B}", "\u{1F40B}"].map((icon, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                >
                  {icon}
                </motion.span>
              ))}
            </motion.div>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="font-mono text-xs uppercase tracking-widest"
              style={{ color: "var(--accent)" }}
            >
              tap to start
            </motion.div>
            {bestScore > 0 && (
              <div className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                best: {bestScore}
              </div>
            )}
          </motion.div>
        )}

        {/* Falling items */}
        <AnimatePresence>
          {items.map(item => (
            <motion.button
              key={item.id}
              initial={{ y: -50, opacity: 0, scale: 0.5 }}
              animate={
                item.caught
                  ? { scale: [1.3, 0], opacity: [1, 0], y: 0 }
                  : { y: boardRef.current?.offsetHeight ?? 400, opacity: 1, scale: 1 }
              }
              exit={{ opacity: 0, scale: 0 }}
              transition={
                item.caught
                  ? { duration: 0.25 }
                  : { y: { duration: fallDuration, ease: "linear" }, opacity: { duration: 0.3 }, scale: { duration: 0.3 } }
              }
              onClick={() => catchItem(item.id)}
              onTouchEnd={(e) => { e.preventDefault(); catchItem(item.id); }}
              className="absolute flex flex-col items-center justify-center rounded-lg cursor-pointer"
              style={{
                left: `${item.x}%`,
                width: "48px",
                height: "48px",
                background: item.tech.isBug
                  ? "rgba(239,68,68,0.15)"
                  : "rgba(124,58,237,0.1)",
                border: `1px solid ${item.tech.isBug ? "rgba(239,68,68,0.3)" : "rgba(124,58,237,0.2)"}`,
                zIndex: 5,
              }}
            >
              <span className="text-lg leading-none">{item.tech.icon}</span>
              <span
                className="font-mono text-[10px] font-bold mt-0.5"
                style={{ color: item.tech.color }}
              >
                {item.tech.label}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Game over */}
        <AnimatePresence>
          {status === "over" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3"
              style={{ background: "rgba(5,5,7,0.9)", backdropFilter: "blur(8px)" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="font-mono text-xs uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Pipeline Terminated
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 150, delay: 0.4 }}
                className="text-3xl font-bold font-mono"
                style={{ color: "var(--accent)" }}
              >
                {score}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="font-mono text-xs"
                style={{ color: "var(--purple)" }}
              >
                +{Math.max(5, Math.floor(score / 10))} XP earned
              </motion.div>
              {score >= bestScore && score > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="font-mono text-[9px] font-bold"
                  style={{ color: "#f59e0b" }}
                >
                  NEW BEST!
                </motion.div>
              )}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={startGame}
                className="mt-2 px-5 py-2 rounded-md font-mono text-xs uppercase tracking-wide transition-all duration-200"
                style={{
                  background: "rgba(124,58,237,0.15)",
                  border: "1px solid rgba(124,58,237,0.3)",
                  color: "var(--accent)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Play Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
