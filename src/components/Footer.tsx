"use client";

export default function Footer() {
  return (
    <footer
      className="py-10 px-6"
      style={{ borderTop: "1px solid var(--border-color)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span
          className="font-mono text-[11px] uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          built by Ang Jin Wei
        </span>
        <div className="flex items-center gap-6">
          {[
            { label: "GitHub", href: "https://github.com/xSolstice1" },
            { label: "LinkedIn", href: "https://linkedin.com/in/angjw" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase tracking-widest transition-colors duration-300"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-muted)")
              }
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
