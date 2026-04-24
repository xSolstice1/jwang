"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PipelineNode } from "@/data/portfolio";

const typeColors: Record<
  PipelineNode["type"],
  { accent: string; label: string }
> = {
  source: { accent: "var(--blue)", label: "source" },
  process: { accent: "var(--purple)", label: "process" },
  storage: { accent: "var(--green)", label: "storage" },
  api: { accent: "var(--accent)", label: "api" },
  output: { accent: "#ffcb6b", label: "output" },
};

const typeIcons: Record<PipelineNode["type"], string> = {
  source: "\u25c6",
  process: "\u2699",
  storage: "\u25c9",
  api: "\u27e1",
  output: "\u25b6",
};

export default function PipelineFlow({ nodes }: { nodes: PipelineNode[] }) {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div className="relative">
      <div className="flex flex-col items-center gap-0">
        {nodes.map((node, i) => {
          const colors = typeColors[node.type];
          const isActive = activeNode === node.id;

          return (
            <div key={node.id} className="flex flex-col items-center w-full">
              <motion.button
                onClick={() => setActiveNode(isActive ? null : node.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full max-w-sm px-5 py-2.5 rounded-lg transition-all duration-300"
                style={{
                  background: `color-mix(in srgb, ${colors.accent} 6%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${colors.accent} ${isActive ? "30" : "15"}%, transparent)`,
                  boxShadow: isActive
                    ? `0 0 20px color-mix(in srgb, ${colors.accent} 10%, transparent)`
                    : "none",
                }}
              >
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-xs" style={{ color: colors.accent }}>
                    {typeIcons[node.type]}
                  </span>
                  <span
                    className="text-xs sm:text-sm font-mono"
                    style={{ color: colors.accent }}
                  >
                    {node.label}
                  </span>
                </div>
              </motion.button>

              {i < nodes.length - 1 && (
                <div className="flex flex-col items-center">
                  <div
                    className="w-px h-2.5"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
                    }}
                  />
                  <svg
                    className="w-2.5 h-2.5 -mt-0.5"
                    style={{ color: "rgba(255,255,255,0.12)" }}
                    fill="currentColor"
                    viewBox="0 0 8 8"
                  >
                    <path d="M0 0l4 4 4-4z" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {activeNode && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 overflow-hidden"
          >
            {nodes
              .filter((n) => n.id === activeNode)
              .map((node) => {
                const colors = typeColors[node.type];
                return (
                  <div
                    key={node.id}
                    className="p-4 rounded-lg"
                    style={{
                      background: `color-mix(in srgb, ${colors.accent} 5%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${colors.accent} 15%, transparent)`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-sm"
                        style={{ color: colors.accent }}
                      >
                        {typeIcons[node.type]}
                      </span>
                      <span
                        className="font-mono text-sm font-medium"
                        style={{ color: colors.accent }}
                      >
                        {node.label}
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-wider"
                        style={{
                          color: colors.accent,
                          background: `color-mix(in srgb, ${colors.accent} 8%, transparent)`,
                          border: `1px solid color-mix(in srgb, ${colors.accent} 15%, transparent)`,
                        }}
                      >
                        {colors.label}
                      </span>
                    </div>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {node.details}
                    </p>
                  </div>
                );
              })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
