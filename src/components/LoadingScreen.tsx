"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSound } from "./SoundEngine";
import { useXP } from "./XPEngine";

// ── Tuning ────────────────────────────────────────────────────
const GROUND_Y = 0.74;
const JUMP_VEL = -0.011;
const PLAYER_X = 0.2;
const BOSS_SPAWN_KILLS = 5;
const BOSS_HP = 12;
const BOSS_SPEED = 0.0002;
const PLAYER_MAX_HP = 5;
const HIT_INVULN = 1200;
const ATTACK_DUR = 300;
const HIT_RANGE = 0.1;
const BOSS_HIT_RANGE = 0.13;
const KNOCKBACK = 0.08;
const BOSS_KNOCKBACK = 0.04;

const PX = 3;

function drawSprite(
  ctx: CanvasRenderingContext2D,
  ox: number, oy: number,
  map: (string | null)[][],
  scale: number,
  flipX = false,
) {
  const sz = PX * scale;
  const cols = map[0].length;
  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      const color = map[r][c];
      if (!color) continue;
      ctx.fillStyle = color;
      const col = flipX ? cols - 1 - c : c;
      ctx.fillRect(Math.round(ox + col * sz), Math.round(oy + r * sz), sz, sz);
    }
  }
}

// ── Color palette ─────────────────────────────────────────────
const _ = null;
const K = "#050507";
const V = "#7c3aed";
const D = "#5b21b6";
const P = "#4c1d95";
const B = "#818cf8";
const W = "#e4e4e7";
const G = "#a78bfa";
const S = "#fbbf24";
const Ht = "#f59e0b";
const F = "#fcd34d";
const PK = "#ec4899";
const Pk2 = "#f472b6";
const R = "#dc2626";
const RD = "#991b1b";
const RR = "#7f1d1d";
const RE = "#ef4444";
const GN = "#22c55e";
const GD = "#166534";
const BR = "#92400e";
const Or = "#f97316";
const Cy = "#06b6d4";
const Gr = "#6b7280";
const GrD = "#374151";

// ── KNIGHT idle 16w × 15h — sword held at right side ─────────
const KNIGHT: (string | null)[][] = [
  [_, _, _, _, D, D, V, V, V, D, D, _, _, _, _, _],
  [_, _, _, D, V, V, V, V, V, V, V, D, _, _, _, _],
  [_, _, _, D, V, V, V, G, V, V, V, D, _, _, _, _],
  [_, _, _, D, K, K, B, B, B, K, K, D, _, _, _, _],
  [_, _, _, _, D, F, F, F, F, F, D, _, _, _, _, _],
  [_, _, P, D, D, V, V, V, V, V, D, D, P,Ht,Ht, _],
  [_, P, D, V, V, V, V, V, V, V, V, V, D, S, S, _],
  [_, _, D, V, V, G, W, G, W, G, V, V, D, G, G, _],
  [_, _, D, V, V, V, V, V, V, V, V, V, D, G, G, _],
  [_, _, _, D, V, V, V, V, V, V, V, D, _, G, _, _],
  [_, _, _, D,BR,BR, D, S, D,BR,BR, D, _, W, _, _],
  [_, _, _, _, D, P, D, _, D, P, D, _, _, _, _, _],
  [_, _, _, _, D, P, D, _, D, P, D, _, _, _, _, _],
  [_, _, _, _, D, D, D, _, D, D, D, _, _, _, _, _],
  [_, _, _, D, D, K, K, _, K, K, D, D, _, _, _, _],
];

// Knight walk frame 2 — legs swapped
const KNIGHT_WALK2: (string | null)[][] = [
  [_, _, _, _, D, D, V, V, V, D, D, _, _, _, _, _],
  [_, _, _, D, V, V, V, V, V, V, V, D, _, _, _, _],
  [_, _, _, D, V, V, V, G, V, V, V, D, _, _, _, _],
  [_, _, _, D, K, K, B, B, B, K, K, D, _, _, _, _],
  [_, _, _, _, D, F, F, F, F, F, D, _, _, _, _, _],
  [_, _, P, D, D, V, V, V, V, V, D, D, P,Ht,Ht, _],
  [_, P, D, V, V, V, V, V, V, V, V, V, D, S, S, _],
  [_, _, D, V, V, G, W, G, W, G, V, V, D, G, G, _],
  [_, _, D, V, V, V, V, V, V, V, V, V, D, G, G, _],
  [_, _, _, D, V, V, V, V, V, V, V, D, _, G, _, _],
  [_, _, _, D,BR,BR, D, S, D,BR,BR, D, _, W, _, _],
  [_, _, _, _, _, D, P, D, D, P, _, _, _, _, _, _],
  [_, _, _, _, D, P, D, _, D, P, D, _, _, _, _, _],
  [_, _, _, _, D, D, _, _, _, D, D, _, _, _, _, _],
  [_, _, _, _, K, K, D, _, D, K, K, _, _, _, _, _],
];

// Slash frame 1 — wind-up, sword raised above head (16w × 15h)
const KNIGHT_ATK1: (string | null)[][] = [
  [_, _, _, _, D, D, V, V, V, D, D,Ht, S,PK,PK, W],
  [_, _, _, D, V, V, V, V, V, V, V, D,Ht, S,PK, _],
  [_, _, _, D, V, V, V, G, V, V, V, D, _, _, _, _],
  [_, _, _, D, K, K, B, B, B, K, K, D, _, _, _, _],
  [_, _, _, _, D, F, F, F, F, F, D, _, _, _, _, _],
  [_, _, P, D, D, V, V, V, V, V, D, D, P, _, _, _],
  [_, P, D, V, V, V, V, V, V, V, V, V, D, P, _, _],
  [_, _, D, V, V, G, W, G, W, G, V, V, D, _, _, _],
  [_, _, D, V, V, V, V, V, V, V, V, V, D, _, _, _],
  [_, _, _, D, V, V, V, V, V, V, V, D, _, _, _, _],
  [_, _, _, D,BR,BR, D, S, D,BR,BR, D, _, _, _, _],
  [_, _, _, _, D, P, D, _, D, P, D, _, _, _, _, _],
  [_, _, _, _, D, P, D, _, D, P, D, _, _, _, _, _],
  [_, _, _, _, D, D, D, _, D, D, D, _, _, _, _, _],
  [_, _, _, D, D, K, K, _, K, K, D, D, _, _, _, _],
];

// Slash frame 2 — mid-swing, sword horizontal right (20w × 15h)
const KNIGHT_ATK2: (string | null)[][] = [
  [_, _, _, _, D, D, V, V, V, D, D, _, _, _, _, _, _, _, _, _],
  [_, _, _, D, V, V, V, V, V, V, V, D, _, _, _, _, _, _, _, _],
  [_, _, _, D, V, V, V, G, V, V, V, D, _, _, _, _, _, _, _, _],
  [_, _, _, D, K, K, B, B, B, K, K, D, _, _, _, _, _, _, _, _],
  [_, _, _, _, D, F, F, F, F, F, D, _, _, _, _, _, _, _, _, _],
  [_, _, P, D, D, V, V, V, V, V, D, D, P, _, _, _, _, _, _, _],
  [_, P, D, V, V, V, V, V, V, V, V, V, D,Ht, S,PK,PK,PK,PK, W],
  [_, _, D, V, V, G, W, G, W, G, V, V, D,Ht, S,PK,Pk2,PK,Pk2, _],
  [_, _, D, V, V, V, V, V, V, V, V, V, D, _, _, _, _, _, _, _],
  [_, _, _, D, V, V, V, V, V, V, V, D, _, _, _, _, _, _, _, _],
  [_, _, _, D,BR,BR, D, S, D,BR,BR, D, _, _, _, _, _, _, _, _],
  [_, _, _, _, D, P, D, _, D, P, D, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, D, P, D, _, D, P, D, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, D, D, D, _, D, D, D, _, _, _, _, _, _, _, _, _],
  [_, _, _, D, D, K, K, _, K, K, D, D, _, _, _, _, _, _, _, _],
];

// Slash frame 3 — follow-through, sword swept down-right (18w × 17h)
const KNIGHT_ATK3: (string | null)[][] = [
  [_, _, _, _, D, D, V, V, V, D, D, _, _, _, _, _, _, _],
  [_, _, _, D, V, V, V, V, V, V, V, D, _, _, _, _, _, _],
  [_, _, _, D, V, V, V, G, V, V, V, D, _, _, _, _, _, _],
  [_, _, _, D, K, K, B, B, B, K, K, D, _, _, _, _, _, _],
  [_, _, _, _, D, F, F, F, F, F, D, _, _, _, _, _, _, _],
  [_, _, P, D, D, V, V, V, V, V, D, D, P, _, _, _, _, _],
  [_, P, D, V, V, V, V, V, V, V, V, V, D, _, _, _, _, _],
  [_, _, D, V, V, G, W, G, W, G, V, V, D, _, _, _, _, _],
  [_, _, D, V, V, V, V, V, V, V, V, V, D,Ht, _, _, _, _],
  [_, _, _, D, V, V, V, V, V, V, V, D, _, S,PK, _, _, _],
  [_, _, _, D,BR,BR, D, S, D,BR,BR, D, _, _,PK,PK, _, _],
  [_, _, _, _, D, P, D, _, D, P, D, _, _, _, W,PK,PK, _],
  [_, _, _, _, D, P, D, _, D, P, D, _, _, _, _, _, W, _],
  [_, _, _, _, D, D, D, _, D, D, D, _, _, _, _, _, _, _],
  [_, _, _, D, D, K, K, _, K, K, D, D, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

// ── ENEMIES ───────────────────────────────────────────────────
const SLIME: (string | null)[][] = [
  [_, _, GN,GN,GN,GN, _, _],
  [_,GN,GN,GN,GN,GN,GN, _],
  [GN,GN, K,GN,GN, K,GN,GN],
  [GN,GN,GN,GN,GN,GN,GN,GN],
  [GD,GN,GN,GN,GN,GN,GN,GD],
  [_, GD,GD,GN,GN,GD,GD, _],
];

const Bn = "#d4d4d8"; const BnD = "#a1a1aa";
const SKELETON: (string | null)[][] = [
  [_, _, _, Bn,Bn,Bn,Bn, _, _, _],
  [_, _,Bn,Bn,Bn,Bn,Bn,Bn, _, _],
  [_, _,Bn, K,Bn,Bn, K,Bn, _, _],
  [_, _,Bn,Bn, K, K,Bn,Bn, _, _],
  [_, _, _,Bn,Bn,Bn,Bn, _, _, _],
  [_, _, _, _,Bn,Bn, _, _, _, _],
  [_, _,BnD,Bn,Bn,Bn,Bn,BnD, _, _],
  [_, _, _,Bn,Bn,Bn,Bn, _, _, _],
  [_, _, _,Bn, K, K,Bn, _, _, _],
  [_, _, _,Bn,Bn,Bn,Bn, _, _, _],
  [_, _, _, _,Bn,Bn, _, _, _, _],
  [_, _, _,Bn, _, _,Bn, _, _, _],
  [_, _, _,Bn, _, _,Bn, _, _, _],
  [_, _,Bn,Bn, _, _,Bn,Bn, _, _],
];

const Mg = "#581c87"; const MgD = "#3b0764"; const MgL = "#7e22ce";
const MAGE: (string | null)[][] = [
  [_, _, _,MgD,MgD,MgD,MgD, _, _, _],
  [_, _,MgD,Mg,Mg,Mg,Mg,MgD, _, _],
  [_,MgD,Mg,Mg,Mg,Mg,Mg,Mg,MgD, _],
  [_,MgD,Mg,RE,Mg,Mg,RE,Mg,MgD, _],
  [_, _,MgD,Mg,Mg,Mg,Mg,MgD, _, _],
  [_, _, _,MgD,MgD,MgD,MgD, _, _, _],
  [_, _,MgD,Mg,Mg,Mg,Mg,MgD, _, _],
  [_,MgD,Mg,Mg,MgL,MgL,Mg,Mg,MgD, _],
  [_,MgD,Mg,Mg,Mg,Mg,Mg,Mg,MgD, _],
  [MgD,Mg,Mg,Mg,Mg,Mg,Mg,Mg,Mg,MgD],
  [MgD,Mg,Mg,Mg,Mg,Mg,Mg,Mg,Mg,MgD],
  [_,MgD,Mg,Mg,Mg,Mg,Mg,Mg,MgD, _],
  [_, _,MgD,MgD, _, _,MgD,MgD, _, _],
  [_, _,MgD,MgD, _, _,MgD,MgD, _, _],
];

const CBOT: (string | null)[][] = [
  [_, _,Gr,Gr,Gr,Gr,Gr,Gr, _, _],
  [_,Gr,GrD,GrD,GrD,GrD,GrD,GrD,Gr, _],
  [_,Gr,RE,GrD,GrD,GrD,RE,GrD,Gr, _],
  [_,Gr,GrD,GrD, R, R,GrD,GrD,Gr, _],
  [_, _,Gr,Gr,Gr,Gr,Gr,Gr, _, _],
  [_, _, _,Gr,GrD,GrD,Gr, _, _, _],
  [_,Gr,Gr,GrD,GrD,GrD,GrD,Gr,Gr, _],
  [Gr, _,Gr,GrD,RE,RE,GrD,Gr, _,Gr],
  [_, _,Gr,GrD,GrD,GrD,GrD,Gr, _, _],
  [_, _, _,Gr,Gr,Gr,Gr, _, _, _],
  [_, _, _,Gr, _, _,Gr, _, _, _],
  [_, _,Gr,Gr, _, _,Gr,Gr, _, _],
];

const Sh = "#1e1b4b"; const ShD = "#0f0a2e"; const ShL = "#312e81";
const SHADOW: (string | null)[][] = [
  [_, _,ShD, _, _, _, _,ShD, _, _],
  [_,ShD,Sh,ShD, _, _,ShD,Sh,ShD, _],
  [ShD,Sh,Sh,Sh,ShD,ShD,Sh,Sh,Sh,ShD],
  [ShD,Sh,RE,Sh,Sh,Sh,Sh,RE,Sh,ShD],
  [ShD,Sh,Sh,ShL,Sh,Sh,ShL,Sh,Sh,ShD],
  [_,ShD,Sh,Sh,Sh,Sh,Sh,Sh,ShD, _],
  [_, _,ShD,Sh,Sh,Sh,Sh,ShD, _, _],
  [_,ShD, _,ShD,Sh,Sh,ShD, _,ShD, _],
  [ShD, _, _, _,ShD,ShD, _, _, _,ShD],
  [_, _, _, _,ShD,ShD, _, _, _, _],
];

const Dm = "#450a0a";
const DEMON: (string | null)[][] = [
  [RD, _, _, _, _, _, _, _, _, _, _, _, _,RD],
  [RR,RD, _, _, _, _, _, _, _, _, _, _,RD,RR],
  [_,RR,RD, _, _,RD,RD,RD,RD, _, _,RD,RR, _],
  [_, _,RD,RD,RD,RR,RR,RR,RR,RD,RD,RD, _, _],
  [_, _,RD,RR,RR,RR,RR,RR,RR,RR,RR,RD, _, _],
  [_, _,RD,RE,RE,RR,RR,RR,RR,RE,RE,RD, _, _],
  [_, _, _,RD,RR,RR, K, K,RR,RR,RD, _, _, _],
  [_, _, _,RD,RR, K, R, R, K,RR,RD, _, _, _],
  [_, _, _, _,RD,RR,RR,RR,RR,RD, _, _, _, _],
  [_, _,RD,Dm,RD,RR,RR,RR,RR,RD,Dm,RD, _, _],
  [_,RD,Dm,Dm,RR,RR,RE,RE,RR,RR,Dm,Dm,RD, _],
  [_,RD,Dm,RR,RR,RR,RR,RR,RR,RR,RR,Dm,RD, _],
  [_, _,RD,Dm,RR,RR,RR,RR,RR,RR,Dm,RD, _, _],
  [_, _, _,RD,RD,RR,RR,RR,RR,RD,RD, _, _, _],
  [_, _, _, _,RD,RR,RD,RD,RR,RD, _, _, _, _],
  [_, _, _, _,RD,RR,RD,RD,RR,RD, _, _, _, _],
  [_, _, _,RD,RD, K, K, K, K,RD,RD, _, _, _],
  [_, _, _, K, K, K, _, _, K, K, K, _, _, _],
];

const ENEMY_TYPES = [SLIME, SKELETON, MAGE, CBOT, SHADOW];
const ENEMY_SPEEDS = [0.00018, 0.00025, 0.0002, 0.0003, 0.00035];
const ENEMY_HP =     [1,       2,       2,      3,      2];
const ENEMY_NAMES = ["Null Slime", "Stack Skeleton", "Void Mage", "Corrupt Bot", "Shadow Thread"];

// Event-driven whispers — triggered by game milestones
const WHISPER_DURATION = 3500;

const SKILLS = [
  { name: "DUAL BLADES", icon: "⚔", color: PK },
  { name: "IRON GUARD", icon: "🛡", color: Cy },
  { name: "BLOOD RAGE", icon: "🔥", color: Or },
  { name: "CRITICAL HIT", icon: "💥", color: S },
  { name: "DEMON SIGHT", icon: "👁", color: RE },
];

// ── Types ─────────────────────────────────────────────────────
type GameState = "playing" | "cinematic" | "victory" | "defeat";
interface Entity {
  x: number; y: number; vy: number; hp: number;
  attacking: boolean; attackTime: number;
  invulnUntil: number; grounded: boolean; walkCycle: number;
}
interface Enemy {
  x: number; y: number; speed: number; vx: number;
  hp: number; maxHp: number; isBoss: boolean;
  hitFlash: number; dead: boolean; deathTime: number;
  walkCycle: number; type: number; facingRight: boolean;
  bossPhase: "approach" | "fight" | "charge" | "slam" | "retreat";
  phaseTimer: number;
  enraged: boolean;
  chargeDir: number;
  slamWave: number;
  stunUntil: number;
  knockVx: number;
}
interface Slash { x: number; y: number; time: number; }
interface Prt { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number; }

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [showSkip, setShowSkip] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const [bossActive, setBossActive] = useState(false);
  const [kills, setKills] = useState(0);
  const [score, setScore] = useState(0);
  const [unlockedSkills, setUnlockedSkills] = useState<number[]>([]);
  const [skillFlash, setSkillFlash] = useState<string | null>(null);
  const completedRef = useRef(false);
  const sound = useSound();
  const xp = useXP();

  const playerRef = useRef<Entity>({
    x: PLAYER_X, y: GROUND_Y, vy: 0, hp: PLAYER_MAX_HP,
    attacking: false, attackTime: 0, invulnUntil: 0, grounded: true, walkCycle: 0,
  });
  const enemiesRef = useRef<Enemy[]>([]);
  const slashesRef = useRef<Slash[]>([]);
  const particlesRef = useRef<Prt[]>([]);
  const killsRef = useRef(0);
  const scoreRef = useRef(0);
  const bossSpawnedRef = useRef(false);
  const bossIntroRef = useRef(0); // timestamp when intro started, 0 = not started
  const stateRef = useRef<GameState>("playing");
  const lastSpawnRef = useRef(0);
  const spawnOrderRef = useRef(0);
  const frameRef = useRef(0);
  const bgOffsetRef = useRef(0);
  const cinematicStartRef = useRef(0);
  const cinematicDoneRef = useRef(false);
  const shakeRef = useRef({ x: 0, y: 0, until: 0 });
  const gateGlowRef = useRef(0);
  const bossAtmoRef = useRef(0); // 0=peaceful, 1=blood moon
  const bossDeathTimeRef = useRef(0);
  const unlockedSkillsRef = useRef<number[]>([]);
  const whisperRef = useRef<{ text: string; start: number }[]>([]);
  const whisperTriggeredRef = useRef<Set<string>>(new Set());
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const shake = useCallback((intensity: number, duration: number) => {
    shakeRef.current = { x: intensity, y: intensity, until: Date.now() + duration };
  }, []);

  const whisper = useCallback((id: string, text: string) => {
    if (whisperTriggeredRef.current.has(id)) return;
    whisperTriggeredRef.current.add(id);
    whisperRef.current.push({ text, start: Date.now() });
  }, []);

  const finishGame = useCallback((victory: boolean) => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (victory) {
      stateRef.current = "cinematic";
      setGameState("cinematic");
      cinematicStartRef.current = Date.now();
      sound.achievement();
      shake(8, 500);
      whisper("gate-open", "You've proved your worth...");
      setTimeout(() => whisper("welcome", "Welcome to Jin Wei's Portfolio."), 2500);
      xp.addMilestone("gate-breaker", "Gate Breaker", 30);
      if (playerRef.current.hp === PLAYER_MAX_HP) xp.addMilestone("flawless-boot", "Flawless Boot", 50);
      if (scoreRef.current >= 80) xp.addMilestone("boot-warrior", "Boot Warrior", 25);
    } else {
      stateRef.current = "defeat";
      setGameState("defeat");
      shake(10, 600);
      setTimeout(onComplete, 2200);
    }
  }, [sound, xp, onComplete, shake, whisper]);

  const spawnParticles = useCallback((x: number, y: number, color: string, count: number) => {
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const spd = 0.0008 + Math.random() * 0.003;
      particlesRef.current.push({
        x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - 0.002,
        life: 1, color, size: PX + Math.random() * PX,
      });
    }
  }, []);

  const unlockSkill = useCallback((killNum: number) => {
    if (killNum > 0 && killNum <= SKILLS.length) {
      const skill = SKILLS[killNum - 1];
      unlockedSkillsRef.current = [...unlockedSkillsRef.current, killNum - 1];
      setUnlockedSkills(prev => [...prev, killNum - 1]);
      setSkillFlash(`${skill.icon} ${skill.name}`);
      sound.levelUp();
      setTimeout(() => setSkillFlash(null), 1800);
    }
  }, [sound]);

  const hasSkill = useCallback((idx: number) => unlockedSkillsRef.current.includes(idx), []);

  const doAttack = useCallback(() => {
    if (stateRef.current !== "playing") return;
    const p = playerRef.current;
    if (p.attacking) return;
    const now = Date.now();
    p.attacking = true;
    p.attackTime = now;
    sound.click();

    const hasDualBlades = hasSkill(0); // snapshot before kills
    const isShieldBash = hasSkill(1);
    slashesRef.current.push({ x: p.x + 0.04, y: p.y - 0.05, time: now });

    const hitEnemy = (e: Enemy) => {
      let dmg = 1;
      if (hasSkill(3) && Math.random() < 0.3) dmg = 2; // CRITICAL HIT — 30% crit
      if (hasSkill(2)) dmg += 1; // BLOOD RAGE — +1 base damage
      e.hp -= dmg;
      e.hitFlash = now;
      // Shield bash = bigger knockback + longer stun
      if (isShieldBash) {
        e.knockVx = e.isBoss ? 0.0005 : 0.0012;
        e.stunUntil = now + (e.isBoss ? 700 : 1000);
      } else {
        e.knockVx = e.isBoss ? 0.0003 : 0.0008;
        e.stunUntil = now + (e.isBoss ? 400 : 600);
      }
      const color = dmg > 1 ? "#fbbf24" : (e.isBoss ? "#ec4899" : SKILLS[Math.min(killsRef.current, 4)].color);
      spawnParticles(e.x, e.y - 0.06, color, dmg > 1 ? 14 : 10);
      shake(e.isBoss ? 5 : 3, 150);
      if (e.isBoss && e.hp > 0 && e.hp <= Math.floor(e.maxHp / 2)) {
        whisper("boss-half", "It weakens... strike harder!");
      }
      if (e.hp <= 0) {
        e.dead = true;
        e.deathTime = now;
        killsRef.current++;
        setKills(killsRef.current);
        scoreRef.current += e.isBoss ? 50 : 15;
        setScore(scoreRef.current);
        spawnParticles(e.x, e.y - 0.06, "#ffffff", 14);
        shake(e.isBoss ? 10 : 4, e.isBoss ? 400 : 200);
        if (e.isBoss) {
            bossDeathTimeRef.current = now;
            // Explosion cascade — multiple delayed particle bursts + shakes
            for (let burst = 0; burst < 5; burst++) {
              setTimeout(() => {
                const bx = e.x + (Math.random() - 0.5) * 0.1;
                const by = e.y - 0.03 - Math.random() * 0.08;
                spawnParticles(bx, by, burst % 2 === 0 ? "#ef4444" : "#fbbf24", 16);
                shake(8 - burst, 300);
                sound.click();
              }, burst * 300);
            }
            // Final big explosion + finish after cascade
            setTimeout(() => {
              spawnParticles(e.x, e.y - 0.06, "#ffffff", 25);
              shake(12, 600);
              sound.achievement();
              finishGame(true);
            }, 1600);
          }
        else {
          unlockSkill(killsRef.current);
          if (killsRef.current === 1) whisper("first-kill", "Prove your worth, traveller...");
          if (killsRef.current === 3) whisper("mid-kill", "Power courses through you...");
          if (killsRef.current === BOSS_SPAWN_KILLS) whisper("boss-ready", "Something stirs in the darkness...");
        }
      }
    };

    let hitSomething = false;
    for (const e of enemiesRef.current) {
      if (e.dead) continue;
      const dx = e.x - (p.x + 0.05);
      const dy = Math.abs(e.y - p.y);
      const range = e.isBoss ? BOSS_HIT_RANGE : HIT_RANGE;
      if (dx > -0.04 && dx < range && dy < 0.15) {
        hitEnemy(e);
        hitSomething = true;
      }
    }
    if (hitSomething) sound.whoosh();

    // DUAL BLADES — auto second hit after short delay (only if had skill before this attack)
    const attackDur = hasSkill(2) ? ATTACK_DUR * 0.65 : ATTACK_DUR; // BLOOD RAGE — faster attacks
    if (hasDualBlades) {
      setTimeout(() => {
        slashesRef.current.push({ x: p.x + 0.04, y: p.y - 0.05, time: Date.now() });
        sound.click();
        for (const e of enemiesRef.current) {
          if (e.dead) continue;
          const dx2 = e.x - (p.x + 0.05);
          const dy2 = Math.abs(e.y - p.y);
          const range2 = e.isBoss ? BOSS_HIT_RANGE : HIT_RANGE;
          if (dx2 > -0.04 && dx2 < range2 && dy2 < 0.15) {
            hitEnemy(e);
          }
        }
      }, attackDur * 0.45);
    }

    setTimeout(() => { p.attacking = false; }, attackDur);
  }, [sound, spawnParticles, finishGame, shake, unlockSkill, whisper, hasSkill]);

  const doJump = useCallback(() => {
    const p = playerRef.current;
    if (!p.grounded || stateRef.current !== "playing") return;
    p.vy = JUMP_VEL;
    p.grounded = false;
    sound.hover();
  }, [sound, hasSkill]);

  useEffect(() => { const t = setTimeout(() => setShowSkip(true), 3000); return () => clearTimeout(t); }, []);

  // Intro whisper
  useEffect(() => {
    const t = setTimeout(() => whisper("intro", "Welcome to Jin Wei's Portfolio..."), 800);
    return () => clearTimeout(t);
  }, [whisper]);

  const togglePause = useCallback(() => {
    if (stateRef.current !== "playing") return;
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  }, []);

  // Keyboard input — direct registration, re-attaches when callbacks change
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "p" || e.key === "P") { e.preventDefault(); e.stopPropagation(); togglePause(); return; }
      if (pausedRef.current) return;
      const k = e.key.toLowerCase();
      if (k === " " || k === "z" || k === "x") { e.preventDefault(); e.stopPropagation(); doAttack(); }
      if (k === "arrowup" || k === "w") { e.preventDefault(); e.stopPropagation(); doJump(); }
    };
    window.addEventListener("keydown", onKey, true); // capture phase
    return () => window.removeEventListener("keydown", onKey, true);
  }, [doAttack, doJump, togglePause]);

  // Native touch listeners — must be { passive: false } to preventDefault
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const isUI = (t: EventTarget | null) => {
      const el2 = t as HTMLElement;
      return el2?.closest?.("[data-skip]") || el2?.closest?.("[data-pause]") || el2?.tagName === "BUTTON";
    };
    const onTouchStart = (e: TouchEvent) => {
      if (isUI(e.target)) return; // let button handle it
      e.preventDefault();
      if (pausedRef.current) return;
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, time: Date.now() };
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (isUI(e.target)) return;
      e.preventDefault();
      if (pausedRef.current) return;
      const s = touchStartRef.current;
      if (!s) { doAttack(); return; }
      if (e.changedTouches[0].clientY - s.y < -30 && Date.now() - s.time < 400) doJump(); else doAttack();
      touchStartRef.current = null;
    };
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [doAttack, doJump]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-skip]") || (e.target as HTMLElement).closest("[data-pause]")) return;
    if (pausedRef.current) return;
    doAttack();
  }, [doAttack]);

  // ── RENDER LOOP ─────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    let running = true;
    let lastTime = performance.now();
    // cinematicDone tracked via ref to survive effect re-runs

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; ctx.imageSmoothingEnabled = false; };
    resize();
    window.addEventListener("resize", resize);

    const loop = (time: number) => {
      if (!running) return;
      const dt = Math.min(time - lastTime, 50);
      lastTime = time;
      const cw = canvas.width;
      const ch = canvas.height;
      const now = Date.now();
      const mob = cw < 768;
      const sc = mob ? 0.65 : 1;
      const state = stateRef.current;

      // Screen shake
      const sk = shakeRef.current;
      let shX = 0, shY = 0;
      if (now < sk.until) {
        const t = (sk.until - now) / 300;
        shX = (Math.random() - 0.5) * sk.x * t;
        shY = (Math.random() - 0.5) * sk.y * t;
      }
      ctx.save();
      ctx.translate(shX, shY);

      ctx.fillStyle = "#050507";
      ctx.fillRect(-10, -10, cw + 20, ch + 20);

      // BG scroll
      if ((state === "playing" && !pausedRef.current) || state === "cinematic") bgOffsetRef.current += 0.12 * dt;
      const bgOff = bgOffsetRef.current;

      // ── ATMOSPHERE — ramps to blood moon during boss ──────
      const bossAlive = enemiesRef.current.some(e => e.isBoss && !e.dead);
      const introActive = bossIntroRef.current > 0 && !bossSpawnedRef.current;
      if (introActive || bossAlive) {
        bossAtmoRef.current = Math.min(bossAtmoRef.current + 0.0008 * dt, 1);
      } else if (state === "cinematic") {
        bossAtmoRef.current = Math.max(bossAtmoRef.current - 0.0005 * dt, 0);
      }
      const atmo = bossAtmoRef.current; // 0=peaceful, 1=blood moon

      // ── DEMONIC FOREST BACKGROUND ──────────────────────────
      const gy = Math.round(ch * GROUND_Y);

      // Sky gradient — shifts from purple to blood red based on atmo
      const skyGrd = ctx.createLinearGradient(0, 0, 0, gy);
      const r1 = Math.round(10 + atmo * 40);
      const g1 = Math.round(0 + atmo * 0);
      const b1 = Math.round(21 - atmo * 15);
      const r2 = Math.round(18 + atmo * 30);
      const g2 = Math.round(8 - atmo * 8);
      const b2 = Math.round(40 - atmo * 30);
      skyGrd.addColorStop(0, `rgb(${r1},${g1},${b1})`);
      skyGrd.addColorStop(0.5, `rgb(${Math.round(15 + atmo * 25)},${Math.round(5 - atmo * 5)},${Math.round(32 - atmo * 25)})`);
      skyGrd.addColorStop(1, `rgb(${r2},${g2},${b2})`);
      ctx.fillStyle = skyGrd;
      ctx.fillRect(0, 0, cw, gy);

      // Blood moon — appears during boss
      if (atmo > 0.1) {
        const moonX = cw * 0.75;
        const moonY = ch * 0.15;
        const moonR = 30 + atmo * 15;
        const moonGrd = ctx.createRadialGradient(moonX, moonY, moonR * 0.3, moonX, moonY, moonR);
        moonGrd.addColorStop(0, `rgba(220,38,38,${atmo * 0.6})`);
        moonGrd.addColorStop(0.5, `rgba(153,27,27,${atmo * 0.3})`);
        moonGrd.addColorStop(1, `rgba(127,29,29,0)`);
        ctx.fillStyle = moonGrd;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonR * 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Moon core
        ctx.fillStyle = `rgba(239,68,68,${atmo * 0.5})`;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonR * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(220,38,38,${atmo * 0.3})`;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Distant mountains
      ctx.fillStyle = "rgba(75,0,130,0.08)";
      for (let i = 0; i < 12; i++) {
        const mx = ((i * 200 - bgOff * 0.03) % (cw + 400)) - 200;
        const mh = 60 + ((i * 71) % 80);
        ctx.beginPath();
        ctx.moveTo(mx, gy);
        ctx.lineTo(mx + 50, gy - mh);
        ctx.lineTo(mx + 100, gy - mh * 0.7);
        ctx.lineTo(mx + 150, gy - mh * 0.9);
        ctx.lineTo(mx + 200, gy);
        ctx.fill();
      }

      // Far trees — dark silhouettes
      for (let i = 0; i < 20; i++) {
        const tx = ((i * 120 - bgOff * 0.08) % (cw + 240)) - 120;
        const th = 80 + ((i * 53) % 60);
        const tw = 6 + ((i * 7) % 4);
        // Trunk
        ctx.fillStyle = "rgba(30,10,40,0.5)";
        ctx.fillRect(Math.round(tx + 15), Math.round(gy - th * 0.4), tw, Math.round(th * 0.4));
        // Canopy — twisted
        ctx.fillStyle = "rgba(40,10,60,0.3)";
        ctx.beginPath();
        ctx.moveTo(tx, gy - th * 0.3);
        ctx.quadraticCurveTo(tx + 15, gy - th, tx + 35, gy - th * 0.3);
        ctx.fill();
      }

      // Mid trees — larger, glowing edges
      for (let i = 0; i < 14; i++) {
        const tx = ((i * 160 + 40 - bgOff * 0.18) % (cw + 320)) - 160;
        const th = 100 + ((i * 67) % 80);
        const tw = 8 + ((i * 5) % 6);
        // Trunk
        ctx.fillStyle = "rgba(20,5,30,0.7)";
        ctx.fillRect(Math.round(tx + 20), Math.round(gy - th * 0.5), tw, Math.round(th * 0.5));
        // Branches
        ctx.strokeStyle = "rgba(20,5,30,0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tx + 24, gy - th * 0.35);
        ctx.quadraticCurveTo(tx + 40, gy - th * 0.45, tx + 50, gy - th * 0.3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(tx + 20, gy - th * 0.4);
        ctx.quadraticCurveTo(tx, gy - th * 0.5, tx - 5, gy - th * 0.35);
        ctx.stroke();
        // Canopy — glowing purple edges
        ctx.fillStyle = "rgba(40,10,60,0.5)";
        ctx.beginPath();
        ctx.moveTo(tx - 5, gy - th * 0.3);
        ctx.quadraticCurveTo(tx + 10, gy - th * 0.9, tx + 25, gy - th);
        ctx.quadraticCurveTo(tx + 40, gy - th * 0.9, tx + 55, gy - th * 0.3);
        ctx.fill();
        // Glow — purple shifts to red during boss
        const glowR2 = Math.round(124 + atmo * 115);
        const glowG2 = Math.round(58 - atmo * 50);
        const glowB2 = Math.round(237 - atmo * 200);
        ctx.strokeStyle = `rgba(${glowR2},${glowG2},${glowB2},${0.06 + Math.sin(now * 0.001 + i) * 0.03 + atmo * 0.06})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tx - 5, gy - th * 0.3);
        ctx.quadraticCurveTo(tx + 10, gy - th * 0.9, tx + 25, gy - th);
        ctx.quadraticCurveTo(tx + 40, gy - th * 0.9, tx + 55, gy - th * 0.3);
        ctx.stroke();
      }

      // Near trees — closest, most visible
      for (let i = 0; i < 8; i++) {
        const tx = ((i * 250 + 80 - bgOff * 0.35) % (cw + 500)) - 250;
        const th = 130 + ((i * 43) % 70);
        const tw = 10 + ((i * 3) % 5);
        // Trunk
        ctx.fillStyle = "rgba(15,5,25,0.8)";
        ctx.fillRect(Math.round(tx + 30), Math.round(gy - th * 0.55), tw, Math.round(th * 0.55));
        // Canopy
        ctx.fillStyle = "rgba(30,8,50,0.6)";
        ctx.beginPath();
        ctx.moveTo(tx, gy - th * 0.35);
        ctx.quadraticCurveTo(tx + 15, gy - th, tx + 35, gy - th * 1.05);
        ctx.quadraticCurveTo(tx + 55, gy - th, tx + 70, gy - th * 0.35);
        ctx.fill();
        // Glow on canopy — shifts purple→red
        const nGlowR = Math.round(168 + atmo * 71);
        const nGlowG = Math.round(85 - atmo * 75);
        const nGlowB = Math.round(247 - atmo * 210);
        ctx.strokeStyle = `rgba(${nGlowR},${nGlowG},${nGlowB},${0.08 + Math.sin(now * 0.002 + i * 2) * 0.05 + atmo * 0.08})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        // Floating embers — more intense during boss
        const emberCount = atmo > 0.3 ? 3 : 2;
        for (let em = 0; em < emberCount; em++) {
          const emberX = tx + 35 + Math.sin(now * 0.001 + i * 3 + em * 2) * 20;
          const emberY = gy - th * 0.6 + Math.cos(now * 0.0015 + i * 2 + em) * 15 - em * 12;
          ctx.fillStyle = `rgba(239,68,68,${(0.2 + atmo * 0.3) + Math.sin(now * 0.003 + i + em) * 0.15})`;
          ctx.fillRect(Math.round(emberX), Math.round(emberY), PX, PX);
        }
      }

      // Ground — shifts from purple to blood
      const groundGrd = ctx.createLinearGradient(0, gy, 0, ch);
      const gndR = Math.round(75 + atmo * 80);
      const gndB = Math.round(130 - atmo * 100);
      groundGrd.addColorStop(0, `rgba(${gndR},0,${gndB},${0.15 + atmo * 0.1})`);
      groundGrd.addColorStop(1, `rgba(${Math.round(30 + atmo * 40)},0,${Math.round(60 - atmo * 50)},0.08)`);
      ctx.fillStyle = "rgba(124,58,237,0.15)";
      ctx.fillRect(0, gy, cw, PX);
      ctx.fillStyle = groundGrd;
      ctx.fillRect(0, gy + PX, cw, ch - gy);
      // Ground grid — path tiles
      ctx.fillStyle = "rgba(124,58,237,0.04)";
      for (let i = 0; i < cw / 40 + 3; i++) {
        const gx = ((i * 40 - bgOff * 0.4) % (cw + 80)) - 40;
        ctx.fillRect(Math.round(gx), gy + PX, PX, ch - gy);
      }
      // Scattered ground details
      ctx.fillStyle = "rgba(124,58,237,0.06)";
      for (let i = 0; i < 15; i++) {
        const gx = ((i * 100 + 20 - bgOff * 0.4) % (cw + 200)) - 100;
        ctx.fillRect(Math.round(gx), gy + 4, 12, 2);
      }

      // ── GATE — only visible during cinematic ──────────────
      const gateW = 60 * sc;
      const gateH = 90 * sc;
      const gateCx = cw * 0.85;
      const gateYp = Math.round(ch * GROUND_Y - gateH);

      if (state === "cinematic" || state === "victory") {
        const cinT = now - cinematicStartRef.current;
        const gateAppear = Math.min(cinT / 1500, 1); // 0→1 over 1.5s
        gateGlowRef.current = Math.min(gateGlowRef.current + 0.0008 * dt, 1);
        const glowR = gateGlowRef.current;

        // Gate materializes from particles
        if (gateAppear < 1) {
          for (let i = 0; i < 6; i++) {
            ctx.globalAlpha = gateAppear * 0.4;
            ctx.fillStyle = "#a78bfa";
            const sparkX = gateCx - gateW / 2 + Math.random() * gateW;
            const sparkY = gateYp + Math.random() * gateH;
            ctx.fillRect(Math.round(sparkX), Math.round(sparkY), PX * 2, PX * 2);
          }
        }

        ctx.globalAlpha = gateAppear;

        // Gate frame — stone pillars
        const pillarW = 8 * sc;
        ctx.fillStyle = "#1e1b4b";
        ctx.fillRect(gateCx - gateW / 2, gateYp, pillarW, gateH); // left pillar
        ctx.fillRect(gateCx + gateW / 2 - pillarW, gateYp, pillarW, gateH); // right pillar
        // Arch top
        ctx.fillRect(gateCx - gateW / 2, gateYp, gateW, pillarW);
        // Pillar detail
        ctx.fillStyle = "#312e81";
        ctx.fillRect(gateCx - gateW / 2 + 2, gateYp + pillarW, pillarW - 4, gateH - pillarW);
        ctx.fillRect(gateCx + gateW / 2 - pillarW + 2, gateYp + pillarW, pillarW - 4, gateH - pillarW);

        // Interior glow
        const innerW = gateW - pillarW * 2;
        const innerH = gateH - pillarW;
        const innerX = gateCx - innerW / 2;
        const innerY = gateYp + pillarW;
        const lightIntensity = Math.min(glowR * 1.5, 1);
        const igrd = ctx.createRadialGradient(
          gateCx, innerY + innerH / 2, 5,
          gateCx, innerY + innerH / 2, Math.max(1, innerW * lightIntensity),
        );
        igrd.addColorStop(0, `rgba(255,255,255,${0.6 * lightIntensity})`);
        igrd.addColorStop(0.4, `rgba(167,139,250,${0.4 * lightIntensity})`);
        igrd.addColorStop(1, `rgba(124,58,237,${0.1 * lightIntensity})`);
        ctx.fillStyle = igrd;
        ctx.fillRect(innerX, innerY, innerW, innerH);

        // Radial glow around gate
        const outerR = Math.max(1, 150 * glowR);
        const ogrd = ctx.createRadialGradient(gateCx, innerY + innerH / 2, 10, gateCx, innerY + innerH / 2, outerR);
        ogrd.addColorStop(0, `rgba(167,139,250,${0.2 * glowR})`);
        ogrd.addColorStop(1, "rgba(124,58,237,0)");
        ctx.fillStyle = ogrd;
        ctx.fillRect(0, 0, cw, ch);

        // Rune symbols on arch
        ctx.fillStyle = `rgba(167,139,250,${0.3 + 0.4 * Math.sin(now * 0.003)})`;
        ctx.font = `${8 * sc}px monospace`;
        ctx.textAlign = "center";
        ctx.fillText("{ }", gateCx, gateYp + pillarW - 1);

        ctx.globalAlpha = 1;
      }

      // ── PLAYER PHYSICS (fixed-step 60fps) ──────────────────
      const p = playerRef.current;
      const steps = Math.round(dt / 16) || 1;
      if (state === "playing" && !pausedRef.current) {
        const grav = 0.00038;
        for (let s = 0; s < steps; s++) {
          p.vy += grav;
          p.y += p.vy;
          if (p.y >= GROUND_Y) { p.y = GROUND_Y; p.vy = 0; p.grounded = true; }
        }
        p.walkCycle += 0.004 * dt;

        // Spawn
        const spawnInterval = 2500 + Math.random() * 2000;

        // Boss intro sequence
        if (killsRef.current >= BOSS_SPAWN_KILLS && !bossSpawnedRef.current) {
          if (bossIntroRef.current === 0) {
            bossIntroRef.current = now;
            setBossActive(true);
            shake(3, 2000);
            sound.glitch();
            whisper("boss-intro", "Something terrible approaches...");
          }
          const introElapsed = now - bossIntroRef.current;
          // Shake escalates
          if (introElapsed > 800 && introElapsed < 1800) {
            shake(4 + (introElapsed - 800) / 200, 200);
          }
          // Spawn boss after intro
          if (introElapsed > 2000) {
            bossSpawnedRef.current = true;
            sound.whoosh();
            shake(10, 500);
            enemiesRef.current.push({
              x: 1.25, y: GROUND_Y, speed: BOSS_SPEED, vx: -BOSS_SPEED,
              hp: BOSS_HP, maxHp: BOSS_HP, isBoss: true,
              hitFlash: 0, dead: false, deathTime: 0, walkCycle: 0, type: 0, facingRight: false,
              bossPhase: "approach", phaseTimer: 0, enraged: false, chargeDir: 0, slamWave: 0, stunUntil: 0, knockVx: 0,
            });
          }
        } else if (!bossSpawnedRef.current && now - lastSpawnRef.current > spawnInterval) {
          lastSpawnRef.current = now;
          if (killsRef.current < BOSS_SPAWN_KILLS) {
            const typeIdx = spawnOrderRef.current % ENEMY_TYPES.length;
            spawnOrderRef.current++;
            const eHp = ENEMY_HP[typeIdx];
            enemiesRef.current.push({
              x: 1.15, y: GROUND_Y, speed: ENEMY_SPEEDS[typeIdx], vx: -ENEMY_SPEEDS[typeIdx],
              hp: eHp, maxHp: eHp, isBoss: false,
              hitFlash: 0, dead: false, deathTime: 0, walkCycle: Math.random() * 10, type: typeIdx, facingRight: false,
              bossPhase: "fight", phaseTimer: 0, enraged: false, chargeDir: 0, slamWave: 0, stunUntil: 0, knockVx: 0,
            });
          }
        }

        // Enemy update
        for (const e of enemiesRef.current) {
          if (e.dead) continue;
          e.walkCycle += 0.003 * dt;

          // Smooth knockback
          if (e.knockVx > 0.00001) {
            e.x += e.knockVx * dt;
            e.knockVx *= 0.92; // friction decay
          }
          // Stunned — skip normal movement
          if (now < e.stunUntil) continue;

          if (e.isBoss) {
            // Enrage at half HP
            if (!e.enraged && e.hp <= Math.floor(e.maxHp / 2)) {
              e.enraged = true;
              e.speed *= 2.2;
              shake(6, 400);
            }
            e.phaseTimer += dt;
            const spd = e.speed;

            switch (e.bossPhase) {
              case "approach":
                // Walk toward player
                e.vx = -spd;
                e.facingRight = false;
                e.x += e.vx * dt;
                if (e.x <= p.x + 0.15) {
                  e.bossPhase = "fight";
                  e.phaseTimer = 0;
                }
                break;

              case "fight":
                // Circle near player, periodic attacks
                e.x += e.vx * dt;
                e.facingRight = e.x < p.x;
                const toPlayer = p.x - e.x;
                if (Math.abs(toPlayer) > 0.12) e.vx = Math.sign(toPlayer) * spd * 0.6;
                else e.vx = Math.sign(toPlayer) * spd * 0.2;

                // Choose attack
                if (e.phaseTimer > (e.enraged ? 1800 : 3000)) {
                  e.phaseTimer = 0;
                  const roll = Math.random();
                  if (roll < (e.enraged ? 0.4 : 0.35)) {
                    e.bossPhase = "charge";
                    e.chargeDir = e.x > p.x ? -1 : 1;
                    e.facingRight = e.chargeDir > 0;
                  } else if (roll < (e.enraged ? 0.75 : 0.65)) {
                    e.bossPhase = "slam";
                    e.slamWave = 0;
                  } else if (e.enraged && enemiesRef.current.filter(en => !en.isBoss && !en.dead).length < 2) {
                    // Summon add
                    spawnParticles(e.x + 0.05, e.y - 0.04, "#ef4444", 8);
                    enemiesRef.current.push({
                      x: e.x + 0.08, y: GROUND_Y, speed: 0.0003, vx: -0.0003,
                      hp: 1, maxHp: 1, isBoss: false,
                      hitFlash: 0, dead: false, deathTime: 0, walkCycle: 0, type: 0, facingRight: false,
                      bossPhase: "fight", phaseTimer: 0, enraged: false, chargeDir: 0, slamWave: 0, stunUntil: 0, knockVx: 0,
                    });
                  }
                }
                break;

              case "charge":
                // Telegraph for 400ms then dash across
                if (e.phaseTimer < 400) {
                  // Telegraph — shake in place
                  e.x += (Math.random() - 0.5) * 0.002;
                } else {
                  // Dash!
                  e.vx = e.chargeDir * spd * 6;
                  e.x += e.vx * dt;
                  e.facingRight = e.chargeDir > 0;
                }
                if (e.phaseTimer > 1200) {
                  e.bossPhase = e.x < 0 || e.x > 1.1 ? "retreat" : "fight";
                  e.phaseTimer = 0;
                }
                break;

              case "slam":
                // Pause, then shockwave
                if (e.phaseTimer < 600) {
                  // Wind up — bob up
                  e.y = GROUND_Y - 0.02 * Math.sin(e.phaseTimer / 600 * Math.PI);
                } else if (e.phaseTimer < 700) {
                  // Slam down
                  e.y = GROUND_Y;
                  if (e.slamWave === 0) {
                    e.slamWave = 1;
                    shake(8, 400);
                    spawnParticles(e.x, GROUND_Y - 0.02, "#ef4444", 12);
                    // Shockwave hits grounded player within range
                    if (p.grounded && Math.abs(p.x - e.x) < 0.3 && now > p.invulnUntil) {
                      p.hp--;
                      p.invulnUntil = now + HIT_INVULN;
                      sound.glitch();
                      shake(6, 300);
                      spawnParticles(p.x, p.y - 0.05, "#ef4444", 8);
                      if (p.hp <= 0) finishGame(false);
                    }
                  }
                }
                if (e.phaseTimer > 1200) {
                  e.bossPhase = "fight";
                  e.phaseTimer = 0;
                  e.y = GROUND_Y;
                }
                break;

              case "retreat":
                // Loop back from off-screen
                if (e.x < 0) { e.vx = spd * 2; e.facingRight = true; }
                else if (e.x > 1) { e.vx = -spd * 2; e.facingRight = false; }
                e.x += e.vx * dt;
                if (e.x > 0.3 && e.x < 0.9) {
                  e.bossPhase = "fight";
                  e.phaseTimer = 0;
                }
                break;
            }
          } else {
            e.x += e.vx * dt;
          }
          const dist = Math.abs(e.x - p.x);
          const yDist = Math.abs(e.y - p.y);
          const hitDist = e.isBoss ? 0.06 : 0.035;
          if (dist < hitDist && yDist < 0.12 && now > p.invulnUntil) {
            p.hp--;
            p.invulnUntil = now + HIT_INVULN;
            sound.glitch();
            shake(6, 300);
            spawnParticles(p.x, p.y - 0.05, "#ef4444", 10);
            e.knockVx = e.isBoss ? 0.0003 : 0.0006;
            e.stunUntil = now + 300;
            if (p.hp <= 0) finishGame(false);
          }
          if (!e.isBoss && e.x < -0.15) { e.dead = true; e.deathTime = now; }
        }
        const deathDur = (e2: Enemy) => e2.isBoss ? 2000 : 600;
        enemiesRef.current = enemiesRef.current.filter(e => !e.dead || now - e.deathTime < deathDur(e));
      }

      // ── CINEMATIC: walk → enter gate → first person ────────
      if (state === "cinematic") {
        const cinT = now - cinematicStartRef.current;
        p.y = GROUND_Y;
        p.grounded = true;
        p.attacking = false;

        if (cinT < 3500) {
          // Phase 1: Knight walks toward gate
          p.walkCycle += 0.004 * dt;
          const gateTarget = 0.84;
          if (p.x < gateTarget) p.x += 0.00022 * dt;
        } else if (cinT < 4200) {
          // Phase 2: Knight shrinks into gate light
          p.x = 0.84;
        } else if (cinT < 7200) {
          // Phase 3: First-person gate view — doors swing open
          const fpT = (cinT - 4200) / 3000; // 0→1 over 3s

          // Black out the side-scroller
          ctx.fillStyle = "#050507";
          ctx.fillRect(0, 0, cw, ch);

          // Perspective gate frame
          const doorH = ch * 0.85;
          const doorTop = (ch - doorH) / 2;
          const frameW = cw * 0.7;
          const frameX = (cw - frameW) / 2;

          // Stone frame
          const fw = 20 * sc;
          ctx.fillStyle = "#1e1b4b";
          ctx.fillRect(frameX - fw, doorTop - fw, frameW + fw * 2, fw); // top
          ctx.fillRect(frameX - fw, doorTop, fw, doorH); // left
          ctx.fillRect(frameX + frameW, doorTop, fw, doorH); // right
          ctx.fillStyle = "#312e81";
          ctx.fillRect(frameX - fw + 4, doorTop - fw + 4, frameW + fw * 2 - 8, fw - 8);

          // Rune on arch
          ctx.fillStyle = `rgba(167,139,250,${0.5 + 0.3 * Math.sin(now * 0.004)})`;
          ctx.font = `bold ${14 * sc}px monospace`;
          ctx.textAlign = "center";
          ctx.fillText("< JIN WEI />", cw / 2, doorTop - fw / 2 + 5);

          // Doors swing open — each door rotates outward
          const doorOpenPct = Math.min(fpT * 1.2, 1); // ease into full open
          const eased = 1 - Math.pow(1 - doorOpenPct, 3); // ease-out cubic
          const leftDoorW = (frameW / 2) * (1 - eased);
          const rightDoorW = (frameW / 2) * (1 - eased);

          // Light behind doors — grows as doors open
          const lightAlpha = eased * 0.9;
          const lightGrd = ctx.createRadialGradient(cw / 2, ch / 2, 10, cw / 2, ch / 2, Math.max(1, ch * 0.6 * eased));
          lightGrd.addColorStop(0, `rgba(255,255,255,${lightAlpha})`);
          lightGrd.addColorStop(0.3, `rgba(200,180,255,${lightAlpha * 0.7})`);
          lightGrd.addColorStop(0.6, `rgba(124,58,237,${lightAlpha * 0.3})`);
          lightGrd.addColorStop(1, "rgba(5,5,7,0)");
          ctx.fillStyle = lightGrd;
          ctx.fillRect(frameX, doorTop, frameW, doorH);

          // Left door
          if (leftDoorW > 1) {
            ctx.fillStyle = "#0f0a2e";
            ctx.fillRect(frameX, doorTop, leftDoorW, doorH);
            // Door detail — panels
            ctx.strokeStyle = "#1e1b4b";
            ctx.lineWidth = 2;
            ctx.strokeRect(frameX + 4, doorTop + 10, leftDoorW - 8, doorH / 3 - 20);
            ctx.strokeRect(frameX + 4, doorTop + doorH / 3 + 10, leftDoorW - 8, doorH / 3 - 20);
            // Door handle
            ctx.fillStyle = "#a78bfa";
            ctx.fillRect(frameX + leftDoorW - 8, doorTop + doorH / 2 - 6, 4, 12);
          }

          // Right door
          if (rightDoorW > 1) {
            ctx.fillStyle = "#0f0a2e";
            ctx.fillRect(frameX + frameW - rightDoorW, doorTop, rightDoorW, doorH);
            ctx.strokeStyle = "#1e1b4b";
            ctx.lineWidth = 2;
            ctx.strokeRect(frameX + frameW - rightDoorW + 4, doorTop + 10, rightDoorW - 8, doorH / 3 - 20);
            ctx.strokeRect(frameX + frameW - rightDoorW + 4, doorTop + doorH / 3 + 10, rightDoorW - 8, doorH / 3 - 20);
            ctx.fillStyle = "#a78bfa";
            ctx.fillRect(frameX + frameW - rightDoorW + 4, doorTop + doorH / 2 - 6, 4, 12);
          }

          // Final white flood
          if (fpT > 0.7) {
            const whiteAlpha = (fpT - 0.7) / 0.3;
            ctx.fillStyle = `rgba(255,255,255,${whiteAlpha})`;
            ctx.fillRect(0, 0, cw, ch);
          }
        }

        // Transition — fire onComplete when white flood is nearly full
        if (cinT > 7000 && !cinematicDoneRef.current) {
          cinematicDoneRef.current = true;
          stateRef.current = "victory";
          setGameState("victory");
          onComplete();
        }
      }

      // ── DRAW PLAYER ─────────────────────────────────────────
      const cinT2 = state === "cinematic" ? now - cinematicStartRef.current : 0;
      const hiddenInGate = state === "cinematic" && cinT2 > 4200;
      const fadingIntoGate = state === "cinematic" && cinT2 >= 3500 && cinT2 < 4200;

      if (!hiddenInGate) {
        const ppx = p.x * cw;
        const ppy = p.y * ch;
        const invuln = now < p.invulnUntil;
        if (invuln && Math.floor(now / 120) % 2 === 0) ctx.globalAlpha = 0.35;
        if (fadingIntoGate) {
          const fadeT = (cinT2 - 3500) / 700;
          ctx.globalAlpha = 1 - fadeT;
        }

        // Pick frame: 3-frame slash animation or walk cycle
        let spr: (string | null)[][];
        if (p.attacking) {
          const atkElapsed = now - p.attackTime;
          const atkPhase = atkElapsed / ATTACK_DUR;
          if (atkPhase < 0.25) spr = KNIGHT_ATK1;      // wind-up
          else if (atkPhase < 0.55) spr = KNIGHT_ATK2;  // mid-swing
          else spr = KNIGHT_ATK3;                        // follow-through
        } else if (p.grounded && (state === "playing" || state === "cinematic")) {
          spr = Math.floor(p.walkCycle * 3) % 2 === 0 ? KNIGHT : KNIGHT_WALK2;
        } else {
          spr = KNIGHT;
        }
        const sprSc = fadingIntoGate ? sc * (1 - (cinT2 - 3500) / 700 * 0.7) : sc;
        const sprW = spr[0].length * PX * sprSc;
        const sprH = spr.length * PX * sprSc;
        const knightOx = ppx - sprW * 0.4;
        const knightOy = ppy - sprH;
        drawSprite(ctx, knightOx, knightOy, spr, sprSc);

        // ── SKILL COSMETICS on knight ───────────────────────
        const pxSz = PX * sprSc;
        const skills = unlockedSkillsRef.current;

        // DUAL BLADES (0) — second sword on left side
        if (skills.includes(0) && !p.attacking) {
          const sx = knightOx - 3 * pxSz;
          const sy = knightOy + 5 * pxSz;
          ctx.fillStyle = G;
          ctx.fillRect(Math.round(sx + pxSz), Math.round(sy + 5 * pxSz), pxSz, pxSz);
          ctx.fillRect(Math.round(sx), Math.round(sy + 6 * pxSz), pxSz, pxSz);
          ctx.fillStyle = S;
          ctx.fillRect(Math.round(sx + pxSz), Math.round(sy + 6 * pxSz), pxSz, pxSz);
          ctx.fillStyle = Ht;
          ctx.fillRect(Math.round(sx), Math.round(sy + 7 * pxSz), pxSz, pxSz);
        }

        // IRON GUARD (1) — shield on left arm
        if (skills.includes(1)) {
          const shX = knightOx - 1 * pxSz;
          const shY = knightOy + 5.5 * pxSz;
          ctx.fillStyle = "#0e7490"; // cyan dark
          ctx.fillRect(Math.round(shX - 2 * pxSz), Math.round(shY), pxSz * 3, pxSz * 4);
          ctx.fillStyle = "#06b6d4"; // cyan
          ctx.fillRect(Math.round(shX - 1.5 * pxSz), Math.round(shY + 0.5 * pxSz), pxSz * 2, pxSz * 3);
          ctx.fillStyle = W;
          ctx.fillRect(Math.round(shX - 0.5 * pxSz), Math.round(shY + 1.5 * pxSz), pxSz, pxSz);
        }

        // BLOOD RAGE (2) — red eyes + red glow aura
        if (skills.includes(2)) {
          // Red visor override (row 3 of knight = visor)
          ctx.fillStyle = RE;
          ctx.fillRect(Math.round(knightOx + 4 * pxSz), Math.round(knightOy + 3 * pxSz), pxSz * 2, pxSz);
          ctx.fillRect(Math.round(knightOx + 8 * pxSz), Math.round(knightOy + 3 * pxSz), pxSz * 2, pxSz);
          // Red aura
          ctx.globalAlpha = 0.08 + Math.sin(now * 0.006) * 0.05;
          ctx.fillStyle = "#dc2626";
          ctx.beginPath();
          ctx.arc(ppx, ppy - sprH * 0.5, sprH * 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        // CRITICAL HIT (3) — sword blade glows gold
        if (skills.includes(3) && !p.attacking) {
          // Gold glow on sword position (right side, rows 15-17 of idle)
          const swX = knightOx + 12 * pxSz;
          const swY = knightOy + 9 * pxSz;
          ctx.globalAlpha = 0.3 + Math.sin(now * 0.005) * 0.15;
          ctx.shadowColor = "#fbbf24";
          ctx.shadowBlur = 8;
          ctx.fillStyle = "#fbbf24";
          ctx.fillRect(Math.round(swX), Math.round(swY), pxSz, pxSz * 3);
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }

        // DEMON SIGHT (4) — visor changes to red slit
        if (skills.includes(4)) {
          ctx.fillStyle = "#ef4444";
          ctx.shadowColor = "#ef4444";
          ctx.shadowBlur = 4;
          ctx.fillRect(Math.round(knightOx + 4 * pxSz), Math.round(knightOy + 3 * pxSz), pxSz * 7, pxSz);
          ctx.shadowBlur = 0;
        }

        ctx.globalAlpha = 1;
      }

      // ── DRAW ENEMIES ────────────────────────────────────────
      if (hiddenInGate) { /* skip enemy draw in first-person */ }
      else for (const e of enemiesRef.current) {
        const epx = e.x * cw;
        const epy = e.y * ch;
        const flash = now - e.hitFlash < 150;
        if (e.dead) {
          const dDur = e.isBoss ? 2000 : 600;
          const dProg = Math.min((now - e.deathTime) / dDur, 1);
          ctx.globalAlpha = 1 - dProg;
          if (e.isBoss && dProg < 0.8) {
            // Flash white/red rapidly during death cascade
            if (Math.floor(now / 80) % 2 === 0) ctx.globalAlpha *= 0.3;
          }
        }
        const eSpr = e.isBoss ? DEMON : ENEMY_TYPES[e.type];
        const eSc = e.isBoss ? sc * 1.4 : sc * (e.type === 0 ? 1.2 : 1);
        const eW = eSpr[0].length * PX * eSc;
        const eH = eSpr.length * PX * eSc;
        const eBob = Math.sin(e.walkCycle * 5) * 3 * eSc;
        // Squish/stretch animation
        const squishX = 1 + Math.sin(e.walkCycle * 5) * 0.06;
        const squishY = 1 - Math.sin(e.walkCycle * 5) * 0.06;
        // Lean into movement
        const lean = e.facingRight ? 0.04 : -0.04;

        ctx.save();
        ctx.translate(epx, epy);
        ctx.rotate(lean * Math.sin(e.walkCycle * 4));
        ctx.scale(squishX, squishY);

        if (flash) {
          const fMap = eSpr.map(row => row.map(c => c ? "#ffffff" : _));
          drawSprite(ctx, -eW / 2, -eH + eBob, fMap, eSc, !e.facingRight);
        } else {
          drawSprite(ctx, -eW / 2, -eH + eBob, eSpr, eSc, !e.facingRight);
        }
        ctx.restore();

        if (!e.dead && !e.isBoss) {
          const hasDemonSense = unlockedSkillsRef.current.includes(4);
          ctx.fillStyle = hasDemonSense ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.2)";
          ctx.font = `${mob ? 7 : 8}px monospace`;
          ctx.textAlign = "center";
          ctx.fillText(ENEMY_NAMES[e.type], epx, epy - eH - 6 + eBob);
          // HP bar — always show with demon sense, otherwise only multi-hit
          if (e.maxHp > 1 || hasDemonSense) {
            const hpBarW = 24 * eSc;
            const hpBarH = 3;
            const hpBarX = epx - hpBarW / 2;
            const hpBarY = epy - eH - 14 + eBob;
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(hpBarX, hpBarY, hpBarW, hpBarH);
            ctx.fillStyle = e.hp > e.maxHp * 0.5 ? "#22c55e" : e.hp > 1 ? "#f59e0b" : "#ef4444";
            ctx.fillRect(hpBarX, hpBarY, hpBarW * (e.hp / e.maxHp), hpBarH);
            // Demon sense glow
            if (hasDemonSense) {
              ctx.shadowColor = "#ef4444";
              ctx.shadowBlur = 6;
              ctx.strokeStyle = "rgba(239,68,68,0.3)";
              ctx.lineWidth = 1;
              ctx.strokeRect(epx - eW / 2 - 2, epy - eH - 2 + eBob, eW + 4, eH + 4);
              ctx.shadowBlur = 0;
            }
          }
        }
        ctx.globalAlpha = 1;
      }

      // ── BOSS INTRO OVERLAY ─────────────────────────────────
      if (bossIntroRef.current > 0 && !bossSpawnedRef.current) {
        const introT = now - bossIntroRef.current;
        const darkAlpha = Math.min(introT / 1500, 0.5);
        ctx.fillStyle = `rgba(20,0,0,${darkAlpha})`;
        ctx.fillRect(0, 0, cw, ch);
        // Pulsing red vignette
        const vigR = Math.max(1, ch * 0.8);
        const vig = ctx.createRadialGradient(cw / 2, ch / 2, 10, cw / 2, ch / 2, vigR);
        vig.addColorStop(0, "rgba(0,0,0,0)");
        vig.addColorStop(1, `rgba(127,29,29,${darkAlpha * 0.6})`);
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, cw, ch);
        // Warning text
        if (introT > 600) {
          const textAlpha = Math.min((introT - 600) / 400, 1) * (0.7 + Math.sin(introT * 0.008) * 0.3);
          ctx.globalAlpha = textAlpha;
          ctx.fillStyle = "#dc2626";
          ctx.font = `bold ${mob ? 16 : 24}px monospace`;
          ctx.textAlign = "center";
          ctx.fillText("⚠ WARNING ⚠", cw / 2, ch * 0.35);
          ctx.font = `bold ${mob ? 20 : 32}px monospace`;
          ctx.fillText("DEMON LORD", cw / 2, ch * 0.45);
          ctx.font = `${mob ? 10 : 14}px monospace`;
          ctx.fillStyle = "#fca5a5";
          ctx.fillText("APPROACHES", cw / 2, ch * 0.52);
          ctx.globalAlpha = 1;
        }
      }

      // ── BOSS ATTACK VFX ────────────────────────────────────
      for (const e of enemiesRef.current) {
        if (!e.isBoss || e.dead) continue;
        const bpx = e.x * cw;
        const bpy = e.y * ch;
        // Charge telegraph — red flash + "!" indicator
        if (e.bossPhase === "charge" && e.phaseTimer < 400) {
          ctx.globalAlpha = 0.3 + Math.sin(e.phaseTimer * 0.03) * 0.2;
          ctx.fillStyle = "#ef4444";
          ctx.font = `bold ${mob ? 18 : 24}px monospace`;
          ctx.textAlign = "center";
          ctx.fillText("!", bpx, bpy - 80 * sc);
          ctx.globalAlpha = 1;
        }
        // Charge trail
        if (e.bossPhase === "charge" && e.phaseTimer >= 400) {
          for (let t = 1; t <= 3; t++) {
            ctx.globalAlpha = 0.15 / t;
            ctx.fillStyle = "#ef4444";
            ctx.fillRect(Math.round(bpx - e.vx * dt * t * 0.5 - 15), Math.round(bpy - 50 * sc), 30, 50 * sc);
          }
          ctx.globalAlpha = 1;
        }
        // Slam shockwave ring
        if (e.bossPhase === "slam" && e.slamWave > 0) {
          const waveAge = e.phaseTimer - 700;
          if (waveAge > 0 && waveAge < 500) {
            const waveR = waveAge * 0.5 * sc;
            ctx.globalAlpha = (1 - waveAge / 500) * 0.4;
            ctx.strokeStyle = "#ef4444";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(bpx, bpy, waveR, 6, 0, 0, Math.PI * 2);
            ctx.stroke();
            // Ground crack pixels
            for (let i = -3; i <= 3; i++) {
              ctx.fillStyle = "#ef4444";
              ctx.fillRect(Math.round(bpx + i * waveR / 3), Math.round(bpy - 1), PX, PX);
            }
            ctx.globalAlpha = 1;
          }
        }
        // Enrage aura
        if (e.enraged) {
          ctx.globalAlpha = 0.08 + Math.sin(now * 0.005) * 0.04;
          ctx.fillStyle = "#dc2626";
          ctx.beginPath();
          ctx.arc(bpx, bpy - 40 * sc, 45 * sc, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      // ── SLASH FX ────────────────────────────────────────────
      slashesRef.current = slashesRef.current.filter(s => now - s.time < 400);
      for (const sl of slashesRef.current) {
        const age = (now - sl.time) / 400;
        ctx.globalAlpha = (1 - age) * 0.9;
        const sx = sl.x * cw + 20 * sc;
        const sy = sl.y * ch;
        // Downward slash arc — sweeps from upper-right to lower-right
        for (let i = 0; i < 12; i++) {
          const t = i / 11;
          const angle = -0.8 + t * 2.0; // -0.8 (upper) to 1.2 (lower)
          const r = (22 + age * 35) * sc;
          const px2 = sx + Math.cos(angle) * r * (0.9 + age * 0.4);
          const py2 = sy + Math.sin(angle) * r;
          const sz = PX * (2.2 - age * 1.2);
          ctx.fillStyle = t < 0.3 ? W : t < 0.7 ? PK : Pk2;
          ctx.fillRect(Math.round(px2), Math.round(py2), Math.ceil(sz), Math.ceil(sz));
        }
        // Inner trail — follows slash direction
        for (let i = 0; i < 6; i++) {
          const t = i / 5;
          const angle = -0.5 + t * 1.5;
          const r = (14 + age * 22) * sc;
          ctx.fillStyle = PK;
          ctx.globalAlpha = (1 - age) * 0.5;
          ctx.fillRect(Math.round(sx + Math.cos(angle) * r), Math.round(sy + Math.sin(angle) * r), PX, PX);
        }
      }
      ctx.globalAlpha = 1;

      // Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const pt = particlesRef.current[i];
        pt.x += pt.vx * dt; pt.y += pt.vy * dt;
        pt.vy += 0.00002 * dt; pt.life -= 0.0015 * dt;
        if (pt.life <= 0) { particlesRef.current.splice(i, 1); continue; }
        ctx.globalAlpha = pt.life;
        ctx.fillStyle = pt.color;
        const sz = Math.ceil(pt.size * pt.life);
        ctx.fillRect(Math.round(pt.x * cw), Math.round(pt.y * ch), sz, sz);
      }
      ctx.globalAlpha = 1;

      // ── HUD (only during playing) ───────────────────────────
      if (state === "playing") {
        const hudY = mob ? 16 : 24;
        const hf = mob ? 11 : 14;

        // HP hearts
        ctx.font = `${hf}px monospace`;
        ctx.textAlign = "left";
        for (let i = 0; i < PLAYER_MAX_HP; i++) {
          ctx.fillStyle = i < p.hp ? "#7c3aed" : "rgba(124,58,237,0.15)";
          ctx.fillText("♥", 12 + i * (hf + 2), hudY);
        }
        ctx.fillStyle = "rgba(167,139,250,0.4)";
        ctx.font = `${mob ? 8 : 10}px monospace`;
        ctx.fillText(`SCORE ${scoreRef.current}`, 12, hudY + 16);

        // Kill tracker — centered
        if (!bossSpawnedRef.current) {
          ctx.textAlign = "center";
          ctx.font = `bold ${mob ? 10 : 13}px monospace`;
          ctx.fillStyle = "rgba(255,255,255,0.5)";
          ctx.fillText(`⚔ ${killsRef.current} / ${BOSS_SPAWN_KILLS} ⚔`, cw / 2, hudY - 2);
          ctx.font = `${mob ? 7 : 9}px monospace`;
          ctx.fillStyle = "rgba(220,38,38,0.5)";
          ctx.fillText("TO SUMMON DEMON LORD", cw / 2, hudY + 12);
        }

        // Boss HP bar
        if (bossSpawnedRef.current) {
          const boss = enemiesRef.current.find(e => e.isBoss && !e.dead);
          if (boss) {
            const bw = Math.min(200, cw * 0.5);
            const bx = (cw - bw) / 2;
            const by = mob ? 36 : 14;
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(bx, by, bw, 10);
            const hpGrd = ctx.createLinearGradient(bx, 0, bx + bw, 0);
            hpGrd.addColorStop(0, "#dc2626"); hpGrd.addColorStop(1, "#7f1d1d");
            ctx.fillStyle = hpGrd;
            ctx.fillRect(bx, by, bw * (boss.hp / boss.maxHp), 10);
            ctx.strokeStyle = "rgba(220,38,38,0.4)"; ctx.lineWidth = 1;
            ctx.strokeRect(bx, by, bw, 10);
            ctx.fillStyle = "#fca5a5";
            ctx.font = `bold ${mob ? 9 : 11}px monospace`;
            ctx.textAlign = "center";
            ctx.fillText("◆ DEMON LORD ◆", cw / 2, by - 4);
          }
        }

        // Unlocked skills — top right
        const uSkills = unlockedSkillsRef.current;
        if (uSkills.length > 0) {
          ctx.textAlign = "right";
          ctx.font = `${mob ? 7 : 9}px monospace`;
          for (let i = 0; i < uSkills.length; i++) {
            const sk2 = SKILLS[uSkills[i]];
            ctx.fillStyle = sk2.color;
            ctx.globalAlpha = 0.6;
            ctx.fillText(`${sk2.icon} ${sk2.name}`, cw - 14, (hudY + 2) + i * 12);
          }
          ctx.globalAlpha = 1;
        }
      }

      // Ghost whispers — only show latest active one (no overlap)
      whisperRef.current = whisperRef.current.filter(w => now - w.start < WHISPER_DURATION + 500);
      const activeWhisper = whisperRef.current.filter(w => now - w.start < WHISPER_DURATION).pop();
      if (activeWhisper) {
        const w = activeWhisper;
        const age = now - w.start;
        {
          const fadeIn = Math.min(age / 500, 1);
          const fadeOut = Math.max(0, 1 - (age - (WHISPER_DURATION - 800)) / 800);
          const alpha = Math.min(fadeIn, fadeOut);
          const scale = 0.9 + fadeIn * 0.1;
          const drift = -age * 0.002;
          ctx.save();
          ctx.translate(cw / 2, ch * 0.18 + drift);
          ctx.scale(scale, scale);
          // Glow shadow
          ctx.shadowColor = "rgba(124,58,237,0.6)";
          ctx.shadowBlur = 20 * alpha;
          ctx.globalAlpha = alpha * 0.5;
          ctx.fillStyle = "#c4b5fd";
          ctx.font = `italic ${mob ? 16 : 22}px monospace`;
          ctx.textAlign = "center";
          ctx.fillText(w.text, 0, 0);
          // Main text
          ctx.shadowBlur = 0;
          ctx.globalAlpha = alpha * 0.85;
          ctx.fillStyle = "#e9d5ff";
          ctx.fillText(w.text, 0, 0);
          ctx.restore();
          ctx.globalAlpha = 1;
        }
      }

      // Controls hint
      if (state === "playing" && frameRef.current < 240) {
        ctx.globalAlpha = Math.max(0, 1 - frameRef.current / 240) * 0.5;
        ctx.fillStyle = "#ffffff";
        ctx.font = `${mob ? 9 : 11}px monospace`;
        ctx.textAlign = "center";
        ctx.fillText(mob ? "TAP slash • SWIPE UP jump" : "SPACE / Z / X  attack    ↑ / W  jump", cw / 2, ch * GROUND_Y + 40);
        ctx.globalAlpha = 1;
      }

      ctx.restore();
      frameRef.current++;
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
    return () => { running = false; window.removeEventListener("resize", resize); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spawnParticles, finishGame, sound, onComplete]);

  const handleSkip = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    xp.addMilestone("system-boot", "System Boot", 5);
    onComplete();
  }, [xp, onComplete]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] select-none overflow-hidden"
      style={{ background: "#050507", imageRendering: "pixelated", touchAction: "none", overscrollBehavior: "none" }}
      onClick={handleClick}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ imageRendering: "pixelated" }} />

      {/* Pause button — top right */}
      {gameState === "playing" && (
        <button
          data-pause
          onClick={togglePause}
          className="absolute top-3 right-3 z-50 font-mono text-sm px-2.5 py-1 rounded cursor-pointer"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}
        >
          {paused ? "▶" : "❚❚"}
        </button>
      )}

      {/* Pause menu overlay */}
      <AnimatePresence>
        {paused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[60] flex items-center justify-center"
            style={{ background: "rgba(5,5,7,0.85)", backdropFilter: "blur(4px)" }}
          >
            <div className="text-center font-mono max-w-xs px-6">
              <div className="text-lg sm:text-xl font-bold tracking-widest mb-6" style={{ color: "#a78bfa" }}>
                PAUSED
              </div>

              <div className="text-left space-y-3 mb-8 text-[11px] sm:text-xs" style={{ color: "var(--text-secondary)" }}>
                <div className="font-bold text-xs tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>CONTROLS</div>
                <div className="flex justify-between"><span style={{ color: "#a78bfa" }}>Attack</span><span>TAP / SPACE / Z / X</span></div>
                <div className="flex justify-between"><span style={{ color: "#a78bfa" }}>Jump</span><span>SWIPE UP / ↑ / W</span></div>
                <div className="flex justify-between"><span style={{ color: "#a78bfa" }}>Pause</span><span>ESC / P</span></div>

                <div className="font-bold text-xs tracking-wider mt-4 mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>OBJECTIVE</div>
                <div style={{ color: "var(--text-muted)" }}>
                  Defeat 5 enemies to summon the Demon Lord. Slay it to unlock the gate.
                </div>
                <div style={{ color: "var(--text-muted)" }}>
                  Each kill unlocks a new skill. Jump to dodge boss slam attacks.
                </div>
              </div>

              <div className="space-y-3">
                <motion.button
                  data-pause
                  onClick={togglePause}
                  className="w-full font-mono text-xs sm:text-sm px-5 py-2.5 rounded-lg cursor-pointer tracking-widest uppercase"
                  style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", color: "#a78bfa" }}
                  whileTap={{ scale: 0.95 }}
                >
                  resume
                </motion.button>
                <motion.button
                  data-skip
                  onClick={handleSkip}
                  className="w-full font-mono text-[10px] sm:text-xs px-5 py-2 rounded-lg cursor-pointer tracking-widest uppercase"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  skip to portfolio &rarr;
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip button when not paused */}
      <AnimatePresence>
        {showSkip && gameState === "playing" && !paused && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }} className="absolute bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 z-50">
            <motion.button data-skip onClick={handleSkip}
              className="font-mono text-xs sm:text-sm px-6 py-2.5 rounded-lg cursor-pointer tracking-widest uppercase"
              style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", color: "rgba(255,255,255,0.5)", backdropFilter: "blur(4px)" }}
              whileHover={{ borderColor: "rgba(124,58,237,0.5)", color: "rgba(255,255,255,0.8)" }}
              whileTap={{ scale: 0.95 }}>
              skip to portfolio &rarr;
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {skillFlash && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 z-50 font-mono text-center pointer-events-none">
            <div className="text-sm sm:text-lg font-bold tracking-widest px-6 py-3 rounded-lg"
              style={{ background: "rgba(5,5,7,0.9)", border: "1px solid rgba(124,58,237,0.4)", color: "#a78bfa" }}>
              SKILL UNLOCKED
            </div>
            <div className="text-base sm:text-xl font-bold mt-2" style={{ color: "#ec4899" }}>{skillFlash}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bossActive && gameState === "playing" && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: [0, 1, 0.5, 1], scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 2.5 }} className="absolute top-1/4 left-1/2 -translate-x-1/2 z-40 font-mono text-center pointer-events-none">
            <div className="text-base sm:text-2xl font-bold tracking-widest" style={{ color: "#dc2626" }}>⚠ DEMON LORD SUMMONED ⚠</div>
            <div className="text-[10px] mt-1" style={{ color: "#fca5a5" }}>slay the beast to unlock the gate</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === "victory" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 150, delay: 0.3 }} className="text-center">
              <div className="font-mono text-2xl sm:text-4xl font-bold tracking-[0.2em]" style={{ color: "var(--green)" }}>ACCESS GRANTED</div>
              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.6, duration: 0.6 }}
                className="h-px mx-auto mt-3" style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }} />
              <div className="font-mono text-xs mt-2" style={{ color: "var(--text-muted)" }}>score: {score} &bull; skills: {unlockedSkills.length}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === "defeat" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-center">
              <div className="font-mono text-xl sm:text-2xl font-bold" style={{ color: "#ef4444" }}>SYSTEM COMPROMISED</div>
              <div className="font-mono text-xs mt-2" style={{ color: "var(--text-muted)" }}>emergency bypass engaged...</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-widest uppercase z-30" style={{ color: "var(--text-muted)" }}>
        code knight protocol — defeat bugs to enter
      </div>
    </motion.div>
  );
}
