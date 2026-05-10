"use client";

import { createContext, useContext, useCallback, useRef, useEffect, useState } from "react";

interface SoundEngine {
  hover: () => void;
  click: () => void;
  navigate: () => void;
  achievement: () => void;
  whoosh: () => void;
  levelUp: () => void;
  glitch: () => void;
  enabled: boolean;
  toggle: () => void;
}

const SoundContext = createContext<SoundEngine | null>(null);

export function useSound(): SoundEngine {
  const ctx = useContext(SoundContext);
  if (!ctx) return { hover() {}, click() {}, navigate() {}, achievement() {}, whoosh() {}, levelUp() {}, glitch() {}, enabled: false, toggle() {} };
  return ctx;
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const audioCtx = useRef<AudioContext | null>(null);
  const [enabled, setEnabled] = useState(true);
  const initialized = useRef(false);

  const getCtx = useCallback(() => {
    if (!audioCtx.current) {
      audioCtx.current = new AudioContext();
    }
    if (audioCtx.current.state === "suspended") {
      audioCtx.current.resume();
    }
    return audioCtx.current;
  }, []);

  useEffect(() => {
    const initOnInteraction = () => {
      if (!initialized.current) {
        getCtx();
        initialized.current = true;
      }
    };
    window.addEventListener("click", initOnInteraction, { once: true });
    window.addEventListener("keydown", initOnInteraction, { once: true });
    return () => {
      window.removeEventListener("click", initOnInteraction);
      window.removeEventListener("keydown", initOnInteraction);
    };
  }, [getCtx]);

  const lastHover = useRef(0);

  const hover = useCallback(() => {
    if (!enabled) return;
    const now = Date.now();
    if (now - lastHover.current < 300) return;
    lastHover.current = now;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  }, [enabled, getCtx]);

  const click = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "square";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    } catch {}
  }, [enabled, getCtx]);

  const navigate = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc2.type = "triangle";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      osc2.frequency.setValueAtTime(660, ctx.currentTime + 0.05);
      osc2.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc2.start(ctx.currentTime + 0.05);
      osc.stop(ctx.currentTime + 0.12);
      osc2.stop(ctx.currentTime + 0.15);
    } catch {}
  }, [enabled, getCtx]);

  const achievement = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        const t = ctx.currentTime + i * 0.1;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.06, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
      });
    } catch {}
  }, [enabled, getCtx]);

  const whoosh = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.15);
      filter.Q.value = 2;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start(ctx.currentTime);
    } catch {}
  }, [enabled, getCtx]);

  const levelUp = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const notes = [262, 330, 392, 523, 659, 784];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "triangle";
        const t = ctx.currentTime + i * 0.08;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.07, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.start(t);
        osc.stop(t + 0.25);
      });
    } catch {}
  }, [enabled, getCtx]);

  const glitch = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      for (let i = 0; i < 5; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sawtooth";
        const t = ctx.currentTime + i * 0.04;
        osc.frequency.setValueAtTime(100 + Math.random() * 2000, t);
        gain.gain.setValueAtTime(0.03, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
        osc.start(t);
        osc.stop(t + 0.04);
      }
    } catch {}
  }, [enabled, getCtx]);

  const toggle = useCallback(() => setEnabled(v => !v), []);

  return (
    <SoundContext value={{ hover, click, navigate, achievement, whoosh, levelUp, glitch, enabled, toggle }}>
      {children}
    </SoundContext>
  );
}
