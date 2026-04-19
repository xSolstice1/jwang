"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PipelineNode } from "@/data/portfolio";

const typeColors: Record<PipelineNode["type"], { bg: string; border: string; text: string; glow: string }> = {
  source: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    glow: "shadow-blue-500/20",
  },
  process: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    glow: "shadow-purple-500/20",
  },
  storage: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-400",
    glow: "shadow-green-500/20",
  },
  api: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    glow: "shadow-cyan-500/20",
  },
  output: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    glow: "shadow-amber-500/20",
  },
};

const typeIcons: Record<PipelineNode["type"], string> = {
  source: "◆",
  process: "⚙",
  storage: "◉",
  api: "⟡",
  output: "▶",
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
                className={`relative w-full max-w-sm px-4 py-2 rounded-lg border transition-all cursor-pointer ${
                  colors.bg
                } ${colors.border} ${
                  isActive ? `shadow-lg ${colors.glow}` : ""
                }`}
              >
                <div className="flex items-center gap-2 justify-center">
                  <span className={`text-xs ${colors.text}`}>{typeIcons[node.type]}</span>
                  <span className={`text-xs sm:text-sm terminal-text ${colors.text}`}>
                    {node.label}
                  </span>
                </div>
              </motion.button>

              {i < nodes.length - 1 && (
                <div className="flex flex-col items-center">
                  <div className="w-px h-2.5 bg-gradient-to-b from-white/20 to-white/10" />
                  <svg className="w-2.5 h-2.5 text-white/20 -mt-0.5" fill="currentColor" viewBox="0 0 8 8">
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
            transition={{ duration: 0.2 }}
            className="mt-4 overflow-hidden"
          >
            {nodes
              .filter((n) => n.id === activeNode)
              .map((node) => {
                const colors = typeColors[node.type];
                return (
                  <div
                    key={node.id}
                    className={`p-3 sm:p-4 rounded-lg border ${colors.bg} ${colors.border}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-sm ${colors.text}`}>{typeIcons[node.type]}</span>
                      <span className={`terminal-text text-sm font-medium ${colors.text}`}>
                        {node.label}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border}`}>
                        {node.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{node.details}</p>
                  </div>
                );
              })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
