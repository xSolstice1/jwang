"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSound } from "./SoundEngine";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "div";
  style?: React.CSSProperties;
  glitchOnHover?: boolean;
  autoGlitch?: boolean;
  intensity?: number;
}

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export default function GlitchText({
  text,
  className = "",
  as: Tag = "span",
  style,
  glitchOnHover = true,
  autoGlitch = false,
  intensity = 0.3,
}: GlitchTextProps) {
  const [displayed, setDisplayed] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>(undefined);
  const sound = useSound();

  const startGlitch = useCallback(() => {
    if (isGlitching) return;
    setIsGlitching(true);
    sound.glitch();

    let iterations = 0;
    const maxIterations = text.length * 2;

    intervalRef.current = setInterval(() => {
      setDisplayed(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < iterations / 2) return text[i];
            return Math.random() < intensity
              ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
              : char;
          })
          .join("")
      );

      iterations++;
      if (iterations > maxIterations) {
        clearInterval(intervalRef.current);
        setDisplayed(text);
        setIsGlitching(false);
      }
    }, 30);
  }, [text, isGlitching, intensity, sound]);

  useEffect(() => {
    if (!autoGlitch) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.1) startGlitch();
    }, 3000);
    return () => clearInterval(interval);
  }, [autoGlitch, startGlitch]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    setDisplayed(text);
  }, [text]);

  return (
    <Tag
      className={`${className} ${isGlitching ? "glitch-active" : ""}`}
      style={{
        ...style,
        position: "relative",
      }}
      onMouseEnter={glitchOnHover ? startGlitch : undefined}
      onTouchStart={glitchOnHover ? startGlitch : undefined}
    >
      {displayed}
      {isGlitching && (
        <>
          <span
            aria-hidden
            className="absolute inset-0 glitch-layer-1"
            style={{
              ...style,
              clipPath: `inset(${Math.random() * 40}% 0 ${Math.random() * 40}% 0)`,
              transform: `translate(${(Math.random() - 0.5) * 4}px, ${(Math.random() - 0.5) * 2}px)`,
              color: "var(--accent)",
              opacity: 0.8,
            }}
          >
            {displayed}
          </span>
          <span
            aria-hidden
            className="absolute inset-0 glitch-layer-2"
            style={{
              ...style,
              clipPath: `inset(${Math.random() * 40 + 30}% 0 ${Math.random() * 30}% 0)`,
              transform: `translate(${(Math.random() - 0.5) * 4}px, ${(Math.random() - 0.5) * 2}px)`,
              color: "var(--purple)",
              opacity: 0.8,
            }}
          >
            {displayed}
          </span>
        </>
      )}
    </Tag>
  );
}
