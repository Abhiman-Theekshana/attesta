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

## Troubleshooting

**`Failed to load PostCSS config ... Invalid PostCSS Plugin found`**

Older copies of this project could pick up a `postcss.config.*` file from a *parent* folder (for example a Tailwind config next to the project). `vite.config.js` now pins an empty inline PostCSS config so Vite never searches outside the project. If you still see this, update to the latest `main`.

**Port already in use**

The dev server uses port `4321` but will fall back to the next free port. Check the URL Vite prints. To force a different port: `npm run dev -- --port 5173`.

**Blank page after opening `dist/index.html` directly**

The build uses relative paths, but some browsers block ES modules loaded from `file://`. Use `npm run preview` (or any static server) instead of opening the file directly.

## License

Private project — all rights reserved.