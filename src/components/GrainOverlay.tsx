"use client";

export default function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[55]"
      style={{
        opacity: 0.4,
        mixBlendMode: "overlay",
      }}
    >
      <svg className="hidden">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
      </svg>
      <div
        className="absolute inset-0"
        style={{
          filter: "url(#grain)",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
