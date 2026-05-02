"use client";

import { motion } from "framer-motion";
import { useXP } from "./XPEngine";

const STATS = [
  { label: "Engineering", value: 88, color: "var(--accent)", icon: ">" },
  { label: "AI / ML", value: 82, color: "var(--purple)", icon: ">" },
  { label: "Cloud", value: 78, color: "var(--blue)", icon: ">" },
  { label: "Systems", value: 92, color: "#ec4899", icon: ">" },
];

const TRAITS = [
  "Graph Thinker",
  "Pipeline Architect",
  "Cloud Native",
  "Data-First",
];

const EQUIPMENT = [
  { slot: "Language", item: "Python / TypeScript" },
  { slot: "Database", item: "Neo4j / Snowflake" },
  { slot: "Cloud", item: "AWS (Batch, Bedrock)" },
  { slot: "IaC", item: "Terraform / Docker" },
];

function StatBar({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] w-20 text-right shrink-0" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <span className="font-mono text-[10px] w-8 shrink-0 font-bold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

export default function CharacterSheet() {
  const { level, xp, maxXp, totalXp, milestones } = useXP();

  return (
    <div
      className="rounded-lg overflow-hidden flex flex-col"
      style={{
        background: "rgba(5, 5, 7, 0.85)",
        border: "1px solid rgba(124, 58, 237, 0.1)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold tracking-widest" style={{ color: "var(--accent)" }}>
            CHARACTER SHEET
          </span>
        </div>
        <span className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
          LV {level}
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Identity */}
        <div className="flex items-center gap-4">
          {/* Pixel avatar placeholder */}
          <motion.div
            className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.2))",
              border: "1px solid rgba(124,58,237,0.2)",
            }}
            animate={{ boxShadow: ["0 0 0px rgba(124,58,237,0)", "0 0 15px rgba(124,58,237,0.3)", "0 0 0px rgba(124,58,237,0)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-2xl">&#9876;</span>
          </motion.div>
          <div>
            <div className="font-bold text-white text-sm">Ang Jin Wei</div>
            <div className="font-mono text-[10px]" style={{ color: "var(--purple)" }}>
              Data Engineer &middot; AI Builder
            </div>
            <div className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
              Singapore &middot; Class: Architect
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="font-mono text-[9px]" style={{ color: "var(--text-muted)" }}>EXP</span>
            <span className="font-mono text-[9px]" style={{ color: "var(--text-muted)" }}>{xp}/{maxXp}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, var(--accent), var(--purple))" }}
              animate={{ width: `${(xp / maxXp) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-mono text-[9px]" style={{ color: "var(--text-muted)" }}>
              Total: {totalXp} XP
            </span>
            <span className="font-mono text-[9px]" style={{ color: "var(--text-muted)" }}>
              {milestones.size} achievements
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <div className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
            Stats
          </div>
          {STATS.map((stat, i) => (
            <StatBar key={stat.label} {...stat} delay={0.8 + i * 0.15} />
          ))}
        </div>

        {/* Equipment */}
        <div>
          <div className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
            Equipment
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {EQUIPMENT.map((eq) => (
              <div
                key={eq.slot}
                className="px-2.5 py-1.5 rounded"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="font-mono text-[8px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                  {eq.slot}
                </div>
                <div className="font-mono text-[10px]" style={{ color: "var(--text-secondary)" }}>
                  {eq.item}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traits */}
        <div>
          <div className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
            Traits
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TRAITS.map((trait, i) => (
              <motion.span
                key={trait}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 + i * 0.1 }}
                className="px-2 py-0.5 rounded font-mono text-[9px]"
                style={{
                  background: "rgba(124,58,237,0.1)",
                  border: "1px solid rgba(124,58,237,0.15)",
                  color: "var(--accent)",
                }}
              >
                {trait}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Hint */}
        <div className="font-mono text-[9px] text-center pt-1" style={{ color: "var(--text-muted)" }}>
          open the terminal to earn more XP
        </div>
      </div>
    </div>
  );
}
