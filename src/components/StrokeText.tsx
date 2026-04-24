"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function StrokeText({
  text,
  className = "",
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.5"],
  });

  const fillOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const strokeOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0.3]);
  const y = useTransform(scrollYProgress, [0, 1], [30, 0]);

  return (
    <div ref={ref} className="relative">
      {/* Stroke layer */}
      <motion.div
        style={{ opacity: strokeOpacity, y }}
        className="absolute inset-0"
        aria-hidden
      >
        <Tag
          className={`stroke-text ${className}`}
          style={{
            color: "transparent",
            WebkitTextStroke: "1px var(--accent)",
          }}
        >
          {text}
        </Tag>
      </motion.div>

      {/* Fill layer */}
      <motion.div style={{ opacity: fillOpacity, y }}>
        <Tag className={`${className} text-white`}>
          {text}
        </Tag>
      </motion.div>
    </div>
  );
}
