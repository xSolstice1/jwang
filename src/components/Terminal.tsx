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

    if (trimmed === "") {
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
            />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span
            className="text-[11px] font-mono ml-2"
            style={{ color: "var(--text-muted)" }}
          >
            jinwei@portfolio:~
          </span>
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
                    : "var(--text-secondary)",
              }}
              className={line.content === "" ? "h-4" : ""}
            >
              {line.content}
            </motion.div>
          ))}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex items-center mt-1">
          <span className="mr-2" style={{ color: "var(--accent)" }}>
            ~ $
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
