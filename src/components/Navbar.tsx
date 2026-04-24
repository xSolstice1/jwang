"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
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
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(5, 5, 5, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-color)" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a
            href="#"
            className="font-mono text-xs font-bold tracking-wider transition-colors duration-300"
            style={{ color: "var(--accent)" }}
          >
            AJW
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-xs uppercase tracking-widest transition-colors duration-300"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--text-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-muted)")
                }
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={onToggleTerminal}
              className="ml-4 px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest border transition-all duration-300"
              style={{
                color: terminalOpen ? "var(--bg)" : "var(--accent)",
                borderColor: terminalOpen ? "var(--accent)" : "rgba(100,255,218,0.3)",
                background: terminalOpen ? "var(--accent)" : "transparent",
              }}
            >
              {terminalOpen ? "close" : ">_ terminal"}
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2"
            style={{ color: "var(--text-secondary)" }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
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
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden"
            style={{
              background: "rgba(5, 5, 5, 0.95)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid var(--border-color)",
            }}
          >
            <div className="px-6 py-4 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-xs uppercase tracking-widest transition-colors duration-300"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={() => {
                  onToggleTerminal();
                  setMobileOpen(false);
                }}
                className="block w-full text-left py-3 font-mono text-xs uppercase tracking-widest transition-colors duration-300"
                style={{ color: "var(--accent)" }}
              >
                {terminalOpen ? "close terminal" : ">_ open terminal"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
