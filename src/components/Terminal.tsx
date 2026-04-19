"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { terminalCommands } from "@/data/portfolio";

interface TerminalLine {
  type: "input" | "output" | "error";
  content: string;
}

export default function Terminal({ onClose }: { onClose: () => void }) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: "Welcome to jinwei.terminal v2.0" },
    { type: "output", content: 'Type "help" for available commands.' },
    { type: "output", content: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const processCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newLines: TerminalLine[] = [
      { type: "input", content: `~ $ ${cmd}` },
    ];

    if (trimmed === "clear") {
      setLines([]);
      return;
    }

    if (trimmed === "" ) {
      setLines((prev) => [...prev, ...newLines]);
      return;
    }

    const output = terminalCommands[trimmed];
    if (output) {
      for (const line of output) {
        newLines.push({ type: "output", content: line });
      }
    } else {
      newLines.push({
        type: "error",
        content: `command not found: ${trimmed}. Type "help" for available commands.`,
      });
    }

    setLines((prev) => [...prev, ...newLines]);
  }, []);

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
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed top-20 left-4 right-4 md:left-auto md:right-8 md:w-[600px] z-40 rounded-lg overflow-hidden shadow-2xl shadow-black/50 border border-white/10"
      style={{ background: "rgba(10, 10, 20, 0.95)" }}
    >
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-gray-500 terminal-text ml-2">jinwei@portfolio:~</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white text-xs terminal-text"
        >
          [ESC]
        </button>
      </div>

      <div
        ref={scrollRef}
        className="p-4 h-[250px] sm:h-[350px] md:h-[400px] max-h-[60vh] overflow-y-auto terminal-text text-sm leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        <AnimatePresence>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1 }}
              className={`${
                line.type === "input"
                  ? "text-[var(--neon-green)]"
                  : line.type === "error"
                  ? "text-red-400"
                  : "text-gray-300"
              } ${line.content === "" ? "h-4" : ""}`}
            >
              {line.content}
            </motion.div>
          ))}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex items-center mt-1">
          <span className="text-[var(--neon-green)] mr-2">~ $</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-white caret-[var(--neon-green)]"
            autoComplete="off"
            spellCheck={false}
          />
          <span className="animate-blink text-[var(--neon-green)]">▊</span>
        </form>
      </div>
    </motion.div>
  );
}
