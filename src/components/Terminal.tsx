"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { terminalCommands } from "@/data/portfolio";
import { useXP } from "./XPEngine";
import { useSound } from "./SoundEngine";

interface TerminalLine {
  type: "input" | "output" | "error" | "success" | "puzzle";
  content: string;
}

const PUZZLE_CHAINS: {
  id: string;
  hint: string[];
  answers: string[];
  reward: string[];
  xpLabel: string;
  xp: number;
  unlocks?: string;
}[] = [
  {
    id: "puzzle-1",
    hint: [
      "┌─── PUZZLE 1: Two Sum ─────────────┐",
      "│                                    │",
      "│  nums = [3, 8, 12, 5], target = 17 │",
      "│                                    │",
      "│  What two numbers add to target?   │",
      "│  Format: a,b (sorted ascending)    │",
      "└────────────────────────────────────┘",
    ],
    answers: ["5,12"],
    reward: [
      "✓ 5 + 12 = 17. HashMap approach O(n).",
      "",
      "  SECRET UNLOCKED: Type 'matrix' to enter the Matrix.",
    ],
    xpLabel: "Puzzle Master I",
    xp: 30,
    unlocks: "matrix",
  },
  {
    id: "puzzle-2",
    hint: [
      "┌─── PUZZLE 2: Stack ───────────────┐",
      "│                                    │",
      "│  push(3), push(7), pop(),          │",
      "│  push(1), push(9), pop(), peek()   │",
      "│                                    │",
      "│  What does peek() return?          │",
      "│  (just the number)                 │",
      "└────────────────────────────────────┘",
    ],
    answers: ["1"],
    reward: [
      "✓ Stack: [3,7]→pop→[3]→push 1,9→pop→[3,1]. peek()=1.",
      "",
      "  SECRET UNLOCKED: Type 'glitch' to break reality.",
    ],
    xpLabel: "Puzzle Master II",
    xp: 40,
    unlocks: "glitch",
  },
  {
    id: "puzzle-3",
    hint: [
      "┌─── PUZZLE 3: Big O ───────────────┐",
      "│                                    │",
      "│  def search(arr, target):          │",
      "│      lo, hi = 0, len(arr)-1       │",
      "│      while lo <= hi:              │",
      "│          mid = (lo+hi)//2         │",
      "│          if arr[mid] == target:   │",
      "│              return mid           │",
      "│          elif arr[mid] < target:  │",
      "│              lo = mid + 1         │",
      "│          else: hi = mid - 1      │",
      "│                                    │",
      "│  Time complexity? (e.g. n, n^2)    │",
      "└────────────────────────────────────┘",
    ],
    answers: ["logn", "log n", "o(logn)", "o(log n)", "nlogn", "o(nlogn)"],
    reward: [
      "✓ Binary search = O(log n). Halves the space each step.",
      "",
      "  SECRET UNLOCKED: Type 'konami' for the cheat code.",
    ],
    xpLabel: "Puzzle Master III",
    xp: 50,
    unlocks: "konami",
  },
  {
    id: "puzzle-4",
    hint: [
      "┌─── PUZZLE 4: Linked List ─────────┐",
      "│                                    │",
      "│  1 → 2 → 3 → 4 → 5 → NULL        │",
      "│                                    │",
      "│  After reversing, what does the    │",
      "│  head node's value become?         │",
      "│  (just the number)                 │",
      "└────────────────────────────────────┘",
    ],
    answers: ["5"],
    reward: [
      "✓ Reversed: 5→4→3→2→1. New head = 5.",
      "",
      "  You've proven yourself.",
    ],
    xpLabel: "Puzzle Master IV",
    xp: 60,
  },
  {
    id: "puzzle-5",
    hint: [
      "┌─── PUZZLE 5: Recursion ───────────┐",
      "│                                    │",
      "│  def f(n):                         │",
      "│      if n <= 1: return n           │",
      "│      return f(n-1) + f(n-2)        │",
      "│                                    │",
      "│  What is f(7)?                     │",
      "│  (just the number)                 │",
      "└────────────────────────────────────┘",
    ],
    answers: ["13"],
    reward: [
      "✓ Fibonacci: 0,1,1,2,3,5,8,13. f(7)=13.",
      "",
      "  All puzzles complete.",
    ],
    xpLabel: "Puzzle Master V",
    xp: 80,
  },
];

export default function Terminal({ onClose }: { onClose: () => void }) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: "Welcome to jinwei.terminal v2.0" },
    { type: "output", content: 'Type "help" for available commands.' },
    { type: "output", content: 'Type "secrets" if you dare.' },
    { type: "output", content: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activePuzzle, setActivePuzzle] = useState<number | null>(null);
  const [solvedPuzzles, setSolvedPuzzles] = useState<Set<string>>(new Set());
  const [unlockedCommands, setUnlockedCommands] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addMilestone } = useXP();
  const sound = useSound();
  const cmdsRun = useRef<Set<string>>(new Set());

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const addLines = useCallback((newLines: TerminalLine[]) => {
    setLines((prev) => [...prev, ...newLines]);
  }, []);

  const processCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const inputLine: TerminalLine = { type: "input", content: `~ $ ${cmd}` };

    if (trimmed === "clear") {
      setLines([]);
      return;
    }

    if (trimmed === "") {
      addLines([inputLine]);
      return;
    }

    // Active puzzle — check answer
    if (activePuzzle !== null) {
      const puzzle = PUZZLE_CHAINS[activePuzzle];
      if (puzzle.answers.includes(trimmed)) {
        sound.achievement();
        setSolvedPuzzles(prev => new Set(prev).add(puzzle.id));
        if (puzzle.unlocks) {
          setUnlockedCommands(prev => new Set(prev).add(puzzle.unlocks!));
        }
        addMilestone(puzzle.id, puzzle.xpLabel, puzzle.xp);
        const hasNext = PUZZLE_CHAINS.findIndex((p, idx) => idx > activePuzzle && !solvedPuzzles.has(p.id) && p.id !== puzzle.id) !== -1;
        addLines([
          inputLine,
          ...puzzle.reward.map(r => ({ type: "success" as const, content: r })),
          { type: "output", content: `  +${puzzle.xp} XP` },
          { type: "output", content: "" },
          ...(hasNext ? [{ type: "output" as const, content: "Type 'next' for next puzzle, or 'quit' to exit." }] : []),
        ]);
        setActivePuzzle(null);

        if (solvedPuzzles.size + 1 === PUZZLE_CHAINS.length) {
          addMilestone("all-puzzles", "Grandmaster Hacker", 100);
          addLines([
            { type: "success", content: "★ ALL PUZZLES SOLVED — GRANDMASTER HACKER ★" },
            { type: "success", content: "+100 XP BONUS" },
            { type: "output", content: "" },
          ]);
        }
        return;
      } else if (trimmed === "skip" || trimmed === "quit") {
        setActivePuzzle(null);
        addLines([
          inputLine,
          { type: "output", content: "Puzzle skipped. Type 'puzzle' to try again." },
        ]);
        return;
      } else {
        sound.click();
        addLines([
          inputLine,
          { type: "error", content: "Incorrect. Try again, or type 'skip' to quit." },
        ]);
        return;
      }
    }

    // Secret commands
    if (trimmed === "next") {
      const nextUnsolved = PUZZLE_CHAINS.findIndex(p => !solvedPuzzles.has(p.id));
      if (nextUnsolved === -1) {
        addLines([inputLine, { type: "success", content: "All puzzles solved!" }]);
      } else {
        setActivePuzzle(nextUnsolved);
        addLines([
          inputLine,
          ...PUZZLE_CHAINS[nextUnsolved].hint.map(h => ({ type: "puzzle" as const, content: h })),
          { type: "output", content: "" },
          { type: "output", content: "Type your answer, or 'skip' to quit." },
        ]);
      }
      return;
    }

    if (trimmed === "secrets") {
      const unlockedList = [...unlockedCommands].map(c => `  ✓ ${c}`);
      const lockedCount = PUZZLE_CHAINS.filter(p => p.unlocks && !unlockedCommands.has(p.unlocks)).length;
      const secretLines: TerminalLine[] = [
        inputLine,
        { type: "output", content: "┌─── SECRET MENU ─────────────────────┐" },
        { type: "output", content: "│                                     │" },
        { type: "output", content: "│  puzzle    — Coding puzzles for XP  │" },
        { type: "output", content: "│  next      — Next puzzle            │" },
        { type: "output", content: "│  xp        — Your stats             │" },
        { type: "output", content: "│  rm -rf /  — Try it. I dare you.    │" },
        { type: "output", content: "│  hack      — ???                    │" },
      ];
      if (unlockedList.length > 0) {
        secretLines.push({ type: "output", content: "│                                     │" });
        secretLines.push({ type: "success", content: "│  UNLOCKED:                          │" });
        unlockedList.forEach(c => {
          secretLines.push({ type: "success", content: `│    ✓ ${c.padEnd(32)}│` });
        });
      }
      if (lockedCount > 0) {
        const msg = `${lockedCount} more locked. Solve puzzles!`;
        secretLines.push({ type: "output", content: `│  ${msg.padEnd(36)}│` });
      }
      secretLines.push({ type: "output", content: "│                                     │" });
      secretLines.push({ type: "output", content: "└─────────────────────────────────────┘" });
      addLines(secretLines);
      if (!cmdsRun.current.has("secrets")) {
        cmdsRun.current.add("secrets");
        addMilestone("cmd-secrets", "Found: Secret Menu", 15);
      }
      return;
    }

    if (trimmed === "puzzle") {
      const nextUnsolved = PUZZLE_CHAINS.findIndex(p => !solvedPuzzles.has(p.id));
      if (nextUnsolved === -1) {
        addLines([
          inputLine,
          { type: "success", content: "All puzzles solved! You're a grandmaster." },
        ]);
      } else {
        setActivePuzzle(nextUnsolved);
        addLines([
          inputLine,
          ...PUZZLE_CHAINS[nextUnsolved].hint.map(h => ({ type: "puzzle" as const, content: h })),
          { type: "output", content: "" },
          { type: "output", content: "Type your answer, or 'skip' to quit." },
        ]);
      }
      return;
    }

    if (trimmed === "xp") {
      const stats = (() => {
        try {
          return JSON.parse(sessionStorage.getItem("portfolio_stats") || "{}");
        } catch { return {}; }
      })();
      addLines([
        inputLine,
        { type: "output", content: `  Level:      ${stats.level ?? 1}` },
        { type: "output", content: `  XP:         ${stats.xp ?? 0}/${(stats.level ?? 1) * 100}` },
        { type: "output", content: `  Total XP:   ${stats.totalXp ?? 0}` },
        { type: "output", content: `  Sections:   ${(stats.discovered ?? []).length}/5` },
        { type: "output", content: `  Milestones: ${(stats.milestones ?? []).length}` },
        { type: "output", content: `  Puzzles:    ${solvedPuzzles.size}/${PUZZLE_CHAINS.length}` },
      ]);
      return;
    }

    if (trimmed === "sudo rm -rf /" || trimmed === "rm -rf /") {
      sound.glitch();
      addLines([
        inputLine,
        { type: "error", content: "Permission denied: Nice try." },
        { type: "error", content: "This portfolio has plot armor." },
        { type: "output", content: "" },
        { type: "success", content: "+10 XP for audacity" },
      ]);
      addMilestone("cmd-rmrf", "Attempted Deletion", 10);
      return;
    }

    if (trimmed === "hack") {
      sound.glitch();
      document.documentElement.classList.add("glitch-mode");
      setTimeout(() => document.documentElement.classList.remove("glitch-mode"), 3000);
      addLines([
        inputLine,
        { type: "success", content: "ACCESSING MAINFRAME..." },
        { type: "success", content: "BYPASSING FIREWALL..." },
        { type: "error", content: "just kidding. But enjoy the glitch." },
      ]);
      addMilestone("cmd-hack", "H4CK3R", 15);
      return;
    }

    if (trimmed === "matrix" && unlockedCommands.has("matrix")) {
      addLines([
        inputLine,
        { type: "success", content: "Entering the Matrix..." },
        { type: "output", content: "The Konami code is: ↑↑↓↓←→←→BA" },
        { type: "output", content: "Or on mobile: 3-finger tap" },
      ]);
      addMilestone("cmd-matrix", "Red Pill Taken", 10);
      return;
    }

    if (trimmed === "glitch" && unlockedCommands.has("glitch")) {
      sound.glitch();
      document.documentElement.classList.add("glitch-mode");
      setTimeout(() => document.documentElement.classList.remove("glitch-mode"), 5000);
      addLines([
        inputLine,
        { type: "success", content: "R̸E̵A̸L̷I̴T̵Y̶ ̸B̴R̵E̷A̵K̸I̴N̴G̵" },
        { type: "output", content: "5 seconds of chaos unleashed." },
      ]);
      addMilestone("cmd-glitch", "Reality Breaker", 10);
      return;
    }

    if (trimmed === "konami" && unlockedCommands.has("konami")) {
      addLines([
        inputLine,
        { type: "success", content: "THE KONAMI CODE:" },
        { type: "output", content: "  ↑ ↑ ↓ ↓ ← → ← → B A" },
        { type: "output", content: "" },
        { type: "output", content: "  Press these keys in sequence anywhere on the page." },
        { type: "output", content: "  On mobile: use a 3-finger tap instead." },
        { type: "output", content: "" },
        { type: "output", content: "  What happens? Only one way to find out..." },
      ]);
      addMilestone("cmd-konami", "Cheat Code Acquired", 10);
      return;
    }

    if (trimmed === "matrix" || trimmed === "glitch" || trimmed === "konami") {
      addLines([
        inputLine,
        { type: "error", content: `'${trimmed}' is locked. Solve puzzles to unlock it.` },
        { type: "output", content: "Type 'puzzle' to start." },
      ]);
      return;
    }

    if (trimmed === "42") {
      addLines([
        inputLine,
        { type: "success", content: "The Answer to the Ultimate Question of Life," },
        { type: "success", content: "the Universe, and Everything." },
      ]);
      addMilestone("cmd-42", "Hitchhiker", 10);
      return;
    }

    if (trimmed === "hello" || trimmed === "hi") {
      addLines([
        inputLine,
        { type: "output", content: "Hey! Welcome to the terminal." },
        { type: "output", content: "Type 'secrets' to find the hidden stuff." },
      ]);
      return;
    }

    // Standard commands from portfolio.ts
    const output = terminalCommands[trimmed];
    if (output) {
      addLines([
        inputLine,
        ...output.map(line => ({ type: "output" as const, content: line })),
      ]);
      if (!cmdsRun.current.has(trimmed)) {
        cmdsRun.current.add(trimmed);
        addMilestone(`cmd-${trimmed}`, `Ran: ${trimmed}`, 5);
        if (cmdsRun.current.size >= 5) {
          addMilestone("cmd-hacker", "Terminal Hacker", 20);
        }
      }
    } else {
      addLines([
        inputLine,
        { type: "error", content: `command not found: ${trimmed}. Type "help" for commands.` },
      ]);
    }
  }, [activePuzzle, solvedPuzzles, unlockedCommands, addLines, addMilestone, sound]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processCommand(input);
    setHistory((prev) => [input, ...prev]);
    setHistoryIndex(-1);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-20 left-4 right-4 md:left-auto md:right-8 md:w-[600px] z-40 rounded-xl overflow-hidden shadow-2xl shadow-black/60"
      style={{
        background: "rgba(8, 8, 12, 0.97)",
        border: "1px solid var(--border-color)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
              aria-label="Close"
            />
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors"
              aria-label="Minimize"
            />
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors"
              aria-label="Maximize"
            />
          </div>
          <span
            className="text-[11px] font-mono ml-2"
            style={{ color: "var(--text-muted)" }}
          >
            jinwei@portfolio:~
          </span>
          {activePuzzle !== null && (
            <span className="text-[10px] font-mono ml-2 animate-pulse" style={{ color: "var(--purple)" }}>
              [PUZZLE MODE]
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="font-mono text-[11px] transition-colors duration-300"
          style={{ color: "var(--text-muted)" }}
        >
          [ESC]
        </button>
      </div>

      <div
        ref={scrollRef}
        className="p-5 h-[250px] sm:h-[350px] md:h-[400px] max-h-[60vh] overflow-y-auto font-mono text-sm leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        <AnimatePresence>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1 }}
              style={{
                color:
                  line.type === "input"
                    ? "var(--accent)"
                    : line.type === "error"
                    ? "#f07178"
                    : line.type === "success"
                    ? "#a78bfa"
                    : line.type === "puzzle"
                    ? "var(--purple)"
                    : "var(--text-secondary)",
              }}
              className={line.content === "" ? "h-4" : ""}
            >
              {line.content}
            </motion.div>
          ))}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex items-center mt-1">
          <span className="mr-2" style={{ color: activePuzzle !== null ? "var(--purple)" : "var(--accent)" }}>
            {activePuzzle !== null ? "?? $" : "~ $"}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-white"
            style={{ caretColor: "var(--accent)" }}
            autoComplete="off"
            spellCheck={false}
          />
          <span className="animate-blink" style={{ color: "var(--accent)" }}>
            &#x2588;
          </span>
        </form>
      </div>
    </motion.div>
  );
}
