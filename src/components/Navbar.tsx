"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

interface NavbarProps {
  terminalOpen: boolean;
  onToggleTerminal: () => void;
}

export default function Navbar({ terminalOpen, onToggleTerminal }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="terminal-text text-sm font-bold text-[var(--neon-blue)]">
            ~/ang-jin-wei
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm text-gray-400 hover:text-[var(--neon-blue)] transition-colors"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={onToggleTerminal}
              className={`ml-4 px-3 py-1.5 text-xs terminal-text rounded border transition-all ${
                terminalOpen
                  ? "border-[var(--neon-green)] text-[var(--neon-green)] bg-[var(--neon-green)]/10"
                  : "border-gray-600 text-gray-400 hover:border-[var(--neon-green)] hover:text-[var(--neon-green)]"
              }`}
            >
              {terminalOpen ? "✕ terminal" : "> terminal"}
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/5"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-sm text-gray-400 hover:text-[var(--neon-blue)]"
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={() => {
                  onToggleTerminal();
                  setMobileOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-[var(--neon-green)] terminal-text"
              >
                {terminalOpen ? "✕ close terminal" : "> open terminal"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
