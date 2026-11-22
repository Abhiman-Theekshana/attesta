# Attesta

Fingerprint attendance that can't be faked or shared — plus a catch-up tutor for the classes students miss. This repository is the marketing site: a single-page, scroll-driven experience built with Vite and vanilla JavaScript.

## Tech stack

- [Vite 7](https://vite.dev/) — dev server and build
- Vanilla ES modules (no framework)
- [GSAP](https://gsap.com/) + ScrollTrigger and [Lenis](https://lenis.darkroom.engineering/) — scroll animations and smooth scrolling
- [Three.js](https://threejs.org/) + `postprocessing` — 3D fingerprint / morph scene
- Plain CSS with design tokens (`styles/tokens.css`)

## Requirements

- **Node.js 20.19+** (or 22.12+) — required by Vite 7
- **npm** (comes with Node)

## Run locally

```bash
git clone https://github.com/Abhiman-Theekshana/attesta.git
cd attesta
npm install
npm run dev
```

Then open **http://localhost:4321** in your browser.

The dev server port is set in `vite.config.js` (`server.port`). If that port is taken, Vite will pick the next free one and print the URL.

## Build for production

```bash
npm run build
```

The static site is written to `dist/`.

To preview the production build locally:

```bash
npm run preview
```

## Deploy on Vercel

1. Push the repo to GitHub.
2. In [Vercel](https://vercel.com), choose **Add New → Project** and import the repo.
3. Use these settings (Vercel usually detects them automatically):

   | Setting | Value |
   | --- | --- |
   | Framework preset | Vite |
   | Build command | `npm run build` |
   | Output directory | `dist` |
   | Install command | `npm install` |

No environment variables are required.

## Project structure

```text
.
├── index.html            # The whole page markup
├── public/
│   └── team/             # Team photos, copied as-is into the build
├── src/
│   ├── main.js           # Entry point — imports CSS and boots every section
│   ├── core/             # Shared utilities (audio, cursor, preloader, theme, …)
│   ├── scenes/           # Three.js scenes (hero, morph)
│   └── sections/         # Per-section behaviour (problem, team, finale, …)
├── styles/
│   ├── tokens.css        # Colors, type, spacing variables
│   ├── base.css          # Reset, layout, shared components
│   ├── sections.css      # Section-specific styles
│   ├── solution.css
│   └── story.css
└── vite.config.js
```

## Notes

- Static assets live in `public/` and are referenced from the page by path (for example `./team/member-1.png`). Vite copies the folder into `dist/` untouched.
- `dist/` and `node_modules/` are git-ignored; Vercel builds them during deploy.
- Prefers-reduced-motion is respected by the scroll and pointer animations.

## License

Private project — all rights reserved.