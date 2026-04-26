import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--bg)" }}>
      <div className="text-center max-w-md">
        <div
          className="font-mono text-7xl font-bold mb-4"
          style={{ color: "var(--accent)" }}
        >
          404
        </div>
        <div className="font-mono text-xs uppercase tracking-[0.3em] mb-6" style={{ color: "var(--text-muted)" }}>
          &gt;_ page not found
        </div>
        <p className="text-sm mb-10 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          The path you followed doesn&apos;t resolve to anything in this system.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 text-sm font-mono uppercase tracking-wider transition-all duration-300"
          style={{ color: "var(--bg)", background: "var(--accent)" }}
        >
          cd ~
        </Link>
      </div>
    </div>
  );
}
