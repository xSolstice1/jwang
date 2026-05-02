"use client";

export default function Footer() {
  return (
    <footer
      className="py-12 px-6 relative"
      style={{ borderTop: "2px solid rgba(124, 58, 237, 0.15)" }}
    >
      <div className="max-w-6xl mx-auto text-center space-y-4">
        <div
          className="font-pixel text-[10px] sm:text-xs tracking-[0.3em]"
          style={{ color: "var(--ember)" }}
        >
          {"◆ GAME OVER ◆"}
        </div>
        <div
          className="font-pixel text-[6px] sm:text-[7px] tracking-[0.2em]"
          style={{ color: "var(--text-muted)" }}
        >
          CRAFTED BY ANG JIN WEI
        </div>
        <div className="flex items-center justify-center gap-6">
          {[
            { label: "GitHub", href: "https://github.com/xSolstice1" },
            { label: "LinkedIn", href: "https://linkedin.com/in/angjw" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-pixel text-[7px] uppercase tracking-[0.2em] transition-colors duration-300"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--gold)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-muted)")
              }
            >
              {link.label}
            </a>
          ))}
        </div>
        <div
          className="font-pixel text-[5px] tracking-widest mt-2"
          style={{ color: "var(--text-muted)", opacity: 0.4 }}
        >
          PRESS START TO CONTINUE
        </div>
      </div>
    </footer>
  );
}
