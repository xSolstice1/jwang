"use client";

export default function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-white/5">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="terminal-text text-xs text-gray-600">
          built by Ang Jin Wei.
        </span>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/xSolstice1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-[var(--neon-blue)] transition-colors text-xs terminal-text"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/angjw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-[var(--neon-blue)] transition-colors text-xs terminal-text"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
