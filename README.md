# Ang Jin Wei — Portfolio

Cinematic interactive portfolio for a Data Engineer & AI Systems Builder. Dark, immersive aesthetic with scroll-driven animations, GPU effects, and mouse/touch reactive visuals.

**Live:** [xsolstice1.github.io/jwang](https://xsolstice1.github.io/jwang/)

## Tech Stack

- Next.js 16 (App Router, Static Export)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Lenis (Smooth Scroll)
- Canvas 2D / WebGL

## Features

### Visual Effects
- **Light Spears** — Particle system that bursts from cursor and homes back in. Touch support: tap ripples + drag trails
- **DNA Helix** — Full-viewport Canvas 2D double helix behind hero with scroll-driven rotation, mouse-reactive tilt, breathing animation, and depth-based rendering
- **Film Grain** — Canvas noise overlay with mix-blend-mode
- **Custom Cursor** — Dot + ring following mouse with hover state detection, deferred activation for static deploys
- **Mouse-Reactive Background** — Gradient mesh that follows cursor position

### Scroll Effects
- **Lenis Smooth Scroll** — Buttery lerp-based scrolling with tuned parameters
- **Velocity Skew** — Content tilts during fast scroll with spring physics
- **Scroll Progress Bar** — Thin accent line at top of viewport
- **Hero Parallax** — Multi-layer depth (name, tagline, CTA, marquee at different speeds), fades + scales on scroll-away
- **Word-by-Word Text Reveal** — About paragraphs reveal per-word based on scroll position
- **Stroke-to-Fill Headings** — Section titles animate from outlined to filled as they enter viewport
- **Clip-Path Section Reveals** — Bottom-to-top clip animations on scroll entry
- **Section Number Parallax** — Floating section numbers at different scroll rate than content

### Interactive
- **Terminal Mode** — CLI overlay with commands: `help`, `projects`, `skills`, `contact`, `neofetch`
- **Pipeline Architecture Explorer** — Visual flow diagrams with clickable nodes
- **System Thinking Cards** — Expandable design philosophy cards
- **Project Tabs** — Tabbed project showcase with lightbox screenshots

### Design
- **Loading Screen** — Terminal-style boot sequence with progress bar
- **Horizontal Marquee** — Tech stack infinite scroll ticker with gradient edge masks
- **Per-Character 3D Reveal** — Hero name letters flip in with rotateX stagger
- **Clip-Path Line Reveals** — Hero elements wipe in from bottom
- **Responsive** — Mobile-optimized with `100svh`, scaled typography, touch interactions

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

### GitHub Pages
```bash
npm run build
# Output in /out, deploy with GitHub Actions
```

### Vercel
```bash
npx vercel
```

## Project Structure

```
src/
├── app/
│   ├── globals.css           # Theme variables, cursor styles, marquee, lenis
│   ├── layout.tsx            # Root layout with metadata & fonts
│   └── page.tsx              # Main page orchestrating all sections
├── components/
│   ├── LightSpears.tsx       # Canvas particle system (mouse + touch)
│   ├── HelixCanvas.tsx       # DNA helix Canvas 2D renderer
│   ├── GrainOverlay.tsx      # Film grain noise canvas
│   ├── AnimatedBackground.tsx # Mouse-reactive gradient mesh
│   ├── CustomCursor.tsx      # Dot + ring cursor replacement
│   ├── SmoothScroll.tsx      # Lenis wrapper + progress bar + velocity skew
│   ├── LoadingScreen.tsx     # Terminal boot sequence
│   ├── SectionReveal.tsx     # Scroll-triggered reveal animations
│   ├── ScrollParallax.tsx    # Reusable parallax wrapper
│   ├── TextReveal.tsx        # Word-by-word scroll reveal
│   ├── StrokeText.tsx        # Stroke-to-fill heading animation
│   ├── ClipReveal.tsx        # Clip-path scroll reveal
│   ├── Hero.tsx              # Hero with char reveal, parallax, marquee
│   ├── Navbar.tsx            # Fixed nav with terminal toggle
│   ├── Terminal.tsx          # Interactive CLI overlay
│   ├── About.tsx             # About with text reveal + code card
│   ├── Experience.tsx        # Timeline with expandable details
│   ├── Projects.tsx          # Tabbed projects with lightbox
│   ├── PipelineFlow.tsx      # Visual pipeline architecture
│   ├── SystemThinking.tsx    # Design philosophy cards
│   ├── Education.tsx         # Education with expandable achievements
│   ├── Skills.tsx            # Categorized skill badges
│   ├── Contact.tsx           # Contact section with code card
│   └── Footer.tsx            # Footer
└── data/
    └── portfolio.ts          # All portfolio content/data
```
