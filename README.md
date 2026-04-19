# Ang Jin Wei — Portfolio

Interactive portfolio site for a Data Engineer & AI Systems Builder.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion

## Features

- **Terminal Mode** — Interactive CLI overlay with commands: `help`, `projects`, `skills`, `contact`, `neofetch`
- **Pipeline Architecture Explorer** — Visual flow diagrams for each project with clickable nodes
- **System Thinking Cards** — Interactive cards showing design principles
- **Code Snippet Viewer** — Syntax-highlighted code samples (Python, Cypher, HCL)
- **Animated Background** — Canvas-based particle system with connections
- **Glassmorphism UI** — Dark theme with neon accents

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

```bash
npm i -g vercel
vercel
```

Or connect the GitHub repo to [vercel.com](https://vercel.com) for automatic deployments.

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Theme, animations, utility classes
│   ├── layout.tsx        # Root layout with metadata
│   └── page.tsx          # Main page assembling all sections
├── components/
│   ├── AnimatedBackground.tsx  # Canvas particle system
│   ├── Navbar.tsx              # Fixed nav with terminal toggle
│   ├── Terminal.tsx            # Interactive CLI overlay
│   ├── Hero.tsx                # Animated hero with typewriter
│   ├── About.tsx               # About section
│   ├── Experience.tsx          # Timeline with expandable details
│   ├── Projects.tsx            # Project cards with pipeline flows
│   ├── PipelineFlow.tsx        # Visual pipeline architecture
│   ├── SystemThinking.tsx      # Design philosophy cards
│   ├── CodeViewer.tsx          # Tabbed code snippet viewer
│   ├── Skills.tsx              # Categorized skill badges
│   ├── Contact.tsx             # Contact section
│   └── Footer.tsx              # Footer
└── data/
    └── portfolio.ts            # All portfolio content/data
```
