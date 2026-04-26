"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import ScrollParallax from "./ScrollParallax";
import dynamic from "next/dynamic";

const HelixCanvas = dynamic(() => import("./HelixCanvas"), { ssr: false });

const roles = [
  "Data Engineer",
  "AI Systems Builder",
  "Software Engineer",
  "Pipeline Architect",
];

const techStack = [
  "Python", "TypeScript", "React", "Neo4j", "AWS", "GraphRAG", "Go",
  "Snowflake", "Terraform", "Docker", "FastAPI", "Next.js",
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

// --- Magnetic Button ---

function MagneticButton({ children, href, className, style, onMouseEnter, onMouseLeave }: {
  children: React.ReactNode;
  href: string;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  }, []);

  const onLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0, 0)";
    onMouseLeave?.(e);
  }, [onMouseLeave]);

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      style={{ ...style, transition: "transform 0.6s cubic-bezier(0.33, 1, 0.68, 1)" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </a>
  );
}

// --- Live Code Editor ---

type TokenType = "keyword" | "function" | "string" | "comment" | "type" | "operator" | "number" | "plain" | "decorator" | "param";

interface Token { text: string; type: TokenType; }

const tokenColors: Record<TokenType, string> = {
  keyword: "var(--purple)",
  function: "var(--blue)",
  string: "var(--green)",
  comment: "var(--text-muted)",
  type: "var(--accent)",
  operator: "var(--text-secondary)",
  number: "#f78c6c",
  plain: "var(--text-primary)",
  decorator: "#ffcb6b",
  param: "#f78c6c",
};

const fileContents: Record<string, Token[][]> = {
  "pipeline.py": [
    [{ text: "# pipeline.py", type: "comment" }],
    [{ text: "from", type: "keyword" }, { text: " neo4j ", type: "plain" }, { text: "import", type: "keyword" }, { text: " GraphDatabase", type: "type" }],
    [{ text: "from", type: "keyword" }, { text: " fastapi ", type: "plain" }, { text: "import", type: "keyword" }, { text: " FastAPI", type: "type" }],
    [{ text: "from", type: "keyword" }, { text: " bedrock ", type: "plain" }, { text: "import", type: "keyword" }, { text: " EmbeddingClient", type: "type" }],
    [],
    [{ text: "app", type: "plain" }, { text: " = ", type: "operator" }, { text: "FastAPI", type: "function" }, { text: "()", type: "operator" }],
    [{ text: "graph", type: "plain" }, { text: " = ", type: "operator" }, { text: "GraphDatabase", type: "function" }, { text: "(", type: "operator" }, { text: "\"bolt://neo4j:7687\"", type: "string" }, { text: ")", type: "operator" }],
    [{ text: "embedder", type: "plain" }, { text: " = ", type: "operator" }, { text: "EmbeddingClient", type: "function" }, { text: "(", type: "operator" }, { text: "\"bedrock\"", type: "string" }, { text: ")", type: "operator" }],
    [],
    [{ text: "@app", type: "decorator" }, { text: ".post", type: "function" }, { text: "(", type: "operator" }, { text: "\"/ingest\"", type: "string" }, { text: ")", type: "operator" }],
    [{ text: "async", type: "keyword" }, { text: " def ", type: "keyword" }, { text: "ingest_data", type: "function" }, { text: "(", type: "operator" }, { text: "payload", type: "param" }, { text: ": ", type: "operator" }, { text: "dict", type: "type" }, { text: "):", type: "operator" }],
    [{ text: "    entities", type: "plain" }, { text: " = ", type: "operator" }, { text: "extract_entities", type: "function" }, { text: "(payload)", type: "operator" }],
    [{ text: "    embeddings", type: "plain" }, { text: " = ", type: "operator" }, { text: "embedder", type: "plain" }, { text: ".encode", type: "function" }, { text: "(entities)", type: "operator" }],
    [],
    [{ text: "    ", type: "plain" }, { text: "async with", type: "keyword" }, { text: " graph.", type: "plain" }, { text: "session", type: "function" }, { text: "() ", type: "operator" }, { text: "as", type: "keyword" }, { text: " tx:", type: "plain" }],
    [{ text: "        ", type: "plain" }, { text: "for", type: "keyword" }, { text: " e, vec ", type: "plain" }, { text: "in", type: "keyword" }, { text: " ", type: "plain" }, { text: "zip", type: "function" }, { text: "(entities, embeddings):", type: "operator" }],
    [{ text: "            tx.", type: "plain" }, { text: "run", type: "function" }, { text: "(", type: "operator" }, { text: "\"MERGE (n:Entity {id: $id})\"", type: "string" }, { text: ",", type: "operator" }],
    [{ text: "                 ", type: "plain" }, { text: "id", type: "param" }, { text: "=e.id, ", type: "operator" }, { text: "vec", type: "param" }, { text: "=vec)", type: "operator" }],
    [],
    [{ text: "    ", type: "plain" }, { text: "return", type: "keyword" }, { text: " {", type: "operator" }, { text: "\"status\"", type: "string" }, { text: ": ", type: "operator" }, { text: "\"ingested\"", type: "string" }, { text: ", ", type: "operator" }, { text: "\"count\"", type: "string" }, { text: ": ", type: "operator" }, { text: "len", type: "function" }, { text: "(entities)}", type: "operator" }],
  ],
  "config.yaml": [
    [{ text: "# config.yaml", type: "comment" }],
    [{ text: "service", type: "type" }, { text: ":", type: "operator" }],
    [{ text: "  name", type: "param" }, { text: ": ", type: "operator" }, { text: "graphrag-pipeline", type: "string" }],
    [{ text: "  port", type: "param" }, { text: ": ", type: "operator" }, { text: "8000", type: "number" }],
    [{ text: "  workers", type: "param" }, { text: ": ", type: "operator" }, { text: "4", type: "number" }],
    [],
    [{ text: "neo4j", type: "type" }, { text: ":", type: "operator" }],
    [{ text: "  uri", type: "param" }, { text: ": ", type: "operator" }, { text: "bolt://neo4j:7687", type: "string" }],
    [{ text: "  database", type: "param" }, { text: ": ", type: "operator" }, { text: "knowledge", type: "string" }],
    [{ text: "  pool_size", type: "param" }, { text: ": ", type: "operator" }, { text: "50", type: "number" }],
    [],
    [{ text: "embeddings", type: "type" }, { text: ":", type: "operator" }],
    [{ text: "  provider", type: "param" }, { text: ": ", type: "operator" }, { text: "aws-bedrock", type: "string" }],
    [{ text: "  model", type: "param" }, { text: ": ", type: "operator" }, { text: "titan-embed-v2", type: "string" }],
    [{ text: "  dimensions", type: "param" }, { text: ": ", type: "operator" }, { text: "1024", type: "number" }],
    [{ text: "  batch_size", type: "param" }, { text: ": ", type: "operator" }, { text: "32", type: "number" }],
    [],
    [{ text: "pipeline", type: "type" }, { text: ":", type: "operator" }],
    [{ text: "  retry_attempts", type: "param" }, { text: ": ", type: "operator" }, { text: "3", type: "number" }],
    [{ text: "  backoff_ms", type: "param" }, { text: ": ", type: "operator" }, { text: "1000", type: "number" }],
    [{ text: "  log_level", type: "param" }, { text: ": ", type: "operator" }, { text: "INFO", type: "string" }],
  ],
  "terraform.tf": [
    [{ text: "# terraform.tf", type: "comment" }],
    [{ text: "resource", type: "keyword" }, { text: " ", type: "plain" }, { text: "\"aws_batch_job_definition\"", type: "string" }, { text: " ", type: "plain" }, { text: "\"pipeline\"", type: "string" }, { text: " {", type: "operator" }],
    [{ text: "  name", type: "param" }, { text: " = ", type: "operator" }, { text: "\"graphrag-ingest\"", type: "string" }],
    [{ text: "  type", type: "param" }, { text: " = ", type: "operator" }, { text: "\"container\"", type: "string" }],
    [],
    [{ text: "  container_properties", type: "type" }, { text: " = ", type: "operator" }, { text: "jsonencode", type: "function" }, { text: "({", type: "operator" }],
    [{ text: "    image", type: "param" }, { text: " = ", type: "operator" }, { text: "\"${aws_ecr_repository.pipeline.url}:latest\"", type: "string" }],
    [{ text: "    vcpus", type: "param" }, { text: " = ", type: "operator" }, { text: "4", type: "number" }],
    [{ text: "    memory", type: "param" }, { text: " = ", type: "operator" }, { text: "8192", type: "number" }],
    [{ text: "  })", type: "operator" }],
    [{ text: "}", type: "operator" }],
    [],
    [{ text: "resource", type: "keyword" }, { text: " ", type: "plain" }, { text: "\"aws_s3_bucket\"", type: "string" }, { text: " ", type: "plain" }, { text: "\"artifacts\"", type: "string" }, { text: " {", type: "operator" }],
    [{ text: "  bucket", type: "param" }, { text: " = ", type: "operator" }, { text: "\"graphrag-artifacts-prod\"", type: "string" }],
    [],
    [{ text: "  tags", type: "type" }, { text: " = {", type: "operator" }],
    [{ text: "    Environment", type: "param" }, { text: " = ", type: "operator" }, { text: "\"production\"", type: "string" }],
    [{ text: "    Team", type: "param" }, { text: "        = ", type: "operator" }, { text: "\"data-engineering\"", type: "string" }],
    [{ text: "  }", type: "operator" }],
    [{ text: "}", type: "operator" }],
  ],
};

const fileNames = Object.keys(fileContents);

const terminalResponses: Record<string, string[] | "nav"> = {
  help: [
    "Available commands:",
    "  status    — Pipeline health check",
    "  deploy    — Deploy to production",
    "  test      — Run test suite",
    "  logs      — Show recent logs",
    "  whoami    — About the engineer",
    "  clear     — Clear terminal",
    "",
    "Navigation:",
    "  about | experience | projects",
    "  skills | education | contact",
  ],
  status: [
    "  neo4j     ● connected  (bolt://neo4j:7687)",
    "  bedrock   ● healthy    (titan-embed-v2)",
    "  pipeline  ● running    (4 workers)",
    "  s3        ● synced     (graphrag-artifacts-prod)",
  ],
  deploy: [
    "  → Building Docker image...",
    "  → Pushing to ECR...",
    "  → Updating Batch job definition...",
    "  → Terraform apply... done.",
    "  ✓ Deployed to production",
  ],
  test: [
    "  Running 24 tests...",
    "  ✓ test_entity_extraction      (0.3s)",
    "  ✓ test_embedding_pipeline     (1.2s)",
    "  ✓ test_graph_merge            (0.8s)",
    "  ✓ test_retrieval_accuracy     (2.1s)",
    "  24/24 passed  (4.4s)",
  ],
  logs: [
    "  [INFO]  Ingested 1,247 entities",
    "  [INFO]  Embeddings cached: 98.2% hit rate",
    "  [INFO]  Graph traversal avg: 12ms",
    "  [WARN]  Batch job retry on partition 3",
    "  [INFO]  Pipeline throughput: 340 docs/min",
  ],
  whoami: [
    "  Ang Jin Wei",
    "  Data Engineer & AI Systems Builder",
    "  Singapore",
    "  Building GraphRAG, pipelines, and cloud infra",
  ],
  about: "nav",
  experience: "nav",
  projects: "nav",
  skills: "nav",
  education: "nav",
  contact: "nav",
};

function LiveCodeEditor() {
  const [activeFile, setActiveFile] = useState(fileNames[0]);
  const [visibleLines, setVisibleLines] = useState(0);
  const [cursorLine, setCursorLine] = useState(0);
  const [cursorChar, setCursorChar] = useState(0);
  const [showTerminal, setShowTerminal] = useState(true);
  const [termInput, setTermInput] = useState("");
  const [termHistory, setTermHistory] = useState<{ cmd: string; output: string[] }[]>([]);
  const fileProgress = useRef<Record<string, { line: number; char: number; done: boolean }>>({});
  const codeRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const lines = fileContents[activeFile];

  useEffect(() => {
    const saved = fileProgress.current[activeFile];

    if (saved?.done) {
      setVisibleLines(lines.length);
      setCursorLine(lines.length);
      setCursorChar(0);
      return;
    }

    let lineIdx = saved?.line ?? 0;
    let charIdx = saved?.char ?? 0;
    let timer: NodeJS.Timeout;
    let cancelled = false;

    const totalChars = (line: Token[]) => line.reduce((sum, t) => sum + t.text.length, 0);

    setVisibleLines(lineIdx + (charIdx > 0 ? 1 : 0));
    setCursorLine(lineIdx);
    setCursorChar(charIdx);

    const tick = () => {
      if (cancelled) return;
      if (lineIdx >= lines.length) {
        fileProgress.current[activeFile] = { line: lineIdx, char: 0, done: true };
        return;
      }

      const line = lines[lineIdx];
      const lineLen = totalChars(line);

      setCursorLine(lineIdx);
      setCursorChar(charIdx);

      if (lineLen === 0 || charIdx >= lineLen) {
        setVisibleLines(lineIdx + 1);
        lineIdx++;
        charIdx = 0;
        timer = setTimeout(tick, lineLen === 0 ? 80 : 60);
      } else {
        charIdx += 1 + Math.floor(Math.random() * 2);
        if (charIdx > lineLen) charIdx = lineLen;
        setVisibleLines(lineIdx + 1);
        setCursorChar(charIdx);
        timer = setTimeout(tick, 15 + Math.random() * 25);
      }
    };

    const delay = saved ? 100 : 300;
    timer = setTimeout(tick, delay);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      fileProgress.current[activeFile] = { line: lineIdx, char: charIdx, done: lineIdx >= lines.length };
    };
  }, [activeFile, lines]);

  useEffect(() => {
    if (codeRef.current) codeRef.current.scrollTop = codeRef.current.scrollHeight;
  }, [visibleLines]);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [termHistory]);

  const handleTab = (file: string) => {
    if (file === activeFile) return;
    setActiveFile(file);
  };

  const handleTermSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = termInput.trim().toLowerCase();
    setTermInput("");

    if (cmd === "clear") {
      setTermHistory([]);
      return;
    }

    const response = terminalResponses[cmd];

    if (response === "nav") {
      const el = document.getElementById(cmd);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setTermHistory((h) => [...h, { cmd, output: [`  → Navigating to #${cmd}...`] }]);
      }
      return;
    }

    const output = (response as string[] | undefined) || [`  command not found: ${cmd}. Type "help" for commands.`];
    setTermHistory((h) => [...h, { cmd, output }]);
  };

  const renderLine = (tokens: Token[], lineIdx: number) => {
    const fileComplete = fileProgress.current[activeFile]?.done ?? false;
    const isCurrentLine = !fileComplete && lineIdx === cursorLine;
    const total = tokens.reduce((sum, t) => sum + t.text.length, 0);
    const visChars = fileComplete ? total : (isCurrentLine ? cursorChar : (lineIdx < cursorLine ? total : 0));

    if (visChars === 0 && !isCurrentLine) return null;

    let count = 0;
    return (
      <span>
        {tokens.map((token, ti) => {
          const start = count;
          count += token.text.length;
          const vis = Math.max(0, Math.min(token.text.length, visChars - start));
          if (vis <= 0) return null;
          return (
            <span key={ti} style={{ color: tokenColors[token.type] }}>
              {token.text.slice(0, vis)}
            </span>
          );
        })}
        {isCurrentLine && visChars < total && (
          <span className="animate-blink" style={{ color: "var(--accent)" }}>▊</span>
        )}
      </span>
    );
  };

  return (
    <div
      className="rounded-lg overflow-hidden flex flex-col"
      style={{
        background: "rgba(7, 11, 20, 0.85)",
        border: "1px solid rgba(100, 255, 218, 0.08)",
        backdropFilter: "blur(10px)",
        height: "480px",
      }}
    >
      {/* Tab bar */}
      <div
        className="flex items-center px-4 py-2.5 gap-1 shrink-0"
        style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex gap-1.5 mr-3">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,95,87,0.7)" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,189,46,0.7)" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(39,201,63,0.7)" }} />
        </div>
        {fileNames.map((name) => (
          <button
            key={name}
            onClick={() => handleTab(name)}
            className="px-3 py-1 text-[10px] font-mono transition-all duration-200"
            style={{
              color: activeFile === name ? "var(--accent)" : "var(--text-muted)",
              background: activeFile === name ? "rgba(100,255,218,0.06)" : "transparent",
              borderBottom: activeFile === name ? "1px solid var(--accent)" : "1px solid transparent",
            }}
          >
            {name}
          </button>
        ))}
        <button
          onClick={() => setShowTerminal(!showTerminal)}
          className="ml-auto px-2 py-1 text-[10px] font-mono transition-colors duration-200"
          style={{ color: showTerminal ? "var(--accent)" : "var(--text-muted)" }}
        >
          &gt;_
        </button>
      </div>

      {/* Code area */}
      <div
        ref={codeRef}
        data-lenis-prevent
        className="p-4 font-mono text-[11px] sm:text-xs leading-[1.7] overflow-y-auto flex-1 min-h-0"
        style={{ height: showTerminal ? "220px" : "400px", overscrollBehavior: "contain" }}
      >
        {lines.slice(0, visibleLines).map((line, i) => (
          <div key={`${activeFile}-${i}`} className="flex">
            <span
              className="w-8 shrink-0 text-right pr-3 select-none"
              style={{ color: i === cursorLine ? "var(--text-secondary)" : "var(--text-muted)", opacity: 0.5 }}
            >
              {i + 1}
            </span>
            <span className="flex-1" style={{ minHeight: "1.7em" }}>
              {line.length === 0 ? " " : renderLine(line, i)}
            </span>
          </div>
        ))}
        {visibleLines >= lines.length && (
          <div className="flex">
            <span className="w-8 shrink-0 text-right pr-3 select-none" style={{ color: "var(--text-muted)", opacity: 0.5 }}>
              {lines.length + 1}
            </span>
            <span className="animate-blink" style={{ color: "var(--accent)" }}>▊</span>
          </div>
        )}
      </div>

      {/* Integrated terminal */}
      {showTerminal && (
        <div
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center px-4 py-1.5" style={{ background: "rgba(255,255,255,0.015)" }}>
            <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>TERMINAL</span>
          </div>
          <div
            ref={termRef}
            data-lenis-prevent
            className="px-4 py-2 font-mono text-[11px] sm:text-xs leading-[1.7] overflow-y-auto"
            style={{ maxHeight: "140px", overscrollBehavior: "contain" }}
            onClick={() => inputRef.current?.focus()}
          >
            {termHistory.length === 0 && (
              <div style={{ color: "var(--text-muted)" }}>Type &quot;help&quot; for available commands</div>
            )}
            {termHistory.map((entry, i) => (
              <div key={i}>
                <div>
                  <span style={{ color: "var(--accent)" }}>❯ </span>
                  <span style={{ color: "var(--text-primary)" }}>{entry.cmd}</span>
                </div>
                {entry.output.map((line, j) => (
                  <div key={j} style={{ color: "var(--text-secondary)" }}>{line}</div>
                ))}
              </div>
            ))}
            <form onSubmit={handleTermSubmit} className="flex items-center">
              <span style={{ color: "var(--accent)" }}>❯ </span>
              <input
                ref={inputRef}
                value={termInput}
                onChange={(e) => setTermInput(e.target.value)}
                className="flex-1 bg-transparent outline-none font-mono text-[11px] sm:text-xs ml-1"
                style={{ color: "var(--text-primary)", caretColor: "var(--accent)" }}
                spellCheck={false}
                autoComplete="off"
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Hero Particles ---

function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const COUNT = isTouch ? 30 : 60;
    let animId: number;

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      r: number; alpha: number; hue: number;
    }

    const particles: Particle[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: 1 + Math.random() * 2.5,
          alpha: 0.3 + Math.random() * 0.5,
          hue: Math.random() > 0.5 ? 0 : 1,
        });
      }
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const [r, g, b] = p.hue === 0 ? [100, 255, 218] : [199, 146, 234];

        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.3})`);
        glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = glow;
        ctx.fillRect(p.x - p.r * 4, p.y - p.r * 4, p.r * 8, p.r * 8);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.85 }}
    />
  );
}

// --- Main Hero ---

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [mobileCodeOpen, setMobileCodeOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92]);
  const leftY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const rightY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const marqueeY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  useEffect(() => {
    const current = roles[roleIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayed === current) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayed === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    } else if (isDeleting) {
      timeout = setTimeout(() => setDisplayed((prev) => prev.slice(0, -1)), 30);
    } else {
      timeout = setTimeout(
        () => setDisplayed(current.slice(0, displayed.length + 1)),
        60
      );
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, roleIndex]);

  useEffect(() => {
    const onPointer = (x: number, y: number) => {
      const el = glowRef.current;
      if (!el) return;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      el.style.left = `${x - rect.left}px`;
      el.style.top = `${y - rect.top}px`;
      el.style.opacity = "1";
    };

    const onMouse = (e: MouseEvent) => onPointer(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onPointer(t.clientX, t.clientY);
    };
    const onLeave = () => {
      const el = glowRef.current;
      if (el) el.style.opacity = "0";
    };

    const section = sectionRef.current;
    if (!section) return;

    section.addEventListener("mousemove", onMouse);
    section.addEventListener("touchmove", onTouch, { passive: true });
    section.addEventListener("mouseleave", onLeave);
    section.addEventListener("touchend", onLeave);

    return () => {
      section.removeEventListener("mousemove", onMouse);
      section.removeEventListener("touchmove", onTouch);
      section.removeEventListener("mouseleave", onLeave);
      section.removeEventListener("touchend", onLeave);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] flex items-center px-4 sm:px-6">
      <div className="absolute inset-0 overflow-hidden">
        <HelixCanvas />
      </div>
      <div className="absolute inset-0 overflow-hidden">
        <HeroParticles />
      </div>
      <div
        ref={glowRef}
        aria-hidden="true"
        className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "min(600px, 80vw)",
          height: "min(600px, 80vw)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(100,255,218,0.1) 0%, rgba(199,146,234,0.05) 40%, transparent 70%)",
          opacity: 0,
          transition: "opacity 0.4s ease",
          zIndex: 1,
        }}
      />

      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="max-w-7xl mx-auto w-full relative z-10 py-20 sm:py-0"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-16 items-center">

          {/* Left: Identity — centered on mobile, left-aligned on desktop */}
          <motion.div style={{ y: leftY }} className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
              className="font-mono text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-6 sm:mb-8"
              style={{ color: "var(--accent)" }}
            >
              <span className="opacity-50">&gt;_</span> portfolio.render()
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease }}
              className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-2"
            >
              <span className="text-white">Ang </span>
              <span className="gradient-shimmer">Jin Wei</span>
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 1.0, ease }}
              className="origin-left lg:origin-left origin-center mx-auto lg:mx-0 mb-5 sm:mb-6"
              style={{
                height: "2px",
                width: "120px",
                background: "linear-gradient(90deg, var(--accent), var(--purple), transparent)",
                boxShadow: "0 0 12px rgba(100, 255, 218, 0.4)",
              }}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="h-8 sm:h-10 flex items-start justify-center lg:justify-start mb-5 sm:mb-8"
            >
              <span
                className="font-mono text-base sm:text-xl md:text-2xl"
                style={{ color: "var(--text-secondary)" }}
              >
                {displayed}
                <span className="animate-blink" style={{ color: "var(--accent)" }}>|</span>
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4, ease }}
              className="text-sm sm:text-base md:text-lg max-w-lg mx-auto lg:mx-0 mb-8 sm:mb-10 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              I build scalable data systems, AI pipelines, and software that power intelligent applications.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6, ease }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <MagneticButton
                href="#projects"
                className="group relative px-8 sm:px-10 py-3.5 sm:py-4 text-sm font-medium tracking-wide uppercase overflow-hidden text-center"
                style={{ color: "var(--bg)", background: "var(--accent)" }}
              >
                <span className="relative z-10">View Projects</span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </MagneticButton>
              <MagneticButton
                href="#contact"
                className="px-8 sm:px-10 py-3.5 sm:py-4 text-sm font-medium tracking-wide uppercase border transition-colors duration-300 text-center"
                style={{
                  color: "var(--text-secondary)",
                  borderColor: "var(--border-color)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-color)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                Get in Touch
              </MagneticButton>

              {/* Mobile code editor toggle */}
              <button
                onClick={() => setMobileCodeOpen(true)}
                className="lg:hidden px-6 py-3.5 text-sm font-mono tracking-wide uppercase border transition-colors duration-300 text-center"
                style={{
                  color: "var(--accent)",
                  borderColor: "rgba(100, 255, 218, 0.3)",
                }}
              >
                &gt;_ View Code
              </button>
            </motion.div>
          </motion.div>

          {/* Right: Live Code Editor — desktop only */}
          <motion.div
            style={{ y: rightY }}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease }}
            className="hidden lg:block"
          >
            <LiveCodeEditor />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          style={{ y: marqueeY }}
          className="mt-12 sm:mt-20 overflow-hidden"
        >
          <div className="marquee-track">
            <div className="marquee-content">
              {[...techStack, ...techStack].map((t, i) => (
                <span
                  key={i}
                  className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.25em] mx-3 sm:mx-6 whitespace-nowrap"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span
          className="font-mono text-[9px] uppercase tracking-[0.2em] sm:hidden"
          style={{ color: "var(--text-muted)" }}
        >
          scroll
        </span>
        <a href="#about" className="animate-float block">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300"
            style={{ color: "var(--text-muted)" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </a>
      </motion.div>

      {/* Mobile code editor overlay — portaled to body to escape SmoothScroll transforms */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {mobileCodeOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-end justify-center lg:hidden"
              style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
              onClick={() => setMobileCodeOpen(false)}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-h-[85vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center px-4 py-3" style={{ background: "var(--bg)" }}>
                  <span className="font-mono text-xs" style={{ color: "var(--accent)" }}>&gt;_ Code &amp; Terminal</span>
                  <button
                    onClick={() => setMobileCodeOpen(false)}
                    className="text-sm px-3 py-1 font-mono"
                    style={{ color: "var(--text-muted)" }}
                  >
                    close
                  </button>
                </div>
                <LiveCodeEditor />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
