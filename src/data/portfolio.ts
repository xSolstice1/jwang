export const profile = {
  name: "Ang Jin Wei",
  title: "Data Engineer | AI Systems Builder | Aspiring Software Engineer",
  location: "Singapore",
  email: "xsolsticegfx@gmail.com",
  linkedin: "https://linkedin.com/in/angjw",
  github: "https://github.com/xSolstice1",
  tagline: "I build scalable data systems, AI pipelines, and software that power intelligent applications.",
  about: [
    "I design and build the infrastructure behind AI-driven products — from knowledge graphs to retrieval-augmented generation pipelines to cloud-native data platforms.",
    "My work sits at the intersection of data engineering and applied AI: I care about how data flows through systems, how it's modeled for retrieval, and how it serves downstream intelligence layers.",
    "I think in systems. Every pipeline I build considers failure modes, scale characteristics, and operational cost from day one.",
  ],
};

export interface Project {
  id: string;
  title: string;
  company: string;
  problem: string;
  architecture: string;
  impact: string[];
  techStack: string[];
  pipeline: PipelineNode[];
  screenshots?: string[];
}

export interface PipelineNode {
  id: string;
  label: string;
  type: "source" | "process" | "storage" | "api" | "output";
  details: string;
}

export const projects: Project[] = [
  {
    id: "flapworld",
    title: "FlapWorld",
    company: "Personal Project",
    problem:
      "Wanted to build a full-stack game from scratch — a virtual pet collection and idle game with real-time multiplayer, economy systems, and cross-platform support.",
    architecture:
      "Next.js 16 frontend with React 19, Firebase for auth and real-time Firestore sync, Zustand for client state management, canvas-based bird rendering pipeline, and Electron for desktop builds. Modular architecture with separate game modules for each minigame.",
    impact: [
      "Built end-to-end: auth, real-time data sync, game economy, PvP, leaderboards",
      "Canvas rendering pipeline for dynamic bird customization (paintbrushes, auras, accessories)",
      "Cross-platform: web (Vercel) + desktop (Electron with NSIS installer)",
      "Designed progression systems: battle pass, daily logins, explorable zones, missions",
    ],
    techStack: [
      "Next.js",
      "React",
      "TypeScript",
      "Firebase",
      "Zustand",
      "Tailwind CSS",
      "Electron",
      "Canvas API",
    ],
    screenshots: [
      "/jwang/screenshots/flapworld-1.png",
      "/jwang/screenshots/flapworld-2.png",
      "/jwang/screenshots/flapworld-3.png",
    ],
    pipeline: [
      {
        id: "client",
        label: "Next.js Client",
        type: "source",
        details: "React 19 frontend with modular game views and Tailwind UI",
      },
      {
        id: "state",
        label: "Zustand Stores",
        type: "process",
        details: "Client state for player data, inventory, battles, auras — synced with Firestore listeners",
      },
      {
        id: "firebase",
        label: "Firebase",
        type: "storage",
        details: "Auth + Firestore for real-time data persistence and user management",
      },
      {
        id: "renderer",
        label: "Canvas Renderer",
        type: "process",
        details: "Layered bird rendering: base sprite, paintbrush effects, auras, accessories",
      },
      {
        id: "games",
        label: "Game Modules",
        type: "process",
        details: "Flap Dash, Seed Harvest, Explore Zones — each with stat-driven mechanics",
      },
      {
        id: "electron",
        label: "Electron Desktop",
        type: "output",
        details: "Cross-platform desktop app wrapping Next.js standalone build",
      },
    ],
  },
  {
    id: "graphrag",
    title: "Game Knowledge GraphRAG Service",
    company: "Razer AI Software BU",
    problem:
      "Razer's AI assistant needed structured game knowledge for context-aware responses, but unstructured data couldn't support precise retrieval at scale.",
    architecture:
      "Built an end-to-end GraphRAG system: ingestion pipelines extract and structure game data into Neo4j, a retrieval layer combines graph traversal with vector similarity, and a FastAPI service exposes it to downstream AI consumers.",
    impact: [
      "Enabled context-aware AI responses with structured game knowledge",
      "Reduced retrieval latency through graph-optimized query patterns",
      "Processed and structured data from multiple game data sources",
    ],
    techStack: [
      "Python",
      "Neo4j",
      "FastAPI",
      "AWS Bedrock",
      "Docker",
      "AWS",
    ],
    pipeline: [
      {
        id: "source",
        label: "Game Data Sources",
        type: "source",
        details: "Raw game data from multiple providers and APIs",
      },
      {
        id: "ingest",
        label: "Ingestion API",
        type: "api",
        details: "FastAPI endpoints for data intake with validation and deduplication",
      },
      {
        id: "process",
        label: "Processing Pipeline",
        type: "process",
        details:
          "Data resolution and labelling via AWS Bedrock LLMs, entity extraction, relationship mapping",
      },
      {
        id: "neo4j",
        label: "Neo4j Graph DB",
        type: "storage",
        details: "Knowledge graph storing entities, relationships, and vector embeddings",
      },
      {
        id: "retrieval",
        label: "GraphRAG Retrieval",
        type: "process",
        details: "Hybrid retrieval: graph traversal + vector similarity search",
      },
      {
        id: "api",
        label: "API Layer",
        type: "api",
        details: "FastAPI service exposing retrieval endpoints to AI consumers",
      },
    ],
  },
  {
    id: "aws-migration",
    title: "Cloud Pipeline Migration",
    company: "Razer AI Software BU",
    problem:
      "Local development pipelines couldn't scale for production workloads. Needed cloud-native infrastructure with reproducible deployments.",
    architecture:
      "Migrated all data and ML pipelines to AWS using Terraform for IaC. Containerized services with Docker/ECR, orchestrated batch jobs with AWS Batch, and centralized storage on S3/RDS.",
    impact: [
      "Achieved fully reproducible infrastructure deployments via Terraform",
      "Eliminated environment drift between dev and production",
      "Enabled horizontal scaling of batch processing jobs",
    ],
    techStack: [
      "AWS Batch",
      "S3",
      "RDS",
      "ECR",
      "Terraform",
      "Docker",
      "Python",
    ],
    pipeline: [
      {
        id: "code",
        label: "Application Code",
        type: "source",
        details: "Python services and pipeline code in Git",
      },
      {
        id: "docker",
        label: "Docker Build",
        type: "process",
        details: "Containerized builds pushed to ECR",
      },
      {
        id: "terraform",
        label: "Terraform IaC",
        type: "process",
        details: "Infrastructure definitions for all AWS resources",
      },
      {
        id: "batch",
        label: "AWS Batch",
        type: "process",
        details: "Orchestrated job execution with auto-scaling compute",
      },
      {
        id: "storage",
        label: "S3 + RDS",
        type: "storage",
        details: "Object storage for artifacts, PostgreSQL for structured data",
      },
      {
        id: "monitoring",
        label: "CloudWatch",
        type: "output",
        details: "Logging, metrics, and alerting for pipeline health",
      },
    ],
  },
  {
    id: "snowflake-platform",
    title: "Enterprise Data Platform",
    company: "Temasek",
    problem:
      "Temasek needed a reliable, governed data platform to consolidate analytics across investment portfolios with strict data quality requirements.",
    architecture:
      "Built a Snowflake-based data platform with automated ETL pipelines in Python + SQL. Implemented data quality checks, lineage tracking, and Tableau dashboards for portfolio analytics.",
    impact: [
      "Consolidated multiple data sources into a single governed platform",
      "Automated ETL reduced manual processing time significantly",
      "Delivered Tableau dashboards used by investment decision-makers",
    ],
    techStack: [
      "Snowflake",
      "Python",
      "SQL",
      "Tableau",
      "AWS Sagemaker",
      "Airflow",
    ],
    pipeline: [
      {
        id: "sources",
        label: "Portfolio Data",
        type: "source",
        details: "Investment data from multiple internal and external sources",
      },
      {
        id: "etl",
        label: "ETL Pipeline",
        type: "process",
        details: "Python + SQL transformations with data quality validation",
      },
      {
        id: "snowflake",
        label: "Snowflake DWH",
        type: "storage",
        details: "Centralized warehouse with role-based access and governance",
      },
      {
        id: "tableau",
        label: "Tableau Dashboards",
        type: "output",
        details: "Interactive dashboards for portfolio analytics and reporting",
      },
    ],
  },
  {
    id: "curriculum-organizer",
    title: "Curriculum Info Organizer",
    company: "University Project",
    problem:
      "End users without technical backgrounds needed to combine, filter, group, and manipulate data from CourseLoop reports without advanced Excel or Power Query skills.",
    architecture:
      "Built a C# .NET desktop application that imports CSV/Excel files from CourseLoop and provides an intuitive interface for data manipulation — filtering, grouping, and different join operations — to create unified datasets.",
    impact: [
      "Eliminated need for advanced Excel/Power Query skills for data consolidation",
      "Supported multiple data operations: filtering, grouping, and various join types",
      "Enabled non-technical users to efficiently manipulate CourseLoop report data",
    ],
    techStack: ["C#", ".NET", "SQL"],
    screenshots: ["/jwang/screenshots/curriculum.jpg"],
    pipeline: [
      {
        id: "input",
        label: "CSV/Excel Import",
        type: "source",
        details: "CourseLoop reports and other common data sources",
      },
      {
        id: "parse",
        label: "Data Parser",
        type: "process",
        details: "File parsing and schema detection for CSV and Excel formats",
      },
      {
        id: "transform",
        label: "Transform Engine",
        type: "process",
        details: "Filtering, grouping, and join operations on imported datasets",
      },
      {
        id: "output",
        label: "Unified Dataset",
        type: "output",
        details: "Consolidated data export for downstream use",
      },
    ],
  },
  {
    id: "leetcode-diary",
    title: "Leetcode Diary",
    company: "Personal Project",
    problem:
      "Needed a dedicated tool to track LeetCode problem-solving progress, organize problems by tags and difficulty, and keep notes and solutions in one place.",
    architecture:
      "Full-stack app with a React + TypeScript frontend using Chakra UI, backed by a Go API server with MongoDB for persistence. Supports tagging, difficulty filtering, and solution notes.",
    impact: [
      "Built full-stack app with Go backend and React frontend",
      "Organized problems by tags, difficulty, and custom notes",
      "Deployed live on Vercel with persistent MongoDB storage",
    ],
    techStack: ["Go", "TypeScript", "React", "Chakra UI", "MongoDB"],
    screenshots: ["/jwang/screenshots/lcdiary.png"],
    pipeline: [
      {
        id: "frontend",
        label: "React + Chakra UI",
        type: "source",
        details: "TypeScript frontend with problem tracking interface",
      },
      {
        id: "api",
        label: "Go API Server",
        type: "api",
        details: "RESTful API for CRUD operations on problems and solutions",
      },
      {
        id: "db",
        label: "MongoDB",
        type: "storage",
        details: "Document store for problems, tags, notes, and solutions",
      },
    ],
  },
];

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  techStack: string[];
}

export const experiences: Experience[] = [
  {
    company: "Razer Inc.",
    role: "Associate Data Engineer (AI)",
    period: "Jan 2026 — Present",
    location: "Singapore",
    description: "AI Software Business Unit — Building knowledge graph services and AI infrastructure",
    highlights: [
      "Built a Game Knowledge Service using Neo4j to power GraphRAG and AI-driven knowledge retrieval",
      "Developed a self-service web app for users to upload documents into the ingestion pipeline",
      "Designed FastAPI services for data querying, visualization, and triggering batch jobs",
      "Migrated pipelines to AWS using Docker and ECR",
      "Orchestrated pipelines with AWS Batch, S3, and RDS",
      "Provisioned infrastructure using Terraform (IaC)",
    ],
    techStack: ["Python", "Neo4j", "FastAPI", "AWS Bedrock", "AWS Batch", "Terraform", "Docker"],
  },
  {
    company: "Temasek",
    role: "Data Engineer",
    period: "Jun 2024 — Jan 2026",
    location: "Singapore",
    description: "",
    highlights: [
      "Designed and implemented scalable data layers in Snowflake, integrating diverse business applications and improving data retrieval times by 75%",
      "Automated ETL workflows using SQL and Python, streamlining extraction, transformation, and loading while reducing manual handling by 80%",
      "Built and maintained Tableau dashboards to visualize KPIs across 5+ departments, driving faster and more accurate business decisions",
      "Monitored and optimized Snowflake database performance, ensuring 99.9% uptime and applying best practices for scalability and reliability",
      "Conducted data quality assessments and implemented validation checks with SQL/Python, significantly improving data accuracy and strengthening governance",
      "Led data initiatives for a leading investment holding company, enhancing reporting processes and enabling advanced analytics capabilities",
    ],
    techStack: ["Snowflake", "Python", "SQL", "Tableau"],
  },
  {
    company: "Association of Information Security Professionals",
    role: "Web Developer",
    period: "Nov 2018 — May 2019",
    location: "Singapore",
    description: "",
    highlights: [
      "Developed a new company website from scratch using vanilla HTML, CSS, and JavaScript",
      "Implemented 10+ new features and design improvements based on stakeholder requirements",
      "Optimized site performance and responsiveness, reducing page load times by 40%",
      "Mentored and trained 3+ interns, accelerating onboarding and improving team productivity",
      "Collaborated with cross-functional teams (design, content, IT) to align website functionality with business goals",
    ],
    techStack: ["HTML", "CSS", "JavaScript"],
  },
];

export interface Skill {
  name: string;
  proficiency: "core" | "proficient" | "familiar";
}

export interface SkillCategory {
  name: string;
  color: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages & Frameworks",
    color: "neon-blue",
    skills: [
      { name: "Python", proficiency: "core" },
      { name: "TypeScript", proficiency: "core" },
      { name: "SQL", proficiency: "core" },
      { name: "Go", proficiency: "proficient" },
      { name: "C#", proficiency: "proficient" },
      { name: "C++", proficiency: "familiar" },
      { name: "Java", proficiency: "familiar" },
      { name: "JavaScript", proficiency: "core" },
    ],
  },
  {
    name: "Data & AI",
    color: "neon-purple",
    skills: [
      { name: "Neo4j", proficiency: "core" },
      { name: "Snowflake", proficiency: "core" },
      { name: "MongoDB", proficiency: "proficient" },
      { name: "GraphRAG", proficiency: "core" },
      { name: "AWS Bedrock", proficiency: "proficient" },
      { name: "dbt", proficiency: "proficient" },
      { name: "Vector Search", proficiency: "proficient" },
    ],
  },
  {
    name: "Frontend & Web",
    color: "neon-green",
    skills: [
      { name: "React", proficiency: "core" },
      { name: "Next.js", proficiency: "core" },
      { name: "Tailwind CSS", proficiency: "core" },
      { name: "Chakra UI", proficiency: "proficient" },
      { name: "FastAPI", proficiency: "core" },
      { name: ".NET", proficiency: "proficient" },
      { name: "Electron", proficiency: "familiar" },
    ],
  },
  {
    name: "Cloud & Infra",
    color: "neon-purple",
    skills: [
      { name: "AWS", proficiency: "core" },
      { name: "Terraform", proficiency: "core" },
      { name: "Docker", proficiency: "core" },
      { name: "ECR", proficiency: "proficient" },
      { name: "S3", proficiency: "proficient" },
      { name: "RDS", proficiency: "proficient" },
      { name: "AWS Batch", proficiency: "proficient" },
      { name: "Firebase", proficiency: "proficient" },
    ],
  },
  {
    name: "Tools & Platforms",
    color: "neon-blue",
    skills: [
      { name: "Git", proficiency: "core" },
      { name: "Tableau", proficiency: "proficient" },
      { name: "Airflow", proficiency: "proficient" },
      { name: "Zustand", proficiency: "proficient" },
      { name: "Linux", proficiency: "proficient" },
      { name: "CI/CD", proficiency: "proficient" },
    ],
  },
];

export const systemThinking = [
  {
    title: "Scalability",
    icon: "scale",
    description:
      "Design for 10x the current load. Horizontal scaling, partitioning strategies, and async processing patterns.",
    principles: [
      "Stateless services for horizontal scaling",
      "Event-driven architecture for decoupling",
      "Batch processing for throughput-heavy workloads",
    ],
  },
  {
    title: "Reliability",
    icon: "shield",
    description:
      "Systems fail. The question is how gracefully. Circuit breakers, retries, and observability from day one.",
    principles: [
      "Retry with exponential backoff",
      "Health checks and circuit breakers",
      "Structured logging and distributed tracing",
    ],
  },
  {
    title: "Data Modeling",
    icon: "database",
    description:
      "The schema is the system. Graph models for relationships, columnar stores for analytics, vector indexes for semantic search.",
    principles: [
      "Choose storage by access pattern, not familiarity",
      "Graph for relationships, columnar for aggregation",
      "Schema evolution without downtime",
    ],
  },
  {
    title: "AI Pipelines",
    icon: "brain",
    description:
      "Production AI is 90% engineering. Embedding pipelines, retrieval optimization, and context window management.",
    principles: [
      "Separate ingestion from retrieval",
      "Cache embeddings aggressively",
      "Evaluate retrieval quality systematically",
    ],
  },
];

export const terminalCommands: Record<string, string[]> = {
  help: [
    "Available commands:",
    "  about       — Who I am",
    "  skills      — Technical skills",
    "  projects    — Project showcase",
    "  experience  — Work history",
    "  contact     — Get in touch",
    "  clear       — Clear terminal",
    "  neofetch    — System info",
  ],
  about: [
    "┌─────────────────────────────────────┐",
    "│  Ang Jin Wei                        │",
    "│  Data Engineer | AI Systems Builder │",
    "│  Singapore                          │",
    "└─────────────────────────────────────┘",
    "",
    "I build scalable data systems, AI pipelines,",
    "and software that power intelligent applications.",
    "",
    "Currently building GraphRAG services and",
    "cloud-native data infrastructure at Razer.",
  ],
  skills: [
    "Languages:    Python · TypeScript · SQL · React · Next.js",
    "Data & AI:    Neo4j · Snowflake · GraphRAG · AWS Bedrock",
    "Cloud:        AWS (Batch, S3, RDS, ECR, Bedrock) · Terraform · Docker",
    "Tools:        FastAPI · dbt · Tableau · Git · Firebase · Electron",
  ],
  projects: [
    "1. Game Knowledge GraphRAG Service    [Razer]",
    "   → Neo4j + FastAPI + AWS Bedrock + AWS",
    "",
    "2. Cloud Pipeline Migration            [Razer]",
    "   → AWS Batch + Terraform + Docker + ECR",
    "",
    "3. Enterprise Data Platform            [Temasek]",
    "   → Snowflake + Python + dbt + Tableau",
    "",
    "4. FlapWorld                           [Personal]",
    "   → Next.js + Firebase + Zustand + Electron",
    "",
    "5. Curriculum Info Organizer           [University]",
    "   → C# + .NET + SQL",
    "",
    "6. Leetcode Diary                      [Personal]",
    "   → Go + React + MongoDB",
    "",
    "Type 'scroll down' or click Projects in nav for details.",
  ],
  experience: [
    "Razer Inc.               | Jan 2026 — Present",
    "  Associate Data Engineer (AI)",
    "  → GraphRAG, Neo4j, AWS Bedrock, Terraform",
    "",
    "Temasek                  | Jun 2024 — Jan 2026",
    "  Data Engineer",
    "  → Snowflake, ETL, Tableau, Data Quality",
    "",
    "AISP                     | Nov 2018 — May 2019",
    "  Web Developer",
    "  → HTML, CSS, JavaScript",
  ],
  contact: [
    "Email:    xsolsticegfx@gmail.com",
    "LinkedIn: linkedin.com/in/angjw",
    "GitHub:   github.com/xSolstice1",
    "",
    "Open to opportunities in Data Engineering,",
    "AI Infrastructure, and Software Engineering.",
  ],
  neofetch: [
    "       ╔══════════════╗",
    "       ║  ANG JIN WEI ║",
    "       ╚══════════════╝",
    "  ┌──────────────────────────┐",
    "  │ OS:     Engineer v2.0    │",
    "  │ Host:   Singapore        │",
    "  │ Kernel: Data + AI        │",
    "  │ Shell:  Python/TS        │",
    "  │ DE:     Neo4j/Snowflake  │",
    "  │ Cloud:  AWS              │",
    "  │ IaC:    Terraform        │",
    "  │ Uptime: Building 24/7    │",
    "  └──────────────────────────┘",
  ],
};
