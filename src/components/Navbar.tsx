"use client";

import { useState, useEffect, useRef } from "react";
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
  const [activeSection, setActiveSection] = useState("");
  const indicatorRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<Map<string, HTMLAnchorElement>>(new Map());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.25, 0.5] }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!activeSection || !indicatorRef.current) return;
    const link = navLinksRef.current.get(activeSection);
    if (!link) {
      indicatorRef.current.style.opacity = "0";
      return;
    }
    const rect = link.getBoundingClientRect();
    const parent = link.parentElement?.getBoundingClientRect();
    if (!parent) return;
    indicatorRef.current.style.opacity = "1";
    indicatorRef.current.style.left = `${rect.left - parent.left}px`;
    indicatorRef.current.style.width = `${rect.width}px`;
  }, [activeSection]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(7, 11, 20, 0.85)" : "transparent",
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

          <div className="hidden md:flex items-center gap-1 relative">
            <div
              ref={indicatorRef}
              className="absolute bottom-0 h-[2px] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ background: "var(--accent)", opacity: 0 }}
            />
            {navItems.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  ref={(el) => {
                    if (el) navLinksRef.current.set(sectionId, el);
                  }}
                  className="px-4 py-2 text-xs uppercase tracking-widest transition-colors duration-300"
                  style={{ color: isActive ? "var(--accent)" : "var(--text-muted)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--text-primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = isActive ? "var(--accent)" : "var(--text-muted)")
                  }
                >
                  {item.label}
                </a>
              );
            })}
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
              background: "rgba(7, 11, 20, 0.95)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid var(--border-color)",
            }}
          >
            <div className="px-6 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.replace("#", "");
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-xs uppercase tracking-widest transition-colors duration-300"
                    style={{ color: isActive ? "var(--accent)" : "var(--text-secondary)" }}
                  >
                    {isActive && <span className="mr-2" style={{ color: "var(--accent)" }}>›</span>}
                    {item.label}
                  </a>
                );
              })}
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
